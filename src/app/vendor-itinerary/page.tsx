import type { Metadata } from "next";
import VendorItineraryUpload from "@/components/vendor-itinerary/VendorItineraryUpload";

export const metadata: Metadata = {
  title: "Vendor Itinerary Import",
  description:
    "Internal tool — upload a vendor's itinerary document and convert it into an editable Marzi itinerary.",
  robots: { index: false, follow: false },
};

export default function VendorItineraryPage() {
  return (
    <div className="min-h-screen bg-gray-50 print:bg-white">
      <VendorItineraryUpload />
    </div>
  );
}
