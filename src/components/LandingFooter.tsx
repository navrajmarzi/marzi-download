"use client";

import Link from "next/link";
import { Instagram, Linkedin } from "lucide-react";
import {
  LANDING_FOOTER,
  LOGO,
  PLAY_STORE_URL,
  SOCIAL_LINKS,
  LEGAL_LINKS,
} from "@/data/content";

const ICON_MAP = { instagram: Instagram, linkedin: Linkedin } as const;

export default function LandingFooter() {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 pt-16 pb-8">
        {/* Top section */}
        <div className="flex flex-col lg:flex-row justify-between gap-12 mb-12">
          <div>
            <img
              src={LOGO.src}
              alt={LOGO.alt}
              className="h-14 sm:h-12 md:h-12  w-auto brightness-0 invert"
            />
            <p className="text-gray-400 text-sm mt-4">
              by <span className="font-semibold tracking-wider text-gray-300">{LANDING_FOOTER.company}</span>{" "}
              | {LANDING_FOOTER.tagline}
            </p>
          </div>


        </div>

        <hr className="border-gray-800 mb-10" />

        <div className="mb-10 max-w-lg">
          <p className="text-sm text-gray-400 leading-relaxed mb-6">
            {LANDING_FOOTER.aboutText}
          </p>
          <a
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-primary hover:bg-primary/90 text-white text-sm font-semibold px-8 py-3.5 rounded-full transition-colors"
          >
            {LANDING_FOOTER.ctaText}
          </a>
        </div>

        <hr className="border-gray-800 mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>&copy; {LANDING_FOOTER.copyright}</p>

          <div className="flex items-center gap-4">
            {LEGAL_LINKS.map(({ label, href }) => (
              <Link key={label} href={href} target="_blank" className="hover:text-gray-300 transition-colors">
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {SOCIAL_LINKS.map(({ platform, href, label }) => {
              const Icon = ICON_MAP[platform];
              return (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  <Icon size={16} />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
