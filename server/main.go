package main

import (
	"net/http"
	"fmt"
	"encoding/json"
)

func main() {
	http.HandleFunc("/", serveBuild)
	http.HandleFunc("/api/texts/", serveTexts)
	http.HandleFunc("/api/text/", textApi)
	http.ListenAndServe(":8231", nil)
}

func serveBuild(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "../client/build" + r.URL.Path)
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
	/*
	w.Header().Set("Access-Control-Allow-Origin", "*")
	*/
	err = json.NewEncoder(w).Encode(texts)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
}
