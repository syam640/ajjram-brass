"use client";

import { useState } from "react";
import { orders as initialOrders } from "@/data/orders";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Search, Eye, ChevronDown, ChevronUp, Truck, Package, Clock, CheckCircle, XCircle } from "lucide-react";
import { formatPrice, formatDate, getStatusColor } from "@/lib/utils";
import type { Order } from "@/data/orders";

const statusFlow: Record<string, string[]> = {
  pending: ["confirmed"],
  confirmed: ["packed"],
  packed: ["shipped"],
  shipped: ["delivered"],
};

const nextStatusLabel: Record<string, string> = {
  pending: "Confirm Order",
  confirmed: "Mark as Packed",
  packed: "Mark as Shipped",
  shipped: "Mark as Delivered",
};

const allTabs = ["All", "Pending", "Confirmed", "Packed", "Shipped", "Delivered", "Cancelled"] as const;

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<string>("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [trackingInput, setTrackingInput] = useState<Record<string, string>>({});

  const filtered = orders.filter((o) => {
    const matchSearch = o.orderId.toLowerCase().includes(search.toLowerCase()) ||
      o.shippingAddress.name.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (activeTab === "All") return true;
    return o.status === activeTab.toLowerCase();
  });

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const now = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
        const time = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
        const newEvent = {
          status: newStatus,
          location: o.shippingAddress.city,
          date: now,
          time,
          description: `Order ${newStatus}${newStatus === "shipped" && trackingInput[orderId] ? ` - Track ID: ${trackingInput[orderId]}` : ""}`,
        };
        const updates: Partial<Order> = {
          status: newStatus,
          tracking: [...o.tracking, newEvent],
        };
        if (newStatus === "shipped" && trackingInput[orderId]) {
          updates.tracking = [...o.tracking, {
            ...newEvent,
            description: `Shipped via Shiprocket - Track ID: ${trackingInput[orderId]}`,
          }];
        }
        if (newStatus === "delivered") {
          updates.deliveredDate = now;
        }
        return { ...o, ...updates };
      })
    );
    setTrackingInput((prev) => ({ ...prev, [orderId]: "" }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-primary">Orders</h1>
        <p className="text-muted text-sm mt-1">{orders.length} orders total</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <Input
            placeholder="Search orders by ID or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto pb-1">
        {allTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab
                ? "bg-primary text-white shadow-sm"
                : "bg-white text-muted hover:text-primary border border-border/60"
            }`}
          >
            {tab}
            {tab !== "All" && (
              <span className="ml-1.5 text-xs opacity-70">
                ({orders.filter((o) => o.status === tab.toLowerCase()).length})
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-border/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-[#F7F2E8]/50">
                <th className="text-left px-4 py-3 font-medium text-muted text-xs uppercase tracking-wider">Order ID</th>
                <th className="text-left px-4 py-3 font-medium text-muted text-xs uppercase tracking-wider">Customer</th>
                <th className="text-left px-4 py-3 font-medium text-muted text-xs uppercase tracking-wider">Items</th>
                <th className="text-right px-4 py-3 font-medium text-muted text-xs uppercase tracking-wider">Total</th>
                <th className="text-center px-4 py-3 font-medium text-muted text-xs uppercase tracking-wider">Status</th>
                <th className="text-center px-4 py-3 font-medium text-muted text-xs uppercase tracking-wider">Payment</th>
                <th className="text-right px-4 py-3 font-medium text-muted text-xs uppercase tracking-wider">Date</th>
                <th className="text-right px-4 py-3 font-medium text-muted text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map((order) => (
                <>
                  <tr key={order.id} className="hover:bg-[#F7F2E8]/30 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs font-medium text-primary">{order.orderId}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-primary">{order.shippingAddress.name}</p>
                      <p className="text-xs text-muted">{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex -space-x-2">
                        {order.items.slice(0, 3).map((item, i) => (
                          <div
                            key={i}
                            className="w-8 h-8 rounded-full border-2 border-white bg-[#F7F2E8] overflow-hidden"
                          >
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="w-8 h-8 rounded-full border-2 border-white bg-primary text-white text-xs font-bold flex items-center justify-center">
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-primary">{formatPrice(order.total)}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {order.paymentStatus === "paid" ? (
                          <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5 text-amber-500" />
                        )}
                        <span className="text-xs text-muted">{order.paymentMethod}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-muted text-xs">{formatDate(order.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                        >
                          {expandedId === order.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                  {expandedId === order.id && (
                    <tr>
                      <td colSpan={8} className="px-4 py-4 bg-[#F7F2E8]/30">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-sm font-semibold text-primary mb-3">Order Items</h4>
                            <div className="space-y-2">
                              {order.items.map((item, i) => (
                                <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-white border border-border/40">
                                  <div className="w-10 h-10 rounded-md bg-[#F7F2E8] overflow-hidden shrink-0">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-primary truncate">{item.name}</p>
                                    <p className="text-xs text-muted">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                                  </div>
                                  <span className="text-sm font-medium text-primary">{formatPrice(item.price * item.quantity)}</span>
                                </div>
                              ))}
                            </div>
                            <h4 className="text-sm font-semibold text-primary mt-4 mb-2">Shipping Address</h4>
                            <div className="text-sm text-muted bg-white p-3 rounded-lg border border-border/40">
                              <p className="font-medium text-primary">{order.shippingAddress.name}</p>
                              <p>{order.shippingAddress.phone}</p>
                              <p>{order.shippingAddress.street}</p>
                              <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-primary mb-3">Order Timeline</h4>
                            <div className="space-y-0">
                              {order.tracking.map((event, i) => (
                                <div key={i} className="flex gap-3 pb-3 relative">
                                  {i < order.tracking.length - 1 && (
                                    <div className="absolute left-2 top-5 bottom-0 w-px bg-border" />
                                  )}
                                  <div className={`w-4 h-4 rounded-full mt-0.5 shrink-0 border-2 ${
                                    i === order.tracking.length - 1
                                      ? "bg-primary border-primary"
                                      : "bg-white border-border"
                                  }`} />
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium text-primary capitalize">{event.status}</p>
                                    <p className="text-xs text-muted">{event.description}</p>
                                    <p className="text-xs text-muted">{event.date} at {event.time}</p>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {statusFlow[order.status] && (
                              <div className="mt-4 pt-4 border-t border-border">
                                <h4 className="text-sm font-semibold text-primary mb-3">Update Status</h4>
                                {order.status === "shipped" && (
                                  <div className="flex items-center gap-2 mb-3">
                                    <Input
                                      placeholder="Enter tracking ID..."
                                      value={trackingInput[order.id] || ""}
                                      onChange={(e) =>
                                        setTrackingInput((prev) => ({ ...prev, [order.id]: e.target.value }))
                                      }
                                      className="flex-1"
                                    />
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="gap-1"
                                      onClick={() => {
                                        const id = trackingInput[order.id];
                                        if (id) {
                                          alert(`Tracking ID ${id} sent to Shiprocket`);
                                        } else {
                                          alert("Please enter a tracking ID");
                                        }
                                      }}
                                    >
                                      <Truck className="h-3.5 w-3.5" /> Shiprocket
                                    </Button>
                                  </div>
                                )}
                                <div className="flex flex-wrap gap-2">
                                  {statusFlow[order.status].map((nextStatus) => (
                                    <Button
                                      key={nextStatus}
                                      size="sm"
                                      onClick={() => handleStatusUpdate(order.id, nextStatus)}
                                      className="gap-1"
                                    >
                                      <Package className="h-3.5 w-3.5" />
                                      {nextStatusLabel[order.status]}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-muted">No orders found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
