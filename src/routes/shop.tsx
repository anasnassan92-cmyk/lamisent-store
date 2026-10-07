import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { listProducts } from "@/lib/products.functions";
import { formatEUR } from "@/lib/format";
import bottle from "@/assets/bottle-50.jpg";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — Lamisent Essence" },
      { name: "description", content: "Entdecke 11 Signature-Düfte von Lamisent Essence. Extrait de Parfum in 9, 30, 50 und 100 ML." },
      { property: "og:title", content: "Shop — Lamisent Essence" },
    ],
  }),
  loader: ({ context }) =>
    context.queryClient.ensureQueryData({ queryKey: ["products"], queryFn: () => listProducts() }),
  component: Shop,
});

function Shop() {
  const { t, locale } = useI18n();
  const { data: products } = useSuspenseQuery({ queryKey: ["products"], queryFn: () => listProducts() });
  const [family, setFamily] = useState<string>("all");

  const families = useMemo(() => {
    const set = new Set(products.map((p) => p.family));
    return ["all", ...Array.from(set)];
  }, [products]);

  const filtered = family === "all" ? products : products.filter((p) => p.family === family);

  return (
    <div className="mx-auto max-w-7xl px-6 py-20">
      <div className="text-center max-w-2xl mx-auto">
        <div className="text-[11px] tracking-[0.4em] text-gold uppercase">Collection 2026</div>
        <h1 className="font-display text-5xl sm:text-6xl mt-4">{t("shop.title")}</h1>
        <div className="gold-line mt-8 mx-auto max-w-[120px]" />
        <p className="mt-6 text-muted-foreground">{t("shop.subtitle")}</p>
      </div>

      <div className="mt-12 flex flex-wrap justify-center gap-2">
        {families.map((f) => (
          <button
            key={f}
            onClick={() => setFamily(f)}
            className={
              "px-4 py-2 text-[10px] tracking-[0.25em] uppercase border " +
              (family === f
                ? "bg-gold text-gold-foreground border-gold"
                : "border-border text-foreground/80 hover:border-gold hover:text-gold")
            }
          >
            {f === "all" ? t("shop.filter.all") : f}
          </button>
        ))}
      </div>

      <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => {
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
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="text-[10px] tracking-[0.3em] text-gold uppercase">{t("product.inspiredBy")} {p.inspired_by}</div>
                <h3 className="mt-2 font-display text-xl">{p.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{locale === "de" ? p.tagline_de : p.tagline_en}</p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-sm tabular-nums">{t("shop.from")} {formatEUR(min, locale)}</span>
                  <span className="text-[11px] tracking-[0.2em] uppercase text-gold">{t("shop.viewProduct")} →</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}