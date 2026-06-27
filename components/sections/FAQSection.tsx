"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { FAQ_ITEMS } from "@/constants";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-[#F8FAF8]">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-[#1D6F42] font-semibold text-sm tracking-widest uppercase">
            Frequently Asked Questions
          </span>
          <h2 className="mt-3 text-4xl lg:text-5xl font-bold text-[#114A2C] tracking-tight">
            Common Questions
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-xl mx-auto">
            Everything you need to know before placing your first order with us.
          </p>
        </motion.div>

        <div className="space-y-4">
          {FAQ_ITEMS.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              className={`bg-white rounded-2xl border transition-all duration-300 ${
                openIndex === i
                  ? "border-[#1D6F42]/30 shadow-md"
                  : "border-gray-100 hover:border-gray-200"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full text-left px-7 py-6 flex items-center justify-between gap-4"
                aria-expanded={openIndex === i}
              >
                <span className="font-semibold text-[#114A2C] text-base leading-snug font-[Poppins]">
                  {item.q}
                </span>
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                    openIndex === i
                      ? "bg-[#1D6F42] text-white"
                      : "bg-[#E8F5E9] text-[#1D6F42]"
                  }`}
                >
                  {openIndex === i ? <Minus size={14} /> : <Plus size={14} />}
                </div>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-7 pb-6">
                      <div className="h-px bg-gray-100 mb-5" />
                      <p className="text-gray-600 leading-relaxed">{item.a}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Still have questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 bg-[#E8F5E9] rounded-2xl p-8 text-center"
        >
          <h3 className="text-lg font-bold text-[#114A2C] mb-2 font-[Poppins]">
            Still have questions?
          </h3>
          <p className="text-gray-600 text-sm mb-5">
            Our export team is ready to help you with any queries about ordering,
            shipping, or compliance.
          </p>
          <button
            onClick={() => {
              const el = document.querySelector("#contact");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="bg-[#1D6F42] text-white px-7 py-3 rounded-full font-semibold text-sm hover:bg-[#114A2C] transition-colors"
          >
            Contact Our Team
          </button>
        </motion.div>
      </div>
    </section>
  );
}
