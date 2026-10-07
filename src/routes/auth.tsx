import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Anmelden — Lamisent Essence" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Auth,
});

function Auth() {
  const { t, locale } = useI18n();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/account" });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "");
    const password = String(fd.get("password") || "");
    try {
      const res = mode === "signin"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/account` } });
      if (res.error) throw res.error;
      toast.success(mode === "signin" ? (locale === "de" ? "Willkommen zurück." : "Welcome back.") : (locale === "de" ? "Bitte E-Mail bestätigen." : "Please confirm your email."));
      if (res.data.session) navigate({ to: "/account" });
    } catch (err: any) {
      toast.error(err?.message || "Error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-6 py-20">
      <div className="text-center">
        <div className="text-[11px] tracking-[0.4em] text-gold uppercase">Lamisent</div>
        <h1 className="font-display text-4xl mt-3">{mode === "signin" ? t("auth.signin") : t("auth.signup")}</h1>
        <div className="gold-line mt-6 mx-auto max-w-[80px]" />
      </div>
      <form onSubmit={onSubmit} className="mt-10 space-y-5 hairline-border p-8 bg-charcoal/30">
        <div>
          <Label htmlFor="email">{t("auth.email")}</Label>
          <Input id="email" name="email" type="email" required autoComplete="email" className="mt-2 bg-background border-border" />
        </div>
        <div>
          <Label htmlFor="password">{t("auth.password")}</Label>
          <Input id="password" name="password" type="password" required minLength={6} autoComplete={mode === "signin" ? "current-password" : "new-password"} className="mt-2 bg-background border-border" />
        </div>
        <Button type="submit" disabled={busy} className="w-full bg-gold text-gold-foreground hover:bg-gold/90 rounded-none h-12 tracking-[0.2em] uppercase text-xs">
          {busy ? "…" : t("auth.continue")}
        </Button>
        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="block w-full text-center text-xs text-muted-foreground hover:text-gold"
        >
          {mode === "signin" ? t("auth.toSignup") : t("auth.toSignin")}
        </button>
      </form>
    </div>
  );
}