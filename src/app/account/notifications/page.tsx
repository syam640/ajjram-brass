"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Bell,
  Package,
  Percent,
  Megaphone,
  CheckCheck,
  Clock,
  Truck,
  MessageSquare,
  Gift,
  Sparkles,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Notification {
  id: string;
  icon: React.ReactNode;
  title: string;
  message: string;
  time: string;
  category: "orders" | "offers" | "updates";
  read: boolean;
}

const initialNotifications: Notification[] = [
  {
    id: "notif-001",
    icon: <Package className="h-5 w-5 text-blue-600" />,
    title: "Order Confirmed",
    message: "Your order AJJ2A3B4C5D6E has been confirmed and is being processed.",
    time: "2026-01-15T10:30:00Z",
    category: "orders",
    read: false,
  },
  {
    id: "notif-002",
    icon: <Truck className="h-5 w-5 text-purple-600" />,
    title: "Shipment Update",
    message: "Your Brass Singing Bowl has been shipped. Track ID: SHIP123456",
    time: "2026-01-14T09:15:00Z",
    category: "orders",
    read: false,
  },
  {
    id: "notif-003",
    icon: <Percent className="h-5 w-5 text-green-600" />,
    title: "Festival Sale is Live!",
    message: "Get up to 40% off on all puja items. Use code FESTIVE40. Limited period offer!",
    time: "2026-01-12T08:00:00Z",
    category: "offers",
    read: true,
  },
  {
    id: "notif-004",
    icon: <MessageSquare className="h-5 w-5 text-orange-600" />,
    title: "Custom Order Quote Received",
    message: "Your custom brass idol quote of ₹45,000 has been sent. Check your custom orders.",
    time: "2026-01-10T15:45:00Z",
    category: "orders",
    read: false,
  },
  {
    id: "notif-005",
    icon: <Sparkles className="h-5 w-5 text-secondary" />,
    title: "New Arrival Alert",
    message: "Brass Temple Bells Set is now available. Handcrafted by master artisans.",
    time: "2026-01-08T11:00:00Z",
    category: "updates",
    read: true,
  },
  {
    id: "notif-006",
    icon: <Gift className="h-5 w-5 text-red-500" />,
    title: "Birthday Bonus",
    message: "Happy Birthday! Enjoy an exclusive 15% off on your next purchase as our gift.",
    time: "2026-01-05T00:00:00Z",
    category: "offers",
    read: true,
  },
  {
    id: "notif-007",
    icon: <Megaphone className="h-5 w-5 text-indigo-500" />,
    title: "Refer & Earn",
    message: "Refer a friend and both get ₹500 off on your next order. Share the love!",
    time: "2026-01-03T14:00:00Z",
    category: "updates",
    read: true,
  },
];

const tabs = [
  { label: "All", value: "all" },
  { label: "Orders", value: "orders" },
  { label: "Offers", value: "offers" },
  { label: "Updates", value: "updates" },
] as const;

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [activeTab, setActiveTab] = useState<string>("all");

  const filtered =
    activeTab === "all"
      ? notifications
      : notifications.filter((n) => n.category === activeTab);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleMarkRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const getCategoryCount = (cat: string) => {
    if (cat === "all") return notifications.length;
    return notifications.filter((n) => n.category === cat).length;
  };

  const getCategoryUnread = (cat: string) => {
    if (cat === "all") return unreadCount;
    return notifications.filter((n) => n.category === cat && !n.read).length;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-primary">Notifications</h1>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="rounded-full px-2.5 py-0.5 text-xs">
                {unreadCount} new
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={handleMarkAllRead} className="text-secondary">
              <CheckCheck className="mr-1.5 h-4 w-4" />
              Mark all as read
            </Button>
          )}
        </div>

        <div className="mb-6 flex gap-1 rounded-lg border border-border bg-white p-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.value;
            const count = getCategoryCount(tab.value);
            const unread = getCategoryUnread(tab.value);
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary text-white shadow-sm"
                    : "text-muted hover:bg-primary/5 hover:text-primary"
                }`}
              >
                {tab.label}
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  {count}
                </span>
                {unread > 0 && (
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                )}
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-xl border border-border bg-white py-20 text-center">
            <Bell className="mx-auto mb-4 h-14 w-14 text-muted" />
            <h2 className="text-xl font-semibold text-primary">No notifications</h2>
            <p className="mt-2 text-muted">
              {activeTab === "all"
                ? "You're all caught up!"
                : `No ${activeTab} notifications yet`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleMarkRead(notification.id)}
                className={`relative flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition-all hover:shadow-sm ${
                  notification.read
                    ? "border-border bg-white"
                    : "border-primary/10 bg-primary/[0.02]"
                }`}
              >
                {!notification.read && (
                  <span className="absolute right-4 top-4 h-2.5 w-2.5 rounded-full bg-red-500" />
                )}

                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    notification.read ? "bg-gray-50" : "bg-primary/[0.06]"
                  }`}
                >
                  {notification.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      className={`text-sm ${
                        notification.read ? "font-medium text-primary" : "font-semibold text-primary"
                      }`}
                    >
                      {notification.title}
                    </h3>
                  </div>
                  <p className="mt-0.5 text-sm leading-relaxed text-muted line-clamp-2">
                    {notification.message}
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted">
                    <Clock className="h-3 w-3" />
                    <span>{formatDate(new Date(notification.time))}</span>
                    <span className="text-border">|</span>
                    <Badge variant="outline" className="text-[10px] capitalize">
                      {notification.category}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
