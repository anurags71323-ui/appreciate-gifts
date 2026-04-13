import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { Heart, ShoppingCart, Tag } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useAuth } from "../hooks/use-auth";
import { useProducts } from "../hooks/use-products";
import { useWishlist } from "../hooks/use-wishlist";
import { useCartStore } from "../store/cart";
import type { Product } from "../types";

function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function WishlistCardSkeleton() {
  return (
    <div className="flex flex-col rounded-xl overflow-hidden border border-border bg-card">
      <Skeleton className="aspect-square w-full" />
      <div className="p-5 flex flex-col gap-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-10 w-full mt-1" />
        <Skeleton className="h-9 w-full" />
      </div>
    </div>
  );
}

function WishlistProductCard({
  product,
  onRemove,
}: {
  product: Product;
  onRemove: (id: string) => void;
}) {
  const addItem = useCartStore((s) => s.addItem);

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl,
    });
    toast.success(`${product.name} added to cart`, {
      description: "View your cart to checkout.",
      action: {
        label: "View Cart",
        onClick: () => window.location.assign("/checkout"),
      },
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col rounded-xl overflow-hidden border border-border bg-card hover:shadow-card-hover transition-smooth"
    >
      <Link
        to="/products/$id"
        params={{ id: product.id }}
        className="relative overflow-hidden aspect-square bg-muted group block"
        data-ocid={`wishlist-product-image-${product.id}`}
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <Link
            to="/products/$id"
            params={{ id: product.id }}
            className="font-display text-base font-semibold text-foreground leading-snug min-w-0 line-clamp-2 hover:text-accent transition-colors"
          >
            {product.name}
          </Link>
          <span className="font-display text-lg font-bold text-accent shrink-0">
            {formatPrice(product.price)}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {product.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 text-[11px] font-body font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded-full"
            >
              <Tag className="h-2.5 w-2.5" /> {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto flex flex-col gap-2 pt-1">
          <Button
            size="sm"
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-body font-semibold transition-smooth"
            onClick={handleAddToCart}
            data-ocid={`wishlist-add-to-cart-${product.id}`}
          >
            <ShoppingCart className="h-3.5 w-3.5 mr-1.5" /> Add to Cart
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full border-border text-muted-foreground hover:border-destructive hover:text-destructive transition-smooth font-body"
            onClick={() => onRemove(product.id)}
            data-ocid={`wishlist-remove-${product.id}`}
          >
            <Heart className="h-3.5 w-3.5 mr-1.5 fill-current" /> Remove from
            Wishlist
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function EmptyWishlist() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center gap-6 py-24 text-center"
      data-ocid="wishlist-empty"
    >
      <div className="h-20 w-20 rounded-full bg-accent/10 flex items-center justify-center">
        <Heart className="h-10 w-10 text-accent/50" />
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="font-display text-2xl font-semibold text-foreground">
          Your wishlist is empty
        </h2>
        <p className="text-muted-foreground font-body text-base max-w-sm">
          Save gifts you love and come back to them anytime.
        </p>
      </div>
      <Button
        asChild
        className="bg-accent hover:bg-accent/90 text-accent-foreground font-body font-semibold px-8 shadow-elevation transition-smooth"
        data-ocid="wishlist-browse-cta"
      >
        <Link to="/">Browse Gifts</Link>
      </Button>
    </motion.div>
  );
}

export default function WishlistPage() {
  const { isAuthenticated, isInitializing, login } = useAuth();
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const {
    wishlistItems,
    removeFromWishlist,
    isLoading: wishlistLoading,
  } = useWishlist(products);

  const isLoading = isInitializing || productsLoading || wishlistLoading;

  function handleRemove(productId: string) {
    removeFromWishlist(productId);
    toast.success("Removed from wishlist");
  }

  // Show login prompt while checking auth
  if (isInitializing) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {[1, 2, 3].map((i) => (
            <WishlistCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-24 text-center flex flex-col items-center gap-6">
        <div className="h-20 w-20 rounded-full bg-accent/10 flex items-center justify-center">
          <Heart className="h-10 w-10 text-accent/50" />
        </div>
        <div>
          <h1 className="font-display text-3xl font-semibold text-foreground mb-2">
            Sign in to view your wishlist
          </h1>
          <p className="text-muted-foreground font-body">
            Your saved favourites are waiting for you.
          </p>
        </div>
        <Button
          onClick={() => void login()}
          className="bg-accent hover:bg-accent/90 text-accent-foreground font-body font-semibold px-8 shadow-elevation transition-smooth"
          data-ocid="wishlist-login-cta"
        >
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-3"
          >
            <div className="h-9 w-9 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
              <Heart className="h-4.5 w-4.5 text-accent fill-accent/40" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-semibold text-foreground">
                My Wishlist
                {!isLoading && (
                  <span className="ml-2 text-accent text-xl">
                    ({wishlistItems.length}{" "}
                    {wishlistItems.length === 1 ? "item" : "items"})
                  </span>
                )}
              </h1>
              <p className="text-muted-foreground font-body text-sm">
                Your saved gift sets
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <WishlistCardSkeleton key={i} />
            ))}
          </div>
        ) : wishlistItems.length === 0 ? (
          <EmptyWishlist />
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            data-ocid="wishlist-grid"
          >
            {wishlistItems.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <WishlistProductCard
                  product={product}
                  onRemove={handleRemove}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
