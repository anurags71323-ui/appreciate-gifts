import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, ChevronRight, ShoppingCart, Star, Tag } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { SAMPLE_PRODUCTS, useProduct } from "../hooks/use-products";
import { useCartStore } from "../store/cart";
import type { Product } from "../types";

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(0)}`;
}

function RelatedCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  return (
    <Link
      to="/products/$id"
      params={{ id: product.id }}
      className="group flex flex-col rounded-xl overflow-hidden border border-border bg-card hover:shadow-card-hover transition-smooth"
      data-ocid={`related-product-${product.id}`}
    >
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <p className="font-display text-sm font-semibold text-foreground line-clamp-2 min-w-0">
            {product.name}
          </p>
          <span className="font-display text-sm font-bold text-accent shrink-0">
            {formatPrice(product.price)}
          </span>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="border-accent/40 text-accent hover:bg-accent hover:text-accent-foreground transition-smooth w-full"
          onClick={(e) => {
            e.preventDefault();
            addItem({
              productId: product.id,
              name: product.name,
              price: product.price,
              quantity: 1,
              imageUrl: product.imageUrl,
            });
            toast.success(`${product.name} added to cart`);
          }}
        >
          <ShoppingCart className="h-3.5 w-3.5 mr-1.5" /> Add to Cart
        </Button>
      </div>
    </Link>
  );
}

export default function ProductDetailPage() {
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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="flex flex-col gap-5">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-semibold text-foreground mb-4">
          Gift not found
        </h1>
        <p className="text-muted-foreground font-body mb-8">
          This gift set is no longer available or may have moved.
        </p>
        <Button
          asChild
          className="bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth"
        >
          <Link to="/">Browse All Gifts</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-background">
      {/* Breadcrumb */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-3">
          <nav
            className="flex items-center gap-1.5 text-sm font-body text-muted-foreground"
            aria-label="Breadcrumb"
          >
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground font-medium line-clamp-1">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground transition-colors mb-8"
          data-ocid="product-back"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Collection
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden shadow-elevation aspect-square bg-muted">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.featured && (
              <span className="absolute top-4 left-4 bg-accent text-accent-foreground text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-subtle">
                <Star className="h-3 w-3 fill-current" /> Featured
              </span>
            )}
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col gap-6"
          >
            <div>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {product.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="font-body font-medium text-xs flex items-center gap-1"
                  >
                    <Tag className="h-2.5 w-2.5" /> {tag}
                  </Badge>
                ))}
              </div>
              <h1 className="font-display text-4xl font-semibold text-foreground leading-tight tracking-tight mb-2">
                {product.name}
              </h1>
              <p className="font-display text-3xl font-bold text-accent">
                {formatPrice(product.price)}
              </p>
            </div>

            <div className="h-px bg-border" />

            <p className="font-body text-base text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            <div className="bg-muted/40 rounded-xl p-5 border border-border flex flex-col gap-2">
              <p className="font-body text-sm font-semibold text-foreground mb-1">
                What's inside
              </p>
              <ul className="flex flex-col gap-1.5">
                {[
                  "Artisan hand-selected items",
                  "Premium gift packaging",
                  "Handwritten gift card option",
                  "Free delivery on orders over $100",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm font-body text-muted-foreground"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-body font-semibold shadow-elevation transition-smooth w-full"
              onClick={handleAddToCart}
              data-ocid="product-add-to-cart"
            >
              <ShoppingCart className="h-5 w-5 mr-2" /> Add to Cart —{" "}
              {formatPrice(product.price)}
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="border-border hover:bg-muted transition-smooth w-full font-body"
              asChild
            >
              <Link to="/checkout">Proceed to Checkout</Link>
            </Button>
          </motion.div>
        </div>

        {/* Related products */}
        <section className="mt-20">
          <h2 className="font-display text-2xl font-semibold text-foreground mb-8">
            You may also love
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {related.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <RelatedCard product={p} />
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
