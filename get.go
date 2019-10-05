package main

import (
	"strings"
	"path/filepath"
	"io/ioutil"
	"time"
	"os"
)

type Text struct {
	Id   string		`json:"id"`
	Path string		`json:"path"`
	Body string		`json:"body"`
	Mod  int64		`json:"mod"`
	//Mod  time.Time	`json:"mod"`
}

type Texts []*Text

var app = "/home/stef/go/src/write"
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
			Id:   makeId(fi.Name()),
			Path: path,
			Body: string(b),
			Mod:  modTime(fi),
		})
	}
	return texts, nil
}

func modTime(fi os.FileInfo) int64 {
	return fi.ModTime().UnixNano() / int64(time.Millisecond)
}

func makeId(name string) string {
	i := strings.LastIndex(name, ".")
	if i == -1 {
		return name
	}
	return name[:i]
}
