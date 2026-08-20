import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/site-config";
import { JsonLd } from "@/components/seo/JsonLd";
import { localBusinessSchema } from "@/lib/schema";
import { HeaderWrapper } from "@/components/layout/HeaderWrapper";
import { getProducts } from "@/lib/cms/products";
import { getCollections } from "@/lib/cms/collections-public";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Best Saree Shop in Visakhapatnam | Designer & Silk Sarees",
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Saree Shop in Visakhapatnam",
    "Best Saree Shop in Visakhapatnam",
    "Designer Sarees Visakhapatnam",
    "Silk Sarees Visakhapatnam",
    "Wedding Sarees Visakhapatnam",
    "Bridal Sarees Visakhapatnam",
    "Sarees Near Me",
  ],
  authors: [{ name: siteConfig.name }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: "Best Saree Shop in Visakhapatnam | Designer & Silk Sarees",
    description: siteConfig.description,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Saree Shop in Visakhapatnam | Designer & Silk Sarees",
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  alternates: {
    canonical: "/",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch products and collections for the header (search overlay etc.)
  let products: any[] = [];
  let collections: any[] = [];
  try {
    const [productsData, collectionsData] = await Promise.all([
      getProducts(),
      getCollections(),
    ]);
    products = productsData;
    collections = collectionsData;
  } catch (error) {
    console.error("Failed to fetch data for Header:", error);
    // Continue with empty arrays; Header will still render
  }

  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <JsonLd data={localBusinessSchema()} />
        <HeaderWrapper products={products} collections={collections} />
        {children}
      </body>
    </html>
  );
}