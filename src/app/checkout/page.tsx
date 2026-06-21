"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { savedAddresses, type Address } from "@/data/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Plus,
  CreditCard,
  Wallet,
  Building2,
  Truck,
  Check,
  ChevronRight,
  ArrowLeft,
  Loader2,
  Smartphone,
} from "lucide-react";
import { formatPrice, generateOrderId } from "@/lib/utils";

interface NewAddress {
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
}

const emptyAddress: NewAddress = {
  name: "",
  phone: "",
  street: "",
  city: "",
  state: "",
  pincode: "",
};

type PaymentMethod = "upi" | "card" | "netbanking" | "cod";

const deliveryPincodes = ["302001", "302016", "302017", "302018", "302019", "302020", "302021", "302022", "400001", "560001", "110001"];

const banks = [
  "State Bank of India",
  "HDFC Bank",
  "ICICI Bank",
  "Axis Bank",
  "Kotak Mahindra",
  "Yes Bank",
  "Punjab National Bank",
  "Bank of Baroda",
];

export default function CheckoutPage() {
  const router = useRouter();
  const { state, getSubtotal, getTotal, clearCart } = useCart();
  const { user, isLoggedIn } = useAuth();

  const [email, setEmail] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState(
    savedAddresses.find((a) => a.isDefault)?.id || ""
  );
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState<NewAddress>(emptyAddress);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");
  const [upiId, setUpiId] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [pincodeCheck, setPincodeCheck] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState<"idle" | "available" | "unavailable">("idle");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");

  const [addresses, setAddresses] = useState<Address[]>(savedAddresses);

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  const subtotal = getSubtotal();
  const gst = subtotal * 0.18;
  const shipping = subtotal > 999 ? 0 : 149;
  const total = subtotal + gst + shipping - state.discount;

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

  const handleAddAddress = () => {
    const newAddr: Address = {
      id: "addr-" + Date.now(),
      name: newAddress.name,
      phone: newAddress.phone,
      street: newAddress.street,
      city: newAddress.city,
      state: newAddress.state,
      pincode: newAddress.pincode,
      isDefault: addresses.length === 0,
      type: "home",
    };
    setAddresses((prev) => [...prev, newAddr]);
    setSelectedAddressId(newAddr.id);
    setShowNewAddress(false);
    setNewAddress(emptyAddress);
  };

  const handlePincodeCheck = () => {
    if (deliveryPincodes.includes(pincodeCheck.trim())) {
      setPincodeStatus("available");
    } else {
      setPincodeStatus("unavailable");
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setOrderError("Please select a delivery address");
      return;
    }
    if (!email) {
      setOrderError("Please provide an email address");
      return;
    }

    setIsPlacingOrder(true);
    setOrderError("");

    await new Promise((r) => setTimeout(r, 2000));

    const paymentFailed = paymentMethod !== "cod" && Math.random() < 0.1;
    if (paymentFailed) {
      setIsPlacingOrder(false);
      setOrderError("Payment failed. Please try again.");
      return;
    }

    const orderId = generateOrderId();
    const order = {
      id: "ORD-" + Date.now(),
      orderId,
      items: state.items.map((item) => ({
        productId: item.productId,
        name: item.name,
        image: item.image,
        quantity: item.quantity,
        price: item.price,
      })),
      total,
      subtotal,
      deliveryCharge: shipping,
      discount: state.discount,
      couponCode: state.couponCode || undefined,
      gst: Math.round(gst),
      status: "confirmed",
      paymentMethod:
        paymentMethod === "upi"
          ? "UPI"
          : paymentMethod === "card"
          ? "Credit/Debit Card"
          : paymentMethod === "netbanking"
          ? "Net Banking"
          : "Cash on Delivery",
      paymentStatus: paymentMethod === "cod" ? "pending" : "paid",
      shippingAddress: {
        name: selectedAddress.name,
        phone: selectedAddress.phone,
        street: selectedAddress.street,
        city: selectedAddress.city,
        state: selectedAddress.state,
        pincode: selectedAddress.pincode,
      },
      tracking: [
        {
          status: "placed",
          location: selectedAddress.city,
          date: new Date().toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          time: new Date().toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          description: "Order placed successfully",
        },
        {
          status: "confirmed",
          location: selectedAddress.city,
          date: new Date().toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          time: new Date().toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          description: "Order confirmed by Ajjram Brass",
        },
      ],
      estimatedDelivery: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      notes: orderNotes,
      createdAt: new Date().toISOString(),
    };

    const existingOrders = JSON.parse(
      localStorage.getItem("ajjram-orders") || "[]"
    );
    existingOrders.unshift(order);
    localStorage.setItem("ajjram-orders", JSON.stringify(existingOrders));

    clearCart();

    router.push(`/orders/${orderId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <nav className="flex items-center gap-2 text-sm text-muted mb-8">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/cart" className="hover:text-primary transition-colors">
            Cart
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-primary font-medium">Checkout</span>
        </nav>

        <h1 className="font-heading text-4xl font-bold text-primary mb-8">
          Checkout
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 lg:w-[60%] space-y-8">
            <section className="bg-white rounded-lg border border-border p-6">
              <h2 className="font-heading text-xl font-bold text-primary mb-4">
                Contact Information
              </h2>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5"
                />
              </div>
            </section>

            <section className="bg-white rounded-lg border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading text-xl font-bold text-primary">
                  Delivery Address
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNewAddress(!showNewAddress)}
                  className="gap-1.5"
                >
                  <Plus className="h-4 w-4" />
                  Add New
                </Button>
              </div>

              <div className="space-y-3">
                {addresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedAddressId === addr.id
                        ? "border-secondary bg-secondary/5"
                        : "border-border hover:border-secondary/50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          selectedAddressId === addr.id
                            ? "border-secondary"
                            : "border-border"
                        }`}
                      >
                        {selectedAddressId === addr.id && (
                          <div className="w-3 h-3 rounded-full bg-secondary" />
                        )}
                      </div>
                      <input
                        type="radio"
                        name="address"
                        value={addr.id}
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                        className="sr-only"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-primary">
                            {addr.name}
                          </span>
                          <Badge
                            variant={
                              addr.type === "home" ? "default" : "secondary"
                            }
                            className="text-[10px] px-2 py-0"
                          >
                            {addr.type.charAt(0).toUpperCase() +
                              addr.type.slice(1)}
                          </Badge>
                          {addr.isDefault && (
                            <Badge
                              variant="outline"
                              className="text-[10px] px-2 py-0"
                            >
                              Default
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted mt-1">
                          {addr.street}, {addr.city}, {addr.state} -{" "}
                          {addr.pincode}
                        </p>
                        <p className="text-sm text-muted">{addr.phone}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              {showNewAddress && (
                <div className="mt-4 p-4 rounded-lg border border-border bg-secondary/5">
                  <h3 className="font-medium text-primary mb-4">
                    New Address
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="addr-name">Full Name</Label>
                      <Input
                        id="addr-name"
                        value={newAddress.name}
                        onChange={(e) =>
                          setNewAddress((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="addr-phone">Phone Number</Label>
                      <Input
                        id="addr-phone"
                        value={newAddress.phone}
                        onChange={(e) =>
                          setNewAddress((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        className="mt-1.5"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="addr-street">Street Address</Label>
                      <Input
                        id="addr-street"
                        value={newAddress.street}
                        onChange={(e) =>
                          setNewAddress((prev) => ({
                            ...prev,
                            street: e.target.value,
                          }))
                        }
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="addr-city">City</Label>
                      <Input
                        id="addr-city"
                        value={newAddress.city}
                        onChange={(e) =>
                          setNewAddress((prev) => ({
                            ...prev,
                            city: e.target.value,
                          }))
                        }
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="addr-state">State</Label>
                      <Input
                        id="addr-state"
                        value={newAddress.state}
                        onChange={(e) =>
                          setNewAddress((prev) => ({
                            ...prev,
                            state: e.target.value,
                          }))
                        }
                        className="mt-1.5"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="addr-pincode">Pincode</Label>
                      <div className="flex gap-2 mt-1.5">
                        <Input
                          id="addr-pincode"
                          value={newAddress.pincode}
                          onChange={(e) => {
                            setNewAddress((prev) => ({
                              ...prev,
                              pincode: e.target.value,
                            }));
                            setPincodeCheck(e.target.value);
                          }}
                          placeholder="Enter pincode to check delivery"
                        />
                        <Button
                          variant="outline"
                          onClick={handlePincodeCheck}
                          disabled={!pincodeCheck.trim()}
                        >
                          Check
                        </Button>
                      </div>
                      {pincodeStatus === "available" && (
                        <p className="text-sm text-green-600 mt-1.5 flex items-center gap-1">
                          <Check className="h-4 w-4" />
                          Delivery available at this pincode
                        </p>
                      )}
                      {pincodeStatus === "unavailable" && (
                        <p className="text-sm text-red-500 mt-1.5">
                          Delivery not available at this pincode
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <Button
                      onClick={handleAddAddress}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Save Address
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setShowNewAddress(false);
                        setNewAddress(emptyAddress);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </section>

            <section className="bg-white rounded-lg border border-border p-6">
              <h2 className="font-heading text-xl font-bold text-primary mb-4">
                Payment Method
              </h2>

              <div className="space-y-3">
                <label
                  className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    paymentMethod === "upi"
                      ? "border-secondary bg-secondary/5"
                      : "border-border hover:border-secondary/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        paymentMethod === "upi"
                          ? "border-secondary"
                          : "border-border"
                      }`}
                    >
                      {paymentMethod === "upi" && (
                        <div className="w-3 h-3 rounded-full bg-secondary" />
                      )}
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      value="upi"
                      checked={paymentMethod === "upi"}
                      onChange={() => setPaymentMethod("upi")}
                      className="sr-only"
                    />
                    <Smartphone className="h-5 w-5 text-secondary" />
                    <span className="font-medium text-primary">UPI</span>
                  </div>
                  {paymentMethod === "upi" && (
                    <div className="mt-3 ml-8">
                      <Label htmlFor="upi-id">UPI ID</Label>
                      <Input
                        id="upi-id"
                        placeholder="example@upi"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="mt-1.5"
                      />
                    </div>
                  )}
                </label>

                <label
                  className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    paymentMethod === "card"
                      ? "border-secondary bg-secondary/5"
                      : "border-border hover:border-secondary/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        paymentMethod === "card"
                          ? "border-secondary"
                          : "border-border"
                      }`}
                    >
                      {paymentMethod === "card" && (
                        <div className="w-3 h-3 rounded-full bg-secondary" />
                      )}
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                      className="sr-only"
                    />
                    <CreditCard className="h-5 w-5 text-secondary" />
                    <span className="font-medium text-primary">
                      Credit / Debit Card
                    </span>
                  </div>
                  {paymentMethod === "card" && (
                    <div className="mt-3 ml-8 space-y-3">
                      <div>
                        <Label htmlFor="card-name">Name on Card</Label>
                        <Input
                          id="card-name"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="card-number">Card Number</Label>
                        <Input
                          id="card-number"
                          placeholder="XXXX XXXX XXXX XXXX"
                          maxLength={19}
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="mt-1.5"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="card-expiry">Expiry</Label>
                          <Input
                            id="card-expiry"
                            placeholder="MM/YY"
                            maxLength={5}
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="mt-1.5"
                          />
                        </div>
                        <div>
                          <Label htmlFor="card-cvv">CVV</Label>
                          <Input
                            id="card-cvv"
                            type="password"
                            placeholder="***"
                            maxLength={4}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            className="mt-1.5"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </label>

                <label
                  className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    paymentMethod === "netbanking"
                      ? "border-secondary bg-secondary/5"
                      : "border-border hover:border-secondary/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        paymentMethod === "netbanking"
                          ? "border-secondary"
                          : "border-border"
                      }`}
                    >
                      {paymentMethod === "netbanking" && (
                        <div className="w-3 h-3 rounded-full bg-secondary" />
                      )}
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      value="netbanking"
                      checked={paymentMethod === "netbanking"}
                      onChange={() => setPaymentMethod("netbanking")}
                      className="sr-only"
                    />
                    <Building2 className="h-5 w-5 text-secondary" />
                    <span className="font-medium text-primary">
                      Net Banking
                    </span>
                  </div>
                  {paymentMethod === "netbanking" && (
                    <div className="mt-3 ml-8">
                      <Label htmlFor="bank-select">Select Bank</Label>
                      <Select value={selectedBank} onValueChange={setSelectedBank}>
                        <SelectTrigger id="bank-select" className="mt-1.5">
                          <SelectValue placeholder="Choose your bank" />
                        </SelectTrigger>
                        <SelectContent>
                          {banks.map((bank) => (
                            <SelectItem key={bank} value={bank}>
                              {bank}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </label>

                <label
                  className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    paymentMethod === "cod"
                      ? "border-secondary bg-secondary/5"
                      : "border-border hover:border-secondary/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        paymentMethod === "cod"
                          ? "border-secondary"
                          : "border-border"
                      }`}
                    >
                      {paymentMethod === "cod" && (
                        <div className="w-3 h-3 rounded-full bg-secondary" />
                      )}
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="sr-only"
                    />
                    <Truck className="h-5 w-5 text-secondary" />
                    <span className="font-medium text-primary">
                      Cash on Delivery
                    </span>
                  </div>
                </label>
              </div>
            </section>

            <section className="bg-white rounded-lg border border-border p-6">
              <h2 className="font-heading text-xl font-bold text-primary mb-4">
                Order Notes (Optional)
              </h2>
              <textarea
                placeholder="Any special instructions or delivery preferences..."
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                rows={3}
                className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary transition-all duration-200 resize-none"
              />
            </section>
          </div>

          <div className="lg:w-[40%]">
            <div className="bg-white rounded-lg border border-border p-6 sticky top-24">
              <h2 className="font-heading text-2xl font-bold text-primary mb-6">
                Order Summary
              </h2>

              <div className="space-y-4">
                {state.items.map((item) => (
                  <div key={item.productId} className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-md overflow-hidden bg-secondary/10 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-primary truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-primary flex-shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">GST (18%)</span>
                  <span className="font-medium">{formatPrice(gst)}</span>
                </div>
                {state.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatPrice(state.discount)}</span>
                  </div>
                )}
                <Separator className="my-2" />
                <div className="flex justify-between">
                  <span className="font-heading text-xl font-bold text-primary">
                    Total
                  </span>
                  <span className="font-heading text-xl font-bold text-primary">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {orderError && (
                <p className="text-sm text-red-500 mt-4 text-center">
                  {orderError}
                </p>
              )}

              <Button
                size="lg"
                className="w-full mt-6 bg-primary hover:bg-primary/90 text-base"
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
              >
                {isPlacingOrder ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  "Place Order"
                )}
              </Button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted">
                <Check className="h-3.5 w-3.5 text-green-600" />
                Secure checkout
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
