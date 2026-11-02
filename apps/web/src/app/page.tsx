"use client";

import {
  ArrowDownRight,
  ArrowRight,
  BookHeart,
  Check,
  ChevronDown,
  CircleHelp,
  EyeOff,
  Heart,
  LockKeyhole,
  MessageCircleHeart,
  Shield,
  ShieldAlert,
  Sparkles,
  UsersRound,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import PeerChat from "./peer-chat";

const supportOptions = [
  {
    icon: MessageCircleHeart,
    eyebrow: "PEER SUPPORT",
    title: "You don’t have to explain everything",
    description:
      "Find a gentle starting point, read community agreements, or explore ways to connect with peers.",
    label: "Chat privately with peers",
    href: "#peer-chat",
    color: "bg-[#E8DDEB] text-plum",
  },
  {
    icon: Heart,
    eyebrow: "WELLBEING",
    title: "Take this one moment at a time",
    description:
      "Grounding exercises and small tools for when things feel heavy, overwhelming, or uncertain.",
    label: "Open the wellbeing toolkit",
    href: "#wellbeing",
    color: "bg-[#DCEBE9] text-[#216969]",
  },
  {
    icon: BookHeart,
    eyebrow: "YOUR NEXT CHAPTER",
    title: "Explore what could come next",
    description:
      "Optional, practical career-transition resources. There’s no expectation to make a change.",
    label: "Browse transition resources",
    href: "#next-steps",
    color: "bg-[#F4E7CF] text-[#735016]",
  },
];

const groundingSteps = [
  "Let your feet rest on the floor, if that feels okay.",
  "Notice one thing you can see, without needing to name it out loud.",
  "Take a breath at your own pace. You can stop here whenever you want.",
];

function QuickExit() {
  return (
    <button
      type="button"
      onClick={() => window.location.replace("about:blank")}
      className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#B3261E] px-5 text-sm font-bold text-white transition-colors hover:bg-[#8E1E18]"
      aria-label="Quick exit to a blank page"
      title="Quick exit to a blank page"
    >
      <ArrowDownRight aria-hidden="true" size={17} />
      Quick exit
    </button>
  );
}

export default function Home() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [showCrisis, setShowCrisis] = useState(false);
  const [showGrounding, setShowGrounding] = useState(false);
  const [showReportInfo, setShowReportInfo] = useState(false);
  const [guestAlias, setGuestAlias] = useState<string | null>(null);
  const [discreetMode, setDiscreetMode] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (showCrisis || showReportInfo) {
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [showCrisis, showReportInfo]);

  useEffect(() => {
    document.title = discreetMode ? "Support" : "She Deserves — a softer place to land";
  }, [discreetMode]);

  function startGuestSession() {
    const words = ["quiet", "kind", "soft", "bright", "brave", "open"];
    const alias = `${words[Math.floor(Math.random() * words.length)]}-${Math.floor(10 + Math.random() * 90)}`;
    setGuestAlias(alias);
  }

  return (
    <main>
      <a
        href="#main-content"
        className="sr-only z-50 rounded-md bg-white p-3 text-plum focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>

      <header className="border-b border-plum/10 bg-cream">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <a href="#" className="flex items-center gap-3 rounded-sm" aria-label="She Deserves home">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-plum text-white">
              <Sparkles aria-hidden="true" size={20} />
            </span>
            <span className="leading-tight">
              <span className="block font-bold tracking-tight text-plum">
                {discreetMode ? "Support" : "she deserves"}
              </span>
              {!discreetMode && <span className="text-[11px] text-midnight/65">a softer place to land</span>}
            </span>
          </a>
          <nav aria-label="Main navigation" className="hidden items-center gap-7 md:flex">
            <a className="text-sm font-medium text-midnight/75 hover:text-plum" href="#peer-chat">
              Peer support
            </a>
            <a className="text-sm font-medium text-midnight/75 hover:text-plum" href="#wellbeing">
              Wellbeing
            </a>
            <a className="text-sm font-medium text-midnight/75 hover:text-plum" href="#next-steps">
              Resources
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setDiscreetMode((value) => !value)}
              aria-pressed={discreetMode}
              aria-label={discreetMode ? "Show app name" : "Switch to discreet view"}
              className="inline-flex min-h-11 items-center gap-2 rounded-full px-2 text-xs font-semibold text-plum hover:bg-plum/5 sm:px-3"
            >
              <EyeOff aria-hidden="true" size={16} />
              <span className="hidden sm:inline">{discreetMode ? "Show app name" : "Discreet view"}</span>
            </button>
            <button
              type="button"
              onClick={() => setShowCrisis(true)}
              aria-label="Crisis help"
              className="grid h-11 w-11 place-items-center rounded-full bg-[#B3261E] text-white hover:bg-[#8E1E18] sm:hidden"
            >
              <ShieldAlert aria-hidden="true" size={18} />
            </button>
            <button
              type="button"
              onClick={() => setShowCrisis(true)}
              className="hidden min-h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold text-plum hover:bg-plum/5 sm:inline-flex"
            >
              <CircleHelp aria-hidden="true" size={17} />
              Need help now?
            </button>
            <div className="hidden md:block">
              <QuickExit />
            </div>
          </div>
        </div>
      </header>

      <div className="border-b border-plum/10 bg-white/70 px-5 py-2.5 text-center text-xs leading-5 text-midnight/75">
        <span className="font-bold text-plum">Private by intention.</span> Peer messages are encrypted
        before the server relays them. Safety reports and referrals are not connected in this preview.
      </div>

      <section id="main-content" className="hero-wash overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-20">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-plum/15 bg-white/70 px-3 py-1.5 text-xs font-semibold tracking-wide text-plum">
              <span className="h-2 w-2 rounded-full bg-sage" aria-hidden="true" />
              A space made with care
            </div>
            <h1 className="max-w-2xl text-4xl font-semibold leading-[1.12] tracking-[-0.04em] text-midnight sm:text-5xl lg:text-[60px]">
              You deserve support that meets you <span className="text-plum">where you are.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-midnight/75 sm:text-lg sm:leading-8">
              A private, judgment-free space for adult performers to find peer connection, care for
              their wellbeing, and explore what comes next — only if and when you want to.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={startGuestSession}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-plum px-6 text-sm font-bold text-white shadow-sm transition hover:bg-[#3D2449]"
              >
                {guestAlias ? "Your guest space is ready" : "Enter as a guest"}
                {guestAlias ? <Check aria-hidden="true" size={17} /> : <ArrowRight aria-hidden="true" size={17} />}
              </button>
              <a
                href="#how-it-works"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-plum/20 bg-white/50 px-6 text-sm font-bold text-plum hover:bg-white"
              >
                How privacy works
                <ChevronDown aria-hidden="true" size={16} />
              </a>
            </div>
            <div className="mt-6 flex items-start gap-2 text-sm leading-6 text-midnight/65">
              <LockKeyhole className="mt-1 shrink-0 text-teal" aria-hidden="true" size={16} />
              <p>
                {guestAlias ? (
                  <>
                    Welcome, <span className="font-semibold text-plum">{guestAlias}</span>. This
                    temporary alias exists only in this browser tab.
                  </>
                ) : (
                  "No account needed to look around. No names, phone numbers, precise location, or identity documents."
                )}
              </p>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[500px]">
            <div
              className="absolute -left-7 top-8 h-20 w-20 rounded-full bg-[#E8DDEB]"
              aria-hidden="true"
            />
            <div
              className="absolute -right-4 bottom-12 h-14 w-14 rounded-full bg-[#DCEBE9]"
              aria-hidden="true"
            />
            <div className="relative rounded-[30px] border border-white/80 bg-white/85 p-6 shadow-card backdrop-blur sm:p-8">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-plum/75">
                  A gentle check-in
                </span>
                <span className="rounded-full bg-[#EDF4EE] px-3 py-1 text-xs font-semibold text-[#456C4F]">
                  Just for you
                </span>
              </div>
              <h2 className="mt-5 text-2xl font-semibold tracking-tight text-midnight">
                What would feel helpful today?
              </h2>
              <p className="mt-2 text-sm leading-6 text-midnight/65">
                There’s no right answer. You can change your mind at any time.
              </p>
              <div className="mt-6 space-y-3">
                <a
                  href="#peer-chat"
                  className="flex min-h-[58px] items-center gap-3 rounded-2xl border border-plum/10 bg-cream/70 px-4 text-sm font-semibold text-midnight transition hover:border-plum/30 hover:bg-[#F3EAF3]"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#E8DDEB] text-plum">
                    <UsersRound aria-hidden="true" size={18} />
                  </span>
                  To feel less alone
                  <ArrowRight className="ml-auto text-plum" aria-hidden="true" size={17} />
                </a>
                <a
                  href="#wellbeing"
                  className="flex min-h-[58px] items-center gap-3 rounded-2xl border border-plum/10 bg-cream/70 px-4 text-sm font-semibold text-midnight transition hover:border-teal/40 hover:bg-[#E9F2F1]"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#DCEBE9] text-[#216969]">
                    <Heart aria-hidden="true" size={18} />
                  </span>
                  For a little breathing room
                  <ArrowRight className="ml-auto text-teal" aria-hidden="true" size={17} />
                </a>
                <button
                  type="button"
                  onClick={() => setShowCrisis(true)}
                  className="flex min-h-[58px] w-full items-center gap-3 rounded-2xl border border-[#B3261E]/20 bg-[#FFF2F0] px-4 text-left text-sm font-semibold text-[#8F201B] transition hover:bg-[#FCE5E1]"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#F9DDDA]">
                    <ShieldAlert aria-hidden="true" size={18} />
                  </span>
                  I need help right now
                  <ArrowRight className="ml-auto" aria-hidden="true" size={17} />
                </button>
              </div>
              <p className="mt-5 border-t border-plum/10 pt-4 text-xs leading-5 text-midnight/60">
                You’re in control. Leaving, pausing, or doing nothing are all okay.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20" aria-labelledby="support-title">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#216969]">YOUR SPACE, YOUR PACE</p>
            <h2 id="support-title" className="mt-3 text-3xl font-semibold tracking-tight text-midnight sm:text-4xl">
              Start wherever feels right
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-midnight/65">
            No pressure to share, decide, or be ready. These tools are here when you need them.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {supportOptions.map(({ icon: Icon, eyebrow, title, description, label, href, color }) => (
            <a
              key={eyebrow}
              href={href}
              className="card-hover rounded-[24px] border border-plum/10 bg-white p-6 shadow-card sm:p-7"
            >
              <span className={`grid h-12 w-12 place-items-center rounded-2xl ${color}`}>
                <Icon aria-hidden="true" size={22} />
              </span>
              <p className="mt-6 text-[11px] font-bold tracking-[0.16em] text-midnight/55">{eyebrow}</p>
              <h3 className="mt-2 text-xl font-semibold leading-snug text-midnight">{title}</h3>
              <p className="mt-3 min-h-[72px] text-sm leading-6 text-midnight/70">{description}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-plum">
                {label}
                <ArrowRight aria-hidden="true" size={16} />
              </span>
            </a>
          ))}
        </div>
      </section>

      <PeerChat />

      <section id="wellbeing" className="scroll-mt-8 mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-16">
          <div className="rounded-[26px] bg-[#E5F0EE] p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#216969]">
              A SMALL GROUNDING MOMENT
            </p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-midnight">
              Come back to this moment, gently.
            </h3>
            <p className="mt-2 text-sm leading-6 text-midnight/65">
              An optional exercise. You can skip any step or stop at any time.
            </p>
            <ol className="mt-6 space-y-3">
              {groundingSteps.map((step, index) => (
                <li key={step} className="flex gap-3 rounded-xl bg-white/70 p-3.5 text-sm leading-6 text-midnight/80">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white text-xs font-bold text-[#216969]">
                    {index + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
            <button
              type="button"
              onClick={() => setShowGrounding((value) => !value)}
              className="mt-5 min-h-11 rounded-full border border-[#216969]/30 px-5 text-sm font-bold text-[#185858] hover:bg-white"
              aria-expanded={showGrounding}
            >
              {showGrounding ? "Close exercise" : "Try another grounding exercise"}
            </button>
            {showGrounding && (
              <p role="status" className="mt-3 rounded-xl bg-white p-4 text-sm leading-6 text-midnight/75">
                Press your hands gently together, if comfortable. Notice the pressure for one breath,
                then release whenever you’re ready.
              </p>
            )}
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#216969]">WELLBEING TOOLKIT</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-midnight sm:text-4xl">
              Small tools for the moments that feel like a lot.
            </h2>
            <p className="mt-4 text-base leading-7 text-midnight/70">
              Try a grounding moment, pause for a breath, or reach out to someone you trust. There
              isn’t one right way to take care of yourself.
            </p>
            <div className="mt-6 space-y-3">
              <article className="rounded-2xl border border-plum/10 bg-white p-4">
                <h3 className="text-sm font-bold text-midnight">A safety plan, at your pace</h3>
                <p className="mt-2 text-sm leading-6 text-midnight/75">
                  If it feels useful and safe, consider who you could contact, where you could go,
                  what would help you leave, and one next step. You don’t need to write anything here;
                  this page doesn’t save a plan.
                </p>
              </article>
              <article className="rounded-2xl border border-plum/10 bg-white p-4">
                <h3 className="text-sm font-bold text-midnight">Words for setting a boundary</h3>
                <ul className="mt-2 space-y-1 text-sm leading-6 text-midnight/75">
                  <li>“I’m not comfortable with that. I need this to stop.”</li>
                  <li>“I need a break before I decide.”</li>
                  <li>“Please confirm what we agreed to in writing.”</li>
                </ul>
                <p className="mt-2 text-xs leading-5 text-midnight/65">
                  Use only what feels safe in your situation. You know your circumstances best.
                </p>
              </article>
              <article className="rounded-2xl border border-plum/10 bg-white p-4">
                <h3 className="text-sm font-bold text-midnight">Rest and stress, without pressure</h3>
                <p className="mt-2 text-sm leading-6 text-midnight/75">
                  A quieter wind-down, a familiar routine, or reaching out to someone supportive may
                  help make room for rest. Small steps count; you don’t have to do them perfectly.
                </p>
              </article>
            </div>
            <button
              type="button"
              onClick={() => setShowCrisis(true)}
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full border border-[#B3261E]/25 px-5 text-sm font-bold text-[#8F201B] hover:bg-[#FFF2F0]"
            >
              <ShieldAlert aria-hidden="true" size={17} />
              Find urgent support
            </button>
          </div>
        </div>
      </section>

      <section id="next-steps" className="scroll-mt-8 bg-[#F4EADB]">
        <div className="mx-auto grid max-w-7xl gap-9 px-5 py-14 sm:px-8 sm:py-20 md:grid-cols-[1fr_0.8fr] md:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#735016]">OPTIONAL, ALWAYS</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-midnight sm:text-4xl">
              Support for today. Possibilities for later.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-midnight/70">
              Browse general information about finding a licensed therapist or exploring a career
              transition. These paths are optional, and nothing here assumes what is right for you.
            </p>
          </div>
          <div className="grid gap-3">
            <button
              type="button"
              onClick={() => setShowReportInfo(true)}
              className="flex min-h-[74px] items-center gap-4 rounded-2xl border border-[#735016]/15 bg-white/75 px-5 text-left hover:bg-white"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#F4E7CF] text-[#735016]">
                <BookHeart aria-hidden="true" size={19} />
              </span>
              <span>
                <span className="block text-sm font-bold text-midnight">Finding a therapist</span>
                <span className="mt-1 block text-xs text-midnight/65">Optional, confidential referrals</span>
              </span>
              <ArrowRight className="ml-auto text-[#735016]" aria-hidden="true" size={17} />
            </button>
            <button
              type="button"
              onClick={() => setShowReportInfo(true)}
              className="flex min-h-[74px] items-center gap-4 rounded-2xl border border-[#735016]/15 bg-white/75 px-5 text-left hover:bg-white"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#E4EFE6] text-sage">
                <ArrowRight aria-hidden="true" size={19} />
              </span>
              <span>
                <span className="block text-sm font-bold text-midnight">Exploring a next chapter</span>
                <span className="mt-1 block text-xs text-midnight/65">Career-transition resources, at your pace</span>
              </span>
              <ArrowRight className="ml-auto text-[#735016]" aria-hidden="true" size={17} />
            </button>
            <button
              type="button"
              onClick={() => setShowReportInfo(true)}
              className="flex min-h-[74px] items-center gap-4 rounded-2xl border border-[#735016]/15 bg-white/75 px-5 text-left hover:bg-white"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#F5E0DC] text-[#9A4938]">
                <Shield aria-hidden="true" size={19} />
              </span>
              <span>
                <span className="block text-sm font-bold text-midnight">Report a safety concern</span>
                <span className="mt-1 block text-xs text-midnight/65">Private reporting is not yet connected</span>
              </span>
              <ArrowRight className="ml-auto text-[#735016]" aria-hidden="true" size={17} />
            </button>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#E8DDEB] text-plum">
              <LockKeyhole aria-hidden="true" size={22} />
            </div>
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.17em] text-plum">PRIVACY BY DESIGN</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-midnight sm:text-4xl">
              Your story belongs to you.
            </h2>
            <p className="mt-4 max-w-md text-base leading-7 text-midnight/70">
              Privacy is a commitment, not a feature. This preview is intentionally limited while
              accounts, moderation, confidential reporting, and independent safety review are prepared.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["No identity details", "The app does not request names, phone numbers, precise location, or ID documents."],
              ["No advertising", "No ads, analytics pixels, or third-party tracking scripts."],
              ["No message storage", "Encrypted peer messages are relayed live and held only in each participant’s tab."],
              ["Safety before launch", "Encryption, access controls, and independent review are required before sensitive features go live."],
            ].map(([title, detail]) => (
              <div key={title} className="rounded-2xl border border-plum/10 bg-white p-5">
                <div className="flex items-center gap-2 text-sm font-bold text-midnight">
                  <Check className="text-sage" aria-hidden="true" size={17} />
                  {title}
                </div>
                <p className="mt-2 text-sm leading-6 text-midnight/65">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="your-data" className="border-y border-plum/10 bg-[#F0E9F1] px-5 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.17em] text-plum">YOUR DATA</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-midnight">
            You stay in control of what you share.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-midnight/75">
            There are no accounts or profile records in this preview. Chat messages live in browser
            memory, not PostgreSQL; you can export them to this device or clear them and leave the room.
            Closing the tab clears the in-memory chat. The downloaded export is plain text.
          </p>
          <a
            href="#peer-chat"
            className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-plum px-5 text-sm font-bold text-white hover:bg-[#3D2449]"
          >
            View chat data controls
            <ArrowRight aria-hidden="true" size={16} />
          </a>
          <p className="mt-3 text-xs leading-5 text-midnight/75">
            Account-level export and deletion are not yet available because accounts and persistent
            personal data do not exist in this prototype.
          </p>
        </div>
      </section>

      <section className="border-y border-plum/10 bg-white/70 px-5 py-10 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-bold text-midnight">A note about care</p>
            <p className="mt-2 text-sm leading-6 text-midnight/70">
              This app and any future AI features are not a replacement for licensed therapy or
              emergency services. This preview does not provide therapy, crisis response, or
              emergency monitoring.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowCrisis(true)}
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-[#B3261E] px-5 text-sm font-bold text-white hover:bg-[#8E1E18]"
          >
            <ShieldAlert aria-hidden="true" size={17} />
            Crisis help
          </button>
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-7 text-xs text-midnight/60 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>She Deserves · A space built with performers, for performers.</p>
        <p>Your privacy matters. Take care of yourself first.</p>
      </footer>

      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowCrisis(true)}
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#B3261E] px-4 text-sm font-bold text-white shadow-lg hover:bg-[#8E1E18]"
        >
          <ShieldAlert aria-hidden="true" size={17} />
          Crisis help
        </button>
        <QuickExit />
      </div>

      {(showCrisis || showReportInfo) && (
        <dialog
          ref={dialogRef}
          onClose={() => {
            setShowCrisis(false);
            setShowReportInfo(false);
          }}
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setShowCrisis(false);
              setShowReportInfo(false);
            }
          }}
          aria-labelledby="dialog-title"
          className="m-auto max-h-[calc(100%-2rem)] w-[calc(100%-2rem)] max-w-lg border-0 bg-transparent p-0 backdrop:bg-midnight/60"
        >
          <section className="rounded-[26px] bg-cream p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#F9DDDA] text-emergency">
                {showCrisis ? (
                  <ShieldAlert aria-hidden="true" size={22} />
                ) : (
                  <CircleHelp aria-hidden="true" size={22} />
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowCrisis(false);
                  setShowReportInfo(false);
                }}
                aria-label="Close dialog"
                className="grid h-10 w-10 place-items-center rounded-full text-midnight/60 hover:bg-plum/10 hover:text-midnight"
              >
                <X aria-hidden="true" size={20} />
              </button>
            </div>
            <h2 id="dialog-title" className="mt-5 text-2xl font-semibold tracking-tight text-midnight">
              {showCrisis ? "If you need help right now" : "These resources are still being prepared"}
            </h2>
            {showCrisis ? (
              <>
                <p className="mt-3 text-sm leading-6 text-midnight/75">
                  If you’re in immediate danger, contact your local emergency services or move to a
                  safer place if you can. This app is not monitored and cannot dispatch help.
                </p>
                <div className="mt-5 rounded-2xl border border-[#B3261E]/20 bg-white p-4">
                  <p className="text-sm font-bold text-midnight">You could also reach out to:</p>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-midnight/75">
                    <li>A trusted person who can stay with you or help you get somewhere safe.</li>
                    <li>A licensed mental-health professional or a local crisis line.</li>
                    <li>A local support service familiar with your situation and needs.</li>
                  </ul>
                  <div className="mt-4 flex flex-wrap gap-4 text-sm">
                    <a
                      className="font-bold text-plum underline underline-offset-2"
                      href="https://findahelpline.com/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Find a helpline by country
                    </a>
                    <a
                      className="font-bold text-plum underline underline-offset-2"
                      href="https://www.iasp.info/resources/Crisis_Centres/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      International crisis centres
                    </a>
                  </div>
                </div>
                <p className="mt-4 text-xs leading-5 text-midnight/75">
                  Crisis services differ by location. This preview does not collect your location or
                  provide location-specific emergency numbers. These links require internet access;
                  offline guidance is cached after the first visit.
                </p>
              </>
            ) : (
              <p className="mt-3 text-sm leading-6 text-midnight/75">
                Private safety reports, therapist referrals, and transition resources are not
                connected yet. Planned reporting includes harassment, trafficking concerns, coercion,
                doxxing, unsafe work conditions, and platform abuse. Nothing is being submitted or
                stored. If you’re in immediate danger, contact local emergency services.
              </p>
            )}
            <button
              type="button"
              onClick={() => {
                setShowCrisis(false);
                setShowReportInfo(false);
              }}
              className="mt-6 min-h-11 rounded-full bg-plum px-5 text-sm font-bold text-white hover:bg-[#3D2449]"
            >
              Close
            </button>
          </section>
        </dialog>
      )}
    </main>
  );
}
