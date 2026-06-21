"use client";

import { useState } from "react";
import { orders } from "@/data/orders";
import { customOrders } from "@/data/orders";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Search, Users, Mail, Phone, MapPin, ShoppingBag, IndianRupee, TrendingUp, ArrowUpRight, ChevronDown } from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";

export default function SellerCustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);

  const customerMap = new Map<string, { name: string; email: string; phone: string; address: string; orders: number; totalSpent: number; lastOrder: string }>();

  orders.forEach((order) => {
    const addr = order.shippingAddress;
    const key = addr.name;
    if (customerMap.has(key)) {
      const c = customerMap.get(key)!;
      c.orders += 1;
      c.totalSpent += order.total;
      if (order.createdAt > c.lastOrder) c.lastOrder = order.createdAt;
    } else {
      customerMap.set(key, {
        name: addr.name,
        email: `${addr.name.toLowerCase().replace(/\s/g, ".")}@example.com`,
        phone: addr.phone,
        address: `${addr.street}, ${addr.city}, ${addr.state}`,
        orders: 1,
        totalSpent: order.total,
        lastOrder: order.createdAt,
      });
    }
  });

  customOrders.forEach((co) => {
    const key = co.customerName;
    if (customerMap.has(key)) {
      const c = customerMap.get(key)!;
      c.orders += 1;
    } else {
      customerMap.set(key, {
        name: co.customerName,
        email: co.customerEmail,
        phone: co.customerPhone,
        address: "Registered Customer",
        orders: 1,
        totalSpent: co.sellerQuote || 0,
        lastOrder: co.createdAt,
      });
    }
  });

  const customers = Array.from(customerMap.values()).filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-primary">Customers</h1>
          <p className="text-sm text-muted mt-1">{customers.length} total customers</p>
        </div>
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <Input
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-border p-4">
          <div className="flex items-center justify-between mb-2">
            <Users className="h-5 w-5 text-primary" />
            <Badge variant="success" className="text-[10px]">
              <ArrowUpRight className="h-3 w-3 mr-0.5" /> 12%
            </Badge>
          </div>
          <p className="text-2xl font-bold text-primary">{customers.length}</p>
          <p className="text-xs text-muted">Total Customers</p>
        </div>
        <div className="bg-white rounded-lg border border-border p-4">
          <div className="flex items-center justify-between mb-2">
            <IndianRupee className="h-5 w-5 text-accent" />
            <Badge variant="success" className="text-[10px]">
              <ArrowUpRight className="h-3 w-3 mr-0.5" /> 8%
            </Badge>
          </div>
          <p className="text-2xl font-bold text-primary">
            {formatPrice(customers.reduce((s, c) => s + c.totalSpent, 0))}
          </p>
          <p className="text-xs text-muted">Total Revenue</p>
        </div>
        <div className="bg-white rounded-lg border border-border p-4">
          <ShoppingBag className="h-5 w-5 text-secondary mb-2" />
          <p className="text-2xl font-bold text-primary">
            {customers.reduce((s, c) => s + c.orders, 0)}
          </p>
          <p className="text-xs text-muted">Total Orders</p>
        </div>
        <div className="bg-white rounded-lg border border-border p-4">
          <TrendingUp className="h-5 w-5 text-green-600 mb-2" />
          <p className="text-2xl font-bold text-primary">
            {formatPrice(customers.reduce((s, c) => s + c.totalSpent, 0) / customers.length || 0)}
          </p>
          <p className="text-xs text-muted">Avg. Order Value</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted uppercase tracking-wider">Customer</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted uppercase tracking-wider">Contact</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted uppercase tracking-wider">Orders</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted uppercase tracking-wider">Total Spent</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted uppercase tracking-wider">Last Order</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer, idx) => (
                <tr key={idx} className="border-b border-border/50 last:border-0 hover:bg-background/30 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-sm text-primary">{customer.name}</p>
                    <p className="text-xs text-muted">{customer.address}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs flex items-center gap-1"><Mail className="h-3 w-3 text-muted" /> {customer.email}</span>
                      <span className="text-xs flex items-center gap-1"><Phone className="h-3 w-3 text-muted" /> {customer.phone}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="info">{customer.orders} orders</Badge>
                  </td>
                  <td className="px-4 py-3 font-medium text-sm">{formatPrice(customer.totalSpent)}</td>
                  <td className="px-4 py-3 text-xs text-muted">{formatDate(customer.lastOrder)}</td>
                  <td className="px-4 py-3">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedCustomer(selectedCustomer === `${idx}` ? null : `${idx}`)}>
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedCustomer && (
        <div className="mt-6 bg-white rounded-lg border border-border p-6">
          <h3 className="font-heading text-lg font-semibold text-primary mb-4">Customer Details</h3>
          <p className="text-sm text-muted">Detailed purchase history and spending analysis coming soon.</p>
        </div>
      )}

      {customers.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-muted mx-auto mb-4" />
          <p className="text-muted">No customers found matching your search.</p>
        </div>
      )}
    </div>
  );
}
