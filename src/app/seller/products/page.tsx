"use client";

import { useState } from "react";
import { products as initialProducts } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Edit2, Trash2, Eye, Package, Filter, X } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface SellerProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  description: string;
  price: number;
  comparePrice: number;
  stock: number;
  weight: string;
  dimensions: string;
  material: string;
  finish: string;
  images: string[];
  hsnCode: string;
  gstRate: number;
  status: "active" | "inactive";
  sales: number;
  revenue: number;
}

const generateSku = (name: string, id: string) => {
  const prefix = name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 4);
  return `AJJ-${prefix}-${id.split("-")[1]}`;
};

function mapProduct(p: typeof initialProducts[0]): SellerProduct {
  const sales = Math.floor(Math.random() * 80) + 10;
  return {
    id: p.id,
    name: p.name,
    sku: generateSku(p.name, p.id),
    category: p.category,
    description: p.description,
    price: p.price,
    comparePrice: p.comparePrice || 0,
    stock: p.stock,
    weight: p.weight,
    dimensions: p.dimensions,
    material: p.material,
    finish: p.finish,
    images: p.images,
    hsnCode: p.hsnCode,
    gstRate: p.gstRate,
    status: "active",
    sales,
    revenue: p.price * sales,
  };
}

const emptyProduct: SellerProduct = {
  id: "",
  name: "",
  sku: "",
  category: "Puja Items",
  description: "",
  price: 0,
  comparePrice: 0,
  stock: 0,
  weight: "",
  dimensions: "",
  material: "Premium Brass",
  finish: "Gold Polish",
  images: [],
  hsnCode: "7418",
  gstRate: 18,
  status: "active",
  sales: 0,
  revenue: 0,
};

const categories = ["Puja Items", "Idols & Murtis", "Home Decor", "Utensils", "Wellness", "Festival Specials"];

type FilterType = "all" | "active" | "low-stock" | "out-of-stock";

export default function ProductsPage() {
  const [products, setProducts] = useState<SellerProduct[]>(initialProducts.map(mapProduct));
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState<SellerProduct>({ ...emptyProduct });
  const [editingId, setEditingId] = useState<string | null>(null);

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (filter === "active") return p.status === "active";
    if (filter === "low-stock") return p.stock > 0 && p.stock <= 10;
    if (filter === "out-of-stock") return p.stock === 0;
    return true;
  });

  const handleSave = () => {
    if (editingId) {
      setProducts((prev) => prev.map((p) => (p.id === editingId ? { ...form } : p)));
    } else {
      const newId = `BR-${String(products.length + 1).padStart(3, "0")}`;
      const sku = `AJJ-${form.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 4)}-${String(products.length + 1).padStart(3, "0")}`;
      setProducts((prev) => [...prev, { ...form, id: newId, sku, sales: 0, revenue: 0 }]);
    }
    setShowAddForm(false);
    setEditingId(null);
    setForm({ ...emptyProduct });
  };

  const handleEdit = (p: SellerProduct) => {
    setForm({ ...p });
    setEditingId(p.id);
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const toggleStatus = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: p.status === "active" ? "inactive" : "active" } : p))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">Products</h1>
          <p className="text-muted text-sm mt-1">{products.length} products total</p>
        </div>
        <Button onClick={() => { setShowAddForm(true); setEditingId(null); setForm({ ...emptyProduct }); }} className="gap-2">
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filter} onValueChange={(v: FilterType) => setFilter(v)}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="low-stock">Low Stock</SelectItem>
            <SelectItem value="out-of-stock">Out of Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white rounded-lg border border-border/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-[#F7F2E8]/50">
                <th className="text-left px-4 py-3 font-medium text-muted text-xs uppercase tracking-wider">Product</th>
                <th className="text-left px-4 py-3 font-medium text-muted text-xs uppercase tracking-wider">SKU</th>
                <th className="text-left px-4 py-3 font-medium text-muted text-xs uppercase tracking-wider">Category</th>
                <th className="text-right px-4 py-3 font-medium text-muted text-xs uppercase tracking-wider">Price</th>
                <th className="text-right px-4 py-3 font-medium text-muted text-xs uppercase tracking-wider">Stock</th>
                <th className="text-center px-4 py-3 font-medium text-muted text-xs uppercase tracking-wider">Status</th>
                <th className="text-right px-4 py-3 font-medium text-muted text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-[#F7F2E8]/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#F7F2E8] overflow-hidden shrink-0 border border-border/40">
                        {p.images[0] ? (
                          <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-5 w-5 text-muted" />
                          </div>
                        )}
                      </div>
                      <span className="font-medium text-primary truncate max-w-[200px]">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted font-mono text-xs">{p.sku}</td>
                  <td className="px-4 py-3 text-muted">{p.category}</td>
                  <td className="px-4 py-3 text-right font-medium text-primary">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={`font-medium ${
                        p.stock === 0 ? "text-red-600" : p.stock <= 10 ? "text-amber-600" : "text-primary"
                      }`}
                    >
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleStatus(p.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                        p.status === "active"
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${p.status === "active" ? "bg-green-500" : "bg-gray-400"}`} />
                      {p.status === "active" ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(p)}>
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700" onClick={() => handleDelete(p.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-muted">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 pb-10 px-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowAddForm(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto z-10">
            <div className="sticky top-0 bg-white border-b border-border px-6 py-4 flex items-center justify-between rounded-t-xl">
              <h2 className="font-heading text-lg font-semibold text-primary">
                {editingId ? "Edit Product" : "Add New Product"}
              </h2>
              <button onClick={() => setShowAddForm(false)} className="p-1 rounded-md hover:bg-primary/5 text-muted hover:text-primary">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Product Name</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Category</Label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label>Description</Label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="flex min-h-[80px] w-full rounded-md border border-border bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary transition-all"
                    rows={3}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Price (₹)</Label>
                  <Input type="number" value={form.price || ""} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Compare Price (₹)</Label>
                  <Input type="number" value={form.comparePrice || ""} onChange={(e) => setForm({ ...form, comparePrice: Number(e.target.value) })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Stock</Label>
                  <Input type="number" value={form.stock || ""} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Weight</Label>
                  <Input value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} placeholder="e.g. 1.2 kg" />
                </div>
                <div className="space-y-1.5">
                  <Label>Dimensions</Label>
                  <Input value={form.dimensions} onChange={(e) => setForm({ ...form, dimensions: e.target.value })} placeholder="e.g. 15 x 15 x 25 cm" />
                </div>
                <div className="space-y-1.5">
                  <Label>Material</Label>
                  <Input value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Finish</Label>
                  <Input value={form.finish} onChange={(e) => setForm({ ...form, finish: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>HSN Code</Label>
                  <Input value={form.hsnCode} onChange={(e) => setForm({ ...form, hsnCode: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>GST Rate (%)</Label>
                  <Input type="number" value={form.gstRate || ""} onChange={(e) => setForm({ ...form, gstRate: Number(e.target.value) })} />
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 bg-white border-t border-border px-6 py-4 flex justify-end gap-3 rounded-b-xl">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
              <Button onClick={handleSave}>{editingId ? "Update Product" : "Add Product"}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
