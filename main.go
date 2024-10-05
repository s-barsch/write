package main

import (
	"log"
	"net/http"

	"g.rg-s.com/write/go/routes"
	s "g.rg-s.com/write/go/server"
)

func main() {
	s.Srv = s.NewServer()

	http.Handle("/", routes.Routes())
	log.Fatal(http.ListenAndServe(":8231", nil))
}
