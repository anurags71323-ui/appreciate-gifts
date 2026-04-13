import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, e as cn, u as useCartStore, f as ShoppingBag, a as Button, L as Link } from "./index-76_1P84y.js";
import { P as Primitive, u as useActor, a as Plus, T as Trash2, b as Package, c as createActor } from "./backend-CFkkoR4-.js";
import { u as useMutation } from "./useMutation-C60F637E.js";
import { u as ue } from "./index-DhkD8Vjj.js";
import { A as ArrowRight } from "./arrow-right-DkYPg6TJ.js";
import { m as motion } from "./proxy-918R0B7u.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [["path", { d: "M5 12h14", key: "1ays0h" }]];
const Minus = createLucideIcon("minus", __iconNode);
var NAME = "Separator";
var DEFAULT_ORIENTATION = "horizontal";
var ORIENTATIONS = ["horizontal", "vertical"];
var Separator$1 = reactExports.forwardRef((props, forwardedRef) => {
  const { decorative, orientation: orientationProp = DEFAULT_ORIENTATION, ...domProps } = props;
  const orientation = isValidOrientation(orientationProp) ? orientationProp : DEFAULT_ORIENTATION;
  const ariaOrientation = orientation === "vertical" ? orientation : void 0;
  const semanticProps = decorative ? { role: "none" } : { "aria-orientation": ariaOrientation, role: "separator" };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Primitive.div,
    {
      "data-orientation": orientation,
      ...semanticProps,
      ...domProps,
      ref: forwardedRef
    }
  );
});
Separator$1.displayName = NAME;
function isValidOrientation(orientation) {
  return ORIENTATIONS.includes(orientation);
}
var Root = Separator$1;
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root,
    {
      "data-slot": "separator",
      decorative,
      orientation,
      className: cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      ),
      ...props
    }
  );
}
function formatPrice(cents) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(cents / 100);
}
function CheckoutPage() {
  const { items, removeItem, updateQuantity, total, itemCount, clearCart } = useCartStore();
  const { actor } = useActor(createActor);
  const createCheckout = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      const shoppingItems = items.map((item) => ({
        currency: "usd",
        productName: item.name,
        productDescription: item.name,
        priceInCents: item.price,
        quantity: BigInt(item.quantity)
      }));
      const result = await actor.createCheckoutSession(
        shoppingItems,
        `${baseUrl}/payment-success`,
        `${baseUrl}/payment-failure`
      );
      const session = JSON.parse(result);
      if (!(session == null ? void 0 : session.url)) throw new Error("Stripe session missing url");
      return session;
    },
    onSuccess: (session) => {
      if (!(session == null ? void 0 : session.url)) {
        ue.error("Could not start checkout. Please try again.");
        return;
      }
      window.location.href = session.url;
    },
    onError: () => {
      ue.error("Checkout is not yet configured. Contact the shop owner.");
    }
  });
  if (itemCount() === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 py-24 flex flex-col items-center text-center gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 rounded-full bg-muted flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-9 w-9 text-muted-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-semibold text-foreground", children: "Your cart is empty" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-body max-w-sm", children: "You haven't added any gifts yet. Browse our curated collections to find something truly special." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          size: "lg",
          className: "bg-accent hover:bg-accent/90 text-accent-foreground font-body font-semibold transition-smooth",
          asChild: true,
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", children: [
            "Browse Gifts ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
          ] })
        }
      )
    ] });
  }
  const subtotal = total();
  const shipping = subtotal >= 1e4 ? 0 : 995;
  const grandTotal = subtotal + shipping;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-background min-h-screen", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 py-12", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-4xl font-semibold text-foreground tracking-tight mb-2", children: "Your Cart" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground font-body mb-10", children: [
            itemCount(),
            " ",
            itemCount() === 1 ? "gift" : "gifts",
            " — almost there"
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 flex flex-col gap-4", children: [
        items.map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, x: -16 },
            animate: { opacity: 1, x: 0 },
            transition: { duration: 0.4, delay: i * 0.07 },
            className: "bg-card border border-border rounded-xl p-5 flex gap-5 items-start",
            "data-ocid": `cart-item-${item.productId}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 rounded-lg overflow-hidden bg-muted shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: item.imageUrl,
                  alt: item.name,
                  className: "w-full h-full object-cover"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Link,
                    {
                      to: "/products/$id",
                      params: { id: item.productId },
                      className: "font-display text-base font-semibold text-foreground leading-snug hover:text-accent transition-colors truncate",
                      children: item.name
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-base font-bold text-accent shrink-0", children: formatPrice(item.price * item.quantity) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground font-body", children: [
                  formatPrice(item.price),
                  " each"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 border border-border rounded-lg overflow-hidden", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "ghost",
                        size: "icon",
                        className: "h-8 w-8 rounded-none hover:bg-muted",
                        onClick: () => updateQuantity(item.productId, item.quantity - 1),
                        "aria-label": "Decrease quantity",
                        "data-ocid": `cart-decrease-${item.productId}`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "h-3.5 w-3.5" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-8 text-center text-sm font-body font-semibold text-foreground", children: item.quantity }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "ghost",
                        size: "icon",
                        className: "h-8 w-8 rounded-none hover:bg-muted",
                        onClick: () => updateQuantity(item.productId, item.quantity + 1),
                        "aria-label": "Increase quantity",
                        "data-ocid": `cart-increase-${item.productId}`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      variant: "ghost",
                      size: "sm",
                      className: "text-muted-foreground hover:text-destructive transition-colors",
                      onClick: () => removeItem(item.productId),
                      "aria-label": `Remove ${item.name}`,
                      "data-ocid": `cart-remove-${item.productId}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 mr-1.5" }),
                        " Remove"
                      ]
                    }
                  )
                ] })
              ] })
            ]
          },
          item.productId
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "ghost",
            className: "self-start text-muted-foreground hover:text-destructive transition-colors font-body text-sm",
            onClick: clearCart,
            "data-ocid": "cart-clear",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5 mr-1.5" }),
              " Clear cart"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay: 0.2 },
          className: "lg:col-span-1",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-6 sticky top-24 flex flex-col gap-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-semibold text-foreground", children: "Order Summary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm font-body text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "Subtotal (",
                  itemCount(),
                  " items)"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatPrice(subtotal) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm font-body text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-3.5 w-3.5" }),
                  " Shipping"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: shipping === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent font-medium", children: "Free" }) : formatPrice(shipping) })
              ] }),
              shipping > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground font-body bg-muted/50 rounded-lg px-3 py-2", children: [
                "Add ",
                formatPrice(1e4 - subtotal),
                " more for free shipping"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between font-body font-semibold text-foreground text-base", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-lg text-accent", children: formatPrice(grandTotal) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "lg",
                className: "bg-accent hover:bg-accent/90 text-accent-foreground font-body font-semibold shadow-elevation transition-smooth w-full",
                onClick: () => createCheckout.mutate(),
                disabled: createCheckout.isPending,
                "data-ocid": "checkout-submit",
                children: createCheckout.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-4 w-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" }),
                  "Preparing checkout..."
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  "Proceed to Payment ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
                ] })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                className: "font-body border-border hover:bg-muted transition-smooth w-full",
                asChild: true,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", children: "Continue Shopping" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-center text-muted-foreground font-body", children: "Secure checkout powered by Stripe. Your payment info is never stored." })
          ] })
        }
      )
    ] })
  ] }) });
}
export {
  CheckoutPage as default
};
