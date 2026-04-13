import { c as createLucideIcon } from "./index-B8cGGzHC.js";
import { a as useQuery } from "./index-DygYgwOF.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["circle", { cx: "8", cy: "21", r: "1", key: "jimo8o" }],
  ["circle", { cx: "19", cy: "21", r: "1", key: "13723u" }],
  [
    "path",
    {
      d: "M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12",
      key: "9zh506"
    }
  ]
];
const ShoppingCart = createLucideIcon("shopping-cart", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",
      key: "r04s7s"
    }
  ]
];
const Star = createLucideIcon("star", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z",
      key: "vktsd0"
    }
  ],
  ["circle", { cx: "7.5", cy: "7.5", r: ".5", fill: "currentColor", key: "kqv944" }]
];
const Tag = createLucideIcon("tag", __iconNode);
const SAMPLE_PRODUCTS = [
  {
    id: "spa-retreat",
    name: "The Signature Spa Retreat",
    description: "A deeply restorative collection of artisan bath and body luxuries, thoughtfully assembled to transform any home into a personal sanctuary. Includes hand-poured soy candles, mineral bath salts, rose quartz roller, and organic skincare essentials.",
    price: 16500,
    imageUrl: "/assets/generated/product-spa-retreat.dim_800x800.jpg",
    tags: ["Self-Care", "Relaxation", "Her"],
    featured: true
  },
  {
    id: "gentleman-study",
    name: "The Gentleman's Study",
    description: "A distinguished collection for the discerning gentleman. Premium leather journal, single malt Scotch whisky miniatures, artisan dark chocolate, and a hand-rolled beeswax candle — everything needed to turn a quiet evening into a refined ritual.",
    price: 18e3,
    imageUrl: "/assets/generated/product-gentleman-study.dim_800x800.jpg",
    tags: ["Him", "Sophistication", "Spirits"],
    featured: true
  },
  {
    id: "new-parent",
    name: "The New Parent Bundle",
    description: "A gentle, heartfelt welcome for the world's newest arrival and the remarkable people raising them. Organic cotton swaddle, calming lavender lotion, a whimsical plush companion, and a restorative tea blend for tired, wonderful parents.",
    price: 15e3,
    imageUrl: "/assets/generated/product-new-parent.dim_800x800.jpg",
    tags: ["Baby", "Family", "Wellness"],
    featured: true
  },
  {
    id: "anniversary-celebration",
    name: "The Anniversary Celebration",
    description: "Mark another chapter together with this sparkling tribute to love. Includes a small-batch Champagne, hand-crafted Belgian chocolates, preserved rose petals, and crystal flutes etched with subtle elegance.",
    price: 21e3,
    imageUrl: "/assets/generated/product-anniversary.dim_800x800.jpg",
    tags: ["Romance", "Celebration", "Couple"],
    featured: true
  },
  {
    id: "birthday-joy",
    name: "The Birthday Joy Box",
    description: "A joyful celebration in a box — layered with French macarons, a mini bottle of Prosecco, confetti ribbon, and a heartfelt keepsake card. Beautifully wrapped and ready to make someone's day unforgettable.",
    price: 12500,
    imageUrl: "/assets/generated/product-birthday.dim_800x800.jpg",
    tags: ["Birthday", "Celebration", "Sweet"],
    featured: false
  },
  {
    id: "gratitude-box",
    name: "The Gratitude Gift",
    description: "A thoughtful expression of appreciation for someone who truly deserves it. Includes a premium linen notebook, fine writing pen, single-origin tea selection, and a handmade beeswax candle — elegant tokens of a sincere thank you.",
    price: 9500,
    imageUrl: "/assets/generated/product-thank-you.dim_800x800.jpg",
    tags: ["Thank You", "Professional", "Mindful"],
    featured: false
  },
  {
    id: "mindfulness-wellness",
    name: "The Mindful Moments Box",
    description: "A serene invitation to slow down and breathe. Curated for modern lives that need a pause — includes a guided meditation journal, adaptogenic herbal teas, a hand-poured cedarwood candle, and a linen eye pillow filled with lavender. Pure, restorative calm in a box.",
    price: 11500,
    imageUrl: "/assets/generated/product-mindfulness.dim_800x800.jpg",
    tags: ["Wellness", "Mindfulness", "Self-Care"],
    featured: false
  },
  {
    id: "gourmet-feast",
    name: "The Gourmet Artisan Feast",
    description: "A luxurious spread for the food lover who appreciates the finer things. Handpicked small-batch preserves, aged artisan cheeses, truffle-infused crackers, single-origin dark chocolate bars, and a bottle of reserve olive oil — a true celebration of flavour.",
    price: 14500,
    imageUrl: "/assets/generated/product-gourmet.dim_800x800.jpg",
    tags: ["Food", "Gourmet", "Celebration"],
    featured: false
  }
];
function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      return SAMPLE_PRODUCTS;
    },
    staleTime: 1e3 * 60 * 5
  });
}
function useProduct(id) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      return SAMPLE_PRODUCTS.find((p) => p.id === id);
    },
    staleTime: 1e3 * 60 * 5
  });
}
function useFeaturedProducts() {
  return useQuery({
    queryKey: ["products", "featured"],
    queryFn: async () => SAMPLE_PRODUCTS.filter((p) => p.featured),
    staleTime: 1e3 * 60 * 5
  });
}
export {
  Star as S,
  Tag as T,
  useProducts as a,
  ShoppingCart as b,
  useProduct as c,
  SAMPLE_PRODUCTS as d,
  useFeaturedProducts as u
};
