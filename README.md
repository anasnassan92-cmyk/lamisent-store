# Lamisent Essence — Perfume E-commerce Store

A bilingual (German / English) online store for Lamisent Essence, a perfume brand selling premium inspired fragrances (Extrait de Parfum) to the German market.

**Live:** https://lamisent.com

> This repository contains the **initial build** of the store. The live site at lamisent.com has continued to evolve since then, so features, content and integrations there may differ from the code here.

## About the project

Lamisent is a perfume e-commerce brand offering fragrances inspired by well-known designer scents, each available in several bottle sizes, sold primarily to customers in Germany.

Anas Alnaasan handled the project end to end:

- **Brand identity:** designed the Lamisent logo in Canva and built the brand kit (colour palette, typography, tone) with help from ChatGPT and Claude.
- **UI/UX:** a dark, premium look (matte black, brushed gold, warm amber and soft ivory) with Cinzel display type and Montserrat body text, plus rich media such as full-screen video sections and brand imagery.
- **Development:** built the store with Lovable and continued development with Claude, including the product catalogue, size variants, cart, accounts and checkout flow.
- **Payments:** integrated Stripe payments for the store. In this initial build the checkout page and the `orders` table are already set up for Stripe (session and payment-intent fields), and the payment hookup was finished on the live store.
- **SEO:** per-page meta and Open Graph tags, JSON-LD structured data, `robots.txt`, `sitemap.xml` and German-first content aimed at the German market.

## Features

**Storefront**
- **Home page:** hero video, a strip of value points, featured "signature" products loaded from the database, a full-screen video section presenting the four bottle sizes, and a brand-story section.
- **Shop (`/shop`):** the full collection, filterable by scent family (citrus, woody, amber, floral, spicy, aquatic, gourmand, oriental).
- **Product page (`/shop/$slug`):** "inspired by" reference, scent notes, size selector (9 / 30 / 50 / 100 ML, labelled Travel / Classic / Signature / Maximum) with a price per size, quantity picker and add-to-cart.
- **Cart:** a slide-out cart drawer plus a full `/cart` page. The cart is kept in `localStorage`, and quantities and line totals update live.
- **Checkout (`/checkout`):** order summary with shipping rules (EUR 4.90 within Germany, free over EUR 60), VAT note, and a Stripe checkout step (shown as a placeholder in this build).

**Accounts and contact**
- **Sign up / sign in (`/auth`):** email and password via Supabase Auth.
- **Account page (`/account`):** a protected page showing the signed-in email, an orders section and a sign-out button.
- **Contact form (`/contact`):** submitted through a TanStack Start server function, validated with Zod and stored in Supabase, with a validated insert policy on the database side.

**Content, localisation and compliance**
- German and English, switchable in the header. The chosen language is saved in `localStorage` and also sets `<html lang>`.
- An FAQ with accordion UI.
- German legal pages: Impressum, Datenschutz, AGB and Widerrufsbelehrung.

**SEO**
- Per-route `<title>`, meta description and Open Graph tags.
- JSON-LD structured data: `Organization` on the home page, `Product` and `Offer` on product pages (price per size and stock status), `FAQPage` on the FAQ.
- `robots.txt` that blocks cart, checkout, account and auth pages, plus `sitemap.xml`. Private pages are also marked `noindex`.

**Backend (Supabase)**
- Tables: `products`, `product_variants` (size, price, SKU, stock), `orders` and `order_items` (with Stripe session and payment-intent fields), `profiles`, `user_roles`, `contact_messages`.
- Row Level Security on every table: public read for active products, owner-only access to profiles and orders, and admin access through a `has_role()` security-definer function.
- A trigger creates a customer profile automatically on sign-up, and `updated_at` columns are kept current by triggers.

**Platform**
- Server-side rendering with TanStack Start, with route loaders that prefetch product data through TanStack Query.
- A custom SSR error page and root error boundary.

## Tech stack

- **Framework:** React 19, TanStack Start (SSR), TanStack Router (file-based routing), TanStack Query
- **Language and build:** TypeScript, Vite 8, Nitro
- **Styling and UI:** Tailwind CSS v4, shadcn/ui (Radix UI primitives), lucide-react icons, sonner toasts
- **Backend:** Supabase (PostgreSQL, Auth, Row Level Security)
- **Validation:** Zod
- **Payments:** Stripe (checkout flow and order schema)
- **Tooling:** ESLint, Prettier

## Project structure

```
lamisent-store/
├── public/                  # robots.txt, sitemap.xml
├── src/
│   ├── components/
│   │   ├── site/            # Header, Footer, CartDrawer
│   │   └── ui/              # shadcn/ui components
│   ├── hooks/               # use-mobile
│   ├── integrations/
│   │   └── supabase/        # browser/server clients, auth middleware, DB types
│   ├── lib/                 # cart context, i18n, formatting, server functions
│   ├── routes/              # file-based routes (home, shop, product, cart, checkout,
│   │                        #   auth, account, contact, faq, legal/*)
│   ├── router.tsx
│   ├── server.ts            # SSR entry with error handling
│   ├── start.ts             # TanStack Start middleware setup
│   └── styles.css           # Tailwind theme / brand design tokens
├── supabase/
│   ├── config.toml
│   └── migrations/          # schema, RLS policies, triggers
├── .env.example
└── package.json
```

## Getting started

```bash
npm install
cp .env.example .env    # then fill in your own Supabase project values
npm run dev
```

To create the database schema, apply the SQL files in `supabase/migrations/` to your own Supabase project, for example with `supabase db push` after linking the project and setting `project_id` in `supabase/config.toml`.

### Assets

Binary media is not included in this repository:

- `src/assets/bottle-50.jpg` is the fallback product image used by the home, shop and product pages. Add any image at this path before running or building, or the import will fail.
- The brand kit image, hero portrait and the two background videos (`brand-kit.png`, `hero-portrait.png`, `hero-video.mp4`, `section-video.mp4`) were served from Lovable's asset CDN (`/__l5e/assets-v1/...`). Those paths will not load outside Lovable hosting, so swap in your own files to see the full visual experience.

## Built with AI-assisted development

Anas Alnaasan built this project using Lovable and Claude as coding assistants. He provided the brand and visual design, wrote and refined the prompts, reviewed and tested the generated code, and handled integration and deployment. The AI tools sped up implementation, while the product decisions, design direction and quality control were his own.

## Author

**Anas Alnaasan** · MIZA Group · https://mizagroup.se · https://github.com/anasnassan92-cmyk

---

Source shared for portfolio purposes. © Lamisent Essence — all brand assets belong to their owner.
