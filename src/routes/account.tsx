import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [{ title: "Konto — Lamisent Essence" }, { name: "robots", content: "noindex" }],
  }),
  component: Account,
});

function Account() {
  const { t, locale } = useI18n();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        navigate({ to: "/auth" });
      } else {
        setEmail(data.session.user.email ?? null);
        setLoading(false);
      }
    });
  }, [navigate]);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  if (loading) return <div className="mx-auto max-w-3xl px-6 py-20 text-muted-foreground">…</div>;

  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <div>
        <div className="text-[11px] tracking-[0.4em] text-gold uppercase">{t("nav.account")}</div>
        <h1 className="font-display text-5xl mt-3">{locale === "de" ? "Willkommen" : "Welcome"}</h1>
        <div className="gold-line mt-6 max-w-[80px]" />
      </div>

      <div className="mt-10 hairline-border p-8 bg-charcoal/30">
        <div className="text-[11px] uppercase tracking-[0.25em] text-gold">{t("auth.email")}</div>
        <p className="mt-1 text-lg">{email}</p>
      </div>

      <div className="mt-8 hairline-border p-8 bg-charcoal/30">
        <h2 className="font-display text-xl">{locale === "de" ? "Bestellungen" : "Orders"}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {locale === "de" ? "Deine Bestellungen erscheinen hier nach dem ersten Kauf." : "Your orders will appear here after your first purchase."}
        </p>
      </div>

      <div className="mt-8">
        <Button variant="outline" onClick={signOut} className="rounded-none border-gold/40 hover:bg-gold hover:text-gold-foreground tracking-[0.2em] uppercase text-xs h-12 px-8">
          {t("nav.signout")}
        </Button>
      </div>
    </div>
  );
}