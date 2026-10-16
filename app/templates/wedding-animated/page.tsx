"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

const TEXT = "We're Getting Married!";
const imageUrl = "https://picsum.photos/800/600";

interface FormFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const FormField = ({ label, type, value, onChange }: FormFieldProps) => (
  <div className="w-full flex justify-between items-center">
    <label htmlFor="email" className="text-teal-950 text-sm font-medium">
      {label}
    </label>
    <input
      className="flex-1 px-2 bg-transparent placeholder:text-white/50 border-b border-teal-950/30 focus:outline-none focus:ring-1 focus:ring-amber-100"
      type={type}
      placeholder=""
      value={value}
      onChange={onChange}
    />
  </div>
);
export default function Party() {
  const [scales, setScales] = useState({ scaleX: 1, scaleY: 1 });
  const [initialSize, setInitialSize] = useState({ width: 0, height: 0 });
  const [showArch, setShowArch] = useState(true);
  const [formData, setFormData] = useState({ email: "", name: "" });
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  const handleRSVP = () => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(formData.email)) {
      alert("Please enter a valid email address.");
      return;
    }
    if (formData.name.trim() === "") {
      alert("Please enter your name.");
      return;
    }
    console.log("RSVP submitted:", formData);
    setRsvpSubmitted(true);
  };

  useEffect(() => {
    const updateImageSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // 計算初始拱門尺寸（視窗寬度的 30%）
      const initialWidth = Math.round(width * 0.3);
      const initialHeight = Math.round((initialWidth * 4) / 3);

      setInitialSize({ width: initialWidth, height: initialHeight });

      // 計算最終需要的 scale（基於實際初始尺寸）
      const finalScaleX = width / initialWidth;
      const finalScaleY = height / initialHeight;

      setScales({ scaleX: finalScaleX, scaleY: finalScaleY });
    };

    updateImageSize();

    // window.addEventListener("resize", updateImageSize);

    // return () => window.removeEventListener("resize", updateImageSize);
  }, []);

  return (
    <div
      className="relative h-screen overflow-hidden flex flex-col items-center justify-between bg-black backdrop-blur-md bg-cover bg-center bg-no-repeat p-10"
      style={{
        backgroundImage: showArch ? "none" : `url(${imageUrl})`,
      }}
    >
      {showArch && initialSize.width > 0 && (
        <motion.div
          className="absolute bottom-0 left-1/2 origin-bottom rounded-t-full bg-white bg-cover bg-center bg-no-repeat overflow-hidden outline-1 outline-offset-4 outline-white/70"
          style={{
            width: `${initialSize.width}px`,
            height: `${initialSize.height}px`,
            backgroundImage: `url(${imageUrl})`,
          }}
          initial={{
            x: "-50%",
            y: "100%",
            scaleX: 1,
            scaleY: 1,
            borderRadius: "500px 500px 0 0",
          }}
          animate={{
            y: ["100%", "0%", "0%", "0%"],
            scaleX: [1, 1, 2, scales.scaleX],
            scaleY: [1, 1, 2, scales.scaleY],
            borderRadius: [
              "500px 500px 0 0",
              "500px 500px 0 0",
              "500px 500px 0 0",
              "0px 0px 0 0",
            ],
          }}
          transition={{
            duration: 2,
            times: [0, 0.4, 0.8, 1],
            ease: "easeInOut",
          }}
          onAnimationComplete={() => {
            setShowArch(false);
          }}
        />
      )}
      {!showArch && (
        <>
          <div />
          <div>
            <h1 className="font-playfair font-semibold text-center text-4xl px-4 py-1 overflow-hidden text-white drop-shadow-lg">
              {TEXT.split("").map((char, index) =>
                char === " " ? (
                  <span key={char + index}> </span>
                ) : (
                  <motion.span
                    className="inline-block"
                    style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
                    key={char + index}
                    initial={{ y: 50, rotate: 100 }}
                    animate={{ y: 0, rotate: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.1,
                    }}
                  >
                    {char}
                  </motion.span>
                ),
              )}
            </h1>
            <p className="text-center text-white/80 text-sm mt-2 px-4 py-1 max-w-3xl drop-shadow-lg">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              Accusantium sed qui odit? Ipsa atque nesciunt perspiciatis
              placeat, doloremque fugit consectetur.
            </p>
          </div>
          {rsvpSubmitted ? (
            <p className="text-center text-white/80 text-sm mt-2 px-4 py-1 max-w-3xl drop-shadow-lg">
              Hi, {formData.name}! Thank you for your RSVP!
            </p>
          ) : (
            <form
              onSubmit={(e) => e.preventDefault()}
              className="w-full max-w-3xl flex flex-col items-center gap-4 bg-amber-50 p-6 rounded-lg shadow-lg backdrop-blur-md"
            >
              <FormField
                label="Enter your email to RSVP:"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <FormField
                label="Enter your name:"
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <button
                type="button"
                className="bg-white text-teal-950 px-4 py-2 rounded-full hover:bg-gray-200 transition-colors cursor-pointer shadow-2xl"
                onClick={handleRSVP}
              >
                Submit
              </button>
            </form>
          )}
        </>
      )}
    </div>
  );
}
