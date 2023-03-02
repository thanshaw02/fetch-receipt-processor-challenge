package main

import (
	"context"
	"errors"
	"fmt"
	"io"
	"io/ioutil"
	"net"
	"net/http"
	// "os"
)

/*
	NOTES:
	
	Query param extraction:
		- (*http.Request).Has("QUERY_STRING_HERE") --> returns a boolean if the query string is present
		- (*http.Request).Get("QUERY_STRING_HERE") --> returns a string using the query string name passed, if not found returns an empty string
	
	Body data extraction:
		- ioutil.ReadAll((*http.Request).Body) --> reads all of the bytes from the requests Body and returns it
*/

const keyServerAddr = "server-address"

func getRoot(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	// fetching query params from request
	hasFirst := r.URL.Query().Has("first")
	first := r.URL.Query().Get("first")
	hasSecond := r.URL.Query().Has("second")
	second := r.URL.Query().Get("second")

	// fetching Body data from request
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		fmt.Printf("could not read request body: %s\n", err)
	}

	fmt.Printf("%s: got / request. first(%t)=%s, second(%t)=%s, body:\n%s\n",
		ctx.Value(keyServerAddr),
		hasFirst, first,
		hasSecond, second,
		body,
	)
	io.WriteString(w, "This is my website!\n")
}

func getHello(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	fmt.Printf("%s: got /hello request\n", ctx.Value(keyServerAddr))
	io.WriteString(w, "Hello, HTTP!\n")
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/", getRoot)
	mux.HandleFunc("/hello", getHello)
	
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