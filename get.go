package main

import (
	"time"
	"path/filepath"
	"io/ioutil"
)

type Text struct {
	Path string		`json:"path"`
	Body string		`json:"body"`
	Mod  time.Time	`json:"mod"`
}

type Texts []*Text

var app = "/home/stef/go/src/writen-custom"
var data = app + "/texts"

func getTexts() (Texts, error) {
	l, err := ioutil.ReadDir(data)
	if err != nil {
		return nil, err
	}
	texts := Texts{}
	for _, fi := range l {
		path := filepath.Join(data, fi.Name())
		b, err := ioutil.ReadFile(path)
		if err != nil {
			return nil, err
		}
		texts = append(texts, &Text {
			Path: path,
			Body: string(b),
			Mod:  fi.ModTime(),
		})
	}
	return texts, nil
}
