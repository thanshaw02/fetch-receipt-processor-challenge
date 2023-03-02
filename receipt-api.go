package main

import (
	"context"
	"errors"
	"fmt"
	"io"
	// "io/ioutil"
	"net"
	"net/http"
	// "os"
)

const keyServerAddr = "server-address"

func getRoot(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	fmt.Printf("%s: got / request\n", ctx.Value(keyServerAddr))
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
	
	ctx, cancelCtx := context.WithCancel(context.Background())

	serverOne := &http.Server {
		Addr: "127.0.0.1:3000",
		Handler: mux,
		BaseContext: func(l net.Listener) context.Context {
			ctx = context.WithValue(ctx, keyServerAddr, l.Addr().String())
			return ctx
		},
	}

	serverTwo := &http.Server {
		Addr: "127.0.0.1:4000",
		Handler: mux,
		BaseContext: func(l net.Listener) context.Context {
			ctx = context.WithValue(ctx, keyServerAddr, l.Addr().String())
			return ctx
		},
	}

	// starting "serverOne" in a "goroutine"
	go func() {
		err := serverOne.ListenAndServe()
		if errors.Is(err, http.ErrServerClosed) {
			fmt.Printf("server one has closed\n")
		} else if err != nil {
			fmt.Printf("error listening for server one: %s", err)
		}
		cancelCtx()
	}()
	
	// starting "serverOne" in a "goroutine"
	go func() {
		err := serverTwo.ListenAndServe()
		if errors.Is(err, http.ErrServerClosed) {
			fmt.Printf("server two has closed\n")
		} else if err != nil {
			fmt.Printf("error listening for server two: %s", err)
		}
		cancelCtx()
	}()

	<-ctx.Done()
}