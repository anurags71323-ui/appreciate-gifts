import ProductsOrdersTypes "products-orders";

module {
  public type ProductId = ProductsOrdersTypes.ProductId;
  public type Timestamp = ProductsOrdersTypes.Timestamp;

  // --- Wishlist ---

  public type WishlistEntry = {
    productId : ProductId;
    addedAt : Int;
  };

  // --- Shipping Addresses ---

  public type AddressId = Text;

  public type ShippingAddress = {
    id : AddressId;
    fullName : Text;
    streetAddress : Text;
    city : Text;
    state : Text;
    postalCode : Text;
    country : Text;
    isDefault : Bool;
  };

  public type ShippingAddressInput = {
    fullName : Text;
    streetAddress : Text;
    city : Text;
    state : Text;
    postalCode : Text;
    country : Text;
  };
};
