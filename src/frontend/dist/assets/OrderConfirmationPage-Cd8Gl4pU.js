import { u as useCartStore, G as reactExports, j as jsxRuntimeExports, a as Button, L as Link } from "./index-B8cGGzHC.js";
import { m as motion } from "./proxy-BLqea3LP.js";
import { C as CircleCheckBig, G as Gift } from "./gift-38M4FrNE.js";
import { A as ArrowRight } from "./arrow-right-BIiNw5qI.js";
function OrderConfirmationPage() {
  const clearCart = useCartStore((s) => s.clearCart);
  reactExports.useEffect(() => {
    clearCart();
  }, [clearCart]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 py-24 flex flex-col items-center text-center gap-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { scale: 0.7, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: { type: "spring", stiffness: 200, damping: 20 },
        className: "h-24 w-24 rounded-full bg-accent/10 border-2 border-accent/20 flex items-center justify-center",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-12 w-12 text-accent" })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, delay: 0.2 },
        className: "flex flex-col gap-4 max-w-md",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-4xl font-semibold text-foreground tracking-tight", children: "Your gift is on its way!" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-body text-base leading-relaxed", children: "Thank you for your order. We're carefully packaging your selections and will send you a shipping confirmation shortly." })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, delay: 0.35 },
        className: "bg-card border border-border rounded-xl p-6 flex flex-col gap-3 max-w-sm w-full",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Gift, { className: "h-5 w-5 text-accent shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-body font-medium text-foreground", children: "Handcrafted packaging with personal touch" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body", children: "Estimated delivery: 3–5 business days. You'll receive a tracking number via email." })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.5, delay: 0.5 },
        className: "flex flex-col sm:flex-row gap-4",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            size: "lg",
            className: "bg-accent hover:bg-accent/90 text-accent-foreground font-body font-semibold transition-smooth",
            asChild: true,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", children: [
              "Continue Shopping ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
            ] })
          }
        )
      }
    )
  ] });
}
export {
  OrderConfirmationPage as default
};
