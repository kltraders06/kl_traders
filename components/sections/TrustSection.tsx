"use client";

import { motion } from "framer-motion";
import {
  Award,
  Users,
  Globe,
  Truck,
  Package,
  Zap,
  LucideIcon,
} from "lucide-react";
import { TRUST_FEATURES } from "@/constants";

const iconMap: Record<string, LucideIcon> = {
  Award,
  Users,
  Globe,
  Truck,
  Package,
  Zap,
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

export default function TrustSection() {
  return (
    <section id="trust" className="py-24 bg-[#F8FAF8]">
      <div className="w-full max-w-[1440px] mx-auto px-5 sm:px-6 xl:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#1D6F42] font-semibold text-sm tracking-widest uppercase">
            Why Importers Trust Us
          </span>
          <h2 className="mt-3 text-4xl lg:text-5xl font-bold text-[#114A2C] tracking-tight">
            Built for International Trade
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Every aspect of our operation is designed to give international
            buyers confidence, consistency, and peace of mind.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {TRUST_FEATURES.map((feature) => {
            const Icon = iconMap[feature.icon] || Award;
            return (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                whileHover={{ y: -6, boxShadow: "0 20px 60px rgba(29,111,66,0.12)" }}
                className="h-full bg-white rounded-2xl p-8 border border-gray-100 transition-all duration-300 group cursor-default"
              >
                <div className="w-14 h-14 rounded-xl bg-[#E8F5E9] flex items-center justify-center mb-6 group-hover:bg-[#1D6F42] transition-colors duration-300">
                  <Icon className="w-7 h-7 text-[#1D6F42] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-semibold text-[#114A2C] mb-3 font-[Poppins]">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-[15px]">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
