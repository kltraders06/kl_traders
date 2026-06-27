"use client";

import { motion } from "framer-motion";
import {
  Sprout,
  ClipboardCheck,
  Filter,
  Package,
  FileText,
  Plane,
  MapPin,
  LucideIcon,
} from "lucide-react";
import { EXPORT_STEPS } from "@/constants";

const iconMap: Record<string, LucideIcon> = {
  Sprout,
  ClipboardCheck,
  Filter,
  Package,
  FileText,
  Plane,
  MapPin,
};

export default function ExportProcessSection() {
  return (
    <section id="export-process" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-[#1D6F42] font-semibold text-sm tracking-widest uppercase">
            From Farm to Your Destination
          </span>
          <h2 className="mt-3 text-4xl lg:text-5xl font-bold text-[#114A2C] tracking-tight">
            Our Export Process
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            A transparent, step-by-step journey that ensures quality at every
            stage - from our farmers to your facility.
          </p>
        </motion.div>

        {/* Timeline Steps */}
        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-[52px] left-[calc(100%/14)] right-[calc(100%/14)] h-0.5 bg-gradient-to-r from-[#E8F5E9] via-[#1D6F42] to-[#E8F5E9]" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-8 lg:gap-4">
            {EXPORT_STEPS.map((step, i) => {
              const Icon = iconMap[step.icon] || Package;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="flex flex-col items-center text-center group"
                >
                  {/* Icon circle */}
                  <motion.div
                    whileHover={{ scale: 1.1, y: -4 }}
                    className="relative w-24 h-24 rounded-full bg-[#E8F5E9] border-4 border-white shadow-lg flex flex-col items-center justify-center mb-5 group-hover:bg-[#1D6F42] transition-colors duration-300 cursor-default z-10"
                  >
                    <Icon className="w-8 h-8 text-[#1D6F42] group-hover:text-white transition-colors duration-300" />
                    <span className="text-xs font-bold text-[#1D6F42] group-hover:text-green-200 transition-colors duration-300 mt-0.5">
                      {step.number}
                    </span>
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-sm font-bold text-[#114A2C] mb-2 font-[Poppins] leading-tight">
                    {step.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 bg-gradient-to-r from-[#114A2C] to-[#1D6F42] rounded-3xl p-10 text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-3">
            Ready to Start Your Import?
          </h3>
          <p className="text-green-200 mb-6 max-w-md mx-auto">
            Our team handles all documentation, compliance, and logistics - so
            you can focus on your business.
          </p>
          <motion.button
            onClick={() => {
              const el = document.querySelector("#contact");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-[#1D6F42] px-8 py-3.5 rounded-full font-semibold text-sm shadow-xl"
          >
            Get a Free Quote
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
