import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  LogOut,
  MapPin,
  Package,
  Pencil,
  Plus,
  ShoppingBag,
  Trash2,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { createActor } from "../backend";
import { type Order, OrderStatus } from "../backend.d";
import { useAddresses } from "../hooks/use-addresses";
import { useAuth } from "../hooks/use-auth";
import type { ShippingAddress } from "../types/index";

// ─── Formatters ──────────────────────────────────────────────────────────────

function formatDate(timestamp: bigint) {
  return new Date(Number(timestamp) / 1_000_000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatPrice(cents: bigint) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(cents) / 100);
}

function statusVariant(
  status: OrderStatus,
): "default" | "secondary" | "destructive" {
  if (status === OrderStatus.completed) return "default";
  if (status === OrderStatus.pending) return "secondary";
  return "destructive";
}

function statusLabel(status: OrderStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

// ─── Order History Sub-components ────────────────────────────────────────────

function OrderHistorySkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-12 w-full rounded-lg" />
      ))}
    </div>
  );
}

function EmptyOrders() {
  const navigate = useNavigate();
  return (
    <div
      className="flex flex-col items-center justify-center py-16 gap-4 text-center"
      data-ocid="orders-empty-state"
    >
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
        <ShoppingBag className="h-8 w-8 text-muted-foreground" />
      </div>
      <div>
        <p className="font-display text-lg font-semibold text-foreground">
          No orders yet
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Your order history will appear here once you make a purchase.
        </p>
      </div>
      <Button
        onClick={() => navigate({ to: "/" })}
        className="mt-2 bg-accent text-accent-foreground hover:bg-accent/90"
        data-ocid="orders-browse-cta"
      >
        Browse Gifts
      </Button>
    </div>
  );
}

// ─── Address Form Types ───────────────────────────────────────────────────────

type AddressFormData = {
  label: string;
  fullName: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
};

type AddressFormErrors = Partial<Record<keyof AddressFormData, string>>;

const EMPTY_FORM: AddressFormData = {
  label: "",
  fullName: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
  isDefault: false,
};

function validateForm(data: AddressFormData): AddressFormErrors {
  const errors: AddressFormErrors = {};
  if (!data.fullName.trim()) errors.fullName = "Full name is required";
  if (!data.line1.trim()) errors.line1 = "Street address is required";
  if (!data.city.trim()) errors.city = "City is required";
  if (!data.state.trim()) errors.state = "State is required";
  if (!data.postalCode.trim()) errors.postalCode = "Postal code is required";
  if (!data.country.trim()) errors.country = "Country is required";
  return errors;
}

// ─── Address Form Modal ───────────────────────────────────────────────────────

interface AddressFormModalProps {
  open: boolean;
  onClose: () => void;
  editAddress?: ShippingAddress | null;
  onSave: (data: Omit<ShippingAddress, "id">) => Promise<void>;
}

function AddressFormModal({
  open,
  onClose,
  editAddress,
  onSave,
}: AddressFormModalProps) {
  const [form, setForm] = useState<AddressFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<AddressFormErrors>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open) {
      if (editAddress) {
        setForm({
          label: editAddress.label ?? "",
          fullName: editAddress.fullName,
          line1: editAddress.line1,
          line2: editAddress.line2 ?? "",
          city: editAddress.city,
          state: editAddress.state,
          postalCode: editAddress.postalCode,
          country: editAddress.country,
          isDefault: editAddress.isDefault,
        });
      } else {
        setForm(EMPTY_FORM);
      }
      setErrors({});
    }
  }, [open, editAddress]);

  function set(field: keyof AddressFormData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validateForm(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setIsSaving(true);
    try {
      await onSave({
        label: form.label.trim() || "Home",
        fullName: form.fullName.trim(),
        line1: form.line1.trim(),
        line2: form.line2.trim() || undefined,
        city: form.city.trim(),
        state: form.state.trim(),
        postalCode: form.postalCode.trim(),
        country: form.country.trim(),
        isDefault: form.isDefault,
      });
      onClose();
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-md bg-card border-border"
        data-ocid="address-form-modal"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-semibold text-foreground">
            {editAddress ? "Edit Address" : "Add New Address"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} noValidate className="space-y-4 mt-2">
          {/* Label */}
          <div className="space-y-1.5">
            <Label
              htmlFor="addr-label"
              className="text-sm font-medium text-foreground"
            >
              Label{" "}
              <span className="text-muted-foreground font-normal">
                (e.g. Home, Office)
              </span>
            </Label>
            <Input
              id="addr-label"
              value={form.label}
              onChange={(e) => set("label", e.target.value)}
              placeholder="Home"
              className="bg-input border-border"
              data-ocid="address-form-label"
            />
          </div>

          {/* Full Name */}
          <div className="space-y-1.5">
            <Label
              htmlFor="addr-fullname"
              className="text-sm font-medium text-foreground"
            >
              Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="addr-fullname"
              value={form.fullName}
              onChange={(e) => set("fullName", e.target.value)}
              placeholder="Priya Sharma"
              className={`bg-input border-border ${errors.fullName ? "border-destructive focus-visible:ring-destructive" : ""}`}
              data-ocid="address-form-fullname"
            />
            {errors.fullName && (
              <p className="text-xs text-destructive">{errors.fullName}</p>
            )}
          </div>

          {/* Street Address */}
          <div className="space-y-1.5">
            <Label
              htmlFor="addr-line1"
              className="text-sm font-medium text-foreground"
            >
              Street Address <span className="text-destructive">*</span>
            </Label>
            <Input
              id="addr-line1"
              value={form.line1}
              onChange={(e) => set("line1", e.target.value)}
              placeholder="42 Bougainvillea Lane"
              className={`bg-input border-border ${errors.line1 ? "border-destructive focus-visible:ring-destructive" : ""}`}
              data-ocid="address-form-line1"
            />
            {errors.line1 && (
              <p className="text-xs text-destructive">{errors.line1}</p>
            )}
            <Input
              value={form.line2}
              onChange={(e) => set("line2", e.target.value)}
              placeholder="Apt, floor, landmark (optional)"
              className="bg-input border-border mt-2"
              data-ocid="address-form-line2"
            />
          </div>

          {/* City + State */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label
                htmlFor="addr-city"
                className="text-sm font-medium text-foreground"
              >
                City <span className="text-destructive">*</span>
              </Label>
              <Input
                id="addr-city"
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                placeholder="Mumbai"
                className={`bg-input border-border ${errors.city ? "border-destructive" : ""}`}
                data-ocid="address-form-city"
              />
              {errors.city && (
                <p className="text-xs text-destructive">{errors.city}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="addr-state"
                className="text-sm font-medium text-foreground"
              >
                State <span className="text-destructive">*</span>
              </Label>
              <Input
                id="addr-state"
                value={form.state}
                onChange={(e) => set("state", e.target.value)}
                placeholder="Maharashtra"
                className={`bg-input border-border ${errors.state ? "border-destructive" : ""}`}
                data-ocid="address-form-state"
              />
              {errors.state && (
                <p className="text-xs text-destructive">{errors.state}</p>
              )}
            </div>
          </div>

          {/* Postal Code + Country */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label
                htmlFor="addr-postal"
                className="text-sm font-medium text-foreground"
              >
                Postal Code <span className="text-destructive">*</span>
              </Label>
              <Input
                id="addr-postal"
                value={form.postalCode}
                onChange={(e) => set("postalCode", e.target.value)}
                placeholder="400001"
                className={`bg-input border-border ${errors.postalCode ? "border-destructive" : ""}`}
                data-ocid="address-form-postal"
              />
              {errors.postalCode && (
                <p className="text-xs text-destructive">{errors.postalCode}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="addr-country"
                className="text-sm font-medium text-foreground"
              >
                Country <span className="text-destructive">*</span>
              </Label>
              <Input
                id="addr-country"
                value={form.country}
                onChange={(e) => set("country", e.target.value)}
                placeholder="India"
                className={`bg-input border-border ${errors.country ? "border-destructive" : ""}`}
                data-ocid="address-form-country"
              />
              {errors.country && (
                <p className="text-xs text-destructive">{errors.country}</p>
              )}
            </div>
          </div>

          {/* Set as Default */}
          <div
            className="flex items-center gap-2.5"
            data-ocid="address-form-default-toggle"
          >
            <input
              type="checkbox"
              id="addr-is-default"
              checked={form.isDefault}
              onChange={(e) => set("isDefault", e.target.checked)}
              className="w-4 h-4 rounded border border-border accent-accent cursor-pointer"
            />
            <label
              htmlFor="addr-is-default"
              className="text-sm text-foreground cursor-pointer"
            >
              Set as default address
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2 border-t border-border">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isSaving}
              data-ocid="address-form-cancel"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              data-ocid="address-form-submit"
            >
              {isSaving
                ? "Saving…"
                : editAddress
                  ? "Save Changes"
                  : "Add Address"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Address Card ─────────────────────────────────────────────────────────────

interface AddressCardProps {
  address: ShippingAddress;
  onEdit: (address: ShippingAddress) => void;
  onDelete: (address: ShippingAddress) => void;
  onSetDefault: (id: string) => void;
}

function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
}: AddressCardProps) {
  return (
    <div
      className={`relative p-4 rounded-xl border transition-colors ${
        address.isDefault
          ? "border-accent/50 bg-accent/5"
          : "border-border bg-background hover:border-border/80"
      }`}
      data-ocid="address-card"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
              address.isDefault ? "bg-accent/20" : "bg-muted"
            }`}
          >
            <MapPin
              className={`h-4 w-4 ${address.isDefault ? "text-accent" : "text-muted-foreground"}`}
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-medium text-sm text-foreground">
                {address.label || "Address"}
              </p>
              {address.isDefault && (
                <Badge
                  className="text-[10px] px-1.5 py-0 bg-accent/15 text-accent border-accent/30 border font-medium"
                  data-ocid="address-default-badge"
                >
                  Default
                </Badge>
              )}
            </div>
            <p className="text-sm text-foreground mt-0.5">{address.fullName}</p>
            <p className="text-sm text-muted-foreground">{address.line1}</p>
            {address.line2 && (
              <p className="text-sm text-muted-foreground">{address.line2}</p>
            )}
            <p className="text-sm text-muted-foreground">
              {address.city}, {address.state} {address.postalCode}
            </p>
            <p className="text-sm text-muted-foreground">{address.country}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          {!address.isDefault && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSetDefault(address.id)}
              className="h-7 px-2 text-xs text-muted-foreground hover:text-accent hover:bg-accent/10"
              data-ocid="address-set-default-btn"
            >
              Set default
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(address)}
            className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted"
            aria-label="Edit address"
            data-ocid="address-edit-btn"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(address)}
            className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            aria-label="Delete address"
            data-ocid="address-delete-btn"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Shipping Addresses Section ───────────────────────────────────────────────

function ShippingAddressesSection() {
  const {
    addresses,
    isLoading,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefault,
  } = useAddresses();

  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ShippingAddress | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ShippingAddress | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  function openAdd() {
    setEditTarget(null);
    setFormOpen(true);
  }

  function openEdit(address: ShippingAddress) {
    setEditTarget(address);
    setFormOpen(true);
  }

  async function handleSave(data: Omit<ShippingAddress, "id">) {
    if (editTarget) {
      await updateAddress({ ...data, id: editTarget.id });
    } else {
      await addAddress(data);
    }
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteAddress(deleteTarget.id);
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <Card
        className="bg-card border-border"
        data-ocid="account-addresses-card"
      >
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-base font-semibold">
              <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-accent" />
              </div>
              Shipping Addresses
            </CardTitle>
            <Button
              size="sm"
              onClick={openAdd}
              className="bg-accent text-accent-foreground hover:bg-accent/90 gap-1.5"
              data-ocid="address-add-btn"
            >
              <Plus className="h-4 w-4" />
              Add Address
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-24 w-full rounded-xl" />
              ))}
            </div>
          ) : addresses.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-12 gap-4 text-center"
              data-ocid="addresses-empty-state"
            >
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
                <MapPin className="h-7 w-7 text-muted-foreground" />
              </div>
              <div>
                <p className="font-display text-base font-semibold text-foreground">
                  No saved addresses yet
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Save an address to speed up your future checkouts.
                </p>
              </div>
              <Button
                onClick={openAdd}
                className="bg-accent text-accent-foreground hover:bg-accent/90 gap-1.5"
                data-ocid="addresses-add-first-btn"
              >
                <Plus className="h-4 w-4" />
                Add Your First Address
              </Button>
            </div>
          ) : (
            <div className="space-y-3" data-ocid="addresses-list">
              {addresses.map((address) => (
                <AddressCard
                  key={address.id}
                  address={address}
                  onEdit={openEdit}
                  onDelete={setDeleteTarget}
                  onSetDefault={setDefault}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add / Edit Modal */}
      <AddressFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        editAddress={editTarget}
        onSave={handleSave}
      />

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
      >
        <AlertDialogContent
          className="bg-card border-border"
          data-ocid="address-delete-dialog"
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-lg font-semibold text-foreground">
              Delete this address?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              {deleteTarget && (
                <>
                  <span className="font-medium text-foreground">
                    {deleteTarget.fullName}
                  </span>
                  {" — "}
                  {deleteTarget.line1}, {deleteTarget.city}
                  <br />
                  This action cannot be undone.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="border-border"
              data-ocid="address-delete-cancel"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-ocid="address-delete-confirm"
            >
              {isDeleting ? "Deleting…" : "Confirm Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// ─── Account Page ─────────────────────────────────────────────────────────────

export default function AccountPage() {
  const { isAuthenticated, isInitializing, principalText, logout, login } =
    useAuth();
  const { actor, isFetching: isActorFetching } = useActor(createActor);

  const {
    data: orders,
    isLoading: isOrdersLoading,
    isError,
  } = useQuery<Order[]>({
    queryKey: ["userOrders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserOrders();
    },
    enabled: !!actor && !isActorFetching && isAuthenticated,
  });

  if (isInitializing) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto space-y-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div
        className="container mx-auto px-4 py-24 text-center flex flex-col items-center gap-6"
        data-ocid="account-signin-prompt"
      >
        <div className="h-20 w-20 rounded-full bg-accent/10 flex items-center justify-center">
          <User className="h-10 w-10 text-accent/50" />
        </div>
        <div>
          <h1 className="font-display text-3xl font-semibold text-foreground mb-2">
            Sign in to view your account
          </h1>
          <p className="text-muted-foreground font-body">
            Access your profile, addresses, and order history.
          </p>
        </div>
        <Button
          onClick={() => void login()}
          className="bg-accent hover:bg-accent/90 text-accent-foreground font-body font-semibold px-8 shadow-elevation transition-smooth"
          data-ocid="account-login-cta"
        >
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Page header */}
          <div>
            <h1 className="font-display text-3xl font-semibold text-foreground tracking-tight">
              My Account
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your profile, addresses, and order history.
            </p>
          </div>

          {/* Profile card */}
          <Card
            className="bg-card border-border"
            data-ocid="account-profile-card"
          >
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-base font-semibold">
                <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center">
                  <User className="h-5 w-5 text-accent" />
                </div>
                Your Identity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">
                  Principal ID
                </p>
                <p
                  className="font-mono text-sm text-foreground bg-muted px-3 py-2 rounded-lg break-all"
                  data-ocid="account-principal"
                >
                  {principalText}
                </p>
              </div>
              <div className="pt-2 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="flex items-center gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-smooth"
                  data-ocid="account-logout-btn"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Addresses */}
          <ShippingAddressesSection />

          {/* Order history card */}
          <Card
            className="bg-card border-border"
            data-ocid="account-orders-card"
          >
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-base font-semibold">
                <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center">
                  <Package className="h-5 w-5 text-accent" />
                </div>
                Order History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isOrdersLoading || isActorFetching ? (
                <OrderHistorySkeleton />
              ) : isError ? (
                <p className="text-sm text-destructive py-4 text-center">
                  Unable to load orders. Please try again later.
                </p>
              ) : !orders || orders.length === 0 ? (
                <EmptyOrders />
              ) : (
                <Table data-ocid="orders-table">
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="text-muted-foreground font-medium">
                        Order ID
                      </TableHead>
                      <TableHead className="text-muted-foreground font-medium">
                        Date
                      </TableHead>
                      <TableHead className="text-muted-foreground font-medium text-right">
                        Total
                      </TableHead>
                      <TableHead className="text-muted-foreground font-medium">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow
                        key={order.id}
                        className="border-border hover:bg-muted/30 transition-colors"
                        data-ocid="orders-table-row"
                      >
                        <TableCell className="font-mono text-xs text-foreground max-w-[120px] truncate">
                          {order.id}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                          {formatDate(order.timestamp)}
                        </TableCell>
                        <TableCell className="text-sm font-medium text-foreground text-right tabular-nums whitespace-nowrap">
                          {formatPrice(order.total)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={statusVariant(order.status)}
                            className="text-xs capitalize"
                            data-ocid="order-status-badge"
                          >
                            {statusLabel(order.status)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
