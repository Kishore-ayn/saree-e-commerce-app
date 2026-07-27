import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProducts, getProductBySlug, getRelatedProducts } from "@/lib/cms/products";
import { siteConfig } from "@/lib/site-config";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { StarRating } from "@/components/ui/StarRating";
import { PriceTag } from "@/components/ui/PriceTag";
import { Accordion } from "@/components/ui/Accordion";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductActions } from "@/components/product/ProductActions";
import { PincodeChecker } from "@/components/product/PincodeChecker";
import { ProductGrid } from "@/components/product/ProductGrid";
import { JsonLd } from "@/components/seo/JsonLd";
import { productSchema, breadcrumbSchema } from "@/lib/schema";
import { resolveProductGalleryImages } from "@/lib/product-images";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  const galleryImages = resolveProductGalleryImages(product);

  const title = `${product.name} | ${product.fabric} Saree | ${siteConfig.shortName} Visakhapatnam`;
  return {
    title,
    description: product.description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title,
      description: product.description,
      url: `/products/${product.slug}`,
      images: [{ url: galleryImages[0], width: 900, height: 1200, alt: product.name }],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product);
  const galleryImages = resolveProductGalleryImages(product);

  return (
    <>
      <JsonLd data={productSchema({ ...product, images: galleryImages })} />
      <JsonLd data={breadcrumbSchema([{ label: "Collections", href: "/collections/new-arrivals" }, { label: product.name }])} />
      <Breadcrumbs items={[{ label: "Collections", href: "/collections/new-arrivals" }, { label: product.name }]} />

      <div className="container-page py-10 md:py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-14">
          <ProductGallery images={galleryImages} name={product.name} />

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gold">{product.fabric}</p>
            <h1 className="mt-1 font-heading text-2xl font-medium text-foreground md:text-3xl">
              {product.name}
            </h1>
            <div className="mt-2">
              <StarRating rating={product.rating} reviewCount={product.reviewCount} size="md" />
            </div>
            <div className="mt-4">
              <PriceTag price={product.price} mrp={product.mrp} size="lg" />
              <p className="mt-1 text-xs text-muted-foreground">Inclusive of all taxes</p>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

            <div className="mt-6">
              <ProductActions product={product} />
            </div>

            <div className="mt-6 rounded-sm border border-border p-4">
              <PincodeChecker />
            </div>

            <div className="mt-8">
              <Accordion
                items={[
                  {
                    title: "Product Details",
                    content: (
                      <ul className="space-y-1">
                        <li>SKU: {product.sku}</li>
                        <li>Fabric: {product.fabric}</li>
                        <li>Length: {product.length}</li>
                        <li>Blouse piece included: {product.blousePiece ? "Yes" : "No"}</li>
                        <li>Occasions: {product.occasions.join(", ")}</li>
                      </ul>
                    ),
                  },
                  {
                    title: "Fabric & Care",
                    content: <p>{product.care}</p>,
                  },
                  {
                    title: "Shipping & Returns",
                    content: (
                      <p>
                        Free shipping across Visakhapatnam on orders above ₹2999. Easy exchange within 7 days
                        of delivery. This is a demo storefront — checkout and live shipping are not enabled.
                      </p>
                    ),
                  },
                ]}
                defaultOpenIndex={0}
              />
            </div>

            <div className="mt-8">
              <h2 className="mb-3 font-heading text-lg font-medium text-foreground">About This Saree</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{product.longDescription}</p>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-16 border-t border-border pt-12">
            <h2 className="mb-6 font-heading text-2xl font-medium text-foreground">You May Also Like</h2>
            <ProductGrid products={related} />
          </div>
        )}
      </div>
    </>
  );
}

export const dynamicParams = true;
