package auth

import (
	"bytes"
	"fmt"
	"html/template"
	"io"
	"net/http"
	"os"

	s "g.rg-s.com/write/go/server"
	"github.com/bradfitz/gomemcache/memcache"
	"github.com/gorilla/securecookie"
	log "github.com/sirupsen/logrus"
	"golang.org/x/crypto/bcrypt"
)

const COOKIE_NAME = "session"

// auth

func AuthHandler(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		err := checkAuth(w, r)
		if err != nil {
			log.WithFields(log.Fields{
				"path": r.URL.Path,
				"func": "checkAuth",
			}).Info(err)

			buf := bytes.Buffer{}
			err := serveTemplate(&buf, "access-denied")
			if err != nil {
				log.Println(err)
				http.Error(w, "internal error", 500)
				return
			}
			w.WriteHeader(403)
			_, err = w.Write(buf.Bytes())
			if err != nil {
				log.Println(err)
				http.Error(w, "internal error", 500)
			}
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
	_, err = s.Srv.Memdb.Get(token)
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

func Login(w http.ResponseWriter, r *http.Request) {
	err := serveTemplate(w, "login")
	if err != nil {
		http.Error(w, "internal error", 500)
		log.Println(err)
	}
}

func LoginVerify(w http.ResponseWriter, r *http.Request) {
	err := initializeSession(w, r.FormValue("pass"))
	if err != nil {
		log.Error(err)
		http.Error(w, "Failed login", http.StatusUnauthorized)
		return
	}
	http.Redirect(w, r, "/", http.StatusFound)
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
		MaxAge: 31536000,
		//Secure: !*local,
	})
	return nil
}

func checkPass(pass string) error {
	hash, err := os.ReadFile(s.Srv.Paths.Root + "/go/pass")
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

	return s.Srv.Memdb.Set(it)
}

func Logout(w http.ResponseWriter, r *http.Request) {
	deleteAuthCookie(w)
	http.Redirect(w, r, "/login", http.StatusTemporaryRedirect)
}
func serveTemplate(w io.Writer, tmpl string) error {
	t, err := template.ParseFiles(s.Srv.Paths.Root + "/go/response.html")
	if err != nil {
		return err
	}
	return t.ExecuteTemplate(w, tmpl, "")
}
