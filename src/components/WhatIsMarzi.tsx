"use client";

import { motion } from "framer-motion";
import { Share2 } from "lucide-react";

const IMAGES = {
  findTribe:
    "/community.webp",
  joinEvents:
    "/events.webp",
  jabWeMet:
    "/travel.webp",
};

const HOLIDAY_AVATARS = [
  "https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?w=80&h=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=80&h=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&crop=face",
];

export default function WhatIsMarzi() {
  return (
    <section id="offerings" className="bg-gray-50 py-16 sm:py-24 px-6 sm:px-10 lg:px-20">
      <div className="max-w-6xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        className="text-center text-lg sm:text-2xl border w-max mx-auto border-primary text-primary mb-16 rounded-full px-3 py-1 font-[family-name:var(--font-playfair)]"
        >
          How it works
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-snug max-w-3xl mx-auto mb-14"
        >
          On Marzi, people who grew up with these songs
          <br />
          <span className="italic font-[family-name:var(--font-playfair)]">
            find each other through their shared love for filmy music.
          </span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Find Your Tribe */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-pink-100 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 relative overflow-hidden"
          >
            <div className="absolute top-4 left-4 w-40 h-40 border border-pink-300/40 rounded-full pointer-events-none" />
            <div className="flex-1 relative z-10">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4">
                Meet Gen Evergreen
              </p>
              <p className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">
                🎶
              </p>
              <p className="text-sm text-gray-600 leading-relaxed max-w-[220px]">
                Lovers of classic Hindi film music — find your people.
              </p>
            </div>
            <div className="w-full sm:w-48 h-48 sm:h-auto rounded-2xl overflow-hidden flex-shrink-0">
              <img
                src={IMAGES.findTribe}
                alt="People connecting"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Top right image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-3xl overflow-hidden h-64 md:h-auto"
          >
            <img
              src={IMAGES.joinEvents}
              alt="Seniors having fun"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Jab We Met Marzi */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="rounded-3xl overflow-hidden h-64 md:h-auto relative"
          >
            <img
              src={IMAGES.jabWeMet}
              alt="Jab We Met Marzi"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2">
              <p className="text-sm font-bold text-gray-900">
                Jab We Met{" "}
                <span className="text-primary font-[family-name:var(--font-playfair)]">
                  Marzi
                </span>
              </p>
            </div>
          </motion.div>

          {/* Bottom right - stacked cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col gap-5"
          >
            <div className="bg-white rounded-3xl p-6 sm:p-8 flex-1">
              <div className="flex items-start justify-between mb-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Talk & Rediscover
                </p>
                <Share2 size={18} className="text-gray-400" />
              </div>
              <p className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">
                🎤
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Talk about songs, singers, and the stories behind them.
              </p>
            </div>

            <div className="bg-emerald-100 rounded-3xl p-6 sm:p-8 flex-1">
              <p className="text-sm text-gray-700 leading-relaxed mb-4">
                📻 Rediscover melodies that never really left.
              </p>
              <div className="flex -space-x-2">
                {HOLIDAY_AVATARS.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    className="w-9 h-9 rounded-full border-2 border-emerald-100 object-cover"
                  />
                ))}
                <div className="w-9 h-9 rounded-full border-2 border-emerald-100 bg-red-400 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">+</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
