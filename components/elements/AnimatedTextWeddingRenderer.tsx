"use client";

import { motion } from "motion/react";
import type { AnimatedTextWeddingElement } from "@/types";

interface AnimatedTextWeddingRendererProps {
  element: AnimatedTextWeddingElement;
  isSelected: boolean;
}

export default function AnimatedTextWeddingRenderer({
  element,
  isSelected,
}: AnimatedTextWeddingRendererProps) {
  const textStyle = {
    fontSize: element.fontSize,
    fontFamily: element.fontFamily,
    color: element.color,
    fontWeight: element.fontWeight,
    lineHeight: 1.4,
  } as React.CSSProperties;

  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.8, rotate: 15 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          rotate: 0,
        }}
        transition={{
          duration: 1,
          delay: element.animationDelay,
          ease: "easeInOut",
        }}
        className="w-full text-center px-2 break-words whitespace-pre-wrap"
        style={textStyle}
      >
        {element.content || "雙擊編輯文字"}
      </motion.div>
    </div>
  );
}
