export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
}

export interface TrackingEvent {
  status: string;
  location: string;
  date: string;
  time: string;
  description: string;
}

export interface Order {
  id: string;
  orderId: string;
  items: OrderItem[];
  total: number;
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  couponCode?: string;
  gst: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  shippingAddress: {
    name: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  tracking: TrackingEvent[];
  estimatedDelivery: string;
  deliveredDate?: string;
  invoiceUrl?: string;
  createdAt: string;
}

export const orders: Order[] = [
  {
    id: "ORD-001",
    orderId: "AJJ2A3B4C5D6E",
    items: [
      {
        productId: "BR-001",
        name: "Navratna Brass Kalash",
        image: "https://images.unsplash.com/photo-1606938076010-ec4250e9e4bf?w=200",
        quantity: 1,
        price: 5499,
      },
      {
        productId: "BR-002",
        name: "Annapurna Brass Diya",
        image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200",
        quantity: 2,
        price: 1299,
      },
    ],
    total: 8396,
    subtotal: 8097,
    deliveryCharge: 0,
    discount: 0,
    gst: 1457,
    status: "delivered",
    paymentMethod: "Razorpay UPI",
    paymentStatus: "paid",
    shippingAddress: {
      name: "Rajesh Sharma",
      phone: "+91 98765 43210",
      street: "42, Green Park Colony",
      city: "Jaipur",
      state: "Rajasthan",
      pincode: "302001",
    },
    tracking: [
      { status: "placed", location: "Jaipur", date: "10 Dec 2025", time: "14:30", description: "Order placed successfully" },
      { status: "confirmed", location: "Jaipur", date: "10 Dec 2025", time: "16:45", description: "Order confirmed by seller" },
      { status: "packed", location: "Jaipur", date: "11 Dec 2025", time: "11:20", description: "Product packed and quality checked" },
      { status: "shipped", location: "Jaipur", date: "12 Dec 2025", time: "09:15", description: "Shipped via Shiprocket - Track ID: SHIP123456" },
      { status: "in-transit", location: "Delhi Hub", date: "13 Dec 2025", time: "22:40", description: "Reached Delhi sorting center" },
      { status: "out-for-delivery", location: "Jaipur", date: "14 Dec 2025", time: "07:30", description: "Out for delivery" },
      { status: "delivered", location: "Jaipur", date: "14 Dec 2025", time: "13:15", description: "Delivered - Received by Rajesh Sharma" },
    ],
    estimatedDelivery: "15 Dec 2025",
    deliveredDate: "14 Dec 2025",
    invoiceUrl: "#",
    createdAt: "2025-12-10T14:30:00Z",
  },
  {
    id: "ORD-002",
    orderId: "AJJ7F8G9H0I1J",
    items: [
      {
        productId: "BR-007",
        name: "Brass Singing Bowl",
        image: "https://images.unsplash.com/photo-1618172193622-ae2d025f4032?w=200",
        quantity: 1,
        price: 3499,
      },
    ],
    total: 3499,
    subtotal: 3499,
    deliveryCharge: 0,
    discount: 0,
    gst: 630,
    status: "shipped",
    paymentMethod: "COD",
    paymentStatus: "pending",
    shippingAddress: {
      name: "Priya Patel",
      phone: "+91 98765 43210",
      street: "15, Sunrise Apartments",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
    },
    tracking: [
      { status: "placed", location: "Mumbai", date: "18 Dec 2025", time: "10:15", description: "Order placed" },
      { status: "confirmed", location: "Mumbai", date: "18 Dec 2025", time: "12:30", description: "Order confirmed" },
      { status: "packed", location: "Jaipur", date: "19 Dec 2025", time: "16:00", description: "Product packed" },
      { status: "shipped", location: "Jaipur", date: "20 Dec 2025", time: "11:45", description: "Shipped via Shiprocket" },
    ],
    estimatedDelivery: "24 Dec 2025",
    createdAt: "2025-12-18T10:15:00Z",
  },
  {
    id: "ORD-003",
    orderId: "AJJ2K3L4M5N6O",
    items: [
      {
        productId: "BR-005",
        name: "Brass Ganesha Figurine",
        image: "https://images.unsplash.com/photo-1618172193622-ae2d025f4032?w=200",
        quantity: 1,
        price: 3999,
      },
    ],
    total: 3999,
    subtotal: 3999,
    deliveryCharge: 0,
    discount: 0,
    gst: 720,
    status: "confirmed",
    paymentMethod: "Razorpay Card",
    paymentStatus: "paid",
    shippingAddress: {
      name: "Amit Kumar",
      phone: "+91 98765 43210",
      street: "7B, Lake View Road",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560001",
    },
    tracking: [
      { status: "placed", location: "Bangalore", date: "21 Dec 2025", time: "09:00", description: "Order placed" },
      { status: "confirmed", location: "Bangalore", date: "21 Dec 2025", time: "11:20", description: "Order confirmed" },
    ],
    estimatedDelivery: "28 Dec 2025",
    createdAt: "2025-12-21T09:00:00Z",
  },
];

export interface CustomOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  productType: string;
  description: string;
  dimensions: string;
  weight: string;
  finish: string;
  quantity: number;
  referenceImage: string;
  engravingText: string;
  requirements: string;
  status: "pending" | "quote-sent" | "accepted" | "paid" | "in-production" | "shipped" | "delivered";
  sellerQuote?: number;
  quoteNote?: string;
  quoteSentAt?: string;
  productionStages: { name: string; status: "completed" | "in-progress" | "pending"; date?: string }[];
  createdAt: string;
}

export const customOrders: CustomOrder[] = [
  {
    id: "CUST-001",
    customerName: "Vikram Singh",
    customerEmail: "vikram@example.com",
    customerPhone: "+91 98765 43210",
    productType: "Custom Brass Idol",
    description: "I need a custom brass idol of Lord Shiva in meditation pose, approximately 18 inches tall with intricate details on the crown and jewelry.",
    dimensions: "18 x 12 x 10 inches",
    weight: "5-6 kg",
    finish: "Antique Gold Polish",
    quantity: 1,
    referenceImage: "",
    engravingText: "Om Namah Shivaya",
    requirements: "Need it before Mahashivratri. Should have detailed crown, third eye, and snake around neck. Sitting on brass meditation platform.",
    status: "in-production",
    sellerQuote: 45000,
    quoteNote: "Premium pricing due to intricate crown work and size. Includes wooden base.",
    quoteSentAt: "2025-12-05T10:30:00Z",
    productionStages: [
      { name: "Material Sourcing", status: "completed", date: "08 Dec 2025" },
      { name: "Crafting", status: "completed", date: "15 Dec 2025" },
      { name: "Polishing", status: "in-progress" },
      { name: "Quality Control", status: "pending" },
      { name: "Ready for Dispatch", status: "pending" },
    ],
    createdAt: "2025-12-01T14:00:00Z",
  },
  {
    id: "CUST-002",
    customerName: "Ananya Gupta",
    customerEmail: "ananya@example.com",
    customerPhone: "+91 98765 43210",
    productType: "Custom Brass Decorative",
    description: "I want a custom brass peacock lamp with fiber optic lights integrated into the tail feathers. Table-top size.",
    dimensions: "15 x 15 x 24 inches",
    weight: "2-3 kg",
    finish: "Gold Polish with Matte Accents",
    quantity: 2,
    referenceImage: "",
    engravingText: "",
    requirements: "Should have fiber optic lights in tail feathers that can change colors. Remote controlled lighting preferred. Brass base should be heavy enough for stability.",
    status: "quote-sent",
    sellerQuote: 28500,
    quoteNote: "Quote per piece. Lighting mechanism adds to cost. Remote control included.",
    quoteSentAt: "2025-12-20T15:00:00Z",
    productionStages: [
      { name: "Material Sourcing", status: "pending" },
      { name: "Crafting", status: "pending" },
      { name: "Polishing", status: "pending" },
      { name: "Quality Control", status: "pending" },
      { name: "Ready for Dispatch", status: "pending" },
    ],
    createdAt: "2025-12-18T11:00:00Z",
  },
];
