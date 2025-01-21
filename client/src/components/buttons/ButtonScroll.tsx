"use client";
import React, { useEffect, useState } from "react";

// animations
import { motion } from "framer-motion";

import { FaChevronUp } from "react-icons/fa";

const ButtonScroll = () => {
  const [showButton, setShowButton] = useState<boolean>(false);
  useEffect(() => {
    const handleScroll = (): void => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const pageHeight = document.documentElement.scrollHeight;
      setShowButton(scrollPosition >= pageHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = (): void => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: {
          delay: 1,
          duration: 0.9,
          ease: "easeInOut",
        },
      }}
      className={`${
        showButton
          ? "opacity-100 visible translate-x-0"
          : "opacity-0 invisible translate-x-[20px]"
      } fixed bottom-[15px] right-[10px] transition-all p-3 rounded-full text-2xl bg-accent
      text-black shadow-md hover:bg-accent-hover focus:outline-none focus:ring-2
       focus:ring-accent-hover focus:ring-opacity-50 flex flex-col items-center justify-center`}
      type="button"
      onClick={scrollToTop}
    >
      <FaChevronUp />
    </motion.button>
  );
};

export default ButtonScroll;
