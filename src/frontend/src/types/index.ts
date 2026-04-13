export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // in cents
  imageUrl: string;
  tags: string[];
  featured: boolean;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number; // in cents
  quantity: number;
  imageUrl: string;
}

export interface LineItem {
  productId: string;
  quantity: number;
}

export interface Order {
  id: string;
  items: LineItem[];
  total: number;
  timestamp: number;
  status: string;
}

export type OccasionCategory = {
  label: string;
  imageUrl: string;
  slug: string;
};
