"use client";

import { useState, useEffect, useMemo, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { products as allProducts } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Check, SlidersHorizontal, X, Search, ShoppingBag, Heart, Star, ChevronDown } from "lucide-react";
import { formatPrice } from "@/lib/utils";

const allFinishes = ["Antique Gold", "Antique Gold Polish", "Gold Polish", "Mirror Polish", "Matte Finish", "Hand-Hammered", "Antique Finish", "High Polish", "Polished Gold"];

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "best-selling", label: "Best Selling" },
  { value: "name-az", label: "Name: A-Z" },
];

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]"><div className="animate-spin h-8 w-8 border-2 border-accent border-t-transparent rounded-full" /></div>}>
      <ProductsContent />
    </Suspense>
  );
}

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addItem } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();

  const [filterOpen, setFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    const cat = searchParams.get("category");
    return cat ? cat.split(",") : [];
  });
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);
  const [selectedFinish, setSelectedFinish] = useState<string[]>([]);
  const [weightRange, setWeightRange] = useState<[number, number]>([0, 5000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [addedToCart, setAddedToCart] = useState<string | null>(null);

  const categories = useMemo(() => {
    const set = new Set(allProducts.map((p) => p.category));
    return Array.from(set);
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }

    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    if (selectedFinish.length > 0) {
      result = result.filter((p) => selectedFinish.includes(p.finish));
    }

    const weightG = (w: string) => {
      const match = w.match(/[\d.]+/);
      return match ? parseFloat(match[0]) * (w.includes("kg") ? 1000 : 1) : 0;
    };
    result = result.filter((p) => {
      const w = weightG(p.weight);
      return w >= weightRange[0] && w <= weightRange[1];
    });

    if (inStockOnly) {
      result = result.filter((p) => p.stock > 0);
    }

    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name-az":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "best-selling":
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case "newest":
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return result;
  }, [searchQuery, selectedCategories, priceRange, selectedFinish, weightRange, inStockOnly, sortBy]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedCategories.length > 0) params.set("category", selectedCategories.join(","));
    const qs = params.toString();
    router.replace(`/products${qs ? `?${qs}` : ""}`, { scroll: false });
  }, [searchQuery, selectedCategories, router]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const toggleFinish = (finish: string) => {
    setSelectedFinish((prev) =>
      prev.includes(finish) ? prev.filter((f) => f !== finish) : [...prev, finish]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 20000]);
    setSelectedFinish([]);
    setWeightRange([0, 5000]);
    setInStockOnly(false);
    setSearchQuery("");
  };

  const handleAddToCart = useCallback(
    (product: (typeof allProducts)[0]) => {
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity: 1,
        stock: product.stock,
        material: product.material,
      });
      setAddedToCart(product.id);
      setTimeout(() => setAddedToCart(null), 2000);
    },
    [addItem]
  );

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedFinish.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 20000 ||
    weightRange[0] > 0 ||
    weightRange[1] < 5000 ||
    inStockOnly;

  const FilterSidebar = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg font-semibold text-primary">Filters</h3>
        {hasActiveFilters && (
          <button onClick={clearFilters} className="text-xs text-secondary hover:text-accent transition-colors">
            Clear All
          </button>
        )}
      </div>

      <div>
        <h4 className="text-sm font-semibold text-primary mb-3">Category</h4>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center gap-3 cursor-pointer group">
              <div
                className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                  selectedCategories.includes(cat)
                    ? "bg-secondary border-secondary"
                    : "border-gray-300 group-hover:border-secondary"
                }`}
                onClick={() => toggleCategory(cat)}
              >
                {selectedCategories.includes(cat) && <Check className="w-3 h-3 text-white" />}
              </div>
              <span className="text-sm text-gray-700 group-hover:text-primary transition-colors">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="text-sm font-semibold text-primary mb-3">Price Range</h4>
        <div className="px-1">
          <Slider
            value={priceRange}
            onValueChange={(v) => setPriceRange(v as [number, number])}
            max={20000}
            step={100}
            minStepsBetweenThumbs={1}
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-500">{formatPrice(priceRange[0])}</span>
          <span className="text-xs text-gray-500">{formatPrice(priceRange[1])}</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Input
            type="number"
            value={priceRange[0]}
            onChange={(e) => setPriceRange([Math.max(0, Number(e.target.value)), priceRange[1]])}
            className="h-8 text-xs"
          />
          <span className="text-gray-400">—</span>
          <Input
            type="number"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Math.min(20000, Number(e.target.value))])}
            className="h-8 text-xs"
          />
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="text-sm font-semibold text-primary mb-3">Finish</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {allFinishes.map((finish) => (
            <label key={finish} className="flex items-center gap-3 cursor-pointer group">
              <div
                className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                  selectedFinish.includes(finish)
                    ? "bg-secondary border-secondary"
                    : "border-gray-300 group-hover:border-secondary"
                }`}
                onClick={() => toggleFinish(finish)}
              >
                {selectedFinish.includes(finish) && <Check className="w-3 h-3 text-white" />}
              </div>
              <span className="text-sm text-gray-700 group-hover:text-primary transition-colors">{finish}</span>
            </label>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="text-sm font-semibold text-primary mb-3">Weight</h4>
        <div className="px-1">
          <Slider
            value={weightRange}
            onValueChange={(v) => setWeightRange(v as [number, number])}
            max={5000}
            step={50}
            minStepsBetweenThumbs={1}
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-500">{weightRange[0]}g</span>
          <span className="text-xs text-gray-500">{weightRange[1]}g</span>
        </div>
      </div>

      <Separator />

      <label className="flex items-center gap-3 cursor-pointer group">
        <div
          className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
            inStockOnly ? "bg-secondary border-secondary" : "border-gray-300 group-hover:border-secondary"
          }`}
          onClick={() => setInStockOnly(!inStockOnly)}
        >
          {inStockOnly && <Check className="w-3 h-3 text-white" />}
        </div>
        <span className="text-sm text-gray-700 group-hover:text-primary transition-colors">In Stock Only</span>
      </label>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F7F2E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-secondary transition-colors">
            Home
          </Link>
          <ChevronDown className="w-3 h-3 -rotate-90" />
          <span className="text-primary font-medium">Products</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-4xl md:text-5xl text-primary">All Products</h1>
            <p className="text-gray-500 mt-1">{filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full sm:w-64 bg-white"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden"
              onClick={() => setFilterOpen(true)}
            >
              <SlidersHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex gap-8">
          <aside className="hidden lg:block w-72 shrink-0 bg-white rounded-lg p-6 shadow-sm border border-border/50 h-fit sticky top-24">
            <FilterSidebar />
          </aside>

          {filterOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/40" onClick={() => setFilterOpen(false)} />
              <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-[#F7F2E8] shadow-xl overflow-y-auto">
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <h2 className="font-heading text-lg font-semibold text-primary">Filters</h2>
                  <button onClick={() => setFilterOpen(false)} className="p-1 hover:bg-primary/5 rounded">
                    <X className="w-5 h-5 text-primary" />
                  </button>
                </div>
                <div className="p-4">
                  <FilterSidebar />
                </div>
              </div>
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-secondary hover:text-accent transition-colors flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Clear Filters
                </button>
              )}
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-xs text-gray-500">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-44 bg-white h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/5 flex items-center justify-center">
                  <Search className="w-8 h-8 text-primary/40" />
                </div>
                <h3 className="font-heading text-xl text-primary mb-2">No products found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => {
                  const inWishlist = wishlist.includes(product.id);
                  const isAdded = addedToCart === product.id;

                  return (
                    <div
                      key={product.id}
                      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-border/50 flex flex-col"
                    >
                      <Link href={`/products/${product.id}`} className="relative aspect-square overflow-hidden bg-gray-50">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {product.comparePrice && (
                          <Badge variant="accent" className="absolute top-3 left-3 text-xs px-2 py-0.5">
                            {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
                          </Badge>
                        )}
                        {product.isNew && !product.comparePrice && (
                          <Badge variant="info" className="absolute top-3 left-3 text-xs px-2 py-0.5">
                            New
                          </Badge>
                        )}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            toggleWishlist(product.id);
                          }}
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors shadow-sm"
                        >
                          <Heart
                            className={`w-4 h-4 transition-colors ${
                              inWishlist ? "fill-red-500 text-red-500" : "text-gray-400"
                            }`}
                          />
                        </button>
                      </Link>
                      <div className="p-4 flex flex-col flex-1">
                        <Link href={`/products/${product.id}`}>
                          <Badge variant="secondary" className="text-[10px] px-2 py-0.5 mb-2">
                            {product.category}
                          </Badge>
                          <h3 className="font-heading text-base font-semibold text-primary leading-tight mb-1 group-hover:text-secondary transition-colors">
                            {product.name}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-1 mb-2">
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < Math.floor(product.rating)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-200"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-400">({product.reviewCount})</span>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="font-heading text-lg font-bold text-secondary">{formatPrice(product.price)}</span>
                          {product.comparePrice && (
                            <span className="text-sm text-gray-400 line-through">{formatPrice(product.comparePrice)}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400 mb-4">
                          <span>{product.weight}</span>
                          <span>·</span>
                          <span>{product.finish}</span>
                        </div>
                        <div className="mt-auto">
                          <Button
                            className="w-full gap-2"
                            variant={isAdded ? "accent" : "default"}
                            size="sm"
                            onClick={() => handleAddToCart(product)}
                            disabled={product.stock === 0}
                          >
                            {isAdded ? (
                              <>
                                <Check className="w-4 h-4" />
                                Added
                              </>
                            ) : (
                              <>
                                <ShoppingBag className="w-4 h-4" />
                                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Separator() {
  return <div className="h-px bg-border/60 my-6" />;
}
