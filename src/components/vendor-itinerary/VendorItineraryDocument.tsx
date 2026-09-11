"use client";

import { Fragment } from "react";
import Image from "next/image";
import { ArrowLeft, Clock, Printer, Star } from "lucide-react";
import type {
  CustomField,
  PolicyItem,
  VendorHotel,
  VendorItineraryData,
} from "@/data/vendorItinerary";

const PRI = "#821A52";

// ─── Marzi Holidays brochure palette ─────────────────────────────
const ACCENT = "#8E1D57";      // deep plum for eyebrows/sub-headings (sample)
const PAPER = "#FAF4EC";       // warm cream page background (sample)
const ROW_ALT = "#F5EDE1";     // cream alternate table rows (sample)
const TEAL = "#147A68";
const CREAM = "#FDF6DC";
const IVORY = "#FDFBE7";
const PINK_TINT = "#F5E9F0";
const MINT_TINT = "#E7F0EB";
// Rotating tints for the at-a-glance stat cards (pink / mint / cream / lavender)
const TINTS = ["#F8EEE2", "#E9F2EC", "#FBF3DC", "#F5E9F0"];

type Props = {
  data: VendorItineraryData;
  refId: number;
  onBack: () => void;
};

// ─── Small render helpers ────────────────────────────────────────
const has = (v: unknown): boolean =>
  typeof v === "string" ? v.trim().length > 0 : v != null;

function CustomFieldRows({ fields }: { fields: CustomField[] }) {
  const rows = fields.filter((f) => has(f.label) || has(f.value));
  if (rows.length === 0) return null;
  return (
    <>
      {rows.map((f, i) => (
        <div key={i} className="flex gap-2">
          <span className="min-w-[110px] text-gray-400 capitalize">{f.label}</span>
          <span className="font-medium">{f.value}</span>
        </div>
      ))}
    </>
  );
}

function RatingBadge({ label, value }: { label: string; value: number | null }) {
  if (value == null) return null;
  return (
    <span className="inline-flex items-center gap-1 text-[9.5px] font-medium text-gray-600">
      <Star size={10} className="fill-amber-400 text-amber-400" />
      {value.toFixed(1)}
      <span className="text-gray-400">{label}</span>
    </span>
  );
}

function PolicyBlock({ items }: { items: PolicyItem[] }) {
  return (
    <div className="space-y-1.5">
      {items.map((p, i) => (
        <div key={i} className="text-[14px]">
          {has(p.title) && <strong>{p.title}. </strong>}
          <span className="text-gray-700">{p.detail}</span>
        </div>
      ))}
    </div>
  );
}

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

function fmtCoverDate(s: string | null): string | null {
  if (!has(s)) return null;
  const d = new Date(s as string);
  if (Number.isNaN(d.getTime())) return (s as string).toUpperCase();
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function nightsDaysLine(duration: string | null): string | null {
  if (!has(duration)) return null;
  const n = /(\d+)\s*n(?:igh)?ts?/i.exec(duration as string);
  const d = /(\d+)\s*days?/i.exec(duration as string);
  if (n && d) return `${n[1]} NIGHTS / ${d[1]} DAYS`;
  return (duration as string).toUpperCase();
}

function mealsText(h: VendorHotel): string | null {
  const parts = [
    h.meal_plan.breakfast && "Breakfast",
    h.meal_plan.lunch && "Lunch",
    h.meal_plan.dinner && "Dinner",
  ].filter(Boolean) as string[];
  if (parts.length > 0) return parts.join("/");
  return h.meals;
}

// ─── Page scaffolding — every sheet gets header, footer, decorations ───
function FooterBar({ page, refId, tag }: { page: number; refId: number; tag: string | null }) {
  return (
    <div className="relative z-10 mt-auto px-14 py-3 text-white print:px-[15mm]" style={{ background: PRI }}>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[12px] font-bold tracking-wide">
            MARZI HOLIDAYS&ensp;|&ensp;{(tag || "Your Life. Your Terms.").toUpperCase()}
          </div>
          <div className="text-[10.5px] opacity-80">
            holidays.marzi.life&ensp;|&ensp;holidays@marzi.life&ensp;|&ensp;+91 8792233778&ensp;|&ensp;Ref: MRZ-{refId.toString().padStart(6, "0")}
          </div>
        </div>
        <div className="text-[12px] font-bold tracking-wide">PAGE {page}</div>
      </div>
    </div>
  );
}

function Page({
  n,
  refId,
  tag,
  bare = false,
  children,
}: {
  n: number;
  refId: number;
  tag: string | null;
  bare?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="itin-page relative flex flex-col overflow-hidden" style={{ background: PAPER }}>
      {!bare && (
        <>
          {/* Corner decorations, as in the brochure */}
          <div className="pointer-events-none absolute -right-16 -top-14 h-[220px] w-[220px] rounded-full" style={{ background: "#F2E8D6" }} />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-[200px] w-[200px] rounded-full" style={{ background: MINT_TINT }} />

          {/* Header: tour badge left, logo right */}
          <div className="relative z-10 flex items-center justify-between px-14 pt-8 print:px-[15mm] print:pt-[10mm]">
            {has(tag) ? (
              <span className="rounded-full px-4 py-1.5 text-[11.5px] font-bold uppercase tracking-wide text-white" style={{ background: PRI }}>
                {tag}
              </span>
            ) : (
              <span />
            )}
            <Image src="/assets/marzi_crop.png" alt="Marzi" width={140} height={46} className="h-10 w-auto" />
          </div>
        </>
      )}
      <div className={bare ? "relative z-10 flex flex-1 flex-col" : "relative z-10 flex flex-1 flex-col px-14 pb-8 pt-7 print:px-[15mm]"}>
        {children}
      </div>
      <FooterBar page={n} refId={refId} tag={tag} />
    </div>
  );
}

// ─── Brochure building blocks ────────────────────────────────────
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[13px] font-bold uppercase tracking-[0.08em]" style={{ color: ACCENT }}>
      {children}
    </p>
  );
}

function Sec({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string | null;
  children: React.ReactNode;
}) {
  return (
    <section>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-1 text-[30px] font-extrabold leading-tight" style={{ color: PRI }}>{title}</h2>
      {has(intro) && <p className="mt-2 text-[14px] leading-relaxed text-gray-700">{intro}</p>}
      <div className="mb-5 mt-4 border-t border-gray-200" />
      {children}
    </section>
  );
}

function StatCard({ label, value, tint }: { label: string; value: string; tint: string }) {
  return (
    <div className="px-4 py-3" style={{ background: tint }}>
      <div className="text-[11.5px] font-semibold uppercase tracking-wide text-gray-500">{label}</div>
      <div className="mt-1 text-[16px] font-bold leading-snug text-gray-900">{value}</div>
    </div>
  );
}

function TableHead({ cols, bg }: { cols: string[]; bg: string }) {
  return (
    <thead>
      <tr style={{ background: bg }}>
        {cols.map((c) => (
          <th key={c} className="px-4 py-3 text-left text-[12px] font-bold uppercase tracking-wide text-white">{c}</th>
        ))}
      </tr>
    </thead>
  );
}

// ─── Flight card (booking-site layout, matches reference screenshot) ───
const FLT_NAVY = "#1A2B49";
const FLT_HEADER_BG = "#EFF3FA";
const FLT_BORDER = "#E3E8F0";
const FLT_BLUE = "#2E5AAC";
const FLT_BAND_BG = "#FCF3D7";
const FLT_BAND_TEXT = "#7A5A00";

type FlightLeg = VendorItineraryData["flights"][number];

// Parse "4h 00m" / "3h 40m Layover in Hanoi" / "45m" into minutes.
function parseMinutes(t: string | null): number | null {
  if (!has(t)) return null;
  const m = /(?:(\d+)\s*h)?\s*(?:(\d+)\s*m)?/i.exec((t as string).trim());
  if (!m || (!m[1] && !m[2])) return null;
  return Number(m[1] || 0) * 60 + Number(m[2] || 0);
}

function fmtMinutes(min: number): string {
  return `${Math.floor(min / 60)}h ${String(min % 60).padStart(2, "0")}m`;
}

function LegRow({ f }: { f: FlightLeg }) {
  const baggageLine = [
    f.baggage.cabin && `Cabin ${f.baggage.cabin}`,
    f.baggage.checkin && `Check-in ${f.baggage.checkin}`,
  ].filter(Boolean).join(" · ");
  const extras = [
    baggageLine && `Baggage: ${baggageLine}`,
    f.refundable == null ? "" : f.refundable ? "Refundable" : "Non-refundable",
  ].filter(Boolean).join(" · ");

  return (
    <>
      <div className="flex items-center gap-5 px-5 py-5">
        <div className="w-[110px] shrink-0" style={{ color: FLT_NAVY }}>
          {has(f.airline) && <div className="text-[13px] font-bold leading-snug">{f.airline}</div>}
          {has(f.flight_no) && <div className="mt-0.5 text-[12px]">{f.flight_no}</div>}
          {has(f.aircraft) && <div className="text-[12px]">{f.aircraft}</div>}
        </div>

        <div className="flex-1" style={{ color: FLT_NAVY }}>
          {has(f.date) && <div className="text-[13px]">{f.date}</div>}
          {has(f.depart) && <div className="text-[26px] font-bold leading-tight text-gray-900">{f.depart}</div>}
          {has(f.from) && <div className="text-[13px]">{f.from}</div>}
          {has(f.from_airport) && <div className="text-[11.5px] text-gray-500">{f.from_airport}</div>}
        </div>

        <div className="flex w-[170px] shrink-0 flex-col items-center self-start pt-1.5">
          <div className="relative flex h-5 w-full items-center">
            <div className="w-full border-t border-dashed border-gray-300" />
            {has(f.duration) && (
              <span
                className="absolute left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap bg-white px-2 text-[12px]"
                style={{ color: FLT_NAVY }}
              >
                <Clock size={12} /> {f.duration}
              </span>
            )}
          </div>
          {has(f.cabin) && (
            <span
              className="mt-2 rounded-full border px-4 py-0.5 text-[12px] font-semibold"
              style={{ borderColor: FLT_BLUE, color: FLT_BLUE }}
            >
              {f.cabin}
            </span>
          )}
        </div>

        <div className="flex-1 text-right" style={{ color: FLT_NAVY }}>
          {has(f.date) && <div className="text-[13px]">{f.date}</div>}
          {has(f.arrive) && <div className="text-[26px] font-bold leading-tight text-gray-900">{f.arrive}</div>}
          {has(f.to) && <div className="text-[13px]">{f.to}</div>}
          {has(f.to_airport) && <div className="text-[11.5px] text-gray-500">{f.to_airport}</div>}
        </div>
      </div>
      {has(extras) && <div className="px-5 pb-3 text-[11px] text-gray-500">{extras}</div>}
    </>
  );
}

// One journey = one or more legs joined by layovers, rendered as a single
// card with "Change of planes" bands between legs (booking-site style).
function FlightJourneyCard({ legs }: { legs: FlightLeg[] }) {
  const first = legs[0];
  const last = legs[legs.length - 1];
  const route = [first.from, last.to].filter(has).join(" - ");
  const stopsLabel =
    legs.length > 1 ? `${legs.length - 1} Stop${legs.length > 2 ? "s" : ""}` : first.stops;

  // Total time = leg durations + layovers, when all of them parse.
  const totalLabel = (() => {
    let total = 0;
    for (let i = 0; i < legs.length; i++) {
      const d = parseMinutes(legs[i].duration);
      if (d == null) return legs.length === 1 ? first.duration : null;
      total += d;
      if (i < legs.length - 1) {
        const l = parseMinutes(legs[i].layover);
        if (l == null) return null;
        total += l;
      }
    }
    return fmtMinutes(total);
  })();

  const fareNotes = legs.map((l) => l.fare_note).filter(has) as string[];

  return (
    <div className="mb-4 overflow-hidden border bg-white" style={{ borderColor: FLT_BORDER }}>
      {/* Route bar */}
      <div
        className="flex items-center justify-between gap-3 border-b px-4 py-2.5"
        style={{ background: FLT_HEADER_BG, borderColor: FLT_BORDER }}
      >
        <span className="text-[13px] font-bold" style={{ color: FLT_NAVY }}>
          {route || "Flight"}
          {has(stopsLabel) && <span> | {stopsLabel}</span>}
        </span>
        {has(totalLabel) && (
          <span className="text-[13px] font-bold" style={{ color: FLT_NAVY }}>Total Time: {totalLabel}</span>
        )}
      </div>

      {legs.map((f, i) => (
        <Fragment key={i}>
          <LegRow f={f} />
          {i < legs.length - 1 && (
            <div className="px-4 py-2 text-center text-[13px]" style={{ background: FLT_BAND_BG }}>
              <strong style={{ color: FLT_BAND_TEXT }}>Change of planes</strong>
              <span style={{ color: FLT_BAND_TEXT }}> - {f.layover}</span>
            </div>
          )}
        </Fragment>
      ))}

      {fareNotes.map((note, i) => (
        <div key={i} className="px-4 py-2 text-center text-[12px]" style={{ background: FLT_BAND_BG, color: FLT_BAND_TEXT }}>
          <strong>{note}</strong>
        </div>
      ))}
    </div>
  );
}

// ─── Day card (brochure DAY-chip layout) ─────────────────────────
function DayCard({ d }: { d: VendorItineraryData["days"][number] }) {
  const bullets: [string, string][] = [
    ...d.transfers.filter(has).map((t): [string, string] => ["Transfer", t]),
    ...d.sightseeing.filter(has).map((s): [string, string] => ["Sightseeing", s]),
    ...(has(d.tour) ? ([["Tour", d.tour as string]] as [string, string][]) : []),
    ...(has(d.evening_activity) ? ([["Evening", d.evening_activity as string]] as [string, string][]) : []),
  ];
  return (
    <div className="mb-3 border border-gray-200 bg-white">
      <div className="flex gap-4 p-4">
        <div className="flex h-8 shrink-0 items-center px-3 text-[12.5px] font-bold text-white" style={{ background: PRI }}>
          DAY {d.day}
        </div>
        <div className="flex-1">
          <div className="text-[16px] font-extrabold text-gray-900">{d.title || `Day ${d.day}`}</div>
          {has(d.guide) && <div className="text-[12.5px] text-gray-500">({d.guide})</div>}
          {has(d.description) && <p className="mt-1.5 text-[14px] leading-relaxed text-gray-700">{d.description}</p>}
          {bullets.length > 0 && (
            <div className="mt-1.5 space-y-0.5">
              {bullets.map(([label, text], i) => (
                <p key={i} className="text-[13.5px] text-gray-700">
                  • <strong style={{ color: PRI }}>{label}:</strong> {text}
                </p>
              ))}
            </div>
          )}
          {has(d.meals) && <p className="mt-2 text-[14px] text-gray-800"><strong>Meals:</strong> {d.meals}</p>}
          <div className="text-[10px]"><CustomFieldRows fields={d.custom_fields} /></div>
        </div>
      </div>
    </div>
  );
}

// ─── Page 1 body: photo hero + intro + highlights ────────────────
function CoverBody({ data }: { data: VendorItineraryData }) {
  const o = data.overview;

  const dayMatch = /(\d+)\s*days?/i.exec(o.duration ?? "");
  const titleTop = dayMatch ? `${dayMatch[1]} DAYS IN` : "YOUR HOLIDAY IN";
  const titleMain = (o.destination || o.trip_name || "YOUR DESTINATION").toUpperCase();

  const dateCell =
    has(o.start_date) && has(o.end_date)
      ? `${fmtCoverDate(o.start_date)} - ${fmtCoverDate(o.end_date)}`
      : fmtCoverDate(o.start_date);
  const stripCells = [
    dateCell,
    nightsDaysLine(o.duration),
    o.pricing.includes_flights == null
      ? has(o.departure_city) ? `FROM ${(o.departure_city as string).toUpperCase()}` : null
      : o.pricing.includes_flights ? "FLIGHTS INCLUDED" : "FLIGHTS NOT INCLUDED",
  ].filter(Boolean) as string[];

  const intro = has(o.about_destination)
    ? (o.about_destination as string)
    : `A journey through ${o.destination || "your destination"} - vibrant places, timeless culture and moments to remember, planned with care by Marzi.`;

  // Highlights strip: destination cities first, then meals / transport.
  const cities = [...new Set(data.hotels.flatMap((h) => (has(h.city) ? [(h.city as string).toUpperCase()] : [])))];
  const mealNames = ["breakfast", "lunch", "dinner"].filter((m) =>
    data.hotels.length > 0 && data.hotels.every((h) => h.meal_plan[m as keyof typeof h.meal_plan]),
  );
  const mealCell =
    mealNames.length === 3
      ? "ALL MEALS"
      : mealNames.length > 0
        ? mealNames.join(" & ").toUpperCase()
        : data.hotels.some((h) => has(h.meals)) ? "MEALS INCLUDED" : null;
  const vehicleCell = data.transfers.map((t) => t.vehicle || t.type).find(has)?.toUpperCase() ?? null;
  const highlights = [
    ...cities,
    mealCell,
    vehicleCell,
    data.inclusions.some((x) => has(x) && /visa/i.test(x)) ? "VISA INCLUDED" : null,
  ].filter(Boolean).slice(0, 4) as string[];

  const hasPhoto = has(o.cover_image_url);

  return (
    <>
      {/* ── Top ~55%: destination photo hero ── */}
      <div className="relative h-[620px] shrink-0 print:h-[150mm]" style={{ background: hasPhoto ? "#333" : PRI }}>
        {hasPhoto && (
          // Cover may be a data: URL or an arbitrary external host — plain <img>
          // skips next/image domain allow-listing for the print document.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={o.cover_image_url as string} alt={o.destination ?? "Destination"} className="absolute inset-0 h-full w-full object-cover" />
        )}
        {/* Legibility gradient over the photo */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(20,10,16,0.35) 0%, rgba(20,10,16,0.15) 40%, rgba(20,10,16,0.55) 100%)" }} />

        <div className="relative z-10 flex h-full flex-col px-14 pt-10 pb-12 print:px-[15mm] print:pt-[12mm]">
          <Image src="/assets/marzi_crop.png" alt="Marzi" width={190} height={62} className="h-14 w-auto self-start brightness-0 invert" priority />

          <div className="mt-auto">
            <span className="inline-block px-4 py-2 text-[13px] font-bold uppercase tracking-[0.08em] text-white" style={{ background: PRI }}>
              {o.tour_label || "Group Tour for Seniors"}
            </span>
            <h1 className="mt-4 max-w-[560px] text-[40px] font-extrabold uppercase leading-[1.1] tracking-wide text-white">
              {titleTop} {titleMain}
            </h1>
            <p className="mt-2 text-[13px] font-bold uppercase tracking-[0.12em] text-white/90">A curated Marzi holiday</p>

            {stripCells.length > 0 && (
              <div className="mt-6 flex max-w-[620px] divide-x divide-gray-200 bg-white">
                {stripCells.map((c) => (
                  <div key={c} className="flex-1 px-5 py-3 text-[14px] font-bold tracking-wide text-gray-900">{c}</div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Bottom: white area with intro + highlights ── */}
      <div className="relative z-10 flex-1 px-14 pb-10 pt-16 print:px-[15mm]" style={{ background: PAPER }}>
        <p className="max-w-[660px] text-[22px] font-extrabold leading-snug text-gray-900">{intro}</p>

        {highlights.length > 0 && (
          <div className="mt-8 flex max-w-[620px] divide-x divide-gray-200 border border-gray-200" style={{ background: IVORY }}>
            {highlights.map((c) => (
              <div key={c} className="flex-1 px-4 py-3.5 text-[13px] font-bold uppercase leading-snug tracking-wide text-gray-800">{c}</div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// ─── Page 2 body: founders' note ─────────────────────────────────
function FoundersBody({ data }: { data: VendorItineraryData }) {
  const o = data.overview;
  const destName = o.destination || o.trip_name;
  const journeyPara = destName
    ? `${destName} brings together everything we love about travel: vibrant places, rich culture and the warmth of shared discovery. We hope this holiday gives you stories you will carry home - and people you will remember them with.`
    : "We hope this holiday gives you stories you will carry home - and people you will remember them with.";

  return (
    <div>
      <p className="text-[13px] font-bold uppercase tracking-[0.12em]" style={{ color: ACCENT }}>
        A note from our founders
      </p>
      <h2 className="mt-2 text-[30px] font-extrabold leading-tight" style={{ color: PRI }}>
        Thank you for choosing Marzi
      </h2>
      <div className="mt-6 border-t border-gray-300" />

      <p className="mt-9 text-[19px] font-bold leading-snug text-gray-900">
        A memorable holiday begins long before you arrive. It begins when you decide to explore somewhere new - and trust someone to take care of the details.
      </p>

      <div className="mt-5 space-y-4 text-[14px] leading-relaxed text-gray-700">
        <p>
          At Marzi, we believe travel should feel exciting, personal and effortless. Every journey is thoughtfully planned around comfort, curiosity and the freedom to experience a destination at your own pace.
        </p>
        <p>{journeyPara}</p>
        <p>
          Our team will be alongside you in the planning, so you can focus on the part that matters most: enjoying the journey.
        </p>
      </div>

      <p className="mt-10 text-[14px] font-bold" style={{ color: ACCENT }}>
        Here&rsquo;s to travelling with curiosity, confidence and complete freedom.
      </p>

      <div className="mt-12 max-w-[620px] border-t-[3px] border-gray-900 pt-4">
        <div className="flex gap-24">
          <span className="text-[15px] font-extrabold tracking-wide text-gray-900">ADARSH NARAHARI</span>
          <span className="text-[15px] font-extrabold tracking-wide text-gray-900">VIBHA SINGAL</span>
        </div>
        <p className="mt-2 text-[11px] font-bold tracking-wide text-gray-600">FOUNDERS, MARZI</p>
      </div>

      <div className="mt-14 flex max-w-[620px] items-center gap-8 border px-6 py-4" style={{ background: "#FBF1F6", borderColor: "#E5C9D7" }}>
        <span className="text-[14px] font-extrabold tracking-wide" style={{ color: ACCENT }}>YOUR LIFE. YOUR TERMS.</span>
        <span className="text-[13px] leading-snug text-gray-800">Planned for comfort.<br />Designed for discovery.</span>
      </div>
    </div>
  );
}

// ─── Bottom-of-page fillers for sparse pages ─────────────────────
const DEFAULT_HL_TITLE = "Your Marzi Group Tour Manager";
const DEFAULT_HL_TEXT =
  "A Marzi group tour manager from India will travel with the group and personally take care of all travellers throughout the trip. The tour manager speaks English and Hindi.";

function CalloutBox({ eyebrow, title, text, bg, border }: {
  eyebrow: string; title: string; text: React.ReactNode; bg: string; border: string;
}) {
  return (
    <div className="mt-auto pt-8">
      <Eyebrow>{eyebrow}</Eyebrow>
      <div className="mt-2 flex gap-8 border px-6 py-5" style={{ background: bg, borderColor: border }}>
        <div className="w-[210px] shrink-0 text-[14px] font-bold uppercase leading-snug" style={{ color: ACCENT }}>{title}</div>
        <div className="flex-1 text-[13.5px] leading-relaxed text-gray-800">{text}</div>
      </div>
    </div>
  );
}

export default function VendorItineraryDocument({ data, refId, onBack }: Props) {
  const o = data.overview;
  const priceLine = [o.pricing.currency, o.pricing.total_per_person].filter(has).join(" ");
  const paxLine = [
    o.pax.adults != null ? `${o.pax.adults} Adult${o.pax.adults === 1 ? "" : "s"}` : "",
    o.pax.children ? `${o.pax.children} Child${o.pax.children === 1 ? "" : "ren"}` : "",
    o.pax.rooms != null ? `${o.pax.rooms} Room${o.pax.rooms === 1 ? "" : "s"}` : "",
  ]
    .filter(Boolean)
    .join(" · ");
  const datesLine = [o.start_date, o.end_date].filter(has).join(" → ");

  const stats: [string, string | null][] = [
    ["Package", o.trip_name],
    ["Destination", o.destination],
    ["Country", o.country],
    ["Departure city", o.departure_city],
    ["Travel dates", datesLine || null],
    ["Duration", o.duration],
    ["Travellers", paxLine || null],
    ["Total cost per person", priceLine || null],
    ["Includes flights", o.pricing.includes_flights == null ? null : o.pricing.includes_flights ? "Yes" : "No"],
    ...o.custom_fields
      .filter((f) => has(f.label) || has(f.value))
      .map((f): [string, string | null] => [f.label || "Detail", f.value]),
  ];
  const visibleStats = stats.filter(([, v]) => has(v)) as [string, string][];

  const showHotels = data.hotels.some((h) => has(h.name) || has(h.city));
  const showTransfers = data.transfers.some((t) => has(t.name) || has(t.services));
  const flights = data.flights.filter((f) => has(f.from) || has(f.airline));
  const showInsurance =
    has(data.insurance.from_price) || data.insurance.providers.length > 0 || data.insurance.coverage.length > 0 || has(data.insurance.note);
  const showPolicies =
    data.booking_policy.length > 0 || data.cancellation_policy.charges.length > 0 || data.cancellation_policy.clauses.length > 0;

  const glanceTitle = `${o.destination || o.trip_name || "Your holiday"}, thoughtfully planned`;
  const tag = o.tour_label || "Group Tour for Seniors";

  // ─── Pack sections into pages by estimated content height ───
  // Heights are px estimates at the 820px article width (~A4 @96dpi).
  const PAGE_BUDGET = 900;       // usable content height per page
  const SEC_HEADER_H = 120;      // eyebrow + heading + rule
  const FILLER_MAX_USED = 560;   // pages using less than this get a filler callout

  const textLines = (t: string | null | undefined, perLine = 85): number =>
    has(t) ? Math.max(1, Math.ceil((t as string).length / perLine)) : 0;

  type Unit = { h: number; sec: string; node: React.ReactNode; day?: number; customTitle?: string };
  const units: Unit[] = [];

  // At a glance
  {
    const statRows = Math.ceil(visibleStats.length / 3);
    let h = statRows * 82 + 10;
    if (has(o.pricing.taxes_note)) h += 46 + textLines(o.pricing.taxes_note, 80) * 20;
    if (has(o.about_destination)) h += 44 + textLines(o.about_destination) * 23;
    units.push({
      h,
      sec: "glance",
      node: (
        <>
          <div className="grid grid-cols-3 gap-3">
            {visibleStats.map(([label, value], i) => (
              <StatCard key={label + i} label={label} value={value} tint={TINTS[i % TINTS.length]} />
            ))}
          </div>
          {has(o.pricing.taxes_note) && (
            <div className="mt-4 border px-5 py-3.5" style={{ background: CREAM, borderColor: "#E8D48A" }}>
              <span className="text-[13px] font-bold" style={{ color: ACCENT }}>TAXES &amp; SURCHARGES&ensp;</span>
              <span className="text-[13px] text-gray-800">{o.pricing.taxes_note}</span>
            </div>
          )}
          {has(o.about_destination) && (
            <div className="mt-5">
              <Eyebrow>About the destination</Eyebrow>
              <p className="mt-1.5 text-[14px] leading-relaxed text-gray-800">{o.about_destination}</p>
            </div>
          )}
        </>
      ),
    });
  }

  // Hotels + transport
  if (showHotels || showTransfers) {
    let h = 0;
    if (showHotels) h += 48 + data.hotels.length * 62;
    if (showTransfers) h += (showHotels ? 30 : 0) + 36 + 48 + data.transfers.length * 52;
    units.push({
      h,
      sec: "stay",
      node: (
        <>
          {showHotels && (
            <table className="w-full border border-gray-200 text-[13.5px]">
              <TableHead bg={PRI} cols={["Destination", "Hotel", "Nights", "Room type", "Meals"]} />
              <tbody>
                {data.hotels.map((h2, i) => (
                  <tr key={i} className="border-t border-gray-200 align-top" style={{ background: i % 2 ? ROW_ALT : "#fff" }}>
                    <td className="px-4 py-3">{h2.city}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold">{h2.name}</div>
                      {(h2.google_rating != null || h2.tripadvisor_rating != null) && (
                        <div className="mt-0.5 flex flex-wrap gap-x-3">
                          <RatingBadge label="Google" value={h2.google_rating} />
                          <RatingBadge label="TripAdvisor" value={h2.tripadvisor_rating} />
                        </div>
                      )}
                      <div className="text-[10px]"><CustomFieldRows fields={h2.custom_fields} /></div>
                    </td>
                    <td className="px-4 py-3">{h2.nights ?? ""}</td>
                    <td className="px-4 py-3">{[h2.room_type, h2.room_size].filter(has).join(" · ")}</td>
                    <td className="px-4 py-3">{mealsText(h2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {showTransfers && (
            <div className={showHotels ? "mt-7" : ""}>
              <Eyebrow>Cab details</Eyebrow>
              <table className="mt-2 w-full border border-gray-200 text-[13.5px]">
                <TableHead bg={TEAL} cols={["Transportation name", "Transportation type", "Vehicle", "Services"]} />
                <tbody>
                  {data.transfers.map((t, i) => (
                    <tr key={i} className="border-t border-gray-200 align-top" style={{ background: i % 2 ? ROW_ALT : "#fff" }}>
                      <td className="px-4 py-3 font-semibold">{t.name}</td>
                      <td className="px-4 py-3">{t.type}</td>
                      <td className="px-4 py-3">{t.vehicle}</td>
                      <td className="px-4 py-3">{t.services}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ),
    });
  }

  // Flights — chain legs joined by layovers into journeys; one unit per journey
  const journeys: (typeof flights)[] = [];
  {
    let cur: typeof flights = [];
    flights.forEach((f) => {
      cur.push(f);
      if (!has(f.layover)) {
        journeys.push(cur);
        cur = [];
      }
    });
    if (cur.length) journeys.push(cur); // trailing layover on the last flight
  }
  journeys.forEach((legs, i) => {
    const h = legs.reduce((acc, f) => {
      const hasExtras = has(f.baggage.cabin) || has(f.baggage.checkin) || f.refundable != null;
      return acc + 152 + (hasExtras ? 30 : 0) + (has(f.fare_note) ? 40 : 0);
    }, 44) + (legs.length - 1) * 42;
    units.push({ h, sec: "flights", node: <FlightJourneyCard key={i} legs={legs} /> });
  });

  // Days — one unit per card
  data.days.forEach((d, i) => {
    const bulletCount =
      d.transfers.filter(has).length + d.sightseeing.filter(has).length + (has(d.tour) ? 1 : 0) + (has(d.evening_activity) ? 1 : 0);
    const h =
      74 +
      (has(d.guide) ? 22 : 0) +
      textLines(d.description, 82) * 23 +
      bulletCount * 24 +
      (has(d.meals) ? 30 : 0) +
      d.custom_fields.filter((f) => has(f.label) || has(f.value)).length * 20;
    units.push({ h, sec: "days", day: d.day, node: <DayCard key={i} d={d} /> });
  });

  // Insurance
  if (showInsurance) {
    const h =
      64 +
      (has(data.insurance.from_price) ? 28 : 0) +
      (data.insurance.providers.length > 0 ? 26 : 0) +
      data.insurance.coverage.filter(has).length * 24 +
      (has(data.insurance.note) ? 24 : 0);
    units.push({
      h,
      sec: "insurance",
      node: (
        <div className="border border-gray-200 px-5 py-4" style={{ background: MINT_TINT }}>
          {has(data.insurance.from_price) && (
            <p className="mb-1.5 text-[14px] font-bold text-gray-900">
              From {[data.insurance.currency, data.insurance.from_price].filter(has).join(" ")}
            </p>
          )}
          {data.insurance.providers.length > 0 && (
            <p className="mb-1.5 text-[14px] text-gray-800"><strong>Providers:</strong> {data.insurance.providers.filter(has).join(" · ")}</p>
          )}
          {data.insurance.coverage.length > 0 && (
            <div className="space-y-0.5">
              {data.insurance.coverage.filter(has).map((c, i) => (
                <p key={i} className="text-[14px] text-gray-800">• {c}</p>
              ))}
            </div>
          )}
          {has(data.insurance.note) && <p className="mt-2 text-[11.5px] italic text-gray-600">{data.insurance.note}</p>}
        </div>
      ),
    });
  }

  // Inclusions & exclusions (side-by-side columns → height is the taller side)
  if (data.inclusions.length > 0 || data.exclusions.length > 0) {
    const sideLines = (items: string[]) =>
      items.filter(has).reduce((n, x) => n + Math.max(1, Math.ceil(x.length / 46)), 0);
    const h = 76 + Math.max(sideLines(data.inclusions), sideLines(data.exclusions)) * 23;
    units.push({
      h,
      sec: "covered",
      node: (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {data.inclusions.length > 0 && (
            <div className="border border-gray-200 px-5 py-4" style={{ background: MINT_TINT }}>
              <p className="mb-2 text-[13px] font-bold uppercase tracking-wide" style={{ color: TEAL }}>Inclusions</p>
              <div className="space-y-1">
                {data.inclusions.filter(has).map((x, i) => (
                  <p key={i} className="text-[14px] leading-relaxed text-gray-800">• {x}</p>
                ))}
              </div>
            </div>
          )}
          {data.exclusions.length > 0 && (
            <div className="border border-gray-200 px-5 py-4" style={{ background: PINK_TINT }}>
              <p className="mb-2 text-[13px] font-bold uppercase tracking-wide" style={{ color: ACCENT }}>Exclusions</p>
              <div className="space-y-1">
                {data.exclusions.filter(has).map((x, i) => (
                  <p key={i} className="text-[14px] leading-relaxed text-gray-800">• {x}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      ),
    });
  }

  // Policies
  if (showPolicies) {
    const policyLines = (items: PolicyItem[]) =>
      items.reduce((n, x) => n + textLines([x.title, x.detail].filter(has).join(" ")), 0);
    const h =
      (data.booking_policy.length > 0 ? 50 + policyLines(data.booking_policy) * 23 : 0) +
      (data.cancellation_policy.charges.length > 0 ? 90 + data.cancellation_policy.charges.length * 48 : 0) +
      policyLines(data.cancellation_policy.clauses) * 23;
    units.push({
      h,
      sec: "policies",
      node: (
        <>
          {data.booking_policy.length > 0 && (
            <div className="mb-5">
              <Eyebrow>Booking policy</Eyebrow>
              <div className="mt-2"><PolicyBlock items={data.booking_policy} /></div>
            </div>
          )}
          {data.cancellation_policy.charges.length > 0 && (
            <div className="mb-4">
              <Eyebrow>Cancellation charges</Eyebrow>
              <table className="mt-2 w-full border border-gray-200 text-[13.5px]">
                <TableHead bg={PRI} cols={["Period", "Charge"]} />
                <tbody>
                  {data.cancellation_policy.charges.map((c, i) => (
                    <tr key={i} className="border-t border-gray-200" style={{ background: i % 2 ? ROW_ALT : "#fff" }}>
                      <td className="px-4 py-3">{c.period}</td>
                      <td className="px-4 py-3 font-semibold" style={{ color: PRI }}>{c.charge}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {data.cancellation_policy.clauses.length > 0 && <PolicyBlock items={data.cancellation_policy.clauses} />}
        </>
      ),
    });
  }

  // Custom sections
  data.custom_sections.forEach((cs, ci) => {
    let h = 20;
    if (cs.type === "text") h += textLines(cs.content) * 23;
    if (cs.type === "list") h += cs.items.filter(has).reduce((n, x) => n + Math.max(1, Math.ceil(x.length / 85)), 0) * 23;
    if (cs.type === "table") h += Math.ceil(cs.rows.filter((r) => has(r.label) || has(r.value)).length / 3) * 82;
    units.push({
      h,
      sec: `custom-${ci}`,
      customTitle: cs.title || "Additional information",
      node: (
        <>
          {cs.type === "text" && <p className="whitespace-pre-line text-[14px] leading-relaxed text-gray-700">{cs.content}</p>}
          {cs.type === "list" && (
            <div className="space-y-1">
              {cs.items.filter(has).map((x, j) => (
                <p key={j} className="text-[14px] leading-relaxed text-gray-800">• {x}</p>
              ))}
            </div>
          )}
          {cs.type === "table" && (
            <div className="grid grid-cols-3 gap-3">
              {cs.rows
                .filter((r) => has(r.label) || has(r.value))
                .map((r, j) => (
                  <StatCard key={j} label={r.label || "Detail"} value={r.value || ""} tint={TINTS[j % TINTS.length]} />
                ))}
            </div>
          )}
        </>
      ),
    });
  });

  // Greedy packing, preserving order; a section header costs SEC_HEADER_H
  // each time a section (re)starts on a page.
  const packedPages: { units: Unit[]; used: number }[] = [];
  {
    let cur: Unit[] = [];
    let used = 0;
    let lastSec: string | null = null;
    const flush = () => {
      if (cur.length) packedPages.push({ units: cur, used });
      cur = []; used = 0; lastSec = null;
    };
    for (const u of units) {
      const headerCost = u.sec !== lastSec ? SEC_HEADER_H : 0;
      if (cur.length && used + headerCost + u.h > PAGE_BUDGET) flush();
      used += (u.sec !== lastSec ? SEC_HEADER_H : 0) + u.h;
      cur.push(u);
      lastSec = u.sec;
    }
    flush();
  }

  // Section headers; "(continued)" when a section spills onto a later page.
  const seenSecs = new Set<string>();
  const secHeader = (u: Unit, run: Unit[], first: boolean): { eyebrow: string; title: string; intro?: string | null } => {
    if (u.sec === "glance")
      return { eyebrow: tag, title: glanceTitle, intro: "All details below are retained from the supplied itinerary." };
    if (u.sec === "stay") return { eyebrow: "Stay & move", title: "Hotels and transportation" };
    if (u.sec === "flights")
      return {
        eyebrow: "The journey",
        title: first ? "Flights" : "Flights (continued)",
        intro: first && o.pricing.includes_flights ? "All flights below are included in the package price." : null,
      };
    if (u.sec === "days") {
      const nums = run.map((r) => r.day).filter((n): n is number => n != null);
      const title = nums.length <= 1 ? `Day ${nums[0] ?? ""}` : `Days ${nums[0]} - ${nums[nums.length - 1]}`;
      return { eyebrow: "Day-wise itinerary", title };
    }
    if (u.sec === "insurance") return { eyebrow: "Good to know", title: "Insurance" };
    if (u.sec === "covered") return { eyebrow: "What\u2019s covered", title: "Inclusions & exclusions" };
    if (u.sec === "policies") return { eyebrow: "The fine print", title: "Booking & cancellation policy" };
    return { eyebrow: "Additional information", title: u.customTitle || "Additional information" };
  };

  const detailPageNodes = packedPages.map((pg) => {
    const blocks: React.ReactNode[] = [];
    let i = 0;
    while (i < pg.units.length) {
      const u = pg.units[i];
      const run: Unit[] = [];
      while (i < pg.units.length && pg.units[i].sec === u.sec) run.push(pg.units[i++]);
      const first = !seenSecs.has(u.sec);
      seenSecs.add(u.sec);
      const hdr = secHeader(u, run, first);
      blocks.push(
        <div key={blocks.length} className={blocks.length > 0 ? "mt-10" : ""}>
          <Sec eyebrow={hdr.eyebrow} title={hdr.title} intro={hdr.intro}>
            {run.map((r, j) => (
              <div key={j}>{r.node}</div>
            ))}
          </Sec>
        </div>,
      );
    }
    return blocks;
  });

  // Fillers for sparse pages: Marzi highlight first, contact card second.
  let highlightUsed = false;
  let contactUsed = false;
  const fillerNodes = packedPages.map((pg, pi) => {
    if (pg.used >= FILLER_MAX_USED) return null;
    if (!highlightUsed) {
      highlightUsed = true;
      return (
        <CalloutBox
          key={pi}
          eyebrow="A Marzi highlight"
          title={o.highlight_title || DEFAULT_HL_TITLE}
          text={o.highlight_text || DEFAULT_HL_TEXT}
          bg={CREAM}
          border="#E8D48A"
        />
      );
    }
    if (!contactUsed) {
      contactUsed = true;
      return (
        <CalloutBox
          key={pi}
          eyebrow="We are here to help"
          title="Questions about this itinerary?"
          text={
            <>
              Reach your Marzi travel desk any time — <strong>holidays@marzi.life</strong> · <strong>+91 8792233778</strong> · holidays.marzi.life.
              We are happy to adjust dates, rooms or sightseeing to suit your group.
            </>
          }
          bg="#FBF1F6"
          border="#E5C9D7"
        />
      );
    }
    return null;
  });

  return (
    <div className="pb-16">
      {/* Toolbar (hidden in print) */}
      <div className="no-print mx-auto max-w-[820px] px-4 pt-6 pb-2 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-5 py-2.5 rounded-full transition-colors"
        >
          <Printer size={18} /> Download / print itinerary
        </button>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-5 py-2.5 rounded-full transition-colors"
        >
          <ArrowLeft size={18} /> Back to edit
        </button>
      </div>

      <article className="itin-report mx-auto my-6 max-w-[820px] bg-white text-gray-900 shadow-md print:my-0 print:shadow-none">
        <Page n={1} refId={refId} tag={tag} bare>
          <CoverBody data={data} />
        </Page>
        <Page n={2} refId={refId} tag={tag}>
          <FoundersBody data={data} />
        </Page>
        {packedPages.map((pg, i) => (
          <Page key={i} n={i + 3} refId={refId} tag={tag}>
            {detailPageNodes[i]}
            {fillerNodes[i]}
          </Page>
        ))}
      </article>

      <style dangerouslySetInnerHTML={{ __html: `
        /* Match the sample PDF's typeface: DejaVu Sans (Verdana family) — its
           bold is the chunky wide bold used across the brochure. */
        .itin-report { font-family: Verdana, "DejaVu Sans", Geneva, Tahoma, sans-serif; }
        .itin-report strong, .itin-report b, .itin-report th,
        .itin-report h1, .itin-report h2,
        .itin-report .font-extrabold, .itin-report .font-black { font-weight: 700; }
        .itin-report { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; }

        /* Screen: A4-proportioned page cards separated by a divider */
        .itin-page { min-height: 1160px; }
        .itin-page + .itin-page { border-top: 1px solid #e5e7eb; }

        @media print {
          @page { size: A4; margin: 0; }
          body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          html, body { background: #fff !important; }
          .no-print { display: none !important; }
          .itin-report { box-shadow: none !important; margin: 0 !important; max-width: 100% !important; }
          .itin-page {
            min-height: 0;
            height: 296.5mm;
            overflow: hidden;
            page-break-after: always;
            break-after: page;
            border-top: none !important;
          }
          .itin-page:last-child { page-break-after: auto; break-after: auto; }
        }
      ` }} />
    </div>
  );
}
