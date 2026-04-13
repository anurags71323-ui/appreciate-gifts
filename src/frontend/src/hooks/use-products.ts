import { useQuery } from "@tanstack/react-query";
import type { Product } from "../types";

// Sample product data — used until backend methods are available
export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "spa-retreat",
    name: "The Signature Spa Retreat",
    description:
      "A deeply restorative collection of artisan bath and body luxuries, thoughtfully assembled to transform any home into a personal sanctuary. Includes hand-poured soy candles, mineral bath salts, rose quartz roller, and organic skincare essentials.",
    price: 16500,
    imageUrl: "/assets/generated/product-spa-retreat.dim_800x800.jpg",
    tags: ["Self-Care", "Relaxation", "Her"],
    featured: true,
  },
  {
    id: "gentleman-study",
    name: "The Gentleman's Study",
    description:
      "A distinguished collection for the discerning gentleman. Premium leather journal, single malt Scotch whisky miniatures, artisan dark chocolate, and a hand-rolled beeswax candle — everything needed to turn a quiet evening into a refined ritual.",
    price: 18000,
    imageUrl: "/assets/generated/product-gentleman-study.dim_800x800.jpg",
    tags: ["Him", "Sophistication", "Spirits"],
    featured: true,
  },
  {
    id: "new-parent",
    name: "The New Parent Bundle",
    description:
      "A gentle, heartfelt welcome for the world's newest arrival and the remarkable people raising them. Organic cotton swaddle, calming lavender lotion, a whimsical plush companion, and a restorative tea blend for tired, wonderful parents.",
    price: 15000,
    imageUrl: "/assets/generated/product-new-parent.dim_800x800.jpg",
    tags: ["Baby", "Family", "Wellness"],
    featured: true,
  },
  {
    id: "anniversary-celebration",
    name: "The Anniversary Celebration",
    description:
      "Mark another chapter together with this sparkling tribute to love. Includes a small-batch Champagne, hand-crafted Belgian chocolates, preserved rose petals, and crystal flutes etched with subtle elegance.",
    price: 21000,
    imageUrl: "/assets/generated/product-anniversary.dim_800x800.jpg",
    tags: ["Romance", "Celebration", "Couple"],
    featured: true,
  },
  {
    id: "birthday-joy",
    name: "The Birthday Joy Box",
    description:
      "A joyful celebration in a box — layered with French macarons, a mini bottle of Prosecco, confetti ribbon, and a heartfelt keepsake card. Beautifully wrapped and ready to make someone's day unforgettable.",
    price: 12500,
    imageUrl: "/assets/generated/product-birthday.dim_800x800.jpg",
    tags: ["Birthday", "Celebration", "Sweet"],
    featured: false,
  },
  {
    id: "gratitude-box",
    name: "The Gratitude Gift",
    description:
      "A thoughtful expression of appreciation for someone who truly deserves it. Includes a premium linen notebook, fine writing pen, single-origin tea selection, and a handmade beeswax candle — elegant tokens of a sincere thank you.",
    price: 9500,
    imageUrl: "/assets/generated/product-thank-you.dim_800x800.jpg",
    tags: ["Thank You", "Professional", "Mindful"],
    featured: false,
  },
  {
    id: "mindfulness-wellness",
    name: "The Mindful Moments Box",
    description:
      "A serene invitation to slow down and breathe. Curated for modern lives that need a pause — includes a guided meditation journal, adaptogenic herbal teas, a hand-poured cedarwood candle, and a linen eye pillow filled with lavender. Pure, restorative calm in a box.",
    price: 11500,
    imageUrl: "/assets/generated/product-mindfulness.dim_800x800.jpg",
    tags: ["Wellness", "Mindfulness", "Self-Care"],
    featured: false,
  },
  {
    id: "gourmet-feast",
    name: "The Gourmet Artisan Feast",
    description:
      "A luxurious spread for the food lover who appreciates the finer things. Handpicked small-batch preserves, aged artisan cheeses, truffle-infused crackers, single-origin dark chocolate bars, and a bottle of reserve olive oil — a true celebration of flavour.",
    price: 14500,
    imageUrl: "/assets/generated/product-gourmet.dim_800x800.jpg",
    tags: ["Food", "Gourmet", "Celebration"],
    featured: false,
  },
];

export function useProducts() {
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      // Return sample products (backend methods not yet available)
      return SAMPLE_PRODUCTS;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useProduct(id: string) {
  return useQuery<Product | undefined>({
    queryKey: ["product", id],
    queryFn: async () => {
      return SAMPLE_PRODUCTS.find((p) => p.id === id);
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useFeaturedProducts() {
  return useQuery<Product[]>({
    queryKey: ["products", "featured"],
    queryFn: async () => SAMPLE_PRODUCTS.filter((p) => p.featured),
    staleTime: 1000 * 60 * 5,
  });
}
