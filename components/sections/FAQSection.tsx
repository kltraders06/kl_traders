"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import SectionShell from "@/components/SectionShell";
import { FAQ_ITEMS } from "@/constants";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <SectionShell className="bg-[#F8FAF8]" innerClassName="max-w-[920px] px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-10 text-center"
      >
        <span className="text-sm font-semibold uppercase tracking-widest text-[#1D6F42]">
          Frequently Asked Questions
        </span>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#114A2C] sm:text-4xl">
          Common buyer questions
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-600">
          Practical answers about ordering, packaging, shipping, and export
          documentation.
        </p>
      </motion.div>

      <div className="space-y-3">
        {FAQ_ITEMS.map((item, i) => (
          <motion.div
            key={item.q}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04, duration: 0.4 }}
            className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
              aria-expanded={openIndex === i}
            >
              <span className="min-w-0 text-sm font-bold leading-6 text-[#114A2C] sm:text-base">
                {item.q}
              </span>
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#E8F5E9] text-[#1D6F42]">
                {openIndex === i ? <Minus size={14} /> : <Plus size={14} />}
              </span>
            </button>
            <AnimatePresence>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 sm:px-6">
                    <div className="mb-4 h-px bg-gray-100" />
                    <p className="text-sm leading-7 text-gray-600">{item.a}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </SectionShell>
  );
}
