import Types "types/products-orders";
import WishlistAddressesTypes "types/wishlist-addresses";
import ProductsOrdersApi "mixins/products-orders-api";
import WishlistAddressesApi "mixins/wishlist-addresses-api";
import ProductsOrdersLib "lib/products-orders";
import Stripe "mo:caffeineai-stripe/stripe";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";



actor {
  // --- Products & Orders state ---
  let products = Map.empty<Types.ProductId, Types.Product>();
  let orders = Map.empty<Types.OrderId, Types.Order>();
  var nextOrderId : Nat = 0;
  var stripeConfig : ?Stripe.StripeConfiguration = null;
  var seeded : Bool = false;

  // --- Wishlist & Addresses state ---
  let wishlists = Map.empty<Principal, List.List<WishlistAddressesTypes.WishlistEntry>>();
  let userAddresses = Map.empty<Principal, List.List<WishlistAddressesTypes.ShippingAddress>>();
  let addressCounterState = { var value : Nat = 0 };

  // Seed sample products once on first use
  func ensureSeeded() {
    if (not seeded) {
      ProductsOrdersLib.seedProducts(products);
      seeded := true;
    };
  };

  // Initialise seed eagerly
  do {
    ensureSeeded();
  };

  // --- Mixins ---
  include ProductsOrdersApi(products, orders);
  include WishlistAddressesApi(wishlists, userAddresses, products, addressCounterState);

  // --- Stripe ---
  public query func isStripeConfigured() : async Bool {
    stripeConfig != null;
  };

  public shared ({ caller = _ }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    stripeConfig := ?config;
  };

  public shared ({ caller }) func createCheckoutSession(
    items : [Types.LineItem],
    successUrl : Text,
    cancelUrl : Text,
  ) : async Text {
    let config = switch (stripeConfig) {
      case (null) { Runtime.trap("Stripe not configured") };
      case (?c) { c };
    };
    let rawItems = ProductsOrdersLib.buildShoppingItems(products, items);
    let shoppingItems = List.empty<Stripe.ShoppingItem>();
    for ((currency, name, description, price, quantity) in rawItems.vals()) {
      shoppingItems.add({
        currency = currency;
        productName = name;
        productDescription = description;
        priceInCents = price;
        quantity = quantity;
      });
    };
    let result = await Stripe.createCheckoutSession(config, caller, shoppingItems.toArray(), successUrl, cancelUrl, transform);
    // Link order to caller if authenticated (not anonymous)
    let userId : ?Principal = if (caller.isAnonymous()) null else ?caller;
    let (_, newId) = ProductsOrdersLib.createOrder(orders, products, nextOrderId, items, userId);
    nextOrderId := newId;
    result;
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    let config = switch (stripeConfig) {
      case (null) { Runtime.trap("Stripe not configured") };
      case (?c) { c };
    };
    await Stripe.getSessionStatus(config, sessionId, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };
};
