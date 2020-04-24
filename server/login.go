package main

import (
	"net/http"
	"fmt"
)

func login(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "hello")
}
