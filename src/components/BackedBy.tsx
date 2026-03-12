"use client";

import { motion } from "framer-motion";

const BACKERS = [
  "Refractional",
  "Prometheus",
  "Watchtower",
  "Shutterframe",
  "Refractional",
  "Prometheus",
  "Watchtower",
  "Shutterframe",
];

export default function BackedBy() {
  return (
    <section className="bg-white py-12 sm:py-16 overflow-hidden">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center text-sm text-gray-400 mb-8"
      >
        Backed by the best in the industry
      </motion.p>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="flex animate-marquee whitespace-nowrap">
          {[...BACKERS, ...BACKERS].map((name, i) => (
            <div
              key={i}
              className="flex items-center gap-3 mx-8 sm:mx-12 flex-shrink-0"
            >
              <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-lg font-bold">
                  {name[0]}
                </span>
              </div>
              <span className="text-xl sm:text-2xl font-semibold text-gray-300">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
