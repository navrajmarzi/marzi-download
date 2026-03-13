"use client";

import { motion } from "framer-motion";
import type { LandingPageContent } from "@/lib/contentful";

export default function MomentsWithMarziDynamic({
  data,
}: {
  data: LandingPageContent["momentsCopy"];
}) {
  return (
    <section className="bg-white py-20 sm:py-28 px-6 sm:px-10 lg:px-20">
      <div className="max-w-5xl mx-auto flex flex-col gap-16 sm:gap-20">
        {data.blocks.map((block, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.15 }}
          >
            <p className="text-3xl sm:text-4xl lg:text-5xl leading-snug font-medium text-gray-900">
              {block.text}
            </p>
            <p
              className={`text-3xl sm:text-4xl lg:text-5xl leading-snug italic text-primary mt-1 font-[family-name:var(--font-playfair)] ${i > 0 ? "font-bold" : ""}`}
            >
              {block.accent}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
