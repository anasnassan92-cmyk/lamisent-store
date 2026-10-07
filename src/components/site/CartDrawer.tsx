import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { useI18n } from "@/lib/i18n";
import { formatEUR } from "@/lib/format";
import { Link } from "@tanstack/react-router";
import { Minus, Plus, X } from "lucide-react";

export function CartDrawer() {
  const { items, isOpen, setOpen, setQty, remove, subtotalCents } = useCart();
  const { t, locale } = useI18n();
  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="w-full sm:max-w-md bg-background border-l border-border/40 flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-display tracking-wider text-gold">{t("cart.title")}</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto -mx-6 px-6 py-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-6 py-20">
              <p className="text-muted-foreground">{t("cart.empty")}</p>
              <Button asChild variant="outline" onClick={() => setOpen(false)}>
                <Link to="/shop">{t("cart.shopCta")}</Link>
              </Button>
            </div>
          ) : (
            <ul className="space-y-5">
              {items.map((it) => (
                <li key={it.variantId} className="flex gap-4 pb-5 border-b border-border/40">
                  <div className="h-20 w-20 shrink-0 bg-charcoal hairline-border overflow-hidden">
                    {it.image ? <img src={it.image} alt={it.productName} className="h-full w-full object-cover" /> : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-display text-sm tracking-wide truncate">{it.productName}</p>
                        <p className="text-xs text-muted-foreground truncate">{t("product.inspiredBy")} {it.inspiredBy}</p>
                        <p className="text-xs text-gold mt-1">{it.sizeMl} ML</p>
                      </div>
                      <button onClick={() => remove(it.variantId)} aria-label={t("cart.remove")} className="text-muted-foreground hover:text-gold">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center hairline-border">
                        <button className="p-1.5 hover:text-gold" onClick={() => setQty(it.variantId, it.quantity - 1)} aria-label="−"><Minus className="h-3 w-3" /></button>
                        <span className="px-3 text-xs tabular-nums">{it.quantity}</span>
                        <button className="p-1.5 hover:text-gold" onClick={() => setQty(it.variantId, it.quantity + 1)} aria-label="+"><Plus className="h-3 w-3" /></button>
                      </div>
                      <span className="text-sm tabular-nums">{formatEUR(it.unitPriceCents * it.quantity, locale)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {items.length > 0 && (
          <SheetFooter className="flex-col gap-4 sm:flex-col">
            <div className="w-full flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t("cart.subtotal")}</span>
              <span className="text-lg tabular-nums">{formatEUR(subtotalCents, locale)}</span>
            </div>
            <p className="text-xs text-muted-foreground text-left w-full">{t("cart.vat")} · {t("cart.shipping.note")}</p>
            <Button asChild className="w-full bg-gold text-gold-foreground hover:bg-gold/90 rounded-none h-12 tracking-[0.2em] uppercase text-xs" onClick={() => setOpen(false)}>
              <Link to="/checkout">{t("cart.checkout")}</Link>
            </Button>
            <Button asChild variant="ghost" className="w-full" onClick={() => setOpen(false)}>
              <Link to="/shop">{t("cart.continue")}</Link>
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}