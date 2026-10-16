"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface FormFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  textColor: string;
}

const FormField = ({
  label,
  type,
  value,
  onChange,
  textColor,
}: FormFieldProps) => (
  <div className="w-full flex justify-between items-center">
    <label
      htmlFor="email"
      className="text-sm font-medium"
      style={{ color: textColor }}
    >
      {label}
    </label>
    <input
      className="flex-1 px-2 bg-transparent placeholder:text-white/50 border-b focus:outline-none focus:ring-1 focus:ring-amber-100"
      style={{ borderColor: `${textColor}30` }}
      type={type}
      placeholder=""
      value={value}
      onChange={onChange}
    />
  </div>
);

interface WeddingPreviewProps {
  userValues: Record<string, any>;
  isPlaying?: boolean;
}

export default function WeddingPreview({
  userValues,
  isPlaying = true,
}: WeddingPreviewProps) {
  const [scales, setScales] = useState({ scaleX: 1, scaleY: 1 });
  const [initialSize, setInitialSize] = useState({ width: 0, height: 0 });
  const [showArch, setShowArch] = useState(true);
  const [formData, setFormData] = useState({ email: "", name: "" });
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [key, setKey] = useState(0);

  // 從 userValues 獲取值
  const titleText = userValues.titleText || "We're Getting Married!";
  const descriptionText =
    userValues.descriptionText || "Lorem ipsum dolor sit...";
  const textColor = userValues.textColor || "#ffffff";
  const formBgColor = userValues.formBgColor || "#fffbeb";
  const formTextColor = userValues.formTextColor || "#134e4a";
  const buttonBgColor = userValues.buttonBgColor || "#ffffff";
  const buttonTextColor = userValues.buttonTextColor || "#134e4a";
  const imageUrl =
    userValues.backgroundImage || "https://picsum.photos/800/600";

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

      const initialWidth = Math.round(width * 0.3);
      const initialHeight = Math.round((initialWidth * 4) / 3);

      setInitialSize({ width: initialWidth, height: initialHeight });

      const finalScaleX = width / initialWidth;
      const finalScaleY = height / initialHeight;

      setScales({ scaleX: finalScaleX, scaleY: finalScaleY });
    };

    updateImageSize();
  }, []);

  // 重新播放動畫
  useEffect(() => {
    if (isPlaying) {
      setShowArch(true);
      setRsvpSubmitted(false);
      setFormData({ email: "", name: "" });
      setKey((prev) => prev + 1);
    }
  }, [isPlaying]);

  return (
    <div
      key={key}
      className="relative h-full w-full overflow-hidden flex flex-col items-center justify-between bg-black backdrop-blur-md bg-cover bg-center bg-no-repeat p-10"
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
            <h1
              className="font-playfair font-semibold text-center text-4xl px-4 py-1 overflow-hidden drop-shadow-lg"
              style={{ color: textColor }}
            >
              {titleText.split("").map((char: string, index: number) =>
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
            <p
              className="text-center text-sm mt-2 px-4 py-1 max-w-3xl drop-shadow-lg"
              style={{ color: `${textColor}cc` }}
            >
              {descriptionText}
            </p>
          </div>
          {rsvpSubmitted ? (
            <p
              className="text-center text-sm mt-2 px-4 py-1 max-w-3xl drop-shadow-lg"
              style={{ color: `${textColor}cc` }}
            >
              Hi, {formData.name}! Thank you for your RSVP!
            </p>
          ) : (
            <form
              onSubmit={(e) => e.preventDefault()}
              className="w-full max-w-3xl flex flex-col items-center gap-4 p-6 rounded-lg shadow-lg backdrop-blur-md"
              style={{ backgroundColor: formBgColor }}
            >
              <FormField
                label="Enter your email to RSVP:"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                textColor={formTextColor}
              />
              <FormField
                label="Enter your name:"
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                textColor={formTextColor}
              />
              <button
                type="button"
                className="px-4 py-2 rounded-full hover:opacity-80 transition-opacity cursor-pointer shadow-2xl"
                style={{
                  backgroundColor: buttonBgColor,
                  color: buttonTextColor,
                }}
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
