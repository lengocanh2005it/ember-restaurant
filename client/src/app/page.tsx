"use client";
import IconsWelcome from "@/components/icons/IconsWelcome";
import Header from "@/components/layouts/Header";
import PhotosWelcome from "@/components/Photos/PhotosWelcome";
import { Separator } from "@/components/ui/separator";
import { showErrorToast } from "@/utils";
import { Button } from "@heroui/react";
import { motion } from "framer-motion";
import { UtensilsCrossedIcon } from "lucide-react";
import React from "react";
import { Cursor, useTypewriter } from "react-simple-typewriter";

const Home: React.FC = () => {
  const [text] = useTypewriter({
    words: ["Ember Restaurant"],
    typeSpeed: 150,
    deleteSpeed: 30,
    loop: true,
  });

  const handleClick = () => {
    showErrorToast("Please log in to order the dish!", "bottom-right", {
      backgroundColor: "#dc3545",
      color: "#fff",
    });
  };

  return (
    <section className="w-full h-full relative overflow-x-hidden lg:px-2 py-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        whileInView={{
          opacity: 1,
          y: 0,
          transition: {
            delay: 0.3,
            duration: 0.6,
            ease: "easeInOut",
          },
        }}
      >
        <Header />
      </motion.div>

      <div className="container mx-auto relative h-full w-full">
        <div
          className="flex flex-col xl:flex-row items-center justify-between
    xl:pt-8 xl:pb-24 w-full relative gap-6 xl:gap-2 h-full container mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, x: -200 }}
            whileInView={{
              opacity: 1,
              x: 0,
              transition: {
                delay: 0.3,
                duration: 0.8,
                ease: "easeInOut",
              },
            }}
            className="text-center h-full xl:text-left flex xl:w-[45%] 
            w-full flex-col gap-4 order-2 xl:order-none relative"
          >
            <div className="relative flex flex-col">
              <span className="lg:text-xl text-base text-white/50">
                London, UK
              </span>

              <h1 className="h1">
                Hello <br />{" "}
                <span className="text-accent">
                  {text}
                  <span>
                    <Cursor cursorStyle="|" />
                  </span>
                </span>{" "}
                <br /> Here!
              </h1>
            </div>

            <p className="text-white/60 w-full xl:text-base text-[14px]">
              At Amber, we pride ourselves on offering a delightful dining
              experience with gourmet dishes crafted from the finest
              ingredients. Enjoy our warm and elegant ambiance, perfect for any
              special occasion.
            </p>

            <div
              className="flex flex-col xl:flex-row items-center
             justify-between gap-4 space-y-4"
            >
              <Button
                color="primary"
                className="border border-white/50 dark:bg-white dark:text-black
                hover:bg-white/40 transition-all duration-250 ease-in-out hover:text-white
                 hover:scale-[1.15] lg:text-base text-[14px] font-bold px-6"
                onPress={handleClick}
                startContent={<UtensilsCrossedIcon size={25} />}
              >
                Order The Dish
              </Button>

              <IconsWelcome
                IconStyles="rounded-full text-white/70
                transition-all duration-300 hover:text-white p-2 rounded-full 
                border hover:border-accent"
                ContainerStyles="flex items-center justify-between gap-3"
              />
            </div>

            <Separator className="bg-white/30 lg:mt-6" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 200 }}
            whileInView={{
              opacity: 1,
              x: 0,
              transition: {
                delay: 0.3,
                duration: 0.8,
                ease: "easeInOut",
              },
            }}
            className="order-1 xl:order-none mb-5 xl:mb-0 xl:w-[50%] w-full 
            xl:h-[500px] h-[300px] mix-blend-lighten
          relative"
          >
            <PhotosWelcome />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Home;
