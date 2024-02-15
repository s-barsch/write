package main

import (
	"golang.org/x/crypto/bcrypt"
	"os"
	"log"
	"fmt"
)

func HashPass(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}

func main() {
	args := os.Args[1:]
	if len(args) < 1 {
		log.Fatal("ERROR: provide pass")
	}
	hash, err := HashPass(args[0])
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(hash)
}
