"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Gem, Mail, Phone, MapPin, ChevronRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-primary text-white/80">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
          <div className="max-w-2xl mx-auto text-center">
            <Heart className="h-8 w-8 text-accent mx-auto mb-4" />
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-3">
              Join the Heritage Circle
            </h2>
            <p className="text-white/60 mb-6 text-sm md:text-base">
              Subscribe to receive exclusive offers, new arrival alerts, and brass care tips.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              <Button type="submit" variant="secondary" className="whitespace-nowrap">
                Subscribe
              </Button>
            </form>
            {subscribed && (
              <p className="text-accent text-sm mt-3 animate-pulse">Thank you! You&apos;re now part of our heritage circle.</p>
            )}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Gem className="h-6 w-6 text-accent" />
              <span className="font-heading text-xl font-bold text-white">Ajjram Brass</span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              India&apos;s premier heritage brass brand. Handcrafted by master artisans since 1965, 
              delivering timeless spiritual and decorative brassware across the globe.
            </p>
            <div className="space-y-2 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-accent" />
                <span>Jaipur, Rajasthan, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-accent" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-accent" />
                <span>hello@ajjrambrass.com</span>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {["Home", "Shop All", "New Arrivals", "Best Sellers", "Custom Orders", "Track Order"].map((link) => (
                <li key={link}>
                  <Link
                    href={link === "Home" ? "/" : `/products?search=${link.toLowerCase().replace(" ", "-")}`}
                    className="text-sm text-white/60 hover:text-accent transition-colors flex items-center gap-1 group"
                  >
                    <ChevronRight className="h-3 w-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-white mb-4">Categories</h3>
            <ul className="space-y-2.5">
              {["Puja Items", "Idols & Murtis", "Home Decor", "Utensils", "Wellness", "Festival Specials"].map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/products?category=${cat.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`}
                    className="text-sm text-white/60 hover:text-accent transition-colors flex items-center gap-1 group"
                  >
                    <ChevronRight className="h-3 w-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-2.5">
              {["About Us", "Shipping Policy", "Return & Refund", "Privacy Policy", "Terms & Conditions", "Contact Us", "FAQ"].map((link) => (
                <li key={link}>
                  <Link
                    href="#"
                    className="text-sm text-white/60 hover:text-accent transition-colors flex items-center gap-1 group"
                  >
                    <ChevronRight className="h-3 w-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/40">
            &copy; 2026 Ajjram Brass. All rights reserved. | GST: 08AABCU1234D1Z4 | HSN: 7418
          </p>
          <div className="flex items-center gap-3">
            {["Visa", "Mastercard", "UPI", "COD"].map((p) => (
              <span key={p} className="text-xs text-white/40 bg-white/5 px-3 py-1 rounded-full">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
