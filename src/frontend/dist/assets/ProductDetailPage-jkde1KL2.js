import { c as createLucideIcon, b as useParams, u as useCartStore, j as jsxRuntimeExports, S as Skeleton, a as Button, L as Link, B as Badge } from "./index-B8cGGzHC.js";
import { u as ue } from "./index-DygYgwOF.js";
import { c as useProduct, d as SAMPLE_PRODUCTS, S as Star, T as Tag, b as ShoppingCart } from "./use-products-BJQOhksZ.js";
import { m as motion } from "./proxy-BLqea3LP.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
];
const ArrowLeft = createLucideIcon("arrow-left", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]];
const ChevronRight = createLucideIcon("chevron-right", __iconNode);
function formatPrice(cents) {
  return `$${(cents / 100).toFixed(0)}`;
}
function RelatedCard({ product }) {
  const addItem = useCartStore((s) => s.addItem);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Link,
    {
      to: "/products/$id",
      params: { id: product.id },
      className: "group flex flex-col rounded-xl overflow-hidden border border-border bg-card hover:shadow-card-hover transition-smooth",
      "data-ocid": `related-product-${product.id}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-square overflow-hidden bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: product.imageUrl,
            alt: product.name,
            className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 flex flex-col gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-sm font-semibold text-foreground line-clamp-2 min-w-0", children: product.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-sm font-bold text-accent shrink-0", children: formatPrice(product.price) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "outline",
              className: "border-accent/40 text-accent hover:bg-accent hover:text-accent-foreground transition-smooth w-full",
              onClick: (e) => {
                e.preventDefault();
                addItem({
                  productId: product.id,
                  name: product.name,
                  price: product.price,
                  quantity: 1,
                  imageUrl: product.imageUrl
                });
                ue.success(`${product.name} added to cart`);
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "h-3.5 w-3.5 mr-1.5" }),
                " Add to Cart"
              ]
            }
          )
        ] })
      ]
    }
  );
}
function ProductDetailPage() {
  const { id } = useParams({ from: "/products/$id" });
  const { data: product, isLoading } = useProduct(id);
  const addItem = useCartStore((s) => s.addItem);
  const related = SAMPLE_PRODUCTS.filter((p) => p.id !== id).slice(0, 3);
  function handleAddToCart() {
    if (!product) return;
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl
    });
    ue.success(`${product.name} added to cart`, {
      description: "View your cart to checkout.",
      action: {
        label: "View Cart",
        onClick: () => window.location.assign("/checkout")
      }
    });
  }
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4 py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-square w-full rounded-2xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-3/4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-1/4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 w-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full" })
      ] })
    ] }) });
  }
  if (!product) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 py-24 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-semibold text-foreground mb-4", children: "Gift not found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-body mb-8", children: "This gift set is no longer available or may have moved." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          asChild: true,
          className: "bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", children: "Browse All Gifts" })
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-border bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "nav",
      {
        className: "flex items-center gap-1.5 text-sm font-body text-muted-foreground",
        "aria-label": "Breadcrumb",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "hover:text-foreground transition-colors", children: "Home" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3.5 w-3.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium line-clamp-1", children: product.name })
        ]
      }
    ) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 py-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/",
          className: "inline-flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground transition-colors mb-8",
          "data-ocid": "product-back",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
            " Back to Collection"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-12 items-start", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, x: -20 },
            animate: { opacity: 1, x: 0 },
            transition: { duration: 0.6 },
            className: "relative",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl overflow-hidden shadow-elevation aspect-square bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: product.imageUrl,
                  alt: product.name,
                  className: "w-full h-full object-cover"
                }
              ) }),
              product.featured && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "absolute top-4 left-4 bg-accent text-accent-foreground text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-subtle", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3 w-3 fill-current" }),
                " Featured"
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, x: 20 },
            animate: { opacity: 1, x: 0 },
            transition: { duration: 0.6, delay: 0.1 },
            className: "flex flex-col gap-6",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5 mb-4", children: product.tags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Badge,
                  {
                    variant: "secondary",
                    className: "font-body font-medium text-xs flex items-center gap-1",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "h-2.5 w-2.5" }),
                      " ",
                      tag
                    ]
                  },
                  tag
                )) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-4xl font-semibold text-foreground leading-tight tracking-tight mb-2", children: product.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-3xl font-bold text-accent", children: formatPrice(product.price) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-border" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-base text-muted-foreground leading-relaxed", children: product.description }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/40 rounded-xl p-5 border border-border flex flex-col gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-sm font-semibold text-foreground mb-1", children: "What's inside" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "flex flex-col gap-1.5", children: [
                  "Artisan hand-selected items",
                  "Premium gift packaging",
                  "Handwritten gift card option",
                  "Free delivery on orders over $100"
                ].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "li",
                  {
                    className: "flex items-center gap-2 text-sm font-body text-muted-foreground",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-accent shrink-0" }),
                      item
                    ]
                  },
                  item
                )) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "lg",
                  className: "bg-accent hover:bg-accent/90 text-accent-foreground font-body font-semibold shadow-elevation transition-smooth w-full",
                  onClick: handleAddToCart,
                  "data-ocid": "product-add-to-cart",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "h-5 w-5 mr-2" }),
                    " Add to Cart —",
                    " ",
                    formatPrice(product.price)
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  size: "lg",
                  className: "border-border hover:bg-muted transition-smooth w-full font-body",
                  asChild: true,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/checkout", children: "Proceed to Checkout" })
                }
              )
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-semibold text-foreground mb-8", children: "You may also love" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-6", children: related.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 16 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true },
            transition: { duration: 0.5, delay: i * 0.1 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(RelatedCard, { product: p })
          },
          p.id
        )) })
      ] })
    ] })
  ] });
}
export {
  ProductDetailPage as default
};
