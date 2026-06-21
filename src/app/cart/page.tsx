"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Trash2,
  ShoppingBag,
  Heart,
  Minus,
  Plus,
  Tag,
  Truck,
  ChevronRight,
  CreditCard,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { products } from "@/data/products";

const VALID_COUPONS: Record<string, number> = {
  BRASS10: 10,
  FESTIVE15: 15,
  HERITAGE20: 20,
};

export default function CartPage() {
  const { state, removeItem, updateQuantity, applyCoupon, removeCoupon, getSubtotal } = useCart();
  const { toggleWishlist } = useWishlist();
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  const subtotal = getSubtotal();
  const gst = subtotal * 0.18;
  const shipping = subtotal > 999 ? 0 : 149;
  const total = subtotal + gst + shipping - state.discount;

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    const discountPercent = VALID_COUPONS[code];
    if (discountPercent) {
      const discountAmount = Math.round((subtotal * discountPercent) / 100);
      applyCoupon(code, discountAmount);
      setCouponApplied(true);
      setCouponError("");
      setCouponInput("");
    } else {
      setCouponError("Invalid coupon code");
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponApplied(false);
    setCouponInput("");
    setCouponError("");
  };

  const handleMoveToWishlist = (productId: string) => {
    toggleWishlist(productId);
  };

  const recentlyViewedProducts = useMemo(() => {
    return products.filter((p) =>
      ["BR-001", "BR-007", "BR-005", "BR-016"].includes(p.id)
    );
  }, []);

  if (state.items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <nav className="flex items-center gap-2 text-sm text-muted mb-8">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-primary font-medium">Cart</span>
          </nav>

          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 rounded-full bg-secondary/10 flex items-center justify-center mb-6">
              <ShoppingBag className="w-12 h-12 text-secondary" />
            </div>
            <h2 className="font-heading text-3xl font-bold text-primary mb-2">
              Your cart is empty
            </h2>
            <p className="text-muted mb-8 text-center max-w-md">
              Looks like you haven&apos;t added anything to your cart yet.
              Browse our collection of premium brass artifacts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <Link href="/products">Start Shopping</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/">Continue browsing</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <nav className="flex items-center gap-2 text-sm text-muted mb-8">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-primary font-medium">Cart</span>
        </nav>

        <h1 className="font-heading text-4xl font-bold text-primary mb-8">
          Shopping Cart ({state.items.length} {state.items.length === 1 ? "item" : "items"})
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 lg:w-[65%]">
            <div className="space-y-4">
              {state.items.map((item) => (
                <div
                  key={item.productId}
                  className="bg-white rounded-lg border border-border p-4 flex gap-4"
                >
                  <div className="w-24 h-24 rounded-md overflow-hidden bg-secondary/10 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h3 className="font-heading text-lg font-semibold text-primary truncate">
                          {item.name}
                        </h3>
                        <p className="text-sm text-muted">{item.material}</p>
                        <p className="font-semibold text-primary mt-1">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.productId)}
                        className="text-muted hover:text-red-500 flex-shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                      <div className="flex items-center border border-border rounded-md">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              Math.max(1, item.quantity - 1)
                            )
                          }
                          disabled={item.quantity <= 1}
                          className="p-2 hover:bg-secondary/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center border-x border-border">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              Math.min(item.stock, item.quantity + 1)
                            )
                          }
                          disabled={item.quantity >= item.stock}
                          className="p-2 hover:bg-secondary/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="font-semibold text-primary">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMoveToWishlist(item.productId)}
                          className="text-muted hover:text-secondary text-xs gap-1"
                        >
                          <Heart className="h-3.5 w-3.5" />
                          Save for Later
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-white rounded-lg border border-border p-4">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="h-4 w-4 text-secondary" />
                <h3 className="font-medium text-primary">Apply Coupon</h3>
              </div>
              {state.couponCode ? (
                <div className="flex items-center justify-between bg-secondary/10 rounded-md px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-secondary" />
                    <span className="font-medium text-primary">
                      {state.couponCode}
                    </span>
                    <span className="text-sm text-muted">
                      (-{formatPrice(state.discount)})
                    </span>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-sm text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter coupon code"
                    value={couponInput}
                    onChange={(e) => {
                      setCouponInput(e.target.value);
                      setCouponError("");
                    }}
                    className="flex-1 uppercase"
                    onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                  />
                  <Button
                    onClick={handleApplyCoupon}
                    variant="secondary"
                    className="flex-shrink-0"
                  >
                    Apply
                  </Button>
                </div>
              )}
              {couponError && (
                <p className="text-sm text-red-500 mt-2">{couponError}</p>
              )}
            </div>

            {subtotal > 999 && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                <Truck className="h-5 w-5 text-green-600" />
                <p className="text-sm text-green-700 font-medium">
                  Your order qualifies for FREE delivery!
                </p>
              </div>
            )}

            <div className="mt-6">
              <Button asChild variant="ghost" className="gap-2">
                <Link href="/products">
                  <ChevronRight className="h-4 w-4 rotate-180" />
                  Continue Shopping
                </Link>
              </Button>
            </div>
          </div>

          <div className="lg:w-[35%]">
            <div className="bg-white rounded-lg border border-border p-6 sticky top-24">
              <h2 className="font-heading text-2xl font-bold text-primary mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">GST (18%)</span>
                  <span className="font-medium">{formatPrice(gst)}</span>
                </div>
                {state.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon Discount</span>
                    <span>-{formatPrice(state.discount)}</span>
                  </div>
                )}
                <Separator className="my-2" />
                <div className="flex justify-between">
                  <span className="font-heading text-xl font-bold text-primary">
                    Total
                  </span>
                  <span className="font-heading text-xl font-bold text-primary">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              <Button asChild size="lg" className="w-full mt-6 bg-primary hover:bg-primary/90">
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>

              <div className="mt-6">
                <p className="text-xs text-muted text-center mb-3">
                  We accept
                </p>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <div className="flex items-center gap-1.5 text-xs text-muted bg-secondary/10 px-3 py-1.5 rounded-full">
                    <CreditCard className="h-3 w-3" />
                    Visa
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted bg-secondary/10 px-3 py-1.5 rounded-full">
                    <CreditCard className="h-3 w-3" />
                    MC
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted bg-secondary/10 px-3 py-1.5 rounded-full">
                    <CreditCard className="h-3 w-3" />
                    UPI
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted bg-secondary/10 px-3 py-1.5 rounded-full">
                    <CreditCard className="h-3 w-3" />
                    Net Banking
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted bg-secondary/10 px-3 py-1.5 rounded-full">
                    <CreditCard className="h-3 w-3" />
                    COD
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-16">
          <h2 className="font-heading text-2xl font-bold text-primary mb-6">
            Recently Viewed
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recentlyViewedProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group bg-white rounded-lg border border-border overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="aspect-square bg-secondary/5 overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-heading font-semibold text-primary text-sm truncate">
                    {product.name}
                  </h3>
                  <p className="font-medium text-secondary text-sm mt-1">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
