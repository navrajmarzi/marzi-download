"use client";

import { motion } from "framer-motion";

const groupPng = "/group_of_people.webp";

export default function Hero() {
  return (
    <section className="relative bg-white overflow-hidden h-[90vh] md:h-screen">
  
      <div
        className="hidden md:block absolute -top-24 -right-24 w-60 h-60 sm:w-80 sm:h-80  bg-primary z-0"
        style={{ clipPath: "circle(50% at 50% 50%)" }}
      />

      {/* Background layer: small circle */}
      <div
        className="hidden md:block absolute top-20 right-[30%] w-16 h-16 lg:w-24 lg:h-24 bg-primary z-0"
        style={{ clipPath: "circle(50% at 50% 50%)" }}
      />

   

      {/* Background layer: diagonal swoosh — 40% from bottom */}
      <div
        className="absolute hidden md:block  bottom-0 left-0 right-0 h-[45%] bg-primary/80 z-5"
        style={{ clipPath: "polygon(0 40%, 100% 10%, 100% 100%, 0% 100%)" }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-[40%] bg-primary z-5"
        style={{ clipPath: "polygon(0 50%, 100% 20%, 100% 100%, 0% 100%)" }}
      />

      {/* Content grid */}
      <div className="container mx-auto px-4 sm:0 relative h-full grid grid-cols-1 md:grid-cols-2 items-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-20 max-w-xl space-y-4"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] text-gray-900 mb-8">
            Active Aging{" "}
            <br className="hidden sm:block" />
            with{" "}
            <span className="italic font-[family-name:var(--font-playfair)]">
              joy
            </span>{" "}
            and
            <br />
            <span className="italic font-[family-name:var(--font-playfair)]">
              connections.
            </span>
          </h1>

          <p className="md:hidden max-w-2xl text-lg text-gray-500 leading-relaxed">
            Marzi is designed for adults 55+ to live healthier, happier, and safer
            lives. Customize your space to talk, play, and hang out with your
            community.
          </p>

          <a
            href="https://marzi.app/download"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-primary text-white text-base sm:text-lg px-8 py-4 sm:px-10 sm:py-5 rounded-full font-semibold hover:bg-primary/90 transition-colors"
          >
            Download the App
          </a>
        </motion.div>

        {/* Group PNG + description */}
        <div className="flex flex-col">
          <img
            src={groupPng}
            alt="Happy seniors enjoying life together"
            className="w-full h-full object-contain object-bottom z-20"
          />
          <p className="hidden md:block max-w-2xl text-lg  text-white leading-relaxed mt-14">
            Marzi is designed for adults 55+ to live healthier, happier, and safer
            lives. Customize your space to talk, play, and hang out with your
            community.
          </p>
        </div>
      </div>
    </section>
  );
}
