"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { LOGO } from "@/data/content";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  MapPin,
  Sparkles,
  Compass,
  HeartHandshake,
} from "lucide-react";

type Interest = "sri_lanka" | "vietnam" | "travel_guide";

type Tour = {
  id: Interest;
  eyebrow: string;
  title: string;
  location: string;
  image: string;
  bullets: string[];
  price?: string;
  dates?: string;
  cta: string;
  accent: "marigold" | "coral" | "forest";
};

const tours: Tour[] = [
  {
    id: "sri_lanka",
    eyebrow: "Signature Journey",
    title: "Serene Sri Lanka",
    location: " Kandy · Bentota · Colombo",
    image: "/travel-mitr/tour-srilanka.jpg",
    dates: "17 – 22 August · 5 nights / 6 days",
    price: "₹84,999 per person (including flights)",
    bullets: [
      "Small group of like-minded 50+ travellers",
      "Boutique stays, hand-picked for comfort",
      "Tea country trains, temples & coastal sunsets",
      "Marzi Mitr with you throughout the trip",
    ],
    cta: "I'm interested in Sri Lanka",
    accent: "forest",
  },
  {
    id: "vietnam",
    eyebrow: "New Departure",
    title: "Vibrant Vietnam",
    location: "Hanoi · Ninh Binh · Halong Bay · Ho Chi Minh",
    image: "/travel-mitr/tour-vietnam.jpg",
    dates: "28 Sept – 03 Oct · 5 nights / 6 days",
    price: "₹64,999 per person",
    bullets: [
      "Overnight cruise through Halong Bay",
      "River caves & rice fields of Ninh Binh",
      "Gentle pace, plenty of rest days",
      "Vegetarian & Jain meals on request",
    ],
    cta: "I'm interested in Vietnam",
    accent: "coral",
  },
  {
    id: "travel_guide",
    eyebrow: "Complimentary",
    title: "Ask Marzi Travel Mitr",
    location: "Free 1-on-1 travel guidance",
    image: "/travel-mitr/tour-guide.jpg",
    dates: "Available Mon – Sat, 10am – 7pm",
    price: "Absolutely free",
    bullets: [
      "Not sure where to go? Talk to a real human",
      "Personalised suggestions for your pace & interests",
      "Advice on visas, insurance, packing & more",
      "No obligation, no sales pressure",
    ],
    cta: "Get free travel guidance",
    accent: "marigold",
  },
];

export default function TravelMitrLanding() {
  const [selected, setSelected] = useState<Interest>("sri_lanka");

  const scrollToForm = (id: Interest) => {
    setSelected(id);
    document.getElementById("enquire")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="bg-paper-grain min-h-screen text-tm-ink">
      {/* Sticky Nav */}
      <header className="sticky top-0 z-[100] border-b border-tm-plum/10 bg-tm-cream/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
          <Image
            src={LOGO.src}
            alt={LOGO.alt}
            width={85}
            height={34}
            className="h-8 w-auto sm:h-9"
            priority
          />
          <button
            onClick={() => scrollToForm("travel_guide")}
            className="shrink-0 rounded-full bg-tm-plum px-4 py-1.5 text-xs font-medium text-tm-cream transition hover:bg-tm-plum/90 sm:px-5 sm:py-2 sm:text-sm"
          >
            Enquire now
          </button>
        </div>
      </header>

      {/* Hero with lead form */}
      <section id="enquire" className="relative isolate overflow-hidden scroll-mt-16">
        {/* Background image + cream gradient overlay */}
        <div className="absolute inset-0 -z-10" aria-hidden>
          <img
            src="/travel-mitr/hero-travelers.jpg"
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-tm-cream via-tm-cream/90 to-tm-cream/60 lg:via-tm-cream/80 lg:to-tm-cream/30" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-tm-cream to-transparent" />
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 pt-4 pb-10 sm:px-6 sm:pt-8 lg:grid-cols-12 lg:items-center lg:gap-12 lg:pt-6 lg:pb-14">
          {/* Copy */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-tm-plum/20 bg-white/60 px-3 py-1 text-[10px] uppercase tracking-widest text-tm-plum sm:text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-tm-marigold" />
              MARZI TRAVEL MITR FOR THE FABULOUS 50+
            </div>
            <h1 className="text-display mt-3 text-3xl leading-[1.05] text-tm-plum sm:mt-6 sm:text-5xl lg:text-6xl">
              Journeys made
              <span className="italic text-tm-coral"> effortless</span>.
            </h1>
            {/* Subheading — desktop position (below headline) */}
            <p className="mt-6 hidden max-w-lg text-lg text-tm-muted lg:block">
              Travel assistance exclusively curated for people aged 50 and above. Small
              groups, thoughtful pace, and a Marzi Mitr who takes care of everything -
              so you only carry the memories home.
            </p>

            {/* Desktop-only CTAs (on mobile the form itself is the CTA) */}
            <div className="mt-8 hidden flex-wrap gap-3 lg:flex">
              <button
                onClick={() => document.getElementById("tours")?.scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center rounded-full bg-tm-plum px-7 py-3.5 text-base font-medium text-tm-cream transition hover:bg-tm-plum/90"
              >
                Explore trips <ArrowRight className="ml-2 h-4 w-4" />
              </button>
              <button
                onClick={() => scrollToForm("travel_guide")}
                className="inline-flex items-center rounded-full border border-tm-plum/30 bg-transparent px-7 py-3.5 text-base font-medium text-tm-plum transition hover:bg-tm-plum/5"
              >
                Talk to a Marzi Travel Mitr - free
              </button>
            </div>

            {/* Lead form inline on mobile — visible on first screen */}
            <div className="mt-4 lg:hidden">
              <LeadForm selected={selected} setSelected={setSelected} idSuffix="mobile" compact />
            </div>

            {/* Subheading — mobile position (below the lead form) */}
            <p className="mt-6 max-w-lg text-[15px] text-tm-muted lg:hidden">
              Travel assistance exclusively curated for people aged 50 and above. Small
              groups, thoughtful pace, and a Marzi Mitr who takes care of everything -
              so you only carry the memories home.
            </p>

            <div className="mt-8 flex max-w-md gap-10 text-sm lg:mt-10">
              <Stat n="500+" l="Happy travellers" />
              <Stat n="4.9★" l="Post-trip rating" />
            </div>
          </div>

          {/* Lead form — desktop right column */}
          <div className="hidden lg:col-span-5 lg:block">
            <LeadForm selected={selected} setSelected={setSelected} idSuffix="desktop" />
          </div>
        </div>
      </section>

      {/* Value strip */}
      <section className="border-y border-tm-plum/10 bg-tm-plum text-tm-cream">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 md:grid-cols-3">
          <Value icon={<HeartHandshake className="h-5 w-5" />} title="Curated for 50+">
            Comfortable pace, thoughtful accessibility, and companions in your stage of life.
          </Value>
          <Value icon={<Compass className="h-5 w-5" />} title="Marzi Mitr on trip">
            A real person who plans, escorts and looks after every little detail.
          </Value>
          <Value icon={<Sparkles className="h-5 w-5" />} title="No hidden costs">
            Transparent pricing, no forced shopping stops, and honest recommendations.
          </Value>
        </div>
      </section>

      {/* Tours */}
      <section id="tours" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
        <div className="mb-8 flex items-end justify-between gap-6 md:mb-10">
          <div>
            <div className="text-xs uppercase tracking-widest text-tm-marigold">Where to next</div>
            <h2 className="text-display mt-2 text-3xl text-tm-plum sm:text-4xl">
              Choose your next chapter
            </h2>
          </div>
          <p className="hidden max-w-sm text-sm text-tm-muted md:block">
            Pick a journey and we'll get back to you within a working day with the full
            itinerary and everything you need to know.
          </p>
        </div>

        {/* Mobile: horizontal auto-scrolling marquee (pauses on touch/hover) */}
        <div className="-mx-4 overflow-hidden md:hidden">
          <div className="flex w-max animate-[marquee_45s_linear_infinite] hover:[animation-play-state:paused] active:[animation-play-state:paused]">
            <div className="flex gap-4 pl-4 pr-4">
              {tours.map((t) => (
                <TourCard key={t.id} tour={t} onSelect={scrollToForm} className="w-[280px] shrink-0" />
              ))}
            </div>
            <div className="flex gap-4 pr-4" aria-hidden>
              {tours.map((t) => (
                <TourCard key={`${t.id}-dup`} tour={t} onSelect={scrollToForm} className="w-[280px] shrink-0" />
              ))}
            </div>
          </div>
        </div>

        {/* Desktop: grid */}
        <div className="hidden gap-8 md:grid md:grid-cols-3">
          {tours.map((t) => (
            <TourCard key={t.id} tour={t} onSelect={scrollToForm} />
          ))}
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-6 py-10 text-center text-xs text-tm-muted">
        © {new Date().getFullYear()} Marzi Holidays · Travel assistance exclusively curated
        for people aged 50 and above.
      </footer>
    </div>
  );
}

function TourCard({
  tour: t,
  onSelect,
  className = "",
}: {
  tour: Tour;
  onSelect: (id: Interest) => void;
  className?: string;
}) {
  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-tm-plum/5 transition hover:-translate-y-1 hover:shadow-xl ${className}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden md:aspect-[16/10]">
        <img
          src={t.image}
          alt={t.title}
          loading="lazy"
          width={1200}
          height={1400}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] uppercase tracking-widest text-tm-plum">
          {t.eyebrow}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4 md:p-5">
        <h3 className="text-display text-xl text-tm-plum">{t.title}</h3>
        <div className="mt-1 flex items-center gap-1.5 text-xs text-tm-muted">
          <MapPin className="h-3.5 w-3.5" /> {t.location}
        </div>
        {t.dates && (
          <div className="mt-2 flex items-center gap-1.5 text-[13px] text-tm-ink">
            <Calendar className="h-3.5 w-3.5 text-tm-marigold" /> {t.dates}
          </div>
        )}
        {t.price && <div className="text-display mt-0.5 text-base text-tm-coral">{t.price}</div>}
        <ul className="mt-3 space-y-1 text-[13px] text-tm-muted">
          {t.bullets.map((b) => (
            <li key={b} className="flex gap-2">
              <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-tm-marigold" />
              {b}
            </li>
          ))}
        </ul>
        <button
          onClick={() => onSelect(t.id)}
          className="mt-auto pt-4 w-full"
        >
          <span className="block w-full rounded-full bg-tm-plum py-2 text-[13px] font-medium text-tm-cream transition hover:bg-tm-plum/90">
            {t.cta}
          </span>
        </button>
      </div>
    </article>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <div className="text-display text-2xl text-tm-plum">{n}</div>
      <div className="mt-1 text-xs uppercase tracking-widest text-tm-muted">{l}</div>
    </div>
  );
}

function Value({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-tm-marigold text-tm-ink">
        {icon}
      </div>
      <div>
        <div className="text-display text-lg">{title}</div>
        <p className="mt-1 text-sm text-tm-cream/70">{children}</p>
      </div>
    </div>
  );
}

function isAtLeast50(dob: string) {
  const parsed = new Date(dob);
  if (Number.isNaN(parsed.getTime())) return false;
  const now = new Date();
  let age = now.getFullYear() - parsed.getFullYear();
  const monthDiff = now.getMonth() - parsed.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < parsed.getDate())) {
    age--;
  }
  return age >= 50;
}

/** Formats a digit string as DD/MM/YYYY, adding slashes as the user types. */
function formatDob(digits: string) {
  const d = digits.slice(0, 8);
  let out = d.slice(0, 2);
  if (d.length >= 2) out += "/";
  out += d.slice(2, 4);
  if (d.length >= 4) out += "/";
  out += d.slice(4, 8);
  return out;
}

/** Parses "DD/MM/YYYY" into ISO "YYYY-MM-DD"; returns null if not a real date. */
function parseDobToIso(dob: string): string | null {
  const m = dob.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return null;
  const [, dd, mm, yyyy] = m;
  const day = Number(dd);
  const month = Number(mm);
  const year = Number(yyyy);
  const date = new Date(year, month - 1, day);
  const isReal =
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  if (!isReal) return null;
  return `${yyyy}-${mm}-${dd}`;
}

function validate(raw: {
  name: string;
  phone: string;
  city: string;
  dateOfBirth: string;
  message?: string;
}) {
  const errors: Record<string, string> = {};
  if (raw.name.trim().length < 2) errors.name = "Please share your name";
  const phone = raw.phone.trim();
  if (phone.length < 6 || !/^[+0-9\s\-()]+$/.test(phone)) {
    errors.phone = "Enter a valid phone number";
  }
  if (raw.city.trim().length < 2) errors.city = "Which city are you from?";
  if (!raw.dateOfBirth) {
    errors.dateOfBirth = "Please share your date of birth";
  } else {
    const iso = parseDobToIso(raw.dateOfBirth);
    if (!iso) {
      errors.dateOfBirth = "Enter your date of birth as DD/MM/YYYY";
    } else if (!isAtLeast50(iso)) {
      errors.dateOfBirth = "Marzi Holidays is exclusively for travellers aged 50 and above";
    }
  }
  return errors;
}

function LeadForm({
  selected,
  setSelected,
  idSuffix,
  compact = false,
}: {
  selected: Interest;
  setSelected: (i: Interest) => void;
  idSuffix: string;
  compact?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dob, setDob] = useState("");
  const confirmRef = useRef<HTMLDivElement>(null);

  // Keep the confirmation card in view — the page would otherwise shift
  // when the tall form is replaced by the short card
  useEffect(() => {
    if (done) {
      confirmRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [done]);

  function handleDobChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    let digits = raw.replace(/\D/g, "").slice(0, 8);
    // If a deletion only removed a slash, also drop the digit before it
    if (raw.length < dob.length && formatDob(digits) === dob) {
      digits = digits.slice(0, -1);
    }
    setDob(formatDob(digits));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const raw = {
      name: String(fd.get("name") || ""),
      phone: String(fd.get("phone") || ""),
      city: String(fd.get("city") || ""),
      dateOfBirth: dob,
      message: String(fd.get("message") || "") || undefined,
    };

    const errs = validate(raw);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...raw,
          // API expects ISO YYYY-MM-DD
          dateOfBirth: parseDobToIso(dob),
          interest: selected,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "Something went wrong. Please try again.");
      }
      setDone(true);
      form.reset();
      setDob("");
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const interestOptions: { id: Interest; label: string; sub: string }[] = [
    { id: "sri_lanka", label: "Sri Lanka", sub: "17–22 Aug · ₹84,999" },
    { id: "vietnam", label: "Vietnam", sub: "28 Sep–3 Oct · ₹64,999" },
    { id: "travel_guide", label: "Travel Guide", sub: "Free" },
  ];

  // After a successful submission, show a confirmation card instead of the form
  if (done) {
    return (
      <div
        ref={confirmRef}
        className={`flex flex-col items-center rounded-3xl bg-white/85 text-center text-tm-ink shadow-2xl backdrop-blur-xl ring-1 ring-tm-plum/10 ${
          compact ? "p-8 sm:p-10" : "p-10 md:p-14"
        }`}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-tm-forest/10">
          <CheckCircle2 className="h-9 w-9 text-tm-forest" />
        </div>
        <div className="text-display mt-5 text-2xl text-tm-plum sm:text-3xl">Thank you!</div>
        <p className="mt-2 max-w-xs text-sm text-tm-muted sm:text-base">
          A Marzi Mitr will call you shortly.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className={`rounded-3xl bg-white/85 text-tm-ink shadow-2xl backdrop-blur-xl ring-1 ring-tm-plum/10 ${
        compact ? "p-4" : "p-6"
      }`}
    >
      <div
        className={`text-display text-tm-plum ${compact ? "mb-2 text-lg" : "mb-1 text-xl"}`}
      >
        Leave your details
      </div>
      {!compact && (
        <p className="mb-3 text-xs text-tm-muted">
          A Marzi Mitr will call you back within one working day. Guidance is always free.
        </p>
      )}

      <div>
        <span
          className={`uppercase tracking-widest text-tm-muted ${compact ? "text-[10px]" : "text-xs"}`}
        >
          I'm interested in
        </span>
        <div className={`grid grid-cols-3 gap-2 ${compact ? "mt-1.5" : "mt-2"}`}>
          {interestOptions.map((o) => {
            const active = selected === o.id;
            return (
              <button
                type="button"
                key={o.id}
                onClick={() => setSelected(o.id)}
                className={
                  `rounded-xl border text-left transition ${compact ? "p-2" : "rounded-2xl p-2.5"} ` +
                  (active
                    ? "border-tm-plum bg-tm-plum text-tm-cream shadow-md"
                    : "border-tm-border bg-white hover:border-tm-plum/40")
                }
              >
                <div
                  className={`text-display leading-tight ${compact ? "text-xs" : "text-sm"}`}
                >
                  {o.label}
                </div>
                <div
                  className={
                    `mt-0.5 ${compact ? "text-[9px]" : "text-[10px] sm:text-[11px]"} ` +
                    (active ? "text-tm-cream/70" : "text-tm-muted")
                  }
                >
                  {o.sub}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div
        className={
          compact ? "mt-3 grid grid-cols-2 gap-2" : "mt-3 grid grid-cols-2 gap-3"
        }
      >
        <Field
          label="Full name"
          name="name"
          idSuffix={idSuffix}
          placeholder="e.g. Anita Sharma"
          error={errors.name}
          dense={compact}
        />
        <Field
          label="Phone number"
          name="phone"
          idSuffix={idSuffix}
          type="tel"
          placeholder="+91 98xxxxxxxx"
          error={errors.phone}
          dense={compact}
        />
        <Field
          label="City you're from"
          name="city"
          idSuffix={idSuffix}
          placeholder="e.g. Mumbai"
          error={errors.city}
          dense={compact}
        />
        <Field
          label="Date of birth"
          name="dateOfBirth"
          idSuffix={idSuffix}
          type="text"
          inputMode="numeric"
          placeholder="DD/MM/YYYY"
          maxLength={10}
          value={dob}
          onChange={handleDobChange}
          error={errors.dateOfBirth}
          dense={compact}
        />
      </div>

      <div className={compact ? "mt-2" : "mt-3"}>
        <label
          htmlFor={`message-${idSuffix}`}
          className={`uppercase tracking-widest text-tm-muted ${compact ? "text-[9px]" : "text-xs"}`}
        >
          Anything you'd like us to know? (optional)
        </label>
        <textarea
          id={`message-${idSuffix}`}
          name="message"
          rows={compact ? 1 : 2}
          maxLength={1000}
          placeholder="Dietary needs, travelling with a partner, mobility, etc."
          className={`w-full rounded-xl border border-tm-border bg-white px-3 outline-none placeholder:text-tm-muted/60 focus:border-tm-marigold focus:ring-2 focus:ring-tm-marigold/40 ${
            compact ? "mt-1 py-1.5 text-[13px]" : "mt-1.5 py-2 text-sm"
          }`}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full rounded-full bg-tm-plum font-medium text-tm-cream transition hover:bg-tm-plum/90 disabled:opacity-80 ${
          compact ? "mt-2.5 py-2.5 text-sm" : "mt-4 py-3 text-base"
        }`}
      >
        {loading ? "Sending…" : "Submit enquiry"}
      </button>
      {submitError && (
        <p className="mt-3 text-center text-sm font-medium text-tm-destructive">
          {submitError}
        </p>
      )}
      <p
        className={`text-center text-tm-muted ${
          compact ? "mt-1.5 text-[8px] leading-tight" : "mt-2 text-[10px]"
        }`}
      >
        By submitting, you agree to be contacted by Marzi Holidays about your enquiry.
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  idSuffix,
  type = "text",
  placeholder,
  error,
  value,
  onChange,
  inputMode,
  maxLength,
  dense = false,
}: {
  label: string;
  name: string;
  idSuffix: string;
  type?: string;
  placeholder?: string;
  error?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
  dense?: boolean;
}) {
  const id = `${name}-${idSuffix}`;
  return (
    <div>
      <label
        htmlFor={id}
        className={`uppercase tracking-widest text-tm-muted ${dense ? "text-[9px]" : "text-xs"}`}
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        inputMode={inputMode}
        maxLength={maxLength}
        className={`w-full rounded-xl border border-tm-border bg-white px-3 outline-none placeholder:text-tm-muted/60 focus:border-tm-marigold focus:ring-2 focus:ring-tm-marigold/40 ${
          dense ? "mt-1 py-2 text-[13px]" : "mt-1.5 py-2.5 text-sm sm:mt-2"
        }`}
      />
      {error && (
        <p className={`mt-1 text-tm-destructive ${dense ? "text-[10px]" : "text-xs"}`}>{error}</p>
      )}
    </div>
  );
}
