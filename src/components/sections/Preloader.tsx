"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Logo } from "@/components/layout/Logo";

const STORAGE_KEY = "madia:preloaded";
const TOTAL_MS = 3500;

export function Preloader() {
  const [visible, setVisible] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return sessionStorage.getItem(STORAGE_KEY) !== "1";
  });

  useEffect(() => {
    if (!visible) return;
    const t = window.setTimeout(() => {
      sessionStorage.setItem(STORAGE_KEY, "1");
      setVisible(false);
    }, TOTAL_MS);
    return () => window.clearTimeout(t);
  }, [visible]);

  useEffect(() => {
    if (visible) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-bg-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } }}
          aria-hidden="true"
        >
          <div className="flex flex-col items-center gap-6">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { duration: 1.5, ease: [0.22, 1, 0.36, 1] }
              }}
            >
              <Logo variant="mark" size={72} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { delay: 0.3, duration: 1.4, ease: [0.22, 1, 0.36, 1] }
              }}
            >
              <span className="font-serif text-3xl tracking-[0.4em] text-text-primary font-light">
                MADIA
              </span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
