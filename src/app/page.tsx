"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { products, categories } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ShoppingBag,
  Gem,
  Shield,
  Truck,
  Star,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Heart,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatPrice } from "@/lib/utils";

const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);
const newArrivals = products.filter((p) => p.isNew).slice(0, 4);

const testimonials = [
  {
    quote: "Exquisite craftsmanship! The brass kalash I ordered is absolutely stunning. You can feel the heritage in every detail. Ajjram Brass is truly unmatched.",
    name: "Priya Sharma",
    rating: 5,
  },
  {
    quote: "I've never seen such attention to detail. The Ganesh idol is a masterpiece. It has become the centerpiece of my home temple. Thank you for this divine artistry.",
    name: "Rajesh Mehta",
    rating: 5,
  },
  {
    quote: "Custom ordered a set of brass utensils for my wedding. The team worked closely with me to create exactly what I envisioned. Exceptional quality and service.",
    name: "Ananya Patel",
    rating: 5,
  },
];

const features = [
  {
    icon: Gem,
    title: "Heritage Craftsmanship",
    description: "Handcrafted by master artisans with techniques passed down through four generations since 1965.",
  },
  {
    icon: Shield,
    title: "Premium Quality",
    description: "Only the finest virgin brass, rigorously tested for purity, durability, and finish excellence.",
  },
  {
    icon: Truck,
    title: "Free Delivery",
    description: "Complimentary shipping across India with secure packaging and real-time order tracking.",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "Protected transactions with encrypted payments, easy returns, and full purchase protection.",
  },
];

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const sizeClass = size === "sm" ? "w-4 h-4" : "w-5 h-5";
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${sizeClass} ${i < Math.floor(rating) ? "text-accent fill-accent" : "text-gray-300"}`}
        />
      ))}
    </div>
  );
}

function ProductCard({ product }: { product: (typeof products)[0] }) {
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const router = useRouter();
  const wishlisted = isInWishlist(product.id);

  return (
    <Card className="group card-hover glass-card overflow-hidden border border-border/60">
      <div className="relative aspect-square overflow-hidden bg-secondary-50">
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {product.isNew && (
          <Badge variant="accent" className="absolute left-3 top-3">
            <Sparkles className="mr-1 h-3 w-3" /> New
          </Badge>
        )}
        {product.comparePrice && (
          <Badge variant="destructive" className="absolute right-3 top-3">
            {Math.round((1 - product.price / product.comparePrice) * 100)}% OFF
          </Badge>
        )}
        <button
          onClick={() => toggleWishlist(product.id)}
          className="absolute right-3 bottom-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-sm transition-all hover:bg-white hover:scale-110"
        >
          <Heart className={`h-4 w-4 ${wishlisted ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
        </button>
      </div>
      <CardContent className="p-4">
        <p className="text-xs text-muted uppercase tracking-wider mb-1">{product.category}</p>
        <h3 className="font-heading text-lg font-semibold text-primary mb-1 line-clamp-1">{product.name}</h3>
        <div className="flex items-center gap-2 mb-3">
          <StarRating rating={product.rating} />
          <span className="text-xs text-muted">({product.reviewCount})</span>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <span className="font-heading text-xl font-bold text-secondary">{formatPrice(product.price)}</span>
          {product.comparePrice && (
            <span className="text-sm text-muted line-through">{formatPrice(product.comparePrice)}</span>
          )}
        </div>
        <Button
          variant="default"
          size="sm"
          className="w-full gap-2"
          onClick={() => {
            addItem({
              productId: product.id,
              name: product.name,
              price: product.price,
              image: product.images[0],
              quantity: 1,
              stock: product.stock,
              material: product.material,
            });
          }}
        >
          <ShoppingBag className="h-4 w-4" /> Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail("");
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Banner */}
      <section className="relative min-h-[85vh] flex items-center justify-center brass-gradient overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-accent blur-3xl" />
          <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-secondary blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-accent/20 blur-3xl" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,168,106,0.15)_0%,transparent_70%)]" />

        {/* Decorative top border */}
        <div className="absolute top-0 left-0 right-0 h-1 gold-gradient" />

        {/* Decorative corner accents */}
        <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-accent/30 hidden md:block" />
        <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-accent/30 hidden md:block" />
        <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-accent/30 hidden md:block" />
        <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-accent/30 hidden md:block" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-accent/20 mb-8">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-accent text-sm tracking-wider">Since 1965 • Four Generations of Craftsmanship</span>
          </div>

          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight mb-6">
            Heritage Handcrafted
            <br />
            <span className="gold-gradient">in Brass Since 1965</span>
          </h1>

          <p className="text-secondary-200 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Discover premium-quality brass artifacts, handcrafted by master artisans using age-old techniques.
            Each piece tells a story of tradition, devotion, and unparalleled artistry.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="accent"
              size="xl"
              className="gap-2 text-base font-medium shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30"
              onClick={() => router.push("/products")}
            >
              <ShoppingBag className="h-5 w-5" /> Shop Collection
            </Button>
            <Button
              variant="outline"
              size="xl"
              className="gap-2 text-base font-medium border-accent/50 text-accent hover:bg-accent hover:text-primary"
              onClick={() => router.push("/custom-order")}
            >
              Custom Order <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Decorative Divider */}
      <div className="flex items-center justify-center gap-4 py-8 bg-background">
        <div className="h-px w-16 bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />
        <div className="h-2 w-2 rotate-45 border border-secondary/60" />
        <div className="h-px w-16 bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />
      </div>

      {/* Featured Categories */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-secondary text-sm tracking-[0.2em] uppercase font-medium">Collections</span>
            <h2 className="section-heading mt-2">Explore Our Categories</h2>
            <p className="text-muted mt-3 max-w-lg mx-auto">
              Discover our curated collection of handcrafted brass artifacts, each category reflecting centuries of tradition.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="group relative"
              >
                <Card className="overflow-hidden border border-border/60 card-hover glass-card">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-heading text-base md:text-lg font-semibold text-white mb-0.5">
                      {category.name}
                    </h3>
                    <p className="text-secondary-200 text-xs">{category.count} Items</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Decorative Divider */}
      <div className="flex items-center justify-center gap-4 py-8 bg-background">
        <div className="h-px w-16 bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />
        <div className="h-2 w-2 rotate-45 border border-secondary/60" />
        <div className="h-px w-16 bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />
      </div>

      {/* Best Sellers */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-14">
            <div>
              <span className="text-secondary text-sm tracking-[0.2em] uppercase font-medium">Top Picks</span>
              <h2 className="section-heading mt-2">Best Sellers</h2>
              <p className="text-muted mt-2 max-w-md">
                Our most cherished pieces, beloved by customers across India for their exceptional quality and beauty.
              </p>
            </div>
            <Link
              href="/products"
              className="hidden md:flex items-center gap-1 text-secondary hover:text-accent transition-colors font-medium"
            >
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-10 md:hidden">
            <Link href="/products">
              <Button variant="outline" className="gap-2">
                View All Best Sellers <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Festival Offers Banner */}
      <section className="relative py-24 brass-gradient overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-accent blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-secondary blur-3xl" />
        </div>

        {/* Decorative border */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

        {/* Corner decorative elements */}
        <div className="absolute top-6 left-6 w-12 h-12 border-l border-t border-accent/20" />
        <div className="absolute top-6 right-6 w-12 h-12 border-r border-t border-accent/20" />
        <div className="absolute bottom-6 left-6 w-12 h-12 border-l border-b border-accent/20" />
        <div className="absolute bottom-6 right-6 w-12 h-12 border-r border-b border-accent/20" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <Badge variant="accent" className="mb-6 px-4 py-1.5 text-sm">
            <Sparkles className="mr-1.5 h-4 w-4" /> Limited Time Offer
          </Badge>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Festival Special Offers
          </h2>
          <p className="text-secondary-200 text-lg md:text-xl max-w-2xl mx-auto mb-3">
            Celebrate the festive season with exclusive discounts on our premium brass collection.
            Handcrafted blessings for your home and temple.
          </p>
          <p className="text-accent text-2xl md:text-3xl font-heading font-bold mb-8">
            Up to 40% Off + Free Shipping
          </p>
          <Button
            variant="accent"
            size="xl"
            className="gap-2 text-base font-medium shadow-lg shadow-accent/25"
            onClick={() => router.push("/products?offer=true")}
          >
            Shop Festival Deals <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Decorative Divider */}
      <div className="flex items-center justify-center gap-4 py-8 bg-surface">
        <div className="h-px w-16 bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />
        <div className="h-2 w-2 rotate-45 border border-secondary/60" />
        <div className="h-px w-16 bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />
      </div>

      {/* New Arrivals */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-14">
            <div>
              <span className="text-secondary text-sm tracking-[0.2em] uppercase font-medium">Latest Additions</span>
              <h2 className="section-heading mt-2">New Arrivals</h2>
              <p className="text-muted mt-2 max-w-md">
                Fresh from our artisans&apos; workshops — newly crafted pieces that blend tradition with timeless elegance.
              </p>
            </div>
            <Link
              href="/products?sort=newest"
              className="hidden md:flex items-center gap-1 text-secondary hover:text-accent transition-colors font-medium"
            >
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-10 md:hidden">
            <Link href="/products?sort=newest">
              <Button variant="outline" className="gap-2">
                View All New Arrivals <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Decorative Divider */}
      <div className="flex items-center justify-center gap-4 py-8 bg-surface">
        <div className="h-px w-16 bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />
        <div className="h-2 w-2 rotate-45 border border-secondary/60" />
        <div className="h-px w-16 bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />
      </div>

      {/* Why Choose Us */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-secondary text-sm tracking-[0.2em] uppercase font-medium">Why Ajjram Brass</span>
            <h2 className="section-heading mt-2">The Ajjram Promise</h2>
            <p className="text-muted mt-3 max-w-lg mx-auto">
              Four generations of master artisanship, unwavering quality, and a commitment to preserving India&apos;s brass heritage.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <Card key={i} className="glass-card border border-border/60 card-hover text-center p-8">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl gold-gradient mb-5 shadow-lg shadow-secondary/20">
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-primary mb-2">{feature.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Decorative Divider */}
      <div className="flex items-center justify-center gap-4 py-8 bg-background">
        <div className="h-px w-16 bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />
        <div className="h-2 w-2 rotate-45 border border-secondary/60" />
        <div className="h-px w-16 bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />
      </div>

      {/* Custom Brass Section */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1606938076010-ec4250e9e4bf?w=800"
                  alt="Custom Brass Creations"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border-r-2 border-b-2 border-secondary/30 hidden md:block" />
              <div className="absolute -top-4 -left-4 w-24 h-24 border-l-2 border-t-2 border-secondary/30 hidden md:block" />
            </div>

            <div>
              <Badge variant="accent" className="mb-4">
                <Sparkles className="mr-1.5 h-4 w-4" /> Custom Orders
              </Badge>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary leading-tight mb-6">
                Bespoke Brass
                <br />
                <span className="text-secondary">Creations</span>
              </h2>
              <p className="text-muted text-lg leading-relaxed mb-6">
                Have a vision? Our master artisans bring your ideas to life. Whether it&apos;s a custom idol for
                your temple, bespoke decor for your home, or a unique gift — we craft it with the same
                dedication that has defined our legacy since 1965.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-primary">
                  <div className="h-1.5 w-1.5 rounded-full bg-secondary" />
                  <span>Custom sizes, designs, and finishes</span>
                </li>
                <li className="flex items-center gap-3 text-primary">
                  <div className="h-1.5 w-1.5 rounded-full bg-secondary" />
                  <span>Personalized engravings and motifs</span>
                </li>
                <li className="flex items-center gap-3 text-primary">
                  <div className="h-1.5 w-1.5 rounded-full bg-secondary" />
                  <span>Bulk orders for temples and institutions</span>
                </li>
              </ul>
              <Button
                variant="default"
                size="xl"
                className="gap-2 text-base"
                onClick={() => router.push("/custom-order")}
              >
                Start Your Custom Order <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Decorative Divider */}
      <div className="flex items-center justify-center gap-4 py-8 bg-surface">
        <div className="h-px w-16 bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />
        <div className="h-2 w-2 rotate-45 border border-secondary/60" />
        <div className="h-px w-16 bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />
      </div>

      {/* Testimonials */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-secondary text-sm tracking-[0.2em] uppercase font-medium">Testimonials</span>
            <h2 className="section-heading mt-2">What Our Customers Say</h2>
            <p className="text-muted mt-3 max-w-lg mx-auto">
              Hear from our cherished patrons who have brought home a piece of Ajjram&apos;s heritage.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <Card key={i} className="glass-card border border-border/60 card-hover p-8 relative">
                <div className="absolute -top-3 left-8 text-6xl font-heading text-secondary/20 leading-none">&ldquo;</div>
                <div className="relative">
                  <StarRating rating={t.rating} size="md" />
                  <p className="text-muted mt-4 leading-relaxed italic">&ldquo;{t.quote}&rdquo;</p>
                  <div className="mt-6 pt-4 border-t border-border/60">
                    <p className="font-heading text-base font-semibold text-primary">{t.name}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Decorative Divider */}
      <div className="flex items-center justify-center gap-4 py-8 bg-background">
        <div className="h-px w-16 bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />
        <div className="h-2 w-2 rotate-45 border border-secondary/60" />
        <div className="h-px w-16 bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />
      </div>

      {/* Newsletter Signup */}
      <section className="py-20 brass-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full bg-accent blur-3xl" />
          <div className="absolute bottom-1/2 right-1/4 w-48 h-48 rounded-full bg-secondary blur-3xl" />
        </div>

        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

        <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
          <Badge variant="accent" className="mb-6 px-4 py-1.5">
            <Sparkles className="mr-1.5 h-4 w-4" /> Stay Connected
          </Badge>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">Join Our Brass Community</h2>
          <p className="text-secondary-200 text-lg mb-8">
            Subscribe for exclusive offers, new arrivals, and stories from our workshops.
            Be the first to know about festival specials and handcrafted treasures.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 h-12 px-5 rounded-md bg-white/10 backdrop-blur-sm border border-accent/30 text-white placeholder:text-secondary-300 focus:outline-none focus:border-accent transition-colors"
            />
            <Button type="submit" variant="accent" size="lg" className="gap-2 shrink-0">
              Subscribe <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
