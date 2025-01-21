"use client";
import React from "react";
import { motion } from "framer-motion";
import Rating from "@/components/Rating";
import Header from "@/components/layouts/Header";
import Image from "next/image";
import ReviewDetails from "@/components/ReviewDetails";
import RatingData from "@/components/RatingData";
import FeedbackForm from "@/components/form/FeedbackForm";

const ReviewPage: React.FC = () => {
  return (
    <section className="container mx-auto flex flex-col gap-0 xl:mb-10 overflow-x-hidden relative">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        whileInView={{
          opacity: 1,
          y: 0,
          transition: {
            delay: 0.5,
            duration: 0.8,
            ease: "easeInOut",
          },
        }}
      >
        <Header />
      </motion.div>

      <div className="flex flex-col lg:gap-16 gap-12">
        <div
          className="flex items-center justify-between relative w-full 
        h-[80vh] xl:flex-row flex-col xl:gap-0 gap-6"
        >
          <div className="container mx-auto xl:w-[63%] w-full xl:order-none order-2">
            <motion.h1
              initial={{ opacity: 0, x: -200 }}
              animate={{
                opacity: 1,
                x: 0,
                transition: {
                  delay: 0.9,
                  duration: 0.8,
                  ease: "easeInOut",
                },
              }}
              className="lg:text-6xl md:text-4xl text-3xl
               text-center text-wrap font-medium flex flex-col gap-2"
            >
              <p className="lg:text-5xl text-2xl">
                <span className="text-accent">Ember.</span>&nbsp;Restaurant
              </p>

              <p className="font-bold">Reviews & Ratings</p>
            </motion.h1>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 200 }}
            animate={{
              opacity: 1,
              x: 0,
              transition: {
                delay: 0.8,
                duration: 1,
                ease: "easeInOut",
              },
            }}
            className="bg-blend-lighten relative lg:h-full h-[70%] xl:w-[50%] lg:w-[40%]
             w-full xl:order-none order-1"
          >
            <Image
              src="/employees/woman-chef.png"
              alt=""
              fill
              priority
              sizes="(max-width: 600px) 100vw, 50vw"
              className="bg-blend-lighten rounded-[20px] select-none object-cover"
            />
          </motion.div>
        </div>

        <div className="flex justify-center items-center lg:my-10 my-2 text-xl">
          <Rating />
        </div>

        <div className="w-full relative flex flex-col gap-4">
          <motion.h1
            initial={{ opacity: 0, x: -100 }}
            animate={{
              opacity: 1,
              x: 0,
              transition: {
                delay: 0.2,
                duration: 0.6,
                ease: "easeInOut",
              },
            }}
            className="lg:text-3xl text-xl font-medium lg:text-left text-center"
          >
            What Do Customers Say About{" "}
            <span className="text-accent lg:text-4xl text-2xl">Ember?</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                delay: 0.3,
                duration: 0.9,
                ease: "easeInOut",
              },
            }}
            className="w-full relative"
          >
            <ReviewDetails />
          </motion.div>
        </div>

        <div className="flex items-center justify-between w-full relative lg:gap-10 gap-6">
          <div className="flex flex-col gap-4 xl:w-[55%] lg:w-[50%] w-full">
            <motion.h1
              initial={{ opacity: 0, x: -50 }}
              animate={{
                opacity: 1,
                x: 0,
                transition: {
                  delay: 0.2,
                  duration: 0.7,
                  ease: "easeInOut",
                },
              }}
              className="lg:text-3xl text-xl font-bold lg:text-left text-center"
            >
              Restaurant Reviews For The Year{" "}
              <span className="text-accent xl:text-5xl text-4xl">2023</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  delay: 0.2,
                  duration: 0.9,
                  ease: "easeInOut",
                },
              }}
            >
              <RatingData />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{
              opacity: 1,
              x: 0,
              transition: {
                delay: 0.2,
                duration: 0.6,
                ease: "easeInOut",
              },
            }}
            className="xl:w-[55vw] lg:w-[45vh] h-[55vh] relative lg:block hidden rounded-lg"
          >
            <Image
              src="/evaluates/evaluate-1.jpg"
              alt="background"
              layout="fill"
              priority
              sizes="(max-width: 600px) 100vw, 50vw"
              className="rounded-lg object-cover opacity-70 hover:opacity-100 
              ease-in-out duration-300 transition-all
              select-none cursor-pointer bg-blend-lighten"
            />
          </motion.div>
        </div>

        <motion.div className="flex flex-col lg:gap-2 gap-2">
          <div className="flex flex-col relative">
            <motion.h1
              initial={{ opacity: 0, x: -100 }}
              animate={{
                opacity: 1,
                x: 0,
                transition: {
                  delay: 0.2,
                  duration: 0.6,
                  ease: "easeInOut",
                },
              }}
              className="xl:text-4xl text-2xl font-bold text-white"
            >
              About You?
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  delay: 0.2,
                  duration: 0.8,
                  ease: "easeInOut",
                },
              }}
              className="text-white/50 xl:text-[15px] text-[14px]"
            >
              If you have visited and enjoyed the food at our restaurant, could
              you please provide us with your feedback? <br /> We would greatly
              appreciate it!
            </motion.p>
          </div>

          <div
            className="flex items-center justify-between w-full h-full
          relative lg:gap-10 gap-6 lg:flex-row flex-col"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 1,
                scale: 1,
                transition: {
                  delay: 0.2,
                  duration: 0.6,
                  ease: "easeInOut",
                },
              }}
              className="relative lg:w-[50vw] w-full lg:h-[80vh] h-[30vh]"
            >
              <Image
                src="/evaluates/evaluate-2.jpg"
                alt="image"
                fill
                priority
                sizes="(max-width:600px) 100vw, 50vw"
                className="rounded-md object-cover select-none cursor-pointer 
                opacity-80 hover:opacity-100 ease-in-out duration-200 transition-all"
              />
            </motion.div>

            <FeedbackForm />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ReviewPage;
