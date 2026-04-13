import { r as reactExports, j as jsxRuntimeExports, B as Badge, a as Button, S as Skeleton, u as useCartStore, L as Link, b as useAuth, H as Heart } from "./index-76_1P84y.js";
import { u as ue } from "./index-DhkD8Vjj.js";
import { u as useFeaturedProducts, a as useProducts, T as Tag, S as ShoppingCart, b as useWishlist } from "./use-wishlist-B2hrR0BS.js";
import { M as MotionConfigContext, i as isHTMLElement, u as useConstant, P as PresenceContext, a as usePresence, b as useIsomorphicLayoutEffect, L as LayoutGroupContext, m as motion } from "./proxy-918R0B7u.js";
import { A as ArrowRight } from "./arrow-right-DkYPg6TJ.js";
import { S as Star } from "./star-3DEaZTR5.js";
import "./useMutation-C60F637E.js";
function setRef(ref, value) {
  if (typeof ref === "function") {
    return ref(value);
  } else if (ref !== null && ref !== void 0) {
    ref.current = value;
  }
}
function composeRefs(...refs) {
  return (node) => {
    let hasCleanup = false;
    const cleanups = refs.map((ref) => {
      const cleanup = setRef(ref, node);
      if (!hasCleanup && typeof cleanup === "function") {
        hasCleanup = true;
      }
      return cleanup;
    });
    if (hasCleanup) {
      return () => {
        for (let i = 0; i < cleanups.length; i++) {
          const cleanup = cleanups[i];
          if (typeof cleanup === "function") {
            cleanup();
          } else {
            setRef(refs[i], null);
          }
        }
      };
    }
  };
}
function useComposedRefs(...refs) {
  return reactExports.useCallback(composeRefs(...refs), refs);
}
class PopChildMeasure extends reactExports.Component {
  getSnapshotBeforeUpdate(prevProps) {
    const element = this.props.childRef.current;
    if (isHTMLElement(element) && prevProps.isPresent && !this.props.isPresent && this.props.pop !== false) {
      const parent = element.offsetParent;
      const parentWidth = isHTMLElement(parent) ? parent.offsetWidth || 0 : 0;
      const parentHeight = isHTMLElement(parent) ? parent.offsetHeight || 0 : 0;
      const computedStyle = getComputedStyle(element);
      const size = this.props.sizeRef.current;
      size.height = parseFloat(computedStyle.height);
      size.width = parseFloat(computedStyle.width);
      size.top = element.offsetTop;
      size.left = element.offsetLeft;
      size.right = parentWidth - size.width - size.left;
      size.bottom = parentHeight - size.height - size.top;
    }
    return null;
  }
  /**
   * Required with getSnapshotBeforeUpdate to stop React complaining.
   */
  componentDidUpdate() {
  }
  render() {
    return this.props.children;
  }
}
function PopChild({ children, isPresent, anchorX, anchorY, root, pop }) {
  var _a;
  const id = reactExports.useId();
  const ref = reactExports.useRef(null);
  const size = reactExports.useRef({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  });
  const { nonce } = reactExports.useContext(MotionConfigContext);
  const childRef = ((_a = children.props) == null ? void 0 : _a.ref) ?? (children == null ? void 0 : children.ref);
  const composedRef = useComposedRefs(ref, childRef);
  reactExports.useInsertionEffect(() => {
    const { width, height, top, left, right, bottom } = size.current;
    if (isPresent || pop === false || !ref.current || !width || !height)
      return;
    const x = anchorX === "left" ? `left: ${left}` : `right: ${right}`;
    const y = anchorY === "bottom" ? `bottom: ${bottom}` : `top: ${top}`;
    ref.current.dataset.motionPopId = id;
    const style = document.createElement("style");
    if (nonce)
      style.nonce = nonce;
    const parent = root ?? document.head;
    parent.appendChild(style);
    if (style.sheet) {
      style.sheet.insertRule(`
          [data-motion-pop-id="${id}"] {
            position: absolute !important;
            width: ${width}px !important;
            height: ${height}px !important;
            ${x}px !important;
            ${y}px !important;
          }
        `);
    }
    return () => {
      var _a2;
      (_a2 = ref.current) == null ? void 0 : _a2.removeAttribute("data-motion-pop-id");
      if (parent.contains(style)) {
        parent.removeChild(style);
      }
    };
  }, [isPresent]);
  return jsxRuntimeExports.jsx(PopChildMeasure, { isPresent, childRef: ref, sizeRef: size, pop, children: pop === false ? children : reactExports.cloneElement(children, { ref: composedRef }) });
}
const PresenceChild = ({ children, initial, isPresent, onExitComplete, custom, presenceAffectsLayout, mode, anchorX, anchorY, root }) => {
  const presenceChildren = useConstant(newChildrenMap);
  const id = reactExports.useId();
  let isReusedContext = true;
  let context = reactExports.useMemo(() => {
    isReusedContext = false;
    return {
      id,
      initial,
      isPresent,
      custom,
      onExitComplete: (childId) => {
        presenceChildren.set(childId, true);
        for (const isComplete of presenceChildren.values()) {
          if (!isComplete)
            return;
        }
        onExitComplete && onExitComplete();
      },
      register: (childId) => {
        presenceChildren.set(childId, false);
        return () => presenceChildren.delete(childId);
      }
    };
  }, [isPresent, presenceChildren, onExitComplete]);
  if (presenceAffectsLayout && isReusedContext) {
    context = { ...context };
  }
  reactExports.useMemo(() => {
    presenceChildren.forEach((_, key) => presenceChildren.set(key, false));
  }, [isPresent]);
  reactExports.useEffect(() => {
    !isPresent && !presenceChildren.size && onExitComplete && onExitComplete();
  }, [isPresent]);
  children = jsxRuntimeExports.jsx(PopChild, { pop: mode === "popLayout", isPresent, anchorX, anchorY, root, children });
  return jsxRuntimeExports.jsx(PresenceContext.Provider, { value: context, children });
};
function newChildrenMap() {
  return /* @__PURE__ */ new Map();
}
const getChildKey = (child) => child.key || "";
function onlyElements(children) {
  const filtered = [];
  reactExports.Children.forEach(children, (child) => {
    if (reactExports.isValidElement(child))
      filtered.push(child);
  });
  return filtered;
}
const AnimatePresence = ({ children, custom, initial = true, onExitComplete, presenceAffectsLayout = true, mode = "sync", propagate = false, anchorX = "left", anchorY = "top", root }) => {
  const [isParentPresent, safeToRemove] = usePresence(propagate);
  const presentChildren = reactExports.useMemo(() => onlyElements(children), [children]);
  const presentKeys = propagate && !isParentPresent ? [] : presentChildren.map(getChildKey);
  const isInitialRender = reactExports.useRef(true);
  const pendingPresentChildren = reactExports.useRef(presentChildren);
  const exitComplete = useConstant(() => /* @__PURE__ */ new Map());
  const exitingComponents = reactExports.useRef(/* @__PURE__ */ new Set());
  const [diffedChildren, setDiffedChildren] = reactExports.useState(presentChildren);
  const [renderedChildren, setRenderedChildren] = reactExports.useState(presentChildren);
  useIsomorphicLayoutEffect(() => {
    isInitialRender.current = false;
    pendingPresentChildren.current = presentChildren;
    for (let i = 0; i < renderedChildren.length; i++) {
      const key = getChildKey(renderedChildren[i]);
      if (!presentKeys.includes(key)) {
        if (exitComplete.get(key) !== true) {
          exitComplete.set(key, false);
        }
      } else {
        exitComplete.delete(key);
        exitingComponents.current.delete(key);
      }
    }
  }, [renderedChildren, presentKeys.length, presentKeys.join("-")]);
  const exitingChildren = [];
  if (presentChildren !== diffedChildren) {
    let nextChildren = [...presentChildren];
    for (let i = 0; i < renderedChildren.length; i++) {
      const child = renderedChildren[i];
      const key = getChildKey(child);
      if (!presentKeys.includes(key)) {
        nextChildren.splice(i, 0, child);
        exitingChildren.push(child);
      }
    }
    if (mode === "wait" && exitingChildren.length) {
      nextChildren = exitingChildren;
    }
    setRenderedChildren(onlyElements(nextChildren));
    setDiffedChildren(presentChildren);
    return null;
  }
  const { forceRender } = reactExports.useContext(LayoutGroupContext);
  return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: renderedChildren.map((child) => {
    const key = getChildKey(child);
    const isPresent = propagate && !isParentPresent ? false : presentChildren === renderedChildren || presentKeys.includes(key);
    const onExit = () => {
      if (exitingComponents.current.has(key)) {
        return;
      }
      if (exitComplete.has(key)) {
        exitingComponents.current.add(key);
        exitComplete.set(key, true);
      } else {
        return;
      }
      let isEveryExitComplete = true;
      exitComplete.forEach((isExitComplete) => {
        if (!isExitComplete)
          isEveryExitComplete = false;
      });
      if (isEveryExitComplete) {
        forceRender == null ? void 0 : forceRender();
        setRenderedChildren(pendingPresentChildren.current);
        propagate && (safeToRemove == null ? void 0 : safeToRemove());
        onExitComplete && onExitComplete();
      }
    };
    return jsxRuntimeExports.jsx(PresenceChild, { isPresent, initial: !isInitialRender.current || initial ? void 0 : false, custom, presenceAffectsLayout, mode, root, onExitComplete: isPresent ? void 0 : onExit, anchorX, anchorY, children: child }, key);
  }) });
};
const OCCASIONS = [
  {
    label: "Birthday",
    imageUrl: "/assets/generated/occasion-birthday.dim_600x400.jpg",
    slug: "birthday"
  },
  {
    label: "Anniversary",
    imageUrl: "/assets/generated/occasion-anniversary.dim_600x400.jpg",
    slug: "anniversary"
  },
  {
    label: "Thank You",
    imageUrl: "/assets/generated/occasion-thankyou.dim_600x400.jpg",
    slug: "thank-you"
  },
  {
    label: "Wedding",
    imageUrl: "/assets/generated/occasion-wedding.dim_600x400.jpg",
    slug: "wedding"
  }
];
function formatPrice(cents) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(cents / 100);
}
function ProductCardSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col rounded-xl overflow-hidden border border-border bg-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-square w-full" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 flex flex-col gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-3/4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-2/3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full mt-2" })
    ] })
  ] });
}
function WishlistHeartButton({ product }) {
  const { isAuthenticated, login } = useAuth();
  const { data: allProducts = [] } = useProducts();
  const { isInWishlist, toggleWishlist, isLoading } = useWishlist(allProducts);
  const [showLoginHint, setShowLoginHint] = reactExports.useState(false);
  const inWishlist = isInWishlist(product.id);
  function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      setShowLoginHint(true);
      setTimeout(() => setShowLoginHint(false), 2500);
      return;
    }
    toggleWishlist(product.id);
    if (!inWishlist) {
      ue.success("Saved to wishlist", {
        description: product.name,
        action: {
          label: "View Wishlist",
          onClick: () => window.location.assign("/wishlist")
        }
      });
    } else {
      ue.success("Removed from wishlist");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: handleClick,
        disabled: isLoading,
        "aria-label": inWishlist ? "Remove from wishlist" : "Save to wishlist",
        className: `h-8 w-8 rounded-full flex items-center justify-center transition-smooth shadow-subtle border ${inWishlist ? "bg-accent/10 border-accent/40 text-accent hover:bg-accent/20" : "bg-card border-border text-muted-foreground hover:border-accent/40 hover:text-accent"} disabled:opacity-50 disabled:cursor-not-allowed`,
        "data-ocid": `wishlist-heart-${product.id}`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Heart,
          {
            className: `h-4 w-4 transition-all duration-200 ${inWishlist ? "fill-accent stroke-accent scale-110" : "fill-transparent"}`
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: showLoginHint && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 4, scale: 0.95 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 4, scale: 0.95 },
        transition: { duration: 0.15 },
        className: "absolute right-0 top-10 z-20 bg-card border border-border rounded-lg px-3 py-2 shadow-elevation w-max max-w-[180px]",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-body text-foreground leading-snug mb-1.5", children: "Sign in to save favorites" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: (e) => {
                e.preventDefault();
                e.stopPropagation();
                void login();
              },
              className: "text-xs font-body font-semibold text-accent hover:text-accent/80 transition-colors",
              children: "Sign in →"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-1.5 right-2.5 h-2.5 w-2.5 bg-card border-t border-l border-border rotate-45" })
        ]
      }
    ) })
  ] });
}
function ProductCard({ product }) {
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
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: { duration: 0.5, ease: "easeOut" },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/products/$id",
          params: { id: product.id },
          className: "group flex flex-col rounded-xl overflow-hidden border border-border bg-card hover:shadow-card-hover transition-smooth block",
          "data-ocid": `product-card-${product.id}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden aspect-square bg-muted", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: product.imageUrl,
                  alt: product.name,
                  className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                }
              ),
              product.featured && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "absolute top-3 left-3 bg-accent text-accent-foreground text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-2.5 w-2.5 fill-current" }),
                " Featured"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "absolute top-3 right-3",
                  onClick: (e) => e.preventDefault(),
                  onKeyDown: (e) => e.preventDefault(),
                  role: "presentation",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(WishlistHeartButton, { product })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 flex flex-col gap-3 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-base font-semibold text-foreground leading-snug min-w-0 line-clamp-2", children: product.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-lg font-bold text-accent shrink-0", children: formatPrice(product.price) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: product.tags.slice(0, 3).map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
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
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-body text-muted-foreground line-clamp-2 leading-relaxed", children: product.description }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-auto flex gap-2 pt-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    className: "flex-1 border-accent/40 text-accent hover:bg-accent hover:text-accent-foreground transition-smooth",
                    onClick: handleAddToCart,
                    "data-ocid": `add-to-cart-${product.id}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "h-3.5 w-3.5 mr-1.5" }),
                      " Add to Cart"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "sm",
                    className: "shrink-0 text-muted-foreground hover:text-foreground",
                    asChild: true,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "View ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3.5 w-3.5 ml-0.5" })
                    ] })
                  }
                )
              ] })
            ] })
          ]
        }
      )
    }
  );
}
function HeroSection() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "relative bg-muted/30 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4 py-16 md:py-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-12 items-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, x: -30 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.7, ease: "easeOut" },
        className: "flex flex-col gap-6",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "w-fit bg-accent/10 text-accent border-accent/30 font-body font-medium", children: "Curated with Intention" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-5xl md:text-6xl font-semibold text-foreground leading-[1.1] tracking-tight", children: [
            "Gifts of Distinction, ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx("em", { className: "not-italic text-accent", children: "Crafted with Care" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg text-muted-foreground font-body leading-relaxed max-w-md", children: "Discover meaningful treasures for moments that matter. Thoughtfully curated for every celebration." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-4 mt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "lg",
                className: "bg-accent hover:bg-accent/90 text-accent-foreground font-body font-semibold px-8 shadow-elevation transition-smooth",
                onClick: () => {
                  var _a;
                  return (_a = document.getElementById("catalog")) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
                },
                "data-ocid": "hero-shop-cta",
                children: [
                  "Shop The Collection ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                size: "lg",
                className: "font-body border-border hover:bg-muted transition-smooth",
                onClick: () => {
                  var _a;
                  return (_a = document.getElementById("occasions")) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
                },
                "data-ocid": "hero-occasions-cta",
                children: "Browse by Occasion"
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, scale: 0.96 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.8, delay: 0.15, ease: "easeOut" },
        className: "relative",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl overflow-hidden shadow-elevation aspect-[4/3]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: "/assets/generated/hero-gift-box.dim_1400x900.jpg",
              alt: "Luxurious gift box arrangement",
              className: "w-full h-full object-cover"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute -bottom-4 -left-4 bg-card rounded-xl shadow-elevation p-4 flex items-center gap-3 border border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-5 w-5 text-accent fill-accent/30" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-body font-semibold text-foreground", children: "Premium Curation" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground font-body", children: "Every box hand-selected" })
            ] })
          ] })
        ]
      }
    )
  ] }) }) });
}
function FeaturedSection() {
  const { data: products, isLoading } = useFeaturedProducts();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "featured", className: "bg-background py-16 md:py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 16 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.5 },
        className: "text-center mb-12",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-4xl font-semibold text-foreground tracking-tight mb-3", children: "Featured Curations" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-body text-base max-w-lg mx-auto", children: "Our most beloved collections — each one a carefully composed story of thoughtfulness." })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6", children: isLoading ? [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCardSkeleton, {}, i)) : (products ?? []).map((product, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.5, delay: i * 0.1 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { product })
      },
      product.id
    )) })
  ] }) });
}
function OccasionsSection() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "occasions", className: "bg-muted/30 py-16 md:py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 16 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.5 },
        className: "text-center mb-12",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-4xl font-semibold text-foreground tracking-tight mb-3", children: "Curated By Occasion" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-body text-base max-w-lg mx-auto", children: "Every milestone deserves its perfect gift. Explore collections shaped around life's special moments." })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-5", children: OCCASIONS.map((occasion, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.button,
      {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.5, delay: i * 0.1 },
        onClick: () => {
          var _a;
          return (_a = document.getElementById("catalog")) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
        },
        className: "group relative rounded-xl overflow-hidden aspect-[4/3] cursor-pointer shadow-subtle hover:shadow-card-hover transition-smooth",
        "data-ocid": `occasion-${occasion.slug}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: occasion.imageUrl,
              alt: occasion.label,
              className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/10 to-transparent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute bottom-3 left-0 right-0 text-center font-display text-base font-semibold text-primary-foreground tracking-wide drop-shadow", children: occasion.label })
        ]
      },
      occasion.slug
    )) })
  ] }) });
}
function CatalogSection() {
  const { data: products, isLoading } = useProducts();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "catalog", className: "bg-background py-16 md:py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 16 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.5 },
        className: "flex items-end justify-between mb-10 gap-4",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-4xl font-semibold text-foreground tracking-tight mb-2", children: "The Full Collection" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-body text-base", children: "Browse every curated gift set, each thoughtfully assembled to impress." })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6", children: isLoading ? [1, 2, 3, 4, 5, 6].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCardSkeleton, {}, i)) : (products ?? []).map((product) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { product }, product.id)) })
  ] }) });
}
function AboutSection() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "section",
    {
      id: "about",
      className: "bg-card border-y border-border py-16 md:py-20",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-2xl mx-auto text-center flex flex-col gap-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 16 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration: 0.5 },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block text-accent font-body font-semibold text-sm tracking-widest uppercase mb-3", children: "Our Philosophy" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-4xl font-semibold text-foreground tracking-tight mb-4", children: "Gifting That Truly Appreciates" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-body text-base leading-relaxed", children: "We believe that meaningful gifts are more than beautiful objects — they're expressions of care, intention, and connection. Every Appreciate box is assembled by hand with an eye for quality, sustainability, and surprise." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-body text-base leading-relaxed mt-4", children: "From artisan producers to independent makers, we partner exclusively with brands who share our commitment to excellence and warmth. Because giving should feel just as wonderful as receiving." })
          ]
        }
      ) }) })
    }
  );
}
function HomePage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(HeroSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FeaturedSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(OccasionsSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CatalogSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AboutSection, {})
  ] });
}
export {
  HomePage as default
};
