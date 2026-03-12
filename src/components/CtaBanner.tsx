"use client";



import { Instagram, Linkedin } from "lucide-react";
import Link from "next/link";

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
  "/footer_wall_no_bg.png";

export default function CtaBanner() {
  return (
    <section className="relative  bg-primary py-12 mt-24">

      <img src={BG_IMAGE} alt="Background" className="h-[75%] bottom-[74%] md:h-[95%] absolute md:bottom-[65%] left-0 z-50" />

      <div className="max-w-5xl px-4 sm:px-2  z-10  flex flex-col justify-center items-end mx-auto space-y-10 mt-10">

        <div className="text-right">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight font-[family-name:var(--font-playfair)]">
            Music sounds better
            <br />
            when it&apos;s shared.
          </h2>
          <p className="text-white/80 text-lg mt-4">
            Come, find the people who still enjoy singing old songs just like you do.
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <a
            href="https://play.google.com/store/apps/details?id=marzi.app&hl=en_IN"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white ml-auto text-primary text-base px-8 py-4 sm:px-10 sm:py-5 rounded-full font-semibold hover:bg-white/90 transition-colors"
          >
            Download on Play Store
          </a>
          <p className="text-white/60 text-sm">
            It&apos;s free to join · Takes 2 minutes
          </p>
        </div>

        <div className="flex items-center gap-4 ml-auto text-white">
          <p>&copy; Marzi. All rights reserved</p>

          <div className="flex items-center gap-4">
            <Link href="https://www.marzi.life/privacy-policy" target="_blank" className="hover:text-gray-300 transition-colors">
              Privacy
            </Link>
            <Link href="https://www.marzi.life/terms-and-conditions" target="_blank" className="hover:text-gray-300 transition-colors">
              Terms
            </Link>
          </div>
          {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
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
          ))}
        </div>
      </div>


    </section>
  );
}
