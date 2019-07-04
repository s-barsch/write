package main

import (
	"net/http"
	"fmt"
	"encoding/json"
)

func main() {
	http.HandleFunc("/", serveStatic)
	http.HandleFunc("/js/", serveJs)
	//http.HandleFunc("/api/", serveApi)
	http.HandleFunc("/api/texts/", serveTexts)
	http.HandleFunc("/api/text/", textApi)
	http.ListenAndServe(":8231", nil)
}

func serveJs(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "./js/dist/" + r.URL.Path[4:])
}

func serveStatic(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "./index.html")
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
