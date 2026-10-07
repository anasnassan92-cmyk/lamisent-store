-- =========================================================
-- Enums
-- =========================================================
CREATE TYPE public.app_role AS ENUM ('admin', 'customer');
CREATE TYPE public.scent_family AS ENUM ('citrus','woody','amber','floral','spicy','aquatic','gourmand','oriental');
CREATE TYPE public.order_status AS ENUM ('pending','paid','fulfilled','cancelled','refunded');

-- =========================================================
-- Products
-- =========================================================
CREATE TABLE public.products (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  inspired_by   TEXT NOT NULL,
  notes         TEXT[] NOT NULL DEFAULT '{}',
  family        public.scent_family NOT NULL,
  tagline_de    TEXT,
  tagline_en    TEXT,
  description_de TEXT,
  description_en TEXT,
  hero_image    TEXT,
  gallery       TEXT[] NOT NULL DEFAULT '{}',
  featured      BOOLEAN NOT NULL DEFAULT false,
  active        BOOLEAN NOT NULL DEFAULT true,
  sort_order    INT NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.products TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- =========================================================
-- Product variants (sizes)
-- =========================================================
CREATE TABLE public.product_variants (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  size_ml     INT NOT NULL,
  price_cents INT NOT NULL,
  sku         TEXT NOT NULL UNIQUE,
  stock       INT NOT NULL DEFAULT 100,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (product_id, size_ml)
);

GRANT SELECT ON public.product_variants TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.product_variants TO authenticated;
GRANT ALL ON public.product_variants TO service_role;

ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

-- =========================================================
-- User roles (separate table to prevent privilege escalation)
-- =========================================================
CREATE TABLE public.user_roles (
  id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role    public.app_role NOT NULL,
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- =========================================================
-- Profiles
-- =========================================================
CREATE TABLE public.profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email           TEXT,
  first_name      TEXT,
  last_name       TEXT,
  phone           TEXT,
  default_address JSONB,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================================================
-- Orders
-- =========================================================
CREATE TABLE public.orders (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email               TEXT NOT NULL,
  stripe_session_id   TEXT UNIQUE,
  stripe_payment_intent TEXT,
  status              public.order_status NOT NULL DEFAULT 'pending',
  subtotal_cents      INT NOT NULL DEFAULT 0,
  shipping_cents      INT NOT NULL DEFAULT 0,
  tax_cents           INT NOT NULL DEFAULT 0,
  total_cents         INT NOT NULL DEFAULT 0,
  currency            TEXT NOT NULL DEFAULT 'eur',
  shipping_address    JSONB,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.order_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  variant_id      UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
  product_name    TEXT NOT NULL,
  size_ml         INT NOT NULL,
  unit_price_cents INT NOT NULL,
  quantity        INT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- =========================================================
-- Contact messages
-- =========================================================
CREATE TABLE public.contact_messages (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  subject    TEXT,
  message    TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT SELECT ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- =========================================================
-- updated_at trigger
-- =========================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER trg_products_updated   BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_profiles_updated   BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_orders_updated     BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================================
-- Policies
-- =========================================================
-- Products: public read of active rows; admin write
CREATE POLICY "Active products are viewable by everyone"
  ON public.products FOR SELECT
  USING (active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage products"
  ON public.products FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Variants: public read; admin write
CREATE POLICY "Variants viewable by everyone"
  ON public.product_variants FOR SELECT USING (true);

CREATE POLICY "Admins manage variants"
  ON public.product_variants FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- User roles: user reads own, admin reads all
CREATE POLICY "Users view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Profiles: owner only
CREATE POLICY "Users view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);
CREATE POLICY "Users update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Users insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Orders: owner or admin
CREATE POLICY "Users view own orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users view own order items"
  ON public.order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.orders o
            WHERE o.id = order_id
              AND (o.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin')))
  );

-- Contact messages: anyone can insert, only admins read
CREATE POLICY "Anyone can submit a contact message"
  ON public.contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
CREATE POLICY "Admins read contact messages"
  ON public.contact_messages FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));