"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { orders } from "@/data/orders";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  User,
  MapPin,
  Heart,
  Bell,
  Package,
  Settings,
  LogOut,
  ChevronRight,
  Camera,
  Edit2,
  Clock,
} from "lucide-react";
import { formatPrice, formatDate, getInitials } from "@/lib/utils";

const sidebarLinks = [
  { label: "Profile", href: "/account", icon: User },
  { label: "Addresses", href: "/account/addresses", icon: MapPin },
  { label: "Wishlist", href: "/account/wishlist", icon: Heart },
  { label: "Notifications", href: "/account/notifications", icon: Bell },
  { label: "Orders", href: "/orders", icon: Package },
  { label: "Settings", href: "#", icon: Settings },
];

export default function AccountPage() {
  const { user, logout } = useAuth();
  const { wishlist } = useWishlist();
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [dob, setDob] = useState("");

  const recentOrders = orders.slice(0, 3);

  const handleSave = () => {};

  const statusStyles: Record<string, string> = {
    delivered: "bg-green-100 text-green-800",
    shipped: "bg-purple-100 text-purple-800",
    confirmed: "bg-blue-100 text-blue-800",
    packed: "bg-indigo-100 text-indigo-800",
    pending: "bg-yellow-100 text-yellow-800",
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-8 flex items-center gap-2 text-sm text-muted">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-primary font-medium">My Account</span>
        </nav>

        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="w-full shrink-0 lg:w-64">
            <div className="rounded-xl border border-border bg-white p-2">
              {sidebarLinks.map((link) => {
                const Icon = link.icon;
                const isActive = link.href === "/account";
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                      isActive
                        ? "bg-primary text-white"
                        : "text-muted hover:bg-primary/5 hover:text-primary"
                    }`}
                  >
                    <Icon className="h-4.5 w-4.5" />
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <Button
              variant="ghost"
              onClick={logout}
              className="mt-4 w-full justify-start gap-3 text-red-500 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="h-4.5 w-4.5" />
              Logout
            </Button>
          </aside>

          <div className="flex-1 space-y-8">
            <div className="rounded-xl border border-border bg-white p-6 sm:p-8">
              <h2 className="mb-6 text-xl font-semibold text-primary">Profile Information</h2>

              <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row">
                <div className="relative">
                  <Avatar className="h-20 w-20 border-2 border-border">
                    <AvatarFallback className="bg-primary/5 text-lg text-primary">
                      {getInitials(name || user?.name || "U")}
                    </AvatarFallback>
                  </Avatar>
                  <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-white shadow-sm transition-colors hover:bg-secondary hover:text-white">
                    <Camera className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="text-center sm:text-left">
                  <p className="font-medium text-primary">{user?.name}</p>
                  <p className="text-sm text-muted">{user?.email}</p>
                  <p className="text-xs text-muted/70">Member since January 2026</p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={user?.email || ""} disabled className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input id="dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
                </div>
              </div>

              <Button onClick={handleSave} className="mt-6">
                Save Changes
              </Button>
            </div>

            <div className="rounded-xl border border-border bg-white p-6 sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-primary">Recent Orders</h2>
                <Link
                  href="/orders"
                  className="flex items-center gap-1 text-sm font-medium text-secondary hover:text-secondary/80 transition-colors"
                >
                  View All
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              {recentOrders.length === 0 ? (
                <div className="py-12 text-center">
                  <Package className="mx-auto mb-3 h-10 w-10 text-muted" />
                  <p className="text-muted">No orders yet</p>
                  <Link href="/products">
                    <Button variant="outline" className="mt-4">
                      Start Shopping
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => {
                    const statusKey = order.status.toLowerCase();
                    return (
                      <Link
                        key={order.id}
                        href={`/orders/${order.id}`}
                        className="flex items-center justify-between rounded-lg border border-border p-4 transition-all hover:border-primary/20 hover:shadow-sm"
                      >
                        <div className="flex items-center gap-4">
                          <div className="hidden sm:block">
                            {order.items.length > 0 && (
                              <img
                                src={order.items[0].image}
                                alt={order.items[0].name}
                                className="h-14 w-14 rounded-lg object-cover"
                              />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-primary">{order.orderId}</p>
                            <p className="text-sm text-muted">
                              {order.items.map((i) => i.name).join(", ").slice(0, 40)}...
                            </p>
                            <div className="mt-1 flex items-center gap-3 text-xs text-muted">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatDate(order.createdAt)}
                              </span>
                              <span>{formatPrice(order.total)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                              statusStyles[statusKey] || "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {statusKey}
                          </span>
                          <ChevronRight className="h-4 w-4 text-muted" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
