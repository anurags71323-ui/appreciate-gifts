import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ShoppingCart, Star, Tag } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useFeaturedProducts, useProducts } from "../hooks/use-products";
import { useCartStore } from "../store/cart";
import type { OccasionCategory, Product } from "../types";

const OCCASIONS: OccasionCategory[] = [
  {
    label: "Birthday",
    imageUrl: "/assets/generated/occasion-birthday.dim_600x400.jpg",
    slug: "birthday",
  },
  {
    label: "Anniversary",
    imageUrl: "/assets/generated/occasion-anniversary.dim_600x400.jpg",
    slug: "anniversary",
  },
  {
    label: "Thank You",
    imageUrl: "/assets/generated/occasion-thankyou.dim_600x400.jpg",
    slug: "thank-you",
  },
  {
    label: "Wedding",
    imageUrl: "/assets/generated/occasion-wedding.dim_600x400.jpg",
    slug: "wedding",
  },
];

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(0)}`;
}

function ProductCardSkeleton() {
  return (
    <div className="flex flex-col rounded-xl overflow-hidden border border-border bg-card">
      <Skeleton className="aspect-square w-full" />
      <div className="p-5 flex flex-col gap-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-10 w-full mt-2" />
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
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
    >
      <Link
        to="/products/$id"
        params={{ id: product.id }}
        className="group flex flex-col rounded-xl overflow-hidden border border-border bg-card hover:shadow-card-hover transition-smooth block"
        data-ocid={`product-card-${product.id}`}
      >
        <div className="relative overflow-hidden aspect-square bg-muted">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {product.featured && (
            <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1">
              <Star className="h-2.5 w-2.5 fill-current" /> Featured
            </span>
          )}
        </div>

        <div className="p-5 flex flex-col gap-3 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-base font-semibold text-foreground leading-snug min-w-0 line-clamp-2">
              {product.name}
            </h3>
            <span className="font-display text-lg font-bold text-accent shrink-0">
              {formatPrice(product.price)}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {product.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-[11px] font-body font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded-full"
              >
                <Tag className="h-2.5 w-2.5" /> {tag}
              </span>
            ))}
          </div>

          <p className="text-sm font-body text-muted-foreground line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          <div className="mt-auto flex gap-2 pt-1">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-accent/40 text-accent hover:bg-accent hover:text-accent-foreground transition-smooth"
              onClick={handleAddToCart}
              data-ocid={`add-to-cart-${product.id}`}
            >
              <ShoppingCart className="h-3.5 w-3.5 mr-1.5" /> Add to Cart
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="shrink-0 text-muted-foreground hover:text-foreground"
              asChild
            >
              <span>
                View <ArrowRight className="h-3.5 w-3.5 ml-0.5" />
              </span>
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function HeroSection() {
  return (
    <section className="relative bg-muted/30 overflow-hidden">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex flex-col gap-6"
          >
            <Badge className="w-fit bg-accent/10 text-accent border-accent/30 font-body font-medium">
              Curated with Intention
            </Badge>
            <h1 className="font-display text-5xl md:text-6xl font-semibold text-foreground leading-[1.1] tracking-tight">
              Gifts of Distinction, <br />
              <em className="not-italic text-accent">Crafted with Care</em>
            </h1>
            <p className="text-lg text-muted-foreground font-body leading-relaxed max-w-md">
              Discover meaningful treasures for moments that matter.
              Thoughtfully curated for every celebration.
            </p>
            <div className="flex flex-wrap gap-4 mt-2">
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-body font-semibold px-8 shadow-elevation transition-smooth"
                onClick={() =>
                  document
                    .getElementById("catalog")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                data-ocid="hero-shop-cta"
              >
                Shop The Collection <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="font-body border-border hover:bg-muted transition-smooth"
                onClick={() =>
                  document
                    .getElementById("occasions")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                data-ocid="hero-occasions-cta"
              >
                Browse by Occasion
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden shadow-elevation aspect-[4/3]">
              <img
                src="/assets/generated/hero-gift-box.dim_1400x900.jpg"
                alt="Luxurious gift box arrangement"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-card rounded-xl shadow-elevation p-4 flex items-center gap-3 border border-border">
              <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                <Star className="h-5 w-5 text-accent fill-accent/30" />
              </div>
              <div>
                <p className="text-xs font-body font-semibold text-foreground">
                  Premium Curation
                </p>
                <p className="text-[11px] text-muted-foreground font-body">
                  Every box hand-selected
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FeaturedSection() {
  const { data: products, isLoading } = useFeaturedProducts();

  return (
    <section id="featured" className="bg-background py-16 md:py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-4xl font-semibold text-foreground tracking-tight mb-3">
            Featured Curations
          </h2>
          <p className="text-muted-foreground font-body text-base max-w-lg mx-auto">
            Our most beloved collections — each one a carefully composed story
            of thoughtfulness.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading
            ? [1, 2, 3, 4].map((i) => <ProductCardSkeleton key={i} />)
            : (products ?? []).map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
}

function OccasionsSection() {
  return (
    <section id="occasions" className="bg-muted/30 py-16 md:py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-4xl font-semibold text-foreground tracking-tight mb-3">
            Curated By Occasion
          </h2>
          <p className="text-muted-foreground font-body text-base max-w-lg mx-auto">
            Every milestone deserves its perfect gift. Explore collections
            shaped around life's special moments.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {OCCASIONS.map((occasion, i) => (
            <motion.button
              key={occasion.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              onClick={() =>
                document
                  .getElementById("catalog")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="group relative rounded-xl overflow-hidden aspect-[4/3] cursor-pointer shadow-subtle hover:shadow-card-hover transition-smooth"
              data-ocid={`occasion-${occasion.slug}`}
            >
              <img
                src={occasion.imageUrl}
                alt={occasion.label}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/10 to-transparent" />
              <span className="absolute bottom-3 left-0 right-0 text-center font-display text-base font-semibold text-primary-foreground tracking-wide drop-shadow">
                {occasion.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}

function CatalogSection() {
  const { data: products, isLoading } = useProducts();

  return (
    <section id="catalog" className="bg-background py-16 md:py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-10 gap-4"
        >
          <div>
            <h2 className="font-display text-4xl font-semibold text-foreground tracking-tight mb-2">
              The Full Collection
            </h2>
            <p className="text-muted-foreground font-body text-base">
              Browse every curated gift set, each thoughtfully assembled to
              impress.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? [1, 2, 3, 4, 5, 6].map((i) => <ProductCardSkeleton key={i} />)
            : (products ?? []).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section
      id="about"
      className="bg-card border-y border-border py-16 md:py-20"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center flex flex-col gap-5">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block text-accent font-body font-semibold text-sm tracking-widest uppercase mb-3">
              Our Philosophy
            </span>
            <h2 className="font-display text-4xl font-semibold text-foreground tracking-tight mb-4">
              Gifting That Truly Appreciates
            </h2>
            <p className="text-muted-foreground font-body text-base leading-relaxed">
              We believe that meaningful gifts are more than beautiful objects —
              they're expressions of care, intention, and connection. Every
              Appreciate box is assembled by hand with an eye for quality,
              sustainability, and surprise.
            </p>
            <p className="text-muted-foreground font-body text-base leading-relaxed mt-4">
              From artisan producers to independent makers, we partner
              exclusively with brands who share our commitment to excellence and
              warmth. Because giving should feel just as wonderful as receiving.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <FeaturedSection />
      <OccasionsSection />
      <CatalogSection />
      <AboutSection />
    </div>
  );
}
