"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FileText,
  Users,
  Box,
  Percent,
  Star,
  BarChart3,
  Store,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, href: "/seller" },
  { label: "Products", icon: Package, href: "/seller/products" },
  { label: "Orders", icon: ShoppingCart, href: "/seller/orders" },
  { label: "Custom Requests", icon: FileText, href: "/seller/custom-requests" },
  { label: "Customers", icon: Users, href: "/seller/customers" },
  { label: "Inventory", icon: Box, href: "/seller/inventory" },
  { label: "Offers", icon: Percent, href: "/seller/offers" },
  { label: "Reviews", icon: Star, href: "/seller/reviews" },
  { label: "Analytics", icon: BarChart3, href: "/seller/analytics" },
];

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F2E8]">
      <div className="flex">
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-border transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto flex flex-col",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="p-6 border-b border-border">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-accent font-heading font-bold text-sm">A</span>
              </div>
              <div>
                <h1 className="font-heading text-lg font-bold text-primary leading-tight">Ajjram Brass</h1>
                <p className="text-xs text-muted">Seller Dashboard</p>
              </div>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-white shadow-sm"
                      : "text-muted hover:text-primary hover:bg-primary/5"
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-border">
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted hover:text-primary hover:bg-primary/5 transition-all duration-200"
            >
              <Store className="h-5 w-5 shrink-0" />
              <span>Back to Store</span>
            </Link>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="sticky top-0 z-30 lg:hidden bg-white border-b border-border px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-primary/5 text-muted hover:text-primary transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
                <span className="text-accent font-heading font-bold text-xs">A</span>
              </div>
              <span className="font-heading font-semibold text-primary">Ajjram Brass</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="ml-auto p-2 rounded-lg hover:bg-primary/5 text-muted hover:text-primary transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <main className="p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
