# Graph Report - .  (2026-05-20)

## Corpus Check
- Corpus is ~12,988 words - fits in a single context window. You may not need a graph.

## Summary
- 206 nodes · 331 edges · 23 communities (16 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.89)
- Token cost: 17,185 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Admin Pages & Services|Admin Pages & Services]]
- [[_COMMUNITY_UI Components & Filters|UI Components & Filters]]
- [[_COMMUNITY_Package Dependencies|Package Dependencies]]
- [[_COMMUNITY_Appointment Actions & Calendar|Appointment Actions & Calendar]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
- [[_COMMUNITY_Payments & Email Notifications|Payments & Email Notifications]]
- [[_COMMUNITY_Auth & Admin Layout|Auth & Admin Layout]]
- [[_COMMUNITY_Booking Flow (crearReserva)|Booking Flow (crearReserva)]]
- [[_COMMUNITY_Project Setup & Deployment|Project Setup & Deployment]]
- [[_COMMUNITY_Supabase MCP Config|Supabase MCP Config]]
- [[_COMMUNITY_Root Layout & Fonts|Root Layout & Fonts]]
- [[_COMMUNITY_Horario Selector (Calendar UI)|Horario Selector (Calendar UI)]]
- [[_COMMUNITY_Edge Function (Recordatorios)|Edge Function (Recordatorios)]]
- [[_COMMUNITY_Claude Settings|Claude Settings]]
- [[_COMMUNITY_Middleware (Auth Guard)|Middleware (Auth Guard)]]
- [[_COMMUNITY_PostCSS Config|PostCSS Config]]
- [[_COMMUNITY_ESLint Config|ESLint Config]]
- [[_COMMUNITY_Next.js Config|Next.js Config]]

## God Nodes (most connected - your core abstractions)
1. `formatCLP()` - 20 edges
2. `createClient()` - 19 edges
3. `compilerOptions` - 16 edges
4. `formatDate()` - 13 edges
5. `formatTime()` - 12 edges
6. `AppointmentStatus` - 8 edges
7. `cn()` - 7 edges
8. `sendConfirmacion()` - 7 edges
9. `sendPagoVerificado()` - 7 edges
10. `PaymentBadge()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `Next.js Framework` --conceptually_related_to--> `Next.js Wordmark Logo`  [INFERRED]
  README.md → public/next.svg
- `Vercel Deployment Platform` --conceptually_related_to--> `Vercel Logo`  [INFERRED]
  README.md → public/vercel.svg
- `cn()` --calls--> `clsx`  [INFERRED]
  src/lib/utils.ts → package.json
- `Next.js Agenda Project` --references--> `pnpm Workspace Configuration`  [INFERRED]
  README.md → pnpm-workspace.yaml
- `ReportesPage()` --calls--> `formatCLP()`  [EXTRACTED]
  src/app/(admin)/admin/reportes/page.tsx → src/lib/utils.ts

## Communities (23 total, 7 thin omitted)

### Community 0 - "Admin Pages & Services"
Cohesion: 0.10
Nodes (6): toggleServiceActive(), ReportesPage(), CATEGORY_LABELS, CATEGORY_LABELS, createClient(), STEPS

### Community 1 - "UI Components & Filters"
Cohesion: 0.18
Nodes (16): clsx, SearchParams, ConfirmacionPage(), DashboardPage(), DatosPage(), ClienteProfilePage(), cn(), formatCLP() (+8 more)

### Community 2 - "Package Dependencies"
Cohesion: 0.07
Nodes (26): dependencies, lucide-react, next, react, react-dom, resend, @supabase/ssr, @supabase/supabase-js (+18 more)

### Community 3 - "Appointment Actions & Calendar"
Cohesion: 0.12
Nodes (13): updateAppointmentStatus(), Apt, DAYS_ES, HOURS, STATUS_BG, options, AppointmentStatus, Database (+5 more)

### Community 4 - "TypeScript Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 5 - "Payments & Email Notifications"
Cohesion: 0.26
Nodes (9): rejectPayment(), verifyPayment(), resend, sendRecordatorio(), base(), detailRow(), templateConfirmacion(), templatePagoVerificado() (+1 more)

### Community 6 - "Auth & Admin Layout"
Cohesion: 0.24
Nodes (3): login(), logout(), navItems

### Community 7 - "Booking Flow (crearReserva)"
Cohesion: 0.43
Nodes (3): crearReserva(), PAY_OPTIONS, createAdminClient()

### Community 8 - "Project Setup & Deployment"
Cohesion: 0.33
Nodes (6): pnpm Workspace Configuration, Next.js Framework, Next.js Agenda Project, Vercel Deployment Platform, Next.js Wordmark Logo, Vercel Logo

### Community 9 - "Supabase MCP Config"
Cohesion: 0.40
Nodes (4): mcpServers, supabase, type, url

### Community 10 - "Root Layout & Fonts"
Cohesion: 0.40
Nodes (3): inter, metadata, playfair

## Knowledge Gaps
- **75 isolated node(s):** `name`, `version`, `private`, `dev`, `build` (+70 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `UI Components & Filters` to `Admin Pages & Services`, `Auth & Admin Layout`?**
  _High betweenness centrality (0.156) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Package Dependencies` to `UI Components & Filters`?**
  _High betweenness centrality (0.152) - this node is a cross-community bridge._
- **Why does `clsx` connect `UI Components & Filters` to `Package Dependencies`?**
  _High betweenness centrality (0.148) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _75 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Admin Pages & Services` be split into smaller, more focused modules?**
  _Cohesion score 0.10098522167487685 - nodes in this community are weakly interconnected._
- **Should `Package Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.07407407407407407 - nodes in this community are weakly interconnected._
- **Should `Appointment Actions & Calendar` be split into smaller, more focused modules?**
  _Cohesion score 0.11688311688311688 - nodes in this community are weakly interconnected._