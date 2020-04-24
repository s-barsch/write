package main

import (
	"github.com/gorilla/securecookie"
	"golang.org/x/crypto/bcrypt"
	"io/ioutil"
	"log"
	"net/http"
	"text/template"
)

func login(w http.ResponseWriter, r *http.Request) {
	t, err := template.ParseFiles("./login.html")
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), 500)
		return
	}
	err = t.Execute(w, "")
	if err != nil {
		log.Println(err)
	}
}

func loginVerify(w http.ResponseWriter, r *http.Request) {
	log.Println(string(securecookie.GenerateRandomKey(32)))
	err := checkPass(r.FormValue("pass"))
	if err != nil {
		log.Println(err)
		http.Error(w, "Failed login", 401)
		return
	}
}

func checkPass(pass string) error {
	hash, err := ioutil.ReadFile("./pass")
	if err != nil {
		return err
	}
	return bcrypt.CompareHashAndPassword(hash, []byte(pass))
}
