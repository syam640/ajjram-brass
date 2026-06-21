"use client";

import { useState } from "react";
import { reviews as allReviews } from "@/data/reviews";
import { products } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, Search, CheckCircle, MessageSquare, ThumbsUp, Flag, Filter } from "lucide-react";
import { formatDate, getInitials } from "@/lib/utils";

export default function SellerReviewsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [replied, setReplied] = useState<Record<string, boolean>>({});

  const filteredReviews = allReviews.filter((r) =>
    r.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.comment.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleReply = (reviewId: string) => {
    if (replyText[reviewId]?.trim()) {
      setReplied((prev) => ({ ...prev, [reviewId]: true }));
      setReplyText((prev) => ({ ...prev, [reviewId]: "" }));
    }
  };

  const getProductName = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    return product?.name || "Unknown Product";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-primary">Reviews</h1>
          <p className="text-sm text-muted mt-1">{allReviews.length} total reviews</p>
        </div>
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <Input
            placeholder="Search reviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredReviews.map((review) => {
          const product = products.find((p) => p.id === review.productId);
          return (
            <div key={review.id} className="bg-white rounded-lg border border-border p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-border">
                    <AvatarFallback className="text-sm bg-primary/5 text-primary">
                      {getInitials(review.userName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm text-primary">{review.userName}</p>
                    <p className="text-xs text-muted">{formatDate(review.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {review.isVerifiedPurchase && (
                    <Badge variant="success" className="text-[10px] flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" /> Verified
                    </Badge>
                  )}
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${i < review.rating ? "text-accent fill-accent" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <p className="text-xs text-muted mb-1">Product: <span className="text-primary font-medium">{getProductName(review.productId)}</span></p>
                <h4 className="font-medium text-primary mb-1">{review.title}</h4>
                <p className="text-sm text-text leading-relaxed">{review.comment}</p>
              </div>

              {review.images.length > 0 && (
                <div className="flex gap-2 mb-4">
                  {review.images.map((img, i) => (
                    <div key={i} className="w-16 h-16 rounded-md bg-background overflow-hidden">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-4 text-xs text-muted mb-4">
                <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> {review.helpfulCount} found helpful</span>
              </div>

              <Separator className="mb-4" />

              {replied[review.id] ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-xs text-green-700 font-medium mb-1">Your reply:</p>
                  <p className="text-sm text-green-800">{replyText[review.id]}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <textarea
                    placeholder="Write a reply to this review..."
                    value={replyText[review.id] || ""}
                    onChange={(e) => setReplyText((prev) => ({ ...prev, [review.id]: e.target.value }))}
                    className="w-full border border-border rounded-lg p-3 text-sm resize-none focus:outline-none focus:border-primary/30 transition-colors"
                    rows={2}
                  />
                  <div className="flex justify-end">
                    <Button size="sm" onClick={() => handleReply(review.id)} disabled={!replyText[review.id]?.trim()}>
                      <MessageSquare className="h-4 w-4 mr-1" /> Reply
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredReviews.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="h-12 w-12 text-muted mx-auto mb-4" />
          <p className="text-muted">No reviews found matching your search.</p>
        </div>
      )}
    </div>
  );
}
