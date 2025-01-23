"use client";
import AboutPhoto from "@/components/Photos/AboutPhoto";
import FoodPhoto from "@/components/Photos/FoodPhoto";
import Address from "@/components/Address";
import CareerForm from "@/components/form/CareerForm";
import IconsWelcome from "@/components/icons/IconsWelcome";
import SocialIcons from "@/components/icons/SocialIcons";
import Header from "@/components/layouts/Header";
import AwardLists from "@/components/AwardLists";
import { Separator } from "@/components/ui/separator";
import { Button } from "@heroui/react";
import { motion } from "framer-motion";
import Image from "next/image";

const AboutPage = () => {
  return (
    <>
      <section className="mx-auto container overflow-x-hidden relative">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{
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

        <main
          className="flex flex-col text-[14px] mx-auto w-full xl:h-screen 
        h-[85vh] lg:py-4 gap-3"
        >
          <motion.h1
            initial={{ opacity: 0, x: -200 }}
            animate={{
              opacity: 1,
              x: 0,
              transition: {
                delay: 0.5,
                duration: 0.8,
                ease: "easeInOut",
              },
            }}
            className="lg:text-5xl text-4xl
             font-bold lg:px-8 lg:text-left text-center"
          >
            About{" "}
            <span
              className="text-accent hover:text-accent-hover 
            duration-150 cursor-pointer"
            >
              Ember.
            </span>
          </motion.h1>

          <div
            className="flex text-3xl xl:flex-row flex-col xl:gap-20 gap-4 
          w-full h-full relative justify-between lg:px-8"
          >
            <motion.div
              initial={{ opacity: 0, x: -200 }}
              animate={{
                opacity: 1,
                x: 0,
                transition: {
                  delay: 0.5,
                  duration: 0.8,
                  ease: "easeInOut",
                },
              }}
              className="lg:text-[16px] text-[14px] xl:h-[75%] order-2 xl:order-none
               items-center justify-center xl:w-[50%] font-normal text-white/60 
               text-center flex flex-col xl:gap-10 gap-3"
            >
              <p>
                Our restaurant was established in 2005, and with over a decade
                of operation, we take pride in delivering exceptional culinary
                experiences. Located in the heart of London, we offer a diverse
                menu crafted from the freshest ingredients, ensuring each dish
                delights your taste buds. Join us and enjoy warm hospitality and
                unforgettable dining moments.
              </p>

              <p className="xl:text-[20px] lg:text-[18px]">
                The Ember Restaurant is where renowned and talented chefs
                gather. We are confident in delivering our customers the most
                exquisite dishes we have.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{
                opacity: 1,
                x: 0,
                transition: {
                  delay: 0.5,
                  duration: 0.9,
                  ease: "easeInOut",
                },
              }}
              className="xl:h-[75%] xl:mx-0 mx-auto relative lg:w-1/2 md:w-full
              w-[90%] h-full order-1 xl:order-none"
            >
              <Image
                src="/images/about-background.jpeg"
                alt="image"
                fill
                sizes="(max-width: 600px) 100vw, 50vw"
                priority
                className="rounded-lg object-cover bg-blend-lighten cursor-pointer 
                transition-all opacity-80 hover:opacity-100 duration-300"
              />
            </motion.div>
          </div>
        </main>

        <Separator className="px-16 bg-white/30" />

        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: {
              delay: 0.8,
              duration: 0.9,
              ease: "easeInOut",
            },
          }}
          className="flex flex-col gap-4 lg:py-8 py-4"
        >
          <div className="flex flex-col gap-1 relative lg:text-left text-center">
            <h1 className="lg:text-5xl text-4xl font-bold">
              About{" "}
              <span className="text-accent hover:text-accent-hover">Team</span>
            </h1>

            <p className="xl:text-[15px] text-[13px] text-white/70">
              Here are the outstanding employees of our restaurant.
            </p>
          </div>

          <div className="w-full h-full relative lg:px-6">
            <AboutPhoto />
          </div>
        </motion.section>

        <Separator className="px-16 bg-white/30" />

        <section className="w-full flex flex-col lg:gap-4 gap-2 lg:py-8 py-4">
          <div className="relative flex flex-col xl:gap-8 gap-2">
            <motion.div
              initial={{ opacity: 0, x: -200 }}
              animate={{
                opacity: 1,
                x: 0,
                transition: {
                  delay: 0.6,
                  duration: 0.9,
                  ease: "easeInOut",
                },
              }}
              className="flex flex-col lg:text-left text-center"
            >
              <h1 className="lg:text-5xl text-4xl font-bold">
                About{" "}
                <span className="text-accent hover:text-accent-hover">
                  Awards & Recognitions
                </span>
              </h1>

              <p className="xl:text-[15px] text-white/60 text-[12px]">
                Here are the awards and recognitions that we have achieved in
                recent years.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 200 }}
              animate={{
                opacity: 1,
                x: 0,
                transition: {
                  delay: 0.5,
                  duration: 0.9,
                  ease: "easeInOut",
                },
              }}
              className="lg:text-left text-center lg:px-8"
            >
              <AwardLists />
            </motion.div>
          </div>
          <motion.p
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: {
                delay: 0.4,
                duration: 0.9,
                ease: "easeInOut",
              },
            }}
            className="lg:text-[15px] text-[14px] text-white/60 font-medium
             italic lg:text-left text-center"
          >
            Currently, our restaurant is striving daily to achieve more
            prestigious accolades and awards.
          </motion.p>
        </section>

        <Separator className="px-16 bg-white/30" />

        <section
          className="flex w-full lg:py-8 py-6
          flex-col xl:gap-8 gap-4 xl:justify-start justify-between"
        >
          <motion.h1
            initial={{ opacity: 0, x: 200 }}
            animate={{
              opacity: 1,
              x: 0,
              transition: {
                delay: 0.5,
                duration: 0.9,
                ease: "easeInOut",
              },
            }}
            className="lg:text-5xl text-4xl font-bold lg:text-left text-center"
          >
            About{" "}
            <span className="text-accent hover:text-accent-hover">
              Our History
            </span>
          </motion.h1>

          <div
            className="relative w-full h-full flex xl:gap-24 gap-4 order-1 
          xl:order-none xl:flex-row flex-col justify-between px-6 lg:pr-16"
          >
            <motion.div
              initial={{ opacity: 0, x: -200 }}
              animate={{
                opacity: 1,
                x: 0,
                transition: {
                  delay: 0.4,
                  duration: 0.9,
                  ease: "easeInOut",
                },
              }}
              className="flex relative lg:w-[50%] w-full flex-col lg:gap-14 gap-6 
              lg:text-[16px] text-[14px] lg:text-left text-center
               text-white/60 xl:order-none order-2"
            >
              <p>
                Our restaurant was founded in 2005, inspired by a passion for
                culinary excellence and a desire to create unforgettable dining
                experiences. Over the years, we have evolved from a small
                family-owned eatery into a renowned establishment celebrated for
                our innovative dishes and exceptional service. Our commitment to
                quality and tradition has earned us numerous accolades, making
                us a beloved destination for food enthusiasts.
              </p>

              <p>
                Our restaurant has been in business for over 10 years. With a
                wealth of experience and feedback from our customers, we have
                learned many valuable lessons. From this, we strive to create
                unique cuisine and serve our customers as best as possible.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 1,
                scale: 1,
                transition: {
                  delay: 0.4,
                  duration: 1,
                  ease: "easeInOut",
                },
              }}
              className="xl:w-[50vw] w-full xl:mx-0 mx-auto xl:h-[50vh] h-[50vh]
              relative order-1 xl:order-none"
            >
              <Image
                src="/assets/pexels-photo-260922.webp"
                alt="image"
                layout="fill"
                sizes="(max-width:600px) 100vw, 50vw"
                priority
                className="rounded-lg cursor-pointer 
                bg-blend-lighten opacity-80 
                  hover:opacity-100 transition-all object-cover"
              />
            </motion.div>
          </div>
        </section>

        <Separator className="px-16 bg-white/30" />

        <section className="flex w-full relative gap-4 xl:gap-6 flex-col lg:py-8 py-6">
          <motion.h1
            initial={{ opacity: 0, x: -200 }}
            animate={{
              opacity: 1,
              x: 0,
              transition: {
                delay: 0.5,
                duration: 1,
                ease: "easeInOut",
              },
            }}
            className="lg:text-5xl text-4xl font-bold lg:text-left text-center"
          >
            About{" "}
            <span className="text-accent hover:text-accent-hover">
              Our Commitments
            </span>
          </motion.h1>

          <div
            className="flex xl:gap-20 gap-3 w-full order-1 xl:order-none relative
             xl:flex-row flex-col lg:px-8 h-full"
          >
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  delay: 0.5,
                  duration: 1.2,
                  ease: "easeInOut",
                },
              }}
              className="lg:w-[50%] h-full relative
               w-full flex flex-col order-1 xl:order-none lg:gap-10 gap-8 flex-1"
            >
              <div
                className="flex flex-col xl:gap-12 gap-8 lg:text-[16px] text-[14px]
                 lg:text-left text-center
                   text-white/70 h-full"
              >
                <p>
                  Our commitment is to deliver an exceptional dining experience
                  through our dedication to quality and innovation. We take
                  pride in using only the freshest, locally sourced ingredients
                  to craft our dishes. Our chefs are passionate about creating a
                  menu that reflects both tradition and creativity. We strive to
                  provide warm hospitality and an inviting atmosphere for every
                  guest.
                </p>

                <p>
                  Feel free to adjust or expand as needed to better fit your
                  restaurant&apos;s unique values and mission.
                </p>
              </div>

              <div className="flex items-center justify-between lg:flex-row flex-col gap-3">
                <Button className="bg-white text-black text-base">
                  Order Dish Now
                </Button>

                <IconsWelcome
                  IconStyles="border border-accent rounded-full text-white/80 px-2
                   py-2 hover:border-accent-hover
                transition-all duration-300 hover:text-white"
                  ContainerStyles="flex items-center justify-between gap-3 text-2xl"
                />
              </div>
            </motion.div>

            <div className="xl:w-[55%] w-full h-full xl:order-none">
              <FoodPhoto />
            </div>
          </div>
        </section>

        <Separator className="px-16 bg-white/30" />

        <section className="w-full h-screen container flex flex-col lg:gap-8 gap-5 lg:py-8 py-6">
          <motion.div
            initial={{ opacity: 0, x: 200 }}
            animate={{
              opacity: 1,
              x: 0,
              transition: {
                delay: 0.4,
                duration: 0.9,
                ease: "easeInOut",
              },
            }}
            className="flex items-center lg:gap-2 gap-1 justify-between lg:flex-row flex-col"
          >
            <h1 className="lg:text-5xl text-4xl font-bold lg:text-left text-center">
              <span className="text-accent hover:text-accent-hover">
                Connect
              </span>{" "}
              With Us
            </h1>

            <SocialIcons />
          </motion.div>

          <div className="flex w-full h-[80%] justify-between flex-col xl:flex-row lg:px-8">
            <motion.div
              initial={{ opacity: 0, x: -200 }}
              animate={{
                opacity: 1,
                x: 0,
                transition: {
                  delay: 0.4,
                  duration: 1,
                  ease: "easeInOut",
                },
              }}
              className="xl:w-[60%] w-full h-[100%] relative xl:block hidden"
            >
              <Image
                src="/images/address.jpeg"
                alt=""
                fill
                sizes="(max-width: 600px) 100vw, 50vw"
                priority
                className="rounded-lg bg-blend-lighten opacity-70
                 hover:opacity-100 ease-in-out duration-300
                transition-all"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 200 }}
              animate={{
                opacity: 1,
                x: 0,
                transition: {
                  delay: 0.5,
                  duration: 0.9,
                  ease: "easeInOut",
                },
              }}
              className="flex flex-col lg:gap-2 gap-1 xl:text-xl text-[16px]"
            >
              <p className="text-white/60 lg:text-base text-[15px] lg:text-left text-center">
                Or contact us through the addresses below.
              </p>

              <Address />
            </motion.div>
          </div>
        </section>

        <Separator className="px-16 bg-white/30" />

        <section className="w-full flex flex-col xl:gap-8 gap-6 lg:py-8 py-6">
          <motion.div
            initial={{ opacity: 0, x: -250 }}
            animate={{
              opacity: 1,
              x: 0,
              transition: {
                delay: 0.5,
                duration: 1,
                ease: "easeInOut",
              },
            }}
            className="flex flex-col gap-1 relative lg:text-left text-center"
          >
            <h2 className="lg:text-5xl text-4xl font-bold lg:text-left text-center">
              Let&apos;s{" "}
              <span className="text-accent hover:text-accent-hover">
                Work Together!
              </span>
            </h2>

            <p className="text-white/50 lg:text-[15px] text-[12px]">
              Are you looking for a job position at my restaurant? <br />
              We are currently hiring for various positions at our restaurant.
              If you are passionate about food and customer service, we would
              love to hear from you!
            </p>
          </motion.div>

          <div
            className="flex justify-between xl:h-[60%] h-full 
          xl:flex-row flex-col lg:gap-4 gap-6 lg:px-6"
          >
            <CareerForm
              formControlStyle="flex flex-col text-black gap-1"
              labelStyle="text-white/60 font-medium text-[15px]"
              inputStyle="outline-none p-2 rounded-[15px] text-[14px] 
              dark:color-gray-500 text-black dark:text-white"
              textAreaStyle="outline-none p-2 rounded-[15px] text-[14px]
               resize-none text-black dark:text-white"
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: {
                  delay: 0.4,
                  duration: 1,
                  ease: "easeInOut",
                },
              }}
              className="xl:w-[50%] lg:h-[55vh] w-full xl:mx-0 mx-auto 
              h-[35vh] relative transition-all duration-300 opacity-80 
            hover:opacity-100 cursor-pointer order-1 xl:order-none"
            >
              <Image
                src="/images/form.webp"
                alt="image"
                fill
                sizes="(max-width: 600px) 100vw, 50vw"
                priority
                className="rounded-lg object-cover bg-blend-lighten 
                  ease-in-out opacity-60 hover:opacity-100
                transition-all duration-300"
              />
            </motion.div>
          </div>
        </section>
      </section>
    </>
  );
};

export default AboutPage;
