"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import SectionShell from "@/components/SectionShell";

const values = [
  "Export-grade quality control",
  "Direct Tamil Nadu farm sourcing",
  "Transparent pricing and documentation",
  "Reliable supply for repeat buyers",
];

export default function AboutSection() {
  return (
    <SectionShell id="about" className="bg-white">
      <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14 xl:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative mx-auto w-full max-w-xl lg:mx-0"
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#E8F5E9] shadow-sm">
            <Image
              src="/images/harvest/fresh-coriander-bundle-30.jpg"
              alt="Fresh coriander bunch sourced by KL TRADERS"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 48vw"
            />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-[#F8FAF8] p-4 text-center">
              <div className="font-[Poppins] text-2xl font-bold text-[#1D6F42]">8+</div>
              <div className="text-xs text-gray-500">Years</div>
            </div>
            <div className="rounded-2xl bg-[#F8FAF8] p-4 text-center">
              <div className="font-[Poppins] text-2xl font-bold text-[#1D6F42]">200+</div>
              <div className="text-xs text-gray-500">Farmers</div>
            </div>
            <div className="rounded-2xl bg-[#F8FAF8] p-4 text-center">
              <div className="font-[Poppins] text-2xl font-bold text-[#1D6F42]">15+</div>
              <div className="text-xs text-gray-500">Countries</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="min-w-0"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-[#1D6F42]">
            About KL TRADERS
          </span>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold leading-tight tracking-tight text-[#114A2C] sm:text-4xl lg:text-[44px]">
            Tamil Nadu farm produce prepared for international buyers.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-gray-600">
            KL TRADERS connects trusted farms with importers who need fresh
            coriander leaves and curry leaves with dependable quality,
            documentation, and shipment coordination.
          </p>

          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-gray-100 bg-[#F8FAF8] p-5">
              <div className="text-xs font-bold uppercase tracking-widest text-[#1D6F42]">
                Mission
              </div>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Build long-term trade relationships by supplying fresh,
                traceable produce with clear communication.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-[#F8FAF8] p-5">
              <div className="text-xs font-bold uppercase tracking-widest text-[#1D6F42]">
                Vision
              </div>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Become a trusted Indian herb export partner for buyers across
                the Middle East, Europe, and Asia.
              </p>
            </div>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {values.map((value) => (
              <div key={value} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#1D6F42]" />
                <span className="text-sm font-medium text-[#2D3748]">{value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </SectionShell>
  );
}
