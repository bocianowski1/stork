package db

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type Order struct {
	CreatedAt   time.Time       `json:"createdAt"`
	Count       int             `json:"count"` // how many an order was placed by the same name, email and company
	FullName    string          `json:"fullName" validate:"required"`
	Email       string          `json:"email" validate:"required,email"`
	Company     string          `json:"company" validate:"required"`
	PhoneNumber string          `json:"phoneNumber" validate:"omitempty,phone"`
	Message     string          `json:"message" validate:"omitempty"`
	TotalPrice  float64         `json:"totalPrice" validate:"required"`
	Features    []*OrderFeature `json:"features"`
}

type OrderFeature struct {
	Name        string           `json:"name" validate:"required"`
	FullName    string           `json:"fullName" validate:"required"`
	Description string           `json:"description" validate:"omitempty"`
	BasePrice   float64          `json:"basePrice" validate:"required"`
	Category    string           `json:"category" validate:"required"`
	Options     []*FeatureOption `json:"options"`
}

type FeatureOption struct {
	Name       string  `json:"name" validate:"required"`
	FullName   string  `json:"fullName" validate:"required"`
	Price      float64 `json:"price" validate:"required"`
	IsSelected bool    `json:"isSelected" gorm:"-"`
}

const (
	BASIC_TIER   = "basic"
	PREMIUM_TIER = "premium"
	MISC_TIER    = "misc"
)

func CreateOrder(ctx context.Context, collection *mongo.Collection, order *Order) error {
	_, err := collection.InsertOne(ctx, order)
	return err
}

func GetAllOrders(ctx context.Context, collection *mongo.Collection) ([]*Order, error) {
	var orders []*Order
	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	for cursor.Next(ctx) {
		var order Order
		if err := cursor.Decode(&order); err != nil {
			return nil, err
		}
		orders = append(orders, &order)
	}
	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return orders, nil
}

func DeleteOrder(ctx context.Context, collection *mongo.Collection, id string) error {
	_, err := collection.DeleteOne(ctx, bson.M{"_id": id})
	return err
}

func GetOrderCount(ctx context.Context, collection *mongo.Collection, fullName, email, company string) (int, error) {
	count, err := collection.CountDocuments(ctx, bson.M{"fullName": fullName, "email": email, "company": company})
	return int(count) + 1, err
}

var Features = []*OrderFeature{
	{
		Name:        "users",
		FullName:    "Authenticated Users",
		Description: "Authenticate your users with email and password, or with a social provider like Google or Facebook.",
		BasePrice:   10000,
		Category:    BASIC_TIER,
		Options: []*FeatureOption{
			{
				Name:     "email",
				FullName: "Email",
				Price:    1000,
			},
			{
				Name:     "google",
				FullName: "Google",
				Price:    2000,
			},
			{
				Name:     "facebook",
				FullName: "Facebook",
				Price:    2000,
			},
		},
	},
	{
		Name:        "events",
		FullName:    "Realtime Events",
		Description: "Listen for changes to your data in realtime. Trigger serverless functions in response to events.",
		BasePrice:   20000,
		Category:    BASIC_TIER,
		Options: []*FeatureOption{
			{
				Name:     "chat",
				FullName: "Chat",
				Price:    5000,
			},
			{
				Name:     "notifications",
				FullName: "Notifications",
				Price:    5000,
			},
			{
				Name:     "live_updates",
				FullName: "Live Updates",
				Price:    3000,
			},
		},
	},
	{
		Name:        "payments",
		FullName:    "In-App Payments",
		Description: "Enable your users to make payments within your app. This could be for products, other one time purchases, or subscriptions.",
		BasePrice:   30000,
		Category:    PREMIUM_TIER,
		Options: []*FeatureOption{
			{
				Name:     "one_time",
				FullName: "One Time",
				Price:    10000,
			},
			{
				Name:     "subscriptions",
				FullName: "Subscriptions Based",
				Price:    20000,
			},
		},
	},
	{
		Name:        "automations",
		FullName:    "Automations",
		Description: "Automate repetitive tasks and processes. This could be anything from sending a welcome email to new users, to updating a user's status based on their activity.",
		BasePrice:   20000,
		Category:    MISC_TIER,
		Options: []*FeatureOption{
			{
				Name:     "welcome_email",
				FullName: "Welcome Email",
				Price:    1000,
			},
			{
				Name:     "activity_updates",
				FullName: "Activity Updates",
				Price:    5000,
			},
			{
				Name:     "scheduled_tasks",
				FullName: "Scheduled Tasks",
				Price:    10000,
			},
		},
	},
}
