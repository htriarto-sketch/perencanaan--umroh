import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Moon,
  LogOut,
  BookOpen,
  Compass,
  ClipboardList,
  Camera,
  Lightbulb,
  CalendarClock,
  Settings as SettingsIcon,
  Sparkles,
  Check,
  Calculator,
  MapPin,
  ChevronRight,
  Info,
  AlertTriangle,
  Navigation,
  Plane,
  Hotel,
  ShoppingBag,
  Utensils,
  Sun,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import { ThemeToggle } from "@/components/theme-toggle";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard · Program Perencanaan Umroh" }] }),
  component: DashboardPage,
});

const navItems = [
  { icon: Sparkles, label: "Beranda", id: "beranda" },
  { icon: BookOpen, label: "Panduan Ibadah", id: "panduan" },
  { icon: Compass, label: "Bank Doa", id: "doa" },
  { icon: Calculator, label: "Kalkulasi Biaya", id: "biaya" },
  { icon: MapPin, label: "Navigasi GPS", id: "gps" },
  { icon: ClipboardList, label: "Perencanaan", id: "rencana" },
  { icon: Camera, label: "Spot Foto", id: "foto" },
  { icon: Lightbulb, label: "Tips Praktis", id: "tips" },
  { icon: CalendarClock, label: "Persiapan", id: "siap" },
  { icon: SettingsIcon, label: "Pengaturan", id: "settings" },
];

function DashboardPage() {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [active, setActive] = useState("beranda");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session: s },
      } = await supabase.auth.getSession();
      if (s) {
        setSession(s);
        setChecking(false);
        return;
      }
      const localSessionStr = localStorage.getItem("supabase.auth.token");
      if (localSessionStr) {
        try {
          const localSession = JSON.parse(localSessionStr);
          if (localSession?.user) {
            setSession(localSession as any);
            setChecking(false);
            return;
          }
        } catch (e) {}
      }
      setChecking(false);
      navigate({ to: "/login", replace: true });
    };
    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, s) => {
      if (s) {
        setSession(s);
        setChecking(false);
      } else {
        const isBypass = localStorage.getItem("supabase.auth.token");
        if (!isBypass || event === "SIGNED_OUT") {
          setSession(null);
          if (event === "SIGNED_OUT") localStorage.removeItem("supabase.auth.token");
          navigate({ to: "/login", replace: true });
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  if (checking)
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-sm text-muted-foreground animate-pulse font-black uppercase tracking-widest">
          Memuat Aplikasi…
        </div>
      </div>
    );
  if (!session) return null;

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-72 flex-col bg-card border-r border-border p-6 sticky top-0 h-screen">
        <div className="flex items-center justify-between mb-10 px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-foreground text-sm leading-tight">Umroh</h2>
              <p className="text-xs text-muted-foreground font-medium">Planner Pro</p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                active === item.id
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className={`w-5 h-5 ${active === item.id ? "text-primary" : ""}`} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-border">
          <button
            onClick={() => {
              supabase.auth.signOut();
              localStorage.removeItem("supabase.auth.token");
              navigate({ to: "/login" });
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-destructive hover:bg-destructive/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Keluar Akun
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-card/80 backdrop-blur-md border-b border-border px-6 flex items-center justify-between lg:hidden">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="font-bold text-foreground">Umroh Planner</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button onClick={() => setActive("settings")} className="p-2">
              <SettingsIcon className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-5 sm:p-10 max-w-5xl mx-auto w-full">
          {active === "beranda" && (
            <Beranda email={session.user.email ?? "Hamba Allah"} onNavigate={setActive} />
          )}
          {active === "biaya" && <KalkulasiBiaya onNavigate={setActive} />}
          {active === "gps" && <TrackingGPS onNavigate={setActive} />}
          {active === "doa" && <BankDoa onNavigate={setActive} />}
          {active === "panduan" && <PanduanIbadah onNavigate={setActive} />}
          {active === "rencana" && <Perencanaan onNavigate={setActive} />}
          {active === "foto" && <SpotFoto onNavigate={setActive} />}
          {active === "tips" && <TipsPraktis onNavigate={setActive} />}
          {active === "siap" && <Persiapan onNavigate={setActive} />}
          {active === "settings" && <Pengaturan onNavigate={setActive} />}
        </main>

        {/* Mobile Navigation Bar */}
        <nav className="lg:hidden h-16 bg-card border-t border-border flex items-center justify-around px-2 sticky bottom-0">
          {navItems.slice(0, 5).map((item) => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`flex flex-col items-center gap-1 ${active === item.id ? "text-primary" : "text-muted-foreground"}`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-[10px] font-bold uppercase">{item.label.split(" ")[0]}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

function Beranda({ email, onNavigate }: { email: string; onNavigate: (id: string) => void }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
      <div className="relative overflow-hidden rounded-[2rem] bg-emerald-900 p-8 sm:p-12 text-white shadow-2xl shadow-emerald-200">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-800/50 rounded-full -mr-20 -mt-20 blur-3xl opacity-50" />
        <div className="relative z-10">
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-800/40 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4">
            Profil Jamaah
          </span>
          <h1 className="text-3xl sm:text-4xl font-black mb-2">Marhaban, {email.split("@")[0]}</h1>
          <p className="text-emerald-100/80 text-sm max-w-md leading-relaxed font-medium">
            Siap untuk melanjutkan persiapan ibadah Umroh Anda hari ini? Mari kita mulai dengan
            bismillah.
          </p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            id: "panduan",
            label: "Panduan Ibadah",
            icon: BookOpen,
            color: "bg-blue-600",
            desc: "Langkah-langkah manasik lengkap.",
          },
          {
            id: "biaya",
            label: "Kalkulasi Biaya",
            icon: Calculator,
            color: "bg-emerald-600",
            desc: "Estimasi anggaran perjalanan.",
          },
          {
            id: "gps",
            label: "Navigasi GPS",
            icon: MapPin,
            color: "bg-amber-500",
            desc: "Lokasi penting di Tanah Suci.",
          },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className="group relative bg-card p-6 rounded-[2rem] border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left overflow-hidden"
          >
            <div
              className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}
            >
              <item.icon className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-foreground text-lg mb-1">{item.label}</h3>
            <p className="text-muted-foreground text-xs font-medium leading-relaxed">{item.desc}</p>
            <ChevronRight className="absolute bottom-6 right-6 w-5 h-5 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </button>
        ))}
      </div>
    </div>
  );
}

function KalkulasiBiaya({ onNavigate }: { onNavigate: (id: string) => void }) {
  const [items, setItems] = useState([
    { id: 1, label: "Tiket Pesawat (PP)", cost: 15000000, icon: Plane },
    { id: 2, label: "Visa & Paket Umroh", cost: 12000000, icon: Check },
    { id: 3, label: "Hotel Makkah/Madinah", cost: 8000000, icon: Hotel },
    { id: 4, label: "Uang Saku & Belanja", cost: 5000000, icon: ShoppingBag },
    { id: 5, label: "Makan & Transportasi", cost: 3000000, icon: Utensils },
  ]);

  const total = items.reduce((sum, item) => sum + item.cost, 0);

  const updateCost = (id: number, val: string) => {
    const num = parseInt(val.replace(/\D/g, "")) || 0;
    setItems(items.map((item) => (item.id === id ? { ...item, cost: num } : item)));
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate("beranda")}
          className="flex items-center gap-2 text-muted-foreground font-bold text-sm hover:text-primary transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center">
            ←
          </div>
          Kembali
        </button>
        <span className="px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest border border-emerald-200">
          Estimator Biaya
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-3xl font-black text-foreground">Rencana Anggaran</h2>
          <p className="text-muted-foreground text-sm font-medium leading-relaxed">
            Sesuaikan perkiraan biaya Anda di bawah ini untuk mendapatkan total estimasi yang
            akurat.
          </p>

          <div className="bg-card rounded-[2rem] border border-border overflow-hidden shadow-sm">
            {items.map((item, idx) => (
              <div
                key={item.id}
                className={`p-6 flex items-center gap-4 ${idx !== items.length - 1 ? "border-b border-border/50" : ""}`}
              >
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground/50">
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <label className="block text-[10px] font-black text-muted-foreground/50 uppercase tracking-wider mb-1">
                    {item.label}
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-muted-foreground/50 text-lg">Rp</span>
                    <input
                      type="text"
                      value={item.cost.toLocaleString("id-ID")}
                      onChange={(e) => updateCost(item.id, e.target.value)}
                      className="flex-1 bg-transparent border-none focus:ring-0 p-0 text-xl font-black text-foreground placeholder:text-muted"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-primary rounded-[2.5rem] p-8 text-primary-foreground shadow-xl shadow-primary/20 sticky top-10">
            <p className="text-primary-foreground/70 text-xs font-bold uppercase tracking-widest mb-2">
              Total Estimasi
            </p>
            <h3 className="text-4xl font-black mb-8 leading-tight">
              Rp {total.toLocaleString("id-ID")}
            </h3>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-sm font-bold bg-black/10 p-4 rounded-2xl">
                <Info className="w-5 h-5 text-primary-foreground/80 shrink-0" />
                <p>Harga dapat berubah sewaktu-waktu tergantung kurs Dollar.</p>
              </div>
            </div>

            <button className="w-full bg-background text-primary py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg hover:bg-muted transition-colors">
              Simpan Rencana
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TrackingGPS({ onNavigate }: { onNavigate: (id: string) => void }) {
  const sites = [
    { name: "Masjidil Haram", distance: "0.2 km", type: "Ibadah", lat: "21.4225", lng: "39.8262" },
    {
      name: "Jabal Nur (Gua Hira)",
      distance: "5.4 km",
      type: "Ziarah",
      lat: "21.4572",
      lng: "39.8592",
    },
    { name: "Jabal Thaur", distance: "4.8 km", type: "Ziarah", lat: "21.3789", lng: "39.8514" },
    { name: "Padang Arafah", distance: "18.2 km", type: "Ziarah", lat: "21.3549", lng: "39.9840" },
    { name: "Masjid Quba", distance: "Madinah", type: "Ibadah", lat: "24.4392", lng: "39.6172" },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate("beranda")}
          className="flex items-center gap-2 text-muted-foreground font-bold text-sm hover:text-primary transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center">
            ←
          </div>
          Kembali
        </button>
        <span className="px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-black uppercase tracking-widest border border-amber-200 dark:border-amber-800">
          Navigasi Tanah Suci
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-3xl font-black text-foreground">Lokasi Penting</h2>

          <div className="relative aspect-[16/10] bg-muted rounded-[2.5rem] border border-border overflow-hidden flex items-center justify-center">
            <div
              className="absolute inset-0 bg-primary/5 opacity-20"
              style={{
                backgroundImage: "radial-gradient(var(--color-primary) 0.5px, transparent 0.5px)",
                backgroundSize: "24px 24px",
              }}
            />
            <div className="text-center z-10 px-8">
              <Navigation className="w-12 h-12 text-primary mx-auto mb-4 animate-bounce" />
              <p className="font-bold text-foreground text-lg mb-2">Peta Interaktif</p>
              <p className="text-muted-foreground text-sm font-medium">
                Fitur peta sedang diaktifkan. Gunakan daftar di samping untuk melihat rute spesifik.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-black text-muted-foreground/50 text-[10px] uppercase tracking-widest px-2">
            Daftar Destinasi
          </h3>
          {sites.map((site, i) => (
            <div
              key={i}
              className="bg-card p-5 rounded-2xl border border-border shadow-sm flex items-center justify-between hover:border-primary transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-sm">{site.name}</h4>
                  <p className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-widest">
                    {site.type} • {site.distance}
                  </p>
                </div>
              </div>
              <button className="p-2 text-muted-foreground/30 hover:text-primary transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          ))}

          <div className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-2xl border border-amber-100 dark:border-amber-900/30 mt-6">
            <div className="flex gap-4">
              <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
              <div>
                <p className="text-sm font-bold text-amber-900 dark:text-amber-200 mb-1">
                  Tips Navigasi
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed font-medium">
                  Selalu tandai lokasi Hotel Anda di Google Maps sebelum berangkat ke Masjid agar
                  mudah saat pulang.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BankDoa({ onNavigate }: { onNavigate: (id: string) => void }) {
  const doas = [
    {
      title: "Doa Masuk Raudhah",
      arabic:
        "بِسْمِ اللهِ وَعَلَى مِلَّةِ رَسُوْلِ اللهِ، رَبِّ أَدْخِلْنِي مُدْخَلَ صِدْقٍ وَأَخْرِجْنِي مُخْرَجَ صِدْقٍ وَاجْعَلْ لِي مِنْ لَدُنْكَ سُلْطَانًا نَصِيرًا",
      latin:
        "Bismillahi wa 'ala millati Rasulillahi. Rabbi adkhilni mudkhala shidqin wa akhrijni mukhraja shidqin waj'al li min ladunka sulthanan nashira",
    },
    {
      title: "Doa Niat Umroh",
      arabic: "نَوَيْتُ العُمْرَةَ وَأَحْرَمْتُ بِهَا لِلَّهِ تَعَالَى",
      latin: "Nawaitul 'umrata wa ahramtu bihaa lillaahi ta'aalaa",
    },
    {
      title: "Talbiyah (Lengkap)",
      arabic:
        "لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لاَ شَرِيْكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ لاَ شَرِيْكَ لَكَ",
      latin:
        "Labbaikallaahumma labbaik, labbaika laa syariika laka labbaik. Innal hamda wan-ni'mata laka wal mulk, laa syariika lak",
    },
    {
      title: "Doa Masuk Masjidil Haram",
      arabic: "اَللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
      latin: "Allaahummuftah lii abwaaba rahmatik",
    },
    {
      title: "Doa Tawaf (Antara Rukun Yamani & Hajar Aswad)",
      arabic:
        "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
      latin:
        "Rabbanaa aatinaa fiddunyaa hasanatan wa fil aakhirati hasanatan wa qinaa 'adzaaban naar",
    },
    {
      title: "Doa Shalat di Makam Ibrahim",
      arabic: "وَاتَّخِذُوا مِنْ مَقَامِ إِبْرَاهِيمَ مُصَلًّى",
      latin: "Wattakhidzuu mim-maqaami ibraahiima mushallaa",
    },
    {
      title: "Doa Minum Air Zam-zam",
      arabic:
        "اَللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا وَاسِعًا، وَشِفَاءً مِنْ كُلِّ دَاءٍ",
      latin:
        "Allaahumma innii as-aluka 'ilman naafi'an, wa rizqan waasi'an, wa syifaa-an min kulli daa-in",
    },
    {
      title: "Doa Sa'i",
      arabic: "إِنَّ الصَّفَا وَالْمَرْوَةَ مِن شَعَآئِرِ اللَّهِ",
      latin: "Innash-shafaa wal marwata min sya'aairillaah",
    },
    {
      title: "Doa Lari-Lari Kecil (Sa'i)",
      arabic:
        "رَبِّ اغْفِرْ وَارْحَمْ وَاعْفُ وَتَكَرَّمْ وَتَجَاوَزْ عَمَّا تَعْلَمُ، إِنَّكَ أَنْتَ الْأَعَزُّ الْأَكْرَمُ",
      latin:
        "Rabbighfir warham wa'fu wa takarram wa tajaawaz 'ammaa ta'lam, innaka antal a'azzul akram",
    },
    {
      title: "Doa Tahallul",
      arabic: "أَللَّهُمَّ هَذَا تَحَلُّلِي فِي الْمَكَانِ الَّذِي حَبَسْتَنِي فِيهِ",
      latin: "Allaahumma hadza tahalluli fil makaanilladzi habastanii fiih",
    },
    {
      title: "Doa Melihat Ka'bah",
      arabic:
        "اَللَّهُمَّ زِدْ هَذَا الْبَيْتَ تَشْرِيفًا وَتَعْظِيمًا وَتَكْرِيمًا وَمَهَابَةً، وَزِدْ مَنْ شَرَّفَهُ وَكَرَّمَهُ مِمَّنْ حَجَّهُ أَوِ اعْتَمَرَهُ تَشْرِيفًا وَتَكْرِيمًا وَتَعْظِيمًا وَبِرًّا",
      latin:
        "Allaahumma zid haadzal baita tasyriifan wa ta'zhiiman wa takriiman wa mahaabatan, wa zid man syarrafahu wa karramahu mimman hajjahu awi'tamarahu tasyriifan wa takriiman wa ta'zhiiman wa birran",
    },
    {
      title: "Doa Keluar Rumah",
      arabic: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
      latin: "Bismillaahi tawakkaltu 'alallaahi laa hawla wa laa quwwata illaa billaah",
    },
    {
      title: "Doa Perjalanan",
      arabic:
        "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ",
      latin:
        "Subhaanalladzii sakhkhara lanaa haadzaa wa maa kunnaa lahu muqriniin. Wa innaa ilaa rabbinaa lamunqalibuun",
    },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate("beranda")}
          className="flex items-center gap-2 text-muted-foreground font-bold text-sm hover:text-primary transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center">
            ←
          </div>
          Kembali
        </button>
        <span className="px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest border border-blue-200">
          Bank Doa Lengkap
        </span>
      </div>

      <h2 className="text-3xl font-black text-foreground mb-8">Kumpulan Doa</h2>

      <div className="grid gap-6">
        {doas.map((doa, i) => (
          <div
            key={i}
            className="bg-card p-8 rounded-[2.5rem] border border-border shadow-sm space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-foreground text-xl">{doa.title}</h3>
              <button className="p-3 bg-muted rounded-2xl text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all">
                <Compass className="w-5 h-5" />
              </button>
            </div>
            <p className="text-right font-arabic text-3xl leading-[2] text-emerald-900" dir="rtl">
              {doa.arabic}
            </p>
            <p className="text-muted-foreground font-medium italic leading-relaxed text-sm">
              {doa.latin}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PanduanIbadah({ onNavigate }: { onNavigate: (id: string) => void }) {
  const steps = [
    {
      title: "Ihram & Niat",
      desc: "Niat Umroh dari Miqat.",
      arabic: "نَوَيْتُ العُمْرَةَ وَأَحْرَمْتُ بِهَا لِلَّهِ تَعَالَى",
      latin: "Nawaitul 'umrata wa ahramtu bihaa lillaahi ta'aalaa",
    },
    {
      title: "Tawaf",
      desc: "Mengelilingi Ka'bah 7 putaran. Di antara Rukun Yamani dan Hajar Aswad disunnahkan membaca doa Sapu Jagat.",
      arabic:
        "بِسْمِ اللهِ، اَللهُ أَكْبَرُ، اَللَّهُمَّ إِيْمَانًا بِكَ وَتَصْدِيْقًا بِكِتَابِكَ وَوَفَاءً بِعَهْدِكَ وَاتِّبَاعًا لِسُنَّةِ نَبِيِّكَ مُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ\n\n[Antara Rukun Yamani & Hajar Aswad]:\nرَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
      latin:
        "Bismillaahi, Allaahu akbar, Allaahumma iimaanan bika wa tashdiiqan bikitaabika wa wafaa'an bi'ahdika wattibaa'an lisunnati nabiyyika Muhammadin shallallaahu 'alaihi wa sallam.\n\n[Antara Rukun Yamani & Hajar Aswad]:\nRabbanaa aatinaa fiddunyaa hasanatan wa fil aakhirati hasanatan wa qinaa 'adzaaban naar",
    },
    {
      title: "Sa'i",
      desc: "Berjalan antara Shafa dan Marwah 7 kali. Disunnahkan membaca doa saat di bukit Shafa/Marwah dan dzikir di sepanjang perjalanan.",
      arabic:
        "[Saat di Bukit Shafa/Marwah]:\nإِنَّ الصَّفَا وَالْمَرْوَةَ مِن شَعَآئِرِ اللَّهِ، أَبْدَأُ بِمَا بَدَأَ اللهُ بِهِ\n\n[Dzikir Perjalanan]:\nلَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
      latin:
        "[Saat di Bukit Shafa/Marwah]:\nInnash-shafaa wal marwata min sya'aairillaahi, abda-u bimaa bada-allaahu bihi\n\n[Dzikir Perjalanan]:\nLaa ilaaha illallaahu wahdahu laa syariikalahu, lahul mulku wa lahul hamdu wa huwa 'alaa kulli syai-in qadiir",
    },
    {
      title: "Tahallul",
      desc: "Memotong rambut sebagai tanda berakhirnya Umroh.",
      arabic: "أَللَّهُمَّ هَذَا تَحَلُّلِي فِي الْمَكَانِ الَّذِي حَبَسْتَنِي فِيهِ",
      latin: "Allahumma hadza tahalluli fil makaanilladzi habastanii fiih",
    },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate("beranda")}
          className="flex items-center gap-2 text-muted-foreground font-bold text-sm hover:text-primary transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center">
            ←
          </div>
          Kembali
        </button>
        <span className="px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest border border-emerald-200">
          Panduan Manasik
        </span>
      </div>

      <h2 className="text-3xl font-black text-foreground">Tata Cara Umroh</h2>

      <div className="space-y-4">
        {steps.map((step, i) => (
          <div
            key={i}
            className="relative bg-card p-8 rounded-[2.5rem] border border-border shadow-sm space-y-4 overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-emerald-600" />
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-xl font-black text-slate-300 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                {i + 1}
              </div>
              <h3 className="font-bold text-foreground text-xl">{step.title}</h3>
            </div>
            <p className="text-muted-foreground text-sm font-medium leading-relaxed">{step.desc}</p>
            <div className="bg-emerald-50 p-4 rounded-xl">
              <p className="text-right font-arabic text-xl leading-[2] text-emerald-900" dir="rtl">
                {step.arabic}
              </p>
              <p className="text-emerald-700 font-medium italic leading-relaxed text-xs">
                {step.latin}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Perencanaan({ onNavigate }: { onNavigate: (id: string) => void }) {
  const [activeTab, setActiveTab] = useState(9);
  const itinerary = {
    9: [
      { day: 1, activity: "Keberangkatan & Tiba di Jeddah/Madinah" },
      { day: 2, activity: "Ziarah Internal Madinah (Raudhah)" },
      { day: 3, activity: "Ziarah Luar Madinah (Masjid Quba, Uhud)" },
      { day: 4, activity: "Perjalanan ke Makkah & Pelaksanaan Umroh" },
      { day: 5, activity: "Memperbanyak Ibadah di Masjidil Haram" },
      { day: 6, activity: "Ziarah Makkah & Umroh Kedua (Opsional)" },
      { day: 7, activity: "Ibadah Mandiri & Belanja Oleh-oleh" },
      { day: 8, activity: "Tawaf Wada & Menuju Jeddah" },
      { day: 9, activity: "Terbang Kembali ke Indonesia" },
    ],
    12: [
      { day: 1, activity: "Keberangkatan" },
      { day: 2, activity: "Tiba di Madinah & Istirahat" },
      { day: 3, activity: "Ziarah Raudhah & Makam Rasulullah" },
      { day: 4, activity: "Ziarah Kota Madinah" },
      { day: 5, activity: "Ibadah Mandiri di Masjid Nabawi" },
      { day: 6, activity: "Menuju Makkah & Umroh Pertama" },
      { day: 7, activity: "Ibadah Mandiri di Masjidil Haram" },
      { day: 8, activity: "Ziarah Kota Makkah" },
      { day: 9, activity: "Umroh Kedua (Miqat Ji'ranah)" },
      { day: 10, activity: "Ibadah Mandiri & Belanja" },
      { day: 11, activity: "Tawaf Wada & City Tour Jeddah" },
      { day: 12, activity: "Kepulangan ke Tanah Air" },
    ],
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate("beranda")}
          className="flex items-center gap-2 text-muted-foreground font-bold text-sm hover:text-primary transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center">
            ←
          </div>
          Kembali
        </button>
        <div className="flex gap-2">
          {[9, 12].map((days) => (
            <button
              key={days}
              onClick={() => setActiveTab(days)}
              className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${activeTab === days ? "bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-100" : "bg-card text-muted-foreground border-border"}`}
            >
              {days} Hari
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-3xl font-black text-foreground">Itinerary Perjalanan</h2>
        <p className="text-muted-foreground text-sm font-medium">
          Rencana kegiatan harian untuk paket {activeTab} hari.
        </p>
      </div>

      <div className="space-y-4">
        {itinerary[activeTab as keyof typeof itinerary].map((item, i) => (
          <div
            key={i}
            className="bg-card p-6 rounded-[2rem] border border-border shadow-sm flex items-center gap-6 group hover:border-emerald-200 transition-all"
          >
            <div className="w-16 h-16 rounded-2xl bg-muted flex flex-col items-center justify-center text-muted-foreground group-hover:bg-emerald-600 group-hover:text-white transition-all shrink-0">
              <span className="text-[10px] font-black uppercase">Hari</span>
              <span className="text-2xl font-black leading-none">{item.day}</span>
            </div>
            <p className="font-bold text-foreground leading-relaxed">{item.activity}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SpotFoto({ onNavigate }: { onNavigate: (id: string) => void }) {
  const [loaded, setLoaded] = useState<Record<number, boolean>>({});

  const spots = [
    {
      title: "Ka'bah & Mataf",
      area: "Masjidil Haram",
      tip: "Waktu terbaik setelah Subuh atau jam 10 pagi saat pencahayaan lembut.",
      image: "",
      color: "from-emerald-900 to-emerald-700",
      icon: Camera,
    },
    {
      title: "Payung Nabawi",
      area: "Madinah",
      tip: "Momen terbaik saat payung mulai terbuka otomatis setelah Subuh.",
      image: "",
      color: "from-blue-900 to-blue-700",
      icon: Moon,
    },
    {
      title: "Jabal Rahmah",
      area: "Arafat",
      tip: "Spot ikonik di tugu pertemuan Adam & Hawa. Hati-hati jangan mencoret tugu.",
      image: "",
      color: "from-amber-900 to-amber-700",
      icon: MapPin,
    },
    {
      title: "Arsitektur Klasik",
      area: "Al-Balad / Jeddah",
      tip: "Bangunan klasik dengan nuansa tradisional Arab, sangat bagus untuk foto budaya.",
      image: "",
      color: "from-rose-900 to-rose-700",
      icon: Hotel,
    },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate("beranda")}
          className="flex items-center gap-2 text-muted-foreground font-bold text-sm hover:text-primary transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center">
            ←
          </div>
          Kembali
        </button>
        <span className="px-4 py-1.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-black uppercase tracking-widest border border-rose-200">
          Spot Fotografi
        </span>
      </div>

      <div className="grid sm:grid-cols-2 gap-8">
        {spots.map((spot, i) => (
          <div
            key={i}
            className="group bg-card rounded-[2.5rem] border border-border overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
          >
            <div className="aspect-[16/10] relative overflow-hidden bg-muted">
              <div
                className={`absolute inset-0 bg-gradient-to-br ${spot.color} flex flex-col items-center justify-center p-6 text-center`}
              >
                <spot.icon className="w-12 h-12 text-white/20 mb-3" />
                <p className="text-white/40 text-[8px] font-black uppercase tracking-[0.2em]">
                  {spot.title}
                </p>
              </div>

              {spot.image && (
                <img
                  src={spot.image}
                  alt={spot.title}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 group-hover:scale-110 ${loaded[i] ? "opacity-100" : "opacity-0"}`}
                  onLoad={() => setLoaded((prev) => ({ ...prev, [i]: true }))}
                  onError={(e) => {
                    console.error("Image failed:", spot.title);
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
              <div className="absolute top-4 left-4 px-3 py-1 bg-card/90 backdrop-blur rounded-full text-[10px] font-black text-foreground uppercase tracking-widest border border-border shadow-sm">
                {spot.area}
              </div>
            </div>
            <div className="p-8">
              <h3 className="font-black text-foreground text-xl mb-3">{spot.title}</h3>
              <div className="flex gap-3 items-start">
                <Info className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                  {spot.tip}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TipsPraktis({ onNavigate }: { onNavigate: (id: string) => void }) {
  const tips = [
    {
      category: "Bahasa",
      title: "Kalimat Dasar Arab",
      content:
        "Syukran (Terima Kasih), Afwan (Sama-sama), Kam Haadza? (Berapa ini?), Aina (Dimana).",
      icon: Sparkles,
    },
    {
      category: "Kesehatan",
      title: "Hidrasi & Kulit",
      content:
        "Selalu bawa botol Zam-zam, gunakan pelembab kulit & tabir surya agar tidak pecah-pecah.",
      icon: AlertTriangle,
    },
    {
      category: "Ibadah",
      title: "Menghindari Kerumunan",
      content:
        "Gunakan lantai atas Masjidil Haram jika lantai dasar terlalu padat. Berangkatlah 1 jam sebelum adzan.",
      icon: Lightbulb,
    },
    {
      category: "Uang",
      title: "Tukar Riayal",
      content: "Sediakan uang pecahan kecil (1, 5, 10 SAR) untuk sedekah atau belanja ringan.",
      icon: ShoppingBag,
    },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate("beranda")}
          className="flex items-center gap-2 text-muted-foreground font-bold text-sm hover:text-primary transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center">
            ←
          </div>
          Kembali
        </button>
        <span className="px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-widest border border-indigo-200">
          Tips & Trik
        </span>
      </div>

      <div className="grid gap-6">
        {tips.map((tip, i) => (
          <div
            key={i}
            className="bg-card p-8 rounded-[2.5rem] border border-border shadow-sm flex gap-6 items-start hover:border-primary transition-all group"
          >
            <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
              <tip.icon className="w-8 h-8" />
            </div>
            <div>
              <span className="text-[10px] font-black text-primary/60 uppercase tracking-widest">
                {tip.category}
              </span>
              <h3 className="font-black text-foreground text-xl mb-2">{tip.title}</h3>
              <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                {tip.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Persiapan({ onNavigate }: { onNavigate: (id: string) => void }) {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Paspor (Berlaku min. 6 bulan)", done: true },
    { id: 2, text: "Sertifikat Vaksin & Visa", done: true },
    { id: 3, text: "Kain Ihram (2 Set) / Mukena", done: false },
    { id: 4, text: "Sandal/Sepatu Nyaman", done: false },
    { id: 5, text: "Obat-obatan Pribadi & Vitamin", done: false },
    { id: 6, text: "Powerbank & Adaptor Colokan G", done: false },
    { id: 7, text: "Botol Semprot Air (Wudhu/Segar)", done: false },
  ]);

  const toggle = (id: number) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const progress = Math.round((tasks.filter((t) => t.done).length / tasks.length) * 100);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate("beranda")}
          className="flex items-center gap-2 text-muted-foreground font-bold text-sm hover:text-primary transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center">
            ←
          </div>
          Kembali
        </button>
        <span className="px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-widest border border-amber-200">
          Checklist Persiapan
        </span>
      </div>

      <div className="bg-primary/90 rounded-[2.5rem] p-8 text-primary-foreground mb-8 relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-primary-foreground/70 text-xs font-bold uppercase tracking-widest mb-2">
            Progress Persiapan
          </p>
          <div className="flex items-end justify-between mb-4">
            <h3 className="text-4xl font-black">{progress}%</h3>
            <p className="text-sm font-bold text-primary-foreground/80">
              {tasks.filter((t) => t.done).length} dari {tasks.length} item siap
            </p>
          </div>
          <div className="h-3 bg-primary-foreground/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-foreground transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="bg-card rounded-[2.5rem] border border-border overflow-hidden shadow-sm">
        <div className="p-8 border-b border-border bg-muted/50">
          <h3 className="font-black text-foreground text-xl">Daftar Barang Bawaan</h3>
          <p className="text-muted-foreground text-sm font-medium mt-1">
            Ketuk pada item untuk menandai sebagai selesai.
          </p>
        </div>
        <div className="divide-y divide-border">
          {tasks.map((task) => (
            <button
              key={task.id}
              onClick={() => toggle(task.id)}
              className="w-full p-6 flex items-center gap-5 hover:bg-muted transition-colors text-left group"
            >
              <div
                className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${task.done ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20" : "border-border group-hover:border-primary/50"}`}
              >
                {task.done && <Check className="w-5 h-5" strokeWidth={3} />}
              </div>
              <span
                className={`font-bold text-base transition-all ${task.done ? "text-muted-foreground/40 line-through" : "text-foreground"}`}
              >
                {task.text}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Pengaturan({ onNavigate }: { onNavigate: (id: string) => void }) {
  const options = [
    { title: "Ubah Profil", sub: "Nama, Email & Foto", icon: SettingsIcon },
    { title: "Notifikasi", sub: "Pengingat Waktu Shalat & Persiapan", icon: AlertTriangle },
    { title: "Bahasa", sub: "Bahasa Indonesia", icon: Sparkles },
    { title: "Bantuan & Dukungan", sub: "Pusat Bantuan Umroh Planner", icon: Info },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate("beranda")}
          className="flex items-center gap-2 text-muted-foreground font-bold text-sm hover:text-primary transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center">
            ←
          </div>
          Kembali
        </button>
        <span className="px-4 py-1.5 rounded-full bg-muted text-muted-foreground text-[10px] font-black uppercase tracking-widest border border-border">
          Pengaturan
        </span>
      </div>

      <div className="bg-card rounded-[2.5rem] border border-border p-10 space-y-10 shadow-sm">
        <div className="flex items-center gap-8">
          <div className="w-24 h-24 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary text-4xl font-black shadow-inner">
            H
          </div>
          <div>
            <h3 className="font-black text-foreground text-2xl">Hamba Allah</h3>
            <p className="text-muted-foreground font-medium mb-3">Pengguna Mode Tamu</p>
            <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">
              Akun Aktif
            </span>
          </div>
        </div>

        <div className="grid gap-4">
          {options.map((opt, i) => (
            <button
              key={i}
              className="w-full p-6 rounded-2xl border border-border flex items-center justify-between hover:border-primary/50 hover:bg-primary/5 transition-all text-left group"
            >
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <opt.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-base">{opt.title}</p>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest group-hover:text-primary transition-colors">
                    {opt.sub}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>
      </div>

      <p className="text-center text-muted-foreground/30 text-[10px] font-black uppercase tracking-widest">
        Umroh Planner Pro v1.0.4 • 2026
      </p>
    </div>
  );
}
