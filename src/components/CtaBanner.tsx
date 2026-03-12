"use client";



import { Instagram,  Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

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


const BG_IMAGE =
  "/footer_wall.webp";

export default function CtaBanner() {
  return (
    <section className="relative w-full h-[600px] sm:h-[600px] overflow-hidden">
      <img
        src={BG_IMAGE}
        alt=""
        className="absolute inset-0 w-full h-full position-start "
      />
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 h-full flex flex-col justify-end items-center  px-6 sm:px-10 lg:px-20 pb-12 sm:pb-16 max-w-7xl mx-auto">

        <h2 className="text-3xl text-center sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
          Active Ageing.
          <br />
          <span className="italic font-[family-name:var(--font-playfair)]">
            Reimagined.
          </span>
        </h2>

        <a
          href="https://marzi.app/download"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-primary mx-auto text-white text-base px-8 py-4 sm:px-10 sm:py-5 rounded-full font-semibold hover:bg-primary/90 transition-colors"
        >
          Download the App
        </a>
      </div>

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
    </section>
  );
}
