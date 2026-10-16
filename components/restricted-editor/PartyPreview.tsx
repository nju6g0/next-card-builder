"use client";

import { motion } from "motion/react";
import { useState, useEffect } from "react";

interface PartyPreviewProps {
  userValues: Record<string, any>;
  isPlaying?: boolean;
}

export default function PartyPreview({
  userValues,
  isPlaying = true,
}: PartyPreviewProps) {
  const [key, setKey] = useState(0);

  // 從 userValues 獲取值
  const welcomeText = userValues.welcomeText || "Welcome";
  const partyText = userValues.partyText || "to the Party!";
  const introTextColor = userValues.introTextColor || "#000000";
  const imageUrl = userValues.backgroundImage || "https://picsum.photos/800/600";

  // 重新播放動畫
  useEffect(() => {
    if (isPlaying) {
      setKey((prev) => prev + 1);
    }
  }, [isPlaying]);

  return (
    <div
      key={key}
      className="relative w-full h-full overflow-hidden flex flex-col items-center justify-center"
    >
      <motion.div
        animate={{ height: 0, opacity: 0 }}
        transition={{ duration: 1, ease: "easeInOut", delay: 2.5 }}
      >
        <motion.h1
          initial={{ opacity: 0, y: -50, scale: 0.8, rotate: 0 }}
          animate={{
            opacity: [0, 1],
            y: [-50, 0],
            scale: [0.8, 1],
            rotate: [0, 15, 0],
          }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="font-playfair origin-left text-4xl font-bold text-center mb-4"
          style={{ color: introTextColor }}
        >
          {welcomeText}
        </motion.h1>
        <motion.h1
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{
            opacity: [0, 1],
            y: [20, 0],
            scale: [0.8, 1],
            rotate: [0, 5, 0],
          }}
          transition={{ duration: 1, delay: 1, ease: "easeInOut" }}
          className="font-playfair text-4xl font-bold text-center mb-4"
          style={{ color: introTextColor }}
        >
          {partyText}
        </motion.h1>
      </motion.div>
      <motion.div
        className="w-full h-full overflow-hidden bg-black backdrop:blur-md bg-cover bg-center bg-no-repeat"
        initial={{ width: 80, height: 80, opacity: 0.5, borderRadius: "50%" }}
        style={{ backgroundImage: `url('${imageUrl}')` }}
        animate={{
          width: [80, "100%"],
          height: [80, "100%"],
          opacity: 1,
          borderRadius: "0%",
        }}
        transition={{
          duration: 1,
          delay: 3,
          ease: "easeInOut",
          width: { delay: 3.5, duration: 1 },
          height: { delay: 4, duration: 1 },
        }}
      ></motion.div>
    </div>
  );
}
