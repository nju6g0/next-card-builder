"use client";
import { motion } from "motion/react";

function WeddingTemplate() {
  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center">
      {/* bg-gradient-to-b from-pink-200 to-purple-100 */}
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
        >
          Welcome
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
        >
          to the Party!
        </motion.h1>
      </motion.div>
      <motion.div
        className="w-full h-full overflow-hidden bg-black backdrop:blur-md bg-cover bg-center bg-no-repeat"
        initial={{ width: 80, height: 80, opacity: 0.5, borderRadius: "50%" }}
        style={{ backgroundImage: "url('https://picsum.photos/800/600')" }}
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

export default WeddingTemplate;
