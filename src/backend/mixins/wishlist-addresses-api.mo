import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Types "../types/wishlist-addresses";
import ProductsOrdersTypes "../types/products-orders";
import WishlistLib "../lib/wishlist-addresses";

mixin (
  wishlists : Map.Map<Principal, List.List<Types.WishlistEntry>>,
  addresses : Map.Map<Principal, List.List<Types.ShippingAddress>>,
  products : Map.Map<ProductsOrdersTypes.ProductId, ProductsOrdersTypes.Product>,
  addressCounter : { var value : Nat },
) {

  // --- Wishlist API ---

  public shared ({ caller }) func addToWishlist(productId : Text) : async { #ok; #err : Text } {
    if (caller.isAnonymous()) { return #err("Authentication required") };
    WishlistLib.addToWishlist(wishlists, caller, productId);
  };

  public shared ({ caller }) func removeFromWishlist(productId : Text) : async { #ok; #err : Text } {
    if (caller.isAnonymous()) { return #err("Authentication required") };
    WishlistLib.removeFromWishlist(wishlists, caller, productId);
  };

  public shared ({ caller }) func getUserWishlist() : async [ProductsOrdersTypes.Product] {
    if (caller.isAnonymous()) { return [] };
    let entries = WishlistLib.getWishlistEntries(wishlists, caller);
    entries.filterMap<Types.WishlistEntry, ProductsOrdersTypes.Product>(
      func(entry) { products.get(entry.productId) },
    );
  };

  public shared ({ caller }) func isProductInWishlist(productId : Text) : async Bool {
    if (caller.isAnonymous()) { return false };
    WishlistLib.isProductInWishlist(wishlists, caller, productId);
  };

  // --- Shipping Address API ---

  public shared ({ caller }) func addShippingAddress(input : Types.ShippingAddressInput) : async { #ok : Types.ShippingAddress; #err : Text } {
    if (caller.isAnonymous()) { return #err("Authentication required") };
    let (address, newCounter) = WishlistLib.addShippingAddress(addresses, caller, input, addressCounter.value);
    addressCounter.value := newCounter;
    #ok(address);
  };

  public shared ({ caller }) func updateShippingAddress(id : Text, input : Types.ShippingAddressInput) : async { #ok : Types.ShippingAddress; #err : Text } {
    if (caller.isAnonymous()) { return #err("Authentication required") };
    WishlistLib.updateShippingAddress(addresses, caller, id, input);
  };

  public shared ({ caller }) func deleteShippingAddress(id : Text) : async { #ok; #err : Text } {
    if (caller.isAnonymous()) { return #err("Authentication required") };
    WishlistLib.deleteShippingAddress(addresses, caller, id);
  };

  public shared ({ caller }) func getUserShippingAddresses() : async [Types.ShippingAddress] {
    if (caller.isAnonymous()) { return [] };
    WishlistLib.getUserShippingAddresses(addresses, caller);
  };

  public shared ({ caller }) func setDefaultShippingAddress(id : Text) : async { #ok; #err : Text } {
    if (caller.isAnonymous()) { return #err("Authentication required") };
    WishlistLib.setDefaultShippingAddress(addresses, caller, id);
  };
};
