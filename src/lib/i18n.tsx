import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Locale = "de" | "en";

type Dict = Record<string, { de: string; en: string }>;

const T: Dict = {
  "nav.home": { de: "Start", en: "Home" },
  "nav.shop": { de: "Shop", en: "Shop" },
  "nav.about": { de: "Marke", en: "About" },
  "nav.contact": { de: "Kontakt", en: "Contact" },
  "nav.faq": { de: "FAQ", en: "FAQ" },
  "nav.account": { de: "Konto", en: "Account" },
  "nav.cart": { de: "Warenkorb", en: "Cart" },
  "nav.signin": { de: "Anmelden", en: "Sign in" },
  "nav.signout": { de: "Abmelden", en: "Sign out" },

  "hero.tagline": { de: "Impress. Inspire. Remain.", en: "Impress. Inspire. Remain." },
  "hero.subtitle": {
    de: "Premium Extrait de Parfum. Inspiriert von den feinsten Düften der Welt.",
    en: "Premium Extrait de Parfum. Inspired by the world's finest fragrances.",
  },
  "hero.cta": { de: "Kollektion entdecken", en: "Discover the collection" },

  "home.featured": { de: "Signature-Düfte", en: "Signature scents" },
  "home.featured.sub": {
    de: "Eine kuratierte Auswahl aus unserer Inspired Collection.",
    en: "A curated selection from our Inspired Collection.",
  },
  "home.values.title": { de: "Eine Essenz. Vier Formate.", en: "One essence. Four formats." },
  "home.values.sub": {
    de: "Jeder Duft erhältlich in 9 · 30 · 50 · 100 ML — ab 15,99 €.",
    en: "Every fragrance available in 9 · 30 · 50 · 100 ML — from €15.99.",
  },

  "shop.title": { de: "Die Kollektion", en: "The collection" },
  "shop.subtitle": {
    de: "11 Signature-Düfte. Premium Extrait de Parfum. Inspiriert von den feinsten Häusern.",
    en: "11 signature scents. Premium Extrait de Parfum. Inspired by the finest houses.",
  },
  "shop.from": { de: "ab", en: "from" },
  "shop.filter.all": { de: "Alle", en: "All" },
  "shop.viewProduct": { de: "Ansehen", en: "View" },

  "product.inspiredBy": { de: "Inspiriert von", en: "Inspired by" },
  "product.notes": { de: "Duftnoten", en: "Notes" },
  "product.size": { de: "Größe", en: "Size" },
  "product.qty": { de: "Menge", en: "Quantity" },
  "product.addToCart": { de: "In den Warenkorb", en: "Add to cart" },
  "product.shipping": { de: "Versand & Rückgabe", en: "Shipping & returns" },
  "product.shippingBody": {
    de: "Versand in Deutschland 4,90 € · ab 60 € versandkostenfrei. 14 Tage Widerrufsrecht.",
    en: "Shipping in Germany €4.90 · free over €60. 14-day right of withdrawal.",
  },
  "product.longevity": { de: "Haltbarkeit", en: "Longevity" },
  "product.sillage": { de: "Sillage", en: "Sillage" },

  "cart.title": { de: "Warenkorb", en: "Cart" },
  "cart.empty": { de: "Dein Warenkorb ist leer.", en: "Your cart is empty." },
  "cart.shopCta": { de: "Zur Kollektion", en: "Shop the collection" },
  "cart.subtotal": { de: "Zwischensumme", en: "Subtotal" },
  "cart.shipping": { de: "Versand", en: "Shipping" },
  "cart.shipping.note": { de: "Wird im Checkout berechnet", en: "Calculated at checkout" },
  "cart.total": { de: "Gesamt", en: "Total" },
  "cart.checkout": { de: "Zur Kasse", en: "Checkout" },
  "cart.continue": { de: "Weiter einkaufen", en: "Continue shopping" },
  "cart.vat": { de: "Inkl. MwSt.", en: "VAT included" },
  "cart.remove": { de: "Entfernen", en: "Remove" },

  "checkout.title": { de: "Kasse", en: "Checkout" },
  "checkout.notReady": {
    de: "Die Zahlung ist noch nicht aktiv. Bitte hinterlege deinen Stripe-Schlüssel.",
    en: "Payment isn't connected yet. Add your Stripe secret to enable checkout.",
  },
  "checkout.cta": { de: "Sicher bezahlen mit Stripe", en: "Pay securely with Stripe" },

  "footer.tagline": { de: "Impress. Inspire. Remain.", en: "Impress. Inspire. Remain." },
  "footer.shop": { de: "Shop", en: "Shop" },
  "footer.support": { de: "Support", en: "Support" },
  "footer.legal": { de: "Rechtliches", en: "Legal" },
  "footer.follow": { de: "Folge uns", en: "Follow us" },
  "footer.rights": { de: "Alle Rechte vorbehalten.", en: "All rights reserved." },
  "footer.impressum": { de: "Impressum", en: "Imprint" },
  "footer.datenschutz": { de: "Datenschutz", en: "Privacy" },
  "footer.agb": { de: "AGB", en: "Terms" },
  "footer.widerruf": { de: "Widerruf", en: "Withdrawal" },

  "auth.signin": { de: "Anmelden", en: "Sign in" },
  "auth.signup": { de: "Registrieren", en: "Create account" },
  "auth.email": { de: "E-Mail", en: "Email" },
  "auth.password": { de: "Passwort", en: "Password" },
  "auth.continue": { de: "Weiter", en: "Continue" },
  "auth.google": { de: "Mit Google anmelden", en: "Continue with Google" },
  "auth.or": { de: "oder", en: "or" },
  "auth.toSignup": { de: "Noch kein Konto? Registrieren", en: "No account? Create one" },
  "auth.toSignin": { de: "Schon Kunde? Anmelden", en: "Already a customer? Sign in" },

  "contact.title": { de: "Kontakt", en: "Contact" },
  "contact.sub": { de: "Wir antworten innerhalb von 24 Stunden.", en: "We reply within 24 hours." },
  "contact.name": { de: "Name", en: "Name" },
  "contact.subject": { de: "Betreff", en: "Subject" },
  "contact.message": { de: "Nachricht", en: "Message" },
  "contact.send": { de: "Senden", en: "Send" },
  "contact.sent": { de: "Danke — wir melden uns in Kürze.", en: "Thank you — we'll be in touch soon." },
};

type Ctx = { locale: Locale; setLocale: (l: Locale) => void; t: (key: keyof typeof T | string) => string };
const I18nCtx = createContext<Ctx>({ locale: "de", setLocale: () => {}, t: (k) => String(k) });

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("de");
  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("lamisent.locale")) as Locale | null;
    if (saved === "de" || saved === "en") setLocaleState(saved);
  }, []);
  useEffect(() => {
    if (typeof document !== "undefined") document.documentElement.lang = locale;
  }, [locale]);
  const value = useMemo<Ctx>(() => ({
    locale,
    setLocale: (l) => {
      setLocaleState(l);
      if (typeof window !== "undefined") localStorage.setItem("lamisent.locale", l);
    },
    t: (key) => {
      const row = T[key as string];
      return row ? row[locale] : String(key);
    },
  }), [locale]);
  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}

export const useI18n = () => useContext(I18nCtx);