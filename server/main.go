package main

import (
	"encoding/json"
	"github.com/gorilla/mux"
	"net/http"
)

func main() {
	http.Handle("/", routes())
	http.ListenAndServe(":8231", nil)
}

func routes() *mux.Router {
	r := mux.NewRouter().StrictSlash(true)

	r.HandleFunc("/login/verify", loginVerify)
	r.HandleFunc("/login", login)

	r.Use(AuthHandler)

	r.HandleFunc("/api/texts/", serveTexts)
	r.HandleFunc("/api/text/", textApi)

	r.PathPrefix("/").HandlerFunc(serveBuild)

	return r
}

func AuthHandler(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		next.ServeHTTP(w, r)
	})
}

func serveBuild(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "../app/build"+r.URL.Path)
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
