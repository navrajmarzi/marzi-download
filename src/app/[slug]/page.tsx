import { notFound } from "next/navigation";
import {
  getLandingPage,
  getAllLandingSlugs,
  type LandingPageContent,
} from "@/lib/contentful";

import Navbar from "@/components/Navbar";
import HeroDynamic from "@/components/dynamic/HeroDynamic";
import MomentsWithMarziDynamic from "@/components/dynamic/MomentsWithMarziDynamic";
import PhotoFan from "@/components/PhotoFan";
import WhatIsMarziDynamic from "@/components/dynamic/WhatIsMarziDynamic";
import TestimonialsDynamic from "@/components/dynamic/TestimonialsDynamic";
import CtaBannerDynamic from "@/components/dynamic/CtaBannerDynamic";

// Pre-render all known slugs at build time
export async function generateStaticParams() {
  const slugs = await getAllLandingSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Revalidate every 60s so Contentful edits go live quickly
export const revalidate = 60;

export default async function LandingVariant({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content = await getLandingPage(slug);
  if (!content) notFound();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroDynamic data={content.hero} />
      <MomentsWithMarziDynamic data={content.momentsCopy} />
      <PhotoFan />
      <WhatIsMarziDynamic data={content.whatIsMarzi} />
      <TestimonialsDynamic data={content.testimonials} />
      <CtaBannerDynamic data={content.ctaBanner} />
    </div>
  );
}
