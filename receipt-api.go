package receipt_api

import (
	// "errors"
	"fmt"
	"io"
	"net/http"
	// "os"
)

func getRoot(w http.ResponseWriter, r http.Request) {
	fmt.Printf("/got / request\n")
	io.WriteString(w, "This is my website!\n")
}

func getHello(w http.ResponseWriter, r *http.Request) {
	fmt.Printf("god /hello request\n")
	io.WriteString(w, "Hello, HTTP!\n")
}


