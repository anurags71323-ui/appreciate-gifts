import { b as useAuth, j as jsxRuntimeExports, H as Heart, a as Button, S as Skeleton, L as Link, u as useCartStore } from "./index-76_1P84y.js";
import { u as ue } from "./index-DhkD8Vjj.js";
import { a as useProducts, b as useWishlist, T as Tag, S as ShoppingCart } from "./use-wishlist-B2hrR0BS.js";
import { m as motion } from "./proxy-918R0B7u.js";
import "./useMutation-C60F637E.js";
function formatPrice(cents) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(cents / 100);
}
function WishlistCardSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col rounded-xl overflow-hidden border border-border bg-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-square w-full" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 flex flex-col gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-3/4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-1/3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full mt-1" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-full" })
    ] })
  ] });
}
function WishlistProductCard({
  product,
  onRemove
}) {
  const addItem = useCartStore((s) => s.addItem);
  function handleAddToCart(e) {
    e.preventDefault();
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: { duration: 0.5, ease: "easeOut" },
      className: "flex flex-col rounded-xl overflow-hidden border border-border bg-card hover:shadow-card-hover transition-smooth",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/products/$id",
            params: { id: product.id },
            className: "relative overflow-hidden aspect-square bg-muted group block",
            "data-ocid": `wishlist-product-image-${product.id}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: product.imageUrl,
                alt: product.name,
                className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 flex flex-col gap-3 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                to: "/products/$id",
                params: { id: product.id },
                className: "font-display text-base font-semibold text-foreground leading-snug min-w-0 line-clamp-2 hover:text-accent transition-colors",
                children: product.name
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-lg font-bold text-accent shrink-0", children: formatPrice(product.price) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: product.tags.slice(0, 2).map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "inline-flex items-center gap-1 text-[11px] font-body font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded-full",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "h-2.5 w-2.5" }),
                " ",
                tag
              ]
            },
            tag
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-auto flex flex-col gap-2 pt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                className: "w-full bg-accent hover:bg-accent/90 text-accent-foreground font-body font-semibold transition-smooth",
                onClick: handleAddToCart,
                "data-ocid": `wishlist-add-to-cart-${product.id}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "h-3.5 w-3.5 mr-1.5" }),
                  " Add to Cart"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                className: "w-full border-border text-muted-foreground hover:border-destructive hover:text-destructive transition-smooth font-body",
                onClick: () => onRemove(product.id),
                "data-ocid": `wishlist-remove-${product.id}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "h-3.5 w-3.5 mr-1.5 fill-current" }),
                  " Remove from Wishlist"
                ]
              }
            )
          ] })
        ] })
      ]
    }
  );
}
function EmptyWishlist() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5 },
      className: "flex flex-col items-center justify-center gap-6 py-24 text-center",
      "data-ocid": "wishlist-empty",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 rounded-full bg-accent/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "h-10 w-10 text-accent/50" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-semibold text-foreground", children: "Your wishlist is empty" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-body text-base max-w-sm", children: "Save gifts you love and come back to them anytime." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            asChild: true,
            className: "bg-accent hover:bg-accent/90 text-accent-foreground font-body font-semibold px-8 shadow-elevation transition-smooth",
            "data-ocid": "wishlist-browse-cta",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", children: "Browse Gifts" })
          }
        )
      ]
    }
  );
}
function WishlistPage() {
  const { isAuthenticated, isInitializing, login } = useAuth();
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const {
    wishlistItems,
    removeFromWishlist,
    isLoading: wishlistLoading
  } = useWishlist(products);
  const isLoading = isInitializing || productsLoading || wishlistLoading;
  function handleRemove(productId) {
    removeFromWishlist(productId);
    ue.success("Removed from wishlist");
  }
  if (isInitializing) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4 py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(WishlistCardSkeleton, {}, i)) }) });
  }
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 py-24 text-center flex flex-col items-center gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 rounded-full bg-accent/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "h-10 w-10 text-accent/50" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-semibold text-foreground mb-2", children: "Sign in to view your wishlist" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-body", children: "Your saved favourites are waiting for you." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: () => void login(),
          className: "bg-accent hover:bg-accent/90 text-accent-foreground font-body font-semibold px-8 shadow-elevation transition-smooth",
          "data-ocid": "wishlist-login-cta",
          children: "Sign In"
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-border bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4 py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4 },
        className: "flex items-center gap-3",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-full bg-accent/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "h-4.5 w-4.5 text-accent fill-accent/40" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-2xl font-semibold text-foreground", children: [
              "My Wishlist",
              !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-2 text-accent text-xl", children: [
                "(",
                wishlistItems.length,
                " ",
                wishlistItems.length === 1 ? "item" : "items",
                ")"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-body text-sm", children: "Your saved gift sets" })
          ] })
        ]
      }
    ) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4 py-12", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(WishlistCardSkeleton, {}, i)) }) : wishlistItems.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyWishlist, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
        "data-ocid": "wishlist-grid",
        children: wishlistItems.map((product, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.4, delay: i * 0.08 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              WishlistProductCard,
              {
                product,
                onRemove: handleRemove
              }
            )
          },
          product.id
        ))
      }
    ) })
  ] });
}
export {
  WishlistPage as default
};
