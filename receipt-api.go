package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"io"
	"log"
	"net/http"
	"receipt_api/receiptstructs"
)

// key: receipt id, value: receipt score
var inMemoryReceipts = make(map[string]int)

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

	var r receiptstructs.Receipt
	json.Unmarshal(rawReceipt, &r)
	err = receiptstructs.IsReceiptPostDataValid(r)
	if err != nil {
		log.Printf("[ postReceipt: receipt json is missing field \"%s\" ]\n", err)
		res.Header().Set("x-missing-field", err.Error())
		res.WriteHeader(http.StatusBadRequest)
	}

	receiptPoints, err := receiptstructs.PoolReceiptPoints(r)
	if err != nil {
		log.Printf("[ postReceipt: error collecting pooled receipt points \"%s\" ]\n", err)
		res.Header().Set("x-date-time-parse-error", err.Error())
		res.WriteHeader(http.StatusBadRequest)
	}

	// store the points for this receipt along with the id of the receipt in memory
	inMemoryReceipts[receiptId] = receiptPoints
	response := receiptstructs.PostResponse{
		Id: receiptId,
	}

	data, err := json.Marshal(response)
	if err != nil {
		log.Printf("[ postReceipt: error marsheling response data \"%s\" ]\n", err)
		res.Header().Set("x-json-parse-error", err.Error())
		res.WriteHeader(http.StatusBadRequest)
	}

	res.WriteHeader(http.StatusOK)
	res.Write(data)
	log.Println("[ postReceipt: successfully created and stored receipt, returning receipt id ]")
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

	response := receiptstructs.GetResponse{Points: fmt.Sprint(receiptPointsById)}
	data, err := json.Marshal(response)
	if err != nil {
		log.Printf("[ getReceiptPoints: error marsheling receipt points with id \"%s\" ]\n", err)
		res.Header().Set("x-json-parse-error", err.Error())
		res.WriteHeader(http.StatusBadRequest)
		return
	}

	res.WriteHeader(http.StatusOK)
	res.Write(data)
	log.Println("[ getReceiptPoints: successfully fetched receipt, returning receipt points ]")
}

func main() {
	r := mux.NewRouter()

	// POST endpoint
	r.HandleFunc("/receipts/process", postReceipt)

	// GET endpoint
	r.HandleFunc("/receipts/{id}/points", getReceiptPoints)

	err := http.ListenAndServe(":3000", r)
	if errors.Is(err, http.ErrServerClosed) {
		log.Printf("[ main: server has be closed ]\n")
	} else if err != nil {
		log.Printf("[ main: error listening on server: %s ]\n", err)
	}
}
