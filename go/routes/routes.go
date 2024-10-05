package routes

import (
	"log"
	"net/http"

	"g.rg-s.com/org/go/helper/reqerr"
	"g.rg-s.com/write/go/api"
	"g.rg-s.com/write/go/auth"
	"g.rg-s.com/write/go/serve"
	"github.com/gorilla/mux"
)

func Routes() *mux.Router {
	r := mux.NewRouter().StrictSlash(true)

	r.HandleFunc("/login/verify", auth.LoginVerify)
	r.HandleFunc("/login", auth.Login)
	r.HandleFunc("/logout", auth.Logout)
	r.HandleFunc("/manifest.json", serve.ServeBuild)
	r.HandleFunc("/manifest.webmanifest", serve.ServeBuild)

	s := r.PathPrefix("/").Subrouter()

	s.Use(auth.AuthHandler)

	s.HandleFunc("/api/texts", serve.ServeTexts)

	s.Path("/api/text/{name}").Methods("PUT").HandlerFunc(handler(api.WriteFile))
	s.Path("/api/text/{name}").Methods("DELETE").HandlerFunc(handler(api.DeleteFile))

	s.PathPrefix("/").HandlerFunc(serve.ServeBuild)

	return r
}

func handler(fn func(http.ResponseWriter, *http.Request) *reqerr.Err) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		err := fn(w, r)
		if err != nil {
			log.Println(err)
			http.Error(w, err.Error(), err.Code)
		}
	}
}
