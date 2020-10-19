package main

import (
	"flag"
	"github.com/bradfitz/gomemcache/memcache"
	log "github.com/sirupsen/logrus"
)

type server struct {
	memdb *memcache.Client
	paths *paths
	flags *flags
}

type flags struct {
	debug bool
}

type paths struct {
	root  string
	texts string
	app   string
	build string
}

func newPaths(root string, debug bool) *paths {
	textsDir := "/texts"
	if debug {
		textsDir = "/debug/texts"
	}
	return &paths{
		root:  root,
		texts: root + textsDir,
		app:   root + "/app",
		build: root + "/app/build",
	}
}

func newServer() *server {
	debug := flag.Bool("debug", false, "set true for extended logging and sandbox text dir")
	path := flag.String("path", ".", "path of the app")
	flag.Parse()

	setLogger(*debug)

	memdb := memcache.New("127.0.0.1:11211")
	err := testMemcache(memdb)
	if err != nil {
		log.Error(err)
		log.Fatalln("error: memcache is down.")
	}
	return &server{
		memdb: memdb,
		paths: newPaths(*path, *debug),
		flags: &flags{
			debug: *debug,
		},
	}
}

func setLogger(debug bool) {
	setLogLevel(debug)
	log.SetFormatter(&log.TextFormatter{
		FullTimestamp: true,
	})
}

func setLogLevel(debug bool) {
	if debug {
		log.SetLevel(log.InfoLevel)
		return
	}
	log.SetLevel(log.WarnLevel)
}

func testMemcache(memdb *memcache.Client) error {
	key := "0"
	err := memdb.Set(&memcache.Item{Key: key, Value: []byte(""), Expiration: 1})
	if err != nil {
		return err
	}
	return memdb.Delete(key)
}
