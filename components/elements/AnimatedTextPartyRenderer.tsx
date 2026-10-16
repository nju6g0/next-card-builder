"use client";

import { motion } from "motion/react";
import type { AnimatedTextPartyElement } from "@/types";

interface AnimatedTextPartyRendererProps {
  element: AnimatedTextPartyElement;
  isSelected: boolean;
}

export default function AnimatedTextPartyRenderer({
  element,
  isSelected,
}: AnimatedTextPartyRendererProps) {
  const textStyle = {
    fontSize: element.fontSize,
    fontFamily: element.fontFamily,
    color: element.color,
    fontWeight: element.fontWeight,
    lineHeight: 1.4,
  } as React.CSSProperties;

  const content = element.content || "雙擊編輯文字";

  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden">
      <div
        className="text-center px-2 break-words"
        style={textStyle}
      >
        {content.split("").map((char, index) =>
          char === " " ? (
            <span key={`${element.id}-char-${index}`}> </span>
          ) : (
            <motion.span
              key={`${element.id}-char-${index}`}
              className="inline-block"
              initial={{ y: 50, rotate: 100 }}
              animate={{ y: 0, rotate: 0 }}
              transition={{
                duration: 0.6,
                delay: element.animationDelay + index * element.charStaggerDelay,
                ease: "easeOut",
              }}
            >
              {char}
            </motion.span>
          )
        )}
      </div>
    </div>
  );
}
