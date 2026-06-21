"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
  material: string;
}

interface CartState {
  items: CartItem[];
  couponCode: string | null;
  discount: number;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { productId: string; quantity: number } }
  | { type: "APPLY_COUPON"; payload: { code: string; discount: number } }
  | { type: "REMOVE_COUPON" }
  | { type: "CLEAR_CART" };

const initialState: CartState = {
  items: [],
  couponCode: null,
  discount: 0,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find((i) => i.productId === action.payload.productId);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.productId === action.payload.productId
              ? { ...i, quantity: Math.min(i.quantity + action.payload.quantity, i.stock) }
              : i
          ),
        };
      }
      return { ...state, items: [...state.items, action.payload] };
    }
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((i) => i.productId !== action.payload) };
    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map((i) =>
          i.productId === action.payload.productId
            ? { ...i, quantity: Math.max(1, Math.min(action.payload.quantity, i.stock)) }
            : i
        ),
      };
    case "APPLY_COUPON":
      return { ...state, couponCode: action.payload.code, discount: action.payload.discount };
    case "REMOVE_COUPON":
      return { ...state, couponCode: null, discount: 0 };
    case "CLEAR_CART":
      return { ...initialState };
    default:
      return state;
  }
}

interface CartContextType {
  state: CartState;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState, () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ajjram-cart");
      return saved ? JSON.parse(saved) : initialState;
    }
    return initialState;
  });

  useEffect(() => {
    localStorage.setItem("ajjram-cart", JSON.stringify(state));
  }, [state]);

  const addItem = (item: CartItem) => dispatch({ type: "ADD_ITEM", payload: item });
  const removeItem = (productId: string) => dispatch({ type: "REMOVE_ITEM", payload: productId });
  const updateQuantity = (productId: string, quantity: number) =>
    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } });
  const applyCoupon = (code: string, discount: number) =>
    dispatch({ type: "APPLY_COUPON", payload: { code, discount } });
  const removeCoupon = () => dispatch({ type: "REMOVE_COUPON" });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  const getSubtotal = () => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const getTotal = () => {
    const subtotal = getSubtotal();
    const gst = subtotal * 0.18;
    return subtotal + gst - state.discount;
  };
  const getItemCount = () => state.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        applyCoupon,
        removeCoupon,
        clearCart,
        getSubtotal,
        getTotal,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
