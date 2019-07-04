package main

import (
	"net/http"
	"fmt"
	"io/ioutil"
)

func textApi(w http.ResponseWriter, r *http.Request) {
	path := r.URL.Path[len("/api/text"):]
	switch r.Method {
	case "PUT":
		if path == "/" {
			http.Error(w, "must provide filepath", 403)
			return
		}
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}
		err = ioutil.WriteFile(data + path, body, 0644)
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}
	default:
		fmt.Fprint(w, "GET request")
	}
}
