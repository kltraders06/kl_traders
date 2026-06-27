"use client";

import { motion } from "framer-motion";
import { Leaf, Mail, Phone, MapPin, X, Share2, Globe, Send } from "lucide-react";
import { SITE_CONFIG, NAV_LINKS } from "@/constants";

const quickLinks = [
  { label: "Coriander Leaves", href: "#products" },
  { label: "Curry Leaves", href: "#products" },
  { label: "Export Process", href: "#export-process" },
  { label: "Gallery", href: "#gallery" },
];

const exportInfo = [
  "APEDA Certified Exporter",
  "EU Phytosanitary Compliant",
  "GCC Import Ready",
  "Full Documentation Provided",
  "Air & Sea Freight",
];

export default function Footer() {
  const handleNav = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-[#0A2E1A] text-white">
      <div className="border-b border-white/10">
        <div className="w-full max-w-[1440px] mx-auto px-5 sm:px-6 xl:px-10 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <h3 className="text-xl font-bold font-[Poppins] mb-1">
                Stay Updated on Our Products
              </h3>
              <p className="text-green-300 text-sm">
                Get seasonal availability updates and export news.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-72 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 text-sm focus:outline-none focus:border-white/40"
              />
              <button className="bg-[#1D6F42] hover:bg-[#25a85a] text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors duration-300 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1440px] mx-auto px-5 sm:px-6 xl:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.2fr_0.9fr_1fr_1.15fr] gap-10 xl:gap-12">
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-lg bg-[#1D6F42] flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" fill="white" />
              </div>
              <div>
                <div className="font-bold text-xl font-[Poppins]">
                  KL TRADERS
                </div>
                <div className="text-[10px] text-green-400 tracking-widest uppercase">
                  Agricultural Exports
                </div>
              </div>
            </div>
            <p className="text-green-200/75 text-sm leading-relaxed mb-6">
              Premium agricultural exports from Tamil Nadu, India. Connecting
              trusted Indian farms with global importers since 2016.
            </p>
            <div className="flex gap-3">
              {[Share2, Globe, Send, X].map((Icon, i) => (
                <button
                  key={i}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#1D6F42] flex items-center justify-center transition-colors duration-300"
                  aria-label="Social media"
                >
                  <Icon size={16} className="text-green-300" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-sm tracking-widest uppercase text-green-400 mb-5">
              Products
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleNav(link.href)}
                    className="text-green-200/75 hover:text-white text-sm transition-colors duration-200 text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>

            <h4 className="font-bold text-sm tracking-widest uppercase text-green-400 mb-5 mt-8">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {NAV_LINKS.slice(0, 4).map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => handleNav(link.href)}
                    className="text-green-200/75 hover:text-white text-sm transition-colors duration-200 text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm tracking-widest uppercase text-green-400 mb-5">
              Export Information
            </h4>
            <ul className="space-y-3">
              {exportInfo.map((info) => (
                <li
                  key={info}
                  className="flex items-start gap-2 text-green-200/75 text-sm"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#1D6F42] flex-shrink-0 mt-2" />
                  <span>{info}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm tracking-widest uppercase text-green-400 mb-5">
              Contact Us
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-[#1D6F42] mt-0.5 flex-shrink-0" />
                <span className="text-green-200/75 text-sm">{SITE_CONFIG.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-[#1D6F42] flex-shrink-0" />
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="text-green-200/75 hover:text-white text-sm transition-colors break-all"
                >
                  {SITE_CONFIG.email}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-[#1D6F42] flex-shrink-0" />
                <a
                  href={`tel:${SITE_CONFIG.whatsapp}`}
                  className="text-green-200/75 hover:text-white text-sm transition-colors"
                >
                  {SITE_CONFIG.phone}
                </a>
              </div>
            </div>

            <motion.button
              onClick={() => handleNav("#contact")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-6 w-full bg-[#1D6F42] hover:bg-[#25a85a] text-white py-3 rounded-xl font-semibold text-sm transition-colors duration-300"
            >
              Request a Quote
            </motion.button>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="w-full max-w-[1440px] mx-auto px-5 sm:px-6 xl:px-10 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-green-200/55 text-center md:text-left">
          <p>Copyright {new Date().getFullYear()} KL TRADERS. All rights reserved. Tamil Nadu, India.</p>
          <p>Premium Agricultural Exports - Worldwide Shipping</p>
        </div>
      </div>
    </footer>
  );
}
