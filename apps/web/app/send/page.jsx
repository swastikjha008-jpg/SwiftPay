"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Send, CheckCircle2 } from "lucide-react";
import Navbar from "../../components/Navbar";
import { SearchBar } from "../../components/SearchBar";
import { api, extractErrorMessage } from "../../lib/api";
import { useAuth } from "../../lib/auth-context";

export default function SendPage() {
  return (
    <Suspense fallback={null}>
      <SendPageInner />
    </Suspense>
  );
}

function SendPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();

  const [recipient, setRecipient] = useState(null);
  const [people, setPeople] = useState([]);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/signin");
  }, [loading, user, router]);

  useEffect(() => {
    const to = searchParams.get("to");
    const name = searchParams.get("name");
    if (to && name) setRecipient({ id: to, name });
  }, [searchParams]);

  async function handleSearch(query) {
    const res = await api.get("/user/bulk", { params: { filter: query } });
    setPeople(res.data.users);
    const match = res.data.users.find(
      (u) => `${u.firstName} ${u.lastName}`.toLowerCase() === query.toLowerCase()
    );
    if (match) {
      setRecipient({ id: match.id, name: `${match.firstName} ${match.lastName}` });
    }
  }

  async function handleTransfer(e) {
    e.preventDefault();
    setError("");

    if (!recipient) {
      setError("Search for a person and pick them from the list first");
      return;
    }
    const rupees = parseFloat(amount);
    if (!rupees || rupees <= 0) {
      setError("Enter an amount greater than zero");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/account/transfer", {
        to: recipient.id,
        amount: Math.round(rupees * 100), // rupees -> paise
      });
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 1400);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (!user) return null;

  const suggestionNames = people.map((p) => `${p.firstName} ${p.lastName}`);

  return (
    <main className="min-h-screen bg-ink">
      <Navbar />

      <div className="mx-auto max-w-md px-6 pt-10 pb-20">
        <h1 className="font-display text-2xl font-medium text-white">Send money</h1>
        <p className="mt-1 text-sm text-muted">
          Find a person, choose an amount, done — atomically.
        </p>

        <div className="mt-8 rounded-2xl border border-ink-line bg-ink-surface/70 p-6">
          {success ? (
            <div className="flex flex-col items-center py-8 text-center">
              <CheckCircle2 className="text-mint" size={40} />
              <p className="mt-4 font-display text-lg text-white">Transfer complete</p>
              <p className="mt-1 text-sm text-muted">Taking you back to your dashboard…</p>
            </div>
          ) : (
            <form onSubmit={handleTransfer} className="space-y-5">
              <div>
                <label className="text-xs text-muted">Recipient</label>
                <div className="mt-2">
                  <SearchBar
                    placeholder="Search by name or email…"
                    suggestions={suggestionNames.length ? suggestionNames : ["Type a name to search"]}
                    onSearch={handleSearch}
                  />
                </div>
                {recipient && (
                  <p className="mt-2 text-sm text-mint">Sending to {recipient.name}</p>
                )}
              </div>

              <div>
                <label className="text-xs text-muted">Amount (INR)</label>
                <input
                  required
                  type="number"
                  min="1"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
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
                {submitting ? "Sending…" : "Send"}
                {!submitting && <Send size={16} />}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
