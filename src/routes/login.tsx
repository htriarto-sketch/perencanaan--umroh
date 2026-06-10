import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Moon, Mail, Lock, Loader2, Sparkles, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Masuk · Program Perencanaan Umroh" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    console.log("[Login] Attempting sign in with:", { email, passwordLength: password.length });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        throw error;
      }
      if (data.session) {
        navigate({ to: "/dashboard" });
      }
    } catch (err: any) {
      console.error("[Login] Auth Error:", err);
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2 bg-background text-foreground transition-colors duration-300">
      <div className="relative hidden gradient-primary lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="absolute inset-0 bg-arabesque opacity-20" />
        <Link to="/" className="relative flex items-center gap-2.5 text-cream">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cream/10 backdrop-blur">
            <Sparkles className="h-5 w-5 text-gold" />
          </div>
          <span className="font-bold uppercase tracking-widest text-sm">Umroh Planner Pro</span>
        </Link>
        <div className="relative">
          <p className="font-arabic text-4xl text-gold mb-6">بِسْمِ اللَّهِ</p>
          <h2 className="text-4xl font-black text-cream leading-tight">
            Melangkah Menuju
            <br />
            Baitullah dengan Tenang
          </h2>
          <p className="mt-4 text-cream/80 font-medium max-w-md">
            Masuk kembali untuk melanjutkan perencanaan ibadah suci Anda. Semua doa dan persiapan
            tersimpan aman.
          </p>
        </div>
        <p className="relative text-[10px] font-black uppercase tracking-[0.2em] text-cream/40">
          © 2026 Umroh Planner Ecosystem
        </p>
      </div>

      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 bg-background">
        <div className="mx-auto w-full max-w-sm space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-tight">Selamat Datang</h1>
            <p className="text-muted-foreground font-medium text-sm">
              Belum punya akun?{" "}
              <Link to="/register" className="text-primary font-bold hover:underline">
                Daftar sekarang
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                Alamat Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/50" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-border bg-card py-4 pl-12 pr-4 text-sm font-bold focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/30"
                  placeholder="anda@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                  Kata Sandi
                </label>
                <button
                  type="button"
                  className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
                >
                  Lupa Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/50" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-border bg-card py-4 pl-12 pr-4 text-sm font-bold focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/30"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-destructive/10 p-4 flex items-center gap-3 border border-destructive/20 animate-in fade-in zoom-in-95 duration-300">
                <div className="w-2 h-2 rounded-full bg-destructive shrink-0" />
                <p className="text-xs font-bold text-destructive leading-tight">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-primary py-4 text-sm font-black uppercase tracking-widest text-primary-foreground shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Masuk Akun"}
              {!loading && (
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              )}
            </button>
          </form>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
              <span className="bg-background px-4 text-muted-foreground/40">Atau Gunakan</span>
            </div>
          </div>

          {import.meta.env.VITE_ENABLE_GUEST_MODE === "true" && (
            <button
              type="button"
              onClick={() => {
                console.log("[Login] Bypassing auth for development");
                const fakeSession = {
                  user: { id: "dev-user", email: "tamu@umroh.com" },
                  access_token: "fake-token",
                };
                localStorage.setItem("supabase.auth.token", JSON.stringify(fakeSession));
                navigate({ to: "/dashboard" });
              }}
              className="w-full flex items-center justify-center gap-3 rounded-2xl border-2 border-primary/20 bg-card py-4 text-xs font-black uppercase tracking-widest text-primary hover:bg-primary/5 transition-all"
            >
              Masuk Mode Tamu
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
