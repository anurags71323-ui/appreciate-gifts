import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Product } from "../types/index";
import type { WishlistEntry } from "../types/index";
import { useAuth } from "./use-auth";

const STORAGE_KEY = (principal: string) => `wishlist:${principal}`;

function loadEntries(principal: string): WishlistEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY(principal));
    return raw ? (JSON.parse(raw) as WishlistEntry[]) : [];
  } catch {
    return [];
  }
}

function saveEntries(principal: string, entries: WishlistEntry[]): void {
  localStorage.setItem(STORAGE_KEY(principal), JSON.stringify(entries));
}

export function useWishlist(products: Product[] = []) {
  const { isAuthenticated, principalText } = useAuth();
  const queryClient = useQueryClient();
  const principal = principalText ?? "anonymous";

  const {
    data: entries = [],
    isLoading,
    error,
  } = useQuery<WishlistEntry[]>({
    queryKey: ["wishlist", principal],
    queryFn: () => {
      if (!isAuthenticated || !principalText) return [];
      return loadEntries(principalText);
    },
    enabled: isAuthenticated && !!principalText,
  });

  const wishlistItems: Product[] = entries
    .map((e) => products.find((p) => p.id === e.productId))
    .filter((p): p is Product => p !== undefined);

  function isInWishlist(productId: string): boolean {
    return entries.some((e) => e.productId === productId);
  }

  const addMutation = useMutation({
    mutationFn: async (productId: string) => {
      if (!principalText) throw new Error("Not authenticated");
      const current = loadEntries(principalText);
      if (current.some((e) => e.productId === productId)) return current;
      const updated = [...current, { productId, addedAt: Date.now() }];
      saveEntries(principalText, updated);
      return updated;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["wishlist", principal], updated);
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (productId: string) => {
      if (!principalText) throw new Error("Not authenticated");
      const current = loadEntries(principalText);
      const updated = current.filter((e) => e.productId !== productId);
      saveEntries(principalText, updated);
      return updated;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["wishlist", principal], updated);
    },
  });

  function toggleWishlist(productId: string) {
    if (isInWishlist(productId)) {
      removeMutation.mutate(productId);
    } else {
      addMutation.mutate(productId);
    }
  }

  return {
    wishlistItems,
    entries,
    isLoading,
    error: error as Error | null,
    isInWishlist,
    addToWishlist: (id: string) => addMutation.mutate(id),
    removeFromWishlist: (id: string) => removeMutation.mutate(id),
    toggleWishlist,
  };
}
