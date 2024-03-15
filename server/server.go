package server

import (
	"encoding/json"
	"net/http"
	"os"
	"time"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"
	"go.mongodb.org/mongo-driver/mongo"
)

type Server struct {
	Collection *mongo.Collection
}

func NewServer(listenAddr string, collection *mongo.Collection) *http.Server {
	server := &Server{Collection: collection}
	handler := server.registerRoutes()

	return &http.Server{
		Addr:         listenAddr,
		Handler:      handler,
		IdleTimeout:  time.Minute,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}
}

func (s *Server) registerRoutes() http.Handler {
	r := chi.NewRouter()

	// if os.Getenv("ENV") == "development" {
	r.Use(middleware.Logger)
	r.Use(cors.Handler(cors.Options{
		// AllowedOrigins:   []string{"https://foo.com"}, // Use this to allow specific origin hosts
		AllowedOrigins: []string{"http://localhost:5173"},
		// AllowOriginFunc:  func(r *http.Request, origin string) bool { return true },
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	}))
	// }

	// Orders
	r.Get("/api/v1/orders", s.handleGetOrders)
	r.Post("/api/v1/orders", s.handleCreateOrder)
	r.Get("/api/v1/features", s.handleGetFeatures)
	r.Delete("/api/v1/orders/{id}", s.handleDeleteOrder)

	// Build project
	r.Post("/api/v1/build", s.handleBuildProject)

	// Static files
	if os.Getenv("ENV") != "development" {
		r.Handle("/*", http.FileServer(http.Dir("./web/dist")))
	}

	return r
}

func writeJSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}
