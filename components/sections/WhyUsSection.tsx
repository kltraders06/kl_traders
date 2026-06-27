"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  Search,
  BadgeDollarSign,
  Globe,
  MessageCircle,
  Leaf,
  Package,
  Heart,
  LucideIcon,
} from "lucide-react";
import { WHY_CHOOSE_US } from "@/constants";

const iconMap: Record<string, LucideIcon> = {
  ShieldCheck,
  Search,
  BadgeDollarSign,
  Globe,
  MessageCircle,
  Leaf,
  Package,
  Heart,
};

export default function WhyUsSection() {
  return (
    <section className="py-24 bg-white">
      <div className="w-full max-w-[1440px] mx-auto px-5 sm:px-6 xl:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#1D6F42] font-semibold text-sm tracking-widest uppercase">
            The KL TRADERS Difference
          </span>
          <h2 className="mt-3 text-4xl lg:text-5xl font-bold text-[#114A2C] tracking-tight">
            Why Choose Us
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            International buyers choose KL TRADERS because we deliver more than
            products - we deliver peace of mind.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {WHY_CHOOSE_US.map((item, i) => {
            const Icon = iconMap[item.icon] || Leaf;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                whileHover={{ y: -5 }}
                className="group h-full bg-[#F8FAF8] hover:bg-[#1D6F42] rounded-2xl p-6 transition-all duration-300 cursor-default"
              >
                <Icon className="w-8 h-8 text-[#1D6F42] group-hover:text-white mb-4 transition-colors duration-300" />
                <h3 className="font-bold text-[#114A2C] group-hover:text-white mb-2 text-sm font-[Poppins] leading-snug transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500 group-hover:text-green-200 leading-relaxed transition-colors duration-300">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
