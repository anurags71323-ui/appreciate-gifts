import { c as createLucideIcon, j as jsxRuntimeExports, a as Button, L as Link, f as ShoppingBag } from "./index-76_1P84y.js";
import { m as motion } from "./proxy-918R0B7u.js";
import { A as ArrowRight } from "./arrow-right-DkYPg6TJ.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }]
];
const CircleX = createLucideIcon("circle-x", __iconNode);
function PaymentFailurePage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 py-24 flex flex-col items-center text-center gap-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { scale: 0.7, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: { type: "spring", stiffness: 200, damping: 20 },
        className: "h-24 w-24 rounded-full bg-destructive/10 border-2 border-destructive/20 flex items-center justify-center",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-12 w-12 text-destructive" })
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
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-4xl font-semibold text-foreground tracking-tight", children: "Payment was not completed" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-body text-base leading-relaxed", children: "Your payment was cancelled or unsuccessful. Your cart has been saved — you can try again whenever you're ready." })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.5, delay: 0.4 },
        className: "flex flex-col sm:flex-row gap-4",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "lg",
              className: "bg-accent hover:bg-accent/90 text-accent-foreground font-body font-semibold transition-smooth",
              asChild: true,
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/checkout", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "mr-2 h-4 w-4" }),
                " Return to Cart"
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "lg",
              className: "font-body border-border hover:bg-muted transition-smooth",
              asChild: true,
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", children: [
                "Browse Gifts ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
              ] })
            }
          )
        ]
      }
    )
  ] });
}
export {
  PaymentFailurePage as default
};
