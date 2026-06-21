"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { customOrders } from "@/data/orders";
import {
  FileText, Search, IndianRupee, Check, Hammer, Truck, Upload,
  ChevronRight, Star, Phone, Mail, Send, CheckCircle, Clock, Gem, Sparkles
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

const steps = [
  { icon: FileText, title: "Submit Requirements", desc: "Tell us what you need crafted" },
  { icon: Search, title: "Seller Reviews", desc: "We review & plan your piece" },
  { icon: IndianRupee, title: "Get Quote", desc: "Receive a detailed price quote" },
  { icon: Check, title: "Accept & Pay", desc: "Confirm and make a secure payment" },
  { icon: Hammer, title: "Production Starts", desc: "Master artisans begin crafting" },
  { icon: Truck, title: "Delivery", desc: "Quality checked & shipped to you" },
];

const productTypes = ["Idol", "Decorative", "Puja Item", "Utensil", "Other"];
const finishOptions = ["Antique Gold", "Gold Polish", "Mirror Polish", "Matte", "Antique", "Custom"];

const faqs = [
  {
    q: "How long does a custom brass order take?",
    a: "Typically 15-30 days depending on complexity. Simple items like diyas or small idols take 10-15 days, while intricate sculptures may take 30-45 days. We'll provide a specific timeline in your quote."
  },
  {
    q: "Can I see samples or previous similar work?",
    a: "Absolutely! We can share photos of similar custom work we've done. You can also browse our Recent Custom Orders section below to see examples of our craftsmanship."
  },
  {
    q: "What is the payment process?",
    a: "We require 50% advance payment to begin production. The remaining 50% is due before dispatch. We accept UPI, bank transfer, and all major cards through our secure payment gateway."
  },
  {
    q: "Can I get a refund if I don't like the final piece?",
    a: "We send photo/video updates at each production stage for your approval. If you're unsatisfied, we'll work with you to make adjustments. Refunds are handled case-by-case for custom orders."
  },
];

const statusStageMap: Record<string, string> = {
  "pending": "Awaiting Review",
  "quote-sent": "Quote Sent",
  "accepted": "Accepted",
  "paid": "Payment Received",
  "in-production": "In Production",
  "shipped": "Shipped",
  "delivered": "Delivered",
};

export default function CustomOrderPage() {
  const [productType, setProductType] = useState("");
  const [description, setDescription] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [weight, setWeight] = useState("");
  const [finish, setFinish] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [engravingText, setEngravingText] = useState("");
  const [requirements, setRequirements] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [requestId, setRequestId] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const requestIdGen = () => {
    const prefix = "CUST-";
    const num = String(customOrders.length + 1).padStart(3, "0");
    return `${prefix}${num}`;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = requestIdGen();
    setRequestId(newId);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F7F2E8]">
      {submitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 gold-gradient" />
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-primary mb-2">Request Submitted!</h3>
            <p className="text-gray-500 mb-1">Your custom order request has been received.</p>
            <p className="text-sm text-gray-400 mb-6">
              Our team will review your requirements and get back to you within 24-48 hours.
            </p>
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/10 mb-6">
              <p className="text-xs text-gray-400 mb-1">Request ID</p>
              <p className="font-heading text-xl font-bold text-secondary">{requestId}</p>
            </div>
            <div className="flex flex-col gap-3">
              <Link href={`/custom-order/requests`}>
                <Button variant="secondary" className="w-full gap-2">
                  <Search className="w-4 h-4" />
                  Track Your Order
                </Button>
              </Link>
              <Button variant="ghost" onClick={() => setSubmitted(false)}>
                Submit Another Request
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="relative brass-gradient overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-accent blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10">
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-medium">Custom Order</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white/80 text-sm mb-6 border border-white/10">
              <Gem className="w-4 h-4 text-accent" />
              <span>Handcrafted by Master Artisans Since 1965</span>
            </div>
            <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold mb-4">
              <span className="gradient-gold">Bespoke Brass</span>
              <br />
              <span className="text-white">Creations</span>
            </h1>
            <p className="text-white/70 text-lg sm:text-xl max-w-xl leading-relaxed">
              Describe your vision and our master artisans will transform it into an heirloom-quality brass masterpiece. Each piece is individually handcrafted to your exact specifications.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            <span>How It Works</span>
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl text-primary">From Your Vision to Reality</h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">
            A seamless process from design to delivery
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-4 relative">
          {steps.map((step, i) => (
            <div key={i} className="relative group">
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-secondary/40 to-border" />
              )}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-white border-2 border-secondary/20 shadow-sm flex items-center justify-center mb-4 group-hover:border-secondary group-hover:shadow-md transition-all duration-300">
                  <step.icon className="w-7 h-7 text-secondary" />
                </div>
                <span className="text-xs text-secondary font-semibold mb-1">Step {i + 1}</span>
                <h3 className="font-heading text-base font-semibold text-primary mb-1">{step.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-white rounded-2xl border border-border/60 shadow-lg p-6 sm:p-10 lg:p-12 relative">
          <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl gold-gradient" />

          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm mb-4">
              <FileText className="w-4 h-4" />
              <span>Custom Order Form</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl text-primary">Tell Us What You Need</h2>
            <p className="text-gray-500 mt-2">Every detail helps us craft the perfect piece</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="productType">Product Type *</Label>
                <Select value={productType} onValueChange={setProductType} required>
                  <SelectTrigger id="productType">
                    <SelectValue placeholder="Select product type" />
                  </SelectTrigger>
                  <SelectContent>
                    {productTypes.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="finish">Preferred Finish *</Label>
                <Select value={finish} onValueChange={setFinish} required>
                  <SelectTrigger id="finish">
                    <SelectValue placeholder="Select finish" />
                  </SelectTrigger>
                  <SelectContent>
                    {finishOptions.map((f) => (
                      <SelectItem key={f} value={f}>{f}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dimensions">Dimensions (L x W x H)</Label>
                <Input
                  id="dimensions"
                  placeholder="e.g. 12 x 8 x 6 inches"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Estimated Weight</Label>
                <Input
                  id="weight"
                  placeholder="e.g. 2-3 kg"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="engraving">Engraving Text</Label>
                <Input
                  id="engraving"
                  placeholder="Any text to engrave (optional)"
                  value={engravingText}
                  onChange={(e) => setEngravingText(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Product Description *</Label>
              <textarea
                id="description"
                rows={5}
                className="flex w-full rounded-md border border-border bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary transition-all duration-200 resize-y"
                placeholder="Describe your vision in detail... material preferences, design elements, size, purpose, any reference inspiration..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Additional Requirements</Label>
              <textarea
                id="requirements"
                rows={3}
                className="flex w-full rounded-md border border-border bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary transition-all duration-200 resize-y"
                placeholder="Deadlines, special instructions, packaging preferences..."
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <Label>Reference Image (Optional)</Label>
              <div className="border-2 border-dashed border-border rounded-xl p-6 sm:p-8 text-center hover:border-secondary/50 transition-colors cursor-pointer bg-white/50"
                onClick={() => document.getElementById("image-upload")?.click()}
              >
                {imagePreview ? (
                  <div className="relative inline-block">
                    <img src={imagePreview} alt="Preview" className="max-h-48 rounded-lg mx-auto" />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setImagePreview(null); }}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      &times;
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-secondary/10 flex items-center justify-center">
                      <Upload className="w-7 h-7 text-secondary/60" />
                    </div>
                    <p className="font-medium text-primary">Click to upload reference image</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG or WEBP (max 5MB)</p>
                  </div>
                )}
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
            </div>

            <Separator className="border-dashed" />

            <div>
              <h3 className="font-heading text-lg font-semibold text-primary mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto text-base gap-2"
            >
              <Send className="w-4 h-4" />
              Submit Custom Order Request
            </Button>

            <p className="text-xs text-gray-400">
              By submitting, you agree to our terms and privacy policy. We'll respond within 24-48 hours.
            </p>
          </form>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm mb-4">
            <Star className="w-4 h-4" />
            <span>Recent Work</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl text-primary">Recent Custom Orders</h2>
          <p className="text-gray-500 mt-2">Examples of our bespoke craftsmanship</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {customOrders.map((co) => (
            <div key={co.id} className="bg-white rounded-xl border border-border/60 shadow-sm hover:shadow-md transition-all duration-300 p-6 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full gold-gradient opacity-60" />
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">{co.id}</p>
                  <h3 className="font-heading text-lg font-semibold text-primary">{co.productType}</h3>
                  <p className="text-sm text-gray-500">by {co.customerName}</p>
                </div>
                <Badge className={`${co.status === "in-production" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"} capitalize`}>
                  {statusStageMap[co.status] || co.status}
                </Badge>
              </div>

              <p className="text-sm text-gray-600 line-clamp-2 mb-4">{co.description}</p>

              <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                <span>{co.dimensions}</span>
                <span>&middot;</span>
                <span>{co.weight}</span>
                <span>&middot;</span>
                <span>{co.finish}</span>
              </div>

              {co.sellerQuote && (
                <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
                  <p className="text-xs text-gray-400">Quote</p>
                  <p className="font-heading text-lg font-bold text-secondary">{formatPrice(co.sellerQuote)}</p>
                  {co.quoteNote && <p className="text-xs text-gray-500 mt-0.5">{co.quoteNote}</p>}
                </div>
              )}

              {co.productionStages.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border/60">
                  <p className="text-xs text-gray-400 mb-2">Production Progress</p>
                  <div className="flex items-center gap-2">
                    {co.productionStages.map((stage, i) => (
                      <div key={i} className="flex items-center gap-1">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            stage.status === "completed" ? "bg-green-500" :
                            stage.status === "in-progress" ? "bg-accent animate-pulse" : "bg-gray-200"
                          }`}
                        />
                        <span className="text-[10px] text-gray-400 truncate max-w-[60px]">{stage.name}</span>
                        {i < co.productionStages.length - 1 && <div className="w-2 h-px bg-border/60" />}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm mb-4">
            <FileText className="w-4 h-4" />
            <span>FAQ</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl text-primary">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-xl border border-border/60 overflow-hidden transition-all duration-300">
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left"
              >
                <span className="font-heading text-base font-semibold text-primary pr-4">{faq.q}</span>
                <ChevronRight
                  className={`w-5 h-5 text-secondary shrink-0 transition-transform duration-300 ${
                    openFaq === i ? "rotate-90" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openFaq === i ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                  <Separator className="mb-3" />
                  <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
