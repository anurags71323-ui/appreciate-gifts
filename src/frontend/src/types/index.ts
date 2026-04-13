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

export interface ShippingAddress {
  id: string;
  label: string; // e.g. "Home", "Office"
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface WishlistEntry {
  productId: string;
  addedAt: number; // timestamp in ms
}
