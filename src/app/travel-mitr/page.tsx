import type { Metadata } from "next";
import TravelMitrLanding from "@/components/travel-mitr-landing/TravelMitrLanding";

const title = "Marzi Holidays — Travel curated for 50+";
const description =
  "Marzi Holidays crafts effortless group journeys exclusively for travellers aged 50 and above. Sri Lanka, Vietnam and free travel guidance from your Travel Mitr.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function TravelMitrPage() {
  return <TravelMitrLanding />;
}
