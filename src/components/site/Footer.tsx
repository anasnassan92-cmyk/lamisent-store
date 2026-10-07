import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Music2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border/40 mt-24 bg-charcoal/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div>
            <div className="font-display italic text-gold text-3xl">Lamisent</div>
            <div className="font-display tracking-[0.4em] text-gold text-[10px] mt-1">ESSENCE</div>
            <p className="mt-6 text-sm text-muted-foreground max-w-xs">
              {t("footer.tagline")}
            </p>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-[0.3em] text-gold mb-5">{t("footer.shop")}</div>
            <ul className="space-y-3 text-sm">
              <li><Link to="/shop" className="hover:text-gold transition">{t("nav.shop")}</Link></li>
              <li><Link to="/about" className="hover:text-gold transition">{t("nav.about")}</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-[0.3em] text-gold mb-5">{t("footer.support")}</div>
            <ul className="space-y-3 text-sm">
              <li><Link to="/contact" className="hover:text-gold transition">{t("nav.contact")}</Link></li>
              <li><Link to="/faq" className="hover:text-gold transition">{t("nav.faq")}</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-[0.3em] text-gold mb-5">{t("footer.legal")}</div>
            <ul className="space-y-3 text-sm">
              <li><Link to="/legal/impressum" className="hover:text-gold transition">{t("footer.impressum")}</Link></li>
              <li><Link to="/legal/datenschutz" className="hover:text-gold transition">{t("footer.datenschutz")}</Link></li>
              <li><Link to="/legal/agb" className="hover:text-gold transition">{t("footer.agb")}</Link></li>
              <li><Link to="/legal/widerruf" className="hover:text-gold transition">{t("footer.widerruf")}</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-14 pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-muted-foreground">© {year} Lamisent Essence · {t("footer.rights")}</p>
          <div className="flex items-center gap-5">
            <a aria-label="Instagram" href="#" className="text-foreground/70 hover:text-gold"><Instagram className="h-4 w-4" /></a>
            <a aria-label="TikTok" href="#" className="text-foreground/70 hover:text-gold"><Music2 className="h-4 w-4" /></a>
            <a aria-label="Facebook" href="#" className="text-foreground/70 hover:text-gold"><Facebook className="h-4 w-4" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}