export const siteConfig = {
  name: "Kishore Sarees",
  shortName: "Kishore",
  description:
    "Best saree shop in Visakhapatnam for designer, silk, bridal and wedding sarees. Visit our Vizag boutique or shop online.",
  url: "https://www.kishoresarees.com",
  ogImage: "https://placehold.co/1200x630/7a1f35/fbf7f0.png?text=Kishore+Sarees",
  phone: "+91 98765 43210",
  phoneRaw: "919876543210",
  whatsapp: "919876543210",
  email: "hello@kishoresarees.com",
  address: {
    street: "12-3-45, Beach Road, Near RK Beach",
    locality: "Siripuram",
    city: "Visakhapatnam",
    state: "Andhra Pradesh",
    postalCode: "530003",
    country: "IN",
  },
  geo: {
    latitude: 17.7231,
    longitude: 83.3157,
  },
  hours: [
    {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "10:00",
      closes: "21:00",
    },
  ],
  social: {
    instagram: "https://www.instagram.com/kishoresarees",
    facebook: "https://www.facebook.com/kishoresarees",
    youtube: "https://www.youtube.com/@kishoresarees",
  },
  currency: "INR",
  currencySymbol: "₹",
} as const;

export const NAV_LINKS = [
  { label: "New Arrivals", href: "/collections/new-arrivals" },
  { label: "Silk Sarees", href: "/collections/soft-silk-sarees" },
  { label: "Wedding", href: "/collections/wedding-sarees" },
  { label: "Bridal", href: "/collections/bridal-sarees" },
  { label: "Cotton", href: "/collections/cotton-sarees" },
  { label: "Under ₹1000", href: "/collections/sarees-under-1000" },
  { label: "Blog", href: "/blog" },
  { label: "Visit Store", href: "/contact" },
] as const;
