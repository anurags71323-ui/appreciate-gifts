import Types "../types/products-orders";
import ProductsOrdersLib "../lib/products-orders";
import Map "mo:core/Map";

mixin (
  products : Map.Map<Types.ProductId, Types.Product>,
  orders : Map.Map<Types.OrderId, Types.Order>,
) {
  /// Returns all products in the catalog.
  public query func getProducts() : async [Types.Product] {
    ProductsOrdersLib.getProducts(products);
  };

  /// Returns a single product by id.
  public query func getProduct(id : Types.ProductId) : async ?Types.Product {
    ProductsOrdersLib.getProduct(products, id);
  };
};
