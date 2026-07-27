import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { collections } from "@/data/collections";
import { areas } from "@/data/areas";
import { NewsletterForm } from "@/components/layout/NewsletterForm";

const featuredCollections = collections.slice(0, 10);

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
      <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465a4.9 4.9 0 0 1 1.771 1.153 4.9 4.9 0 0 1 1.153 1.771c.248.637.415 1.363.465 2.428.05 1.066.06 1.405.06 4.122s-.01 3.056-.06 4.122c-.05 1.065-.217 1.79-.465 2.428a4.9 4.9 0 0 1-1.153 1.771 4.9 4.9 0 0 1-1.771 1.153c-.637.248-1.363.415-2.428.465-1.066.05-1.405.06-4.122.06s-3.056-.01-4.122-.06c-1.065-.05-1.79-.217-2.428-.465a4.9 4.9 0 0 1-1.771-1.153 4.9 4.9 0 0 1-1.153-1.771c-.248-.637-.415-1.363-.465-2.428C2.01 15.056 2 14.717 2 12s.01-3.056.06-4.122c.05-1.065.217-1.79.465-2.428A4.9 4.9 0 0 1 3.678 3.68 4.9 4.9 0 0 1 5.45 2.525c.637-.248 1.363-.415 2.428-.465C8.944 2.01 9.283 2 12 2Zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8.25A3.25 3.25 0 1 1 12 8.75a3.25 3.25 0 0 1 0 6.5Zm5.2-8.6a1.17 1.17 0 1 1 0-2.34 1.17 1.17 0 0 1 0 2.34Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
      <path d="M13.5 21v-7.75h2.6l.39-3.02h-2.99V8.31c0-.875.243-1.47 1.497-1.47h1.6V4.14A21.4 21.4 0 0 0 14.27 4c-2.31 0-3.89 1.41-3.89 4v2.23H7.77v3.02h2.61V21h3.12Z" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
      <path d="M21.58 7.19a2.7 2.7 0 0 0-1.9-1.92C17.94 4.8 12 4.8 12 4.8s-5.94 0-7.68.47a2.7 2.7 0 0 0-1.9 1.92A28.3 28.3 0 0 0 2 12a28.3 28.3 0 0 0 .42 4.81 2.7 2.7 0 0 0 1.9 1.92c1.74.47 7.68.47 7.68.47s5.94 0 7.68-.47a2.7 2.7 0 0 0 1.9-1.92A28.3 28.3 0 0 0 22 12a28.3 28.3 0 0 0-.42-4.81ZM10.02 14.9V9.1L15.34 12l-5.32 2.9Z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-muted/50 pb-20 md:pb-0">
      <div className="border-b border-border bg-primary py-10 text-primary-foreground">
        <div className="container-page flex flex-col items-center gap-4 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <h2 className="font-heading text-2xl font-medium">Join Our Saree Circle</h2>
            <p className="mt-1 text-sm text-primary-foreground/80">
              Get early access to new arrivals, festive collections and exclusive offers from our Visakhapatnam store.
            </p>
          </div>
          <NewsletterForm />
        </div>
      </div>

      <div className="container-page grid grid-cols-2 gap-8 py-12 md:grid-cols-5">
        <div className="col-span-2 md:col-span-1">
          <span className="font-heading text-xl font-semibold text-primary">Kishore</span>
          <span className="mt-0.5 block text-[10px] uppercase tracking-[0.3em] text-gold">Sarees</span>
          <p className="mt-3 text-sm text-muted-foreground">
            The best saree shop in Visakhapatnam for designer, silk, bridal and wedding sarees since generations.
          </p>
          <div className="mt-4 flex gap-3">
            <a href={siteConfig.social.instagram} aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-card">
              <InstagramIcon />
            </a>
            <a href={siteConfig.social.facebook} aria-label="Facebook" target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-card">
              <FacebookIcon />
            </a>
            <a href={siteConfig.social.youtube} aria-label="YouTube" target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-card">
              <YoutubeIcon />
            </a>
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gold">Collections</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {featuredCollections.map((c) => (
              <li key={c.slug}>
                <Link href={`/collections/${c.slug}`} className="hover:text-primary">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gold">
            We Serve All of Visakhapatnam
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {areas.map((area) => (
              <li key={area.slug}>
                <Link href={`/saree-shop/${area.slug}`} className="hover:text-primary">
                  Saree Shop in {area.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gold">Company</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-primary">Contact Us</Link></li>
            <li><Link href="/blog" className="hover:text-primary">Blog</Link></li>
            <li><Link href="/wishlist" className="hover:text-primary">Wishlist</Link></li>
          </ul>

          <h3 className="mb-3 mt-6 text-xs font-semibold uppercase tracking-wider text-gold">Visit Us</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                {siteConfig.address.street}, {siteConfig.address.locality}, {siteConfig.address.city},{" "}
                {siteConfig.address.state} {siteConfig.address.postalCode}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0" />
              <a href={`tel:${siteConfig.phoneRaw}`} className="hover:text-primary">{siteConfig.phone}</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0" />
              <a href={`mailto:${siteConfig.email}`} className="hover:text-primary">{siteConfig.email}</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-6">
        <div className="container-page flex flex-col items-center justify-between gap-4 text-xs text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} {siteConfig.name}, Visakhapatnam. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span className="rounded-sm border border-border px-2 py-1">UPI</span>
            <span className="rounded-sm border border-border px-2 py-1">Visa</span>
            <span className="rounded-sm border border-border px-2 py-1">Mastercard</span>
            <span className="rounded-sm border border-border px-2 py-1">Cash on Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
