export type Order = {
  _id: number;
  fullName: string;
  email: string;
  company: string;
  phoneNumber?: string;
  message?: string;
  features: OrderFeature[];
  totalPrice: number;
};

export type OrderFeature = {
  id: number;
  orderId: number;
  name: string;
  fullName: string;
  description: string;
  basePrice: number;
  category: Category;
  options: FeatureOption[];
};

export type FeatureOption = {
  id: number;
  featureId: number;
  name: string;
  fullName: string;
  price: number;
  isSelected: boolean;
};

export type Category = "basic" | "premium" | "miscellaneous";

export type Toast = {
  title?: string | undefined;
  message: string;
  type: "success" | "error";
} | null;
