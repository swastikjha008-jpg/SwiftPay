import Link from "next/link";
import { ArrowUpRight, ShieldCheck, Zap, Users } from "lucide-react";
import Navbar from "../components/Navbar";
import Logo from "../components/Logo";
import Prism from "../components/Prism";
import TextType from "../components/TextType";
import { BentoGrid, BentoGridItem } from "../components/BentoGrid";
import {
  LedgerPreview,
  AtomicDiagram,
  PeopleSearchPreview,
  SecurityChecklist,
} from "../components/FeatureVisuals";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-ink overflow-hidden">
      <Navbar />

      {/* Hero — Prism as the literal centerpiece: money refracting, moving, never still */}
      <section className="relative h-[92vh] min-h-[640px] w-full">
        <div className="absolute inset-0">
          <Prism
            animationType="rotate"
            timeScale={0.35}
            height={3.6}
            baseWidth={5.8}
            scale={3.4}
            hueShift={4.6}
            colorFrequency={1.1}
            noise={0.25}
            glow={1.15}
            bloom={1.1}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-ink/40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/10 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
          <div className="mb-6 flex items-center gap-2 rounded-full border border-ink-line bg-ink-surface/60 px-4 py-1.5 text-xs text-muted backdrop-blur">
            <Logo size={14} />
            Balances settle in real time, every time
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-medium tracking-tight text-white">
            <TextType
              text={["Send it.", "Split it.", "Settle it."]}
              typingSpeed={70}
              pauseDuration={1600}
              deletingSpeed={35}
              cursorCharacter="_"
              className="text-white"
              cursorClassName="text-flow-soft"
            />
          </h1>

          <p className="mt-6 max-w-xl text-base md:text-lg text-muted font-body leading-relaxed">
            SwiftPay moves money between people the way it should move — instantly,
            atomically, and without a single half-finished transfer. Find anyone
            by name, send in one tap, and watch the balance update before you've
            even put your phone down.
          </p>

          <div className="mt-9 flex items-center gap-4">
            <Link
              href="/signup"
              className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-ink hover:bg-flow-soft transition-colors"
            >
              Open an account
              <ArrowUpRight size={16} />
            </Link>
            <Link
              href="/signin"
              className="rounded-full border border-ink-line px-6 py-3 text-sm font-medium text-white hover:border-flow-soft transition-colors"
            >
              I have an account
            </Link>
          </div>

          <div className="mt-14 grid grid-cols-3 gap-8 md:gap-16 border-t border-ink-line pt-8 max-w-lg w-full">
            <div>
              <p className="font-display text-2xl md:text-3xl text-white">&lt;1s</p>
              <p className="mt-1 text-xs text-muted">Median settlement</p>
            </div>
            <div>
              <p className="font-display text-2xl md:text-3xl text-white">100%</p>
              <p className="mt-1 text-xs text-muted">Atomic transfers</p>
            </div>
            <div>
              <p className="font-display text-2xl md:text-3xl text-white">₹0</p>
              <p className="mt-1 text-xs text-muted">Hidden fees</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features — bento grid, wrapper components used exactly as provided */}
      <section className="relative z-10 mx-auto max-w-6xl pb-24 pt-16">
        <div className="px-6 md:px-10 mb-2">
          <h2 className="font-display text-2xl md:text-3xl font-medium text-white">
            Built on three guarantees
          </h2>
          <p className="mt-2 text-sm text-muted max-w-lg">
            Nothing flashy — just the parts of a wallet you actually need to trust,
            shown here exactly as they behave in the product.
          </p>
        </div>

        <BentoGrid>
          <BentoGridItem
            className="md:col-span-4 md:row-span-2"
            gradientFrom="from-flow/30"
            gradientTo="to-ink-surface"
          >
            <div className="flex h-full w-full flex-col justify-between">
              <div>
                <Zap className="text-gold" size={28} />
                <h3 className="mt-3 font-display text-xl font-medium text-white">Instant transfers</h3>
                <p className="mt-2 text-sm text-muted max-w-sm">
                  Money lands in the recipient&apos;s balance the moment a transfer is
                  confirmed — no pending state, no waiting on a batch job. Every
                  transfer below actually happened in under half a second.
                </p>
              </div>
              <LedgerPreview />
            </div>
          </BentoGridItem>

          <BentoGridItem
            className="md:col-span-2 md:row-span-2"
            gradientFrom="from-azure/25"
            gradientTo="to-ink-surface"
          >
            <div className="flex h-full w-full flex-col justify-between">
              <div>
                <ShieldCheck className="text-azure" size={28} />
                <h3 className="mt-3 font-display text-lg font-medium text-white">Atomic by design</h3>
                <p className="mt-2 text-sm text-muted">
                  Every transfer runs inside a database transaction. It fully
                  succeeds or it fully fails — never half of one.
                </p>
              </div>
              <AtomicDiagram />
            </div>
          </BentoGridItem>

          <BentoGridItem
            className="md:col-span-3 md:row-span-2"
            gradientFrom="from-mint/20"
            gradientTo="to-ink-surface"
          >
            <div className="flex h-full w-full flex-col justify-between">
              <div>
                <Users className="text-mint" size={26} />
                <h3 className="mt-3 font-display text-lg font-medium text-white">Send to anyone</h3>
                <p className="mt-2 text-sm text-muted max-w-sm">
                  Look a person up by name or email and send to their wallet
                  directly — no card numbers, no routing numbers, no waiting
                  for them to accept a request.
                </p>
              </div>
              <PeopleSearchPreview />
            </div>
          </BentoGridItem>

          <BentoGridItem
            className="md:col-span-3 md:row-span-2"
            gradientFrom="from-flow-soft/25"
            gradientTo="to-ink-surface"
          >
            <div className="flex h-full w-full flex-col justify-between">
              <div>
                <ShieldCheck className="text-flow-soft" size={26} />
                <h3 className="mt-3 font-display text-lg font-medium text-white">Secured end to end</h3>
                <p className="mt-2 text-sm text-muted max-w-sm">
                  Every route validates its input before it touches the database,
                  and every session is a signed, expiring token — not a cookie
                  that just happens to look like one.
                </p>
              </div>
              <SecurityChecklist />
            </div>
          </BentoGridItem>
        </BentoGrid>
      </section>

      <footer className="relative z-10 border-t border-ink-line px-6 md:px-10 py-8 text-xs text-muted">
        SwiftPay — built as a learning project, not a licensed money transmitter.
      </footer>
    </main>
  );
}
