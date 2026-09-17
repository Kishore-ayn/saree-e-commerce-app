import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function HomeSeoContent() {
  return (
    <section className="container-page py-14 md:py-20" aria-labelledby="home-seo-heading">
      <div className="mx-auto max-w-4xl space-y-10">
        <div>
          <h2 id="home-seo-heading" className="mb-4 font-heading text-2xl font-medium text-foreground md:text-3xl">
            The Best Saree Shop in Visakhapatnam
          </h2>
          <div className="space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
            <p>
              Welcome to {siteConfig.name}, a trusted saree shop in Visakhapatnam serving the city&apos;s
              saree lovers for weddings, festivals and everyday elegance. As one of the best saree shops
              in Visakhapatnam, our boutique near Siripuram brings together authentic handloom weaves,
              premium silk sarees and everyday cotton sarees under one roof, making us a go-to saree store
              in Visakhapatnam for shoppers across the city — from Gajuwaka to Madhurawada.
            </p>
            <p>
              Whether you&apos;re searching for &ldquo;sarees near me&rdquo; ahead of a wedding, browsing designer sarees
              Visakhapatnam boutiques are known for, or simply want to buy silk sarees in Vizag for a family
              pooja, our collection is built to serve every occasion. We stock everything from rich Kanchipuram
              silk sarees and Banarasi silk sarees to breathable cotton sarees and budget-friendly everyday wear.
            </p>
          </div>
        </div>

        <div>
          <h2 className="mb-4 font-heading text-2xl font-medium text-foreground md:text-3xl">
            Buy Sarees in Visakhapatnam for Every Occasion
          </h2>
          <div className="space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
            <p>
              Our wedding sarees Visakhapatnam collection covers every function of an Indian wedding — from
              vibrant haldi sarees to rich bridal Kanjivaram silks and shimmering reception pieces. For brides
              searching for the finest{" "}
              <Link href="/collections/bridal-sarees" className="text-primary underline underline-offset-2">
                bridal sarees in Visakhapatnam
              </Link>
              , our styling team offers personalised consultations to help you choose the perfect weave, colour
              and border for your big day.
            </p>
            <p>
              Beyond weddings, we&apos;re proud to offer some of the most affordable sarees in Vizag through our{" "}
              <Link href="/collections/sarees-under-1000" className="text-primary underline underline-offset-2">
                sarees under ₹1000
              </Link>{" "}
              and{" "}
              <Link href="/collections/sarees-under-2000" className="text-primary underline underline-offset-2">
                sarees under ₹2000
              </Link>{" "}
              collections, alongside premium sarees in Visakhapatnam for those seeking heirloom-quality silk.
              Our{" "}
              <Link href="/collections/new-arrivals" className="text-primary underline underline-offset-2">
                latest saree collection in Vizag
              </Link>{" "}
              is refreshed regularly, so there&apos;s always something new to discover, whether you shop online or
              visit our Visakhapatnam store in person.
            </p>
            <p>
              We also proudly serve customers across every corner of the city — explore our dedicated saree
              shop pages for{" "}
              <Link href="/saree-shop/gajuwaka" className="text-primary underline underline-offset-2">
                Gajuwaka
              </Link>
              ,{" "}
              <Link href="/saree-shop/madhurawada" className="text-primary underline underline-offset-2">
                Madhurawada
              </Link>
              ,{" "}
              <Link href="/saree-shop/mvp-colony" className="text-primary underline underline-offset-2">
                MVP Colony
              </Link>{" "}
              and more, each with locality-specific recommendations and delivery details.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
