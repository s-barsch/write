package main

import (
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"
)

type Text struct {
	Id   string `json:"id"`
	Path string `json:"path"`
	Body string `json:"body"`
	Mod  int64  `json:"mod"`
}

type Texts []*Text

func getTexts() (Texts, error) {
	l, err := os.ReadDir(srv.paths.texts)
	if err != nil {
		return nil, err
	}
	texts := Texts{}
	for _, de := range l {
		path := filepath.Join(srv.paths.texts, de.Name())
		b, err := os.ReadFile(path)
		if err != nil {
			return nil, err
		}
		texts = append(texts, &Text{
			Id:   makeId(de.Name()),
			Path: path,
			Body: string(b),
			Mod:  modTime(de),
		})
	}
	sort.Sort(Desc(texts))
	return texts, nil
}

func modTime(de os.DirEntry) int64 {
	fi, err := de.Info()
	if err != nil {
		fmt.Println(err)
	}
	return fi.ModTime().UnixNano() / int64(time.Millisecond)
}

func makeId(name string) string {
	i := strings.LastIndex(name, ".")
	if i == -1 {
		return name
	}
	return name[:i]
}

type Desc Texts

func (a Desc) Len() int {
	return len(a)
}

func (a Desc) Swap(i, j int) {
	a[i], a[j] = a[j], a[i]
}

func (a Desc) Less(i, j int) bool {
	return a[i].Id > a[j].Id
}
