import type { Metadata } from "next";
import Image from "next/image";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TrustBadges } from "@/components/home/TrustBadges";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, localBusinessSchema } from "@/lib/schema";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About Us | Kishore Sarees, Visakhapatnam",
  description:
    "Learn about Kishore Sarees, a trusted saree shop in Visakhapatnam offering handloom, silk and designer sarees for every occasion.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <JsonLd data={localBusinessSchema()} />
      <JsonLd data={breadcrumbSchema([{ label: "About Us" }])} />
      <Breadcrumbs items={[{ label: "About Us" }]} />

      <div className="container-page py-10 md:py-14">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
          <div>
            <SectionHeading
              as="h1"
              align="left"
              eyebrow="Our Story"
              title="About Kishore Sarees"
            />
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              <p>
                Kishore Sarees has been a trusted name for saree shopping in Visakhapatnam,
                bringing together authentic handloom weaves, premium silk sarees and everyday cotton
                sarees under one roof near Siripuram. What began as a small family boutique has grown
                into one of the best saree shops in Visakhapatnam, serving generations of families for
                weddings, festivals and everyday elegance.
              </p>
              <p>
                We work directly with weaving clusters across Andhra Pradesh, Tamil Nadu and Telangana to
                bring authentic Kanchipuram silk, Banarasi, Uppada, Pochampally and Gadwal sarees to Vizag,
                ensuring every piece meets our standards for fabric quality and craftsmanship.
              </p>
              <p>
                Our team takes pride in offering honest styling guidance rather than just a sales pitch —
                whether you&apos;re a bride planning your wedding wardrobe or a shopper looking for an everyday
                cotton saree, we&apos;re here to help you find the right piece for your occasion and budget.
              </p>
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-muted">
            <Image
              src="https://placehold.co/800x1000/7a1f35/f3e9da.png?text=Siva+Prakash+Sarees+Boutique"
              alt="Interior of Kishore Sarees boutique in Visakhapatnam"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>

      <TrustBadges />

      <div className="container-page py-10 md:py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <div>
            <h2 className="mb-4 font-heading text-2xl font-medium text-foreground">Visit Our Store</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              {siteConfig.address.street}, {siteConfig.address.locality}, {siteConfig.address.city},{" "}
              {siteConfig.address.state} {siteConfig.address.postalCode}
            </p>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-gold">Opening Hours</h3>
            <p className="text-sm text-muted-foreground">Monday – Sunday: 10:00 AM – 9:00 PM</p>
          </div>
          <div className="relative aspect-video overflow-hidden rounded-sm bg-muted">
            <iframe
              title="Kishore Sarees location on Google Maps"
              src={`https://www.google.com/maps?q=${siteConfig.geo.latitude},${siteConfig.geo.longitude}&z=15&output=embed`}
              className="h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </>
  );
}
