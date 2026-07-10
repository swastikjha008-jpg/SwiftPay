"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import Navbar from "../../components/Navbar";
import { AuroraBackground } from "../../components/BentoGrid";
import { api, extractErrorMessage } from "../../lib/api";
import { useAuth } from "../../lib/auth-context";

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/user/signup", form);
      login(res.data.token, res.data.user);
      router.push("/dashboard");
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen bg-ink overflow-hidden">
      <AuroraBackground />
      <Navbar />

      <div className="relative z-10 flex justify-center px-6 py-16">
        <div className="w-full max-w-md rounded-2xl border border-ink-line bg-ink-surface/70 backdrop-blur-xl p-8">
          <h1 className="font-display text-2xl font-medium text-white">Open an account</h1>
          <p className="mt-1 text-sm text-muted">Takes less than a minute.</p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted">First name</label>
                <input
                  required
                  value={form.firstName}
                  onChange={update("firstName")}
                  className="mt-1 w-full rounded-lg border border-ink-line bg-ink px-3 py-2.5 text-sm text-white outline-none focus:border-flow"
                  placeholder="Ada"
                />
              </div>
              <div>
                <label className="text-xs text-muted">Last name</label>
                <input
                  required
                  value={form.lastName}
                  onChange={update("lastName")}
                  className="mt-1 w-full rounded-lg border border-ink-line bg-ink px-3 py-2.5 text-sm text-white outline-none focus:border-flow"
                  placeholder="Lovelace"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-muted">Email</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={update("email")}
                className="mt-1 w-full rounded-lg border border-ink-line bg-ink px-3 py-2.5 text-sm text-white outline-none focus:border-flow"
                placeholder="ada@example.com"
              />
            </div>

            <div>
              <label className="text-xs text-muted">Password</label>
              <input
                required
                type="password"
                minLength={6}
                value={form.password}
                onChange={update("password")}
                className="mt-1 w-full rounded-lg border border-ink-line bg-ink px-3 py-2.5 text-sm text-white outline-none focus:border-flow"
                placeholder="At least 6 characters"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-full bg-white text-ink font-medium text-sm py-3 hover:bg-flow-soft transition-colors disabled:opacity-60"
            >
              {loading ? "Creating account…" : "Create account"}
              {!loading && <ArrowUpRight size={16} />}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Already have an account?{" "}
            <Link href="/signin" className="text-white hover:text-flow-soft">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
