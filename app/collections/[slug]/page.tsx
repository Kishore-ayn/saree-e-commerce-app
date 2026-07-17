import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { collections, getCollectionBySlug } from "@/data/collections";
import { getProductsByCollection } from "@/data/products";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CollectionExplorer } from "@/components/collection/CollectionExplorer";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) return {};

  return {
    title: collection.title,
    description: collection.metaDescription,
    alternates: { canonical: `/collections/${collection.slug}` },
    openGraph: {
      title: collection.title,
      description: collection.metaDescription,
      url: `/collections/${collection.slug}`,
    },
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) notFound();

  const products = getProductsByCollection(collection.slug);
  const related = (collection.relatedCollections ?? [])
    .map((s) => getCollectionBySlug(s))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ label: collection.name }])} />
      <Breadcrumbs items={[{ label: "Collections", href: "/collections/new-arrivals" }, { label: collection.name }]} />

      <div className="container-page py-10 md:py-14">
        <div className="mb-8 max-w-3xl">
          <h1 className="mb-3 font-heading text-3xl font-medium text-foreground md:text-4xl">
            {collection.h1}
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground md:text-base">{collection.intro}</p>
        </div>

        <CollectionExplorer products={products} />

        <div className="mx-auto mt-16 max-w-4xl border-t border-border pt-12">
          <h2 className="mb-4 font-heading text-2xl font-medium text-foreground md:text-3xl">
            {collection.seoHeading}
          </h2>
          <div className="space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
            {collection.seoContent.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {collection.relatedAreaLink && (
            <p className="mt-4 text-sm">
              <Link href={collection.relatedAreaLink.href} className="text-primary underline underline-offset-2">
                {collection.relatedAreaLink.label}
              </Link>
            </p>
          )}

          {related.length > 0 && (
            <div className="mt-8">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gold">
                You May Also Like
              </h3>
              <div className="flex flex-wrap gap-3">
                {related.map((c) => (
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
      </div>
    </>
  );
}

export const dynamicParams = false;
