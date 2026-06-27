"use client";
import { useState, useEffect } from "react";

export function useScrolled(threshold = 50) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > threshold);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return scrolled;
}

export function useIntersectionObserver(threshold = 0.1) {
  const [isVisible, setIsVisible] = useState(false);

  return { isVisible, setIsVisible };
}
