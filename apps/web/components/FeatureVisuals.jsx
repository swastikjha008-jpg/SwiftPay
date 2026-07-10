import { Check, ArrowRight } from "lucide-react";

export function LedgerPreview() {
  const rows = [
    { from: "AJ", to: "PK", amount: "₹2,400", time: "0.31s" },
    { from: "RS", to: "MN", amount: "₹850", time: "0.28s" },
    { from: "TK", to: "AJ", amount: "₹12,000", time: "0.36s" },
    { from: "PK", to: "RS", amount: "₹5,200", time: "0.29s" },
    { from: "MN", to: "TK", amount: "₹1,750", time: "0.33s" },
  ];
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2 text-[11px] uppercase tracking-wide text-muted">
        <span>Live ledger</span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-mint animate-pulse" />
          settling now
        </span>
      </div>
      <div className="space-y-2">
        {rows.map((row, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-lg bg-black/20 border border-white/5 px-3 py-2.5"
          >
            <div className="flex items-center gap-2 text-sm">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-flow/30 text-[10px] font-medium text-white">
                {row.from}
              </span>
              <ArrowRight size={13} className="text-muted" />
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-azure/30 text-[10px] font-medium text-white">
                {row.to}
              </span>
            </div>
            <span className="font-mono text-sm text-white">{row.amount}</span>
            <span className="text-xs text-mint font-mono">{row.time}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3 text-xs text-muted">
        <span>Median settlement time</span>
        <span className="font-mono text-white">0.32s</span>
      </div>
    </div>
  );
}

export function AtomicDiagram() {
  return (
    <div className="mt-4 space-y-3">
      <div className="rounded-lg bg-black/20 border border-white/5 p-4">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-wide text-mint mb-3">
          <span>Scenario 1 · succeeds</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-center">
            <p className="text-xs text-muted">Sender</p>
            <p className="mt-1 font-mono text-sm text-white">₹4,000 → ₹1,000</p>
          </div>
          <span className="text-lg leading-none text-mint px-2">✓</span>
          <div className="text-center">
            <p className="text-xs text-muted">Recipient</p>
            <p className="mt-1 font-mono text-sm text-white">₹1,200 → ₹4,200</p>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted border-t border-white/5 pt-3">
          Both writes land inside the same transaction — the recipient never
          sees a deposit that isn't backed by a matching, completed debit.
        </p>
      </div>

      <div className="rounded-lg bg-black/20 border border-white/5 p-4">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-wide text-red-400 mb-3">
          <span>Scenario 2 · aborts</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-center">
            <p className="text-xs text-muted">Sender</p>
            <p className="mt-1 font-mono text-sm text-white">₹4,000</p>
          </div>
          <div className="flex flex-col items-center gap-1 px-2">
            <span className="text-[10px] uppercase tracking-wide text-red-400">insufficient funds</span>
            <span className="text-lg leading-none text-red-400">✕</span>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted">Recipient</p>
            <p className="mt-1 font-mono text-sm text-white">₹1,200</p>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted border-t border-white/5 pt-3">
          A ₹9,000 transfer aborted mid-flight. Both balances stayed exactly
          where they started — the write to either account never commits
          unless both do.
        </p>
      </div>
    </div>
  );
}

export function PeopleSearchPreview() {
  const people = [
    { initials: "AJ", name: "Aisha Jain", email: "aisha@swiftpay.in", amount: "Rs. 2,400", status: "Recent" },
    { initials: "PK", name: "Priya Kapoor", email: "priya@swiftpay.in", amount: "Rs. 5,200", status: "Saved" },
    { initials: "TK", name: "Tarun Khanna", email: "tarun@swiftpay.in", amount: "Rs. 12,000", status: "Frequent" },
    { initials: "RS", name: "Rohan Shah", email: "rohan@swiftpay.in", amount: "Rs. 850", status: "Online" },
    { initials: "MN", name: "Meera Nair", email: "meera@swiftpay.in", amount: "Rs. 1,750", status: "Recent" },
    { initials: "VI", name: "Vivaan Iyer", email: "vivaan@swiftpay.in", amount: "Rs. 3,100", status: "Saved" },
    { initials: "SN", name: "Sneha Nanda", email: "sneha@swiftpay.in", amount: "Rs. 640", status: "New" },
    { initials: "AR", name: "Arjun Rao", email: "arjun@swiftpay.in", amount: "Rs. 9,300", status: "Frequent" },
  ];
  return (
    <div className="mt-4 flex min-h-0 flex-1 flex-col rounded-lg bg-black/20 border border-white/5 p-3">
      <div className="rounded-full bg-white/5 px-3 py-2 text-xs text-muted">
        Search by name or email…
      </div>
      <div className="mt-3 flex items-center justify-between border-b border-white/5 pb-2 text-[10px] uppercase tracking-wide text-muted">
        <span>People</span>
        <span>Last sent</span>
      </div>
      <div className="mt-2 flex-1 space-y-1.5 overflow-hidden">
        {people.map((p) => (
          <div
            key={p.email}
            className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/5"
          >
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-mint/25 text-[11px] font-medium text-white">
                {p.initials}
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-medium text-white">{p.name}</span>
                  <span className="rounded-full bg-mint/10 px-1.5 py-0.5 text-[9px] uppercase tracking-wide text-mint">
                    {p.status}
                  </span>
                </div>
                <p className="truncate text-[11px] text-muted">{p.email}</p>
              </div>
            </div>
            <span className="shrink-0 font-mono text-xs text-white">{p.amount}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 border-t border-white/5 pt-3 text-center">
        <div>
          <p className="font-mono text-sm text-white">8</p>
          <p className="text-[10px] text-muted">matches</p>
        </div>
        <div>
          <p className="font-mono text-sm text-mint">0.2s</p>
          <p className="text-[10px] text-muted">lookup</p>
        </div>
        <div>
          <p className="font-mono text-sm text-white">1 tap</p>
          <p className="text-[10px] text-muted">send</p>
        </div>
      </div>
    </div>
  );
}

export function SecurityChecklist() {
  const items = [
    "Passwords hashed with bcrypt, never stored in plain text",
    "Every session backed by a signed, expiring JWT",
    "Zod validates the shape of every request before it's touched",
  ];
  return (
    <ul className="mt-4 space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-sm text-muted">
          <Check size={15} className="mt-0.5 shrink-0 text-flow-soft" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
