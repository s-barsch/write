package main

import (
	"encoding/json"
	"github.com/gorilla/mux"
	"net/http"
	"os"
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
	s.HandleFunc("/api/text/{name}", textApi)
	s.PathPrefix("/").HandlerFunc(serveBuild)

	return r
}

func serveBuild(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		file := srv.paths.build + r.URL.Path
		_, err := os.Stat(file)
		if err == nil {
			http.ServeFile(w, r, file)
			return
		}
	}
	http.ServeFile(w, r, srv.paths.build+"/index.html")
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
