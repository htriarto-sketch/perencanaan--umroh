import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  BookOpen,
  Compass,
  MapPin,
  ClipboardList,
  Camera,
  Lightbulb,
  CalendarClock,
  Sparkles,
  Check,
  ChevronDown,
  Menu,
  X,
  Moon,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Program Perencanaan Umroh — Pendamping Ibadah Anda di Tanah Suci" },
      {
        name: "description",
        content:
          "Panduan tawaf & sa'i interaktif, bank doa Arab-Latin-Terjemah, perencanaan biaya, checklist, spot foto, dan tips lengkap untuk jamaah Umroh Indonesia.",
      },
    ],
  }),
  component: LandingPage,
});

const features = [
  {
    icon: BookOpen,
    title: "Panduan Ibadah",
    desc: "6 tahap manasik dengan counter tawaf & sa'i otomatis, doa di setiap putaran.",
  },
  {
    icon: Compass,
    title: "Bank Doa Lengkap",
    desc: "Kumpulan doa Arab, latin, terjemah dengan audio dan fitur favorit.",
  },
  {
    icon: ClipboardList,
    title: "Perencanaan & Checklist",
    desc: "Estimator biaya, checklist persiapan, dan itinerary 9/12/14 hari.",
  },
  {
    icon: Camera,
    title: "Spot Foto Terbaik",
    desc: "12+ lokasi foto di Makkah & Madinah lengkap dengan GPS dan tips.",
  },
  {
    icon: Lightbulb,
    title: "Tips Praktis",
    desc: "Tips bahasa Arab, transportasi, kuliner halal, dan adab di Tanah Suci.",
  },
  {
    icon: CalendarClock,
    title: "Tracker Persiapan",
    desc: "Countdown keberangkatan dengan reminder per fase persiapan.",
  },
];

const faqs = [
  {
    q: "Apakah aplikasi ini gratis?",
    a: "Ya, semua fitur dasar gratis. Tersedia paket Premium sekali bayar Rp49.000 untuk fitur lanjutan.",
  },
  {
    q: "Apakah bisa diakses tanpa internet?",
    a: "Setelah download konten, panduan ibadah dan bank doa bisa diakses offline di Tanah Suci.",
  },
  {
    q: "Apakah cocok untuk jamaah pertama kali?",
    a: "Sangat cocok. Setiap langkah dipandu sederhana dengan teks Arab proper, latin, dan terjemah Indonesia.",
  },
  {
    q: "Apakah audio doa bisa diputar di latar belakang?",
    a: "Ya, audio tetap berjalan saat HP terkunci atau Anda membuka aplikasi lain.",
  },
];

function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary shadow-soft">
              <Moon className="h-4.5 w-4.5 text-gold" strokeWidth={2.5} />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-bold tracking-tight">Program Perencanaan</div>
              <div className="text-xs font-semibold text-primary">Umroh</div>
            </div>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#fitur"
              className="text-sm font-medium text-muted-foreground hover:text-primary"
            >
              Fitur
            </a>
            <a
              href="#harga"
              className="text-sm font-medium text-muted-foreground hover:text-primary"
            >
              Harga
            </a>
            <a href="#faq" className="text-sm font-medium text-muted-foreground hover:text-primary">
              FAQ
            </a>
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            <Link
              to="/login"
              className="rounded-lg px-4 py-2 text-sm font-semibold text-foreground hover:bg-accent"
            >
              Masuk
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft hover:bg-primary/90"
            >
              Daftar Gratis
            </Link>
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        {menuOpen && (
          <div className="border-t border-border bg-background px-4 py-3 md:hidden">
            <a href="#fitur" className="block py-2 text-sm font-medium">
              Fitur
            </a>
            <a href="#harga" className="block py-2 text-sm font-medium">
              Harga
            </a>
            <a href="#faq" className="block py-2 text-sm font-medium">
              FAQ
            </a>
            <div className="mt-2 flex flex-col gap-2 border-t border-border pt-3">
              <Link
                to="/login"
                className="rounded-lg border border-border px-4 py-2 text-center text-sm font-semibold"
              >
                Masuk
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-primary px-4 py-2 text-center text-sm font-semibold text-primary-foreground"
              >
                Daftar Gratis
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden gradient-hero">
        <div className="absolute inset-0 bg-arabesque opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-semibold text-deep">
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              Untuk Jamaah Indonesia
            </div>
            <p className="font-arabic text-2xl text-primary sm:text-3xl">
              لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ
            </p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Pendamping Umroh Anda
              <br />
              <span className="text-primary">di Tanah Suci</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Panduan ibadah lengkap, bank doa Arab-Latin-Terjemah, perencanaan biaya, checklist
              persiapan, spot foto, dan tips praktis — semua dalam satu aplikasi yang tenang dan
              mudah digunakan.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/register"
                className="w-full rounded-xl bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground shadow-soft transition hover:bg-primary/90 sm:w-auto"
              >
                Mulai Persiapan Umroh
              </Link>
              <a
                href="#fitur"
                className="w-full rounded-xl border border-border bg-background/80 px-7 py-3.5 text-base font-semibold backdrop-blur transition hover:bg-accent sm:w-auto"
              >
                Lihat Fitur
              </a>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Gratis selamanya · Tanpa kartu kredit
            </p>
          </div>

          {/* Dashboard preview */}
          <div className="mx-auto mt-16 max-w-4xl">
            <div className="rounded-3xl border border-border bg-card p-3 shadow-soft sm:p-4">
              <div className="overflow-hidden rounded-2xl bg-deep p-5 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="text-cream">
                    <p className="text-xs font-medium opacity-70">Assalamu'alaikum</p>
                    <p className="text-lg font-bold sm:text-xl">Persiapan Umroh Anda</p>
                  </div>
                  <div className="rounded-xl bg-gold/20 px-3 py-2 text-center backdrop-blur">
                    <p className="text-2xl font-extrabold text-gold sm:text-3xl">47</p>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-cream/80">
                      hari lagi
                    </p>
                  </div>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {[
                    { label: "Checklist", val: "18/28", pct: 64 },
                    { label: "Manasik", val: "4/6", pct: 67 },
                    { label: "Doa Hafal", val: "9/14", pct: 64 },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl bg-cream/5 p-3 backdrop-blur">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs font-medium text-cream/70">{s.label}</span>
                        <span className="text-sm font-bold text-gold">{s.val}</span>
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-cream/10">
                        <div
                          className="h-full rounded-full bg-gold"
                          style={{ width: `${s.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="fitur" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Semua yang Anda butuhkan
            </h2>
            <p className="mt-4 text-muted-foreground">
              Dari persiapan sebelum berangkat hingga pulang dengan mabrur.
            </p>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-border bg-card p-6 transition hover:border-primary/40 hover:shadow-soft"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-bold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="harga" className="bg-accent/40 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Harga yang adil</h2>
            <p className="mt-4 text-muted-foreground">
              Mulai gratis. Upgrade sekali bayar — selamanya milik Anda.
            </p>
          </div>
          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-border bg-card p-8">
              <h3 className="text-lg font-bold">Gratis</h3>
              <p className="mt-1 text-sm text-muted-foreground">Untuk semua jamaah</p>
              <p className="mt-6 text-4xl font-extrabold">Rp 0</p>
              <p className="text-xs text-muted-foreground">selamanya</p>
              <ul className="mt-6 space-y-3 text-sm">
                {[
                  "Panduan ibadah 6 tahap",
                  "Bank doa dengan audio",
                  "Checklist persiapan",
                  "Tips praktis",
                  "Spot foto",
                ].map((i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/register"
                className="mt-8 block rounded-xl border border-border py-3 text-center text-sm font-semibold hover:bg-accent"
              >
                Mulai Gratis
              </Link>
            </div>
            <div className="relative rounded-3xl border-2 border-primary bg-card p-8 shadow-soft">
              <span className="absolute -top-3 right-6 rounded-full bg-gold px-3 py-1 text-xs font-bold text-gold-foreground">
                REKOMENDASI
              </span>
              <h3 className="text-lg font-bold text-primary">Premium</h3>
              <p className="mt-1 text-sm text-muted-foreground">Untuk persiapan maksimal</p>
              <p className="mt-6 text-4xl font-extrabold">Rp 49.000</p>
              <p className="text-xs text-muted-foreground">sekali bayar · akses selamanya</p>
              <ul className="mt-6 space-y-3 text-sm">
                {[
                  "Semua fitur Gratis",
                  "Estimator biaya lengkap",
                  "Itinerary 9/12/14 hari",
                  "Akses offline penuh",
                  "Catatan pribadi unlimited",
                  "Tracker persiapan dengan reminder",
                ].map((i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/register"
                className="mt-8 block rounded-xl bg-primary py-3 text-center text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Upgrade Premium
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Pertanyaan Umum</h2>
          </div>
          <div className="mt-12 space-y-3">
            {faqs.map((f, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="font-semibold">{f.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-muted-foreground transition ${openFaq === i ? "rotate-180" : ""}`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground">
                    {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl gradient-primary p-10 text-center shadow-soft sm:p-16">
          <p className="font-arabic text-xl text-gold">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
          <h2 className="mt-4 text-3xl font-bold text-cream sm:text-4xl">
            Siap memulai perjalanan suci?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-cream/80">
            Bergabunglah dengan ribuan jamaah yang mempersiapkan Umroh dengan tenang dan
            terstruktur.
          </p>
          <Link
            to="/register"
            className="mt-8 inline-block rounded-xl bg-gold px-8 py-3.5 font-semibold text-gold-foreground transition hover:bg-gold/90"
          >
            Daftar Gratis Sekarang
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
              <Moon className="h-4 w-4 text-gold" />
            </div>
            <span className="text-sm font-semibold">Program Perencanaan Umroh</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2026 · Dibuat dengan ❤️ untuk jamaah Indonesia
          </p>
        </div>
      </footer>
    </div>
  );
}
