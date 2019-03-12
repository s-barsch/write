package main

import (
	"net/http"
	"fmt"
	"encoding/json"
)

func main() {
	http.HandleFunc("/", serveStatic)
	http.HandleFunc("/api/", serveApi)
	http.HandleFunc("/api/texts/", serveTexts)
	http.ListenAndServe(":8231", nil)
}

func serveStatic(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path == "/js/bundle.js" {
		http.ServeFile(w, r, "./js/dist/bundle.js")
		return
	}
	http.ServeFile(w, r, "./index.html")
	fmt.Println("served index file");
}

func serveApi(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "hello world for sure.")
}

func serveTexts(w http.ResponseWriter, r *http.Request) {
	texts, err := getTexts()
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	err = json.NewEncoder(w).Encode(texts)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
}
