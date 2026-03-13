"use client";

import { Instagram, Linkedin } from "lucide-react";
import Link from "next/link";
import { PLAY_STORE_URL, SOCIAL_LINKS, LEGAL_LINKS } from "@/data/content";
import type { LandingPageContent } from "@/lib/contentful";

const ICON_MAP = { instagram: Instagram, linkedin: Linkedin } as const;

export default function CtaBannerDynamic({
  data,
}: {
  data: LandingPageContent["ctaBanner"];
}) {
  return (
    <section className="relative isolate bg-primary py-12 mt-24">
      <img
        src={data.bgImage}
        alt="Background"
        className="h-full bottom-[56%] sm:bottom-[62%] absolute md:bottom-[65%] left-0 z-50 pointer-events-none object-contain"
      />

      <div className="max-w-5xl px-4 sm:px-2 z-10 flex flex-col justify-center items-end mx-auto space-y-10 mt-10">
        <div className="text-right">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight font-[family-name:var(--font-playfair)]">
            {data.heading.split("\n").map((line, i) => (
              <span key={i}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </h2>
          <p className="text-white/80 text-lg mt-4">{data.subtitle}</p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <a
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white ml-auto text-primary text-base px-8 py-4 sm:px-10 sm:py-5 rounded-full font-semibold hover:bg-white/90 transition-colors"
          >
            {data.ctaText}
          </a>
          <p className="text-white/60 text-sm">
            It&apos;s free to join · Takes 2 minutes
          </p>
        </div>

        <div className="flex items-center gap-4 ml-auto text-white">
          <p>&copy; Marzi. All rights reserved</p>

          <div className="flex items-center gap-4">
            {LEGAL_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                target="_blank"
                className="hover:text-gray-300 transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
          {SOCIAL_LINKS.map(({ platform, href, label }) => {
            const Icon = ICON_MAP[platform];
            return (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-white transition-colors"
              >
                <Icon size={16} />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
