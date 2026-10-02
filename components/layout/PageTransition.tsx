"use client";

import { motion } from "motion/react";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * 頁面轉場動畫元件
 * 使用 Framer Motion 實作淡入效果
 */
export default function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}
