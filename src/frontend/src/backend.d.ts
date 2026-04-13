import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Timestamp = bigint;
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface LineItem {
    productId: ProductId;
    quantity: bigint;
}
export interface ShippingAddress {
    id: AddressId;
    country: string;
    city: string;
    postalCode: string;
    fullName: string;
    state: string;
    isDefault: boolean;
    streetAddress: string;
}
export interface ShippingAddressInput {
    country: string;
    city: string;
    postalCode: string;
    fullName: string;
    state: string;
    streetAddress: string;
}
export interface Order {
    id: OrderId;
    status: OrderStatus;
    total: bigint;
    userId?: Principal;
    timestamp: Timestamp;
    items: Array<LineItem>;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type AddressId = string;
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export type ProductId = string;
export interface Product {
    id: ProductId;
    featured: boolean;
    name: string;
    tags: Array<string>;
    description: string;
    imageUrl: string;
    price: bigint;
}
export type OrderId = string;
export enum OrderStatus {
    cancelled = "cancelled",
    pending = "pending",
    completed = "completed"
}
export interface backendInterface {
    addShippingAddress(input: ShippingAddressInput): Promise<{
        __kind__: "ok";
        ok: ShippingAddress;
    } | {
        __kind__: "err";
        err: string;
    }>;
    addToWishlist(productId: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createCheckoutSession(items: Array<LineItem>, successUrl: string, cancelUrl: string): Promise<string>;
    deleteShippingAddress(id: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getProduct(id: ProductId): Promise<Product | null>;
    getProducts(): Promise<Array<Product>>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getUserOrders(): Promise<Array<Order>>;
    getUserShippingAddresses(): Promise<Array<ShippingAddress>>;
    getUserWishlist(): Promise<Array<Product>>;
    isProductInWishlist(productId: string): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    removeFromWishlist(productId: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    setDefaultShippingAddress(id: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateShippingAddress(id: string, input: ShippingAddressInput): Promise<{
        __kind__: "ok";
        ok: ShippingAddress;
    } | {
        __kind__: "err";
        err: string;
    }>;
}
