"use client";

import { motion } from "framer-motion";
import { Globe2, MapPin } from "lucide-react";
import { EXPORT_REGIONS } from "@/constants";

export default function ExportCountriesSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#1D6F42] font-semibold text-sm tracking-widest uppercase">
            Global Reach
          </span>
          <h2 className="mt-3 text-4xl lg:text-5xl font-bold text-[#114A2C] tracking-tight">
            Countries We Export To
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            From the farms of Tamil Nadu to tables across five continents — our
            products reach over 15 countries worldwide.
          </p>
        </motion.div>

        {/* Visual globe */}
        <div className="grid lg:grid-cols-3 gap-8 items-center">
          {/* Left regions */}
          <div className="space-y-4">
            {EXPORT_REGIONS.slice(0, 2).map((region, i) => (
              <motion.div
                key={region.name}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="bg-[#F8FAF8] rounded-2xl p-6 border border-gray-100"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-3 h-3 rounded-full bg-[#1D6F42]" />
                  <h3 className="font-bold text-[#114A2C] font-[Poppins]">
                    {region.name}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {region.countries.map((c) => (
                    <span
                      key={c}
                      className="flex items-center gap-1.5 text-xs bg-white border border-gray-200 text-gray-600 px-3 py-1 rounded-full"
                    >
                      <MapPin size={10} className="text-[#1D6F42]" />
                      {c}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Center Globe visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex justify-center"
          >
            <div className="relative w-56 h-56 lg:w-72 lg:h-72">
              {/* Concentric circles */}
              {[1, 0.75, 0.5].map((scale, i) => (
                <motion.div
                  key={i}
                  animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                  transition={{
                    duration: 30 + i * 10,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-0 rounded-full border-2 border-[#1D6F42]/20"
                  style={{ transform: `scale(${scale})` }}
                />
              ))}
              {/* Center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-28 h-28 lg:w-36 lg:h-36 rounded-full bg-gradient-to-br from-[#1D6F42] to-[#114A2C] flex flex-col items-center justify-center shadow-2xl shadow-green-900/40">
                  <Globe2 className="w-10 h-10 lg:w-12 lg:h-12 text-white mb-1" />
                  <span className="text-white font-bold text-lg font-[Poppins]">
                    15+
                  </span>
                  <span className="text-green-200 text-xs">Countries</span>
                </div>
              </div>
              {/* Floating dots */}
              {[
                { top: "10%", left: "75%" },
                { top: "70%", left: "85%" },
                { top: "80%", left: "20%" },
                { top: "15%", left: "20%" },
              ].map((pos, i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                  style={pos}
                  className="absolute w-3 h-3 bg-[#1D6F42] rounded-full shadow-lg"
                />
              ))}
            </div>
          </motion.div>

          {/* Right regions */}
          <div className="space-y-4">
            {EXPORT_REGIONS.slice(2).map((region, i) => (
              <motion.div
                key={region.name}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="bg-[#F8FAF8] rounded-2xl p-6 border border-gray-100"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-3 h-3 rounded-full bg-[#1D6F42]" />
                  <h3 className="font-bold text-[#114A2C] font-[Poppins]">
                    {region.name}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {region.countries.map((c) => (
                    <span
                      key={c}
                      className="flex items-center gap-1.5 text-xs bg-white border border-gray-200 text-gray-600 px-3 py-1 rounded-full"
                    >
                      <MapPin size={10} className="text-[#1D6F42]" />
                      {c}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
