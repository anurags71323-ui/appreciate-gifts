import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ShippingAddress } from "../types/index";
import { useAuth } from "./use-auth";

const STORAGE_KEY = (principal: string) => `addresses:${principal}`;

function loadAddresses(principal: string): ShippingAddress[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY(principal));
    return raw ? (JSON.parse(raw) as ShippingAddress[]) : [];
  } catch {
    return [];
  }
}

function saveAddresses(principal: string, addresses: ShippingAddress[]): void {
  localStorage.setItem(STORAGE_KEY(principal), JSON.stringify(addresses));
}

function generateId(): string {
  return `addr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export function useAddresses() {
  const { isAuthenticated, principalText } = useAuth();
  const queryClient = useQueryClient();
  const principal = principalText ?? "anonymous";

  const {
    data: addresses = [],
    isLoading,
    error,
  } = useQuery<ShippingAddress[]>({
    queryKey: ["addresses", principal],
    queryFn: () => {
      if (!isAuthenticated || !principalText) return [];
      return loadAddresses(principalText);
    },
    enabled: isAuthenticated && !!principalText,
  });

  const addMutation = useMutation({
    mutationFn: async (input: Omit<ShippingAddress, "id">) => {
      if (!principalText) throw new Error("Not authenticated");
      const current = loadAddresses(principalText);
      const newAddr: ShippingAddress = { ...input, id: generateId() };
      // If first address or marked default, clear other defaults
      const updated = input.isDefault
        ? [...current.map((a) => ({ ...a, isDefault: false })), newAddr]
        : current.length === 0
          ? [{ ...newAddr, isDefault: true }]
          : [...current, newAddr];
      saveAddresses(principalText, updated);
      return updated;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["addresses", principal], updated);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (address: ShippingAddress) => {
      if (!principalText) throw new Error("Not authenticated");
      const current = loadAddresses(principalText);
      const updated = current.map((a) => {
        if (a.id !== address.id) {
          return address.isDefault ? { ...a, isDefault: false } : a;
        }
        return address;
      });
      saveAddresses(principalText, updated);
      return updated;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["addresses", principal], updated);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!principalText) throw new Error("Not authenticated");
      const current = loadAddresses(principalText);
      const updated = current.filter((a) => a.id !== id);
      // Reassign default if needed
      if (updated.length > 0 && !updated.some((a) => a.isDefault)) {
        updated[0] = { ...updated[0], isDefault: true };
      }
      saveAddresses(principalText, updated);
      return updated;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["addresses", principal], updated);
    },
  });

  const setDefaultMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!principalText) throw new Error("Not authenticated");
      const current = loadAddresses(principalText);
      const updated = current.map((a) => ({ ...a, isDefault: a.id === id }));
      saveAddresses(principalText, updated);
      return updated;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["addresses", principal], updated);
    },
  });

  return {
    addresses,
    isLoading,
    error: error as Error | null,
    addAddress: (input: Omit<ShippingAddress, "id">) =>
      addMutation.mutateAsync(input),
    updateAddress: (address: ShippingAddress) =>
      updateMutation.mutateAsync(address),
    deleteAddress: (id: string) => deleteMutation.mutateAsync(id),
    setDefault: (id: string) => setDefaultMutation.mutateAsync(id),
  };
}
