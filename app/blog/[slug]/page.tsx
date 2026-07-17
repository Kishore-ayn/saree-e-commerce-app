import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts, getBlogPostBySlug } from "@/data/blog";
import { getCollectionBySlug } from "@/data/collections";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { BlogContent } from "@/components/blog/BlogContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.metaDescription,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      url: `/blog/${post.slug}`,
      type: "article",
      images: [{ url: post.coverImage, width: 1200, height: 675, alt: post.title }],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const relatedCollections = (post.relatedCollections ?? [])
    .map((s) => getCollectionBySlug(s))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <>
      <JsonLd data={articleSchema(post)} />
      <JsonLd data={breadcrumbSchema([{ label: "Blog", href: "/blog" }, { label: post.title }])} />
      <Breadcrumbs items={[{ label: "Blog", href: "/blog" }, { label: post.title }]} />

      <article className="container-page py-10 md:py-14">
        <div className="mx-auto max-w-3xl">
          <p className="mb-2 text-xs text-muted-foreground">
            {new Date(post.date).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}{" "}
            &middot; {post.author}
          </p>
          <h1 className="mb-6 font-heading text-3xl font-medium text-foreground md:text-4xl">{post.title}</h1>

          <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-sm bg-muted">
            <Image src={post.coverImage} alt={post.title} fill priority sizes="(max-width: 768px) 100vw, 768px" className="object-cover" />
          </div>

          <BlogContent content={post.content} />

          {relatedCollections.length > 0 && (
            <div className="mt-12 border-t border-border pt-8">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gold">
                Explore Related Collections
              </h3>
              <div className="flex flex-wrap gap-2">
                {relatedCollections.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/collections/${c.slug}`}
                    className="rounded-full border border-border px-4 py-2 text-sm hover:border-primary hover:text-primary"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </>
  );
}

export const dynamicParams = false;
