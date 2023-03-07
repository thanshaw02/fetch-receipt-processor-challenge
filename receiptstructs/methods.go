package receiptstructs

import (
	"errors"
	"fmt"
	"log"
	"math"
	"reflect"
	"strconv"
	"strings"
	"time"
	"unicode"
)

// checks if the receipt JSON data sent via POST is valid and isn't missing any required fields
func IsReceiptPostDataValid(receipt Receipt) error {
	receiptValues := reflect.ValueOf(receipt)
	types := receiptValues.Type()
	for i := 0; i < receiptValues.NumField(); i++ {
		attrValue := fmt.Sprintf("%v", receiptValues.Field(i))
		if len(attrValue) == 0 && (types.Field(i).Name != "Id" && types.Field(i).Name != "Points") {
			// this attribute is not present, not valid
			return errors.New(types.Field(i).Name)
		}
	}
	return nil
}

func CountAlphanumericCharacters(str string) int {
	var count int
	for _, char := range str {
		if unicode.IsLetter(char) {
			count += 1
		}
	}
	return count
}

func CountItemDescriptionLength(items []Item) int {
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
func PoolReceiptPoints(receipt Receipt) (int, error) {
	// One point for every alphanumeric character in the retailer name.
	totalPoints := CountAlphanumericCharacters(receipt.Retailer)

	// 50 points if the total is a round dollar amount with no cents.
	centsOfTotal := string(receipt.Total[len(receipt.Total)-2:])
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
	totalPoints += CountItemDescriptionLength(receipt.Items)

	// 6 points if the day in the purchase date is odd.
	purchaseDate, err := time.Parse("2006-01-02", receipt.PurchaseDate)
	if err != nil {
		log.Printf("[ poolReceiptPoints: error parsing receipt purchase date \"%s\": %s ]\n", receipt.PurchaseDate, err)
		return -1, errors.New("invalid purchase date given")
	}
	_purchaseDay := purchaseDate.Day()
	if _purchaseDay%2 != 0 {
		totalPoints += 6
	}

	// 10 points if the time of purchase is after 2:00pm and before 4:00pm.
	_purchaseTime, err := time.Parse("04:05", receipt.PurchaseTime)
	if err != nil {
		log.Printf("[ poolReceiptPoints: error parsing receipt purchase time \"%s\": %s ]\n", receipt.PurchaseTime, err)
		return -1, errors.New("invalid purchase time given")
	}

	// this is a little hacky, couldn't quite get the 24-hour time format I needed
	// so instead the "minute" represents the hour here and the "second" represents the minute here
	purchaseTimeHour := _purchaseTime.Minute()
	if purchaseTimeHour >= 14 && purchaseTimeHour <= 16 {
		totalPoints += 10
	}

	return totalPoints, nil
}
