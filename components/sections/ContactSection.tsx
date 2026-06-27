"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import {
  MapPin,
  Mail,
  Phone,
  Clock,
  MessageCircle,
  CheckCircle2,
  Send,
  AlertCircle,
  Hash,
} from "lucide-react";
import { SITE_CONFIG } from "@/constants";
import type { ContactFormData, InquiryType, PreferredComm } from "@/types";

type FormStatus = "idle" | "loading" | "success" | "error";

const INQUIRY_TYPES: InquiryType[] = [
  "Import Products",
  "Export Products",
  "Distribution Partnership",
  "Bulk Purchase",
  "General Inquiry",
];

const PREFERRED_COMM: PreferredComm[] = ["Email", "WhatsApp", "Both"];

export default function ContactSection() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [submittedId, setSubmittedId] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    defaultValues: { preferredComm: "Email", inquiryType: "Import Products" },
  });

  const onSubmit = async (data: ContactFormData) => {
    setStatus("loading");
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error);
      setSubmittedId(json.data.inquiry_id);
      setStatus("success");
      reset();
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#2D3748] placeholder-gray-400 transition-all duration-200 focus:border-[#1D6F42] focus:outline-none focus:ring-2 focus:ring-[#1D6F42]/30";
  const labelClass = "block text-sm font-semibold text-[#2D3748] mb-1.5";
  const errClass = "text-red-500 text-xs mt-1 flex items-center gap-1";

  const contactItems = [
    { icon: MapPin, label: "Address", value: SITE_CONFIG.address },
    { icon: Mail, label: "Email", value: SITE_CONFIG.email, href: `mailto:${SITE_CONFIG.email}` },
    { icon: Phone, label: "Phone", value: SITE_CONFIG.phone, href: `tel:${SITE_CONFIG.whatsapp}` },
    { icon: MessageCircle, label: "WhatsApp", value: SITE_CONFIG.phone, href: `https://wa.me/${SITE_CONFIG.whatsapp.replace(/\D/g, "")}` },
    { icon: Clock, label: "Working Hours", value: SITE_CONFIG.workingHours },
  ];

  return (
    <section id="contact" className="py-20 lg:py-24 bg-white">
      <div className="w-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 lg:mb-16"
        >
          <span className="text-[#1D6F42] font-semibold text-sm tracking-widest uppercase">
            Get in Touch
          </span>
          <h2 className="mt-3 text-4xl lg:text-5xl font-bold text-[#114A2C] tracking-tight">
            Request a Quote
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Submit your requirements and our export team will respond within one
            business day with a tailored proposal.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[0.9fr_1.35fr] gap-10 lg:gap-14 xl:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-6 lg:sticky lg:top-28"
          >
            <div>
              <h3 className="text-2xl font-bold text-[#114A2C] font-[Poppins]">
                Contact Information
              </h3>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                For pricing, availability, and export documentation, reach us
                directly or send a detailed inquiry through the form.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {contactItems.map((item) => {
                const Icon = item.icon;
                const inner = (
                  <div className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-[#F8FAF8] p-4">
                    <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-[#1D6F42]" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">
                        {item.label}
                      </div>
                      <div className="text-[#2D3748] font-medium text-sm break-words">
                        {item.value}
                      </div>
                    </div>
                  </div>
                );
                return "href" in item ? (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href?.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="block transition-opacity hover:opacity-80"
                  >
                    {inner}
                  </a>
                ) : (
                  <div key={item.label}>{inner}</div>
                );
              })}
            </div>

            <a
              href={`https://wa.me/${SITE_CONFIG.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent("Hello KL TRADERS, I'm interested in your export products. Please share details.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-6 py-4 rounded-2xl font-semibold transition-colors duration-300 shadow-lg shadow-green-900/20"
            >
              <MessageCircle className="w-5 h-5" fill="white" />
              Chat on WhatsApp Now
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="min-w-0"
          >
            <div className="bg-[#F8FAF8] rounded-[28px] p-5 sm:p-8 lg:p-10 border border-gray-100 shadow-sm">
              <AnimatePresence mode="wait">
                {status === "success" && (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center py-12">
                    <div className="w-20 h-20 bg-[#E8F5E9] rounded-full flex items-center justify-center mx-auto mb-5">
                      <CheckCircle2 className="w-10 h-10 text-[#1D6F42]" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#114A2C] mb-2 font-[Poppins]">Inquiry Submitted!</h3>
                    <p className="text-gray-500 mb-4">Your inquiry has been received and logged.</p>
                    {submittedId && (
                      <div className="inline-flex flex-wrap items-center justify-center gap-2 bg-white border border-[#1D6F42]/20 rounded-xl px-5 py-3 mb-6">
                        <Hash className="w-4 h-4 text-[#1D6F42]" />
                        <span className="text-sm text-gray-500">Your Inquiry ID:</span>
                        <code className="font-mono font-bold text-[#1D6F42] text-base">{submittedId}</code>
                      </div>
                    )}
                    <p className="text-gray-500 text-sm max-w-xs mx-auto">
                      Our team will contact you within one business day via your preferred channel.
                    </p>
                    <button onClick={() => setStatus("idle")} className="mt-6 text-sm text-[#1D6F42] underline underline-offset-2 hover:opacity-75">
                      Submit another inquiry
                    </button>
                  </motion.div>
                )}

                {status === "error" && (
                  <motion.div key="error" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center py-12">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
                      <AlertCircle className="w-10 h-10 text-red-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#114A2C] mb-2 font-[Poppins]">Something went wrong</h3>
                    <p className="text-gray-500 mb-6 max-w-xs mx-auto">Please try again or reach us directly via WhatsApp.</p>
                    <button onClick={() => setStatus("idle")} className="bg-[#1D6F42] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#114A2C] transition-colors">
                      Try Again
                    </button>
                  </motion.div>
                )}

                {(status === "idle" || status === "loading") && (
                  <motion.form key="form" onSubmit={handleSubmit(onSubmit)} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className={labelClass}>Full Name <span className="text-red-400">*</span></label>
                        <input {...register("fullName", { required: "Required" })} placeholder="John Smith" className={inputClass} />
                        {errors.fullName && <p className={errClass}><AlertCircle size={11} />{errors.fullName.message}</p>}
                      </div>

                      <div>
                        <label className={labelClass}>Company Name <span className="text-red-400">*</span></label>
                        <input {...register("companyName", { required: "Required" })} placeholder="Al Rashidi Trading LLC" className={inputClass} />
                        {errors.companyName && <p className={errClass}><AlertCircle size={11} />{errors.companyName.message}</p>}
                      </div>

                      <div>
                        <label className={labelClass}>Country <span className="text-red-400">*</span></label>
                        <input {...register("country", { required: "Required" })} placeholder="United Arab Emirates" className={inputClass} />
                        {errors.country && <p className={errClass}><AlertCircle size={11} />{errors.country.message}</p>}
                      </div>

                      <div>
                        <label className={labelClass}>Email Address <span className="text-red-400">*</span></label>
                        <input {...register("email", { required: "Required", pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" } })} type="email" placeholder="john@company.com" className={inputClass} />
                        {errors.email && <p className={errClass}><AlertCircle size={11} />{errors.email.message}</p>}
                      </div>

                      <div>
                        <label className={labelClass}>WhatsApp Number</label>
                        <input {...register("whatsapp")} placeholder="+971 50 123 4567" className={inputClass} />
                      </div>

                      <div>
                        <label className={labelClass}>Product of Interest <span className="text-red-400">*</span></label>
                        <select {...register("product", { required: "Required" })} className={inputClass}>
                          <option value="">Select product...</option>
                          <option>Fresh Coriander Leaves</option>
                          <option>Fresh Curry Leaves</option>
                          <option>Both Products</option>
                          <option>Other / To Be Discussed</option>
                        </select>
                        {errors.product && <p className={errClass}><AlertCircle size={11} />{errors.product.message}</p>}
                      </div>

                      <div>
                        <label className={labelClass}>Quantity Required</label>
                        <input {...register("quantity")} placeholder="e.g. 500 kg / week" className={inputClass} />
                      </div>

                      <div>
                        <label className={labelClass}>Inquiry Type <span className="text-red-400">*</span></label>
                        <select {...register("inquiryType", { required: "Required" })} className={inputClass}>
                          {INQUIRY_TYPES.map((t) => <option key={t}>{t}</option>)}
                        </select>
                        {errors.inquiryType && <p className={errClass}><AlertCircle size={11} />{errors.inquiryType.message}</p>}
                      </div>
                    </div>

                    <div className="mt-5">
                      <label className={labelClass}>Preferred Communication <span className="text-red-400">*</span></label>
                      <div className="flex gap-4 flex-wrap">
                        {PREFERRED_COMM.map((opt) => (
                          <label key={opt} className="flex items-center gap-2 cursor-pointer">
                            <input {...register("preferredComm")} type="radio" value={opt} className="accent-[#1D6F42] w-4 h-4" />
                            <span className="text-sm text-[#2D3748]">{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5">
                      <label className={labelClass}>Additional Requirements</label>
                      <textarea {...register("message")} rows={4} placeholder="Destination port, packaging preferences, certifications needed, delivery timeline..." className={`${inputClass} resize-none`} />
                    </div>

                    <motion.button
                      type="submit"
                      disabled={status === "loading"}
                      whileHover={{ scale: status === "loading" ? 1 : 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="mt-6 w-full bg-[#1D6F42] hover:bg-[#114A2C] disabled:opacity-70 text-white py-4 rounded-xl font-semibold text-base transition-colors flex items-center justify-center gap-3 shadow-lg shadow-green-900/20"
                    >
                      {status === "loading" ? (
                        <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Submitting...</>
                      ) : (
                        <><Send className="w-5 h-5" />Submit Inquiry</>
                      )}
                    </motion.button>

                    <p className="text-center text-xs text-gray-400 mt-3">
                      You will receive a unique Inquiry ID upon submission. We never share your data.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
