"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";

interface FooterWrapperProps {}

export default function FooterWrapper(_: FooterWrapperProps) {
  const pathname = usePathname();

  // Hide the footer for any admin route (including /admin/login)
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return <Footer />;
}