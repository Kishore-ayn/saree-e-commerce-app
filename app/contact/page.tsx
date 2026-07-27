import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/contact/ContactForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, localBusinessSchema } from "@/lib/schema";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact Us | Kishore Sarees, Visakhapatnam",
  description:
    "Contact Kishore Sarees in Visakhapatnam — visit our Siripuram store, call, WhatsApp or email us for saree styling and orders.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <JsonLd data={localBusinessSchema()} />
      <JsonLd data={breadcrumbSchema([{ label: "Contact Us" }])} />
      <Breadcrumbs items={[{ label: "Contact Us" }]} />

      <div className="container-page py-10 md:py-14">
        <SectionHeading as="h1" align="left" eyebrow="Get in Touch" title="Contact Us" />

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <div>
            <ul className="mb-8 space-y-4 text-sm text-foreground">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span>
                  {siteConfig.address.street}, {siteConfig.address.locality}, {siteConfig.address.city},{" "}
                  {siteConfig.address.state} {siteConfig.address.postalCode}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0 text-primary" />
                <a href={`tel:${siteConfig.phoneRaw}`} className="hover:text-primary">{siteConfig.phone}</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 shrink-0 text-primary" />
                <a href={`mailto:${siteConfig.email}`} className="hover:text-primary">{siteConfig.email}</a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="h-5 w-5 shrink-0 text-primary" />
                <span>Monday – Sunday: 10:00 AM – 9:00 PM</span>
              </li>
            </ul>

            <div className="relative aspect-video overflow-hidden rounded-sm bg-muted">
              <iframe
                title="Kishore Sarees location on Google Maps"
                src={`https://www.google.com/maps?q=${siteConfig.geo.latitude},${siteConfig.geo.longitude}&z=15&output=embed`}
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <a
              href={`https://wa.me/${siteConfig.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-sm bg-[#25D366] px-5 text-sm font-semibold text-white"
            >
              Chat with us on WhatsApp
            </a>
          </div>

          <div>
            <h2 className="mb-4 font-heading text-xl font-medium text-foreground">Send Us a Message</h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </>
  );
}
