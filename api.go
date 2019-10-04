package main

import (
	"net/http"
	"fmt"
	"io/ioutil"
)

func textApi(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "PUT":
		err := writeFile(w, r)
		http.Error(w, err.Error(), 500)
		return
	default:
		fmt.Fprint(w, "GET request")
	}
}

func writeFile(w http.ResponseWriter, r *http.Request) error {
	path := r.URL.Path[len("/api/text"):]
	if path == "/" {
		return fmt.Errorf("must provied filepath")
	}
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return err
	}
	return ioutil.WriteFile(data + path, body, 0644)
}
