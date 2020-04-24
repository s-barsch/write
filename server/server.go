package main

import (
	"flag"
	"github.com/bradfitz/gomemcache/memcache"
	"log"
)

type server struct {
	memdb *memcache.Client
	paths *paths
	flags *flags
}

type flags struct {
	testing bool
}

type paths struct {
	root  string
	texts string
	app   string
}

func newPaths(root string) *paths {
	return &paths{
		root:  root,
		texts: root + "/texts",
		app:   root + "/app",
	}
}

func newServer() *server {
	testing := flag.Bool("testing", false, "set true for corss origin requests")
	flag.Parse()

	memdb := memcache.New("127.0.0.1:11211")
	err := testMemcache(memdb)
	if err != nil {
		log.Println(err)
		log.Fatal("error: memcache is down.")
	}
	return &server{
		memdb: memdb,
		paths: newPaths(".."),
		flags: &flags{
			testing: *testing,
		},
	}
}

func testMemcache(memdb *memcache.Client) error {
	key := "0"
	err := memdb.Set(&memcache.Item{Key: key, Value: []byte(""), Expiration: 1})
	if err != nil {
		return err
	}
	return memdb.Delete(key)
}
