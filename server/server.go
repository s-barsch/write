package main

import (
	"github.com/bradfitz/gomemcache/memcache"
	"log"
)

type server struct {
	memdb *memcache.Client
	paths *paths
}

type paths struct {
	root  string
	texts string
	app   string
}

func newServer() *server {
	memdb := memcache.New("127.0.0.1:11211")
	err := testMemcache(memdb)
	if err != nil {
		log.Println(err)
		log.Fatal("memcache is down.")
	}
	return &server {	
		memdb: memdb, 
		paths: newPaths(".."),
	}
}

func testMemcache(memdb *memcache.Client) error {
	key := "0"
	err := memdb.Set(&memcache.Item{Key: key, Value: []byte(""), Expiration: 5})
	if err != nil {
		return err
	}
	return memdb.Delete(key)
}

func newPaths(root string) *paths {
	return &paths{
		root: root,
		texts: root + "/texts",
		app: root + "/app",
	}
}

