// ─── Vendor Itinerary Import — upload a vendor doc, extract a Marzi itinerary ──

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
export const VENDOR_ITINERARY_ENDPOINT = `${API_BASE_URL}/api/home/vendor-itinerary/create/`;

export const VENDOR_UPLOAD_HERO = {
  title: "Import a Vendor Itinerary",
  subtitle:
    "Upload a vendor's itinerary (PDF, DOCX, or image). We strip the vendor branding and extract a clean, editable Marzi itinerary.",
} as const;

// Accepted upload types — must match the backend's ALLOWED_EXTENSIONS.
export const ACCEPTED_EXTENSIONS = ["pdf", "docx", "png", "jpg", "jpeg"] as const;
export const ACCEPTED_ATTR = ".pdf,.docx,.png,.jpg,.jpeg";
export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024; // 25 MB — matches backend

// ─── Extracted itinerary schema (the locked 8-section contract) ──────────────

export type CustomField = { label: string; value: string };

export type VendorOverview = {
  trip_name: string | null;
  country: string | null;
  destination: string | null;
  departure_city: string | null;
  start_date: string | null;
  end_date: string | null;
  duration: string | null;
  pax: { adults: number | null; children: number | null; rooms: number | null };
  pricing: {
    total_per_person: string | null;
    currency: string | null;
    includes_flights: boolean | null;
    taxes_note: string | null;
  };
  about_destination: string | null;
  custom_fields: CustomField[];
};

export type VendorHotel = {
  city: string | null;
  name: string | null;
  nights: number | null;
  meals: string | null;
  room_type: string | null;
  custom_fields: CustomField[];
};

export type VendorTransfer = {
  name: string | null;
  type: string | null;
  services: string | null;
};

export type VendorFlight = {
  from: string | null;
  to: string | null;
  date: string | null;
  airline: string | null;
  flight_no: string | null;
  aircraft: string | null;
  depart: string | null;
  arrive: string | null;
  from_airport: string | null;
  to_airport: string | null;
  stops: string | null;
  duration: string | null;
  cabin: string | null;
  refundable: boolean | null;
  fare_note: string | null;
  baggage: { cabin: string | null; checkin: string | null };
};

export type VendorDay = {
  day: number;
  title: string | null;
  description: string | null;
  transfers: string[];
  sightseeing: string[];
  tour: string | null;
  evening_activity: string | null;
  meals: string | null;
  guide: string | null;
  custom_fields: CustomField[];
};

export type VendorInsurance = {
  from_price: string | null;
  currency: string | null;
  providers: string[];
  coverage: string[];
  note: string | null;
};

export type PolicyItem = { title: string; detail: string };

export type VendorCancellationPolicy = {
  charges: { period: string; charge: string }[];
  clauses: PolicyItem[];
};

export type VendorCustomSection =
  | { title: string; type: "text"; content: string }
  | { title: string; type: "list"; items: string[] }
  | { title: string; type: "table"; rows: { label: string; value: string }[] };

export type VendorItineraryData = {
  overview: VendorOverview;
  hotels: VendorHotel[];
  transfers: VendorTransfer[];
  flights: VendorFlight[];
  days: VendorDay[];
  insurance: VendorInsurance;
  inclusions: string[];
  exclusions: string[];
  booking_policy: PolicyItem[];
  cancellation_policy: VendorCancellationPolicy;
  custom_sections: VendorCustomSection[];
  _meta: { confidence: "high" | "medium" | "low"; unmapped_text: string[] };
};

// ─── API response shape ──────────────────────────────────────────────────────

export type VendorAIStatus = "idle" | "pending" | "processing" | "success" | "failure";

export type VendorItineraryResponse = {
  id: number;
  uuid: string;
  created: string;
  original_filename: string | null;
  file_type: string | null;
  ai_status: VendorAIStatus;
  ai_error: string | null;
  ai_output: VendorItineraryData | Record<string, unknown> | null;
  edited_output: VendorItineraryData | Record<string, unknown> | null;
};
