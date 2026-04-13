import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Types "../types/wishlist-addresses";

module {
  // --- Wishlist ---

  /// Add a product to a user's wishlist. Returns #err if already present.
  public func addToWishlist(
    wishlists : Map.Map<Principal, List.List<Types.WishlistEntry>>,
    caller : Principal,
    productId : Types.ProductId,
  ) : { #ok; #err : Text } {
    let userList = switch (wishlists.get(caller)) {
      case (?l) l;
      case null {
        let l = List.empty<Types.WishlistEntry>();
        wishlists.add(caller, l);
        l;
      };
    };
    // Check if already in wishlist
    let alreadyIn = userList.any(func(e : Types.WishlistEntry) : Bool { e.productId == productId });
    if (alreadyIn) {
      #err("Product already in wishlist");
    } else {
      userList.add({ productId; addedAt = Time.now() });
      #ok;
    };
  };

  /// Remove a product from a user's wishlist. Returns #err if not found.
  public func removeFromWishlist(
    wishlists : Map.Map<Principal, List.List<Types.WishlistEntry>>,
    caller : Principal,
    productId : Types.ProductId,
  ) : { #ok; #err : Text } {
    switch (wishlists.get(caller)) {
      case null { #err("Product not in wishlist") };
      case (?userList) {
        let sizeBefore = userList.size();
        let filtered = userList.filter(func(e : Types.WishlistEntry) : Bool { e.productId != productId });
        if (filtered.size() == sizeBefore) {
          #err("Product not in wishlist");
        } else {
          userList.clear();
          userList.append(filtered);
          #ok;
        };
      };
    };
  };

  /// Return all wishlist entries for a user.
  public func getWishlistEntries(
    wishlists : Map.Map<Principal, List.List<Types.WishlistEntry>>,
    caller : Principal,
  ) : [Types.WishlistEntry] {
    switch (wishlists.get(caller)) {
      case null { [] };
      case (?userList) { userList.toArray() };
    };
  };

  /// Check whether a product is in the user's wishlist.
  public func isProductInWishlist(
    wishlists : Map.Map<Principal, List.List<Types.WishlistEntry>>,
    caller : Principal,
    productId : Types.ProductId,
  ) : Bool {
    switch (wishlists.get(caller)) {
      case null { false };
      case (?userList) {
        userList.any(func(e : Types.WishlistEntry) : Bool { e.productId == productId });
      };
    };
  };

  // --- Shipping Addresses ---

  /// Add a new shipping address for the caller. Generates a unique ID.
  /// Returns the new address and the incremented counter.
  public func addShippingAddress(
    addresses : Map.Map<Principal, List.List<Types.ShippingAddress>>,
    caller : Principal,
    input : Types.ShippingAddressInput,
    counter : Nat,
  ) : (Types.ShippingAddress, Nat) {
    let userList = switch (addresses.get(caller)) {
      case (?l) l;
      case null {
        let l = List.empty<Types.ShippingAddress>();
        addresses.add(caller, l);
        l;
      };
    };
    let newCounter = counter + 1;
    let id = "addr-" # counter.toText();
    // First address is default automatically; subsequent ones are not
    let isDefault = userList.isEmpty();
    let address : Types.ShippingAddress = {
      id;
      fullName = input.fullName;
      streetAddress = input.streetAddress;
      city = input.city;
      state = input.state;
      postalCode = input.postalCode;
      country = input.country;
      isDefault;
    };
    userList.add(address);
    (address, newCounter);
  };

  /// Update an existing shipping address by ID.
  public func updateShippingAddress(
    addresses : Map.Map<Principal, List.List<Types.ShippingAddress>>,
    caller : Principal,
    id : Types.AddressId,
    input : Types.ShippingAddressInput,
  ) : { #ok : Types.ShippingAddress; #err : Text } {
    switch (addresses.get(caller)) {
      case null { #err("Address not found") };
      case (?userList) {
        var found = false;
        var updated : Types.ShippingAddress = {
          id;
          fullName = input.fullName;
          streetAddress = input.streetAddress;
          city = input.city;
          state = input.state;
          postalCode = input.postalCode;
          country = input.country;
          isDefault = false;
        };
        userList.mapInPlace(func(addr : Types.ShippingAddress) : Types.ShippingAddress {
          if (addr.id == id) {
            found := true;
            let u = { addr with
              fullName = input.fullName;
              streetAddress = input.streetAddress;
              city = input.city;
              state = input.state;
              postalCode = input.postalCode;
              country = input.country;
            };
            updated := u;
            u;
          } else {
            addr;
          };
        });
        if (found) { #ok(updated) } else { #err("Address not found") };
      };
    };
  };

  /// Delete a shipping address by ID.
  public func deleteShippingAddress(
    addresses : Map.Map<Principal, List.List<Types.ShippingAddress>>,
    caller : Principal,
    id : Types.AddressId,
  ) : { #ok; #err : Text } {
    switch (addresses.get(caller)) {
      case null { #err("Address not found") };
      case (?userList) {
        // Find the address to delete and whether it was the default
        let targetOpt = userList.find(func(a : Types.ShippingAddress) : Bool { a.id == id });
        switch (targetOpt) {
          case null { #err("Address not found") };
          case (?deleted) {
            let wasDefault = deleted.isDefault;
            let filtered = userList.filter(func(a : Types.ShippingAddress) : Bool { a.id != id });
            userList.clear();
            userList.append(filtered);
            // If deleted address was default, promote the first remaining address
            if (wasDefault) {
              var promoted = false;
              userList.mapInPlace(func(a : Types.ShippingAddress) : Types.ShippingAddress {
                if (not promoted) {
                  promoted := true;
                  { a with isDefault = true };
                } else {
                  a;
                };
              });
            };
            #ok;
          };
        };
      };
    };
  };

  /// Return all shipping addresses for the caller.
  public func getUserShippingAddresses(
    addresses : Map.Map<Principal, List.List<Types.ShippingAddress>>,
    caller : Principal,
  ) : [Types.ShippingAddress] {
    switch (addresses.get(caller)) {
      case null { [] };
      case (?userList) { userList.toArray() };
    };
  };

  /// Mark an address as the default; clears isDefault on all other addresses.
  public func setDefaultShippingAddress(
    addresses : Map.Map<Principal, List.List<Types.ShippingAddress>>,
    caller : Principal,
    id : Types.AddressId,
  ) : { #ok; #err : Text } {
    switch (addresses.get(caller)) {
      case null { #err("Address not found") };
      case (?userList) {
        // Check address exists
        let exists = userList.any(func(a : Types.ShippingAddress) : Bool { a.id == id });
        if (not exists) {
          #err("Address not found");
        } else {
          userList.mapInPlace(func(a : Types.ShippingAddress) : Types.ShippingAddress {
            { a with isDefault = (a.id == id) };
          });
          #ok;
        };
      };
    };
  };
};
