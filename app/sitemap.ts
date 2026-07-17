import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { collections } from "@/data/collections";
import { products } from "@/data/products";
import { areas } from "@/data/areas";
import { blogPosts } from "@/data/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.url, changeFrequency: "daily", priority: 1 },
    { url: `${siteConfig.url}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteConfig.url}/contact`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteConfig.url}/blog`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteConfig.url}/wishlist`, changeFrequency: "monthly", priority: 0.3 },
  ];

  const collectionRoutes: MetadataRoute.Sitemap = collections.map((c) => ({
    url: `${siteConfig.url}/collections/${c.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${siteConfig.url}/products/${p.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const areaRoutes: MetadataRoute.Sitemap = areas.map((a) => ({
    url: `${siteConfig.url}/saree-shop/${a.slug}`,
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${siteConfig.url}/blog/${post.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
    lastModified: post.date,
  }));

  return [...staticRoutes, ...collectionRoutes, ...productRoutes, ...areaRoutes, ...blogRoutes];
}
