export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: "customer" | "seller";
  createdAt: string;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  type: "home" | "work" | "other";
}

export const currentUser: User = {
  id: "USR-001",
  name: "Rajesh Sharma",
  email: "rajesh@example.com",
  phone: "+91 98765 43210",
  avatar: "https://ui-avatars.com/api/?name=Rajesh+Sharma&background=0B2D1F&color=C9A86A&size=200",
  role: "customer",
  createdAt: "2025-06-01",
};

export const savedAddresses: Address[] = [
  {
    id: "addr-001",
    name: "Rajesh Sharma",
    phone: "+91 98765 43210",
    street: "42, Green Park Colony, Near City Mall",
    city: "Jaipur",
    state: "Rajasthan",
    pincode: "302001",
    isDefault: true,
    type: "home",
  },
  {
    id: "addr-002",
    name: "Rajesh Sharma",
    phone: "+91 98765 43210",
    street: "5th Floor, B-wing, Silver Business Park",
    city: "Jaipur",
    state: "Rajasthan",
    pincode: "302016",
    isDefault: false,
    type: "work",
  },
];

export const recentlyViewed = ["BR-001", "BR-007", "BR-005", "BR-016"];
