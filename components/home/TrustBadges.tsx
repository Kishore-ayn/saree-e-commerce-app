import { Gem, Truck, RotateCcw, MessageCircle } from "lucide-react";

const badges = [
  { icon: Gem, title: "Authentic Handloom", desc: "Sourced directly from weaving clusters" },
  { icon: Truck, title: "Vizag-Wide Delivery", desc: "Doorstep delivery across Visakhapatnam" },
  { icon: RotateCcw, title: "Easy Exchange", desc: "Hassle-free exchange within 7 days" },
  { icon: MessageCircle, title: "Styling Support", desc: "Personal saree styling on WhatsApp" },
];

export function TrustBadges() {
  return (
    <section className="border-y border-border bg-card py-10" aria-label="Why shop with us">
      <div className="container-page grid grid-cols-2 gap-6 md:grid-cols-4">
        {badges.map((badge) => {
          const Icon = badge.icon;
          return (
            <div key={badge.title} className="flex flex-col items-center gap-2 text-center md:flex-row md:text-left">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-muted text-primary">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">{badge.title}</p>
                <p className="text-xs text-muted-foreground">{badge.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
