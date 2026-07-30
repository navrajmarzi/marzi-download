import { NextResponse } from "next/server";

type LeadPayload = {
  name: string;
  phone: string;
  city: string;
  dateOfBirth: string;
  interest: "sri_lanka" | "vietnam" | "travel_guide";
  message?: string | null;
};

const INTERESTS = ["sri_lanka", "vietnam", "travel_guide"] as const;

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

function validate(raw: Partial<LeadPayload>): string | null {
  const name = raw.name?.trim() ?? "";
  const phone = raw.phone?.trim() ?? "";
  const city = raw.city?.trim() ?? "";
  if (name.length < 2 || name.length > 100) return "Please share your name";
  if (phone.length < 6 || phone.length > 20 || !/^[+0-9\s\-()]+$/.test(phone)) {
    return "Enter a valid phone number";
  }
  if (city.length < 2 || city.length > 100) return "Which city are you from?";
  if (!raw.dateOfBirth) return "Please share your date of birth";
  if (!isAtLeast50(raw.dateOfBirth)) {
    return "Marzi Holidays is exclusively for travellers aged 50 and above";
  }
  if (!raw.interest || !INTERESTS.includes(raw.interest)) return "Invalid interest";
  if (raw.message && raw.message.length > 1000) return "Message is too long";
  return null;
}

export async function POST(request: Request) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    console.error("Missing SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY env vars");
    return NextResponse.json(
      { error: "Server is not configured. Please try again later." },
      { status: 500 }
    );
  }

  let raw: Partial<LeadPayload>;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const validationError = validate(raw);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  // Insert into the shared marzi-holidays Supabase `leads` table via PostgREST.
  const res = await fetch(`${url}/rest/v1/leads`, {
    method: "POST",
    headers: {
      apikey: key,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      name: raw.name!.trim(),
      phone: raw.phone!.trim(),
      city: raw.city!.trim(),
      date_of_birth: raw.dateOfBirth,
      interest: raw.interest,
      message: raw.message?.trim() || null,
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    console.error("Lead insert failed:", res.status, detail);
    return NextResponse.json(
      { error: "Could not save your enquiry. Please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
