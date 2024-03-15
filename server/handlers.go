package server

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/bocianowski1/beerconsulting/build"
	"github.com/bocianowski1/beerconsulting/db"
)

func (s *Server) handleCreateOrder(w http.ResponseWriter, r *http.Request) {
	type request struct {
		FullName    string             `json:"fullName"`
		Email       string             `json:"email"`
		Company     string             `json:"company"`
		PhoneNumber string             `json:"phoneNumber"`
		Message     string             `json:"message"`
		Features    []*db.OrderFeature `json:"features"`
	}
	if r.Body == nil {
		log.Println("No request body")
		http.Error(w, "Please send a request body", http.StatusBadRequest)
		return
	}

	var req request
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Println("Invalid request body")
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	// calculate how many times an order was placed by the same name, email and company
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	count, err := db.GetOrderCount(ctx, s.Collection, req.FullName, req.Email, req.Company)
	if err != nil {
		log.Println("GetOrderCount error", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	var features []*db.OrderFeature
	for _, f := range req.Features {
		var options []*db.FeatureOption
		for _, o := range f.Options {
			if o.IsSelected {
				options = append(options, o)
			}
		}
		f.Options = options
		features = append(features, f)
	}

	var totalPrice float64
	for _, f := range features {
		totalPrice += f.BasePrice
		for _, o := range f.Options {
			totalPrice += o.Price
		}
	}

	order := db.Order{
		CreatedAt:   time.Now(),
		Count:       count,
		FullName:    req.FullName,
		Email:       req.Email,
		Company:     req.Company,
		PhoneNumber: req.PhoneNumber,
		Message:     req.Message,
		TotalPrice:  totalPrice,
		Features:    features,
	}

	if err := db.CreateOrder(ctx, s.Collection, &order); err != nil {
		log.Println("UpsertOrders error", err)
		if err.Error() == "context deadline exceeded" {
			http.Error(w, "Request timeout", http.StatusRequestTimeout)
			return
		}

		if err.Error() == "document is nil" {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	writeJSON(w, http.StatusCreated, order)
}

func (s *Server) handleGetOrders(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	orders, err := db.GetAllOrders(ctx, s.Collection)
	if err != nil {
		if err.Error() == "context deadline exceeded" {
			http.Error(w, "Request timeout", http.StatusRequestTimeout)
			return
		}

		if err.Error() == "document is nil" {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if len(orders) == 0 || orders == nil {
		http.Error(w, "No orders found", http.StatusNotFound)
		return
	}

	writeJSON(w, http.StatusOK, orders)
}

func (s *Server) handleDeleteOrder(w http.ResponseWriter, r *http.Request) {
	orderID := strings.TrimPrefix(r.URL.Path, "/api/v1/orders/")
	if orderID == "" {
		http.Error(w, "Invalid order ID", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := db.DeleteOrder(ctx, s.Collection, orderID); err != nil {
		if err.Error() == "context deadline exceeded" {
			http.Error(w, "Request timeout", http.StatusRequestTimeout)
			return
		}

		if err.Error() == "document is nil" {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (s *Server) handleBuildProject(w http.ResponseWriter, r *http.Request) {
	log.Println("Received request from", r.RemoteAddr)
	if r.Method != "POST" {
		log.Println("Method not allowed", r.Method)
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	decoder := json.NewDecoder(r.Body)
	var order db.Order
	if err := decoder.Decode(&order); err != nil {
		log.Println("Error decoding request body:", err)
		http.Error(w, "Error decoding request body", http.StatusBadRequest)
		return
	}

	projectName := strings.ReplaceAll(order.Company, " ", "-")
	projectName = strings.ToLower(projectName)

	repoURL, err := build.BuildProject(projectName, order.Features)
	if err != nil {
		log.Println("Error building project:", err)
		http.Error(w, "Error building project", http.StatusInternalServerError)
		return
	}

	type response struct {
		URL string `json:"url"`
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response{URL: repoURL})
}

func (s *Server) handleGetFeatures(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, db.Features)
}
