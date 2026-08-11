"use client";

import { useState } from "react";
import { AlertTriangle, ArrowLeft, Check, Eye, Plus, Save, Trash2 } from "lucide-react";
import { INPUT, TEXTAREA, extractError, unwrap } from "@/components/shared/form-utils";
import VendorItineraryDocument from "./VendorItineraryDocument";
import {
  VENDOR_ITINERARY_ENDPOINT,
  type CustomField,
  type MealPlan,
  type PolicyItem,
  type VendorCustomSection,
  type VendorItineraryData,
} from "@/data/vendorItinerary";

// ─── Normalize raw AI output into a fully-populated editable shape ───
// Gemini may omit keys or send nulls; the editor must never crash on a
// missing array. This fills every field with a safe default.
type Rec = Record<string, unknown>;
const rec = (v: unknown): Rec => (v && typeof v === "object" && !Array.isArray(v) ? (v as Rec) : {});
// String for display (never null) — used to bind inputs.
function str(v: unknown): string {
  return typeof v === "string" ? v : v == null ? "" : String(v);
}
function arr<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}
// Coercions that preserve "missing" as null.
const S = (v: unknown): string | null => (v == null ? null : String(v));
const N = (v: unknown): number | null => {
  if (typeof v === "number") return v;
  if (v == null || v === "") return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
};
const B = (v: unknown): boolean | null => (typeof v === "boolean" ? v : null);
const strList = (v: unknown): string[] => arr<unknown>(v).map((x) => str(x));
const customFields = (v: unknown): CustomField[] =>
  arr<unknown>(v).map((f) => ({ label: str(rec(f).label), value: str(rec(f).value) }));

// Derive breakfast/lunch/dinner flags. Prefer the structured meal_plan the
// backend now emits; fall back to parsing the free-text meals string / meal
// codes so older records (and manual edits) still light up the right icons.
function mealPlan(raw: unknown, mealsText: string): MealPlan {
  const mp = rec(raw);
  if ("breakfast" in mp || "lunch" in mp || "dinner" in mp) {
    return { breakfast: mp.breakfast === true, lunch: mp.lunch === true, dinner: mp.dinner === true };
  }
  const t = mealsText.toLowerCase();
  const code = (c: string) => new RegExp(`\\b${c}\\b`).test(t);
  return {
    breakfast: t.includes("breakfast") || code("cp") || code("map") || code("ap"),
    lunch: t.includes("lunch") || code("ap"),
    dinner: t.includes("dinner") || code("map") || code("ap"),
  };
}

function normalizeSection(v: unknown): VendorCustomSection | null {
  const s = rec(v);
  const title = str(s.title);
  if (s.type === "list") return { title, type: "list", items: strList(s.items) };
  if (s.type === "table")
    return {
      title,
      type: "table",
      rows: arr<unknown>(s.rows).map((r) => ({ label: str(rec(r).label), value: str(rec(r).value) })),
    };
  if (s.type === "text") return { title, type: "text", content: str(s.content) };
  return null;
}

function normalize(raw: unknown): VendorItineraryData {
  const d = rec(raw);
  const o = rec(d.overview);
  const pax = rec(o.pax);
  const pricing = rec(o.pricing);
  const ins = rec(d.insurance);
  const cancel = rec(d.cancellation_policy);
  const meta = rec(d._meta);
  return {
    overview: {
      trip_name: S(o.trip_name),
      country: S(o.country),
      destination: S(o.destination),
      departure_city: S(o.departure_city),
      start_date: S(o.start_date),
      end_date: S(o.end_date),
      duration: S(o.duration),
      pax: { adults: N(pax.adults), children: N(pax.children), rooms: N(pax.rooms) },
      pricing: {
        total_per_person: S(pricing.total_per_person),
        currency: S(pricing.currency),
        includes_flights: B(pricing.includes_flights),
        taxes_note: S(pricing.taxes_note),
      },
      about_destination: S(o.about_destination),
      custom_fields: customFields(o.custom_fields),
    },
    hotels: arr<unknown>(d.hotels).map((raw) => {
      const h = rec(raw);
      const meals = S(h.meals);
      return {
        city: S(h.city), name: S(h.name), nights: N(h.nights),
        meals, room_type: S(h.room_type), room_size: S(h.room_size),
        meal_plan: mealPlan(h.meal_plan, meals ?? ""),
        google_rating: N(h.google_rating), tripadvisor_rating: N(h.tripadvisor_rating),
        image_url: S(h.image_url), custom_fields: customFields(h.custom_fields),
      };
    }),
    transfers: arr<unknown>(d.transfers).map((raw) => {
      const t = rec(raw);
      return { name: S(t.name), type: S(t.type), vehicle: S(t.vehicle), services: S(t.services) };
    }),
    flights: arr<unknown>(d.flights).map((raw) => {
      const f = rec(raw);
      const bag = rec(f.baggage);
      return {
        from: S(f.from), to: S(f.to), date: S(f.date), airline: S(f.airline),
        flight_no: S(f.flight_no), aircraft: S(f.aircraft), depart: S(f.depart), arrive: S(f.arrive),
        from_airport: S(f.from_airport), to_airport: S(f.to_airport), stops: S(f.stops),
        duration: S(f.duration), cabin: S(f.cabin), refundable: B(f.refundable), fare_note: S(f.fare_note),
        baggage: { cabin: S(bag.cabin), checkin: S(bag.checkin) },
      };
    }),
    days: arr<unknown>(d.days).map((raw, i) => {
      const day = rec(raw);
      return {
        day: typeof day.day === "number" ? day.day : i + 1,
        title: S(day.title), description: S(day.description),
        transfers: strList(day.transfers), sightseeing: strList(day.sightseeing),
        tour: S(day.tour), evening_activity: S(day.evening_activity),
        meals: S(day.meals), guide: S(day.guide), custom_fields: customFields(day.custom_fields),
      };
    }),
    insurance: {
      from_price: S(ins.from_price), currency: S(ins.currency),
      providers: strList(ins.providers), coverage: strList(ins.coverage), note: S(ins.note),
    },
    inclusions: strList(d.inclusions),
    exclusions: strList(d.exclusions),
    booking_policy: arr<unknown>(d.booking_policy).map((p) => ({ title: str(rec(p).title), detail: str(rec(p).detail) })),
    cancellation_policy: {
      charges: arr<unknown>(cancel.charges).map((c) => ({ period: str(rec(c).period), charge: str(rec(c).charge) })),
      clauses: arr<unknown>(cancel.clauses).map((c) => ({ title: str(rec(c).title), detail: str(rec(c).detail) })),
    },
    custom_sections: arr<unknown>(d.custom_sections).map(normalizeSection).filter((s): s is VendorCustomSection => s !== null),
    _meta: {
      confidence: meta.confidence === "medium" || meta.confidence === "low" ? meta.confidence : "high",
      unmapped_text: strList(meta.unmapped_text),
    },
  };
}

// ─── Small presentational primitives ─────────────────────────────
function SectionCard({
  step, title, subtitle, action, children,
}: {
  step: number; title: string; subtitle?: string;
  action?: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <section className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-start gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white text-sm font-bold">
            {step}
          </span>
          <div>
            <h2 className="text-base font-semibold text-gray-900">{title}</h2>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          </div>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function Labeled({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-xs font-medium text-gray-600">{label}</span>
      {children}
    </label>
  );
}

function TextInput({ label, value, onChange, placeholder, className = "" }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; className?: string;
}) {
  return (
    <Labeled label={label} className={className}>
      <input className={INPUT} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </Labeled>
  );
}

function TriState({ label, value, onChange }: { label: string; value: boolean | null; onChange: (v: boolean | null) => void }) {
  const v = value === null ? "" : value ? "yes" : "no";
  return (
    <Labeled label={label}>
      <select
        className={INPUT}
        value={v}
        onChange={(e) => onChange(e.target.value === "" ? null : e.target.value === "yes")}
      >
        <option value="">Unknown</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>
    </Labeled>
  );
}

function AddButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80"
    >
      <Plus size={14} /> {children}
    </button>
  );
}

function IconDelete({ onClick, label = "Remove" }: { onClick: () => void; label?: string }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} className="text-gray-400 hover:text-red-600 shrink-0">
      <Trash2 size={16} />
    </button>
  );
}

// Editor for a string[] (inclusions, exclusions, day transfers, providers…)
function StringList({ items, onChange, placeholder, addLabel }: {
  items: string[]; onChange: (next: string[]) => void; placeholder?: string; addLabel: string;
}) {
  return (
    <div className="space-y-2">
      {items.map((v, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            className={INPUT}
            value={v}
            placeholder={placeholder}
            onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))}
          />
          <IconDelete onClick={() => onChange(items.filter((_, j) => j !== i))} />
        </div>
      ))}
      <AddButton onClick={() => onChange([...items, ""])}>{addLabel}</AddButton>
    </div>
  );
}

// Editor for CustomField[] ({label, value})
function CustomFieldsEditor({ items, onChange }: { items: CustomField[]; onChange: (next: CustomField[]) => void }) {
  return (
    <div className="mt-3 space-y-2">
      {items.map((f, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            className={`${INPUT} max-w-[40%]`}
            placeholder="Field label"
            value={f.label}
            onChange={(e) => onChange(items.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))}
          />
          <input
            className={INPUT}
            placeholder="Value"
            value={f.value}
            onChange={(e) => onChange(items.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))}
          />
          <IconDelete onClick={() => onChange(items.filter((_, j) => j !== i))} />
        </div>
      ))}
      <AddButton onClick={() => onChange([...items, { label: "", value: "" }])}>Add field</AddButton>
    </div>
  );
}

type Props = {
  initial: unknown;
  uuid: string;
  refId: number;
  filename: string | null;
  onReset: () => void;
};

export default function VendorItineraryReview({ initial, uuid, refId, filename, onReset }: Props) {
  const [data, setData] = useState<VendorItineraryData>(() => normalize(initial));
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);

  // Deep-clone-then-mutate so nested edits stay immutable without a lib.
  const edit = (mutate: (d: VendorItineraryData) => void) => {
    setData((prev) => {
      const draft = structuredClone(prev) as VendorItineraryData;
      mutate(draft);
      return draft;
    });
    if (saveStatus === "saved") setSaveStatus("idle");
  };

  const save = async () => {
    setSaveStatus("saving");
    setSaveError(null);
    try {
      const res = await fetch(`${VENDOR_ITINERARY_ENDPOINT}${uuid}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ edited_output: data }),
      });
      if (!res.ok) {
        let body: unknown = null;
        try { body = await res.json(); } catch { /* non-JSON */ }
        throw new Error(extractError(unwrap(body), "Could not save. Please try again."));
      }
      setSaveStatus("saved");
    } catch (err) {
      setSaveStatus("error");
      setSaveError(err instanceof Error ? err.message : "Could not save.");
    }
  };

  const o = data.overview;
  const meta = data._meta;

  if (preview) {
    return <VendorItineraryDocument data={data} refId={refId} onBack={() => setPreview(false)} />;
  }

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold italic font-[family-name:var(--font-playfair)]">Review itinerary</h1>
          {filename && <p className="text-xs text-gray-400 mt-0.5">{filename}</p>}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-full text-sm transition-colors"
          >
            <ArrowLeft size={16} /> Import another
          </button>
          <button
            type="button"
            onClick={() => setPreview(true)}
            className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-full text-sm transition-colors"
          >
            <Eye size={16} /> Preview &amp; print
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saveStatus === "saving"}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-semibold px-5 py-2 rounded-full text-sm transition-colors"
          >
            {saveStatus === "saved" ? <Check size={16} /> : <Save size={16} />}
            {saveStatus === "saving" ? "Saving…" : saveStatus === "saved" ? "Saved" : "Save itinerary"}
          </button>
        </div>
      </div>

      {saveStatus === "error" && saveError && <p className="text-sm text-red-600">{saveError}</p>}

      {/* Low-confidence banner */}
      {meta.confidence !== "high" && (
        <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-800 text-xs">
          <AlertTriangle size={16} className="shrink-0 mt-0.5" />
          <p>Extraction confidence is <strong>{meta.confidence}</strong>. Please review every section carefully before saving.</p>
        </div>
      )}

      {/* Unmapped text — promote to a custom section so nothing is lost */}
      {meta.unmapped_text.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs">
          <p className="font-semibold text-gray-700 mb-2">Unplaced content ({meta.unmapped_text.length})</p>
          <div className="space-y-2">
            {meta.unmapped_text.map((t, i) => (
              <div key={i} className="flex items-start gap-2">
                <p className="flex-1 text-gray-600">{t}</p>
                <button
                  type="button"
                  className="text-primary font-semibold shrink-0"
                  onClick={() =>
                    edit((d) => {
                      d.custom_sections.push({ title: "Additional Info", type: "text", content: t });
                      d._meta.unmapped_text = d._meta.unmapped_text.filter((_, j) => j !== i);
                    })
                  }
                >
                  Add as section
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 1 — Overview */}
      <SectionCard step={1} title="Overview" subtitle="First-page package summary"
        action={<AddButton onClick={() => edit((d) => d.overview.custom_fields.push({ label: "", value: "" }))}>Add field</AddButton>}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <TextInput label="Trip name" value={str(o.trip_name)} onChange={(v) => edit((d) => (d.overview.trip_name = v || null))} />
          <TextInput label="Country" value={str(o.country)} onChange={(v) => edit((d) => (d.overview.country = v || null))} />
          <TextInput label="Destination" value={str(o.destination)} onChange={(v) => edit((d) => (d.overview.destination = v || null))} />
          <TextInput label="Departure city" value={str(o.departure_city)} onChange={(v) => edit((d) => (d.overview.departure_city = v || null))} />
          <TextInput label="Start date" value={str(o.start_date)} placeholder="YYYY-MM-DD" onChange={(v) => edit((d) => (d.overview.start_date = v || null))} />
          <TextInput label="End date" value={str(o.end_date)} placeholder="YYYY-MM-DD" onChange={(v) => edit((d) => (d.overview.end_date = v || null))} />
          <TextInput label="Duration" value={str(o.duration)} onChange={(v) => edit((d) => (d.overview.duration = v || null))} />
          <TextInput label="Adults" value={str(o.pax.adults)} onChange={(v) => edit((d) => (d.overview.pax.adults = v ? Number(v) : null))} />
          <TextInput label="Children" value={str(o.pax.children)} onChange={(v) => edit((d) => (d.overview.pax.children = v ? Number(v) : null))} />
          <TextInput label="Rooms" value={str(o.pax.rooms)} onChange={(v) => edit((d) => (d.overview.pax.rooms = v ? Number(v) : null))} />
          <TextInput label="Total cost / person" value={str(o.pricing.total_per_person)} onChange={(v) => edit((d) => (d.overview.pricing.total_per_person = v || null))} />
          <TextInput label="Currency" value={str(o.pricing.currency)} onChange={(v) => edit((d) => (d.overview.pricing.currency = v || null))} />
          <TriState label="Includes flights" value={o.pricing.includes_flights} onChange={(v) => edit((d) => (d.overview.pricing.includes_flights = v))} />
          <TextInput label="Taxes note" value={str(o.pricing.taxes_note)} onChange={(v) => edit((d) => (d.overview.pricing.taxes_note = v || null))} />
        </div>
        <Labeled label="About the destination" className="mt-3">
          <textarea className={TEXTAREA} value={str(o.about_destination)} onChange={(e) => edit((d) => (d.overview.about_destination = e.target.value || null))} />
        </Labeled>
        {o.custom_fields.length > 0 && (
          <CustomFieldsEditor items={o.custom_fields} onChange={(next) => edit((d) => (d.overview.custom_fields = next))} />
        )}
      </SectionCard>

      {/* 2 — Hotels / Transfers / Flights */}
      <SectionCard step={2} title="Hotels, Cabs & Flights" subtitle="Stay, transport and air segments"
        action={<AddButton onClick={() => edit((d) => d.hotels.push({ city: null, name: null, nights: null, meals: null, room_type: null, room_size: null, meal_plan: { breakfast: false, lunch: false, dinner: false }, google_rating: null, tripadvisor_rating: null, image_url: null, custom_fields: [] }))}>Add hotel</AddButton>}
      >
        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Hotels</p>
        <div className="space-y-3">
          {data.hotels.map((h, i) => (
            <div key={i} className="rounded-xl border border-gray-200 p-3">
              <div className="flex justify-end mb-1"><IconDelete onClick={() => edit((d) => d.hotels.splice(i, 1))} /></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <TextInput label="City" value={str(h.city)} onChange={(v) => edit((d) => (d.hotels[i].city = v || null))} />
                <TextInput label="Hotel name" value={str(h.name)} onChange={(v) => edit((d) => (d.hotels[i].name = v || null))} />
                <TextInput label="Nights" value={str(h.nights)} onChange={(v) => edit((d) => (d.hotels[i].nights = v ? Number(v) : null))} />
                <TextInput label="Meals" value={str(h.meals)} onChange={(v) => edit((d) => (d.hotels[i].meals = v || null))} />
                <TextInput label="Room type" value={str(h.room_type)} onChange={(v) => edit((d) => (d.hotels[i].room_type = v || null))} />
                <TextInput label="Room size" value={str(h.room_size)} placeholder="e.g. 32 m² / 350 sq ft" onChange={(v) => edit((d) => (d.hotels[i].room_size = v || null))} />
              </div>
              <div className="mt-3">
                <p className="text-xs font-medium text-gray-600 mb-1.5">Meals provided</p>
                <div className="flex flex-wrap gap-4">
                  {(["breakfast", "lunch", "dinner"] as const).map((m) => (
                    <label key={m} className="inline-flex items-center gap-1.5 text-sm capitalize cursor-pointer">
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-primary"
                        checked={h.meal_plan[m]}
                        onChange={(e) => edit((d) => (d.hotels[i].meal_plan[m] = e.target.checked))}
                      />
                      {m}
                    </label>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <TextInput label="Google rating" value={str(h.google_rating)} placeholder="e.g. 4.5" onChange={(v) => edit((d) => (d.hotels[i].google_rating = v ? Number(v) : null))} />
                <TextInput label="TripAdvisor rating" value={str(h.tripadvisor_rating)} placeholder="e.g. 4.0" onChange={(v) => edit((d) => (d.hotels[i].tripadvisor_rating = v ? Number(v) : null))} />
                <TextInput label="Property image URL" value={str(h.image_url)} className="sm:col-span-2" placeholder="https://…" onChange={(v) => edit((d) => (d.hotels[i].image_url = v || null))} />
              </div>
            </div>
          ))}
          {data.hotels.length === 0 && <p className="text-xs text-gray-400">No hotels extracted.</p>}
        </div>

        <div className="flex items-center justify-between mt-5 mb-2">
          <p className="text-xs font-semibold text-gray-500 uppercase">Transfers / Cabs</p>
          <AddButton onClick={() => edit((d) => d.transfers.push({ name: null, type: null, vehicle: null, services: null }))}>Add transfer</AddButton>
        </div>
        <div className="space-y-3">
          {data.transfers.map((t, i) => (
            <div key={i} className="rounded-xl border border-gray-200 p-3">
              <div className="flex justify-end mb-1"><IconDelete onClick={() => edit((d) => d.transfers.splice(i, 1))} /></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <TextInput label="Name" value={str(t.name)} onChange={(v) => edit((d) => (d.transfers[i].name = v || null))} />
                <TextInput label="Type of transport" value={str(t.type)} placeholder="e.g. Private Car, SIC Coach" onChange={(v) => edit((d) => (d.transfers[i].type = v || null))} />
                <TextInput label="Vehicle / car" value={str(t.vehicle)} placeholder="e.g. Toyota Innova" onChange={(v) => edit((d) => (d.transfers[i].vehicle = v || null))} />
                <TextInput label="Services" value={str(t.services)} onChange={(v) => edit((d) => (d.transfers[i].services = v || null))} />
              </div>
            </div>
          ))}
          {data.transfers.length === 0 && <p className="text-xs text-gray-400">No transfers extracted.</p>}
        </div>

        <div className="flex items-center justify-between mt-5 mb-2">
          <p className="text-xs font-semibold text-gray-500 uppercase">Flights</p>
          <AddButton onClick={() => edit((d) => d.flights.push({ from: null, to: null, date: null, airline: null, flight_no: null, aircraft: null, depart: null, arrive: null, from_airport: null, to_airport: null, stops: null, duration: null, cabin: null, refundable: null, fare_note: null, baggage: { cabin: null, checkin: null } }))}>Add flight</AddButton>
        </div>
        <div className="space-y-3">
          {data.flights.map((f, i) => (
            <div key={i} className="rounded-xl border border-gray-200 p-3">
              <div className="flex justify-end mb-1"><IconDelete onClick={() => edit((d) => d.flights.splice(i, 1))} /></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <TextInput label="From" value={str(f.from)} onChange={(v) => edit((d) => (d.flights[i].from = v || null))} />
                <TextInput label="To" value={str(f.to)} onChange={(v) => edit((d) => (d.flights[i].to = v || null))} />
                <TextInput label="Date" value={str(f.date)} placeholder="YYYY-MM-DD" onChange={(v) => edit((d) => (d.flights[i].date = v || null))} />
                <TextInput label="Airline" value={str(f.airline)} onChange={(v) => edit((d) => (d.flights[i].airline = v || null))} />
                <TextInput label="Flight no." value={str(f.flight_no)} onChange={(v) => edit((d) => (d.flights[i].flight_no = v || null))} />
                <TextInput label="Aircraft" value={str(f.aircraft)} onChange={(v) => edit((d) => (d.flights[i].aircraft = v || null))} />
                <TextInput label="Departs" value={str(f.depart)} onChange={(v) => edit((d) => (d.flights[i].depart = v || null))} />
                <TextInput label="Arrives" value={str(f.arrive)} onChange={(v) => edit((d) => (d.flights[i].arrive = v || null))} />
                <TextInput label="Stops" value={str(f.stops)} onChange={(v) => edit((d) => (d.flights[i].stops = v || null))} />
                <TextInput label="Duration" value={str(f.duration)} onChange={(v) => edit((d) => (d.flights[i].duration = v || null))} />
                <TextInput label="Cabin / fare" value={str(f.cabin)} onChange={(v) => edit((d) => (d.flights[i].cabin = v || null))} />
                <TriState label="Refundable" value={f.refundable} onChange={(v) => edit((d) => (d.flights[i].refundable = v))} />
                <TextInput label="Cabin baggage" value={str(f.baggage.cabin)} onChange={(v) => edit((d) => (d.flights[i].baggage.cabin = v || null))} />
                <TextInput label="Check-in baggage" value={str(f.baggage.checkin)} onChange={(v) => edit((d) => (d.flights[i].baggage.checkin = v || null))} />
                <TextInput label="Fare note" value={str(f.fare_note)} className="sm:col-span-2" onChange={(v) => edit((d) => (d.flights[i].fare_note = v || null))} />
              </div>
            </div>
          ))}
          {data.flights.length === 0 && <p className="text-xs text-gray-400">No flights extracted.</p>}
        </div>
      </SectionCard>

      {/* 3 — Day-wise itinerary */}
      <SectionCard step={3} title="Day-wise Itinerary"
        action={<AddButton onClick={() => edit((d) => d.days.push({ day: d.days.length + 1, title: null, description: null, transfers: [], sightseeing: [], tour: null, evening_activity: null, meals: null, guide: null, custom_fields: [] }))}>Add day</AddButton>}
      >
        <div className="space-y-3">
          {data.days.map((day, i) => (
            <div key={i} className="rounded-xl border border-gray-200 p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-primary">Day {day.day}</span>
                <div className="flex items-center gap-3">
                  <AddButton onClick={() => edit((d) => d.days[i].custom_fields.push({ label: "", value: "" }))}>Add field</AddButton>
                  <IconDelete onClick={() => edit((d) => d.days.splice(i, 1))} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <TextInput label="Day number" value={str(day.day)} onChange={(v) => edit((d) => (d.days[i].day = v ? Number(v) : d.days[i].day))} />
                <TextInput label="Title" value={str(day.title)} onChange={(v) => edit((d) => (d.days[i].title = v || null))} />
              </div>
              <Labeled label="Description" className="mt-3">
                <textarea className={TEXTAREA} value={str(day.description)} onChange={(e) => edit((d) => (d.days[i].description = e.target.value || null))} />
              </Labeled>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <TextInput label="Tour" value={str(day.tour)} onChange={(v) => edit((d) => (d.days[i].tour = v || null))} />
                <TextInput label="Evening activity" value={str(day.evening_activity)} onChange={(v) => edit((d) => (d.days[i].evening_activity = v || null))} />
                <TextInput label="Meals" value={str(day.meals)} onChange={(v) => edit((d) => (d.days[i].meals = v || null))} />
                <TextInput label="Guide" value={str(day.guide)} onChange={(v) => edit((d) => (d.days[i].guide = v || null))} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-1">Transfers</p>
                  <StringList items={day.transfers} addLabel="Add transfer" placeholder="e.g. Airport to Hotel – PVT" onChange={(next) => edit((d) => (d.days[i].transfers = next))} />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-1">Sightseeing</p>
                  <StringList items={day.sightseeing} addLabel="Add sightseeing" placeholder="e.g. City Tour – PVT" onChange={(next) => edit((d) => (d.days[i].sightseeing = next))} />
                </div>
              </div>
              {day.custom_fields.length > 0 && (
                <CustomFieldsEditor items={day.custom_fields} onChange={(next) => edit((d) => (d.days[i].custom_fields = next))} />
              )}
            </div>
          ))}
          {data.days.length === 0 && <p className="text-xs text-gray-400">No days extracted.</p>}
        </div>
      </SectionCard>

      {/* 4 — Insurance */}
      <SectionCard step={4} title="Insurance details">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <TextInput label="From price" value={str(data.insurance.from_price)} onChange={(v) => edit((d) => (d.insurance.from_price = v || null))} />
          <TextInput label="Currency" value={str(data.insurance.currency)} onChange={(v) => edit((d) => (d.insurance.currency = v || null))} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
          <div>
            <p className="text-xs font-medium text-gray-600 mb-1">Providers</p>
            <StringList items={data.insurance.providers} addLabel="Add provider" onChange={(next) => edit((d) => (d.insurance.providers = next))} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-600 mb-1">Coverage</p>
            <StringList items={data.insurance.coverage} addLabel="Add coverage" onChange={(next) => edit((d) => (d.insurance.coverage = next))} />
          </div>
        </div>
        <Labeled label="Note" className="mt-3">
          <textarea className={TEXTAREA} value={str(data.insurance.note)} onChange={(e) => edit((d) => (d.insurance.note = e.target.value || null))} />
        </Labeled>
      </SectionCard>

      {/* 5 — Inclusions & Exclusions */}
      <SectionCard step={5} title="Inclusions & Exclusions">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium text-gray-600 mb-1">Inclusions</p>
            <StringList items={data.inclusions} addLabel="Add inclusion" onChange={(next) => edit((d) => (d.inclusions = next))} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-600 mb-1">Exclusions</p>
            <StringList items={data.exclusions} addLabel="Add exclusion" onChange={(next) => edit((d) => (d.exclusions = next))} />
          </div>
        </div>
      </SectionCard>

      {/* 6 — Booking policy */}
      <SectionCard step={6} title="Booking policy"
        action={<AddButton onClick={() => edit((d) => d.booking_policy.push({ title: "", detail: "" }))}>Add clause</AddButton>}
      >
        <PolicyList items={data.booking_policy} onChange={(next) => edit((d) => (d.booking_policy = next))} />
      </SectionCard>

      {/* 7 — Cancellation policy */}
      <SectionCard step={7} title="Cancellation policy"
        action={<AddButton onClick={() => edit((d) => d.cancellation_policy.charges.push({ period: "", charge: "" }))}>Add charge</AddButton>}
      >
        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Charges</p>
        <div className="space-y-2">
          {data.cancellation_policy.charges.map((c, i) => (
            <div key={i} className="flex items-center gap-2">
              <input className={`${INPUT} max-w-[45%]`} placeholder="Period" value={c.period} onChange={(e) => edit((d) => (d.cancellation_policy.charges[i].period = e.target.value))} />
              <input className={INPUT} placeholder="Charge" value={c.charge} onChange={(e) => edit((d) => (d.cancellation_policy.charges[i].charge = e.target.value))} />
              <IconDelete onClick={() => edit((d) => d.cancellation_policy.charges.splice(i, 1))} />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-4 mb-2">
          <p className="text-xs font-semibold text-gray-500 uppercase">Clauses</p>
          <AddButton onClick={() => edit((d) => d.cancellation_policy.clauses.push({ title: "", detail: "" }))}>Add clause</AddButton>
        </div>
        <PolicyList items={data.cancellation_policy.clauses} onChange={(next) => edit((d) => (d.cancellation_policy.clauses = next))} />
      </SectionCard>

      {/* 8 — Custom sections */}
      <SectionCard step={8} title="Custom sections" subtitle="Add anything the vendor doc doesn't cover"
        action={
          <div className="flex items-center gap-3">
            <AddButton onClick={() => edit((d) => d.custom_sections.push({ title: "", type: "text", content: "" }))}>Text</AddButton>
            <AddButton onClick={() => edit((d) => d.custom_sections.push({ title: "", type: "list", items: [""] }))}>List</AddButton>
            <AddButton onClick={() => edit((d) => d.custom_sections.push({ title: "", type: "table", rows: [{ label: "", value: "" }] }))}>Table</AddButton>
          </div>
        }
      >
        <div className="space-y-3">
          {data.custom_sections.map((s, i) => (
            <div key={i} className="rounded-xl border border-gray-200 p-3">
              <div className="flex items-center gap-2 mb-2">
                <input className={INPUT} placeholder="Section title" value={s.title} onChange={(e) => edit((d) => (d.custom_sections[i].title = e.target.value))} />
                <span className="text-[10px] uppercase text-gray-400 shrink-0">{s.type}</span>
                <IconDelete onClick={() => edit((d) => d.custom_sections.splice(i, 1))} />
              </div>
              {s.type === "text" && (
                <textarea className={TEXTAREA} value={s.content} onChange={(e) => edit((d) => { const sec = d.custom_sections[i]; if (sec.type === "text") sec.content = e.target.value; })} />
              )}
              {s.type === "list" && (
                <StringList items={s.items} addLabel="Add item" onChange={(next) => edit((d) => { const sec = d.custom_sections[i]; if (sec.type === "list") sec.items = next; })} />
              )}
              {s.type === "table" && (
                <div className="space-y-2">
                  {s.rows.map((r, ri) => (
                    <div key={ri} className="flex items-center gap-2">
                      <input className={`${INPUT} max-w-[40%]`} placeholder="Label" value={r.label} onChange={(e) => edit((d) => { const sec = d.custom_sections[i]; if (sec.type === "table") sec.rows[ri].label = e.target.value; })} />
                      <input className={INPUT} placeholder="Value" value={r.value} onChange={(e) => edit((d) => { const sec = d.custom_sections[i]; if (sec.type === "table") sec.rows[ri].value = e.target.value; })} />
                      <IconDelete onClick={() => edit((d) => { const sec = d.custom_sections[i]; if (sec.type === "table") sec.rows.splice(ri, 1); })} />
                    </div>
                  ))}
                  <AddButton onClick={() => edit((d) => { const sec = d.custom_sections[i]; if (sec.type === "table") sec.rows.push({ label: "", value: "" }); })}>Add row</AddButton>
                </div>
              )}
            </div>
          ))}
          {data.custom_sections.length === 0 && <p className="text-xs text-gray-400">No custom sections yet.</p>}
        </div>
      </SectionCard>

      {/* Sticky save at the bottom for long forms */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={save}
          disabled={saveStatus === "saving"}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-full text-sm transition-colors"
        >
          {saveStatus === "saved" ? <Check size={16} /> : <Save size={16} />}
          {saveStatus === "saving" ? "Saving…" : saveStatus === "saved" ? "Saved" : "Save itinerary"}
        </button>
      </div>
    </section>
  );
}

// Editor for PolicyItem[] ({title, detail}) — used by booking + cancellation clauses.
function PolicyList({ items, onChange }: { items: PolicyItem[]; onChange: (next: PolicyItem[]) => void }) {
  return (
    <div className="space-y-2">
      {items.map((p, i) => (
        <div key={i} className="rounded-xl border border-gray-200 p-3">
          <div className="flex items-center gap-2 mb-2">
            <input className={INPUT} placeholder="Title" value={p.title} onChange={(e) => onChange(items.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))} />
            <IconDelete onClick={() => onChange(items.filter((_, j) => j !== i))} />
          </div>
          <textarea className={TEXTAREA} placeholder="Detail" value={p.detail} onChange={(e) => onChange(items.map((x, j) => (j === i ? { ...x, detail: e.target.value } : x)))} />
        </div>
      ))}
      {items.length === 0 && <p className="text-xs text-gray-400">None extracted.</p>}
    </div>
  );
}
