package main

import (
	"context"
	"errors"
	"fmt"
	// "io"
	"io/ioutil"
	"net"
	"net/http"
	// "os"
)
import "github.com/google/uuid"
// import "model/receipt"

const keyServerAddr = "fetch-receipt-server-address"

// key: receipt id
// value: receipt score
var inMemoryReceipts map[string]int

/*************************************************************
 *****************  Utility Methods  *************************
 *************************************************************/

// checks if the receipt JSON data sent via POST is valid and isn't missing any required fields
// ISSUE: need to figure out how to work with JSON in Go
func isReceiptPostDataValid(rawReceiptData []byte) bool {
	receiptData := string(rawReceiptData)
	fmt.Println("Receipt data from POST request:\n" + receiptData)

	// just returing true for now
	return true
}

// processes a receipt JSON object that's passed to this endpoint via POST
// returns JSON object with id of receipt --> { id: "RECEIPT_ID" }
func postReceipt(res http.ResponseWriter, req *http.Request) {
	receiptId := uuid.New()
	fmt.Printf("UUID generated: %s", receiptId) // keeping this just to qualm errors

	receipt, err := ioutil.ReadAll(req.Body)
	if err != nil {
		fmt.Printf("could not read request body: %s\n", err)
		// not sure what the actual header map would look like in this case
		res.WriteHeader(http.StatusBadRequest)
	}

	if isReceiptPostDataValid(receipt) {
		// start to parse the JSON body and add up points
		// at the end I need to add a new entry to the "inMemoryReceipts" map using the id generated aboce and the points generated here
	} else {
		// the JSON body was not valid for some reason
		// need to find that reason and set/write the corrosponding headers for that and reutnr it to the client
	}
}

// get's a stored receipt object using the receipt id passed to this endpoint via GET
// returns an object that has the points for the fetched receipt --> { points: RECEIPT_POINTS_AS_INTEGER }
func getReceiptPoints(write http.ResponseWriter, read *http.Request) {

}

func main() {
	mux := http.NewServeMux()

	// POST endpoint
	mux.HandleFunc("/fetch-api/receipts/process", postReceipt)

	// GET endpoint
	mux.HandleFunc("/fetch-api/receipts/:id/points", getReceiptPoints)
	
	ctx := context.Background()
	server := &http.Server {
		Addr: "127.0.0.1:3000",
		Handler: mux,
		BaseContext: func(l net.Listener) context.Context {
			ctx = context.WithValue(ctx, keyServerAddr, l.Addr().String())
			return ctx
		},
	}
	
	err := server.ListenAndServe()
	if errors.Is(err, http.ErrServerClosed) {
		fmt.Printf("server has be closed\n")
	} else if err != nil {
		fmt.Printf("error listening for server: %s", err)
	}
}