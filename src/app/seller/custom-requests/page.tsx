"use client";

import { useState } from "react";
import { customOrders as initialCustomOrders } from "@/data/orders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Image,
  Send,
  Check,
  Hammer,
  Truck,
  Clock,
  CheckCircle,
  DollarSign,
  Eye,
  MessageSquare,
  Package,
} from "lucide-react";
import { formatPrice, formatDate, getStatusColor } from "@/lib/utils";
import type { CustomOrder } from "@/data/orders";

const productionStageIcons = [
  { name: "Material Sourcing", icon: Truck },
  { name: "Crafting", icon: Hammer },
  { name: "Polishing", icon: CheckCircle },
  { name: "Quality Control", icon: Eye },
  { name: "Ready for Dispatch", icon: Package },
];

export default function CustomRequestsPage() {
  const [requests, setRequests] = useState<CustomOrder[]>(initialCustomOrders);
  const [activeTab, setActiveTab] = useState<"pending" | "in-progress">("pending");
  const [quoteAmount, setQuoteAmount] = useState<Record<string, string>>({});
  const [quoteNote, setQuoteNote] = useState<Record<string, string>>({});

  const pending = requests.filter((r) => r.status === "pending" || r.status === "quote-sent");
  const inProgress = requests.filter((r) =>
    ["accepted", "paid", "in-production", "shipped"].includes(r.status)
  );

  const displayed = activeTab === "pending" ? pending : inProgress;

  const handleSendQuote = (id: string) => {
    const amount = quoteAmount[id];
    const note = quoteNote[id] || "";
    if (!amount || isNaN(Number(amount))) return alert("Please enter a valid quote amount");
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "quote-sent",
              sellerQuote: Number(amount),
              quoteNote: note,
              quoteSentAt: new Date().toISOString(),
            }
          : r
      )
    );
    setQuoteAmount((prev) => ({ ...prev, [id]: "" }));
    setQuoteNote((prev) => ({ ...prev, [id]: "" }));
  };

  const toggleProductionStage = (requestId: string, stageIndex: number) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id !== requestId) return r;
        const stages = r.productionStages.map((s, i) => {
          if (i !== stageIndex) return s;
          if (s.status === "completed") return { ...s, status: "pending" as const };
          return { ...s, status: "completed" as const, date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) };
        });
        const allDone = stages.every((s) => s.status === "completed");
        return {
          ...r,
          productionStages: stages,
          status: allDone ? ("shipped" as const) : ("in-production" as const),
        };
      })
    );
  };

  const updateProduction = (id: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: "in-production" as const }
          : r
      )
    );
    alert("Production status updated!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-primary">Custom Brass Requests</h1>
        <p className="text-muted text-sm mt-1">
          {pending.length} pending &middot; {inProgress.length} in progress
        </p>
      </div>

      <div className="flex gap-1">
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "pending"
              ? "bg-primary text-white shadow-sm"
              : "bg-white text-muted hover:text-primary border border-border/60"
          }`}
        >
          Pending Requests ({pending.length})
        </button>
        <button
          onClick={() => setActiveTab("in-progress")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "in-progress"
              ? "bg-primary text-white shadow-sm"
              : "bg-white text-muted hover:text-primary border border-border/60"
          }`}
        >
          In Progress ({inProgress.length})
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {displayed.map((req) => (
          <div key={req.id} className="bg-white rounded-xl border border-border/60 overflow-hidden">
            <div className="p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="h-4 w-4 text-secondary" />
                    <span className="font-mono text-xs font-medium text-muted">{req.id}</span>
                  </div>
                  <h3 className="font-heading text-base font-semibold text-primary">{req.customerName}</h3>
                  <p className="text-xs text-muted">{req.customerEmail} &middot; {req.customerPhone}</p>
                </div>
                <Badge className={getStatusColor(req.status)}>{req.status}</Badge>
              </div>

              <Separator />

              <div>
                <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Product Requirements</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted">Type: </span>
                    <span className="text-primary font-medium">{req.productType}</span>
                  </div>
                  <div>
                    <span className="text-muted">Quantity: </span>
                    <span className="text-primary font-medium">{req.quantity}</span>
                  </div>
                  <div>
                    <span className="text-muted">Dimensions: </span>
                    <span className="text-primary font-medium">{req.dimensions}</span>
                  </div>
                  <div>
                    <span className="text-muted">Finish: </span>
                    <span className="text-primary font-medium">{req.finish}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted">Weight: </span>
                    <span className="text-primary font-medium">{req.weight}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Description</h4>
                <p className="text-sm text-muted bg-[#F7F2E8]/50 p-3 rounded-lg border border-border/40">{req.description}</p>
              </div>

              {req.requirements && (
                <div>
                  <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Special Requirements</h4>
                  <p className="text-sm text-muted bg-amber-50 p-3 rounded-lg border border-amber-200/40">{req.requirements}</p>
                </div>
              )}

              {req.engravingText && (
                <div>
                  <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Engraving Text</h4>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/5 text-primary text-sm font-medium border border-primary/10">
                    <MessageSquare className="h-3.5 w-3.5" />
                    {req.engravingText}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Reference Image</h4>
                <div className="w-full h-32 rounded-lg bg-[#F7F2E8] border border-border/40 flex items-center justify-center">
                  <div className="text-center">
                    <Image className="h-8 w-8 text-muted mx-auto mb-1" />
                    <p className="text-xs text-muted">No reference image uploaded</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between text-xs text-muted">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Created {formatDate(req.createdAt)}
                </span>
                {req.quoteSentAt && (
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    Quote sent {formatDate(req.quoteSentAt)}
                  </span>
                )}
              </div>

              {req.status === "quote-sent" && req.sellerQuote && (
                <div className="bg-green-50 border border-green-200/60 rounded-lg p-3">
                  <p className="text-xs text-green-700 font-medium">Quote Sent</p>
                  <p className="text-lg font-bold text-green-800">{formatPrice(req.sellerQuote)}</p>
                  {req.quoteNote && <p className="text-xs text-green-600 mt-1">{req.quoteNote}</p>}
                  <p className="text-xs text-green-500 mt-1">Waiting for customer response...</p>
                </div>
              )}

              {(req.status === "pending") && (
                <div className="bg-blue-50 border border-blue-200/60 rounded-lg p-4 space-y-3">
                  <h4 className="text-sm font-semibold text-blue-800 flex items-center gap-1.5">
                    <DollarSign className="h-4 w-4" /> Send Quote
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <Label className="text-xs text-blue-700">Quote Amount (₹)</Label>
                      <Input
                        type="number"
                        placeholder="Enter amount..."
                        value={quoteAmount[req.id] || ""}
                        onChange={(e) =>
                          setQuoteAmount((prev) => ({ ...prev, [req.id]: e.target.value }))
                        }
                        className="bg-white border-blue-200"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-blue-700">Note (optional)</Label>
                      <textarea
                        placeholder="Add notes about pricing, timeline..."
                        value={quoteNote[req.id] || ""}
                        onChange={(e) =>
                          setQuoteNote((prev) => ({ ...prev, [req.id]: e.target.value }))
                        }
                        className="flex min-h-[60px] w-full rounded-md border border-blue-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary transition-all"
                        rows={2}
                      />
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleSendQuote(req.id)}
                      className="gap-1 w-full"
                    >
                      <Send className="h-3.5 w-3.5" /> Send Quote
                    </Button>
                  </div>
                </div>
              )}

              {(req.status === "in-production" || req.status === "shipped") && (
                <div>
                  <h4 className="text-sm font-semibold text-primary mb-3 flex items-center gap-1.5">
                    <Package className="h-4 w-4 text-secondary" /> Production Tracking
                  </h4>
                  <div className="space-y-2">
                    {req.productionStages.map((stage, i) => {
                      const StageIcon = productionStageIcons[i]?.icon || Check;
                      return (
                        <label
                          key={stage.name}
                          className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                            stage.status === "completed"
                              ? "bg-green-50 border-green-200"
                              : stage.status === "in-progress"
                              ? "bg-blue-50 border-blue-200"
                              : "bg-white border-border/60"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={stage.status === "completed"}
                            onChange={() => toggleProductionStage(req.id, i)}
                            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/30"
                          />
                          <StageIcon className={`h-4 w-4 shrink-0 ${
                            stage.status === "completed"
                              ? "text-green-600"
                              : stage.status === "in-progress"
                              ? "text-blue-600"
                              : "text-muted"
                          }`} />
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${
                              stage.status === "completed"
                                ? "text-green-700"
                                : stage.status === "in-progress"
                                ? "text-blue-700"
                                : "text-muted"
                            }`}>
                              {stage.name}
                            </p>
                            {stage.date && (
                              <p className="text-xs text-muted">{stage.date}</p>
                            )}
                          </div>
                          {stage.status === "completed" && (
                            <Check className="h-4 w-4 text-green-600" />
                          )}
                        </label>
                      );
                    })}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-3 w-full gap-1"
                    onClick={() => updateProduction(req.id)}
                  >
                    <Check className="h-3.5 w-3.5" /> Update Production
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
        {displayed.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted bg-white rounded-xl border border-border/60">
            <FileText className="h-10 w-10 mx-auto mb-2 opacity-40" />
            <p>No {activeTab === "pending" ? "pending" : "in-progress"} requests</p>
          </div>
        )}
      </div>
    </div>
  );
}
