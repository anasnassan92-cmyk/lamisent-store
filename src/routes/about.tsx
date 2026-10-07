import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
const heroPortrait = "/__l5e/assets-v1/972dca59-6c65-4c2b-bc7f-36495999a30b/hero-portrait.png";
const brandKit = "/__l5e/assets-v1/1fe43fee-e173-4b16-b7a5-2a80ae41022c/brand-kit.png";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Marke — Lamisent Essence" },
      { name: "description", content: "Die Geschichte hinter Lamisent Essence — moderne Männlichkeit, kompromisslose Qualität, faire Preise." },
    ],
  }),
  component: About,
});

function About() {
  const { locale } = useI18n();
  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <div className="text-center">
        <div className="text-[11px] tracking-[0.4em] text-gold uppercase">{locale === "de" ? "Die Marke" : "The brand"}</div>
        <h1 className="font-display text-5xl sm:text-6xl mt-4">Lamisent Essence</h1>
        <div className="gold-line mt-8 mx-auto max-w-[120px]" />
        <p className="mt-8 text-lg italic text-foreground/85">Impress. Inspire. Remain.</p>
      </div>

      <div className="mt-16 grid gap-12 lg:grid-cols-2 items-center">
        <img src={heroPortrait} alt="" className="hairline-border w-full" />
        <div className="space-y-6 text-foreground/85 leading-relaxed">
          <p>
            {locale === "de"
              ? "Lamisent Essence ist die Verkörperung moderner Männlichkeit — selbstbewusst, raffiniert und unvergesslich. Geschaffen für den Mann, der einen Eindruck hinterlässt, ohne ein Wort zu sagen."
              : "Lamisent Essence is the embodiment of modern masculinity — confident, refined, and unforgettable. Crafted for the man who leaves an impression without saying a word."}
          </p>
          <p>
            {locale === "de"
              ? "Unsere Düfte werden in Deutschland hergestellt und mit den gleichen Rohstoffen komponiert, die auch die feinsten Häuser verwenden. Hohe Konzentration (Extrait de Parfum), lange Haltbarkeit und eine kompromisslose Markenästhetik — zu einem Bruchteil des Preises."
              : "Our fragrances are made in Germany using the same raw materials as the world's finest houses. High concentration (Extrait de Parfum), long-lasting performance, and a no-compromise aesthetic — at a fraction of the price."}
          </p>
        </div>
      </div>

      <div className="mt-20">
        <h2 className="font-display text-3xl text-center">{locale === "de" ? "Unsere Werte" : "Our values"}</h2>
        <div className="gold-line mt-6 mx-auto max-w-[80px]" />
        <div className="mt-10 grid sm:grid-cols-3 gap-6">
          {[
            { t: locale === "de" ? "Premium Ingredienzien" : "Premium ingredients", d: locale === "de" ? "Hochwertige Rohstoffe aus Grasse und der ganzen Welt." : "High-grade raw materials from Grasse and around the world." },
            { t: locale === "de" ? "Lange Haltbarkeit" : "Long-lasting", d: locale === "de" ? "Extrait-Konzentration für 8–12h Performance." : "Extrait concentration for 8–12h performance." },
            { t: locale === "de" ? "Made in Germany" : "Made in Germany", d: locale === "de" ? "Komposition und Abfüllung in Deutschland." : "Composed and bottled in Germany." },
          ].map((v) => (
            <div key={v.t} className="hairline-border p-6 bg-charcoal/30">
              <h3 className="font-display text-lg text-gold">{v.t}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{v.d}</p>
            </div>
          ))}
        </div>
      </div>

      <img src={brandKit} alt="Lamisent Brand Kit" className="mt-20 hairline-border w-full" />
    </div>
  );
}