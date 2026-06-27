"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

const values = [
  { name: "Quality", desc: "Export-grade standards on every shipment" },
  { name: "Integrity", desc: "Transparent pricing and honest communication" },
  { name: "Reliability", desc: "Consistent supply and on-time delivery" },
  { name: "Sustainability", desc: "Responsible farming and ethical sourcing" },
  { name: "Customer Satisfaction", desc: "Long-term partnerships over one-time transactions" },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Image Column */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden aspect-[4/5] max-w-md mx-auto lg:mx-0">
              <Image
                src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=90"
                alt="KL TRADERS farm sourcing in Tamil Nadu"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 500px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#114A2C]/40 to-transparent" />
            </div>

            {/* Floating card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="absolute -bottom-6 -right-6 lg:right-0 bg-white rounded-2xl p-5 shadow-xl border border-gray-100 max-w-[220px]"
            >
              <div className="text-4xl font-bold text-[#1D6F42] font-[Poppins]">
                8+
              </div>
              <div className="text-sm text-gray-600 mt-1 leading-snug">
                Years connecting Indian farms to global markets
              </div>
            </motion.div>

            {/* Green accent block */}
            <div className="absolute -top-6 -left-6 w-24 h-24 rounded-2xl bg-[#E8F5E9] -z-10" />
          </motion.div>

          {/* Content Column */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[#1D6F42] font-semibold text-sm tracking-widest uppercase">
              About KL TRADERS
            </span>

            <h2 className="mt-4 text-4xl lg:text-5xl font-bold text-[#114A2C] tracking-tight leading-tight">
              Bridging Tamil Nadu
              <br />
              Farms to the World
            </h2>

            {/* Mission */}
            <div className="mt-8 p-6 bg-[#F8FAF8] rounded-2xl border-l-4 border-[#1D6F42]">
              <div className="text-xs font-bold tracking-widest uppercase text-[#1D6F42] mb-2">
                Our Mission
              </div>
              <p className="text-[#2D3748] leading-relaxed">
                To connect Indian agricultural producers with international
                markets through quality products and dependable service - creating
                lasting value for farmers, buyers, and communities.
              </p>
            </div>

            {/* Vision */}
            <div className="mt-4 p-6 bg-[#F8FAF8] rounded-2xl">
              <div className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">
                Our Vision
              </div>
              <p className="text-[#2D3748] leading-relaxed">
                To become a trusted global supplier of premium agricultural
                products, recognized for quality, transparency, and long-term
                partnerships across continents.
              </p>
            </div>

            {/* Values */}
            <div className="mt-8">
              <div className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-5">
                Our Core Values
              </div>
              <div className="space-y-3">
                {values.map((value, i) => (
                  <motion.div
                    key={value.name}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-[#1D6F42] mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-[#114A2C]">
                        {value.name}
                      </span>{" "}
                      <span className="text-gray-500 text-sm">- {value.desc}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
