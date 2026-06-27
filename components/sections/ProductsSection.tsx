"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { PRODUCTS } from "@/constants";

export default function ProductsSection() {
  const handleContact = () => {
    const el = document.querySelector("#contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="products" className="py-20 lg:py-24 bg-[#F8FAF8]">
      <div className="w-full max-w-[1440px] mx-auto px-5 sm:px-6 xl:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 lg:mb-16"
        >
          <span className="text-[#1D6F42] font-semibold text-sm tracking-widest uppercase">
            Our Export Products
          </span>
          <h2 className="mt-3 text-4xl lg:text-5xl font-bold text-[#114A2C] tracking-tight">
            Premium Fresh Herbs
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Sourced directly from Tamil Nadu farms and prepared to the highest
            international export standards.
          </p>
        </motion.div>

        {/* Products */}
        <div className="space-y-10 lg:space-y-12">
          {PRODUCTS.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="bg-white rounded-[28px] overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-500"
            >
              <div
                className={`grid lg:grid-cols-2 ${
                  i % 2 === 1 ? "lg:grid-flow-dense" : ""
                }`}
              >
                {/* Image */}
                <div
                  className={`relative min-h-[320px] sm:min-h-[420px] lg:min-h-[640px] ${
                    i % 2 === 1 ? "lg:col-start-2" : ""
                  }`}
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#1D6F42]/30 to-transparent" />
                  <div className="absolute top-6 left-6">
                    <span className="bg-white/90 backdrop-blur text-[#1D6F42] text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full">
                      {product.subtitle}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8 lg:p-12 xl:p-14 flex flex-col justify-center">
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#114A2C] font-[Poppins] mb-4">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-8">
                    {product.description}
                  </p>

                  {/* Features */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                    {product.features.map((f) => (
                      <div key={f} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-[#1D6F42] flex-shrink-0" />
                        <span className="text-gray-700">{f}</span>
                      </div>
                    ))}
                  </div>

                  {/* Specs */}
                  <div className="bg-[#F8FAF8] rounded-2xl p-5 sm:p-6 mb-8 border border-gray-100">
                    <div className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-3">
                      Specifications
                    </div>
                    <div className="space-y-2">
                      {Object.entries(product.specs).map(([key, val]) => (
                        <div key={key} className="grid grid-cols-[120px_1fr] sm:grid-cols-[150px_1fr] gap-4 text-sm">
                          <span className="text-gray-500">{key}</span>
                          <span className="font-semibold text-[#2D3748] text-right">
                            {val}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Export countries */}
                  <div className="mb-8">
                    <div className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-3">
                      Currently Exporting To
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.exportCountries.map((c) => (
                        <span
                          key={c}
                          className="bg-[#E8F5E9] text-[#1D6F42] text-xs font-medium px-3 py-1 rounded-full"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <motion.button
                    onClick={handleContact}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group inline-flex items-center justify-center gap-2 bg-[#1D6F42] hover:bg-[#114A2C] text-white px-7 py-3.5 rounded-full font-semibold text-sm transition-colors duration-300 w-full sm:w-fit"
                  >
                    Inquire About {product.name.split(" ")[1]}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
