package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"math"
	"net/http"
	"reflect"
	"strconv"
	"strings"
	"time"
	"unicode"
	"github.com/google/uuid"
	"github.com/gorilla/mux"
)

// key: receipt id, value: receipt score
var inMemoryReceipts = make(map[string]int)

/*************************************************************
 **************************  Models  *************************
 *************************************************************/

type Item struct {
	ShortDescription string
	Price string
}

type Receipt struct {
	Retailer string
	PurchaseDate string
	PurchaseTime string
	Items []Item
	Total string
}

type IsValidReceiptType struct {
	IsValid bool
	InvalidReason string
}

type ReceiptError struct {
	ErrorType string
	ErrorMessage string
}

type PostResponse struct {
	Id string `json:"id"`
}

type GetResponse struct {
	Points string `json:"points"`
}

/*************************************************************
 *****************  Utility Methods  *************************
 *************************************************************/

// checks if the receipt JSON data sent via POST is valid and isn't missing any required fields
// NOTE: This is not fully implemented yet, need to add two more "point" logics and also make sure that the points are being added correctly
func isReceiptPostDataValid(receipt Receipt) IsValidReceiptType {
	var ret IsValidReceiptType
	receiptValues := reflect.ValueOf(receipt)
	types := receiptValues.Type()
	for i:= 0; i < receiptValues.NumField(); i++ {
		attrValue := fmt.Sprintf("%v", receiptValues.Field(i))
		if len(attrValue) == 0 {
			// this attribute is not preset, not valid
			ret.IsValid = false
			ret.InvalidReason = types.Field(i).Name
			return ret
		}
	}
	ret.IsValid = true
	return ret
}

func countAlphanumericCharacters(str string) int {
	var count int
	for _, char := range str {
		if unicode.IsLetter(char) {
			count += 1
		}
	}
	return count
}

func countItemDescriptionLength(items []Item) int {
	var count int
	for _, item := range items {
		trimmedItemName := strings.Trim(item.ShortDescription, " ")
		trimmedNameLength := len(trimmedItemName)
		if math.Mod(float64(trimmedNameLength), 3) == 0 {
			itemPrice, _ := strconv.ParseFloat(item.Price, 64)
			pointsEarned := int(math.Ceil(itemPrice * 0.2))
			count += pointsEarned
		}
	}
	return count
}

// calculates the total points for the given receipt
// return value of -1 means an error has occured
func poolReceiptPoints(receipt Receipt) int {
	// One point for every alphanumeric character in the retailer name.
	totalPoints := countAlphanumericCharacters(receipt.Retailer)

	// 50 points if the total is a round dollar amount with no cents.
	centsOfTotal := string(receipt.Total[len(receipt.Total) - 2:])
	if centsOfTotal == "00" {
		totalPoints += 50
	}

	// 25 points if the total is a multiple of 0.25
	vertedTotal, _ := strconv.ParseFloat(receipt.Total, 64)
	if math.Mod(vertedTotal, 0.25) == 0 {
		totalPoints += 25
	}

	// 5 points for every two items on the receipt.
	totalPoints += 5 * (len(receipt.Items) / 2)

	// If the trimmed length of the item description is a multiple of 3, multiply the price by 0.2 and round up to the nearest integer. The result is the number of points earned.
	totalPoints += countItemDescriptionLength(receipt.Items)

	// 6 points if the day in the purchase date is odd.
	purchaseDate, err := time.Parse("2006-01-02", receipt.PurchaseDate)
	if err != nil {
		log.Printf("[ poolReceiptPoints: error parsing receipt purchase date \"%s\": %s ]\n", receipt.PurchaseDate, err)
		return -1
	}
	_purchaseDay := purchaseDate.Day()
	if _purchaseDay % 2 != 0 {
		totalPoints += 6 
	}

	// 10 points if the time of purchase is after 2:00pm and before 4:00pm.
	_purchaseTime, err := time.Parse("04:05", receipt.PurchaseTime)
	if err != nil {
		log.Printf("[ poolReceiptPoints: error parsing receipt purchase time \"%s\": %s ]\n", receipt.PurchaseTime, err)
		return -1
	}

	// this is a little hacky, couldn't quite get the 24-hour time format I needed
	// so instead the "minute" represents the hour here and the "second" represents the minute here
	purchaseTimeHour := _purchaseTime.Minute()
	if purchaseTimeHour >= 14 && purchaseTimeHour <= 16 {
		totalPoints += 10
	}

	return totalPoints
}

/*************************************************************
 ************************  Endpoints  ************************
 *************************************************************/

// returns JSON object with id of receipt --> { id: "RECEIPT_ID" }
func postReceipt(res http.ResponseWriter, req *http.Request) {
	receiptId := uuid.New().String()

	rawReceipt, err := io.ReadAll(req.Body)
	if err != nil {
		log.Printf("[ postReceipt: error reading request body -- %s ]\n", err)
		res.Header().Set("x-request-body-error", err.Error())
		res.WriteHeader(http.StatusBadRequest)
		return
	}

	var r Receipt
	json.Unmarshal(rawReceipt, &r)
	checkValidity := isReceiptPostDataValid(r)

	if checkValidity.IsValid {
		receiptPoints := poolReceiptPoints(r)

		// store the points for this receipt along with the id of the receipt in memory
		inMemoryReceipts[receiptId] = receiptPoints
		response := PostResponse{
			Id: receiptId,
		}

		data, _ := json.Marshal(response)
		res.WriteHeader(http.StatusOK)
		res.Write(data)
	} else {
		log.Printf("[ postReceipt: receipt json is missing field \"%s\" ]\n", checkValidity.InvalidReason)
		res.Header().Set("x-missing-field", checkValidity.InvalidReason)
		res.WriteHeader(http.StatusBadRequest)
	}
}

// returns an object that has the points for the fetched receipt --> { points: "RECEIPT_POINTS" }
func getReceiptPoints(res http.ResponseWriter, req *http.Request) {
	pathVars := mux.Vars(req)
	id, ok := pathVars["id"]
	if !ok {
		// in theory this never should be hit i think
		log.Println("[ getReceiptPoints: error in GET path -- missing required receipt id ]")
		res.Header().Set("x-missing-filed", "\"id\" in path")
		res.WriteHeader(http.StatusBadRequest)
		return
	}
	
	receiptPointsById, ok := inMemoryReceipts[id]
	if !ok {
		log.Printf("[ getReceiptPoints: receipt does not exist in in-memory map with id \"%s\" ] \n", id)
		res.Header().Set("x-receipt-not-exist", id)
		res.WriteHeader(http.StatusBadRequest)
		return
	}

	response := GetResponse{ Points: fmt.Sprint(receiptPointsById) }
	data, err := json.Marshal(response)
	if err != nil {
		log.Printf("[ getReceiptPoints: error JSONifying receipt points with id \"%s\" ]\n", err)
		res.Header().Set("x-json-parse-error", err.Error())
		res.WriteHeader(http.StatusBadRequest)
		return
	}
	
	res.WriteHeader(http.StatusOK)
	res.Write(data)
}

func main() {
	r := mux.NewRouter()

	// POST endpoint
	r.HandleFunc("/fetch-api/receipts/process", postReceipt)

	// GET endpoint
	r.HandleFunc("/fetch-api/receipts/{id}/points", getReceiptPoints)
	
	err := http.ListenAndServe("localhost:3000", r)
	if errors.Is(err, http.ErrServerClosed) {
		log.Printf("[ main: server has be closed ]\n")
	} else if err != nil {
		log.Printf("[ main: error listening on server: %s ]\n", err)
	}
}