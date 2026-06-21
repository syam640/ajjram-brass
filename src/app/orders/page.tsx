"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { orders } from "@/data/orders";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Package, ChevronRight, Download, Clock, Truck, XCircle, CheckCircle } from "lucide-react";
import { formatPrice, formatDate, getStatusColor } from "@/lib/utils";

const tabs = ["All", "Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];

const statusIconMap: Record<string, React.ReactNode> = {
  pending: <Clock className="w-4 h-4" />,
  confirmed: <CheckCircle className="w-4 h-4" />,
  packed: <Package className="w-4 h-4" />,
  shipped: <Truck className="w-4 h-4" />,
  "in-transit": <Truck className="w-4 h-4" />,
  "out-for-delivery": <Truck className="w-4 h-4" />,
  delivered: <CheckCircle className="w-4 h-4" />,
  cancelled: <XCircle className="w-4 h-4" />,
};

function parseOrderDate(createdAt: string): string {
  try {
    return formatDate(new Date(createdAt));
  } catch {
    return createdAt;
  }
}

function getLastTrackingStatuses(tracking: { status: string }[]): string[] {
  return tracking.slice(-3).map((t) => t.status);
}

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("All");

  const filteredOrders = useMemo(() => {
    if (activeTab === "All") return orders;
    return orders.filter((o) => o.status === activeTab.toLowerCase());
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#F7F2E8]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-secondary transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-primary font-medium">My Orders</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-4xl md:text-5xl text-primary">My Orders</h1>
            <p className="text-gray-500 mt-1">{orders.length} order{orders.length !== 1 ? "s" : ""}</p>
          </div>
        </div>

        <div className="flex gap-1 sm:gap-2 overflow-x-auto pb-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === tab
                  ? "bg-secondary text-white shadow-md"
                  : "bg-white text-gray-600 hover:text-secondary border border-border/60 hover:border-secondary/40"
              }`}
            >
              {tab}
              {tab !== "All" && (
                <span className="ml-1.5 opacity-70">
                  ({orders.filter((o) => o.status === tab.toLowerCase()).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/5 flex items-center justify-center">
              <Package className="w-10 h-10 text-primary/30" />
            </div>
            <h3 className="font-heading text-2xl text-primary mb-2">No {activeTab !== "All" ? activeTab.toLowerCase() : ""} orders</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {activeTab === "All"
                ? "You haven't placed any orders yet. Start exploring our brass collection!"
                : `You don't have any ${activeTab.toLowerCase()} orders at the moment.`}
            </p>
            <Link href="/products">
              <Button variant="secondary" size="lg" className="gap-2">
                <Package className="w-4 h-4" />
                Browse Products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredOrders.map((order) => {
              const lastStatuses = getLastTrackingStatuses(order.tracking);

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-xl border border-border/60 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
                >
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-heading text-lg font-semibold text-primary">{order.id}</span>
                        <Badge className={`${getStatusColor(order.status)} capitalize text-xs`}>
                          {order.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-3.5 h-3.5" />
                        {parseOrderDate(order.createdAt)}
                      </div>
                    </div>

                    <Separator className="mb-4" />

                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                          {order.items.slice(0, 4).map((item, i) => (
                            <div
                              key={i}
                              className="w-12 h-12 rounded-lg border-2 border-white bg-gray-50 overflow-hidden shadow-sm"
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                          {order.items.length > 4 && (
                            <div className="w-12 h-12 rounded-lg border-2 border-white bg-primary/5 flex items-center justify-center text-xs font-medium text-primary shadow-sm">
                              +{order.items.length - 4}
                            </div>
                          )}
                        </div>
                        <div className="ml-1">
                          <p className="text-sm font-medium text-primary">
                            {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                          </p>
                          <p className="text-xs text-gray-400 truncate max-w-[200px] sm:max-w-xs">
                            {order.items.map((i) => i.name).join(", ")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 lg:gap-10">
                        <div className="text-right">
                          <p className="text-xs text-gray-400">Total</p>
                          <p className="font-heading text-lg font-bold text-primary">{formatPrice(order.total)}</p>
                        </div>

                        <div className="hidden sm:block text-right">
                          <p className="text-xs text-gray-400">Payment</p>
                          <p className="text-sm text-gray-600">{order.paymentMethod}</p>
                        </div>

                        <div className="flex gap-2">
                          <Link href={`/orders/${order.id}`}>
                            <Button variant="outline" size="sm" className="gap-1.5">
                              View Details
                              <ChevronRight className="w-3.5 h-3.5" />
                            </Button>
                          </Link>
                          {order.invoiceUrl && (
                            <Button variant="ghost" size="sm" className="gap-1.5 text-secondary hover:text-secondary">
                              <Download className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Invoice</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        {lastStatuses.map((s, i) => (
                          <div key={s} className="flex items-center gap-1.5">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                i === lastStatuses.length - 1
                                  ? "bg-secondary"
                                  : "bg-primary/30"
                              }`}
                            />
                            <span className="text-[11px] capitalize text-gray-500">{s}</span>
                            {i < lastStatuses.length - 1 && (
                              <div className="w-3 h-px bg-border" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
