package main

import (
	"bytes"
	"github.com/bradfitz/gomemcache/memcache"
	"github.com/gorilla/securecookie"
	"golang.org/x/crypto/bcrypt"
	"fmt"
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
	fmt.Println("was here")
	err := initializeSession(w, r.FormValue("pass"))
	if err != nil {
		log.Println(err)
		http.Error(w, "Failed login", 401)
		return
	}
	http.Redirect(w, r, "/", 302)
}

func initializeSession(w http.ResponseWriter, pass string) error {
	err := checkPass(pass)
	if err != nil {
		return err
	}
	token := generateToken()

	err = storeToken(token, "")	
	if err != nil {
		return err
	}

	http.SetCookie(w, &http.Cookie{
		Name:  "session",
		Value: token,
		Path:  "/",
		MaxAge: 2592000,
		//Secure: !*local,
	})
	return nil
}

func checkPass(pass string) error {
	hash, err := ioutil.ReadFile("./pass")
	if err != nil {
		return err
	}
	return bcrypt.CompareHashAndPassword(bytes.TrimSpace(hash), []byte(pass))
}

func generateToken() string {
	return fmt.Sprintf("%x", securecookie.GenerateRandomKey(32))
}

func storeToken(token, value string) error {
	it := &memcache.Item{
		Key:        token,
		Value:      []byte(value),
		Expiration: int32(2592000),
	}

	return srv.memdb.Set(it)
}
