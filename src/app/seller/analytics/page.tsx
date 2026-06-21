"use client";

import { useState, useMemo } from "react";
import { orders } from "@/data/orders";
import { products } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  BarChart3,
  TrendingUp,
  Users,
  ShoppingCart,
  IndianRupee,
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  MapPin,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

type DateRange = "7d" | "30d" | "3m" | "1y";

const revenueChartData: Record<DateRange, { label: string; value: number }[]> = {
  "7d": [
    { label: "Mon", value: 85 },
    { label: "Tue", value: 60 },
    { label: "Wed", value: 92 },
    { label: "Thu", value: 45 },
    { label: "Fri", value: 78 },
    { label: "Sat", value: 95 },
    { label: "Sun", value: 70 },
  ],
  "30d": [
    { label: "Week 1", value: 320 },
    { label: "Week 2", value: 280 },
    { label: "Week 3", value: 410 },
    { label: "Week 4", value: 360 },
  ],
  "3m": [
    { label: "Oct", value: 980 },
    { label: "Nov", value: 1200 },
    { label: "Dec", value: 1500 },
  ],
  "1y": [
    { label: "Jan", value: 4200 },
    { label: "Feb", value: 3800 },
    { label: "Mar", value: 5100 },
    { label: "Apr", value: 4600 },
    { label: "May", value: 5300 },
    { label: "Jun", value: 4900 },
    { label: "Jul", value: 5500 },
    { label: "Aug", value: 6100 },
    { label: "Sep", value: 5800 },
    { label: "Oct", value: 7200 },
    { label: "Nov", value: 8100 },
    { label: "Dec", value: 9500 },
  ],
};

const customerLocations = [
  { state: "Rajasthan", orders: 12 },
  { state: "Maharashtra", orders: 8 },
  { state: "Karnataka", orders: 6 },
  { state: "Uttar Pradesh", orders: 5 },
  { state: "Gujarat", orders: 4 },
  { state: "Tamil Nadu", orders: 3 },
  { state: "Delhi", orders: 3 },
  { state: "West Bengal", orders: 2 },
];

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRange>("7d");

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const conversionRate = 3.2;
    return { totalRevenue, totalOrders, avgOrderValue, conversionRate };
  }, []);

  const productPerformance = useMemo(
    () =>
      products
        .slice(0, 8)
        .map((p) => {
          const sold = Math.floor(Math.random() * 60) + 5;
          const rev = p.price * sold;
          return {
            name: p.name,
            unitsSold: sold,
            revenue: rev,
            pct: 0,
          };
        })
        .map((p, _, arr) => {
          const total = arr.reduce((s, x) => s + x.revenue, 0);
          return { ...p, pct: total > 0 ? (p.revenue / total) * 100 : 0 };
        })
        .sort((a, b) => b.revenue - a.revenue),
    []
  );

  const repeatRate = 28;

  const chartData = revenueChartData[dateRange];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">Analytics</h1>
          <p className="text-muted text-sm mt-1">Track your store&apos;s performance</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={(v: DateRange) => setDateRange(v)}>
            <SelectTrigger className="w-40">
              <Calendar className="h-4 w-4 mr-2 text-muted" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="3m">Last 3 months</SelectItem>
              <SelectItem value="1y">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2" onClick={() => alert("Monthly report downloaded!")}>
            <Download className="h-4 w-4" /> Download Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border border-border/60 bg-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-green-100 text-green-600">
              <IndianRupee className="h-5 w-5" />
            </div>
            <span className="flex items-center gap-0.5 text-xs font-medium text-green-600">
              <ArrowUpRight className="h-3 w-3" /> 12.5%
            </span>
          </div>
          <p className="text-2xl font-bold text-primary">{formatPrice(stats.totalRevenue)}</p>
          <p className="text-xs text-muted mt-1">Total Revenue</p>
        </Card>
        <Card className="p-5 border border-border/60 bg-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
              <ShoppingCart className="h-5 w-5" />
            </div>
            <span className="flex items-center gap-0.5 text-xs font-medium text-green-600">
              <ArrowUpRight className="h-3 w-3" /> 8.3%
            </span>
          </div>
          <p className="text-2xl font-bold text-primary">{stats.totalOrders}</p>
          <p className="text-xs text-muted mt-1">Total Orders</p>
        </Card>
        <Card className="p-5 border border-border/60 bg-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
              <IndianRupee className="h-5 w-5" />
            </div>
            <span className="flex items-center gap-0.5 text-xs font-medium text-red-600">
              <ArrowDownRight className="h-3 w-3" /> 2.1%
            </span>
          </div>
          <p className="text-2xl font-bold text-primary">{formatPrice(stats.avgOrderValue)}</p>
          <p className="text-xs text-muted mt-1">Avg Order Value</p>
        </Card>
        <Card className="p-5 border border-border/60 bg-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
              <TrendingUp className="h-5 w-5" />
            </div>
            <span className="flex items-center gap-0.5 text-xs font-medium text-green-600">
              <ArrowUpRight className="h-3 w-3" /> 0.4%
            </span>
          </div>
          <p className="text-2xl font-bold text-primary">{stats.conversionRate}%</p>
          <p className="text-xs text-muted mt-1">Conversion Rate</p>
        </Card>
      </div>

      <Card className="p-5 border border-border/60 bg-white">
        <h3 className="font-heading text-base font-semibold text-primary mb-4">Revenue Over Time</h3>
        <div className="flex items-end justify-between gap-2 h-52 pt-2">
          {chartData.map((d) => {
            const maxVal = Math.max(...chartData.map((x) => x.value));
            const heightPct = (d.value / maxVal) * 100;
            return (
              <div key={d.label} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-xs font-medium text-primary">₹{d.value}</span>
                <div
                  className="w-full rounded-t-md transition-all duration-500 relative group cursor-pointer"
                  style={{
                    height: `${heightPct}%`,
                    background: "linear-gradient(180deg, #B08D57 0%, #C9A86A 100%)",
                  }}
                >
                  <div className="absolute inset-0 rounded-t-md opacity-0 group-hover:opacity-100 transition-opacity bg-black/10" />
                </div>
                <span className="text-xs text-muted">{d.label}</span>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5 border border-border/60 bg-white">
          <h3 className="font-heading text-base font-semibold text-primary mb-4">Product Performance</h3>
          <div className="space-y-3">
            {productPerformance.map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-primary truncate">{p.name}</span>
                    <span className="text-sm font-semibold text-primary shrink-0 ml-2">{formatPrice(p.revenue)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-[#F7F2E8] overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${p.pct}%`,
                          background: "linear-gradient(90deg, #B08D57, #C9A86A)",
                        }}
                      />
                    </div>
                    <span className="text-xs text-muted">{p.unitsSold} sold</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-5 border border-border/60 bg-white">
            <h3 className="font-heading text-base font-semibold text-primary mb-4 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-secondary" /> Customer Locations
            </h3>
            <div className="space-y-2">
              {customerLocations.map((loc) => {
                const maxOrders = Math.max(...customerLocations.map((l) => l.orders));
                const barWidth = (loc.orders / maxOrders) * 100;
                return (
                  <div key={loc.state} className="flex items-center gap-3">
                    <span className="text-sm text-muted w-28 shrink-0">{loc.state}</span>
                    <div className="flex-1 h-5 rounded-md bg-[#F7F2E8] overflow-hidden">
                      <div
                        className="h-full rounded-md flex items-center justify-end px-2 text-xs font-medium text-white"
                        style={{
                          width: `${barWidth}%`,
                          background: "linear-gradient(90deg, #0B2D1F, #1a4a3a)",
                        }}
                      >
                        {loc.orders}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="p-5 border border-border/60 bg-white">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-heading text-base font-semibold text-primary">Repeat Customers</h3>
              <Users className="h-5 w-5 text-secondary" />
            </div>
            <div className="flex items-end gap-4">
              <p className="text-4xl font-bold text-primary">{repeatRate}%</p>
              <div className="flex-1 h-3 rounded-full bg-[#F7F2E8] overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${repeatRate}%`,
                    background: "linear-gradient(90deg, #B08D57, #C9A86A)",
                  }}
                />
              </div>
            </div>
            <p className="text-xs text-muted mt-2">of customers have placed more than one order</p>
            <Separator className="my-4" />
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2"
              onClick={() => alert("Monthly report downloaded!")}
            >
              <Download className="h-4 w-4" /> Download Monthly Report
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
