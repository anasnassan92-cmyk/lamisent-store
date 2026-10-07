import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/legal/agb")({
  head: () => ({ meta: [{ title: "AGB — Lamisent Essence" }] }),
  component: AGB,
});

function AGB() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="font-display text-4xl">Allgemeine Geschäftsbedingungen</h1>
      <div className="gold-line my-6 max-w-[80px]" />
      <div className="space-y-4 text-foreground/85 leading-relaxed text-sm">
        <h2 className="font-display text-xl text-gold">1. Geltungsbereich</h2>
        <p>Für alle Bestellungen über unseren Online-Shop gelten die nachfolgenden AGB.</p>
        <h2 className="font-display text-xl text-gold mt-4">2. Vertragspartner</h2>
        <p>Der Kaufvertrag kommt zustande mit Lamisent Essence (siehe Impressum).</p>
        <h2 className="font-display text-xl text-gold mt-4">3. Preise und Versand</h2>
        <p>Alle Preise verstehen sich inkl. der gesetzlichen MwSt. Versandkosten innerhalb Deutschlands: 4,90 €, ab 60 € gratis.</p>
        <h2 className="font-display text-xl text-gold mt-4">4. Zahlung</h2>
        <p>Zahlung erfolgt sicher über Stripe (Kreditkarte, Apple Pay, Google Pay, SEPA, Klarna, SOFORT).</p>
        <h2 className="font-display text-xl text-gold mt-4">5. Widerruf</h2>
        <p>Verbraucher haben ein 14-tägiges Widerrufsrecht. Details siehe Widerrufsbelehrung.</p>
      </div>
    </article>
  );
}