export type Fabric =
  | "Kanchipuram Silk"
  | "Banarasi Silk"
  | "Pochampally Ikat"
  | "Uppada Silk"
  | "Gadwal Silk"
  | "Organza"
  | "Tissue"
  | "Cotton"
  | "Linen"
  | "Chiffon"
  | "Georgette"
  | "Soft Silk"
  | "Art Silk";

export type Occasion =
  | "Wedding"
  | "Bridal"
  | "Reception"
  | "Haldi"
  | "Mehendi"
  | "Sangeet"
  | "Festive"
  | "Party Wear"
  | "Office Wear"
  | "Daily Wear"
  | "Casual";

export type ProductColor =
  | "Red"
  | "Maroon"
  | "Gold"
  | "Green"
  | "Blue"
  | "Pink"
  | "Purple"
  | "Orange"
  | "Yellow"
  | "Black"
  | "White"
  | "Beige"
  | "Peach"
  | "Teal"
  | "Mustard";

export interface Product {
  id: string;
  slug: string;
  name: string;
  fabric: Fabric;
  collections: string[];
  occasions: Occasion[];
  colors: ProductColor[];
  price: number;
  mrp: number;
  description: string;
  longDescription: string;
  images: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  isNewArrival?: boolean;
  isBestseller?: boolean;
  sku: string;
  blousePiece: boolean;
  length: string;
  care: string;
  areas?: string[];
}

export interface Collection {
  slug: string;
  name: string;
  title: string;
  metaDescription: string;
  h1: string;
  intro: string;
  seoHeading: string;
  seoContent: string[];
  relatedCollections?: string[];
  relatedAreaLink?: { label: string; href: string };
}

export interface Area {
  slug: string;
  name: string;
  title: string;
  metaDescription: string;
  h1: string;
  intro: string[];
  landmarks: string[];
  relevantCollections: string[];
  faqs: { question: string; answer: string }[];
}

export interface BlogPost {
  slug: string;
  title: string;
  metaDescription: string;
  excerpt: string;
  date: string;
  author: string;
  coverImage: string;
  content: string[];
  relatedCollections?: string[];
}
