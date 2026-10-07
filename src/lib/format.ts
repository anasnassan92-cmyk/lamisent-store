export function formatEUR(cents: number, locale: "de" | "en" = "de") {
  return new Intl.NumberFormat(locale === "de" ? "de-DE" : "en-IE", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export const SIZES = [9, 30, 50, 100] as const;
export const SIZE_LABEL_DE: Record<number, string> = {
  9: "Travel",
  30: "Classic",
  50: "Signature",
  100: "Maximum",
};