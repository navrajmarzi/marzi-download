"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion, useAnimationFrame } from "framer-motion";
import { PHOTO_FAN } from "@/data/content";

const NUM_IMAGES = PHOTO_FAN.totalImages;
const ANGLE_STEP = 360 / NUM_IMAGES;
const RADIUS = 700;
const CARD_WIDTH = Math.ceil(2 * RADIUS * Math.tan(Math.PI / NUM_IMAGES)) - 20;

const PHOTOS = Array.from(
  { length: NUM_IMAGES },
  (_, i) => `/moments/moment_${String(i + 1).padStart(2, "0")}.jpg`,
);

export default function PhotoFan() {
  const stageRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rotation = useRef(180);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const hasEntered = useRef(false);
  const entryProgress = useRef(0);

  useAnimationFrame(() => {
    if (hasEntered.current && entryProgress.current < 1) {
      entryProgress.current = Math.min(1, entryProgress.current + 0.015);
    }
    const opacity = 1 - Math.pow(1 - entryProgress.current, 3);

    if (!isDragging.current) {
      rotation.current += 0.15;
    }

    for (let i = 0; i < NUM_IMAGES; i++) {
      const el = imageRefs.current[i];
      if (!el) continue;

      const angle = rotation.current + i * -ANGLE_STEP;
      el.style.transform = `rotateY(${angle}deg)`;
      el.style.opacity = `${opacity}`;

      const bgX =
        100 -
        (((((rotation.current - 180 - i * ANGLE_STEP) % 360) + 360) % 360) /
          360) *
          500;
      el.style.backgroundPosition = `${bgX}px 0px`;
    }
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          hasEntered.current = true;
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const delta = e.clientX - dragStartX.current;
    rotation.current -= delta * 0.3;
    dragStartX.current = e.clientX;
  }, []);

  const onPointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-gray-50 py-20 sm:py-28 overflow-hidden select-none cursor-grab active:cursor-grabbing"
    >
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center text-lg sm:text-2xl border w-max mx-auto border-primary  py-1 px-3 text-primary mb-16 rounded-full font-[family-name:var(--font-playfair)]"

      >
        {PHOTO_FAN.badge}
      </motion.p>

      <div
        ref={stageRef}
        className="relative w-full"
        style={{
          perspective: "2000px",
          perspectiveOrigin: "50% 50%",
          height: "280px",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {PHOTOS.map((src, i) => (
          <div
            key={i}
            ref={(el) => {
              imageRefs.current[i] = el;
            }}
            className="absolute rounded-xl"
            style={{
              width: `${CARD_WIDTH}px`,
              height: "280px",
              left: "50%",
              top: 0,
              marginLeft: `${-CARD_WIDTH / 2}px`,
              transformOrigin: `50% 50% ${RADIUS}px`,
              backfaceVisibility: "hidden",
              backgroundImage: `url(${src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0,
            }}
          />
        ))}
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 sm:w-48 bg-gradient-to-r from-gray-50 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 sm:w-48 bg-gradient-to-l from-gray-50 to-transparent z-10" />
    </section>
  );
}
