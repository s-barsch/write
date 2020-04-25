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

	setLogLevel(*testing)
	log.SetFormatter(&log.TextFormatter{
		FullTimestamp: true,
	})

	memdb := memcache.New("127.0.0.1:11211")
	err := testMemcache(memdb)
	if err != nil {
		log.Error(err)
		log.Fatalln("error: memcache is down.")
	}
	return &server{
		memdb: memdb,
		paths: newPaths(".."),
		flags: &flags{
			testing: *testing,
		},
	}
}

func setLogLevel(testing bool) {
	if testing {
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
