import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Moon, Mail, Lock, Loader2, Sparkles, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Daftar · Program Perencanaan Umroh" }] }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);
    console.log("[Register] Attempting sign up for:", email);

    try {
      const redirectUrl = `${window.location.origin}/dashboard`;
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: redirectUrl, data: { full_name: name } },
      });

      console.log("[Register] Supabase response:", {
        hasData: !!data,
        hasUser: !!data?.user,
        hasSession: !!data?.session,
        error,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      if (data.user && !data.session) {
        setInfo(
          "Pendaftaran berhasil! WAJIB: Silakan cek email Anda (" +
            email +
            ") dan klik link verifikasi sebelum bisa masuk.",
        );
      } else if (data.session) {
        setInfo("Pendaftaran berhasil! Mengalihkan ke dashboard...");
        setTimeout(() => navigate({ to: "/dashboard" }), 1500);
      } else {
        setInfo("Pendaftaran selesai. Silakan coba masuk.");
      }
    } catch (err: any) {
      console.error("[Register] Unexpected error:", err);
      setError("Terjadi kesalahan: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden gradient-primary lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="absolute inset-0 bg-arabesque opacity-20" />
        <Link to="/" className="relative flex items-center gap-2.5 text-cream">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cream/10 backdrop-blur">
            <Moon className="h-5 w-5 text-gold" />
          </div>
          <span className="font-bold">Program Perencanaan Umroh</span>
        </Link>
        <div className="relative">
          <p className="font-arabic text-3xl text-gold">بِسْمِ اللَّهِ</p>
          <h2 className="mt-4 text-3xl font-bold text-cream">Mulai perjalanan suci Anda</h2>
          <p className="mt-3 text-cream/80">
            Buat akun gratis dan persiapkan Umroh dengan panduan lengkap dalam genggaman.
          </p>
        </div>
        <p className="relative text-xs text-cream/60">© 2026 Program Perencanaan Umroh</p>
      </div>

      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 bg-background text-foreground transition-colors duration-300">
        <div className="mx-auto w-full max-w-sm">
          <Link to="/" className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
              <Sparkles className="h-4 w-4 text-gold" />
            </div>
            <span className="text-sm font-bold">Umroh Planner</span>
          </Link>
          <h1 className="text-2xl font-black tracking-tight">Daftar gratis</h1>
          <p className="mt-2 text-sm text-muted-foreground font-medium">
            Sudah punya akun?{" "}
            <Link to="/login" className="font-bold text-primary hover:underline transition-colors">
              Masuk
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                Nama Lengkap
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/50" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-2xl border border-border bg-card py-4 pl-12 pr-4 text-sm font-bold focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/30"
                  placeholder="Nama Anda"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                Email
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
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/50" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-border bg-card py-4 pl-12 pr-4 text-sm font-bold focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/30"
                  placeholder="Minimal 6 karakter"
                />
              </div>
            </div>
            {error && (
              <p className="rounded-xl bg-destructive/10 px-4 py-3 text-xs font-bold text-destructive border border-destructive/20">
                {error}
              </p>
            )}
            {info && (
              <p className="rounded-xl bg-primary/10 px-4 py-3 text-xs font-bold text-primary border border-primary/20">
                {info}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-sm font-black uppercase tracking-widest text-primary-foreground hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 disabled:opacity-60"
            >
              {loading && <Loader2 className="h-5 w-5 animate-spin" />} Daftar Gratis
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
