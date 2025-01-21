"use client";
import Link from "next/link";
import React from "react";

// animations
import { motion } from "framer-motion";

// icons
import {
  FaFacebook,
  FaEnvelope,
  FaLinkedin,
  FaInstagram,
} from "react-icons/fa";

const icons = [
  { icon: <FaFacebook />, path: "/facebook" },
  { icon: <FaEnvelope />, path: "/email" },
  { icon: <FaLinkedin />, path: "/linked-in" },
  { icon: <FaInstagram />, path: "/instagram" },
];

const SocialIcons = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: {
          delay: 0.4,
          duration: 0.6,
          ease: "easeIn",
        },
      }}
      className="flex items-center justify-center gap-5 xl:text-4xl text-2xl"
    >
      {icons.map((icon, index) => {
        return (
          <div
            key={index}
            className="cursor-pointer transition-all duration-200 opacity-70
          hover:opacity-100"
          >
            <Link href={icon.path}>{icon.icon}</Link>
          </div>
        );
      })}
    </motion.div>
  );
};

export default SocialIcons;
