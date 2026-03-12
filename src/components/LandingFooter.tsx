"use client";

import Link from "next/link";
import Image from "next/image";
import { Instagram, Twitter, Linkedin } from "lucide-react";

const NAV_LINKS = [
  { label: "Meetups", href: "/meetups" },
  { label: "Holidays", href: "/holidays" },
  { label: "About", href: "/about" },
  { label: "Community", href: "/community" },
  { label: "Contact", href: "/contact" },
];

const SOCIAL_LINKS = [
  { icon: Instagram, href: "https://www.instagram.com/marzibyprimus/", label: "Instagram" },
  { icon: Linkedin, href: "https://www.linkedin.com/company/marzibyprimus", label: "LinkedIn" },
];

export default function LandingFooter() {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 pt-16 pb-8">
        {/* Top section */}
        <div className="flex flex-col lg:flex-row justify-between gap-12 mb-12">
          <div>
            <img
              src="/assets/marzi_crop.png"
              alt="Marzi"
             
              className="h-14 sm:h-12 md:h-12  w-auto brightness-0 invert"
            />
            <p className="text-gray-400 text-sm mt-4">
              by <span className="font-semibold tracking-wider text-gray-300">PRIMUS</span>{" "}
              | Your Life. Your Terms.
            </p>
          </div>

      
        </div>

        <hr className="border-gray-800 mb-10" />

        <div className="mb-10 max-w-lg">
          <p className="text-sm text-gray-400 leading-relaxed mb-6">
            At Marzi, we&apos;re not just building a platform — we&apos;re creating a
            movement. A world where growing older means growing bolder. Where
            community isn&apos;t just a feature, it&apos;s the foundation.
          </p>
          <a
            href="https://play.google.com/store/apps/details?id=marzi.app&hl=en_IN"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-primary hover:bg-primary/90 text-white text-sm font-semibold px-8 py-3.5 rounded-full transition-colors"
          >
            Get the App at Play Store
          </a>
        </div>

        <hr className="border-gray-800 mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>&copy; Marzi. All rights reserved</p>

          <div className="flex items-center gap-4">
            <Link href="https://www.marzi.life/privacy-policy" target="_blank" className="hover:text-gray-300 transition-colors">
              Privacy
            </Link>
            <Link href="https://www.marzi.life/terms-and-conditions" target="_blank" className="hover:text-gray-300 transition-colors">
              Terms
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
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
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
