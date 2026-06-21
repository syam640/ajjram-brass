"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { orders, type Order, type TrackingEvent } from "@/data/orders";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Package, MapPin, Truck, Check, Circle, ChevronRight, Download, FileText, Mail, Phone, Clock, CreditCard } from "lucide-react";
import { formatPrice, formatDate, getStatusColor } from "@/lib/utils";

const statusFlow = ["placed", "confirmed", "packed", "shipped", "in-transit", "out-for-delivery", "delivered"];

function parseOrderDate(createdAt: string): string {
  try {
    return formatDate(new Date(createdAt));
  } catch {
    return createdAt;
  }
}

function isCurrentEvent(eventStatus: string, orderStatus: string, tracking: TrackingEvent[]): boolean {
  if (orderStatus === "delivered") return false;
  const lastTracked = tracking[tracking.length - 1];
  return eventStatus === lastTracked.status;
}

function isCompletedEvent(eventStatus: string, tracking: TrackingEvent[]): boolean {
  return tracking.some((t) => t.status === eventStatus);
}

function StatusTimeline({ order }: { order: Order }) {
  const allStatuses = statusFlow;
  const lastTrackedIndex = statusFlow.indexOf(order.tracking[order.tracking.length - 1]?.status);

  const getTrackingEvent = (status: string): TrackingEvent | undefined => {
    return order.tracking.find((t) => t.status === status);
  };

  return (
    <div className="relative">
      <div className="absolute left-[19px] top-3 bottom-3 w-0.5 bg-border" />

      {allStatuses.map((status, i) => {
        const event = getTrackingEvent(status);
        const completed = i <= lastTrackedIndex;
        const isCurrent = i === lastTrackedIndex && order.status !== "delivered";
        const isPast = i < lastTrackedIndex || order.status === "delivered";

        return (
          <div key={status} className="relative flex gap-4 pb-8 last:pb-0">
            <div className="relative z-10 flex-shrink-0 mt-1">
              {isPast ? (
                <div className="w-10 h-10 rounded-full bg-green-100 border-2 border-green-500 flex items-center justify-center">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
              ) : isCurrent ? (
                <div className="w-10 h-10 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center animate-pulse shadow-lg shadow-accent/20">
                  <Circle className="w-4 h-4 text-accent fill-accent" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-50 border-2 border-gray-200 flex items-center justify-center">
                  <Circle className="w-4 h-4 text-gray-300" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className={`font-heading text-base font-semibold capitalize ${
                  isPast ? "text-green-700" : isCurrent ? "text-accent" : "text-gray-400"
                }`}>
                  {status.replace(/-/g, " ")}
                </h4>
                {isCurrent && (
                  <Badge variant="accent" className="text-[10px] px-2 py-0">
                    Current
                  </Badge>
                )}
              </div>

              {event && (
                <div className="mt-1 space-y-0.5">
                  <p className="text-sm text-gray-600">{event.description}</p>
                  <p className="text-xs text-gray-400">
                    {event.location} &middot; {event.date} at {event.time}
                  </p>
                </div>
              )}

              {!event && isCurrent && order.status !== "delivered" && (
                <div className="mt-2">
                  <p className="text-sm text-accent font-medium animate-pulse">In progress...</p>
                </div>
              )}

              {status === "shipped" && completed && (
                <div className="mt-2 p-3 bg-primary/5 rounded-lg border border-primary/10">
                  <div className="flex items-center gap-2 text-sm">
                    <Truck className="w-4 h-4 text-primary" />
                    <span className="font-medium text-primary">Shiprocket Tracking ID:</span>
                    <span className="text-secondary font-mono">SHIP123456</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      <div className="relative flex gap-4">
        <div className="relative z-10 flex-shrink-0 mt-1">
          <div className="w-10 h-10 rounded-full bg-accent/10 border-2 border-dashed border-accent/40 flex items-center justify-center">
            <Truck className="w-4 h-4 text-accent/60" />
          </div>
        </div>
        <div className="flex-1 pt-0.5">
          <h4 className="font-heading text-base font-semibold text-accent/60">
            Estimated Delivery
          </h4>
          <p className="text-sm text-accent/80 font-medium mt-1">{order.estimatedDelivery}</p>
        </div>
      </div>
    </div>
  );
}

function PriceSummary({ order }: { order: Order }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">Subtotal</span>
        <span className="text-gray-700">{formatPrice(order.subtotal)}</span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">Shipping</span>
        <span className={order.deliveryCharge === 0 ? "text-green-600 font-medium" : "text-gray-700"}>
          {order.deliveryCharge === 0 ? "Free" : formatPrice(order.deliveryCharge)}
        </span>
      </div>
      {order.discount > 0 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">
            Discount{order.couponCode ? ` (${order.couponCode})` : ""}
          </span>
          <span className="text-green-600">-{formatPrice(order.discount)}</span>
        </div>
      )}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">GST (18%)</span>
        <span className="text-gray-700">{formatPrice(order.gst)}</span>
      </div>
      <Separator />
      <div className="flex items-center justify-between">
        <span className="font-heading text-base font-semibold text-primary">Total</span>
        <span className="font-heading text-lg font-bold text-secondary">{formatPrice(order.total)}</span>
      </div>
    </div>
  );
}

function ShippingAddressCard({ address }: { address: Order["shippingAddress"] }) {
  return (
    <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
      <div className="flex items-start gap-3">
        <MapPin className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
        <div>
          <p className="font-medium text-primary">{address.name}</p>
          <p className="text-sm text-gray-500 mt-0.5">{address.street}</p>
          <p className="text-sm text-gray-500">{address.city}, {address.state} - {address.pincode}</p>
          <p className="text-sm text-gray-500 mt-1">{address.phone}</p>
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;

  const order = useMemo(() => orders.find((o) => o.id === orderId), [orderId]);

  if (!order) {
    return (
      <div className="min-h-screen bg-[#F7F2E8] flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/5 flex items-center justify-center">
            <Package className="w-12 h-12 text-primary/30" />
          </div>
          <h2 className="font-heading text-3xl text-primary mb-2">Order Not Found</h2>
          <p className="text-gray-500 mb-8">
            The order you are looking for does not exist or has been removed.
          </p>
          <Link href="/orders">
            <Button variant="secondary" size="lg" className="gap-2">
              <ChevronRight className="w-4 h-4 rotate-180" />
              Back to My Orders
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F2E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-secondary transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <Link href="/orders" className="hover:text-secondary transition-colors">My Orders</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-primary font-medium">Order #{order.id}</span>
        </nav>

        <div className="bg-white rounded-xl border border-border/60 shadow-sm p-5 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <Package className="w-6 h-6 text-secondary" />
              <div>
                <h1 className="font-heading text-2xl sm:text-3xl text-primary">Order #{order.id}</h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  Placed on {parseOrderDate(order.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <Badge className={`${getStatusColor(order.status)} capitalize text-sm px-3 py-1`}>
                {order.status.replace(/-/g, " ")}
              </Badge>
              <Badge
                variant={order.paymentStatus === "paid" ? "success" : "warning"}
                className="capitalize text-sm px-3 py-1"
              >
                {order.paymentStatus}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-border/60 shadow-sm p-5 sm:p-6">
              <h2 className="font-heading text-xl font-semibold text-primary mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-secondary" />
                Items Ordered
              </h2>
              <Separator className="mb-4" />
              <div className="space-y-4">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg bg-gray-50 overflow-hidden border border-border/50 shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-primary truncate">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-heading font-semibold text-primary">{formatPrice(item.price * item.quantity)}</p>
                      <p className="text-xs text-gray-400">{formatPrice(item.price)} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-border/60 shadow-sm p-5 sm:p-6">
              <h2 className="font-heading text-xl font-semibold text-primary mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-secondary" />
                Shipping Address
              </h2>
              <Separator className="mb-4" />
              <ShippingAddressCard address={order.shippingAddress} />
            </div>

            <div className="bg-white rounded-xl border border-border/60 shadow-sm p-5 sm:p-6">
              <h2 className="font-heading text-xl font-semibold text-primary mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-secondary" />
                Price Summary
              </h2>
              <Separator className="mb-4" />
              <PriceSummary order={order} />
            </div>

            <div className="flex gap-3">
              {order.invoiceUrl && (
                <Button variant="secondary" className="gap-2">
                  <Download className="w-4 h-4" />
                  Download Invoice
                </Button>
              )}
              <Button variant="outline" className="gap-2">
                <FileText className="w-4 h-4" />
                Request Support
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-border/60 shadow-sm p-5 sm:p-6">
              <h2 className="font-heading text-xl font-semibold text-primary mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-secondary" />
                Order Timeline
              </h2>
              <Separator className="mb-4" />
              <StatusTimeline order={order} />
            </div>

            <div className="bg-white rounded-xl border border-border/60 shadow-sm p-5 sm:p-6 border-secondary/20">
              <h2 className="font-heading text-lg font-semibold text-primary mb-3">Need Help?</h2>
              <p className="text-sm text-gray-500 mb-4">
                Have questions about your order? Our support team is here to help.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-9 h-9 rounded-full bg-secondary/10 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    <p className="font-medium text-primary">Email</p>
                    <a href="mailto:support@ajjrambrass.com" className="text-secondary hover:text-accent transition-colors">
                      support@ajjrambrass.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-9 h-9 rounded-full bg-secondary/10 flex items-center justify-center">
                    <Phone className="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    <p className="font-medium text-primary">Phone</p>
                    <a href="tel:+919876543210" className="text-secondary hover:text-accent transition-colors">
                      +91 98765 43210
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-9 h-9 rounded-full bg-secondary/10 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    <p className="font-medium text-primary">Response Time</p>
                    <p className="text-gray-500">Within 24 hours</p>
                  </div>
                </div>
              </div>
              <Separator className="my-4" />
              <Link href="/custom-order">
                <Button variant="outline" className="w-full gap-2">
                  <FileText className="w-4 h-4" />
                  Place Custom Order
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
