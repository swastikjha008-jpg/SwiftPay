"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Send, PiggyBank, History, ArrowUpRight } from "lucide-react";
import Navbar from "../../components/Navbar";
import { SearchBar } from "../../components/SearchBar";
import { BentoGrid, BentoGridItem } from "../../components/BentoGrid";
import { api } from "../../lib/api";
import { useAuth } from "../../lib/auth-context";

function formatRupees(paise) {
  return (paise / 100).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [balance, setBalance] = useState(null);
  const [people, setPeople] = useState([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    api.get("/account/balance").then((res) => setBalance(res.data.balance));
    api.get("/user/bulk").then((res) => setPeople(res.data.users));
  }, [user]);

  async function handlePersonSearch(query) {
    const res = await api.get("/user/bulk", { params: { filter: query } });
    setPeople(res.data.users);

    const match = res.data.users.find(
      (u) => `${u.firstName} ${u.lastName}`.toLowerCase() === query.toLowerCase()
    );
    if (match) {
      router.push(`/send?to=${match.id}&name=${encodeURIComponent(`${match.firstName} ${match.lastName}`)}`);
    }
  }

  if (!user) return null;

  const suggestionNames = people.map((p) => `${p.firstName} ${p.lastName}`);

  return (
    <main className="min-h-screen bg-ink">
      <Navbar />

      <div className="mx-auto max-w-6xl px-6 md:px-10 pb-20">
        <div className="pt-4 pb-8">
          <p className="text-sm text-muted">Welcome back</p>
          <h1 className="font-display text-3xl font-medium text-white">
            {user.firstName} {user.lastName}
          </h1>
        </div>

        <div className="rounded-2xl border border-ink-line bg-gradient-to-br from-flow/20 to-ink-surface p-8 mb-8 flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm text-muted">Available balance</p>
            <p className="mt-2 font-mono text-4xl md:text-5xl text-white tracking-tight">
              {balance === null ? "…" : formatRupees(balance)}
            </p>
          </div>
          <button
            onClick={() => router.push("/add-money")}
            className="flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 border border-ink-line px-4 py-2.5 text-sm font-medium text-white transition-colors"
          >
            <PiggyBank size={16} />
            Add money
          </button>
        </div>

        <div className="mb-8">
          <p className="text-sm text-muted mb-3">Send to someone</p>
          <SearchBar
            placeholder="Search by name or email…"
            suggestions={suggestionNames.length ? suggestionNames : ["Search for a person"]}
            onSearch={handlePersonSearch}
          />
        </div>

        <BentoGrid>
          <BentoGridItem
            className="md:col-span-2 cursor-pointer"
            gradientFrom="from-flow/25"
            gradientTo="to-ink-surface"
          >
            <button
              onClick={() => router.push("/send")}
              className="flex h-full w-full flex-col justify-between text-left"
            >
              <div className="flex items-center justify-between">
                <Send className="text-flow-soft" size={26} />
                <ArrowUpRight size={16} className="text-muted" />
              </div>
              <div>
                <h3 className="font-display text-lg font-medium text-white">Send money</h3>
                <p className="mt-1.5 text-sm text-muted">
                  Search any SwiftPay user by name or email and transfer
                  instantly, backed by an atomic database transaction.
                </p>
              </div>
            </button>
          </BentoGridItem>

          <BentoGridItem
            className="md:col-span-2 cursor-pointer"
            gradientFrom="from-azure/20"
            gradientTo="to-ink-surface"
          >
            <button
              onClick={() => router.push("/add-money")}
              className="flex h-full w-full flex-col justify-between text-left"
            >
              <div className="flex items-center justify-between">
                <PiggyBank className="text-azure" size={26} />
                <ArrowUpRight size={16} className="text-muted" />
              </div>
              <div>
                <h3 className="font-display text-lg font-medium text-white">Add money</h3>
                <p className="mt-1.5 text-sm text-muted">
                  Top up your balance with a preset or custom amount — a demo
                  top-up, no card or bank actually charged.
                </p>
              </div>
            </button>
          </BentoGridItem>

          <BentoGridItem
            className="md:col-span-2"
            gradientFrom="from-mint/15"
            gradientTo="to-ink-surface"
          >
            <div className="flex h-full w-full flex-col justify-between">
              <History className="text-mint" size={26} />
              <div>
                <h3 className="font-display text-lg font-medium text-white">Activity</h3>
                <p className="mt-1.5 text-sm text-muted">
                  A full transaction history — every send and top-up, with
                  running balances — is the natural next thing to build here.
                </p>
              </div>
            </div>
          </BentoGridItem>
        </BentoGrid>
      </div>
    </main>
  );
}
