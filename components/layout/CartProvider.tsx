"use client";

import { useStore } from "@/lib/store";
import { CartDrawer } from "./CartDrawer";
import React from "react";

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const isOpen = useStore((s) => s.isCartOpen);
  return (
    <>
      {children}
      {isOpen && <CartDrawer />}
    </>
  );
}