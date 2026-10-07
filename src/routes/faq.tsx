import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Lamisent Essence" },
      { name: "description", content: "Häufig gestellte Fragen zu Lamisent Essence — Versand, Rückgabe, Düfte." },
    ],
  }),
  component: FAQ,
});

function FAQ() {
  const { locale } = useI18n();
  const items = locale === "de" ? [
    { q: "Sind eure Düfte Originale?", a: "Nein. Wir produzieren eigene Kreationen, die von bekannten Düften der großen Häuser inspiriert sind. Gleiche Komposition, bis zu 90 % günstiger." },
    { q: "Wie lange hält der Duft?", a: "Unsere Extrait de Parfum-Konzentration sorgt für 8–12 Stunden Haltbarkeit auf der Haut." },
    { q: "Versandkosten und Lieferzeit?", a: "Versand in Deutschland: 4,90 € (gratis ab 60 €). Lieferzeit: 2–4 Werktage mit DHL." },
    { q: "Rückgaberecht?", a: "Du hast 14 Tage Widerrufsrecht ab Erhalt der Ware. Ungeöffnete Produkte kannst du kostenfrei zurücksenden." },
    { q: "Zahlungsarten?", a: "Wir akzeptieren Kreditkarte, Apple Pay, Google Pay, SEPA-Lastschrift, Klarna und SOFORT — sicher abgewickelt über Stripe." },
  ] : [
    { q: "Are your fragrances originals?", a: "No. We create our own compositions inspired by well-known designer scents — same composition, up to 90% lower price." },
    { q: "How long does the fragrance last?", a: "Our Extrait de Parfum concentration delivers 8–12 hours of longevity on skin." },
    { q: "Shipping cost and delivery time?", a: "Shipping in Germany: €4.90 (free over €60). Delivery in 2–4 business days via DHL." },
    { q: "Returns?", a: "You have a 14-day right of withdrawal from receipt. Unopened products can be returned free of charge." },
    { q: "Payment methods?", a: "Credit card, Apple Pay, Google Pay, SEPA, Klarna and SOFORT — handled securely via Stripe." },
  ];

  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div className="text-center">
        <div className="text-[11px] tracking-[0.4em] text-gold uppercase">FAQ</div>
        <h1 className="font-display text-5xl mt-4">{locale === "de" ? "Häufige Fragen" : "Frequently asked"}</h1>
        <div className="gold-line mt-6 mx-auto max-w-[120px]" />
      </div>
      <Accordion type="single" collapsible className="mt-10">
        {items.map((i, idx) => (
          <AccordionItem key={idx} value={String(idx)} className="border-border/40">
            <AccordionTrigger className="text-left text-base hover:text-gold hover:no-underline">{i.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{i.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}