import type { backendInterface, Product, Order, ShippingAddress } from "../backend";
import { OrderStatus } from "../backend";

const sampleProducts: Product[] = [
  {
    id: "prod-1",
    featured: true,
    name: "Golden Gratitude Set",
    tags: ["appreciation", "luxury"],
    description: "A premium gift set to express heartfelt gratitude, featuring artisan chocolates and a handwritten card.",
    imageUrl: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=400",
    price: BigInt(4999),
  },
  {
    id: "prod-2",
    featured: false,
    name: "Warm Wishes Box",
    tags: ["appreciation", "wellness"],
    description: "Curated wellness items including herbal teas and relaxation essentials.",
    imageUrl: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400",
    price: BigInt(3499),
  },
];

const sampleOrders: Order[] = [
  {
    id: "order-1",
    status: OrderStatus.completed,
    total: BigInt(4999),
    timestamp: BigInt(Date.now() * 1_000_000 - 86400000 * 1_000_000),
    items: [{ productId: "prod-1", quantity: BigInt(1) }],
  },
];

const sampleAddresses: ShippingAddress[] = [
  {
    id: "addr-1",
    fullName: "Jane Doe",
    streetAddress: "123 Main St",
    city: "San Francisco",
    state: "CA",
    postalCode: "94105",
    country: "US",
    isDefault: true,
  },
];

export const mockBackend: backendInterface = {
  addShippingAddress: async (input) => ({
    __kind__: "ok",
    ok: { id: "addr-new", ...input, isDefault: false },
  }),
  addToWishlist: async () => ({ __kind__: "ok", ok: null }),
  createCheckoutSession: async () => "mock-session-id",
  deleteShippingAddress: async () => ({ __kind__: "ok", ok: null }),
  getProduct: async (id) => sampleProducts.find((p) => p.id === id) ?? null,
  getProducts: async () => sampleProducts,
  getStripeSessionStatus: async () => ({
    __kind__: "failed",
    failed: { error: "mock" },
  }),
  getUserOrders: async () => sampleOrders,
  getUserShippingAddresses: async () => sampleAddresses,
  getUserWishlist: async () => [sampleProducts[0]],
  isProductInWishlist: async (productId) => productId === "prod-1",
  isStripeConfigured: async () => false,
  removeFromWishlist: async () => ({ __kind__: "ok", ok: null }),
  setDefaultShippingAddress: async () => ({ __kind__: "ok", ok: null }),
  setStripeConfiguration: async () => undefined,
  transform: async (input) => ({
    status: BigInt(200),
    body: input.response.body,
    headers: [],
  }),
  updateShippingAddress: async (id, input) => ({
    __kind__: "ok",
    ok: { id, ...input, isDefault: false },
  }),
};
