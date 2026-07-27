import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAreas, getAreaBySlug } from "@/lib/cms/areas";
import { getCollectionBySlug } from "@/lib/cms/collections";
import { getProductsByCollection } from "@/lib/cms/products";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Accordion } from "@/components/ui/Accordion";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";

export async function generateStaticParams() {
  const areas = await getAreas();
  return areas.map((a) => ({ area: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ area: string }>;
}): Promise<Metadata> {
  const { area: areaSlug } = await params;
  const area = await getAreaBySlug(areaSlug);
  if (!area) return {};

  return {
    title: area.title,
    description: area.metaDescription,
    alternates: { canonical: `/saree-shop/${area.slug}` },
    openGraph: {
      title: area.title,
      description: area.metaDescription,
      url: `/saree-shop/${area.slug}`,
    },
  };
}

export default async function AreaPage({
  params,
}: {
  params: Promise<{ area: string }>;
}) {
  const { area: areaSlug } = await params;
  const area = await getAreaBySlug(areaSlug);
  if (!area) notFound();

  const productsByCollection = await Promise.all(
    area.relevantCollections.map((slug) => getProductsByCollection(slug))
  );
  const products = Array.from(
    new Map(productsByCollection.flat().map((p) => [p.id, p])).values()
  ).slice(0, 8);

  const relevantCollectionData = (
    await Promise.all(area.relevantCollections.map((s) => getCollectionBySlug(s)))
  ).filter((c): c is NonNullable<typeof c> => Boolean(c));

  const allAreas = await getAreas();

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ label: area.h1 }])} />
      <JsonLd data={faqSchema(area.faqs)} />
      <Breadcrumbs items={[{ label: "Saree Shop Near Me" }, { label: area.name }]} />

      <div className="container-page py-10 md:py-14">
        <h1 className="mb-4 font-heading text-3xl font-medium text-foreground md:text-4xl">{area.h1}</h1>
        <div className="mb-10 max-w-3xl space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
          {area.intro.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        <div className="mb-10 flex flex-wrap gap-2">
          {relevantCollectionData.map((c) => (
            <Link
              key={c.slug}
              href={`/collections/${c.slug}`}
              className="rounded-full border border-border px-4 py-2 text-sm hover:border-primary hover:text-primary"
            >
              {c.name}
            </Link>
          ))}
        </div>

        <h2 className="mb-6 font-heading text-2xl font-medium text-foreground">
          Popular Sarees Near {area.name}
        </h2>
        <ProductGrid products={products} />

        <div className="mx-auto mt-16 max-w-3xl border-t border-border pt-12">
          <h2 className="mb-2 font-heading text-2xl font-medium text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Common questions from saree shoppers near {area.name}, Visakhapatnam.
          </p>
          <Accordion
            items={area.faqs.map((faq) => ({ title: faq.question, content: <p>{faq.answer}</p> }))}
            defaultOpenIndex={null}
          />
        </div>

        <div className="mx-auto mt-12 max-w-3xl">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gold">
            We Also Serve Nearby Areas
          </h3>
          <div className="flex flex-wrap gap-2">
            {allAreas
              .filter((a) => a.slug !== area.slug)
              .slice(0, 6)
              .map((a) => (
                <Link
                  key={a.slug}
                  href={`/saree-shop/${a.slug}`}
                  className="rounded-full border border-border px-4 py-2 text-sm hover:border-primary hover:text-primary"
                >
                  {a.name}
                </Link>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

export const dynamicParams = true;
