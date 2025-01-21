"use client";
import React from "react";
import Image from "next/image";
import Header from "@/components/layouts/Header";
import ServiceButton from "@/components/buttons/ServiceButton";
import ServiceOptions from "@/components/service/ServiceOptions";
import { motion } from "framer-motion";
import SpecialPromotion from "@/components/service/SpecialPromotion";
import Address from "@/components/Address";
import UsersReview from "@/components/UsersReview";
import { Separator } from "@/components/ui/separator";
import { userServiceReviews } from "@/mock";

const ServicePage: React.FC = () => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: {
            delay: 0.3,
            duration: 0.5,
            ease: "easeInOut",
          },
        }}
      >
        <Header />
      </motion.div>

      <div className="container mx-auto lg:mb-4 overflow-x-hidden flex flex-col gap-14">
        <div className="relative h-fit w-full text-xl flex flex-col px-4 lg:gap-6 gap-4">
          <motion.h1
            initial={{ opacity: 0, x: -200 }}
            animate={{
              opacity: 1,
              x: 0,
              transition: {
                delay: 0.3,
                duration: 0.6,
                ease: "easeInOut",
              },
            }}
            className="lg:text-4xl text-2xl font-bold lg:px-6 px-0 lg:text-left text-center"
          >
            Welcome to <span className="text-accent">Ember.</span> Services
          </motion.h1>

          <div className="flex lg:flex-row flex-col relative gap-6 w-full h-full justify-between">
            <div
              className="lg:w-1/2 order-2 lg:order-none w-full relative
             flex flex-col lg:gap-12 gap-10 items-center
        justify-center"
            >
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  transition: {
                    delay: 0.3,
                    duration: 0.6,
                    ease: "easeInOut",
                  },
                }}
                className="flex flex-col items-center
                 lg:gap-4 gap-2 lg:text-[18px] text-[14px] text-white/60 text-center"
              >
                <p>
                  At our restaurant, you not only enjoy delicious food but also
                  experience quick table reservations, elegant event planning,
                  and convenient delivery services.
                </p>
                <p>
                  Our attentive staff is dedicated to providing exceptional
                  service, ensuring your visit is memorable from start to
                  finish.
                </p>
                <p>
                  Additionally, our customizable catering options and special
                  promotions offer even more reasons to celebrate with us.
                  Whether you&apos;re planning a special event or simply looking
                  to enjoy a meal with friends and family, we&apos;re here to
                  make every occasion extraordinary.
                </p>

                <Separator className="bg-white/30" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  transition: {
                    delay: 0.3,
                    duration: 0.6,
                    ease: "easeInOut",
                  },
                }}
                className="flex lg:gap-6 gap-3 lg:flex-row flex-col"
              >
                <ServiceButton />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{
                opacity: 1,
                x: 0,
                transition: {
                  delay: 0.8,
                  duration: 1.5,
                  ease: "easeInOut",
                },
              }}
              className="flex xl:w-1/2 w-full lg:h-[66vh] h-[40vh] order-1 lg:order-none relative"
            >
              <Image
                src="/images/chef-2.png"
                alt="image"
                fill
                priority
                sizes="(max-width:600px) 100vw, 50vw"
                className="cursor-pointer select-none object-cover"
              />
            </motion.div>
          </div>
        </div>

        <div
          className="w-full flex flex-col md:gap-2 gap-2 text-[14px]"
          id="services"
        >
          <motion.h1
            initial={{ opacity: 0, x: -100 }}
            animate={{
              opacity: 1,
              x: 0,
              transition: {
                delay: 0.3,
                duration: 0.6,
                ease: "easeInOut",
              },
            }}
            className="lg:text-4xl text-2xl font-bold lg:text-left text-center"
          >
            What Services That Our Restaurant Includes ?
          </motion.h1>

          <ServiceOptions />
        </div>

        <div className="w-full h-fit relative">
          <SpecialPromotion />
        </div>

        <div className="w-full h-fit relative flex flex-col xl:gap-12 gap-2">
          <motion.h1
            initial={{ opacity: 0, x: 200 }}
            animate={{
              opacity: 1,
              x: 0,
              transition: {
                delay: 0.3,
                duration: 0.6,
                ease: "easeInOut",
              },
            }}
            className="lg:text-4xl text-2xl
            font-bold lg:text-left text-center"
          >
            What Customer Say?
          </motion.h1>
          <UsersReview users={userServiceReviews} />
        </div>

        <div className="flex flex-col gap-5 relative w-full h-fit xl:mb-2 mb-3">
          <div className="flex flex-col gap-1  lg:items-start items-center">
            <motion.h1
              initial={{ opacity: 0, x: -200 }}
              animate={{
                opacity: 1,
                x: 0,
                transition: {
                  delay: 0.3,
                  duration: 0.6,
                  ease: "easeInOut",
                },
              }}
              className="lg:text-4xl text-2xl uppercase font-bold"
            >
              Connect with us
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: 200 }}
              animate={{
                opacity: 1,
                x: 0,
                transition: {
                  delay: 0.3,
                  duration: 0.6,
                  ease: "easeInOut",
                },
              }}
              className="text-white/60 xl:text-base text-[12px]"
            >
              Please contact us if you encounter any issues viewing our
              services.
            </motion.p>
          </div>

          <div
            className="w-full relative flex
          justify-between xl:flex-row flex-col gap-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1,
                transition: {
                  delay: 0.3,
                  duration: 0.6,
                  ease: "easeInOut",
                },
              }}
              className="xl:w-[40%] w-full order-2 xl:order-none"
            >
              <Address />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 200 }}
              animate={{
                opacity: 1,
                x: 0,
                transition: {
                  delay: 0.3,
                  duration: 0.6,
                  ease: "easeInOut",
                },
              }}
              className="xl:w-1/2 w-full xl:h-[75vh] lg:h-[60vh] md:h-[50vh] h-[45vh] relative"
            >
              <Image
                src="/images/image.avif"
                alt=""
                priority
                sizes="(max-width: 600px) 100vw, 50vw"
                fill
                className="rounded-lg bg-blend-lighten cursor-pointer opacity-80 
                hover:opacity-100 ease-in-out duration-300 transition-all object-cover"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServicePage;
