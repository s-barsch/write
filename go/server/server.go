package server

import (
	"flag"
	"fmt"

	"github.com/bradfitz/gomemcache/memcache"
	log "github.com/sirupsen/logrus"
)

var Srv *Server

type Server struct {
	Memdb *memcache.Client
	Paths *Paths
	Flags *Flags
}

type Flags struct {
	Debug bool
}

type Paths struct {
	Root  string
	Texts string
	App   string
	Build string
}

func newPaths(root string, debug bool) *Paths {
	textsDir := "/texts"
	if debug {
		textsDir = "/debug/texts"
	}
	return &Paths{
		Root:  root,
		Texts: root + textsDir,
		App:   root,
		Build: root + "/dist",
	}
}

func NewServer() *Server {
	debug := flag.Bool("debug", false, "set true for extended logging and sandbox text dir")
	path := flag.String("path", ".", "path of the app")
	flag.Parse()

	setLogger(*debug)

	memdb := memcache.New("127.0.0.1:11211")
	err := testMemcache(memdb)
	if err != nil {
		log.Fatalln(fmt.Errorf("error: memcache is down %w", err))
	}
	return &Server{
		Memdb: memdb,
		Paths: newPaths(*path, *debug),
		Flags: &Flags{
			Debug: *debug,
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
