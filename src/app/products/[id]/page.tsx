"use client";

import { use, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { products, getProductById, getProductsByCategory } from "@/data/products";
import { reviews as allReviews } from "@/data/reviews";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Heart,
  ShoppingBag,
  Share2,
  Star,
  Truck,
  Shield,
  Check,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  MapPin,
  Bell,
  MessageCircle,
  Mail,
  Minus,
  Plus,
  Copy,
} from "lucide-react";
import { formatPrice, getInitials, formatDate } from "@/lib/utils";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const product = getProductById(params.id as string);
  const { addItem } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const { isLoggedIn } = useAuth();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "specifications" | "reviews" | "custom">("description");
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [pincode, setPincode] = useState("");
  const [pincodeChecked, setPincodeChecked] = useState(false);
  const [pincodeAvailable, setPincodeAvailable] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [notifyMsg, setNotifyMsg] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F7F2E8] flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-3xl text-primary mb-4">Product Not Found</h1>
          <p className="text-gray-500 mb-6">The product you are looking for does not exist.</p>
          <Link href="/products">
            <Button variant="outline">Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const inWishlist = wishlist.includes(product.id);
  const relatedProducts = getProductsByCategory(product.categorySlug).filter((p) => p.id !== product.id);
  const productReviews = allReviews.filter((r) => r.productId === product.id);
  const avgRating =
    productReviews.length > 0
      ? productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length
      : 0;
  const inStock = product.stock > 0;

  const handleAddToCart = () => {
    if (!inStock) return;
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity,
      stock: product.stock,
      material: product.material,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity,
      stock: product.stock,
      material: product.material,
    });
    router.push("/checkout");
  };

  const handlePincodeCheck = () => {
    if (pincode.length === 6) {
      setPincodeAvailable(pincode.startsWith("1") || pincode.startsWith("2") || pincode.startsWith("4"));
      setPincodeChecked(true);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleZoom = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  const specs = [
    { label: "Material", value: product.material },
    { label: "Weight", value: product.weight },
    { label: "Dimensions", value: product.dimensions },
    { label: "Finish", value: product.finish },
    { label: "HSN Code", value: product.hsnCode },
    { label: "GST Rate", value: `${product.gstRate}%` },
  ];

  return (
    <div className="min-h-screen bg-[#F7F2E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
          <Link href="/" className="hover:text-secondary transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/products" className="hover:text-secondary transition-colors">
            Products
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link
            href={`/products?category=${product.category}`}
            className="hover:text-secondary transition-colors"
          >
            {product.category}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-primary font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          <div className="space-y-4">
            <div
              className="relative aspect-square rounded-xl overflow-hidden bg-white border border-border/50 cursor-crosshair group"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleZoom}
            >
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className={`w-full h-full object-cover transition-transform duration-200 ${
                  isZoomed ? "scale-150" : ""
                }`}
                style={
                  isZoomed
                    ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` }
                    : undefined
                }
              />
              {!isZoomed && (
                <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
                  <ZoomIn className="w-4 h-4 text-gray-500" />
                </div>
              )}
              {product.comparePrice && (
                <Badge variant="accent" className="absolute top-4 left-4 text-sm px-3 py-1">
                  {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
                </Badge>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      i === selectedImage
                        ? "border-secondary shadow-sm"
                        : "border-transparent hover:border-gray-200"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-3">
                {product.category}
              </Badge>
              <h1 className="font-heading text-3xl md:text-4xl text-primary leading-tight">
                {product.name}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : i < product.rating
                          ? "fill-yellow-300 text-yellow-300"
                          : "text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {product.rating.toFixed(1)} ({product.reviewCount} reviews)
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="font-heading text-3xl font-bold text-secondary">
                {formatPrice(product.price)}
              </span>
              {product.comparePrice && (
                <span className="text-lg text-gray-400 line-through">
                  {formatPrice(product.comparePrice)}
                </span>
              )}
              <span className="text-xs text-gray-400">+ {product.gstRate}% GST</span>
            </div>

            <p className="text-gray-600 leading-relaxed">{product.shortDescription}</p>

            <div className="bg-white rounded-lg p-4 border border-border/50">
              <h3 className="text-sm font-semibold text-primary mb-3">Specifications</h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                {specs.slice(0, 4).map((spec) => (
                  <div key={spec.label} className="flex justify-between text-sm">
                    <span className="text-gray-500">{spec.label}</span>
                    <span className="text-primary font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center border border-border rounded-lg bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-primary/5 transition-colors rounded-l-lg"
                >
                  <Minus className="w-4 h-4 text-primary" />
                </button>
                <span className="w-12 text-center text-sm font-medium text-primary">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-primary/5 transition-colors rounded-r-lg"
                >
                  <Plus className="w-4 h-4 text-primary" />
                </button>
              </div>

              <div className="flex-1 flex gap-3">
                {inStock ? (
                  <>
                    <Button
                      className="flex-1 gap-2"
                      size="lg"
                      onClick={handleAddToCart}
                    >
                      {addedToCart ? (
                        <>
                          <Check className="w-5 h-5" />
                          Added to Cart
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-5 h-5" />
                          Add to Cart
                        </>
                      )}
                    </Button>
                    <Button variant="secondary" size="lg" className="flex-1 gap-2" onClick={handleBuyNow}>
                      Buy Now
                    </Button>
                  </>
                ) : (
                  <Button
                    className="flex-1 gap-2"
                    size="lg"
                    variant="outline"
                    onClick={() => setNotifyMsg(true)}
                  >
                    <Bell className="w-5 h-5" />
                    {notifyMsg ? "We'll notify you!" : "Notify Me When Available"}
                  </Button>
                )}
              </div>

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center transition-all ${
                  inWishlist
                    ? "border-red-200 bg-red-50"
                    : "border-border hover:border-red-200 hover:bg-red-50"
                }`}
              >
                <Heart
                  className={`w-5 h-5 ${
                    inWishlist ? "fill-red-500 text-red-500" : "text-gray-400"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-secondary" />
                <span>Free Delivery | Delivery in 5-7 days</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-secondary" />
                <span>Secure Payment</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-border/50">
              <h3 className="text-sm font-semibold text-primary mb-3">
                <MapPin className="w-4 h-4 inline mr-1.5 text-secondary" />
                Check Delivery Availability
              </h3>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter pincode"
                  value={pincode}
                  onChange={(e) => {
                    setPincode(e.target.value.replace(/\D/g, "").slice(0, 6));
                    setPincodeChecked(false);
                  }}
                  className="max-w-40 bg-white"
                />
                <Button variant="outline" size="sm" onClick={handlePincodeCheck}>
                  Check
                </Button>
              </div>
              {pincodeChecked && (
                <div
                  className={`flex items-center gap-1.5 mt-2 text-sm ${
                    pincodeAvailable ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {pincodeAvailable ? (
                    <>
                      <Check className="w-4 h-4" />
                      Available! Delivery in 5-7 days
                    </>
                  ) : (
                    <>
                      <X className="w-4 h-4" />
                      Not available at this pincode
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="relative">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">Share:</span>
                <button
                  onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(product.name + " - " + window.location.href)}`, "_blank")}
                  className="w-8 h-8 rounded-full bg-green-50 hover:bg-green-100 flex items-center justify-center transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-green-600" />
                </button>
                <button
                  onClick={() => window.open(`mailto:?subject=${encodeURIComponent(product.name)}&body=${encodeURIComponent("Check out this product: " + window.location.href)}`)}
                  className="w-8 h-8 rounded-full bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition-colors"
                >
                  <Mail className="w-4 h-4 text-blue-600" />
                </button>
                <button
                  onClick={handleCopyLink}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-600" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <div className="flex border-b border-border overflow-x-auto">
            {(["description", "specifications", "reviews", "custom"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
                  activeTab === tab
                    ? "border-secondary text-secondary"
                    : "border-transparent text-gray-500 hover:text-primary"
                }`}
              >
                {tab === "description" && "Description"}
                {tab === "specifications" && "Specifications"}
                {tab === "reviews" && `Reviews (${productReviews.length})`}
                {tab === "custom" && "Custom Orders"}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-b-lg p-6 md:p-8 border border-t-0 border-border/50">
            {activeTab === "description" && (
              <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed">
                <p>{product.description}</p>
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {product.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="justify-center capitalize">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "specifications" && (
              <div className="max-w-2xl">
                <table className="w-full">
                  <tbody>
                    {specs.map((spec, i) => (
                      <tr key={spec.label} className={i % 2 === 0 ? "bg-primary/5" : ""}>
                        <td className="py-3 px-4 text-sm text-gray-500 font-medium w-40">{spec.label}</td>
                        <td className="py-3 px-4 text-sm text-primary">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                {productReviews.length > 0 ? (
                  <>
                    <div className="flex items-center gap-4 mb-6 p-4 bg-primary/5 rounded-lg">
                      <div className="text-center">
                        <span className="font-heading text-4xl font-bold text-primary">
                          {avgRating.toFixed(1)}
                        </span>
                        <div className="flex items-center gap-0.5 mt-1 justify-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(avgRating)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">{productReviews.length} reviews</span>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {productReviews.map((review) => (
                        <div key={review.id} className="border-b border-border/50 pb-6 last:border-0 last:pb-0">
                          <div className="flex items-start gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback>{getInitials(review.userName)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-medium text-primary">{review.userName}</span>
                                {review.isVerifiedPurchase && (
                                  <Badge variant="success" className="text-[10px] px-1.5 py-0">
                                    <Check className="w-2.5 h-2.5 mr-0.5" />
                                    Verified
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <div className="flex">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-3.5 h-3.5 ${
                                        i < review.rating
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-gray-200"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-xs text-gray-400">{formatDate(review.createdAt)}</span>
                              </div>
                              <h4 className="text-sm font-semibold text-primary mt-2">{review.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{review.comment}</p>
                              <div className="flex items-center gap-4 mt-2">
                                <span className="text-xs text-gray-400">
                                  {review.helpfulCount} people found this helpful
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <Star className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <h3 className="font-heading text-lg text-primary mb-1">No reviews yet</h3>
                    <p className="text-sm text-gray-500">Be the first to review this product</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "custom" && (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/10 flex items-center justify-center">
                  <MessageCircle className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="font-heading text-2xl text-primary mb-2">Need a Custom Order?</h3>
                <p className="text-gray-500 max-w-lg mx-auto mb-6">
                  We specialize in custom brass items for temples, hotels, gurudwaras, and corporate gifts.
                  Share your requirements and our team will create the perfect piece for you.
                </p>
                <Link href="/custom-order">
                  <Button variant="accent" size="lg" className="gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Request Custom Quote
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mb-12">
            <h2 className="font-heading text-2xl md:text-3xl text-primary mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((rp) => (
                <Link
                  key={rp.id}
                  href={`/products/${rp.id}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-border/50"
                >
                  <div className="aspect-square overflow-hidden bg-gray-50">
                    <img
                      src={rp.images[0]}
                      alt={rp.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <Badge variant="secondary" className="text-[10px] px-2 py-0.5 mb-2">
                      {rp.category}
                    </Badge>
                    <h3 className="font-heading text-sm font-semibold text-primary leading-tight group-hover:text-secondary transition-colors">
                      {rp.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-heading text-base font-bold text-secondary">
                        {formatPrice(rp.price)}
                      </span>
                      {rp.comparePrice && (
                        <span className="text-xs text-gray-400 line-through">{formatPrice(rp.comparePrice)}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mb-12">
          <h2 className="font-heading text-2xl md:text-3xl text-primary mb-6">Recently Viewed</h2>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {products.slice(0, 4).map((rv) => (
              <Link
                key={rv.id}
                href={`/products/${rv.id}`}
                className="group min-w-[200px] bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-border/50 shrink-0"
              >
                <div className="aspect-square overflow-hidden bg-gray-50">
                  <img
                    src={rv.images[0]}
                    alt={rv.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-heading text-xs font-semibold text-primary leading-tight group-hover:text-secondary transition-colors">
                    {rv.name}
                  </h3>
                  <span className="font-heading text-sm font-bold text-secondary mt-1 block">
                    {formatPrice(rv.price)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function X({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
