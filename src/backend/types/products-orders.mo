module {
  public type ProductId = Text;
  public type OrderId = Text;
  public type Timestamp = Int;

  public type Product = {
    id : ProductId;
    name : Text;
    description : Text;
    price : Nat; // in cents
    imageUrl : Text;
    tags : [Text];
    featured : Bool;
  };

  public type LineItem = {
    productId : ProductId;
    quantity : Nat;
  };

  public type OrderStatus = {
    #pending;
    #completed;
    #cancelled;
  };

  public type Order = {
    id : OrderId;
    items : [LineItem];
    total : Nat; // in cents
    timestamp : Timestamp;
    status : OrderStatus;
    userId : ?Principal; // linked to authenticated user, null for anonymous
  };
};
