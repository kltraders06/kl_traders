"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Leaf, Users, TrendingUp, Star } from "lucide-react";

const highlights = [
  { icon: Users, value: "200+", label: "Verified Farmers" },
  { icon: Leaf, value: "100%", label: "Fresh to Order" },
  { icon: TrendingUp, value: "12mo", label: "Year-round Supply" },
  { icon: Star, value: "Zero", label: "Middlemen" },
];

export default function FarmerNetworkSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <Image
        src="/images/hero/hero-curry-leaf-farm.jpg"
        alt="KL TRADERS curry leaf farm network"
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#114A2C]/95 via-[#114A2C]/85 to-[#1D6F42]/70" />

      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-5 sm:px-6 xl:px-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-green-300 font-semibold text-sm tracking-widest uppercase">
              Our Farmer Network
            </span>
            <h2 className="mt-4 text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
              Directly from
              <br />
              the Source
            </h2>
            <p className="mt-6 text-green-100/90 text-lg leading-relaxed">
              Our network of 200+ verified farmers across Tamil Nadu is the
              foundation of our reliability. We build long-term relationships with
              growers who follow our quality guidelines - ensuring consistent,
              traceable produce for every shipment.
            </p>
            <p className="mt-4 text-green-200/80 leading-relaxed">
              By eliminating middlemen, we deliver fresher produce at more
              competitive prices - while paying fair rates to the farmers who grow
              it. This direct connection is what gives our buyers the confidence
              of a reliable, scalable supply chain.
            </p>

            <motion.button
              onClick={() => {
                const el = document.querySelector("#contact");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group mt-8 inline-flex items-center gap-3 bg-white text-[#1D6F42] px-8 py-4 rounded-full font-semibold text-base shadow-2xl"
            >
              Become Our Buyer
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>

          {/* Stats cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 gap-5"
          >
            {highlights.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  whileHover={{ y: -4 }}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-7 text-center"
                >
                  <Icon className="w-8 h-8 text-green-300 mx-auto mb-3" />
                  <div className="text-4xl font-bold text-white font-[Poppins]">
                    {item.value}
                  </div>
                  <div className="text-green-300 text-sm mt-1">{item.label}</div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
