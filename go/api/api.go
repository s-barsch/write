package api

import (
	"fmt"
	"io"
	"net/http"
	"os"
	p "path/filepath"

	"g.rg-s.com/org/go/helper/reqerr"
	s "g.rg-s.com/write/go/server"
	"github.com/gorilla/mux"
)

func DeleteFile(w http.ResponseWriter, r *http.Request) *reqerr.Err {
	e := reqerr.New("DeleteFile", r.URL.Path)

	name := mux.Vars(r)["name"]
	path := p.Join(s.Srv.Paths.Texts, name)

	if name == "" {
		return e.Set(fmt.Errorf("invalid name: %v", name), 500)
	}

	_, err := os.Stat(path)
	if err != nil {
		return nil
	}

	err = os.Remove(path)
	if err != nil {
		return e.Set(err, 500)
	}

	return nil
}

func WriteFile(w http.ResponseWriter, r *http.Request) *reqerr.Err {
	e := reqerr.New("WriteFile", r.URL.Path)

	name := mux.Vars(r)["name"]
	path := p.Join(s.Srv.Paths.Texts, name)

	if name == "" {
		return e.Set(fmt.Errorf("invalid name: %v", name), 500)
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		return e.Set(err, 500)
	}

	err = os.WriteFile(path, body, 0664)
	if err != nil {
		return e.Set(err, 500)
	}

	return nil
}
