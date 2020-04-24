package main

import (
	"encoding/json"
	"github.com/gorilla/mux"
	"net/http"
)

var srv *server

func main() {
	srv = newServer()

	http.Handle("/", routes())
	http.ListenAndServe(":8231", nil)
}

func routes() *mux.Router {
	r := mux.NewRouter().StrictSlash(true)

	r.HandleFunc("/login/verify", loginVerify)
	r.HandleFunc("/login", login)

	s := r.PathPrefix("/").Subrouter()

	s.Use(authHandler)

	s.HandleFunc("/api/texts/", serveTexts)
	s.HandleFunc("/api/text/", textApi)
	s.PathPrefix("/").HandlerFunc(serveBuild)

	return r
}

func serveBuild(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, srv.paths.app+"/build"+r.URL.Path)
}

func serveTexts(w http.ResponseWriter, r *http.Request) {
	texts, err := getTexts()
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	if srv.flags.testing {
		w.Header().Set("Access-Control-Allow-Origin", "*")
	}
	err = json.NewEncoder(w).Encode(texts)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
}
