"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, ChevronDown } from "lucide-react";
import { STATS } from "@/constants";

export default function HeroSection() {
  const handleNav = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      <Image
        src="/images/hero/hero-curry-leaf-farm.jpg"
        alt="KL TRADERS farm field in Tamil Nadu"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#071F12]/88 via-[#114A2C]/72 to-[#1D6F42]/60" />
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-28 pt-36 sm:px-6 lg:px-8 lg:py-32 lg:pt-40">
        <div className="max-w-4xl mx-auto lg:mx-0 text-center lg:text-left">
          <div
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium tracking-wide text-green-100 backdrop-blur-sm mb-8"
          >
            <span className="h-2 w-2 rounded-full bg-green-300" />
            Tamil Nadu, India - Exporting Worldwide
          </div>

          <h1
            className="mb-6 text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-[68px]"
          >
            Premium
            <span className="block text-green-300">Agricultural</span>
            Exports from India
          </h1>

          <p
            className="text-lg sm:text-xl text-white/84 max-w-2xl mx-auto lg:mx-0 leading-relaxed mb-10 font-light"
          >
            Delivering fresh coriander leaves and curry leaves to global markets
            with quality, reliability, and trust - directly from Tamil Nadu farms
            to your doorstep.
          </p>

          <div
            className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mb-16"
          >
            <button
              onClick={() => handleNav("#contact")}
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-white px-8 py-4 text-base font-semibold text-[#1D6F42] shadow-2xl shadow-black/30 transition-all duration-300"
            >
              Request a Quote
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => handleNav("#products")}
              className="inline-flex items-center justify-center gap-3 rounded-full border-2 border-white/40 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white"
            >
              View Our Products
            </button>
          </div>

          <div
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5 max-w-3xl mx-auto lg:mx-0"
          >
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/15 bg-white/10 px-4 py-5 text-center backdrop-blur-sm"
              >
                <div className="text-3xl lg:text-4xl font-bold text-white font-[Poppins]">
                  {stat.value}
                </div>
                <div className="text-sm text-green-200 font-medium mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <motion.button
        onClick={() => handleNav("#trust")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{
          opacity: { delay: 1.5, duration: 0.5 },
          y: { repeat: Infinity, duration: 2, ease: "easeInOut" },
        }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/70 transition-colors hover:text-white"
        aria-label="Scroll down"
      >
        <ChevronDown size={32} />
      </motion.button>
    </section>
  );
}
