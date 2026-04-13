import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ShoppingBag, XCircle } from "lucide-react";
import { motion } from "motion/react";

export default function PaymentFailurePage() {
  return (
    <div className="container mx-auto px-4 py-24 flex flex-col items-center text-center gap-8">
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="h-24 w-24 rounded-full bg-destructive/10 border-2 border-destructive/20 flex items-center justify-center"
      >
        <XCircle className="h-12 w-12 text-destructive" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col gap-4 max-w-md"
      >
        <h1 className="font-display text-4xl font-semibold text-foreground tracking-tight">
          Payment was not completed
        </h1>
        <p className="text-muted-foreground font-body text-base leading-relaxed">
          Your payment was cancelled or unsuccessful. Your cart has been saved —
          you can try again whenever you're ready.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Button
          size="lg"
          className="bg-accent hover:bg-accent/90 text-accent-foreground font-body font-semibold transition-smooth"
          asChild
        >
          <Link to="/checkout">
            <ShoppingBag className="mr-2 h-4 w-4" /> Return to Cart
          </Link>
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="font-body border-border hover:bg-muted transition-smooth"
          asChild
        >
          <Link to="/">
            Browse Gifts <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}
