package main

import (
	"encoding/json"
	"github.com/gorilla/mux"
	"net/http"
	"log"
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

func authHandler(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		err := checkAuth(w, r)
		if err != nil {
			log.Println(err)
			http.Error(w, "Not authorized", 403)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func checkAuth(w http.ResponseWriter, r *http.Request) error {
	token, err := getToken(r)
	if err != nil {
		return err
	}
	_, err = srv.memdb.Get(token)
	if err != nil {
		deleteAuthCookie(w)
	}
	return err
}

func getToken(r *http.Request) (string, error) {
	c, err := r.Cookie("session")
	if err != nil {
		return "", err
	}
	return c.Value, nil
}

func deleteAuthCookie(w http.ResponseWriter) {
	http.SetCookie(w, &http.Cookie{
		Name:  "session",
		Path:  "/",
		MaxAge: -1,
		//Secure: !*local,
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
