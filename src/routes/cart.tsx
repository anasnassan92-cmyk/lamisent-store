import { createFileRoute, Link } from "@tanstack/react-router";
import { useCart } from "@/lib/cart";
import { useI18n } from "@/lib/i18n";
import { formatEUR } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Minus, Plus, X } from "lucide-react";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Warenkorb — Lamisent Essence" }, { name: "robots", content: "noindex" }] }),
  component: CartPage,
});

function CartPage() {
  const { items, setQty, remove, subtotalCents } = useCart();
  const { t, locale } = useI18n();
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="font-display text-4xl sm:text-5xl">{t("cart.title")}</h1>
      <div className="gold-line mt-6 max-w-[80px]" />
      {items.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-muted-foreground">{t("cart.empty")}</p>
          <Button asChild className="mt-6 bg-gold text-gold-foreground hover:bg-gold/90 rounded-none h-12 px-8 tracking-[0.2em] uppercase text-xs">
            <Link to="/shop">{t("cart.shopCta")}</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_360px]">
          <ul className="space-y-6">
            {items.map((it) => (
              <li key={it.variantId} className="flex gap-6 pb-6 border-b border-border/40">
                <div className="h-28 w-28 hairline-border bg-charcoal overflow-hidden shrink-0">
                  {it.image ? <img src={it.image} alt={it.productName} className="h-full w-full object-cover" /> : null}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between gap-4">
                    <div>
                      <Link to="/shop/$slug" params={{ slug: it.productSlug }} className="font-display text-lg hover:text-gold">{it.productName}</Link>
                      <p className="text-xs text-muted-foreground">{t("product.inspiredBy")} {it.inspiredBy}</p>
                      <p className="text-xs text-gold mt-1">{it.sizeMl} ML</p>
                    </div>
                    <button onClick={() => remove(it.variantId)} className="text-muted-foreground hover:text-gold"><X className="h-4 w-4" /></button>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="inline-flex items-center hairline-border">
                      <button className="p-2 hover:text-gold" onClick={() => setQty(it.variantId, it.quantity - 1)}><Minus className="h-3 w-3" /></button>
                      <span className="px-3 text-sm tabular-nums">{it.quantity}</span>
                      <button className="p-2 hover:text-gold" onClick={() => setQty(it.variantId, it.quantity + 1)}><Plus className="h-3 w-3" /></button>
                    </div>
                    <span className="tabular-nums">{formatEUR(it.unitPriceCents * it.quantity, locale)}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <aside className="h-fit hairline-border p-6 bg-charcoal/30 sticky top-28">
            <h2 className="font-display text-xl">{locale === "de" ? "Bestellübersicht" : "Order summary"}</h2>
            <div className="gold-line my-4 max-w-[60px]" />
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">{t("cart.subtotal")}</span><span className="tabular-nums">{formatEUR(subtotalCents, locale)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">{t("cart.shipping")}</span><span className="text-muted-foreground">{t("cart.shipping.note")}</span></div>
              <div className="border-t border-border/40 pt-3 flex justify-between font-display text-lg"><span>{t("cart.total")}</span><span className="text-gold tabular-nums">{formatEUR(subtotalCents, locale)}</span></div>
              <p className="text-[11px] text-muted-foreground">{t("cart.vat")}</p>
            </div>
            <Button asChild className="mt-6 w-full bg-gold text-gold-foreground hover:bg-gold/90 rounded-none h-12 tracking-[0.2em] uppercase text-xs">
              <Link to="/checkout">{t("cart.checkout")}</Link>
            </Button>
          </aside>
        </div>
      )}
    </div>
  );
}