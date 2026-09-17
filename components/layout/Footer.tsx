import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export default function Footer() {
  return (
    <footer className="bg-border/10 py-12 md:py-16">
      <div className="container-page grid grid-cols-1 gap-6 md:grid-cols-4 md:gap-12">
        {/* About */}
        <div className="space-y-4">
          <h3 className="font-heading text-lg font-medium text-foreground">
            {siteConfig.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            Best saree shop in Visakhapatnam for designer, silk, bridal and
            wedding sarees.
          </p>
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>
              {siteConfig.address.street}, {siteConfig.address.locality},{" "}
              {siteConfig.address.city}, {siteConfig.address.state}{" "}
              {siteConfig.address.postalCode}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>{siteConfig.phone}</span>
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span>{siteConfig.email}</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h3 className="font-heading text-lg font-medium text-foreground">
            Quick Links
          </h3>
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground hover:text-primary"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-muted-foreground hover:text-primary"
          >
            About Us
          </Link>
          <Link
            href="/collections"
            className="text-sm font-medium text-muted-foreground hover:text-primary"
          >
            Collections
          </Link>
          <Link
            href="/blog"
            className="text-sm font-medium text-muted-foreground hover:text-primary"
          >
            Blog
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-muted-foreground hover:text-primary"
          >
            Contact
          </Link>
        </div>

        {/* Collections */}
        <div className="space-y-3">
          <h3 className="font-heading text-lg font-medium text-foreground">
            Collections
          </h3>
          <Link
            href="/collections/new-arrivals"
            className="text-sm font-medium text-muted-foreground hover:text-primary"
          >
            New Arrivals
          </Link>
          <Link
            href="/collections/soft-silk-sarees"
            className="text-sm font-medium text-muted-foreground hover:text-primary"
          >
            Silk Sarees
          </Link>
          <Link
            href="/collections/wedding-sarees"
            className="text-sm font-medium text-muted-foreground hover:text-primary"
          >
            Wedding Sarees
          </Link>
          <Link
            href="/collections/bridal-sarees"
            className="text-sm font-medium text-muted-foreground hover:text-primary"
          >
            Bridal Sarees
          </Link>
          <Link
            href="/collections/cotton-sarees"
            className="text-sm font-medium text-muted-foreground hover:text-primary"
          >
            Cotton Sarees
          </Link>
          <Link
            href="/collections/sarees-under-1000"
            className="text-sm font-medium text-muted-foreground hover:text-primary"
          >
            Under ₹1000
          </Link>
        </div>

        {/* Social */}
        <div className="space-y-3">
          <h3 className="font-heading text-lg font-medium text-foreground">
            Follow Us
          </h3>
          <div className="flex gap-4">
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <i className="fab fa-instagram h-5 w-5" />
            </a>
            <a
              href={siteConfig.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <i className="fab fa-facebook-f h-5 w-5" />
            </a>
            <a
              href={siteConfig.social.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <i className="fab fa-youtube h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-border/20 mt-12 pt-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
      </div>
    </footer>
  );
}