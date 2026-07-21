"use client";

import Image from "next/image";
import { ArrowLeft, Printer } from "lucide-react";
import type {
  CustomField,
  PolicyItem,
  VendorItineraryData,
} from "@/data/vendorItinerary";

const PRI = "#821A52";

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

function PolicyBlock({ items }: { items: PolicyItem[] }) {
  return (
    <div className="space-y-1.5">
      {items.map((p, i) => (
        <div key={i} className="text-[11px]">
          {has(p.title) && <strong>{p.title}. </strong>}
          <span className="text-gray-700">{p.detail}</span>
        </div>
      ))}
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

  const overviewRows: [string, string | null][] = [
    ["Destination", o.destination],
    ["Country", o.country],
    ["Departure city", o.departure_city],
    ["Travel dates", datesLine || null],
    ["Duration", o.duration],
    ["Travellers", paxLine || null],
    ["Total / person", priceLine || null],
    ["Includes flights", o.pricing.includes_flights == null ? null : o.pricing.includes_flights ? "Yes" : "No"],
    ["Taxes", o.pricing.taxes_note],
  ];

  const showHotels = data.hotels.some((h) => has(h.name) || has(h.city));
  const showTransfers = data.transfers.some((t) => has(t.name) || has(t.services));
  const showFlights = data.flights.some((f) => has(f.from) || has(f.airline));
  const showInsurance =
    has(data.insurance.from_price) || data.insurance.providers.length > 0 || data.insurance.coverage.length > 0 || has(data.insurance.note);

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
        {/* Header */}
        <div className="px-8 pt-6 pb-5 text-white" style={{ background: PRI }}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <Image src="/assets/marzi_crop.png" alt="Marzi" width={120} height={40} className="h-8 w-auto brightness-0 invert" priority />
              <span className="text-[9px] uppercase tracking-widest opacity-70">Travel Desk</span>
            </div>
            <div className="text-right text-[9px] opacity-70">
              <div>Ref: MRZ-{refId.toString().padStart(6, "0")}</div>
              <div>Prepared by Marzi</div>
            </div>
          </div>
          <h1 className="mt-4 text-xl font-bold">{o.trip_name || o.destination || "Travel Itinerary"}</h1>
          <p className="text-[12px] opacity-85 mt-0.5">
            {[o.duration, datesLine].filter(Boolean).join(" · ")}
          </p>
          {o.destination && <p className="text-[12px] opacity-85">{o.destination}</p>}
        </div>

        <div className="px-8 py-5 space-y-5 text-[11.5px] leading-relaxed">
          {/* Overview */}
          <Sec title="Overview">
            <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px]">
              {overviewRows.map(([k, v]) =>
                has(v) ? (
                  <div key={k} className="flex gap-2">
                    <span className="min-w-[110px] text-gray-400">{k}</span>
                    <span className="font-medium">{v}</span>
                  </div>
                ) : null,
              )}
              <CustomFieldRows fields={o.custom_fields} />
            </div>
            {has(o.about_destination) && (
              <p className="text-[11px] text-gray-700 mt-2">{o.about_destination}</p>
            )}
          </Sec>

          {/* Hotels */}
          {showHotels && (
            <Sec title="Hotel Details">
              {data.hotels.map((h, i) => (
                <div key={i} className="mb-2.5 p-2.5 rounded border border-gray-200" style={{ pageBreakInside: "avoid" }}>
                  <div className="flex justify-between items-start">
                    <div>
                      <strong className="text-[12px]">{h.name}</strong>
                      <br />
                      <span className="text-[10px] text-gray-500">
                        {[h.city, h.nights != null ? `${h.nights}N` : "", h.meals].filter(has).join(" · ")}
                      </span>
                    </div>
                  </div>
                  {has(h.room_type) && <p className="text-[11px] text-gray-700 mt-1">{h.room_type}</p>}
                  <div className="text-[11px]"><CustomFieldRows fields={h.custom_fields} /></div>
                </div>
              ))}
            </Sec>
          )}

          {/* Transfers */}
          {showTransfers && (
            <Sec title="Cab / Transfer Details">
              {data.transfers.map((t, i) => (
                <div key={i} className="text-[11px] mb-0.5">
                  <strong>{t.name}</strong>
                  {has(t.type) && <span className="text-gray-500"> — {t.type}</span>}
                  {has(t.services) && <span className="text-gray-500 italic"> ({t.services})</span>}
                </div>
              ))}
            </Sec>
          )}

          {/* Flights */}
          {showFlights && (
            <Sec title="Flight Details">
              {data.flights.map((f, i) => (
                <div key={i} className="mb-2 p-2.5 rounded border border-gray-200" style={{ pageBreakInside: "avoid" }}>
                  <div className="flex justify-between items-start">
                    <strong className="text-[12px]">{[f.from, f.to].filter(has).join(" → ")}</strong>
                    <span className="text-[10px] text-gray-500">{[f.date, f.stops].filter(has).join(" · ")}</span>
                  </div>
                  <div className="text-[11px] text-gray-700 mt-0.5">
                    {[f.airline, f.flight_no, f.aircraft].filter(has).join(" · ")}
                  </div>
                  <div className="text-[10.5px] text-gray-500">
                    {[
                      f.depart && f.arrive ? `${f.depart} – ${f.arrive}` : (f.depart || f.arrive),
                      f.duration,
                      f.cabin,
                      f.refundable == null ? "" : f.refundable ? "Refundable" : "Non-refundable",
                    ].filter(has).join(" · ")}
                  </div>
                  {(has(f.baggage.cabin) || has(f.baggage.checkin)) && (
                    <div className="text-[10px] text-gray-500 mt-0.5">
                      Baggage: {[f.baggage.cabin && `Cabin ${f.baggage.cabin}`, f.baggage.checkin && `Check-in ${f.baggage.checkin}`].filter(Boolean).join(" · ")}
                    </div>
                  )}
                  {has(f.fare_note) && <div className="text-[10px] text-amber-700 italic">{f.fare_note}</div>}
                </div>
              ))}
            </Sec>
          )}

          {/* Day-by-day */}
          {data.days.length > 0 && (
            <Sec title="Day-wise Itinerary">
              <div className="space-y-3">
                {data.days.map((d, i) => (
                  <div key={i} className="rounded border border-gray-200 overflow-hidden" style={{ pageBreakInside: "avoid" }}>
                    <div className="flex items-center gap-2 px-3 py-2" style={{ background: "#f3f4f6" }}>
                      <span className="flex h-6 w-6 items-center justify-center rounded-full text-white text-[10px] font-bold" style={{ background: PRI }}>{d.day}</span>
                      <span className="text-[12px] font-bold">{d.title || `Day ${d.day}`}</span>
                    </div>
                    <div className="px-3 py-2 space-y-1 text-[11px]">
                      {has(d.description) && <p className="text-gray-600">{d.description}</p>}
                      {d.transfers.filter(has).map((t, ti) => (
                        <p key={`t${ti}`} className="text-[10.5px]"><strong style={{ color: PRI }}>Transfer:</strong> {t}</p>
                      ))}
                      {d.sightseeing.filter(has).map((s, si) => (
                        <p key={`s${si}`} className="text-[10.5px]"><strong style={{ color: PRI }}>Sightseeing:</strong> {s}</p>
                      ))}
                      {has(d.tour) && <p className="text-[10.5px]"><strong style={{ color: PRI }}>Tour:</strong> {d.tour}</p>}
                      {has(d.evening_activity) && <p className="text-[10.5px]"><strong style={{ color: PRI }}>Evening:</strong> {d.evening_activity}</p>}
                      <div className="flex flex-wrap gap-x-3 text-[10px] text-gray-500 border-t border-gray-100 pt-1 mt-1">
                        {has(d.meals) && <span><strong>Meals:</strong> {d.meals}</span>}
                        {has(d.guide) && <span><strong>Guide:</strong> {d.guide}</span>}
                      </div>
                      <div className="text-[10px]"><CustomFieldRows fields={d.custom_fields} /></div>
                    </div>
                  </div>
                ))}
              </div>
            </Sec>
          )}

          {/* Insurance */}
          {showInsurance && (
            <Sec title="Insurance Details">
              {has(data.insurance.from_price) && (
                <p className="text-[11px] mb-1">
                  <strong>From {[data.insurance.currency, data.insurance.from_price].filter(has).join(" ")}</strong>
                </p>
              )}
              {data.insurance.providers.length > 0 && (
                <p className="text-[11px] mb-1"><strong>Providers:</strong> {data.insurance.providers.filter(has).join(" · ")}</p>
              )}
              {data.insurance.coverage.length > 0 && (
                <ul className="list-disc pl-5 text-[11px] text-gray-700">
                  {data.insurance.coverage.filter(has).map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              )}
              {has(data.insurance.note) && <p className="text-[10px] text-gray-500 italic mt-1">{data.insurance.note}</p>}
            </Sec>
          )}

          {/* Inclusions & Exclusions */}
          {(data.inclusions.length > 0 || data.exclusions.length > 0) && (
            <Sec title="Inclusions & Exclusions">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.inclusions.length > 0 && (
                  <div>
                    <p className="text-[11px] font-bold mb-1" style={{ color: PRI }}>Inclusions</p>
                    <ul className="list-disc pl-5 text-[11px] text-gray-700 space-y-0.5">
                      {data.inclusions.filter(has).map((x, i) => <li key={i}>{x}</li>)}
                    </ul>
                  </div>
                )}
                {data.exclusions.length > 0 && (
                  <div>
                    <p className="text-[11px] font-bold mb-1" style={{ color: PRI }}>Exclusions</p>
                    <ul className="list-disc pl-5 text-[11px] text-gray-700 space-y-0.5">
                      {data.exclusions.filter(has).map((x, i) => <li key={i}>{x}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            </Sec>
          )}

          {/* Booking policy */}
          {data.booking_policy.length > 0 && (
            <Sec title="Booking Policy">
              <PolicyBlock items={data.booking_policy} />
            </Sec>
          )}

          {/* Cancellation policy */}
          {(data.cancellation_policy.charges.length > 0 || data.cancellation_policy.clauses.length > 0) && (
            <Sec title="Cancellation Policy">
              {data.cancellation_policy.charges.length > 0 && (
                <div className="mb-2">
                  {data.cancellation_policy.charges.map((c, i) => (
                    <div key={i} className="flex justify-between text-[11px] border-b border-gray-100 py-0.5">
                      <span className="text-gray-700">{c.period}</span>
                      <span className="font-semibold" style={{ color: PRI }}>{c.charge}</span>
                    </div>
                  ))}
                </div>
              )}
              {data.cancellation_policy.clauses.length > 0 && <PolicyBlock items={data.cancellation_policy.clauses} />}
            </Sec>
          )}

          {/* Custom sections */}
          {data.custom_sections.map((s, i) => (
            <Sec key={i} title={s.title || "Additional Information"}>
              {s.type === "text" && <p className="text-[11px] text-gray-700 whitespace-pre-line">{s.content}</p>}
              {s.type === "list" && (
                <ul className="list-disc pl-5 text-[11px] text-gray-700 space-y-0.5">
                  {s.items.filter(has).map((x, j) => <li key={j}>{x}</li>)}
                </ul>
              )}
              {s.type === "table" && (
                <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px]">
                  {s.rows.map((r, j) => (
                    <div key={j} className="flex gap-2">
                      <span className="min-w-[110px] text-gray-400">{r.label}</span>
                      <span className="font-medium">{r.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </Sec>
          ))}
        </div>

        {/* Footer — on screen */}
        <div className="itin-footer-screen px-8 py-4" style={{ background: PRI, color: "white", borderTop: "2px solid #6b1545" }}>
          <div className="flex justify-between items-start text-[10px]">
            <div>
              <div className="text-[12px] font-bold">MARZI TRAVEL DESK</div>
              <div style={{ opacity: 0.75 }}>Your Life. Your Terms.</div>
            </div>
            <div className="text-right">
              <div style={{ opacity: 0.5 }}>Prepared by Marzi</div>
              <div className="text-[11px] font-bold mt-1">www.marzi.life</div>
            </div>
          </div>
        </div>
      </article>

      {/* Footer — repeated on every printed page */}
      <div className="itin-footer-print" style={{ background: PRI, color: "white" }}>
        <div className="flex justify-between items-start text-[10px] px-8 py-3">
          <div>
            <div className="text-[11px] font-bold">MARZI TRAVEL DESK</div>
            <div style={{ opacity: 0.8 }}>Your Life. Your Terms. · www.marzi.life</div>
          </div>
          <div className="text-[9px] text-right" style={{ opacity: 0.5 }}>Ref: MRZ-{refId.toString().padStart(6, "0")}</div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .itin-report { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; }
        .itin-footer-print { display: none; }
        @media print {
          @page { size: A4; margin: 0; }
          body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          html, body { background: #fff !important; }
          .no-print { display: none !important; }
          .itin-report { box-shadow: none !important; margin: 0 !important; max-width: 100% !important; padding: 12mm 12mm 60px 12mm !important; }
          .itin-footer-screen { display: none !important; }
          .itin-footer-print {
            display: block !important;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
        }
      ` }} />
    </div>
  );
}

function Sec({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ pageBreakInside: "avoid" }}>
      <h2 className="text-[12px] font-bold mb-2 pb-1" style={{ borderBottom: `2px solid ${PRI}`, color: PRI }}>{title}</h2>
      {children}
    </section>
  );
}
