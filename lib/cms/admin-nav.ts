import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  MapPin,
  HelpCircle,
  Newspaper,
  Quote,
  FileText,
  Image as ImageIcon,
  ClipboardList,
  Menu,
  Settings,
} from "lucide-react";

export type AdminNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

// Generic section list — not saree-specific — matching the folder structure
// in docs/architecture.md section 6. Sections beyond Dashboard/Products/
// Collections/Media/Areas/FAQs are built in later phases (8.4+: Blog/
// Testimonials/Pages, 9: SEO/Forms, 10: Settings) and will 404 until then.
export const adminNavItems: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Collections", href: "/admin/collections", icon: FolderTree },
  { label: "Areas", href: "/admin/areas", icon: MapPin },
  { label: "FAQs", href: "/admin/faqs", icon: HelpCircle },
  { label: "Blog", href: "/admin/blog", icon: Newspaper },
  { label: "Testimonials", href: "/admin/testimonials", icon: Quote },
  { label: "Pages", href: "/admin/pages", icon: FileText },
  { label: "Media", href: "/admin/media", icon: ImageIcon },
  { label: "Forms", href: "/admin/forms", icon: ClipboardList },
  { label: "Navigation", href: "/admin/navigation", icon: Menu },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];
