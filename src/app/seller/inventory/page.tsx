"use client";

import { useState } from "react";
import { products as initialProducts } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Search, Package, AlertTriangle, XCircle, Box, ArrowUpRight, TrendingDown } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function SellerInventoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "low" | "out">("all");

  const filteredProducts = initialProducts.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filter === "all" ? true : filter === "low" ? p.stock > 0 && p.stock <= 20 : p.stock === 0;
    return matchesSearch && matchesFilter;
  });

  const totalStock = initialProducts.reduce((s, p) => s + p.stock, 0);
  const lowStock = initialProducts.filter((p) => p.stock > 0 && p.stock <= 20).length;
  const outOfStock = initialProducts.filter((p) => p.stock === 0).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-primary">Inventory</h1>
          <p className="text-sm text-muted mt-1">{initialProducts.length} products tracked</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-border p-4">
          <Box className="h-5 w-5 text-primary mb-2" />
          <p className="text-2xl font-bold text-primary">{totalStock}</p>
          <p className="text-xs text-muted">Total Stock Units</p>
        </div>
        <div className="bg-white rounded-lg border border-border p-4">
          <Package className="h-5 w-5 text-accent mb-2" />
          <p className="text-2xl font-bold text-primary">{initialProducts.length}</p>
          <p className="text-xs text-muted">Unique Products</p>
        </div>
        <div className="bg-white rounded-lg border border-yellow-200 p-4">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mb-2" />
          <p className="text-2xl font-bold text-yellow-700">{lowStock}</p>
          <p className="text-xs text-yellow-600">Low Stock Items</p>
        </div>
        <div className="bg-white rounded-lg border border-red-200 p-4">
          <XCircle className="h-5 w-5 text-red-600 mb-2" />
          <p className="text-2xl font-bold text-red-700">{outOfStock}</p>
          <p className="text-xs text-red-600">Out of Stock</p>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <Input
            placeholder="Search inventory..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "low", "out"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filter === f ? "bg-primary text-white" : "bg-background text-muted hover:text-primary"
              }`}
            >
              {f === "all" ? "All" : f === "low" ? "Low Stock" : "Out of Stock"}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted uppercase tracking-wider">Product</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted uppercase tracking-wider">SKU</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted uppercase tracking-wider">Category</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted uppercase tracking-wider">Price</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted uppercase tracking-wider">Stock</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b border-border/50 last:border-0 hover:bg-background/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md bg-background overflow-hidden flex-shrink-0">
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-primary">{product.name}</p>
                        <p className="text-xs text-muted">{product.material}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-muted">{product.id}</td>
                  <td className="px-4 py-3 text-sm text-muted">{product.category}</td>
                  <td className="px-4 py-3 font-medium text-sm">{formatPrice(product.price)}</td>
                  <td className="px-4 py-3">
                    <span className={`font-medium text-sm ${
                      product.stock === 0 ? "text-red-600" : product.stock <= 20 ? "text-yellow-600" : "text-green-600"
                    }`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {product.stock === 0 ? (
                      <Badge variant="destructive">Out of Stock</Badge>
                    ) : product.stock <= 20 ? (
                      <Badge variant="warning">Low Stock</Badge>
                    ) : (
                      <Badge variant="success">In Stock</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-muted mx-auto mb-4" />
          <p className="text-muted">No products found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
