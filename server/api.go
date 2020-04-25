package main

import (
	"fmt"
	log "github.com/sirupsen/logrus"
	"io/ioutil"
	"net/http"
	"os"
)

func textApi(w http.ResponseWriter, r *http.Request) {
	if srv.flags.testing {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "PUT, DELETE")
	}

	var err error
	var fn string
	switch r.Method {
	case "PUT":
		fn = "writeFile"
		err = writeFile(w, r)
	case "DELETE":
		fn = "deleteFile"
		err = deleteFile(w, r)
	default:
		fn = "textApi"
		err = fmt.Errorf("GET request not suported.")
	}

	if err != nil {
		log.WithFields(log.Fields{
			"func": fn,
			"path": r.URL.Path,
		}).Error(err)
		http.Error(w, err.Error(), 500)
	}
}

func deleteFile(w http.ResponseWriter, r *http.Request) error {
	path := r.URL.Path[len("/api/text"):]
	if path == "/" {
		return fmt.Errorf("invalid path")
	}
	_, err := os.Stat(srv.paths.texts + path)
	if err != nil {
		log.Info("file not found, so see it as removed. %v", path)
		return nil
	}
	err = os.Remove(srv.paths.texts + path)
	if err == nil {
		log.Infof("file removed %v\n", path)
	}
	return err
}

func writeFile(w http.ResponseWriter, r *http.Request) error {
	path := r.URL.Path[len("/api/text"):]
	if path == "/" {
		return fmt.Errorf("invalid path")
	}
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return err
	}
	err = ioutil.WriteFile(srv.paths.texts+path, body, 0664)
	if err == nil {
		log.Infof("written.\n{%s}\n", body)
	}
	return err
}
