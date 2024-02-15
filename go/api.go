package main

import (
	"fmt"
	"io"
	"net/http"
	"os"
	p "path/filepath"

	"github.com/gorilla/mux"
	log "github.com/sirupsen/logrus"
)

type Err struct {
	Func string
	Path string
	Code int
	Err  error
}

func (e *Err) Error() string {
	return fmt.Sprintf(
		"%v: %v (%d)\n%v",
		e.Func,
		e.Err.Error(),
		e.Code,
		e.Path,
	)
}

func deleteFile(w http.ResponseWriter, r *http.Request) *Err {
	e := &Err{
		Func: "deleteFile",
		Path: r.URL.Path,
		Code: 500,
	}

	name := mux.Vars(r)["name"]
	path := p.Join(srv.paths.texts, name)

	if name == "" {
		e.Err = fmt.Errorf("invalid name: %v", name)
		return e
	}

	_, err := os.Stat(path)
	if err != nil {
		log.Info(fmt.Sprintf("file not found, so see it as removed. %v", path))
		return nil
	}

	err = os.Remove(path)
	if err != nil {
		e.Err = err
		return e
	}
	log.Infof("file removed %v\n", name)

	return nil
}

func writeFile(w http.ResponseWriter, r *http.Request) *Err {
	e := &Err{
		Func: "writeFile",
		Path: r.URL.Path,
		Code: 500,
	}

	name := mux.Vars(r)["name"]
	path := p.Join(srv.paths.texts, name)

	if name == "" {
		e.Err = fmt.Errorf("invalid name: %v", name)
		return e
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		e.Err = err
		return e
	}

	err = os.WriteFile(path, body, 0664)
	if err != nil {
		e.Err = err
		return e
	}
	log.Infof("written.\n{%s}\n", body)

	return nil
}
