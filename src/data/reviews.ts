export interface Review {
  id: string;
  productId: string;
  userName: string;
  userImage?: string;
  rating: number;
  title: string;
  comment: string;
  images: string[];
  isVerifiedPurchase: boolean;
  createdAt: string;
  helpfulCount: number;
}

export const reviews: Review[] = [
  {
    id: "rev-001",
    productId: "BR-001",
    userName: "Rajesh Sharma",
    userImage: "https://ui-avatars.com/api/?name=Rajesh+Sharma&background=0B2D1F&color=C9A86A&size=200",
    rating: 5,
    title: "Exquisite craftsmanship",
    comment: "Absolutely stunning piece! The gemstones are beautifully set and the brass work is top-notch. Perfect for our home temple. Worth every penny!",
    images: ["https://images.unsplash.com/photo-1606938076010-ec4250e9e4bf?w=400"],
    isVerifiedPurchase: true,
    createdAt: "2025-11-15",
    helpfulCount: 23,
  },
  {
    id: "rev-002",
    productId: "BR-001",
    userName: "Priya Patel",
    userImage: "https://ui-avatars.com/api/?name=Priya+Patel&background=B08D57&color=ffffff&size=200",
    rating: 4,
    title: "Beautiful but slightly heavy",
    comment: "The kalash is gorgeous and exactly as shown. Quality is excellent. Only minor issue is it's a bit heavier than expected, but that shows the quality brass used.",
    images: ["https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400"],
    isVerifiedPurchase: true,
    createdAt: "2025-11-20",
    helpfulCount: 12,
  },
  {
    id: "rev-003",
    productId: "BR-001",
    userName: "Amit Verma",
    userImage: "https://ui-avatars.com/api/?name=Amit+Verma&background=1a4a3a&color=C9A86A&size=200",
    rating: 5,
    title: "Perfect for Diwali puja",
    comment: "Bought this for Diwali and it was the centerpiece of our decoration. Everyone complemented it. The gold polish is magnificent!",
    images: [],
    isVerifiedPurchase: true,
    createdAt: "2025-11-10",
    helpfulCount: 31,
  },
  {
    id: "rev-004",
    productId: "BR-003",
    userName: "Sunita Reddy",
    userImage: "https://ui-avatars.com/api/?name=Sunita+Reddy&background=C9A86A&color=ffffff&size=200",
    rating: 5,
    title: "Divine idol for our home",
    comment: "The Lakshmi-Ganesh idol is absolutely beautiful. The detailing on the jewelry and crowns is remarkable. It has brought so much positivity to our home.",
    images: ["https://images.unsplash.com/photo-1618172193622-ae2d025f4032?w=400"],
    isVerifiedPurchase: true,
    createdAt: "2025-10-25",
    helpfulCount: 18,
  },
  {
    id: "rev-005",
    productId: "BR-007",
    userName: "Arjun Nair",
    userImage: "https://ui-avatars.com/api/?name=Arjun+Nair&background=0B2D1F&color=ffffff&size=200",
    rating: 5,
    title: "Amazing sound quality",
    comment: "The singing bowl produces the most beautiful resonant tones. Perfect for my meditation practice. The included striker and cushion are high quality too.",
    images: [],
    isVerifiedPurchase: true,
    createdAt: "2025-12-01",
    helpfulCount: 8,
  },
  {
    id: "rev-006",
    productId: "BR-005",
    userName: "Meera Kapoor",
    userImage: "https://ui-avatars.com/api/?name=Meera+Kapoor&background=B08D57&color=0B2D1F&size=200",
    rating: 4,
    title: "Beautiful Ganesha",
    comment: "Very well crafted Ganesha figurine. The details on the trunk and ears are impressive. Slightly smaller than I expected but still a great piece.",
    images: [],
    isVerifiedPurchase: true,
    createdAt: "2025-11-05",
    helpfulCount: 15,
  },
  {
    id: "rev-007",
    productId: "BR-009",
    userName: "Deepak Joshi",
    userImage: "https://ui-avatars.com/api/?name=Deepak+Joshi&background=1a4a3a&color=ffffff&size=200",
    rating: 5,
    title: "Traditional quality",
    comment: "The brass pitcher keeps water perfectly cool. The copper coating inside is an added bonus. Brings back memories of my grandmother's house!",
    images: [],
    isVerifiedPurchase: true,
    createdAt: "2025-10-15",
    helpfulCount: 20,
  },
  {
    id: "rev-008",
    productId: "BR-016",
    userName: "Krishna Menon",
    userImage: "https://ui-avatars.com/api/?name=Krishna+Menon&background=C9A86A&color=0B2D1F&size=200",
    rating: 5,
    title: "Powerful Hanuman idol",
    comment: "This Hanuman idol radiates positive energy. The gada details and the standing posture are perfectly executed. Must-have for any spiritual home.",
    images: [],
    isVerifiedPurchase: true,
    createdAt: "2025-10-05",
    helpfulCount: 28,
  },
];
