import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { blogPosts } from "@/data/blog";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Saree Blog | Styling Tips & Guides | Kishore Sarees",
  description:
    "Read our saree blog for styling tips, fabric guides and trends from Visakhapatnam's trusted saree boutique — bridal, silk and festive saree guides.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ label: "Blog" }])} />
      <Breadcrumbs items={[{ label: "Blog" }]} />

      <div className="container-page py-10 md:py-14">
        <SectionHeading
          as="h1"
          align="left"
          eyebrow="Saree Journal"
          title="Styling Tips & Saree Guides"
          subtitle="Fabric guides, festival edits and bridal styling advice from our Visakhapatnam saree experts."
        />

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
              <div className="relative mb-4 aspect-[16/9] overflow-hidden rounded-sm bg-muted">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <p className="mb-1 text-xs text-muted-foreground">
                {new Date(post.date).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
              </p>
              <h2 className="mb-2 font-heading text-lg font-medium text-foreground group-hover:text-primary md:text-xl">
                {post.title}
              </h2>
              <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
