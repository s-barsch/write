package main

import (
	"encoding/json"
	"io"
	"net/http"
	"os"
	"text/template"

	"g.rg-s.com/org/go/helper/reqerr"
	"github.com/gorilla/mux"
	log "github.com/sirupsen/logrus"
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
	r.HandleFunc("/logout", logout)
	r.HandleFunc("/manifest.json", serveBuild)
	r.HandleFunc("/manifest.webmanifest", serveBuild)

	s := r.PathPrefix("/").Subrouter()

	s.Use(authHandler)

	s.HandleFunc("/api/texts", serveTexts)

	s.Path("/api/text/{name}").Methods("PUT").HandlerFunc(h(writeFile))
	s.Path("/api/text/{name}").Methods("DELETE").HandlerFunc(h(deleteFile))

	s.PathPrefix("/").HandlerFunc(serveBuild)

	return r
}

func serveTemplate(w io.Writer, tmpl string) error {
	t, err := template.ParseFiles(srv.paths.root + "/go/response.html")
	if err != nil {
		return err
	}
	return t.ExecuteTemplate(w, tmpl, "")
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

func h(fn func(http.ResponseWriter, *http.Request) *reqerr.Err) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		err := fn(w, r)
		if err != nil {
			log.Println(err)
			http.Error(w, err.Error(), err.Code)
		}
	}
}
