import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/legal/widerruf")({
  head: () => ({ meta: [{ title: "Widerrufsbelehrung — Lamisent Essence" }] }),
  component: Widerruf,
});

function Widerruf() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="font-display text-4xl">Widerrufsbelehrung</h1>
      <div className="gold-line my-6 max-w-[80px]" />
      <div className="space-y-4 text-foreground/85 leading-relaxed text-sm">
        <p><strong>Widerrufsrecht</strong><br />Du hast das Recht, binnen 14 Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.</p>
        <p>Die Widerrufsfrist beträgt 14 Tage ab dem Tag, an dem du oder ein von dir benannter Dritter, der nicht der Beförderer ist, die Ware in Besitz genommen hast.</p>
        <p>Um dein Widerrufsrecht auszuüben, musst du uns per E-Mail an <a href="mailto:hello@lamisent.com" className="text-gold">hello@lamisent.com</a> mittels einer eindeutigen Erklärung informieren.</p>
        <h2 className="font-display text-xl text-gold mt-4">Folgen des Widerrufs</h2>
        <p>Wir erstatten alle Zahlungen, die wir von dir erhalten haben, unverzüglich und spätestens binnen 14 Tagen ab dem Tag, an dem die Widerrufserklärung bei uns eingegangen ist.</p>
      </div>
    </article>
  );
}