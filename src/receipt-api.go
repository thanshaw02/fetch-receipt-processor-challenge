package main

import (
	// "context"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/gorilla/mux"
	"io"
	"math"
	// "net"
	"net/http"
	"reflect"
	"strconv"
	"strings"

	"github.com/google/uuid"
)

const keyServerAddr = "fetch-receipt-server-address"

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

// calculates the total points for the given receipt
func poolReceiptPoints(receipt Receipt) int {
	totalPoints := len(receipt.Retailer)

	if strings.Contains(receipt.Total, ".") {
		totalPoints += 50
	}

	vertedTotal, _ := strconv.ParseFloat(receipt.Total, 64)
	if math.Mod(vertedTotal, 0.25) == 0 {
		totalPoints += 25
	}

	totalPoints += 5 * (len(receipt.Items) / 2)

	// If the trimmed length of the item description is a multiple of 3, multiply the price by 0.2 and round up to the nearest integer. The result is the number of points earned.

	foo := string(receipt.PurchaseDate[len(receipt.PurchaseDate) - 2:])
	purchaseDay, _ := strconv.Atoi(foo)
	fmt.Println("\nExtracted purchase day:", purchaseDay) // debugging
	if purchaseDay % 2 != 0 {
		totalPoints += 6
	}

	// 10 points if the time of purchase is after 2:00pm and before 4:00pm.

	return totalPoints
}

/*************************************************************
 ************************  Endpoints  ************************
 *************************************************************/

// processes a receipt JSON object that's passed to this endpoint via POST
// returns JSON object with id of receipt --> { id: "RECEIPT_ID" }
func postReceipt(res http.ResponseWriter, req *http.Request) {
	receiptId := uuid.New().String()

	rawReceipt, err := io.ReadAll(req.Body)
	if err != nil {
		fmt.Printf("could not read request body: %s\n", err)
		// need to come up with a better/more desctriptive response here
		res.WriteHeader(http.StatusBadRequest)
	}

	var r Receipt
	json.Unmarshal(rawReceipt, &r)
	checkValidity := isReceiptPostDataValid(r)

	if checkValidity.IsValid {
		// start to parse the JSON body and add up points
		// at the end I need to add a new entry to the "inMemoryReceipts" map using the id generated aboce and the points generated here
		fmt.Println("\nThis IS valid data")
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
		res.Header().Set("x-missing-field", checkValidity.InvalidReason)
		res.WriteHeader(http.StatusBadRequest)
	}
}

// get's a stored receipt object using the receipt id passed to this endpoint via GET
// returns an object that has the points for the fetched receipt --> { points: RECEIPT_POINTS_AS_INTEGER }
func getReceiptPoints(res http.ResponseWriter, req *http.Request) {
	pathVars := mux.Vars(req)
	id, ok := pathVars["id"]
	if !ok {
		// need to come up with a better/more desctriptive response here
		// actually, I think this means that "id" was not found in the path, which is bad, but then this path wouldn't be hit, right?
		res.WriteHeader(http.StatusBadRequest)
		return
	}

	receiptPointsById := fmt.Sprint(inMemoryReceipts[id])

	response := GetResponse{
		Points: receiptPointsById,
	}
	data, err := json.Marshal(response)
	if err != nil {
		fmt.Printf("Error JSONifying receipt points by id: %s", err)
		res.WriteHeader(http.StatusBadRequest)
		return
	}

	res.WriteHeader(http.StatusOK)
	res.Write(data)
}

func main() {
	// mux := http.NewServeMux()
	r := mux.NewRouter()

	// POST endpoint
	r.HandleFunc("/fetch-api/receipts/process", postReceipt)

	// GET endpoint
	r.HandleFunc("/fetch-api/receipts/{id}/points", getReceiptPoints)
	
	err := http.ListenAndServe("localhost:3000", r)
	if errors.Is(err, http.ErrServerClosed) {
		fmt.Printf("server has be closed\n")
	} else if err != nil {
		fmt.Printf("error listening for server: %s", err)
	}
}