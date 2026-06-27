"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { SITE_CONFIG } from "@/constants";

export default function WhatsAppButton() {
  const waNumber = SITE_CONFIG.whatsapp.replace(/\D/g, "");
  const message = encodeURIComponent(
    "Hello KL TRADERS, I'm interested in importing your agricultural products. Could you please provide more information?"
  );

  return (
    <motion.a
      href={`https://wa.me/${waNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2, duration: 0.4, type: "spring" }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full shadow-xl shadow-green-900/30 flex items-center justify-center group"
      aria-label="Chat on WhatsApp"
    >
      {/* Pulse ring */}
      <span className="absolute w-14 h-14 rounded-full bg-[#25D366] animate-ping opacity-30" />
      <MessageCircle
        className="w-7 h-7 text-white relative z-10"
        fill="white"
      />

      {/* Tooltip */}
      <span className="absolute right-16 bg-[#2D3748] text-white text-xs font-medium px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        Chat on WhatsApp
        <span className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-[#2D3748] rotate-45" />
      </span>
    </motion.a>
  );
}
