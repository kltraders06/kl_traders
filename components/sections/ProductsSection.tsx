"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import SectionShell from "@/components/SectionShell";
import { PRODUCTS } from "@/constants";

export default function ProductsSection() {
  const handleContact = () => {
    const el = document.querySelector("#contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <SectionShell id="products" className="bg-[#F8FAF8]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto mb-12 max-w-3xl text-center"
      >
        <span className="text-sm font-semibold uppercase tracking-widest text-[#1D6F42]">
          Our Export Products
        </span>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#114A2C] sm:text-4xl lg:text-[44px]">
          Fresh herbs for global importers
        </h2>
        <p className="mt-4 text-base leading-7 text-gray-600">
          Real farm produce, selected and prepared for repeat export buyers.
        </p>
      </motion.div>

      <div className="space-y-8">
        {PRODUCTS.map((product, i) => (
          <motion.article
            key={product.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: i * 0.08 }}
            className="min-w-0 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm"
          >
            <div className={`grid min-w-0 lg:grid-cols-[0.44fr_minmax(0,0.56fr)] ${i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}>
              <div className="relative min-h-[260px] overflow-hidden bg-[#E8F5E9] sm:min-h-[340px] lg:min-h-[520px]">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute left-5 top-5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-[#1D6F42] shadow-sm">
                  {product.subtitle}
                </div>
              </div>

              <div className="min-w-0 p-5 sm:p-7 lg:p-10 xl:p-12">
                <h3 className="text-2xl font-bold text-[#114A2C] sm:text-3xl lg:text-[34px]">
                  {product.name}
                </h3>
                <p className="mt-3 text-sm leading-6 text-gray-600 sm:text-base lg:leading-7">
                  {product.description}
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {product.features.map((f) => (
                    <div key={f} className="flex min-w-0 items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-[#1D6F42]" />
                      <span className="min-w-0 break-words text-gray-700">{f}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl border border-gray-100 bg-[#F8FAF8] p-5">
                  <div className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Specifications
                  </div>
                  <dl className="mt-3 grid gap-2 text-sm">
                    {Object.entries(product.specs).map(([key, val]) => (
                      <div key={key} className="grid grid-cols-1 gap-1 sm:grid-cols-[150px_minmax(0,1fr)]">
                        <dt className="text-gray-500">{key}</dt>
                        <dd className="min-w-0 break-words font-semibold text-[#2D3748] sm:text-right">
                          {val}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className="mt-6">
                  <div className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Country Availability
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {product.exportCountries.map((c) => (
                      <span
                        key={c}
                        className="rounded-full bg-[#E8F5E9] px-3 py-1 text-xs font-medium text-[#1D6F42]"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleContact}
                  className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1D6F42] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#114A2C] sm:w-auto"
                >
                  Request Quote
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </SectionShell>
  );
}
