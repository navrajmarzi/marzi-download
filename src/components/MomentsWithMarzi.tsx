"use client";

import { motion } from "framer-motion";

export default function MomentsWithMarzi() {
  return (
    <section className="bg-white py-20 sm:py-28 px-6 sm:px-10 lg:px-20">
      <div className="max-w-5xl mx-auto flex flex-col gap-16 sm:gap-20">
        {/* Block 1 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-3xl sm:text-4xl lg:text-5xl leading-snug font-medium text-gray-900">
            The kids are busy building their lives
          </p>
          <p className="text-3xl sm:text-4xl lg:text-5xl leading-snug italic text-primary mt-1 font-[family-name:var(--font-playfair)]">
            The house feels a little too quiet.
          </p>
        </motion.div>

        {/* Block 2 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <p className="text-3xl sm:text-4xl lg:text-5xl leading-snug font-medium text-gray-900">
            You have the time,
          </p>
          <p className="text-3xl sm:text-4xl lg:text-5xl leading-snug font-bold italic text-primary mt-1 font-[family-name:var(--font-playfair)]">
            but no one to share it with.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
