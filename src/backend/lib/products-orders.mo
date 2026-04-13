import Types "../types/products-orders";
import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";

module {
  /// Returns all products as an array.
  public func getProducts(products : Map.Map<Types.ProductId, Types.Product>) : [Types.Product] {
    products.values().toArray();
  };

  /// Returns a single product by id.
  public func getProduct(products : Map.Map<Types.ProductId, Types.Product>, id : Types.ProductId) : ?Types.Product {
    products.get(id);
  };

  /// Seeds the product catalog with sample appreciation gift products.
  public func seedProducts(products : Map.Map<Types.ProductId, Types.Product>) {
    let sampleProducts : [Types.Product] = [
      {
        id = "p001";
        name = "Gratitude Bloom Box";
        description = "A curated collection of dried florals, artisan candle, and handwritten gratitude card — perfect for expressing heartfelt thanks.";
        price = 4999;
        imageUrl = "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600&q=80";
        tags = ["flowers", "candle", "gratitude", "featured"];
        featured = true;
      },
      {
        id = "p002";
        name = "Golden Thanks Set";
        description = "Luxurious gold-accented stationery, premium chocolates, and a keepsake journal to help someone record moments worth cherishing.";
        price = 6499;
        imageUrl = "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&q=80";
        tags = ["stationery", "chocolate", "journal", "luxury"];
        featured = true;
      },
      {
        id = "p003";
        name = "Warmth & Wellness Bundle";
        description = "Cozy self-care essentials — lavender bath salts, herbal tea selection, bamboo socks, and a calming face mask. A warm hug in a box.";
        price = 5499;
        imageUrl = "https://images.unsplash.com/photo-1519415943484-9fa1873496d4?w=600&q=80";
        tags = ["wellness", "spa", "self-care", "relaxation"];
        featured = false;
      },
      {
        id = "p004";
        name = "Brewed Appreciation Kit";
        description = "Specialty single-origin coffee sampler, ceramic pour-over mug, and artisan biscotti. A morning ritual crafted to delight.";
        price = 4299;
        imageUrl = "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80";
        tags = ["coffee", "mug", "gourmet", "morning"];
        featured = false;
      },
      {
        id = "p005";
        name = "Sweet Recognition Box";
        description = "Hand-selected premium truffles, sea-salt caramels, and fruit jellies arranged beautifully in a keepsake gift box.";
        price = 3799;
        imageUrl = "https://images.unsplash.com/photo-1481391243133-f96216dcb5d2?w=600&q=80";
        tags = ["chocolate", "sweets", "gourmet", "indulgence"];
        featured = false;
      },
      {
        id = "p006";
        name = "Mindful Moments Set";
        description = "Guided mindfulness journal, crystal roller, aromatherapy rollerball, and affirmation card deck to nurture inner peace.";
        price = 5899;
        imageUrl = "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80";
        tags = ["mindfulness", "wellness", "journal", "crystal"];
        featured = true;
      },
      {
        id = "p007";
        name = "Radiant Thank You Hamper";
        description = "Sparkling juice, aged cheddar, artisan crackers, and golden honeycomb — an elegant spread to celebrate every kind of win.";
        price = 7299;
        imageUrl = "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80";
        tags = ["hamper", "gourmet", "cheese", "celebration"];
        featured = false;
      },
      {
        id = "p008";
        name = "Garden of Gratitude Succulent Set";
        description = "Three hand-potted succulents in ceramic planters with a heartfelt card — a living reminder that appreciation keeps growing.";
        price = 3299;
        imageUrl = "https://images.unsplash.com/photo-1463154545680-d59320fd685d?w=600&q=80";
        tags = ["plants", "succulent", "eco", "nature"];
        featured = false;
      },
      {
        id = "p009";
        name = "Artisan Comfort Crate";
        description = "Small-batch salted almonds, smoked meats, aged gouda, and artisan preserves — a thoughtful spread for someone truly deserving.";
        price = 6999;
        imageUrl = "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&q=80";
        tags = ["charcuterie", "cheese", "gourmet", "savory"];
        featured = true;
      },
      {
        id = "p010";
        name = "Luminous Spa Ritual";
        description = "Rose gold bath bombs, silk pillowcase, vitamin-C serum, and a curated playlist card for a complete at-home spa night.";
        price = 8499;
        imageUrl = "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80";
        tags = ["spa", "bath", "luxury", "skin-care"];
        featured = false;
      },
      {
        id = "p011";
        name = "Heart of Gold Token Set";
        description = "A polished keepsake box containing a gold-plated gratitude coin, personalized message card, and mini diffuser with calming oils.";
        price = 4599;
        imageUrl = "https://images.unsplash.com/photo-1585325701956-60dd9c8553bc?w=600&q=80";
        tags = ["keepsake", "token", "diffuser", "meaningful"];
        featured = false;
      },
      {
        id = "p012";
        name = "Blissful Book Lover's Box";
        description = "A beautifully curated reading set: bestselling feel-good novel, soy wax candle, herbal reading tea, and cozy book sleeve.";
        price = 5199;
        imageUrl = "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80";
        tags = ["books", "candle", "tea", "cozy"];
        featured = false;
      },
    ];

    for (product in sampleProducts.vals()) {
      products.add(product.id, product);
    };
  };

  /// Creates and stores a new order. Returns the created order and the updated nextOrderId.
  public func createOrder(
    orders : Map.Map<Types.OrderId, Types.Order>,
    products : Map.Map<Types.ProductId, Types.Product>,
    nextOrderId : Nat,
    items : [Types.LineItem],
  ) : (Types.Order, Nat) {
    let orderId = "order-" # nextOrderId.toText();
    var total : Nat = 0;
    for (item in items.vals()) {
      switch (products.get(item.productId)) {
        case (?product) {
          total += product.price * item.quantity;
        };
        case null {};
      };
    };
    let order : Types.Order = {
      id = orderId;
      items = items;
      total = total;
      timestamp = Time.now();
      status = #pending;
    };
    orders.add(orderId, order);
    (order, nextOrderId + 1);
  };

  /// Returns a single order by id.
  public func getOrder(orders : Map.Map<Types.OrderId, Types.Order>, id : Types.OrderId) : ?Types.Order {
    orders.get(id);
  };

  /// Builds Stripe-compatible shopping items from line items and product catalog.
  public func buildShoppingItems(
    products : Map.Map<Types.ProductId, Types.Product>,
    items : [Types.LineItem],
  ) : [(Text, Text, Text, Nat, Nat)] {
    let result = List.empty<(Text, Text, Text, Nat, Nat)>();
    for (item in items.vals()) {
      switch (products.get(item.productId)) {
        case (?product) {
          result.add(("usd", product.name, product.description, product.price, item.quantity));
        };
        case null {};
      };
    };
    result.toArray();
  };
};
