-- ─────────────────────────────────────────────────────────────────
-- 004_seed.sql  —  Datos iniciales: catálogo de servicios
-- ─────────────────────────────────────────────────────────────────

insert into services (name, description, category, duration_minutes, price, is_active)
values
  ('Manicure Clásica',
   'Limpieza, corte, limado y esmaltado de uñas naturales.',
   'manicure', 45, 8000, true),

  ('Manicure Semipermanente',
   'Esmaltado de larga duración (2-3 semanas) con gel UV/LED.',
   'manicure', 60, 12000, true),

  ('Pedicure Clásica',
   'Limpieza, corte, lima y esmaltado de uñas de pies.',
   'pedicure', 60, 10000, true),

  ('Pedicure Semipermanente',
   'Esmaltado semipermanente en pies con tratamiento de cutículas.',
   'pedicure', 75, 15000, true),

  ('Uñas en Gel',
   'Extensión o relleno de uñas con gel UV, forma personalizada.',
   'gel', 90, 20000, true),

  ('Uñas Acrílicas',
   'Construcción o relleno de uñas acrílicas resistentes.',
   'acrilico', 90, 22000, true),

  ('Nail Art Básico',
   'Diseños simples: flores, líneas finas, degradado o monocromo.',
   'nail_art', 30, 5000, true),

  ('Nail Art Premium',
   'Diseño artístico detallado: pedrería, efecto cromo, press-on personalizado.',
   'nail_art', 60, 10000, true),

  ('Combo Mani + Pedi Clásica',
   'Manicure y pedicure clásica en una sola sesión.',
   'otros', 90, 16000, true),

  ('Remoción de Gel / Acrílico',
   'Remoción segura y sin daño de la uña natural.',
   'otros', 30, 6000, true);
