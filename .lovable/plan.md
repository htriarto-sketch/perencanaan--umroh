# Plan: Program Perencanaan Umroh

Nama aplikasi yang dipilih: **Program Perencanaan Umroh** (PPUmroh). Target user: calon jamaah umroh Indonesia, usia 25-65, banyak yang pertama kali. Standard usability: harus bisa dipakai tanpa bantuan oleh jamaah 60 tahun.

---

## Phase 1 — Foundation

### 1.1 Supabase (Lovable Cloud) + Auth

- Enable Lovable Cloud.
- Schema:
  - `profiles` (id FK auth.users, name, city, departure_date, created_at)
  - `user_progress` (FK profile, feature, step, completed, data JSON)
  - `user_favorites` (FK profile, doa_id)
  - `prayer_categories`, `prayers`, `prayer_audio` (bank doa)
  - `guide_stages`, `guide_steps` (panduan ibadah)
  - `photo_spots`, `photo_spot_images`
  - `checklist_items`, `user_checklists`
  - `itinerary_templates`, `itinerary_days`, `itinerary_activities`
  - `tips_categories`, `tips` (panduan praktis)
  - `user_notes` (catatan perjalanan)
  - `subscriptions` (status premium)
- Auth: email/password + Google OAuth.
- Auto-create profile via trigger on signup.
- RLS policies: user-scoped reads/writes.

### 1.2 Design System

- Colors (oklch in `src/styles.css`):
  - Primary: hijau islami `#1B6B3A`
  - Primary dark (header/sidebar): `#0D4A28`
  - Accent gold: `#C9A84C`
  - Soft gold bg: `#F5E6C8`
  - Cream bg: `#FBF7F0`
  - Card: `#FFFFFF`
  - Text dark: `#1A1A1A`
- Typography:
  - Arabic: `Amiri` or `Scheherazade` — min 22px, beautiful rendering
  - Latin/Indonesia: `Plus Jakarta Sans` via Google Fonts
- Border radius: 16px cards, 12px buttons, full-round for pills
- Shadows: very subtle, almost none
- Patterns: subtle arabesque SVG background on hero/cream sections
- Tone: calm, sacred, trustworthy — zero loud animations

### 1.3 Global Layout & Shell

- `__root.tsx`: head meta (Indonesian SEO), font loading (Amiri + Plus Jakarta Sans), QueryClientProvider.
- Dashboard shell (`/_authenticated.tsx` layout):
  - Fixed dark-green sidebar (`#0D4A28`) with cream/gold icons+text
  - Collapsible to icon-only on desktop, drawer on mobile
  - Cream content area (`#FBF7F0`)
  - White cards with 1px subtle border, no heavy shadow
  - Mobile: bottom tab bar
- Route structure:
  ```
  /                         → Landing page
  /login                    → Login
  /register                 → Register
  /dashboard                → Beranda (home)
  /dashboard/panduan        → Panduan Ibadah
  /dashboard/panduan/$stage → Detail Tahap
  /dashboard/doa            → Bank Doa
  /dashboard/doa/$id        → Detail Doa
  /dashboard/perencanaan    → Perencanaan
  /dashboard/spot-foto      → Spot Foto
  /dashboard/spot-foto/$id  → Detail Spot
  /dashboard/panduan-praktis→ Panduan Praktis
  /dashboard/panduan-praktis/$id → Detail Tips
  /dashboard/tracker        → Tracker Persiapan
  /dashboard/settings       → Settings
  ```

---

## Phase 2 — Landing Page

Satu route `/` dengan section berurutan:

- Sticky navbar: cream→blur on scroll, logo + ornament, nav links (Fitur, Harga, FAQ), Masuk (ghost), Coba Gratis (hijau solid).
- Hero: gradient cream→white, arabesque pattern, floating star ornament (slow CSS animation), pre-headline badge (soft gold), headline dengan "tak akan terulang" in gold, gentle reveal animation per line, dual CTA (hijau + ghost), social proof avatars + rating.
- Interactive dashboard preview: browser-frame mockup showing sidebar + cards (progress, countdown, audio player, spot photo mini, tracker mini, cost estimator). Simulated interactivity (click counter, play button, hover expand). Badge "Live Preview" gold corner.
- Logo bar: marquee 6 kota Indonesia.
- Problem section: soft gold bg, empathetic 3 pain points (icon + text), no fear-mongering.
- Solution transition: large Arabic quote styling (QS Al-Baqarah:196), gold typography.
- Fitur section: 4 alternating left-right feature blocks with mockup visuals, badges, benefit lists.
- Testimonials: masonry 3-col grid, 5 testimonials with spiritual tone.
- Pricing: 2-col Free vs Premium (Rp49.000, one-time), gold highlight on Premium.
- FAQ: 7 accordion questions.
- Final CTA: gradient hijau, Arabic calligraphy ornament subtle, gold CTA button.
- Footer: dark green 4-col (logo+tagline+social, features, about, legal).

Responsive: 375px to 1280px+. Mobile hamburger, stacked sections.

---

## Phase 3 — Auth Pages

- `/login` and `/register`:
  - Split layout: 40% left branding panel (gradient hijau + arabesque + Ka'bah/Masjid bg image + tagline + quote), 60% right form panel (cream bg).
  - Form: clean spacious, focus border gold, Google OAuth button, email/password fields.
  - CTA: "Mulai Persiapan — Gratis"
  - Responsive: stack vertically on mobile, branding panel becomes top banner.

---

## Phase 4 — Dashboard Core (Authenticated)

### 4.1 Beranda (/dashboard)

- Greeting: "Bismillah, [nama] 🤲"
- Countdown card (if departure date set): "H-XX hari menuju Tanah Suci"
- Progress tracker circle: "% siap" + quick stats
- Quick access buttons: Lanjut Panduan, Buka Doa, Cek Checklist
- Daily tip card (rotating)
- Recommended daily doa card with play button
- Recent activity / last visited sections

### 4.2 Panduan Ibadah (/dashboard/panduan)

- 6-stage horizontal progress tracker at top:
  - Icons connected by line
  - Active = gold highlight
  - Completed = green check
  - Click any stage to open detail
- Each stage detail page:
  - Rich text explanation
  - Arabic prayer text (large, Amiri font, 22px+)
  - Latin + Indonesian translation
  - Play audio button (placeholder audio for now)
  - Counter for Tawaf (0/7, big numbers, + button, confirmation animation)
  - Counter for Sa'i (0/7, odd/even labels for Shafa/Marwa)
  - Tips section per stage
  - Ziarah Madinah as separate page linked from sidebar/stage list

### 4.3 Bank Doa (/dashboard/doa)

- Category tabs: 📍 Perjalanan, 🕌 Masjidil Haram, 🏃 Sa'i, 🕌 Masjid Nabawi, 🤲 Dzikir Harian
- Search bar
- Favorites section
- Each doa card:
  - Arabic text (large, Amiri)
  - Latin below
  - Indonesian translation
  - Short context/virtue
  - Play ▶️, Favorite ❤️, Font size 🔤
- Night reading mode toggle (dark bg, light text)
- Audio player: sticky bottom when playing, background audio capability (Web Audio / media session API)
- Playback speed: normal/slow, repeat mode

### 4.4 Perencanaan (/dashboard/perencanaan)

- Tab 1: Estimasi Biaya
  - Form: kota keberangkatan (dropdown), bulan, durasi (9/12/14/custom), jumlah orang, hotel class (3/4/5⭐), oleh-oleh budget slider
  - Output: breakdown card per kategori (pesawat, visa, vaksin, hotel Makkah, hotel Madinah, bus, konsumsi, oleh-oleh)
  - Total + "Perlu nabung/bulan"
  - Tips hemat per kategori
  - Save as PDF button
- Tab 2: Checklist Dokumen
  - Timeline phases: H-6 Bulan, H-3 Bulan, H-1 Bulan, H-1 Minggu, H-1 Hari
  - Each item: tap to check, info icon for explanation
  - Progress bar: "X dari Y item selesai"
- Tab 3: Itinerary Builder
  - Templates: 9 hari (Makkah focus), 12 hari (balanced), 14 hari (lengkap)
  - Per day: pagi/siang/mal activities with time estimates
  - Customizable: add/remove, reorder (drag handle), add notes
  - Export PDF button

### 4.5 Spot Foto (/dashboard/spot-foto)

- Banner: "Abadikan Momen Terbaikmu di Tanah Suci"
- Filter: All / Makkah / Madinah / Pagi / Siang / Malam
- Sort: Populer / Terbaru
- Grid cards per spot:
  - Thumbnail image
  - Title, star rating, time badge, location
  - "Lihat Detail →"
- Detail page:
  - Hero image gallery
  - Exact location + GPS link
  - Best time explanation
  - Angle/composition tips
  - Phone camera settings tips
  - Warning labels (respect worshippers, no photos inside Ka'bah)
  - Tags

### 4.6 Panduan Praktis (/dashboard/panduan-praktis)

- Category tabs: 🚌 Transportasi, 🏥 Fasilitas & Darurat, 🌡️ Cuaca & Kesehatan, 🛍️ Belanja & Kuliner, 📱 Teknologi
- Info cards per topic:
  - Route maps (static SVG/image for bus)
  - Emergency numbers (tap to call on mobile)
  - Weather chart by month
  - Health tips (dehydration, heat stroke)
  - Shopping tips, restaurant recommendations
  - SIM card tips, offline maps guide

### 4.7 Tracker Persiapan (/dashboard/tracker)

- Big progress circle: "% siap"
- Set departure date (triggers countdown everywhere)
- Countdown: "H-XX hari lagi"
- Visual timeline: H-6 Bulan → H-3 Bulan → H-1 Bulan → H-1 Minggu → H-1 Hari → Berangkat!
- Tap phase to expand checklist (same data as Perencanaan Tab 2)
- Reminders: toggle H-6, H-3, H-1 month notifications
- Notes textarea + emergency contacts + flight info cards

### 4.8 Settings (/dashboard/settings)

- Tab Profil: name, city, planned departure date
- Tab Notifikasi: checklist reminders per phase
- Tab Konten: doa display mode (Arab+Latin+Translation / Arab only)
- Tab Offline: download all content for offline

---

## Phase 5 — Polish & Quality

- Mobile-first responsive (375px baseline, up to 1280px+)
- Skeleton loaders on all dashboard pages
- Empty states: encouraging + spiritual tone
- Error states: gentle messaging
- Offline capability: service worker / local storage cache for prayers and guides
- Accessibility: large touch targets (min 44px), high contrast for Arabic text, screen reader labels
- Performance: lazy load images, code split routes
- Arabic font verification: check every page renders Amiri/Scheherazade correctly at ≥22px
- Background audio test: audio plays when screen off / app backgrounded
- Counter performance: tawaf/sa'i counters must be instant, no lag

---

## Technical Notes

- **Backend**: TanStack Start server functions + Supabase (RLS enabled).
- **Auth**: Google OAuth + email/password via Supabase Auth.
- **Payments**: Skipped for now (placeholder UI only). Stripe or local provider integration deferred.
- **Audio**: Web Audio API with Media Session for background playback. TTS or user-uploaded audio later.
- **PDF Export**: Client-side generation (html2canvas + jsPDF or similar).
- **Images**: Use `imagegen` for spot photo thumbnails and hero images. Save to `src/assets/`.
- **Fonts**: Load Amiri and Plus Jakarta Sans via Google Fonts `<link>` in `__root.tsx` head.
- **State**: TanStack Query for server state, React state for local UI (counters, form inputs).

---

## Open Decisions (untuk disepakati sebelum build)

1. Nama brand "Program Perencanaan Umroh" terdengar deskriptif. Apakah ada nama pendek/brand yang lebih singkat untuk dipakai di logo, domain, dan copy?
2. Karena scope sangat besar (8 fitur + landing + auth), apakah tetap ingin dibangun dalam satu sesi/iterasi panjang, atau prefer milestone per fitur?
3. Untuk audio doa placeholder — apakah OK pakai browser TTS (Web Speech API) untuk demo Arab sementara, atau prefer audio dummy file?
