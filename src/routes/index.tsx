import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";
import { listProducts } from "@/lib/products.functions";
import { formatEUR, SIZE_LABEL_DE } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { ArrowRight, Award, Sparkles, Truck, ShieldCheck } from "lucide-react";
import bottle from "@/assets/bottle-50.jpg";
const heroVideo = "/__l5e/assets-v1/732643c8-167a-4e54-a27b-ae1e8667a406/hero-video.mp4";
const sectionVideo = "/__l5e/assets-v1/a6f65cf8-504b-40ad-9e80-54b651b2e110/section-video.mp4";
const heroPortrait = "/__l5e/assets-v1/972dca59-6c65-4c2b-bc7f-36495999a30b/hero-portrait.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lamisent Essence — Premium Extrait de Parfum" },
      {
        name: "description",
        content:
          "Premium Extrait de Parfum aus Deutschland. 11 Signature-Düfte in 9, 30, 50 und 100 ML — inspiriert von den feinsten Häusern.",
      },
      { property: "og:title", content: "Lamisent Essence — Impress. Inspire. Remain." },
      { property: "og:image", content: heroPortrait },
      { rel: "canonical", href: "https://lamisent.com/" } as any,
    ],
  }),
  loader: async ({ context }) => {
    return context.queryClient.ensureQueryData({
      queryKey: ["products"],
      queryFn: () => listProducts(),
    });
  },
  component: Home,
});

function Home() {
  const { t, locale } = useI18n();
  const { data: products } = useSuspenseQuery({
    queryKey: ["products"],
    queryFn: () => listProducts(),
  });
  const featured = products.filter((p) => p.featured).slice(0, 6);

  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Lamisent Essence",
    url: "https://lamisent.com",
    logo: "https://lamisent.com/logo.png",
    sameAs: [],
  };

  return (
    <div className="flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />

      {/* HERO */}
      <section className="relative h-[88vh] min-h-[640px] w-full overflow-hidden">
        <video
          src={heroVideo}
          autoPlay
          muted
          loop
          playsInline
          poster={heroPortrait}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/30 to-background" />
        <div className="relative z-10 mx-auto max-w-7xl px-6 h-full flex flex-col justify-center">
          <div className="max-w-2xl">
            <div className="text-[11px] tracking-[0.4em] text-gold uppercase mb-6">Premium Men's Fragrance</div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-ivory leading-[1.05]">
              <span className="italic font-medium text-gold" style={{ fontFamily: "'Cinzel', serif" }}>Lamisent</span>
              <br />
              <span className="tracking-[0.3em] text-4xl sm:text-5xl lg:text-6xl">ESSENCE</span>
            </h1>
            <p className="mt-8 text-sm sm:text-base text-ivory/80 max-w-md leading-relaxed">
              {t("hero.subtitle")}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button asChild className="bg-gold text-gold-foreground hover:bg-gold/90 rounded-none h-12 px-8 tracking-[0.2em] uppercase text-xs">
                <Link to="/shop">{t("hero.cta")} <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="ghost" className="text-ivory hover:text-gold rounded-none h-12 px-4 tracking-[0.2em] uppercase text-xs">
                <Link to="/about">{t("nav.about")}</Link>
              </Button>
            </div>
            <div className="mt-10 text-[11px] tracking-[0.3em] text-gold uppercase">
              Impress · Inspire · Remain
            </div>
          </div>
        </div>
      </section>

      {/* VALUE STRIP */}
      <section className="border-y border-border/40 bg-charcoal/40">
        <div className="mx-auto max-w-7xl px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { Icon: Award, label: locale === "de" ? "Premium Ingredienzien" : "Premium Ingredients" },
            { Icon: Sparkles, label: locale === "de" ? "Bis zu 12h Haltbarkeit" : "Up to 12h longevity" },
            { Icon: Truck, label: locale === "de" ? "Versand ab 60 € gratis" : "Free shipping over €60" },
            { Icon: ShieldCheck, label: locale === "de" ? "14 Tage Widerrufsrecht" : "14-day right of return" },
          ].map(({ Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <Icon className="h-5 w-5 text-gold" />
              <span className="text-[11px] uppercase tracking-[0.2em] text-foreground/80">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="text-[11px] tracking-[0.4em] text-gold uppercase">{locale === "de" ? "Bestseller" : "Bestsellers"}</div>
          <h2 className="font-display text-4xl sm:text-5xl mt-4">{t("home.featured")}</h2>
          <div className="gold-line mt-8 max-w-[120px]" />
          <p className="mt-6 text-sm text-muted-foreground max-w-xl">{t("home.featured.sub")}</p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => {
            const min = Math.min(...p.variants.map((v) => v.price_cents));
            return (
              <Link
                key={p.id}
                to="/shop/$slug"
                params={{ slug: p.slug }}
                className="group block hairline-border bg-charcoal/30 overflow-hidden"
              >
                <div className="aspect-[4/5] overflow-hidden bg-background">
                  <img
                    src={p.hero_image || bottle}
                    alt={p.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <div className="text-[10px] tracking-[0.3em] text-gold uppercase">{t("product.inspiredBy")} {p.inspired_by}</div>
                  <h3 className="mt-2 font-display text-xl">{p.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{locale === "de" ? p.tagline_de : p.tagline_en}</p>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-sm tabular-nums">{t("shop.from")} {formatEUR(min, locale)}</span>
                    <span className="text-[11px] tracking-[0.2em] uppercase text-gold opacity-80 group-hover:opacity-100">
                      {t("shop.viewProduct")} →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="mt-14 flex justify-center">
          <Button asChild variant="outline" className="rounded-none h-12 px-8 tracking-[0.2em] uppercase text-xs border-gold/40 hover:bg-gold hover:text-gold-foreground">
            <Link to="/shop">{locale === "de" ? "Alle Düfte ansehen" : "View all fragrances"}</Link>
          </Button>
        </div>
      </section>

      {/* CINEMATIC VIDEO SECTION */}
      <section className="relative h-[70vh] min-h-[480px] overflow-hidden">
        <video src={sectionVideo} autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-background/60" />
        <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
          <div className="max-w-2xl">
            <div className="text-[11px] tracking-[0.4em] text-gold uppercase">The Essence</div>
            <h2 className="mt-6 font-display text-4xl sm:text-5xl text-ivory leading-tight">
              {locale === "de" ? "Eine Essenz. Vier Formate." : "One essence. Four formats."}
            </h2>
            <div className="gold-line mt-8 mx-auto max-w-[120px]" />
            <p className="mt-6 text-ivory/80 text-sm">{t("home.values.sub")}</p>
            <div className="mt-10 grid grid-cols-4 gap-6 max-w-md mx-auto">
              {[9, 30, 50, 100].map((s) => (
                <div key={s} className="text-center">
                  <div className="font-display text-2xl text-gold">{s}</div>
                  <div className="text-[10px] tracking-[0.2em] uppercase text-ivory/70">ML</div>
                  <div className="text-[10px] tracking-[0.15em] uppercase mt-1 text-ivory/50">{SIZE_LABEL_DE[s]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BRAND STORY */}
      <section className="mx-auto max-w-7xl px-6 py-24 grid gap-16 lg:grid-cols-2 items-center">
        <div className="relative aspect-[4/5] overflow-hidden hairline-border">
          <img src={heroPortrait} alt="Lamisent Essence" className="absolute inset-0 h-full w-full object-cover" />
        </div>
        <div>
          <div className="text-[11px] tracking-[0.4em] text-gold uppercase">{locale === "de" ? "Die Marke" : "The brand"}</div>
          <h2 className="font-display text-4xl sm:text-5xl mt-4">
            {locale === "de" ? "Niche Düfte. Faire Preise." : "Niche fragrances. Fair prices."}
          </h2>
          <div className="gold-line mt-8 max-w-[120px]" />
          <p className="mt-6 text-foreground/80 leading-relaxed">
            {locale === "de"
              ? "Lamisent Essence steht für moderne Männlichkeit — selbstbewusst, raffiniert und unvergesslich. Jeder Duft ist ein Extrait de Parfum mit hoher Konzentration, inspiriert von den feinsten Häusern der Welt — zu einem Bruchteil des Preises."
              : "Lamisent Essence stands for modern masculinity — confident, refined, unforgettable. Every fragrance is a high-concentration extrait de parfum, inspired by the world's finest houses — at a fraction of the price."}
          </p>
          <p className="mt-4 text-foreground/70 leading-relaxed">
            {locale === "de"
              ? "Bis zu 90 % günstiger als das Original. Gleiche Komposition. Made in Germany."
              : "Up to 90% lower than the original. Same composition. Made in Germany."}
          </p>
          <div className="mt-10">
            <Button asChild className="bg-gold text-gold-foreground hover:bg-gold/90 rounded-none h-12 px-8 tracking-[0.2em] uppercase text-xs">
              <Link to="/about">{locale === "de" ? "Unsere Geschichte" : "Our story"} <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
