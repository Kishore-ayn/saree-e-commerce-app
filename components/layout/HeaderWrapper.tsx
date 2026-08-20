"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";

interface HeaderWrapperProps {
  products: any[];
  collections: any[];
}

export default function HeaderWrapper({ products, collections }: HeaderWrapperProps) {
  const pathname = usePathname();

  // Hide the header for any admin route (including /admin/login)
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return <Header products={products} collections={collections} />;
}