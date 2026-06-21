"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Search, ShoppingBag, User, Heart, Menu, X, ChevronDown, LogOut, Package, Gem, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

const categories = [
  { name: "Puja Items", slug: "puja-items" },
  { name: "Idols & Murtis", slug: "idols-murtis" },
  { name: "Home Decor", slug: "home-decor" },
  { name: "Utensils", slug: "utensils" },
  { name: "Wellness", slug: "wellness" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, isLoggedIn, isSeller, logout } = useAuth();
  const { getItemCount } = useCart();
  const { wishlist } = useWishlist();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border">
      {/* Top bar */}
      <div className="bg-primary text-white/90 text-xs py-1.5">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <span className="hidden sm:block">Free Shipping on orders above ₹999</span>
          <span>Premium Brass & Heritage Craft Since 1965</span>
          <span className="hidden sm:block">GST Invoice with Every Order</span>
        </div>
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Mobile menu button */}
          <button className="lg:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Gem className="h-7 w-7 text-accent" />
            <div>
              <h1 className="font-heading text-xl md:text-2xl font-bold text-primary leading-tight">Ajjram Brass</h1>
              <p className="text-[10px] text-muted tracking-widest uppercase hidden md:block">Heritage Craftsmanship</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link href="/" className="px-3 py-2 text-sm font-medium text-primary hover:text-accent transition-colors rounded-md hover:bg-primary/5">
              Home
            </Link>
            <div className="relative group">
              <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-primary hover:text-accent transition-colors rounded-md hover:bg-primary/5">
                Categories <ChevronDown className="h-3 w-3" />
              </button>
              <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/products?category=${cat.slug}`}
                      className="block px-3 py-2 text-sm text-text hover:text-accent hover:bg-primary/5 rounded-md transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <Link href="/products" className="px-3 py-2 text-sm font-medium text-primary hover:text-accent transition-colors rounded-md hover:bg-primary/5">
              Shop All
            </Link>
            <Link href="/custom-order" className="px-3 py-2 text-sm font-medium text-primary hover:text-accent transition-colors rounded-md hover:bg-primary/5">
              Custom Order
            </Link>
            {isSeller && (
              <Link href="/seller" className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-accent hover:text-accent/80 transition-colors rounded-md hover:bg-accent/5">
                <Store className="h-4 w-4" /> Dashboard
              </Link>
            )}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-1 md:gap-2">
            <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 hover:text-accent transition-colors relative">
              <Search className="h-5 w-5" />
            </button>

            <Link href="/account/wishlist" className="p-2 hover:text-accent transition-colors relative hidden md:block">
              <Heart className="h-5 w-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link href="/cart" className="p-2 hover:text-accent transition-colors relative">
              <ShoppingBag className="h-5 w-5" />
              {getItemCount() > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-accent text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {getItemCount()}
                </span>
              )}
            </Link>

            {isLoggedIn ? (
              <div className="relative">
                <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-2 p-1 rounded-full hover:bg-primary/5 transition-colors">
                  <Avatar className="h-8 w-8 border-2 border-accent">
                    <AvatarFallback className="text-xs bg-primary text-white">{getInitials(user?.name || "U")}</AvatarFallback>
                  </Avatar>
                </button>
                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-border z-50">
                      <div className="p-3 border-b border-border">
                        <p className="font-medium text-sm">{user?.name}</p>
                        <p className="text-xs text-muted">{user?.email}</p>
                      </div>
                      <div className="p-2">
                        <Link href="/account" className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-primary/5 transition-colors" onClick={() => setShowUserMenu(false)}>
                          <User className="h-4 w-4" /> My Account
                        </Link>
                        <Link href="/orders" className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-primary/5 transition-colors" onClick={() => setShowUserMenu(false)}>
                          <Package className="h-4 w-4" /> Orders
                        </Link>
                        <Link href="/account/wishlist" className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-primary/5 transition-colors" onClick={() => setShowUserMenu(false)}>
                          <Heart className="h-4 w-4" /> Wishlist
                        </Link>
                        {isSeller && (
                          <Link href="/seller" className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-primary/5 transition-colors text-accent" onClick={() => setShowUserMenu(false)}>
                            <Store className="h-4 w-4" /> Seller Dashboard
                          </Link>
                        )}
                      </div>
                      <div className="p-2 border-t border-border">
                        <button
                          onClick={() => { logout(); setShowUserMenu(false); }}
                          className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-red-50 text-red-600 transition-colors w-full"
                        >
                          <LogOut className="h-4 w-4" /> Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link href="/auth/login">
                <Button variant="outline" size="sm" className="hidden md:flex">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Search overlay */}
      {searchOpen && (
        <div className="border-t border-border bg-white">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
              <input
                type="text"
                placeholder="Search brass products, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-primary/20 rounded-lg focus:border-primary outline-none text-sm bg-background/50"
                autoFocus
              />
              <button onClick={() => setSearchOpen(false)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text">
                <X className="h-5 w-5" />
              </button>
            </div>
            {searchQuery && (
              <div className="mt-4 space-y-2">
                <p className="text-xs text-muted uppercase tracking-wider font-medium">Suggestions</p>
                {["Brass Kalash", "Ganesha Idol", "Puja Thali", "Brass Diya", "Singing Bowl"]
                  .filter((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((s) => (
                    <Link
                      key={s}
                      href={`/products?search=${s}`}
                      className="block px-3 py-2 text-sm hover:bg-primary/5 rounded-md transition-colors"
                      onClick={() => setSearchOpen(false)}
                    >
                      {s}
                    </Link>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-white">
          <div className="px-4 py-4 space-y-1">
            <Link href="/" className="block px-3 py-2.5 text-sm font-medium rounded-md hover:bg-primary/5" onClick={() => setMobileOpen(false)}>Home</Link>
            <div className="space-y-1">
              <p className="px-3 py-1.5 text-xs text-muted uppercase tracking-wider font-medium">Categories</p>
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/products?category=${cat.slug}`}
                  className="block px-3 py-2 text-sm rounded-md hover:bg-primary/5"
                  onClick={() => setMobileOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
            <Link href="/products" className="block px-3 py-2.5 text-sm font-medium rounded-md hover:bg-primary/5" onClick={() => setMobileOpen(false)}>Shop All</Link>
            <Link href="/custom-order" className="block px-3 py-2.5 text-sm font-medium rounded-md hover:bg-primary/5" onClick={() => setMobileOpen(false)}>Custom Brass Order</Link>
            <Link href="/account/wishlist" className="block px-3 py-2.5 text-sm font-medium rounded-md hover:bg-primary/5" onClick={() => setMobileOpen(false)}>Wishlist</Link>
            {isSeller && (
              <Link href="/seller" className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-md hover:bg-accent/5 text-accent" onClick={() => setMobileOpen(false)}>
                <Store className="h-4 w-4" /> Seller Dashboard
              </Link>
            )}
            {!isLoggedIn && (
              <Link href="/auth/login" className="block px-3 py-2.5 text-sm font-medium rounded-md hover:bg-primary/5 mt-2" onClick={() => setMobileOpen(false)}>
                Sign In / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
