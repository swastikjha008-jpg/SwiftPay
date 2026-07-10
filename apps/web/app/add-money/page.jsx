"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PiggyBank, CheckCircle2 } from "lucide-react";
import Navbar from "../../components/Navbar";
import { api, extractErrorMessage } from "../../lib/api";
import { useAuth } from "../../lib/auth-context";

const PRESETS = [500, 1000, 2500, 5000];

export default function AddMoneyPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [amount, setAmount] = useState(1000);
  const [custom, setCustom] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/signin");
  }, [loading, user, router]);

  function pickPreset(value) {
    setAmount(value);
    setCustom("");
  }

  function handleCustomChange(e) {
    setCustom(e.target.value);
    setAmount(0);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const rupees = custom ? parseFloat(custom) : amount;
    if (!rupees || rupees <= 0) {
      setError("Enter an amount greater than zero");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post("/account/topup", {
        amount: Math.round(rupees * 100), // rupees -> paise
      });
      setSuccess(res.data.balance);
      setTimeout(() => router.push("/dashboard"), 1400);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-ink">
      <Navbar />

      <div className="mx-auto max-w-md px-6 pt-10 pb-20">
        <h1 className="font-display text-2xl font-medium text-white">Add money</h1>
        <p className="mt-1 text-sm text-muted">
          This is a demo top-up — no card or bank is actually charged.
        </p>

        <div className="mt-8 rounded-2xl border border-ink-line bg-ink-surface/70 p-6">
          {success !== null ? (
            <div className="flex flex-col items-center py-8 text-center">
              <CheckCircle2 className="text-mint" size={40} />
              <p className="mt-4 font-display text-lg text-white">Balance updated</p>
              <p className="mt-1 text-sm text-muted font-mono">
                New balance: {(success / 100).toLocaleString("en-IN", { style: "currency", currency: "INR" })}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-xs text-muted">Choose an amount</label>
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {PRESETS.map((value) => (
                    <button
                      type="button"
                      key={value}
                      onClick={() => pickPreset(value)}
                      className={`rounded-lg border py-2.5 text-sm font-mono transition-colors ${
                        amount === value && !custom
                          ? "border-flow bg-flow/20 text-white"
                          : "border-ink-line text-muted hover:border-flow-soft"
                      }`}
                    >
                      ₹{value}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-muted">Or enter a custom amount (INR)</label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={custom}
                  onChange={handleCustomChange}
                  className="mt-1 w-full rounded-lg border border-ink-line bg-ink px-3 py-2.5 text-sm font-mono text-white outline-none focus:border-flow"
                  placeholder="0.00"
                />
              </div>

              {error && (
                <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-white text-ink font-medium text-sm py-3 hover:bg-flow-soft transition-colors disabled:opacity-60"
              >
                {submitting ? "Adding…" : "Add money"}
                {!submitting && <PiggyBank size={16} />}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
