"use client";
import BannerNotFound from "@/components/BannerNotFound";
import { Button } from "@heroui/react";
import { motion } from "framer-motion";
import { HomeIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const NotFoundPage: React.FC = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/");
  };

  return (
    <section className="relative container mx-auto px-4 py-6 h-screen flex flex-col gap-8">
      <BannerNotFound />

      <div
        className="relative flex flex-col items-center justify-center lg:h-[65vh]
       h-[80vh] lg:gap-8 gap-6"
      >
        <motion.div
          className="relative lg:w-[400px] lg:h-[400px] w-[300px]
         h-[300px] flex flex-col items-center"
          initial={{ opacity: 0, x: -50 }}
          animate={{
            opacity: 1,
            x: 0,
            transition: {
              delay: 0.1,
              duration: 0.8,
              ease: "easeInOut",
            },
          }}
        >
          <Image
            src={"/not-found-1.webp"}
            alt=""
            fill
            priority
            sizes="(max-width:600px) 100vw, 50vw"
            className="object-cover select-none"
          />
        </motion.div>

        <div className="relative flex items-center text-center flex-col gap-6">
          <div className="flex flex-col gap-2 items-center text-center relative">
            <h1 className="lg:text-2xl text-xl uppercase font-bold">
              Page Not Found
            </h1>

            <p className="lg:text-base text-[14px] text-white/70">
              Sorry, the page you requested does not exist. Please try
              requesting another page.
            </p>
          </div>

          <Button
            startContent={<HomeIcon />}
            className="bg-white text-black"
            onPress={handleClick}
          >
            Go Home
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NotFoundPage;
