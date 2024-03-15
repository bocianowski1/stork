package db

import (
	"context"
	"log"
	"os"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

func NewDB() *mongo.Database {
	ctx := context.Background()

	var url = os.Getenv("DB_URL")
	if os.Getenv("ENV") == "development" {
		url = "mongodb://torger:secret@localhost:27017/"
	}

	if url == "" {
		log.Fatal("DB_URL environment variable is not set")
	}

	serverAPI := options.ServerAPI(options.ServerAPIVersion1)
	opts := options.Client().ApplyURI(url).SetServerAPIOptions(serverAPI)

	client, err := mongo.Connect(context.TODO(), opts)
	if err != nil {
		log.Fatalf("Failed to connect to MongoDB: %v", err)
	}

	if err := client.Ping(ctx, readpref.Primary()); err != nil {
		log.Fatalf("Failed to ping MongoDB: %v", err)
	}
	// if os.Getenv("ENV") == "development" {
	// } else {
	// 	if err := client.Database("beer").RunCommand(ctx, bson.D{{"ping", 1}}).Err(); err != nil {
	// 		log.Fatalf("PROD: Failed to ping MongoDB: %v", err)
	// 	}
	// }

	log.Println("Connected to MongoDB")

	if os.Getenv("ENV") == "development" {
		// client.Database("beer").Collection("orders").Drop(ctx)
		log.Println("DEV: Dropped orders collection")
	} else {
		log.Println("Running in production")
	}

	return client.Database("beer")
}
