import { Skeleton } from "@/components/ui/skeleton";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { Layout } from "./components/Layout";

// Lazy load pages
const HomePage = lazy(() => import("./pages/HomePage"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const OrderConfirmationPage = lazy(
  () => import("./pages/OrderConfirmationPage"),
);
const PaymentSuccessPage = lazy(() => import("./pages/PaymentSuccessPage"));
const PaymentFailurePage = lazy(() => import("./pages/PaymentFailurePage"));

function PageLoader() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col gap-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-72 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}

// Routes
const rootRoute = createRootRoute({ component: Layout });

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <HomePage />
    </Suspense>
  ),
});

const productDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/products/$id",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <ProductDetailPage />
    </Suspense>
  ),
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <CheckoutPage />
    </Suspense>
  ),
});

const orderConfirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/order-confirmation",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <OrderConfirmationPage />
    </Suspense>
  ),
});

const paymentSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payment-success",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <PaymentSuccessPage />
    </Suspense>
  ),
});

const paymentFailureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payment-failure",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <PaymentFailurePage />
    </Suspense>
  ),
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  productDetailRoute,
  checkoutRoute,
  orderConfirmationRoute,
  paymentSuccessRoute,
  paymentFailureRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
