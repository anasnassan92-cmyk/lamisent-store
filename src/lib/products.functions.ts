import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
}

export type ProductRow = Database["public"]["Tables"]["products"]["Row"];
export type VariantRow = Database["public"]["Tables"]["product_variants"]["Row"];
export type ProductWithVariants = ProductRow & { variants: VariantRow[] };

export const listProducts = createServerFn({ method: "GET" }).handler(async (): Promise<ProductWithVariants[]> => {
  const supabase = publicClient();
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  const { data: variants, error: vErr } = await supabase.from("product_variants").select("*");
  if (vErr) throw new Error(vErr.message);
  return (products ?? []).map((p) => ({
    ...p,
    variants: (variants ?? []).filter((v) => v.product_id === p.id).sort((a, b) => a.size_ml - b.size_ml),
  }));
});

export const getProduct = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => {
    if (!data || typeof data.slug !== "string") throw new Error("slug required");
    return { slug: data.slug };
  })
  .handler(async ({ data }): Promise<ProductWithVariants | null> => {
    const supabase = publicClient();
    const { data: product, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", data.slug)
      .eq("active", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!product) return null;
    const { data: variants, error: vErr } = await supabase
      .from("product_variants")
      .select("*")
      .eq("product_id", product.id)
      .order("size_ml", { ascending: true });
    if (vErr) throw new Error(vErr.message);
    return { ...product, variants: variants ?? [] };
  });