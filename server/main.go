package main

import (
	"net/http"
	"encoding/json"
)

func main() {
	http.HandleFunc("/", serveBuild)
	http.HandleFunc("/api/texts/", serveTexts)
	http.HandleFunc("/api/text/", textApi)
	http.ListenAndServe(":8231", nil)
}

func serveBuild(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "../user/build" + r.URL.Path)
}

func serveTexts(w http.ResponseWriter, r *http.Request) {
	texts, err := getTexts()
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	w.Header().Set("Access-Control-Allow-Origin", "*")
	err = json.NewEncoder(w).Encode(texts)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
}
