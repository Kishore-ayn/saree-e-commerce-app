import { siteConfig } from "@/lib/site-config";

export function WhatsAppButton() {
  const message = encodeURIComponent(
    "Hi! I'm interested in your sarees at Kishore Sarees, Visakhapatnam."
  );
  return (
    <a
      href={`https://wa.me/${siteConfig.whatsapp}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform duration-200 hover:scale-105 md:bottom-6"
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7 fill-white" aria-hidden>
        <path d="M16.004 2.667c-7.363 0-13.333 5.97-13.333 13.333 0 2.351.615 4.646 1.784 6.665l-1.895 6.923a1 1 0 0 0 1.226 1.226l6.999-1.878a13.27 13.27 0 0 0 5.219 1.064h.006c7.362 0 13.332-5.97 13.332-13.333S23.366 2.667 16.004 2.667Zm7.83 18.994c-.334.94-1.653 1.72-2.706 1.947-.72.153-1.66.276-4.823-1.036-4.048-1.677-6.652-5.776-6.856-6.045-.196-.269-1.647-2.194-1.647-4.185 0-1.99 1.03-2.968 1.396-3.372.334-.368.727-.46.97-.46.242 0 .485.003.696.013.223.011.522-.085.816.622.302.727 1.026 2.512 1.116 2.696.09.184.15.4.03.645-.12.245-.18.396-.36.61-.18.213-.377.475-.539.638-.18.18-.367.375-.157.735.21.36.933 1.539 2.003 2.494 1.376 1.227 2.536 1.607 2.897 1.788.36.18.57.15.78-.09.21-.24.9-1.05 1.14-1.41.24-.36.48-.3.81-.18.33.12 2.1.99 2.46 1.17.36.18.6.27.69.42.09.15.09.87-.245 1.81Z" />
      </svg>
    </a>
  );
}
