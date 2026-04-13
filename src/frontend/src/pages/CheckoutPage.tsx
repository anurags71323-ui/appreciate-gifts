import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Minus,
  Package,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { createActor } from "../backend";
import { useCartStore } from "../store/cart";

function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

type CheckoutSession = { id: string; url: string };

export default function CheckoutPage() {
  const { items, removeItem, updateQuantity, total, itemCount, clearCart } =
    useCartStore();
  const { actor } = useActor(createActor);

  const createCheckout = useMutation({
    mutationFn: async (): Promise<CheckoutSession> => {
      if (!actor) throw new Error("Actor not available");
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      const shoppingItems = items.map((item) => ({
        currency: "usd",
        productName: item.name,
        productDescription: item.name,
        priceInCents: item.price,
        quantity: BigInt(item.quantity),
      }));
      const result = await (
        actor as unknown as {
          createCheckoutSession: (
            items: typeof shoppingItems,
            successUrl: string,
            cancelUrl: string,
          ) => Promise<string>;
        }
      ).createCheckoutSession(
        shoppingItems,
        `${baseUrl}/payment-success`,
        `${baseUrl}/payment-failure`,
      );
      const session = JSON.parse(result) as CheckoutSession;
      if (!session?.url) throw new Error("Stripe session missing url");
      return session;
    },
    onSuccess: (session) => {
      if (!session?.url) {
        toast.error("Could not start checkout. Please try again.");
        return;
      }
      window.location.href = session.url;
    },
    onError: () => {
      toast.error("Checkout is not yet configured. Contact the shop owner.");
    },
  });

  if (itemCount() === 0) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center text-center gap-6">
        <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
          <ShoppingBag className="h-9 w-9 text-muted-foreground" />
        </div>
        <h1 className="font-display text-3xl font-semibold text-foreground">
          Your cart is empty
        </h1>
        <p className="text-muted-foreground font-body max-w-sm">
          You haven't added any gifts yet. Browse our curated collections to
          find something truly special.
        </p>
        <Button
          size="lg"
          className="bg-accent hover:bg-accent/90 text-accent-foreground font-body font-semibold transition-smooth"
          asChild
        >
          <Link to="/">
            Browse Gifts <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    );
  }

  const subtotal = total();
  const shipping = subtotal >= 10000 ? 0 : 995;
  const grandTotal = subtotal + shipping;

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-display text-4xl font-semibold text-foreground tracking-tight mb-2">
            Your Cart
          </h1>
          <p className="text-muted-foreground font-body mb-10">
            {itemCount()} {itemCount() === 1 ? "gift" : "gifts"} — almost there
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Cart items */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {items.map((item, i) => (
              <motion.div
                key={item.productId}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="bg-card border border-border rounded-xl p-5 flex gap-5 items-start"
                data-ocid={`cart-item-${item.productId}`}
              >
                <div className="h-20 w-20 rounded-lg overflow-hidden bg-muted shrink-0">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0 flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      to="/products/$id"
                      params={{ id: item.productId }}
                      className="font-display text-base font-semibold text-foreground leading-snug hover:text-accent transition-colors truncate"
                    >
                      {item.name}
                    </Link>
                    <span className="font-display text-base font-bold text-accent shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground font-body">
                    {formatPrice(item.price)} each
                  </p>

                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-2 border border-border rounded-lg overflow-hidden">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-none hover:bg-muted"
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                        aria-label="Decrease quantity"
                        data-ocid={`cart-decrease-${item.productId}`}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </Button>
                      <span className="w-8 text-center text-sm font-body font-semibold text-foreground">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-none hover:bg-muted"
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                        aria-label="Increase quantity"
                        data-ocid={`cart-increase-${item.productId}`}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-destructive transition-colors"
                      onClick={() => removeItem(item.productId)}
                      aria-label={`Remove ${item.name}`}
                      data-ocid={`cart-remove-${item.productId}`}
                    >
                      <Trash2 className="h-4 w-4 mr-1.5" /> Remove
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}

            <Button
              variant="ghost"
              className="self-start text-muted-foreground hover:text-destructive transition-colors font-body text-sm"
              onClick={clearCart}
              data-ocid="cart-clear"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Clear cart
            </Button>
          </div>

          {/* Order summary */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-card border border-border rounded-xl p-6 sticky top-24 flex flex-col gap-5">
              <h2 className="font-display text-xl font-semibold text-foreground">
                Order Summary
              </h2>
              <Separator />

              <div className="flex flex-col gap-3">
                <div className="flex justify-between text-sm font-body text-muted-foreground">
                  <span>Subtotal ({itemCount()} items)</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm font-body text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Package className="h-3.5 w-3.5" /> Shipping
                  </span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-accent font-medium">Free</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-muted-foreground font-body bg-muted/50 rounded-lg px-3 py-2">
                    Add {formatPrice(10000 - subtotal)} more for free shipping
                  </p>
                )}
              </div>

              <Separator />
              <div className="flex justify-between font-body font-semibold text-foreground text-base">
                <span>Total</span>
                <span className="font-display text-lg text-accent">
                  {formatPrice(grandTotal)}
                </span>
              </div>

              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-body font-semibold shadow-elevation transition-smooth w-full"
                onClick={() => createCheckout.mutate()}
                disabled={createCheckout.isPending}
                data-ocid="checkout-submit"
              >
                {createCheckout.isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                    Preparing checkout...
                  </span>
                ) : (
                  <>
                    Proceed to Payment <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                className="font-body border-border hover:bg-muted transition-smooth w-full"
                asChild
              >
                <Link to="/">Continue Shopping</Link>
              </Button>

              <p className="text-xs text-center text-muted-foreground font-body">
                Secure checkout powered by Stripe. Your payment info is never
                stored.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
