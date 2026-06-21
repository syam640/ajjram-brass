"use client";

import { useState } from "react";
import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { products } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingBag, Trash2, Star, ArrowLeft } from "lucide-react";
import { formatPrice } from "@/lib/utils";

const categories = ["All", "Puja Items", "Idols & Murtis", "Home Decor", "Utensils", "Wellness"];

export default function WishlistPage() {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const [activeCategory, setActiveCategory] = useState("All");

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  const filtered =
    activeCategory === "All"
      ? wishlistProducts
      : wishlistProducts.filter((p) => p.category === activeCategory);

  const handleAddToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: 1,
      stock: product.stock,
      material: product.material,
    });
    toggleWishlist(productId);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">My Wishlist</h1>
            <p className="mt-1 text-sm text-muted">
              {filtered.length} item{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Link href="/products">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Button>
          </Link>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "bg-primary text-white"
                  : "border border-border bg-white text-muted hover:border-primary/30 hover:text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-xl border border-border bg-white py-20 text-center">
            <Heart className="mx-auto mb-4 h-14 w-14 text-muted" />
            <h2 className="text-xl font-semibold text-primary">Your wishlist is empty</h2>
            <p className="mt-2 text-muted">Save items you love to your wishlist</p>
            <Link href="/products">
              <Button className="mt-6">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((product) => (
              <div
                key={product.id}
                className="group rounded-xl border border-border bg-white transition-all hover:shadow-md"
              >
                <Link href={`/products/${product.slug}`} className="block">
                  <div className="relative aspect-square overflow-hidden rounded-t-xl bg-background">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {product.hasOffer && product.offerLabel && (
                      <Badge variant="accent" className="absolute left-3 top-3">
                        {product.offerLabel}
                      </Badge>
                    )}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(product.id);
                      }}
                      className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur-sm transition-colors hover:bg-red-50"
                    >
                      <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                    </button>
                  </div>
                </Link>

                <div className="p-4">
                  <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted">
                    {product.category}
                  </p>
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="font-medium text-primary transition-colors hover:text-secondary">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="mt-2 flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium text-primary">{product.rating}</span>
                    <span className="text-xs text-muted">({product.reviewCount})</span>
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-lg font-bold text-primary">
                      {formatPrice(product.price)}
                    </span>
                    {product.comparePrice && (
                      <span className="text-sm text-muted line-through">
                        {formatPrice(product.comparePrice)}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => handleAddToCart(product.id)}
                    >
                      <ShoppingBag className="mr-1.5 h-4 w-4" />
                      Add to Cart
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:bg-red-50 hover:text-red-600"
                      onClick={() => toggleWishlist(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
