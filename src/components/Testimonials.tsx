"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

interface Testimonial {
  image: string;
  quote: string;
  name: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    image: "/manuel_anil_francis.jpg",
    quote:
      "The type of atmosphere and the crowd at Marzi events is mind blowing",
    name: "Manuel Anil Francis",
  },
  {
    image: "/preeta_bellari.jpg",
    quote:
      "Marzi has given me a lot of friends and it makes me feel confident",
    name: "Preetha Bellari",
  },
  {
    image: "/usha_narendran.jpg",
    quote:
      "Marzi is really wonderful, we got a chance to interact with others.",
    name: "Usha Narendran",
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
            Across Bangalore,
            <br />
            music lovers are meeting.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm text-gray-400"
          >
            Conversations begin with a song and end with a room full of people singing the same line.
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
                {t.name}
              </p>
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
