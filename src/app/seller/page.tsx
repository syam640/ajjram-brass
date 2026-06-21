"use client";

import { useMemo } from "react";
import Link from "next/link";
import { orders } from "@/data/orders";
import { products } from "@/data/products";
import { customOrders } from "@/data/orders";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  IndianRupee,
  ShoppingCart,
  Users,
  TrendingUp,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Eye,
} from "lucide-react";
import { formatPrice, getStatusColor } from "@/lib/utils";

const recentOrders = orders.slice(0, 3);

const topProducts = products
  .sort((a, b) => (b.stock > a.stock ? 1 : -1))
  .slice(0, 4)
  .map((p, i) => ({
    rank: i + 1,
    id: p.id,
    name: p.name,
    sales: Math.floor(Math.random() * 100) + 20,
    revenue: p.price * (Math.floor(Math.random() * 50) + 10),
  }));

const revenueData = [
  { day: "Mon", value: 85 },
  { day: "Tue", value: 60 },
  { day: "Wed", value: 92 },
  { day: "Thu", value: 45 },
  { day: "Fri", value: 78 },
  { day: "Sat", value: 95 },
  { day: "Sun", value: 70 },
];

const activityFeed = [
  { action: "New order received", detail: "ORD-004 from Priya Patel", time: "2 min ago", type: "order" },
  { action: "Product low stock", detail: "Brass Peacock Decorative - 8 remaining", time: "15 min ago", type: "alert" },
  { action: "Custom request quote sent", detail: "Ananya Gupta - Brass Peacock Lamp", time: "1 hour ago", type: "quote" },
  { action: "Order shipped", detail: "ORD-002 via Shiprocket", time: "3 hours ago", type: "shipped" },
];

export default function SellerOverview() {
  const totalRevenue = useMemo(() => orders.reduce((s, o) => s + o.total, 0), []);
  const totalOrders = orders.length;
  const totalCustomers = new Set(orders.map((o) => o.shippingAddress.name)).size;
  const conversionRate = 3.2;
  const prevRevenue = totalRevenue * 0.85;
  const prevOrders = totalOrders - 2;
  const prevCustomers = totalCustomers;
  const prevConversion = 2.8;

  const stats = [
    {
      label: "Total Revenue",
      value: formatPrice(totalRevenue),
      change: ((totalRevenue - prevRevenue) / prevRevenue * 100).toFixed(1),
      icon: IndianRupee,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Total Orders",
      value: totalOrders,
      change: ((totalOrders - prevOrders) / prevOrders * 100).toFixed(1),
      icon: ShoppingCart,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Total Customers",
      value: totalCustomers,
      change: ((totalCustomers - prevCustomers) / prevCustomers * 100).toFixed(1),
      icon: Users,
      color: "bg-purple-100 text-purple-600",
    },
    {
      label: "Conversion Rate",
      value: `${conversionRate}%`,
      change: ((conversionRate - prevConversion) / prevConversion * 100).toFixed(1),
      icon: TrendingUp,
      color: "bg-amber-100 text-amber-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-primary">Dashboard Overview</h1>
        <p className="text-muted text-sm mt-1">Welcome back, Seller. Here&apos;s your store performance.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const isUp = parseFloat(stat.change) >= 0;
          return (
            <Card key={stat.label} className="p-5 border border-border/60 bg-white">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span
                  className={`flex items-center gap-0.5 text-xs font-medium ${
                    isUp ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {Math.abs(parseFloat(stat.change))}%
                </span>
              </div>
              <p className="text-2xl font-bold text-primary">{stat.value}</p>
              <p className="text-xs text-muted mt-1">{stat.label}</p>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5 border border-border/60 bg-white">
          <h3 className="font-heading text-base font-semibold text-primary mb-4">Revenue (Last 7 Days)</h3>
          <div className="flex items-end justify-between gap-2 h-40 pt-2">
            {revenueData.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-md transition-all duration-500"
                  style={{
                    height: `${d.value}%`,
                    background: "linear-gradient(180deg, #B08D57 0%, #C9A86A 100%)",
                  }}
                />
                <span className="text-xs text-muted">{d.day}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 border border-border/60 bg-white">
          <h3 className="font-heading text-base font-semibold text-primary mb-4">Orders (Last 7 Days)</h3>
          <div className="flex items-end justify-between gap-2 h-40 pt-2">
            {[
              { day: "Mon", value: 45 },
              { day: "Tue", value: 72 },
              { day: "Wed", value: 58 },
              { day: "Thu", value: 90 },
              { day: "Fri", value: 65 },
              { day: "Sat", value: 80 },
              { day: "Sun", value: 55 },
            ].map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-md transition-all duration-500"
                  style={{
                    height: `${d.value}%`,
                    background: "linear-gradient(180deg, #0B2D1F 0%, #1a4a3a 100%)",
                  }}
                />
                <span className="text-xs text-muted">{d.day}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-5 border border-border/60 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading text-base font-semibold text-primary">Pending Orders</h3>
            <Link href="/seller/orders">
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                View All <Eye className="h-3 w-3" />
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 rounded-lg bg-[#F7F2E8]/50 border border-border/40"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-primary truncate">{order.orderId}</p>
                  <p className="text-xs text-muted truncate">{order.shippingAddress.name}</p>
                </div>
                <div className="text-right mr-4">
                  <p className="text-sm font-semibold text-primary">{formatPrice(order.total)}</p>
                  <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                </div>
                <Link href={`/seller/orders`}>
                  <Button variant="outline" size="sm" className="text-xs">
                    <Eye className="h-3 w-3 mr-1" /> View
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 border border-border/60 bg-white">
          <h3 className="font-heading text-base font-semibold text-primary mb-4">Top Products</h3>
          <div className="space-y-3">
            {topProducts.map((p) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {p.rank}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-primary truncate">{p.name}</p>
                  <p className="text-xs text-muted">{p.sales} sold</p>
                </div>
                <span className="text-sm font-semibold text-primary shrink-0">{formatPrice(p.revenue)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-5 border border-border/60 bg-white">
        <h3 className="font-heading text-base font-semibold text-primary mb-4">Recent Activity</h3>
        <div className="space-y-0">
          {activityFeed.map((item, i) => (
            <div key={i}>
              <div className="flex items-start gap-3 py-3">
                <div className="p-1.5 rounded-full bg-primary/5 mt-0.5">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-primary">{item.action}</p>
                  <p className="text-xs text-muted">{item.detail}</p>
                </div>
                <span className="text-xs text-muted shrink-0">{item.time}</span>
              </div>
              {i < activityFeed.length - 1 && <Separator />}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
