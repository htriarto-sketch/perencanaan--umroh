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
  Mountain,
  Shield,
  Coins,
  MessageSquare,
  Type,
  Volume2,
  Smartphone,
  Fingerprint,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import { ThemeToggle } from "@/components/theme-toggle";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard · Program Perencanaan Umroh" }] }),
  component: DashboardPage,
});

const hubs = [
  { 
    id: "ibadah", 
    label: "Hub Ibadah", 
    icon: Moon, 
    color: "bg-emerald-600",
    desc: "Panduan, Doa, & Tasbih Digital",
    subItems: ["panduan", "doa", "alat"]
  },
  { 
    id: "persiapan", 
    label: "Hub Persiapan", 
    icon: CalendarClock, 
    color: "bg-blue-600",
    desc: "Biaya, Itinerary, & Checklist",
    subItems: ["biaya", "rencana", "siap"]
  },
  { 
    id: "jelajah", 
    label: "Hub Jelajah", 
    icon: MapPin, 
    color: "bg-amber-500",
    desc: "GPS, Tips Nusuk, & Spot Foto",
    subItems: ["gps", "tips", "foto"]
  },
];

const navItems = [
  { icon: Sparkles, label: "Beranda", id: "beranda" },
  { icon: Moon, label: "Ibadah", id: "ibadah" },
  { icon: CalendarClock, label: "Persiapan", id: "persiapan" },
  { icon: MapPin, label: "Jelajah", id: "jelajah" },
  { icon: SettingsIcon, label: "Pengaturan", id: "settings" },
];

function DashboardPage() {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [active, setActive] = useState("beranda");
  const [checking, setChecking] = useState(true);
  const [umrohProgress, setUmrohProgress] = useState([
    { id: "ihram", label: "Ihram & Niat", done: false },
    { id: "tawaf", label: "Tawaf 7 Putaran", done: false },
    { id: "sai", label: "Sa'i (Shafa-Marwah)", done: false },
    { id: "tahallul", label: "Tahallul / Cukur", done: false },
  ]);

  const toggleStep = (id: string) => {
    setUmrohProgress(umrohProgress.map(s => s.id === id ? { ...s, done: !s.done } : s));
  };

  const progressPercent = Math.round((umrohProgress.filter(s => s.done).length / umrohProgress.length) * 100);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session: s } } = await supabase.auth.getSession();
      if (s) { setSession(s); setChecking(false); return; }
      const localSessionStr = localStorage.getItem("supabase.auth.token");
      if (localSessionStr) {
        try {
          const localSession = JSON.parse(localSessionStr);
          if (localSession?.user) { setSession(localSession as any); setChecking(false); return; }
        } catch (e) {}
      }
      setChecking(false);
      navigate({ to: "/login", replace: true });
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, s) => {
      if (s) { setSession(s); setChecking(false); } 
      else {
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

  const handleSOS = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
        const message = encodeURIComponent(`Assalamu'alaikum, saya butuh bantuan. Lokasi saya: ${mapsUrl}`);
        window.open(`https://wa.me/?text=${message}`, "_blank");
      });
    }
  };

  if (checking) return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground transition-colors duration-500">
      <div className="text-sm text-muted-foreground animate-pulse font-black uppercase tracking-widest">Memuat Aplikasi…</div>
    </div>
  );
  if (!session) return null;

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-500 font-sans">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-72 flex-col bg-card/50 backdrop-blur-xl border-r border-border p-6 sticky top-0 h-screen">
        <div 
          onClick={() => setActive("beranda")}
          className="flex items-center gap-3 mb-10 px-2 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/20 group-hover:scale-110 transition-transform">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-black text-foreground text-sm leading-tight uppercase tracking-tighter">Umroh Pro</h2>
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-50">v1.0.5</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                active === item.id
                  ? "bg-emerald-600 text-white shadow-xl shadow-emerald-600/20"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-border space-y-4">
          <ThemeToggle />
          <button
            onClick={() => {
              supabase.auth.signOut();
              localStorage.removeItem("supabase.auth.token");
              navigate({ to: "/login" });
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-destructive hover:bg-destructive/10 transition-all uppercase tracking-widest"
          >
            <LogOut className="w-4 h-4" />
            Keluar Akun
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-card/80 backdrop-blur-md border-b border-border px-6 flex items-center justify-between sticky top-0 z-50">
          <div 
            onClick={() => setActive("beranda")}
            className="flex items-center gap-4 lg:hidden cursor-pointer"
          >
            <Sparkles className="w-6 h-6 text-emerald-600" />
            <span className="font-black text-foreground uppercase tracking-tighter">Umroh Pro</span>
          </div>
          <div className="hidden lg:block">
             <h1 className="font-black text-xl uppercase tracking-widest text-muted-foreground/10">
               {navItems.find(n => n.id === active)?.label || "Dashboard"}
             </h1>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActive("alat")}
              className="px-4 py-2 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <Fingerprint className="w-4 h-4" />
              Tasbih
            </button>
            <button 
              onClick={handleSOS}
              className="px-4 py-2 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-600/20 flex items-center gap-2 hover:bg-rose-700 active:scale-95 transition-all"
            >
              <AlertTriangle className="w-4 h-4" />
              SOS
            </button>
          </div>
        </header>

        <main className="flex-1 p-5 sm:p-10 max-w-5xl mx-auto w-full">
          {active === "beranda" && <Beranda email={session.user.email ?? "Hamba Allah"} onNavigate={setActive} />}
          
          {/* Ibadah Hub */}
          {active === "ibadah" && (
            <div className="space-y-12">
              <div className="bg-emerald-600 rounded-[3rem] p-10 text-white shadow-2xl shadow-emerald-900/20 relative overflow-hidden">
                <div className="relative z-10 space-y-6">
                  <div>
                    <h3 className="text-2xl font-black mb-1">Status Ibadah Umroh</h3>
                    <p className="text-emerald-100/70 text-sm font-medium">Lacak kemajuan manasik Anda saat ini.</p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {umrohProgress.map((step) => (
                      <button 
                        key={step.id} 
                        onClick={() => toggleStep(step.id)}
                        className={`p-4 rounded-2xl flex flex-col items-center gap-2 transition-all border ${step.done ? "bg-white text-emerald-700 border-white" : "bg-emerald-700/50 text-emerald-200 border-emerald-500/30"}`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.done ? "bg-emerald-100" : "bg-emerald-800"}`}>
                          {step.done ? <Check className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                        </div>
                        <span className="text-[10px] font-black uppercase text-center leading-tight">{step.label.split(" ")[0]}</span>
                      </button>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-emerald-100">
                      <span>Progress</span>
                      <span>{progressPercent}%</span>
                    </div>
                    <div className="h-2 bg-emerald-800 rounded-full overflow-hidden">
                      <div className="h-full bg-white transition-all duration-700" style={{ width: `${progressPercent}%` }} />
                    </div>
                  </div>
                </div>
                <Sparkles className="absolute -bottom-8 -right-8 w-48 h-48 text-white/5 -rotate-12" />
              </div>

              <HubView title="Hub Ibadah" desc="Semua yang Anda butuhkan saat menjalankan manasik." items={[
                { id: "panduan", label: "Panduan Manasik", icon: BookOpen, color: "bg-emerald-600" },
                { id: "doa", label: "Bank Doa", icon: Compass, color: "bg-emerald-600" },
                { id: "alat", label: "Tasbih & Toolkit", icon: Fingerprint, color: "bg-emerald-600" },
              ]} onNavigate={setActive} />
            </div>
          )}
          
          {/* Persiapan Hub */}
          {active === "persiapan" && <HubView title="Hub Persiapan" desc="Pastikan rencana keberangkatan Anda matang." items={[
            { id: "biaya", label: "Estimasi Biaya", icon: Calculator, color: "bg-blue-600" },
            { id: "rencana", label: "Itinerary", icon: ClipboardList, color: "bg-blue-600" },
            { id: "siap", label: "Checklist", icon: Check, color: "bg-blue-600" },
          ]} onNavigate={setActive} />}

          {/* Jelajah Hub */}
          {active === "jelajah" && <HubView title="Hub Jelajah" desc="Informasi lokasi dan tips praktis di Tanah Suci." items={[
            { id: "gps", label: "Navigasi GPS", icon: MapPin, color: "bg-amber-500" },
            { id: "tips", label: "Tips Nusuk", icon: Lightbulb, color: "bg-amber-500" },
            { id: "foto", label: "Spot Foto", icon: Camera, color: "bg-amber-500" },
          ]} onNavigate={setActive} />}

          {active === "biaya" && <KalkulasiBiaya onNavigate={setActive} />}
          {active === "gps" && <TrackingGPS onNavigate={setActive} />}
          {active === "doa" && <BankDoa onNavigate={setActive} />}
          {active === "alat" && <AlatBantu onNavigate={setActive} />}
          {active === "panduan" && <PanduanIbadah onNavigate={setActive} />}
          {active === "rencana" && <Perencanaan onNavigate={setActive} />}
          {active === "foto" && <SpotFoto onNavigate={setActive} />}
          {active === "tips" && <TipsPraktis onNavigate={setActive} />}
          {active === "siap" && <Persiapan onNavigate={setActive} />}
          {active === "settings" && <Pengaturan onNavigate={setActive} />}
        </main>

        {/* Mobile Navigation Bar */}
        <nav className="lg:hidden h-20 bg-card/80 backdrop-blur-xl border-t border-border flex items-center justify-around px-2 sticky bottom-0 z-50">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`flex flex-col items-center gap-1.5 transition-all ${active === item.id ? "text-emerald-600 scale-110" : "text-muted-foreground opacity-60"}`}
            >
              <div className={`p-2 rounded-xl ${active === item.id ? "bg-emerald-600/10" : ""}`}>
                <item.icon className="w-5 h-5" strokeWidth={active === item.id ? 3 : 2} />
              </div>
              <span className="text-[9px] font-black uppercase tracking-tighter">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

function HubView({ title, desc, items, onNavigate }: { title: string, desc: string, items: any[], onNavigate: (id: string) => void }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
       <div className="space-y-2 text-center sm:text-left">
        <h2 className="text-4xl font-black text-foreground tracking-tighter">{title}</h2>
        <p className="text-muted-foreground font-medium">{desc}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className="group bg-card/40 backdrop-blur-md p-8 rounded-[2.5rem] border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left flex items-center justify-between"
          >
            <div className="flex items-center gap-6">
              <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                <item.icon className="w-7 h-7" />
              </div>
              <span className="font-black text-xl text-foreground tracking-tight">{item.label}</span>
            </div>
            <ChevronRight className="w-6 h-6 text-muted-foreground/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </button>
        ))}
      </div>
      <div className="flex justify-center sm:justify-start">
        <button 
          onClick={() => onNavigate("beranda")}
          className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-emerald-600 transition-colors flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-full border border-border"
        >
          ← Kembali ke Beranda
        </button>
      </div>
    </div>
  );
}

function Beranda({ email, onNavigate }: { email: string; onNavigate: (id: string) => void }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10">
      {/* Widget Info Premium */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Makkah", val: "19:04", sub: "Ashar", icon: Sun, color: "text-amber-500" },
          { label: "Cuaca", val: "42°C", sub: "Cerah", icon: Sparkles, color: "text-blue-400" },
          { label: "Kurs", val: "4.500", sub: "IDR/SAR", icon: Coins, color: "text-emerald-500" },
          { label: "Tasbih", val: "7/7", sub: "Putaran", icon: Fingerprint, color: "text-rose-400" },
        ].map((w, i) => (
          <div key={i} className="bg-card/30 backdrop-blur-xl p-5 rounded-[2.5rem] border border-border/50 shadow-sm flex flex-col items-center text-center group hover:border-emerald-500/30 transition-all">
             <w.icon className={`w-5 h-5 mb-3 ${w.color} group-hover:scale-110 transition-transform`} />
             <p className="text-xl font-black text-foreground tracking-tight">{w.val}</p>
             <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-60">{w.sub}</p>
          </div>
        ))}
      </div>

      <div className="relative overflow-hidden rounded-[3rem] bg-emerald-900 p-10 sm:p-16 text-white shadow-2xl shadow-emerald-900/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-800/50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
        <div className="relative z-10">
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-800/40 text-emerald-300 text-[10px] font-black uppercase tracking-widest mb-6 border border-emerald-700/50">
            Pusat Kendali Jamaah
          </span>
          <h1 className="text-4xl sm:text-5xl font-black mb-4 tracking-tighter leading-tight">Lanjutkan Persiapan, <br/> {email.split("@")[0]}!</h1>
          <p className="text-emerald-100/60 text-lg max-w-md leading-relaxed font-medium">
            Semua kebutuhan ibadah dan rencana perjalanan Anda dalam satu genggaman.
          </p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {hubs.map((hub) => (
          <button
            key={hub.id}
            onClick={() => onNavigate(hub.id)}
            className="group relative bg-card/60 backdrop-blur-md p-10 rounded-[3rem] border border-border shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all text-left overflow-hidden h-full flex flex-col"
          >
            <div className={`w-16 h-16 ${hub.color} rounded-[2rem] flex items-center justify-center text-white mb-8 shadow-xl group-hover:scale-110 transition-transform`}>
              <hub.icon className="w-8 h-8" />
            </div>
            <h3 className="font-black text-foreground text-2xl mb-2 tracking-tight">{hub.label}</h3>
            <p className="text-muted-foreground text-sm font-medium leading-relaxed mb-8">{hub.desc}</p>
            <div className="mt-auto flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
              Masuk Hub <ChevronRight className="w-3 h-3" />
            </div>
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
  const [activeSite, setActiveSite] = useState<"haram" | "nabawi">("haram");

  const haramGates = [
    { nr: "1", name: "King Abdul Aziz Gate", desc: "Sisi Selatan, dekat Clock Tower (Ajyad).", color: "bg-emerald-600" },
    { nr: "79", name: "King Fahd Gate", desc: "Sisi Barat, akses utama area perluasan lama.", color: "bg-blue-600" },
    { nr: "100", name: "King Abdullah Gate", desc: "Sisi Utara, perluasan terbaru & termegah.", color: "bg-amber-600" },
    { nr: "62", name: "Bab Al-Umrah", desc: "Sisi Barat Laut, jalur lurus ke area Mataf.", color: "bg-rose-600" },
    { nr: "45", name: "Bab Al-Fath", desc: "Sisi Timur Laut, dekat area akhir Sa'i (Marwah).", color: "bg-indigo-600" },
  ];

  const nabawiGates = [
    { colorName: "Merah", range: "328-343", side: "Utara", desc: "Sektor hotel utama (banyak jamaah RI).", color: "bg-red-600" },
    { colorName: "Hijau", range: "301-308", side: "Selatan", desc: "Dekat Raudhah & Makam Rasulullah.", color: "bg-green-600" },
    { colorName: "Biru", range: "344-364", side: "Timur", desc: "Akses menuju Pemakaman Baqi.", color: "bg-blue-600" },
    { colorName: "Oranye", range: "314-327", side: "Barat", desc: "Dekat Museum As-Salam & Pasar Bilal.", color: "bg-orange-500" },
    { colorName: "Ungu", range: "309-313", side: "B. Daya", desc: "Dekat Masjid Ghamamah.", color: "bg-purple-600" },
  ];

  const haramZiarah = [
    { name: "Jabal Nur (Gua Hira)", desc: "Tempat wahyu pertama turun. Butuh stamina fisik untuk mendaki.", icon: Mountain },
    { name: "Jabal Rahmah", desc: "Bukit kasih sayang di Padang Arafah, tempat Nabi Adam & Hawa bertemu.", icon: Sparkles },
    { name: "Jabal Tsur", desc: "Gunung tempat persembunyian Nabi saat hijrah ke Madinah.", icon: Shield },
    { name: "Kota Thaif", desc: "Daerah pegunungan sejuk dengan perkebunan mawar & sejarah dakwah.", icon: Sun },
  ];

  const nabawiZiarah = [
    { name: "Masjid Quba", desc: "Masjid pertama yang dibangun Nabi. Shalat 2 rakaat di sini setara 1 Umroh.", icon: BookOpen },
    { name: "Jabal Uhud", desc: "Bukit saksi perang Uhud & tempat makam Syuhada (Sayyidina Hamzah).", icon: Mountain },
    { name: "Masjid Qiblatain", desc: "Masjid tempat turunnya perintah perpindahan arah kiblat ke Ka'bah.", icon: Compass },
    { name: "Pemakaman Baqi", desc: "Makam keluarga Nabi & ribuan Sahabat di samping Masjid Nabawi.", icon: Moon },
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
        <div className="flex bg-muted p-1 rounded-xl border border-border">
          <button
            onClick={() => setActiveSite("haram")}
            className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeSite === "haram" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
          >
            Makkah
          </button>
          <button
            onClick={() => setActiveSite("nabawi")}
            className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeSite === "nabawi" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
          >
            Madinah
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-12">
          <section className="space-y-6">
            <h2 className="text-3xl font-black text-foreground">
              {activeSite === "haram" ? "Pintu Utama Masjidil Haram" : "Sistem Pintu Masjid Nabawi"}
            </h2>
            <div className="bg-card p-8 rounded-[2.5rem] border border-border shadow-sm space-y-6">
              <div className="grid gap-4">
                {activeSite === "haram" ? (
                  haramGates.map((gate, i) => (
                    <div key={i} className="flex items-center gap-6 p-4 rounded-2xl hover:bg-muted transition-colors border border-transparent hover:border-border group">
                      <div className={`w-16 h-16 rounded-2xl ${gate.color} flex flex-col items-center justify-center text-white shrink-0 shadow-lg`}>
                        <span className="text-[10px] font-black uppercase leading-none mb-1">Pintu</span>
                        <span className="text-2xl font-black leading-none">{gate.nr}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-lg">{gate.name}</h4>
                        <p className="text-muted-foreground text-sm font-medium">{gate.desc}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  nabawiGates.map((gate, i) => (
                    <div key={i} className="flex items-center gap-6 p-4 rounded-2xl hover:bg-muted transition-colors border border-transparent hover:border-border group">
                      <div className={`w-16 h-16 rounded-2xl ${gate.color} flex flex-col items-center justify-center text-white shrink-0 shadow-lg`}>
                        <span className="text-[10px] font-black uppercase leading-none mb-1">{gate.side}</span>
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-foreground text-lg">Zona {gate.colorName}</h4>
                          <span className="px-2 py-0.5 rounded-full bg-muted text-[10px] font-black text-muted-foreground border border-border">
                            Pintu {gate.range}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-sm font-medium">{gate.desc}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-black text-foreground">Destinasi Ziarah Populer</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {(activeSite === "haram" ? haramZiarah : nabawiZiarah).map((place, i) => (
                <div key={i} className="bg-card p-6 rounded-3xl border border-border shadow-sm flex flex-col gap-4 group hover:border-primary/30 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    <place.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-lg mb-1">{place.name}</h4>
                    <p className="text-muted-foreground text-xs font-medium leading-relaxed">{place.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="bg-amber-50 dark:bg-amber-900/10 p-8 rounded-[2.5rem] border border-amber-100 dark:border-amber-900/30">
            <Navigation className="w-10 h-10 text-amber-600 mb-4" />
            <h3 className="font-black text-amber-900 dark:text-amber-200 text-xl mb-4">Tips Navigasi</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                <p className="text-sm text-amber-800 dark:text-amber-300 font-medium leading-relaxed">
                  <strong>Foto Nomor Pintu:</strong> Selalu foto nomor pintu saat masuk agar mudah saat mencari jalan keluar.
                </p>
              </div>
              <div className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                <p className="text-sm text-amber-800 dark:text-amber-300 font-medium leading-relaxed">
                  <strong>Kode Warna Nabawi:</strong> Pelataran luar Nabawi menggunakan kode warna pada tiang lampu/payung. Merah mengarah ke sektor hotel utama Indonesia.
                </p>
              </div>
              <div className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                <p className="text-sm text-amber-800 dark:text-amber-300 font-medium leading-relaxed">
                  <strong>Ke Raudhah:</strong> Pastikan Anda memiliki tasrih aktif di aplikasi <strong>Nusuk</strong> sebelum menuju Pintu Masuk Raudhah.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card p-8 rounded-[2.5rem] border border-border shadow-sm">
            <h3 className="font-black text-foreground text-lg mb-4">Waktu Operasional</h3>
            <div className="space-y-3">
              {[
                { name: "Masjid Quba", dist: "Pagi Hari (Sunnah)" },
                { name: "Museum Nabawi", dist: "08:00 - 20:00" },
                { name: "Pabrik Mawar Thaif", dist: "Musim Semi" },
              ].map((loc, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border">
                  <span className="text-sm font-bold text-foreground">{loc.name}</span>
                  <span className="text-[10px] font-black text-muted-foreground uppercase">{loc.dist}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



function BankDoa({ onNavigate }: { onNavigate: (id: string) => void }) {
  const [fontSize, setFontSize] = useState(24);
  const doas = [
    {
      title: "Doa Keluar Rumah",
      arabic: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
      latin: "Bismillaahi tawakkaltu 'alallaahi laa hawla wa laa quwwata illaa billaah",
    },
    {
      title: "Doa Perjalanan (Kendaraan)",
      arabic:
        "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ",
      latin:
        "Subhaanalladzii sakhkhara lanaa haadzaa wa maa kunnaa lahu muqriniin. Wa innaa ilaa rabbinaa lamunqalibuun",
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
      title: "Doa Melihat Ka'bah / Masjidil Haram",
      arabic:
        "اَللَّهُمَّ زِدْ هَذَا الْبَيْتَ تَشْرِيفًا وَتَعْظِيمًا وَتَكْرِيمًا وَمَهَابَةً، وَزِدْ مَنْ شَرَّفَهُ وَكَرَّمَهُ مِمَّنْ حَجَّهُ أَوِ اعْتَمَرَهُ تَشْرِيفًا وَتَكْرِيمًا وَتَعْظِيمًا وَبِرًّا",
      latin:
        "Allaahumma zid haadzal baita tasyriifan wa ta'zhiiman wa takriiman wa mahaabatan, wa zid man syarrafahu wa karramahu mimman hajjahu awi'tamarahu tasyriifan wa takriiman wa ta'zhiiman wa birran",
    },
    {
      title: "Doa Tawaf - Bagian 1 (Awal Tawaf)",
      arabic:
        "بِسْمِ اللهِ، اَللهُ أَكْبَرُ، اَللَّهُمَّ إِيْمَانًا بِكَ وَتَصْدِيْقًا بِكِتَابِكَ وَوَفَاءً بِعَهْدِكَ وَاتِّبَاعًا لِسُنَّةِ نَبِيِّكَ مُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ",
      latin:
        "Bismillaahi, Allaahu akbar, Allaahumma iimaanan bika wa tashdiiqan bikitaabika wa wafaa'an bi'ahdika wattibaa'an lisunnati nabiyyika Muhammadin shallallaahu 'alaihi wa sallam",
    },
    {
      title: "Doa Tawaf - Bagian 2 (Antara Rukun Yamani & Hajar Aswad)",
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
        "اَللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا وَاسِعًا، وَشِفَاءً مِنْ كُلِّ daa-in",
      latin:
        "Allaahumma innii as-aluka 'ilman naafi'an, wa rizqan waasi'an, wa syifaa-an min kulli daa-in",
    },
    {
      title: "Doa Sa'i (Awal di Shafa/Marwah)",
      arabic: "إِنَّ الصَّفَا وَالْمَرْوَةَ مِن شَعَآئِرِ اللَّهِ، أَبْدَأُ بِمَا بَدَأَ اللهُ بِهِ",
      latin: "Innash-shafaa wal marwata min sya'aairillaahi, abda-u bimaa bada-allaahu bihi",
    },
    {
      title: "Doa Sa'i (Lari-lari Kecil di Lampu Hijau)",
      arabic: "رَبِّ اغْفِرْ وَارْحَمْ وَاعْفُ وَتَكَرَّمْ وَتَجَاوَزْ عَمَّا تَعْلَمُ، إِنَّكَ أَنْتَ الْأَعَزُّ الْأَكْرَمُ",
      latin: "Rabbighfir warham wa'fu wa takarram wa tajaawaz 'ammaa ta'lam, innaka antal a'azzul akram",
    },
    {
      title: "Doa Masuk Raudhah (Masjid Nabawi)",
      arabic:
        "بِسْمِ اللهِ وَعَلَى مِلَّةِ رَسُوْلِ اللهِ، رَبِّ أَدْخِلْنِي مُدْخَلَ صِدْقٍ وَأَخْرِجْنِي مُخْرَجَ صِدْقٍ وَاجْعَلْ لِي مِنْ لَدُنْكَ سُلْطَانًا نَصِيرًا",
      latin:
        "Bismillahi wa 'ala millati Rasulillahi. Rabbi adkhilni mudkhala shidqin wa akhrijni mukhraja shidqin waj'al li min ladunka sulthanan nashira",
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
        <div className="flex items-center gap-4 bg-muted p-2 rounded-xl border border-border">
          <Type className="w-4 h-4 text-muted-foreground" />
          <input
            type="range"
            min="16"
            max="48"
            value={fontSize}
            onChange={(e) => setFontSize(parseInt(e.target.value))}
            className="w-24 h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-foreground">Kumpulan Doa</h2>
        <span className="px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest border border-blue-200">
          Ramah Lansia Mode
        </span>
      </div>

      <div className="grid gap-6">
        {doas.map((doa, i) => (
          <div
            key={i}
            className="bg-card p-8 rounded-[2.5rem] border border-border shadow-sm space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-foreground text-xl">{doa.title}</h3>
              <div className="flex gap-2">
                <button className="p-3 bg-muted rounded-2xl text-primary hover:bg-primary hover:text-white transition-all">
                  <Volume2 className="w-5 h-5" />
                </button>
                <button className="p-3 bg-muted rounded-2xl text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all">
                  <Compass className="w-5 h-5" />
                </button>
              </div>
            </div>
            <p 
              className="text-right font-arabic leading-[1.8] text-emerald-950 dark:text-emerald-50 transition-all duration-300" 
              dir="rtl"
              style={{ fontSize: `${fontSize}px` }}
            >
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

function AlatBantu({ onNavigate }: { onNavigate: (id: string) => void }) {
  const [tasbih, setTasbih] = useState(0);
  const [riyal, setRiyal] = useState("1");
  const kurs = 4500; // 1 SAR = Rp 4.500

  const handleSOS = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
        const message = encodeURIComponent(`Assalamu'alaikum, saya butuh bantuan. Ini lokasi saya saat ini: ${mapsUrl}`);
        window.open(`https://wa.me/?text=${message}`, "_blank");
      });
    } else {
      alert("Fitur GPS tidak didukung di perangkat ini.");
    }
  };

  const emergencyContacts = [
    { name: "Ambulans Saudi", phone: "997", icon: Shield },
    { name: "Polisi Saudi", phone: "999", icon: Shield },
    { name: "KUHAI Makkah", phone: "+966 50 000 0000", icon: MessageSquare },
    { name: "KUHAI Madinah", phone: "+966 50 111 1111", icon: MessageSquare },
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
          Toolkit Jamaah
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Tasbih Digital */}
        <div className="bg-card p-10 rounded-[3rem] border border-border shadow-sm flex flex-col items-center justify-center text-center space-y-8">
          <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary">
            <Fingerprint className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-foreground uppercase tracking-tight">Tasbih Digital</h3>
            <p className="text-muted-foreground text-sm font-medium">Klik untuk menghitung putaran (1-7)</p>
          </div>
          <div className="relative">
            <div className="absolute -inset-8 bg-primary/5 rounded-full blur-2xl" />
            <button 
              onClick={() => {
                setTasbih(prev => (prev >= 7 ? 0 : prev + 1));
                if (navigator.vibrate) navigator.vibrate(50);
              }}
              className="relative w-48 h-48 rounded-full bg-primary text-white text-6xl font-black shadow-2xl shadow-primary/40 active:scale-95 transition-transform flex items-center justify-center border-8 border-primary-foreground/20"
            >
              {tasbih}
            </button>
          </div>
          <button 
            onClick={() => setTasbih(0)}
            className="text-muted-foreground hover:text-destructive text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-2"
          >
            Reset Hitungan
          </button>
        </div>

        <div className="space-y-8">
          {/* Konverter Mata Uang */}
          <div className="bg-card p-8 rounded-[2.5rem] border border-border shadow-sm space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Coins className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-foreground">Konverter Riyal</h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-2xl border border-border">
                <label className="block text-[10px] font-black text-muted-foreground uppercase mb-1">Mata Uang Riyal (SAR)</label>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground text-lg">SAR</span>
                  <input 
                    type="number" 
                    value={riyal}
                    onChange={(e) => setRiyal(e.target.value)}
                    className="flex-1 bg-transparent border-none focus:ring-0 p-0 text-2xl font-black text-foreground"
                  />
                </div>
              </div>
              <div className="flex justify-center">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  ↓
                </div>
              </div>
              <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                <label className="block text-[10px] font-black text-primary/60 uppercase mb-1">Hasil Estimasi (IDR)</label>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-primary text-lg">Rp</span>
                  <p className="text-2xl font-black text-primary">
                    {(Number(riyal) * kurs).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-center text-muted-foreground font-medium italic">Estimasi Kurs 2026: 1 SAR ≈ Rp 4.500</p>
          </div>

          {/* Kontak Darurat */}
          <div className="bg-card p-8 rounded-[2.5rem] border border-border shadow-sm space-y-4">
            <h3 className="text-lg font-black text-foreground uppercase tracking-tight">Kontak Darurat (KSA)</h3>
            <div className="grid grid-cols-2 gap-3">
              {emergencyContacts.map((contact, i) => (
                <a 
                  key={i} 
                  href={`tel:${contact.phone.replace(/\s/g, "")}`}
                  className="p-4 bg-muted/50 rounded-2xl border border-border hover:border-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/10 transition-all group"
                >
                  <contact.icon className="w-4 h-4 text-rose-500 mb-2" />
                  <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">{contact.name}</p>
                  <p className="text-sm font-bold text-foreground group-hover:text-rose-600 transition-colors">{contact.phone}</p>
                </a>
              ))}
            </div>
          </div>
        </div>
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
  const [activeTab, setActiveTab] = useState<"umum" | "nusuk">("umum");
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

  const nusukSteps = [
    { step: 1, title: "Download & Registrasi", desc: "Unduh aplikasi 'Nusuk' di PlayStore/AppStore. Daftar menggunakan nomor Paspor & Visa." },
    { step: 2, title: "Pilih 'Prophet's Mosque Services'", desc: "Masuk ke menu layanan Masjid Nabawi untuk jadwal Raudhah." },
    { step: 3, title: "Pilih Waktu (Tasrih)", desc: "Pilih slot waktu yang tersedia (Warna Hijau = Tersedia, Merah = Penuh)." },
    { step: 4, title: "Simpan QR Code", desc: "Setelah berhasil, simpan screenshot QR Code untuk ditunjukkan ke petugas di pintu masuk." },
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
        <div className="flex bg-muted p-1 rounded-xl border border-border">
          <button
            onClick={() => setActiveTab("umum")}
            className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "umum" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
          >
            Tips Umum
          </button>
          <button
            onClick={() => setActiveTab("nusuk")}
            className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "nusuk" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
          >
            Panduan Nusuk
          </button>
        </div>
      </div>

      {activeTab === "umum" ? (
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
      ) : (
        <div className="space-y-6">
          <div className="bg-primary p-8 rounded-[3rem] text-primary-foreground relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-2xl font-black mb-2">Tutorial Booking Raudhah</h3>
              <p className="text-primary-foreground/80 text-sm font-medium">Ikuti langkah berikut agar proses ziarah Raudhah Anda lancar.</p>
            </div>
            <Smartphone className="absolute top-1/2 right-8 -translate-y-1/2 w-32 h-32 text-white/10 -rotate-12" />
          </div>
          <div className="grid gap-4">
            {nusukSteps.map((s, i) => (
              <div key={i} className="bg-card p-6 rounded-3xl border border-border flex gap-6 items-center">
                <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-xl font-black text-primary">
                  {s.step}
                </div>
                <div>
                  <h4 className="font-bold text-foreground">{s.title}</h4>
                  <p className="text-muted-foreground text-sm font-medium">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Persiapan({ onNavigate }: { onNavigate: (id: string) => void }) {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Paspor (Berlaku min. 6 bulan)", done: true, cat: "dok" },
    { id: 2, text: "Sertifikat Vaksin & Visa", done: true, cat: "dok" },
    { id: 3, text: "Tiket Pesawat & Itinerary", done: false, cat: "dok" },
    { id: 4, text: "Kain Ihram (2 Set) / Mukena", done: false, cat: "brg" },
    { id: 5, text: "Sandal/Sepatu Nyaman", done: false, cat: "brg" },
    { id: 6, text: "Obat-obatan Pribadi & Vitamin", done: false, cat: "brg" },
    { id: 7, text: "Powerbank & Adaptor Colokan G", done: false, cat: "brg" },
    { id: 8, text: "Botol Semprot Air (Wudhu/Segar)", done: false, cat: "brg" },
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

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-card rounded-[2.5rem] border border-border overflow-hidden shadow-sm h-fit">
          <div className="p-8 border-b border-border bg-emerald-50/50 dark:bg-emerald-950/10">
            <h3 className="font-black text-emerald-900 dark:text-emerald-100 text-xl flex items-center gap-3">
              <ClipboardList className="w-6 h-6" />
              Dokumen Penting
            </h3>
          </div>
          <div className="divide-y divide-border">
            {tasks.filter(t => t.cat === "dok").map((task) => (
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

        <div className="bg-card rounded-[2.5rem] border border-border overflow-hidden shadow-sm h-fit">
          <div className="p-8 border-b border-border bg-blue-50/50 dark:bg-blue-950/10">
            <h3 className="font-black text-blue-900 dark:text-blue-100 text-xl flex items-center gap-3">
              <ShoppingBag className="w-6 h-6" />
              Barang Bawaan
            </h3>
          </div>
          <div className="divide-y divide-border">
            {tasks.filter(t => t.cat === "brg").map((task) => (
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
