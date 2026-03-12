"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

interface Testimonial {
  image: string;
  quote: string;
  name: string;
  age: number;
  city: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop&crop=face",
    quote:
      "Marzi has completely changed my social life after retirement. I've made friends who share my love for gardening and morning walks. It feels like college days again!",
    name: "Meera S",
    age: 68,
    city: "Bengaluru",
  },
  {
    image:
      "https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?w=400&h=500&fit=crop&crop=face",
    quote:
      "After my husband passed, I thought my social life was over. Marzi gave me a community that genuinely cares. The weekend meetups are the highlight of my week.",
    name: "Sunita P",
    age: 72,
    city: "Mumbai",
  },
  {
    image:
      "https://images.unsplash.com/photo-1581579438747-104c8d46c4c3?w=400&h=500&fit=crop&crop=face",
    quote:
      "The online sessions keep me mentally active every day. From poetry readings to health workshops — there's always something to look forward to.",
    name: "Rajan K",
    age: 65,
    city: "Chennai",
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  const prev = () =>
    setCurrent((c) => (c === 0 ? TESTIMONIALS.length - 1 : c - 1));
  const next = () =>
    setCurrent((c) => (c === TESTIMONIALS.length - 1 ? 0 : c + 1));

  const t = TESTIMONIALS[current];

  return (
    <section className="bg-white py-16 sm:py-24 px-6 sm:px-10 lg:px-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight font-[family-name:var(--font-playfair)]"
          >
            About us,
            <br />
            in their words.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm text-gray-400"
          >
            This is Marzi. Your life. Your terms.
          </motion.p>
        </div>

        <hr className="border-gray-200 mb-10" />

        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col md:flex-row gap-8 md:gap-12 items-start"
          >
            <div className="w-full md:w-64 h-72 md:h-80 rounded-2xl overflow-hidden flex-shrink-0">
              <img
                src={t.image}
                alt={t.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 pt-2">
              <div className="flex gap-1 mb-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className="fill-primary text-primary"
                  />
                ))}
              </div>

              <blockquote className="text-lg sm:text-xl text-gray-800 leading-relaxed mb-6">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <p className="font-semibold text-primary text-base">
                {t.name}, {t.age}
              </p>
              <p className="text-sm text-gray-500">{t.city}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-gray-700 transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-gray-700 transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
