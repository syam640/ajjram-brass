"use client";

import { useState } from "react";
import { products } from "@/data/products";
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
import { Separator } from "@/components/ui/separator";
import { Plus, Percent, Tag, Clock, Search, Edit2, Trash2, Zap, CheckCircle, XCircle } from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";

interface Coupon {
  id: string;
  code: string;
  type: "percentage" | "flat";
  discountValue: number;
  minOrder: number;
  maxDiscount: number;
  usageCount: number;
  status: "active" | "inactive";
  expiry: string;
}

interface FlashSale {
  id: string;
  productId: string;
  productName: string;
  discount: number;
  startDate: string;
  endDate: string;
  status: "active" | "scheduled" | "ended";
}

const initialCoupons: Coupon[] = [
  { id: "c1", code: "FESTIVE25", type: "percentage", discountValue: 25, minOrder: 2000, maxDiscount: 5000, usageCount: 142, status: "active", expiry: "2026-03-31" },
  { id: "c2", code: "WELCOME15", type: "percentage", discountValue: 15, minOrder: 1000, maxDiscount: 2000, usageCount: 89, status: "active", expiry: "2026-06-30" },
  { id: "c3", code: "FLAT500", type: "flat", discountValue: 500, minOrder: 3000, maxDiscount: 500, usageCount: 56, status: "active", expiry: "2026-02-28" },
  { id: "c4", code: "DIWALI20", type: "percentage", discountValue: 20, minOrder: 2500, maxDiscount: 3000, usageCount: 210, status: "inactive", expiry: "2025-12-31" },
  { id: "c5", code: "BRASS10", type: "percentage", discountValue: 10, minOrder: 0, maxDiscount: 1000, usageCount: 34, status: "inactive", expiry: "2025-11-30" },
];

const initialFlashSales: FlashSale[] = [
  { id: "fs1", productId: "BR-001", productName: "Navratna Brass Kalash", discount: 31, startDate: "2025-12-20", endDate: "2026-01-15", status: "active" },
  { id: "fs2", productId: "BR-008", productName: "Brass Peacock Decorative", discount: 22, startDate: "2025-12-25", endDate: "2026-01-10", status: "active" },
  { id: "fs3", productId: "BR-010", productName: "Brass Aarti Thali Set", discount: 25, startDate: "2025-12-30", endDate: "2026-01-20", status: "scheduled" },
];

const emptyCoupon: Coupon = {
  id: "",
  code: "",
  type: "percentage",
  discountValue: 0,
  minOrder: 0,
  maxDiscount: 0,
  usageCount: 0,
  status: "active",
  expiry: "",
};

type Tab = "coupons" | "flash-sales";

export default function OffersPage() {
  const [activeTab, setActiveTab] = useState<Tab>("coupons");
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [flashSales, setFlashSales] = useState<FlashSale[]>(initialFlashSales);
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [showFlashForm, setShowFlashForm] = useState(false);
  const [couponForm, setCouponForm] = useState<Coupon>({ ...emptyCoupon });
  const [flashForm, setFlashForm] = useState({ productId: "", discount: 0, startDate: "", endDate: "" });
  const [search, setSearch] = useState("");

  const filteredCoupons = coupons.filter((c) =>
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleSaveCoupon = () => {
    if (!couponForm.code || !couponForm.discountValue || !couponForm.expiry) {
      return alert("Please fill all required fields");
    }
    if (couponForm.id) {
      setCoupons((prev) => prev.map((c) => (c.id === couponForm.id ? { ...couponForm } : c)));
    } else {
      setCoupons((prev) => [...prev, { ...couponForm, id: `c${Date.now()}`, usageCount: 0 }]);
    }
    setShowCouponForm(false);
    setCouponForm({ ...emptyCoupon });
  };

  const handleDeleteCoupon = (id: string) => {
    if (confirm("Delete this coupon?")) {
      setCoupons((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const toggleCouponStatus = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: c.status === "active" ? "inactive" : "active" } : c))
    );
  };

  const handleCreateFlashSale = () => {
    if (!flashForm.productId || !flashForm.discount || !flashForm.startDate || !flashForm.endDate) {
      return alert("Please fill all required fields");
    }
    const product = products.find((p) => p.id === flashForm.productId);
    setFlashSales((prev) => [
      ...prev,
      {
        id: `fs${Date.now()}`,
        productId: flashForm.productId,
        productName: product?.name || "Unknown Product",
        discount: flashForm.discount,
        startDate: flashForm.startDate,
        endDate: flashForm.endDate,
        status: "scheduled",
      },
    ]);
    setShowFlashForm(false);
    setFlashForm({ productId: "", discount: 0, startDate: "", endDate: "" });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-primary">Offers &amp; Coupons</h1>
        <p className="text-muted text-sm mt-1">Manage promotions and discounts</p>
      </div>

      <div className="flex gap-1">
        <button
          onClick={() => setActiveTab("coupons")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "coupons"
              ? "bg-primary text-white shadow-sm"
              : "bg-white text-muted hover:text-primary border border-border/60"
          }`}
        >
          <Tag className="h-4 w-4 inline mr-1.5" /> Coupons
        </button>
        <button
          onClick={() => setActiveTab("flash-sales")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "flash-sales"
              ? "bg-primary text-white shadow-sm"
              : "bg-white text-muted hover:text-primary border border-border/60"
          }`}
        >
          <Zap className="h-4 w-4 inline mr-1.5" /> Flash Sales
        </button>
      </div>

      {activeTab === "coupons" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <Input
                placeholder="Search coupons..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button onClick={() => { setShowCouponForm(true); setCouponForm({ ...emptyCoupon }); }} className="gap-2">
              <Plus className="h-4 w-4" /> Add Coupon
            </Button>
          </div>

          <div className="bg-white rounded-lg border border-border/60 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-[#F7F2E8]/50">
                    <th className="text-left px-4 py-3 font-medium text-muted text-xs uppercase tracking-wider">Code</th>
                    <th className="text-left px-4 py-3 font-medium text-muted text-xs uppercase tracking-wider">Discount</th>
                    <th className="text-right px-4 py-3 font-medium text-muted text-xs uppercase tracking-wider">Min Order</th>
                    <th className="text-right px-4 py-3 font-medium text-muted text-xs uppercase tracking-wider">Usage</th>
                    <th className="text-center px-4 py-3 font-medium text-muted text-xs uppercase tracking-wider">Status</th>
                    <th className="text-right px-4 py-3 font-medium text-muted text-xs uppercase tracking-wider">Expiry</th>
                    <th className="text-right px-4 py-3 font-medium text-muted text-xs uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredCoupons.map((c) => (
                    <tr key={c.id} className="hover:bg-[#F7F2E8]/30 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-mono font-bold text-primary bg-[#F7F2E8] px-2 py-1 rounded text-xs">
                          {c.code}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Percent className="h-3 w-3 text-secondary" />
                          <span className="font-medium text-primary">
                            {c.type === "percentage" ? `${c.discountValue}%` : formatPrice(c.discountValue)}
                          </span>
                          {c.type === "percentage" && c.maxDiscount > 0 && (
                            <span className="text-xs text-muted">(max {formatPrice(c.maxDiscount)})</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-muted">{c.minOrder > 0 ? formatPrice(c.minOrder) : "—"}</td>
                      <td className="px-4 py-3 text-right font-medium text-primary">{c.usageCount}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => toggleCouponStatus(c.id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                            c.status === "active"
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                          }`}
                        >
                          {c.status === "active" ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                          {c.status === "active" ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right text-muted text-xs">{formatDate(c.expiry)}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {
                              setCouponForm({ ...c });
                              setShowCouponForm(true);
                            }}
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700" onClick={() => handleDeleteCoupon(c.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredCoupons.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-muted">No coupons found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "flash-sales" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setShowFlashForm(true)} className="gap-2">
              <Zap className="h-4 w-4" /> Create Flash Sale
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {flashSales.map((fs) => (
              <div key={fs.id} className="bg-white rounded-xl border border-border/60 p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="font-heading text-base font-semibold text-primary">{fs.productName}</h3>
                  <Badge
                    className={
                      fs.status === "active"
                        ? "bg-green-100 text-green-700"
                        : fs.status === "scheduled"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-500"
                    }
                  >
                    {fs.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-amber-500" />
                  <span className="text-2xl font-bold text-primary">{fs.discount}% OFF</span>
                </div>
                <Separator />
                <div className="flex items-center gap-1 text-xs text-muted">
                  <Clock className="h-3 w-3" />
                  <span>{formatDate(fs.startDate)} — {formatDate(fs.endDate)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showCouponForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 pb-10 px-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowCouponForm(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl border border-border w-full max-w-lg z-10">
            <div className="border-b border-border px-6 py-4">
              <h2 className="font-heading text-lg font-semibold text-primary">
                {couponForm.id ? "Edit Coupon" : "Add Coupon"}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <Label>Coupon Code</Label>
                <Input
                  value={couponForm.code}
                  onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. FESTIVE25"
                  className="font-mono uppercase"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Discount Type</Label>
                  <Select
                    value={couponForm.type}
                    onValueChange={(v: "percentage" | "flat") => setCouponForm({ ...couponForm, type: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="flat">Flat (₹)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Discount Value</Label>
                  <Input
                    type="number"
                    value={couponForm.discountValue || ""}
                    onChange={(e) => setCouponForm({ ...couponForm, discountValue: Number(e.target.value) })}
                    placeholder={couponForm.type === "percentage" ? "e.g. 25" : "e.g. 500"}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Min Order (₹)</Label>
                  <Input
                    type="number"
                    value={couponForm.minOrder || ""}
                    onChange={(e) => setCouponForm({ ...couponForm, minOrder: Number(e.target.value) })}
                    placeholder="0 for no minimum"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Max Discount (₹)</Label>
                  <Input
                    type="number"
                    value={couponForm.maxDiscount || ""}
                    onChange={(e) => setCouponForm({ ...couponForm, maxDiscount: Number(e.target.value) })}
                    placeholder="0 for no limit"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Expiry Date</Label>
                <Input
                  type="date"
                  value={couponForm.expiry}
                  onChange={(e) => setCouponForm({ ...couponForm, expiry: e.target.value })}
                />
              </div>
            </div>
            <div className="border-t border-border px-6 py-4 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowCouponForm(false)}>Cancel</Button>
              <Button onClick={handleSaveCoupon}>{couponForm.id ? "Update" : "Create Coupon"}</Button>
            </div>
          </div>
        </div>
      )}

      {showFlashForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 pb-10 px-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowFlashForm(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl border border-border w-full max-w-lg z-10">
            <div className="border-b border-border px-6 py-4">
              <h2 className="font-heading text-lg font-semibold text-primary">Create Flash Sale</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <Label>Product</Label>
                <Select
                  value={flashForm.productId}
                  onValueChange={(v) => setFlashForm({ ...flashForm, productId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name} — {formatPrice(p.price)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Discount (%)</Label>
                <Input
                  type="number"
                  value={flashForm.discount || ""}
                  onChange={(e) => setFlashForm({ ...flashForm, discount: Number(e.target.value) })}
                  placeholder="e.g. 30"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Start Date &amp; Time</Label>
                  <Input
                    type="datetime-local"
                    value={flashForm.startDate}
                    onChange={(e) => setFlashForm({ ...flashForm, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>End Date &amp; Time</Label>
                  <Input
                    type="datetime-local"
                    value={flashForm.endDate}
                    onChange={(e) => setFlashForm({ ...flashForm, endDate: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="border-t border-border px-6 py-4 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowFlashForm(false)}>Cancel</Button>
              <Button onClick={handleCreateFlashSale} className="gap-2">
                <Zap className="h-4 w-4" /> Create Flash Sale
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
