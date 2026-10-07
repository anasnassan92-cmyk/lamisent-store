import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/legal/datenschutz")({
  head: () => ({ meta: [{ title: "Datenschutz — Lamisent Essence" }] }),
  component: Datenschutz,
});

function Datenschutz() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="font-display text-4xl">Datenschutzerklärung</h1>
      <div className="gold-line my-6 max-w-[80px]" />
      <div className="space-y-4 text-foreground/85 leading-relaxed text-sm">
        <p>Wir verarbeiten personenbezogene Daten ausschließlich gemäß DSGVO. Verantwortlicher ist Lamisent Essence (siehe Impressum).</p>
        <h2 className="font-display text-xl text-gold mt-6">Zahlungen</h2>
        <p>Bezahlvorgänge werden über Stripe Inc. abgewickelt. Es gilt die Datenschutzerklärung von Stripe.</p>
        <h2 className="font-display text-xl text-gold mt-6">Konten</h2>
        <p>Bei Registrierung speichern wir E-Mail und Bestellhistorie zur Vertragsabwicklung.</p>
        <h2 className="font-display text-xl text-gold mt-6">Cookies</h2>
        <p>Technisch notwendige Cookies werden ohne Einwilligung gesetzt. Analyse-Cookies erst nach ausdrücklicher Zustimmung.</p>
        <p className="text-muted-foreground">Vollständige Datenschutzerklärung wird vor Live-Gang ergänzt.</p>
      </div>
    </article>
  );
}