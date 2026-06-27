"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { TESTIMONIALS } from "@/constants";

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-[#F8FAF8]">
      <div className="w-full max-w-[1440px] mx-auto px-5 sm:px-6 xl:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#1D6F42] font-semibold text-sm tracking-widest uppercase">
            Client Testimonials
          </span>
          <h2 className="mt-3 text-4xl lg:text-5xl font-bold text-[#114A2C] tracking-tight">
            Trusted by Global Buyers
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-xl mx-auto">
            Hear from importers and distributors who rely on KL TRADERS for
            consistent, quality agricultural products.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-400 relative overflow-hidden group"
            >
              {/* Decorative quote */}
              <div className="absolute top-6 right-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Quote size={80} className="text-[#1D6F42]" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, si) => (
                  <Star
                    key={si}
                    size={16}
                    className="text-amber-400"
                    fill="#fbbf24"
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-[#2D3748] text-base leading-relaxed mb-6 relative">
                &ldquo;{t.text}&rdquo;
              </blockquote>

              {/* Attribution */}
              <div className="flex items-center gap-4">
                {/* Avatar placeholder */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1D6F42] to-[#114A2C] flex items-center justify-center text-white font-bold text-lg font-[Poppins] flex-shrink-0">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-[#114A2C] font-[Poppins]">
                    {t.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {t.role}, {t.company}
                  </div>
                  <div className="text-xs text-[#1D6F42] font-medium mt-0.5">
                    {t.flag} {t.country}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
