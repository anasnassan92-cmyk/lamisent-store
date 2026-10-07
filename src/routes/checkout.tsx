import { createFileRoute, Link } from "@tanstack/react-router";
import { useCart } from "@/lib/cart";
import { useI18n } from "@/lib/i18n";
import { formatEUR } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Kasse — Lamisent Essence" }, { name: "robots", content: "noindex" }] }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { items, subtotalCents } = useCart();
  const { t, locale } = useI18n();
  const shippingCents = subtotalCents >= 6000 ? 0 : 490;
  const totalCents = subtotalCents + shippingCents;

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-4xl sm:text-5xl">{t("checkout.title")}</h1>
      <div className="gold-line mt-6 max-w-[80px]" />

      {items.length === 0 ? (
        <div className="mt-12 text-center text-muted-foreground">
          {t("cart.empty")}
          <div className="mt-6">
            <Button asChild className="bg-gold text-gold-foreground hover:bg-gold/90 rounded-none h-12 px-8 tracking-[0.2em] uppercase text-xs">
              <Link to="/shop">{t("cart.shopCta")}</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-10 space-y-8">
          <div className="hairline-border p-6 bg-charcoal/30">
            <h2 className="font-display text-xl">{locale === "de" ? "Übersicht" : "Summary"}</h2>
            <ul className="mt-4 divide-y divide-border/40">
              {items.map((i) => (
                <li key={i.variantId} className="py-3 flex justify-between text-sm">
                  <span>{i.productName} · {i.sizeMl}ML × {i.quantity}</span>
                  <span className="tabular-nums">{formatEUR(i.unitPriceCents * i.quantity, locale)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">{t("cart.subtotal")}</span><span className="tabular-nums">{formatEUR(subtotalCents, locale)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">{t("cart.shipping")}</span><span className="tabular-nums">{shippingCents === 0 ? (locale === "de" ? "Gratis" : "Free") : formatEUR(shippingCents, locale)}</span></div>
              <div className="flex justify-between font-display text-lg pt-3 border-t border-border/40"><span>{t("cart.total")}</span><span className="text-gold tabular-nums">{formatEUR(totalCents, locale)}</span></div>
              <p className="text-[11px] text-muted-foreground">{t("cart.vat")}</p>
            </div>
          </div>

          <div className="hairline-border p-6 bg-charcoal/20">
            <div className="flex items-center gap-2 text-gold">
              <Lock className="h-4 w-4" />
              <span className="text-[11px] tracking-[0.25em] uppercase">Stripe · Secure</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              {t("checkout.notReady")}
            </p>
            <Button disabled className="mt-6 w-full bg-gold text-gold-foreground rounded-none h-12 tracking-[0.2em] uppercase text-xs opacity-60">
              {t("checkout.cta")}
            </Button>
            <p className="mt-3 text-[11px] text-muted-foreground">
              {locale === "de"
                ? "Sobald dein Stripe-Schlüssel hinterlegt ist, leiten wir dich hier zur sicheren Stripe-Kasse weiter."
                : "Once your Stripe key is connected, this button will redirect you to Stripe's secure checkout."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}