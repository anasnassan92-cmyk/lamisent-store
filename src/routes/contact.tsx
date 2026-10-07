import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { submitContact } from "@/lib/contact.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, MapPin, Clock } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Kontakt — Lamisent Essence" },
      { name: "description", content: "Kontaktiere Lamisent Essence — wir antworten innerhalb von 24 Stunden." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const { t, locale } = useI18n();
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    try {
      await submitContact({
        data: {
          name: String(fd.get("name") || ""),
          email: String(fd.get("email") || ""),
          subject: String(fd.get("subject") || ""),
          message: String(fd.get("message") || ""),
        },
      });
      (e.target as HTMLFormElement).reset();
      toast.success(t("contact.sent"));
    } catch (err: any) {
      toast.error(err?.message || "Error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <div className="text-center">
        <div className="text-[11px] tracking-[0.4em] text-gold uppercase">{t("nav.contact")}</div>
        <h1 className="font-display text-5xl mt-4">{t("contact.title")}</h1>
        <div className="gold-line mt-6 mx-auto max-w-[120px]" />
        <p className="mt-4 text-muted-foreground">{t("contact.sub")}</p>
      </div>

      <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_320px]">
        <form onSubmit={onSubmit} className="space-y-5 hairline-border p-8 bg-charcoal/30">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <Label htmlFor="name">{t("contact.name")}</Label>
              <Input id="name" name="name" required className="mt-2 bg-background border-border" />
            </div>
            <div>
              <Label htmlFor="email">{t("auth.email")}</Label>
              <Input id="email" name="email" type="email" required className="mt-2 bg-background border-border" />
            </div>
          </div>
          <div>
            <Label htmlFor="subject">{t("contact.subject")}</Label>
            <Input id="subject" name="subject" className="mt-2 bg-background border-border" />
          </div>
          <div>
            <Label htmlFor="message">{t("contact.message")}</Label>
            <Textarea id="message" name="message" required rows={6} className="mt-2 bg-background border-border" />
          </div>
          <Button type="submit" disabled={busy} className="bg-gold text-gold-foreground hover:bg-gold/90 rounded-none h-12 px-8 tracking-[0.2em] uppercase text-xs">
            {busy ? "…" : t("contact.send")}
          </Button>
        </form>

        <aside className="space-y-6 text-sm">
          <div className="hairline-border p-6 bg-charcoal/30">
            <Mail className="h-4 w-4 text-gold" />
            <div className="mt-3 text-[11px] uppercase tracking-[0.25em] text-gold">E-Mail</div>
            <a href="mailto:hello@lamisent.com" className="block mt-1 hover:text-gold">hello@lamisent.com</a>
          </div>
          <div className="hairline-border p-6 bg-charcoal/30">
            <MapPin className="h-4 w-4 text-gold" />
            <div className="mt-3 text-[11px] uppercase tracking-[0.25em] text-gold">{locale === "de" ? "Standort" : "Location"}</div>
            <p className="mt-1 text-muted-foreground">Berlin · Deutschland</p>
          </div>
          <div className="hairline-border p-6 bg-charcoal/30">
            <Clock className="h-4 w-4 text-gold" />
            <div className="mt-3 text-[11px] uppercase tracking-[0.25em] text-gold">{locale === "de" ? "Antwortzeit" : "Response time"}</div>
            <p className="mt-1 text-muted-foreground">{locale === "de" ? "Mo–Fr · innerhalb 24h" : "Mon–Fri · within 24h"}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}