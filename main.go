package main

import (
	"fmt"
	"log"
	"os"

	"github.com/bocianowski1/beerconsulting/db"
	"github.com/bocianowski1/beerconsulting/server"
)

func main() {
	dev := os.Getenv("ENV") == "development"

	db := db.NewDB()
	collection := db.Collection("orders")
	s := server.NewServer(":8080", collection)

	if dev {
		fmt.Println("Server is running on http://localhost:8080")
	}
	log.Fatal(s.ListenAndServe())
}
