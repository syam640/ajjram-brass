"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { customOrders, type CustomOrder } from "@/data/orders";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileText, ChevronRight, Clock, CheckCircle, Truck, Hammer } from "lucide-react";
import { formatPrice, formatDate, getStatusColor } from "@/lib/utils";

const tabs = ["All", "Pending", "Quote Sent", "Accepted", "In Production", "Delivered"];

const statusIconMap: Record<string, React.ReactNode> = {
  pending: <Clock className="w-4 h-4" />,
  "quote-sent": <FileText className="w-4 h-4" />,
  accepted: <CheckCircle className="w-4 h-4" />,
  paid: <CheckCircle className="w-4 h-4" />,
  "in-production": <Hammer className="w-4 h-4" />,
  shipped: <Truck className="w-4 h-4" />,
  delivered: <CheckCircle className="w-4 h-4" />,
};

const statusStageMap: Record<string, string> = {
  pending: "Awaiting Review",
  "quote-sent": "Quote Sent",
  accepted: "Accepted",
  paid: "Payment Received",
  "in-production": "In Production",
  shipped: "Shipped",
  delivered: "Delivered",
};

function getTabFilter(tab: string): string {
  const mapping: Record<string, string> = {
    "Pending": "pending",
    "Quote Sent": "quote-sent",
    "Accepted": "accepted",
    "In Production": "in-production",
    "Delivered": "delivered",
  };
  return mapping[tab] || "";
}

function getCompletedCount(stages: CustomOrder["productionStages"]): number {
  return stages.filter((s) => s.status === "completed").length;
}

function getOverallProgress(stages: CustomOrder["productionStages"]): number {
  if (stages.length === 0) return 0;
  return Math.round((getCompletedCount(stages) / stages.length) * 100);
}

export default function CustomOrderRequestsPage() {
  const [activeTab, setActiveTab] = useState("All");

  const filteredOrders = useMemo(() => {
    if (activeTab === "All") return customOrders;
    const filter = getTabFilter(activeTab);
    return customOrders.filter((o) => o.status === filter);
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#F7F2E8]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-secondary transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <Link href="/custom-order" className="hover:text-secondary transition-colors">Custom Order</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-primary font-medium">My Requests</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-4xl md:text-5xl text-primary">Custom Order Requests</h1>
            <p className="text-gray-500 mt-1">{customOrders.length} request{customOrders.length !== 1 ? "s" : ""}</p>
          </div>
          <Link href="/custom-order">
            <Button variant="secondary" className="gap-2">
              <FileText className="w-4 h-4" />
              New Custom Order
            </Button>
          </Link>
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
                  ({customOrders.filter((o) => o.status === getTabFilter(tab)).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/5 flex items-center justify-center">
              <FileText className="w-10 h-10 text-primary/30" />
            </div>
            <h3 className="font-heading text-2xl text-primary mb-2">No {activeTab !== "All" ? activeTab.toLowerCase() : ""} requests</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {activeTab === "All"
                ? "You haven't submitted any custom order requests yet. Start by telling us what you need crafted!"
                : `You don't have any ${activeTab.toLowerCase()} requests.`}
            </p>
            <Link href="/custom-order">
              <Button variant="secondary" size="lg" className="gap-2">
                <FileText className="w-4 h-4" />
                Submit Custom Order
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredOrders.map((order) => {
              const progress = getOverallProgress(order.productionStages);
              const completedStages = getCompletedCount(order.productionStages);

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
                          {statusStageMap[order.status] || order.status.replace(/-/g, " ")}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDate(new Date(order.createdAt))}
                      </div>
                    </div>

                    <Separator className="mb-4" />

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-400">Product Type</p>
                        <p className="text-sm font-medium text-primary">{order.productType}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Dimensions</p>
                        <p className="text-sm text-gray-600">{order.dimensions || "—"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Finish</p>
                        <p className="text-sm text-gray-600">{order.finish}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Quantity</p>
                        <p className="text-sm text-gray-600">{order.quantity}</p>
                      </div>
                    </div>

                    {order.sellerQuote && (
                      <div className="p-3 bg-primary/5 rounded-lg border border-primary/10 mb-4 inline-block">
                        <p className="text-xs text-gray-400">Quote Amount</p>
                        <p className="font-heading text-lg font-bold text-secondary">{formatPrice(order.sellerQuote)}</p>
                        {order.quoteNote && <p className="text-xs text-gray-500 mt-0.5">{order.quoteNote}</p>}
                      </div>
                    )}

                    {order.productionStages.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-border/60">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-sm font-medium text-primary">Production Progress</p>
                          <span className="text-xs text-gray-400">{completedStages}/{order.productionStages.length} stages</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full gold-gradient rounded-full transition-all duration-700"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">
                          {order.productionStages.map((stage, i) => (
                            <div key={i} className="flex items-center gap-1.5">
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  stage.status === "completed" ? "bg-green-500" :
                                  stage.status === "in-progress" ? "bg-accent animate-pulse" : "bg-gray-200"
                                }`}
                              />
                              <span className={`text-xs ${
                                stage.status === "completed" ? "text-green-700" :
                                stage.status === "in-progress" ? "text-accent font-medium" : "text-gray-400"
                              }`}>
                                {stage.name}
                              </span>
                              {stage.date && (
                                <span className="text-[10px] text-gray-300">({stage.date})</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-border/60 flex items-center justify-between">
                      <p className="text-xs text-gray-400">
                        {order.engravingText && (
                          <span className="inline-flex items-center gap-1">
                            Engraving: &ldquo;{order.engravingText}&rdquo;
                          </span>
                        )}
                        {!order.engravingText && "No engraving requested"}
                      </p>
                      <div className="flex items-center gap-2">
                        <Link href={`/custom-order`}>
                          <Button variant="outline" size="sm" className="gap-1.5">
                            View Details
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
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
