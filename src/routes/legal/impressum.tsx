import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/legal/impressum")({
  head: () => ({ meta: [{ title: "Impressum — Lamisent Essence" }] }),
  component: Impressum,
});

function Impressum() {
  const { locale } = useI18n();
  return (
    <article className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="font-display text-4xl">Impressum</h1>
      <div className="gold-line my-6 max-w-[80px]" />
      <div className="space-y-4 text-foreground/85 leading-relaxed">
        <p><strong>Angaben gemäß § 5 TMG</strong></p>
        <p>Lamisent Essence<br />Musterstraße 1<br />10115 Berlin · Deutschland</p>
        <p><strong>Kontakt</strong><br />E-Mail: hello@lamisent.com</p>
        <p><strong>Umsatzsteuer-ID</strong><br />Wird ergänzt sobald verfügbar.</p>
        <p className="text-sm text-muted-foreground">{locale === "de" ? "Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV." : "Responsible for content per § 55 (2) RStV."}</p>
      </div>
    </article>
  );
}