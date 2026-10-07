import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { getProduct } from "@/lib/products.functions";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { formatEUR, SIZE_LABEL_DE } from "@/lib/format";
import { Minus, Plus, Truck, ShieldCheck, Sparkles } from "lucide-react";
import bottle from "@/assets/bottle-50.jpg";

export const Route = createFileRoute("/shop/$slug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData({
      queryKey: ["product", params.slug],
      queryFn: () => getProduct({ data: { slug: params.slug } }),
    });
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} — Lamisent Essence` },
          {
            name: "description",
            content: loaderData.tagline_de || `Lamisent Essence ${loaderData.name} — inspiriert von ${loaderData.inspired_by}.`,
          },
          { property: "og:title", content: `${loaderData.name} — Lamisent Essence` },
          { property: "og:image", content: loaderData.hero_image ?? "" },
        ]
      : [],
  }),
  component: Product,
});

function Product() {
  const params = Route.useParams();
  const { t, locale } = useI18n();
  const { data: product } = useSuspenseQuery({
    queryKey: ["product", params.slug],
    queryFn: () => getProduct({ data: { slug: params.slug } }),
  });
  const { add } = useCart();
  const variants = product!.variants;
  const [variantId, setVariantId] = useState(variants[2]?.id || variants[0]?.id);
  const [qty, setQty] = useState(1);
  const variant = variants.find((v) => v.id === variantId) || variants[0];

  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product!.name} — Lamisent Essence`,
    description: product!.description_de || product!.tagline_de,
    image: product!.hero_image,
    brand: { "@type": "Brand", name: "Lamisent Essence" },
    offers: variants.map((v) => ({
      "@type": "Offer",
      sku: v.sku,
      price: (v.price_cents / 100).toFixed(2),
      priceCurrency: "EUR",
      availability: v.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `https://lamisent.com/shop/${product!.slug}`,
    })),
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }} />
      <nav className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-10">
        <Link to="/" className="hover:text-gold">Lamisent</Link>
        <span className="mx-2">/</span>
        <Link to="/shop" className="hover:text-gold">{t("nav.shop")}</Link>
        <span className="mx-2">/</span>
        <span className="text-gold">{product!.name}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2">
        <div className="aspect-square hairline-border bg-charcoal/30 overflow-hidden">
          <img
            src={product!.hero_image || bottle}
            alt={product!.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <div className="text-[11px] tracking-[0.4em] text-gold uppercase">
            {t("product.inspiredBy")} {product!.inspired_by}
          </div>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl">{product!.name}</h1>
          <p className="mt-3 text-muted-foreground italic">
            {locale === "de" ? product!.tagline_de : product!.tagline_en}
          </p>
          <div className="gold-line my-6 max-w-[80px]" />

          <p className="text-foreground/85 leading-relaxed">
            {locale === "de" ? product!.description_de : product!.description_en}
          </p>

          {product!.notes?.length ? (
            <div className="mt-6">
              <div className="text-[11px] tracking-[0.3em] text-gold uppercase mb-2">{t("product.notes")}</div>
              <div className="flex flex-wrap gap-2">
                {product!.notes.map((n) => (
                  <span key={n} className="hairline-border px-3 py-1 text-xs">{n}</span>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-8">
            <div className="text-[11px] tracking-[0.3em] text-gold uppercase mb-3">{t("product.size")}</div>
            <div className="grid grid-cols-4 gap-2">
              {variants.map((v) => {
                const active = v.id === variantId;
                return (
                  <button
                    key={v.id}
                    onClick={() => setVariantId(v.id)}
                    className={
                      "p-3 text-center border transition " +
                      (active
                        ? "border-gold bg-gold/10"
                        : "border-border hover:border-gold/60")
                    }
                  >
                    <div className="font-display text-lg">{v.size_ml} ML</div>
                    <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                      {SIZE_LABEL_DE[v.size_ml]}
                    </div>
                    <div className="mt-2 text-sm tabular-nums">{formatEUR(v.price_cents, locale)}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <div className="inline-flex items-center hairline-border h-12">
              <button className="px-3 h-full hover:text-gold" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="−"><Minus className="h-3 w-3" /></button>
              <span className="px-4 tabular-nums">{qty}</span>
              <button className="px-3 h-full hover:text-gold" onClick={() => setQty(qty + 1)} aria-label="+"><Plus className="h-3 w-3" /></button>
            </div>
            <Button
              className="flex-1 bg-gold text-gold-foreground hover:bg-gold/90 rounded-none h-12 tracking-[0.2em] uppercase text-xs"
              onClick={() =>
                add(
                  {
                    variantId: variant.id,
                    productSlug: product!.slug,
                    productName: product!.name,
                    inspiredBy: product!.inspired_by,
                    sizeMl: variant.size_ml,
                    unitPriceCents: variant.price_cents,
                    image: product!.hero_image,
                  },
                  qty,
                )
              }
            >
              {t("product.addToCart")} · {formatEUR(variant.price_cents * qty, locale)}
            </Button>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4 text-center text-[10px] uppercase tracking-[0.2em] text-foreground/70">
            <div className="hairline-border py-4 flex flex-col items-center gap-2"><Sparkles className="h-4 w-4 text-gold" /> {locale === "de" ? "12h Haltbarkeit" : "12h longevity"}</div>
            <div className="hairline-border py-4 flex flex-col items-center gap-2"><Truck className="h-4 w-4 text-gold" /> {locale === "de" ? "Versand 4,90 €" : "Shipping €4.90"}</div>
            <div className="hairline-border py-4 flex flex-col items-center gap-2"><ShieldCheck className="h-4 w-4 text-gold" /> {locale === "de" ? "14 Tage Rückgabe" : "14-day returns"}</div>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            {t("product.shippingBody")}
          </p>
        </div>
      </div>
    </div>
  );
}