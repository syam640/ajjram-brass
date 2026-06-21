"use client";

import { useState } from "react";
import { savedAddresses as initialAddresses } from "@/data/users";
import type { Address } from "@/data/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Plus, Edit2, Trash2, Home, Briefcase, MapPinned, Check } from "lucide-react";

const typeIcons: Record<string, React.ReactNode> = {
  home: <Home className="h-3.5 w-3.5" />,
  work: <Briefcase className="h-3.5 w-3.5" />,
  other: <MapPinned className="h-3.5 w-3.5" />,
};

const typeLabels: Record<string, string> = {
  home: "Home",
  work: "Work",
  other: "Other",
};

interface AddressForm {
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  type: "home" | "work" | "other";
  isDefault: boolean;
}

const emptyForm: AddressForm = {
  name: "",
  phone: "",
  street: "",
  city: "",
  state: "",
  pincode: "",
  type: "home",
  isDefault: false,
};

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AddressForm>(emptyForm);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setAddresses((prev) =>
        prev.map((a) => {
          if (a.id === editingId) {
            const updated = { ...a, ...form };
            if (form.isDefault) {
              return updated;
            }
            return updated;
          }
          if (form.isDefault) return { ...a, isDefault: false };
          return a;
        })
      );
    } else {
      const newAddr: Address = {
        id: "addr-" + Date.now(),
        ...form,
      };
      setAddresses((prev) => {
        if (form.isDefault) {
          return prev.map((a) => ({ ...a, isDefault: false })).concat(newAddr);
        }
        return [...prev, newAddr];
      });
    }
    resetForm();
  };

  const handleEdit = (addr: Address) => {
    setForm({
      name: addr.name,
      phone: addr.phone,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      type: addr.type,
      isDefault: addr.isDefault,
    });
    setEditingId(addr.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">Saved Addresses</h1>
            <p className="mt-1 text-sm text-muted">{addresses.length} address{addresses.length !== 1 ? "es" : ""} on file</p>
          </div>
          <Button onClick={() => { resetForm(); setShowForm((v) => !v); }}>
            <Plus className="mr-2 h-4 w-4" />
            Add Address
          </Button>
        </div>

        {showForm && (
          <div className="mb-8 rounded-xl border border-border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-primary">
              {editingId ? "Edit Address" : "Add New Address"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="addrName">Full Name</Label>
                  <Input id="addrName" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="addrPhone">Phone</Label>
                  <Input id="addrPhone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="addrStreet">Street Address</Label>
                <Input id="addrStreet" value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} required />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="addrCity">City</Label>
                  <Input id="addrCity" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="addrState">State</Label>
                  <Input id="addrState" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="addrPincode">Pincode</Label>
                  <Input id="addrPincode" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} required />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as "home" | "work" | "other" })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="home">Home</SelectItem>
                      <SelectItem value="work">Work</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isDefault}
                      onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
                      className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                    />
                    <span className="text-sm text-muted">Set as default address</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="submit">{editingId ? "Update Address" : "Save Address"}</Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {addresses.length === 0 ? (
          <div className="rounded-xl border border-border bg-white py-16 text-center">
            <MapPin className="mx-auto mb-4 h-12 w-12 text-muted" />
            <p className="text-lg font-medium text-primary">No addresses saved yet</p>
            <p className="mt-1 text-sm text-muted">Add an address to get started</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="group relative rounded-xl border border-border bg-white p-5 transition-all hover:border-primary/20 hover:shadow-sm"
              >
                {addr.isDefault && (
                  <Badge variant="success" className="absolute right-3 top-3 flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    Default
                  </Badge>
                )}

                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/5 text-primary">
                    {typeIcons[addr.type] || <MapPin className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="font-medium text-primary">{addr.name}</p>
                    <Badge variant="outline" className="text-[10px]">
                      {typeLabels[addr.type]}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-1 text-sm text-muted">
                  <p>{addr.street}</p>
                  <p>
                    {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                  <p className="pt-1 font-medium text-primary">{addr.phone}</p>
                </div>

                <Separator className="my-4" />

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(addr)}>
                    <Edit2 className="mr-1.5 h-3.5 w-3.5" />
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50 hover:text-red-600" onClick={() => handleDelete(addr.id)}>
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                    Delete
                  </Button>
                  {!addr.isDefault && (
                    <Button variant="ghost" size="sm" onClick={() => handleSetDefault(addr.id)} className="ml-auto text-xs">
                      Set as Default
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
