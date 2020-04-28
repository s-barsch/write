package main

import (
	"bytes"
	"fmt"
	"github.com/bradfitz/gomemcache/memcache"
	"github.com/gorilla/securecookie"
	log "github.com/sirupsen/logrus"
	"golang.org/x/crypto/bcrypt"
	"io/ioutil"
	"net/http"
	"text/template"
)

const COOKIE_NAME = "session"

// auth

func authHandler(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		err := checkAuth(w, r)
		if err != nil {
			log.WithFields(log.Fields{
				"path": r.URL.Path,
				"func": "checkAuth",
			}).Info(err)
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
	c, err := r.Cookie(COOKIE_NAME)
	if err != nil {
		return "", err
	}
	return c.Value, nil
}

func deleteAuthCookie(w http.ResponseWriter) {
	http.SetCookie(w, &http.Cookie{
		Name:   COOKIE_NAME,
		Path:   "/",
		MaxAge: -1,
		//Secure: !*local,
	})
}

// login

func login(w http.ResponseWriter, r *http.Request) {
	t, err := template.ParseFiles("./login.html")
	if err != nil {
		log.Error(err)
		http.Error(w, err.Error(), 500)
		return
	}
	err = t.Execute(w, "")
	if err != nil {
		log.Error(err)
	}
}

func loginVerify(w http.ResponseWriter, r *http.Request) {
	err := initializeSession(w, r.FormValue("pass"))
	if err != nil {
		log.Error(err)
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
		Name:   COOKIE_NAME,
		Value:  token,
		Path:   "/",
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
