import { Link, useRouterState } from "@tanstack/react-router";
import { ShoppingBag, User, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

function Wordmark({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn("inline-flex flex-col leading-none", className)}>
      <span className="font-display text-2xl text-gold tracking-wide" style={{ fontStyle: "italic", fontWeight: 500 }}>
        Lamisent
      </span>
      <span className="font-display text-[10px] text-gold tracking-[0.4em] mt-0.5">ESSENCE</span>
    </Link>
  );
}

export function Header() {
  const { t, locale, setLocale } = useI18n();
  const { totalItems, setOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSignedIn(!!s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const links = [
    { to: "/" as const, label: t("nav.home") },
    { to: "/shop" as const, label: t("nav.shop") },
    { to: "/about" as const, label: t("nav.about") },
    { to: "/contact" as const, label: t("nav.contact") },
    { to: "/faq" as const, label: t("nav.faq") },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-all duration-300",
        scrolled ? "bg-background/95 backdrop-blur-md border-b border-border/40" : "bg-transparent",
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center gap-10">
            <Wordmark />
            <nav className="hidden lg:flex items-center gap-8">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="text-[11px] uppercase tracking-[0.25em] text-foreground/80 hover:text-gold transition-colors"
                  activeProps={{ className: "text-gold" }}
                  activeOptions={{ exact: l.to === "/" }}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-5">
            <button
              onClick={() => setLocale(locale === "de" ? "en" : "de")}
              className="hidden sm:inline-flex text-[11px] uppercase tracking-[0.25em] text-foreground/70 hover:text-gold"
              aria-label="Switch language"
            >
              {locale === "de" ? "DE / EN" : "EN / DE"}
            </button>
            <Link
              to={signedIn ? "/account" : "/auth"}
              className="text-foreground/80 hover:text-gold"
              aria-label={t("nav.account")}
            >
              <User className="h-5 w-5" />
            </Link>
            <button
              onClick={() => setOpen(true)}
              className="relative text-foreground/80 hover:text-gold"
              aria-label={t("nav.cart")}
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 h-4 min-w-[16px] px-1 rounded-full bg-gold text-gold-foreground text-[10px] font-medium flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden text-foreground/80 hover:text-gold"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
      {mobileOpen && (
        <div className="lg:hidden border-t border-border/40 bg-background">
          <nav className="px-4 py-6 flex flex-col gap-4">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-sm uppercase tracking-[0.25em] text-foreground/80 hover:text-gold"
              >
                {l.label}
              </Link>
            ))}
            <button
              onClick={() => setLocale(locale === "de" ? "en" : "de")}
              className="text-left text-sm uppercase tracking-[0.25em] text-foreground/70 hover:text-gold"
            >
              {locale === "de" ? "Switch to English" : "Auf Deutsch wechseln"}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}