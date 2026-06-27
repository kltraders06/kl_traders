"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Leaf, MessageCircle } from "lucide-react";
import { NAV_LINKS, SITE_CONFIG } from "@/constants";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNav = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-green-50"
            : "bg-transparent"
        }`}
      >
        <div className="w-full max-w-[1440px] mx-auto px-5 sm:px-6 xl:px-10">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.div
              className="flex items-center gap-2.5 cursor-pointer"
              onClick={() => handleNav("#home")}
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-9 h-9 rounded-lg bg-[#1D6F42] flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" fill="white" />
              </div>
              <div>
                <span
                  className={`font-bold text-xl tracking-tight font-[Poppins] transition-colors duration-300 ${
                    scrolled ? "text-[#114A2C]" : "text-white"
                  }`}
                >
                  KL TRADERS
                </span>
                <div
                  className={`text-[10px] font-medium tracking-widest uppercase transition-colors duration-300 ${
                    scrolled ? "text-[#1D6F42]" : "text-green-200"
                  }`}
                >
                  Agricultural Exports
                </div>
              </div>
            </motion.div>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNav(link.href)}
                  className={`text-sm font-medium tracking-wide transition-colors duration-300 hover:text-[#1D6F42] ${
                    scrolled ? "text-[#2D3748]" : "text-white/90"
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* CTA */}
            <div className="hidden lg:flex items-center gap-4">
              <motion.a
                href={`https://wa.me/${SITE_CONFIG.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-colors duration-300 ${
                  scrolled
                    ? "text-[#1D6F42] bg-[#E8F5E9]"
                    : "text-white bg-white/10 border border-white/20"
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </motion.a>
              <motion.button
                onClick={() => handleNav("#contact")}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="bg-[#1D6F42] hover:bg-[#114A2C] text-white px-6 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-colors duration-300 shadow-lg shadow-green-900/20"
              >
                Request Quote
              </motion.button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                scrolled ? "text-[#2D3748]" : "text-white"
              }`}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-20 left-0 right-0 z-40 bg-white border-b border-gray-100 shadow-xl lg:hidden"
          >
            <div className="px-5 sm:px-6 py-6 flex flex-col gap-5">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNav(link.href)}
                  className="text-left text-base font-medium text-[#2D3748] hover:text-[#1D6F42] transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => handleNav("#contact")}
                className="mt-2 bg-[#1D6F42] text-white py-3 rounded-full font-semibold text-sm"
              >
                Request a Quote
              </button>
              <a
                href={`https://wa.me/${SITE_CONFIG.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex justify-center items-center gap-2 bg-[#25D366] text-white py-3 rounded-full font-semibold text-sm"
              >
                <MessageCircle className="w-4 h-4" />
                Chat on WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
