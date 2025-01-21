"use client";
import React from "react";
import Image from "next/image";
import Header from "@/components/layouts/Header";
import ButtonDishes from "@/components/buttons/ButtonDishes";
import ListDishes from "@/components/ListDishes";
import DishesTypes from "@/components/DishesTypes";
import UsersReview from "@/components/UsersReview";
import LoginButton from "@/components/buttons/LoginButton";
import { motion } from "framer-motion";
import ModalDishes from "@/components/modal/ModalDishes";
import {
  appetizers,
  desserts,
  hotpots,
  main_courses,
  beverages,
  specialty_dishes,
  userDishesReviews,
} from "@/mock";

const DishesPage: React.FC = () => {
  return (
    <React.Fragment>
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{
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

      <div className="container mx-auto mb-4 flex flex-col xl:gap-24 gap-14 overflow-hidden">
        <main className="relative flex flex-col gap-4 w-full min-h-[600px] text-[14px]">
          <motion.div
            initial={{ opacity: 0, x: -200 }}
            animate={{
              opacity: 1,
              x: 0,
              transition: {
                delay: 0.8,
                duration: 1.2,
                ease: "easeInOut",
              },
            }}
            className="lg:text-3xl text-2xl lg:text-left text-center flex flex-col gap-1"
          >
            <div className="flex items-center gap-2 font-bold lg:flex-row flex-col">
              Explore The Exquisite Menu At{" "}
              <span className="text-accent xl:text-5xl lg:text-4xl md:text-3xl text-2xl">
                Ember
              </span>
            </div>

            <span className="lg:text-xl text-base text-white/50 italic">
              Every Dish Is An Experience
            </span>
          </motion.div>

          <div
            className="flex lg:flex-row flex-col justify-between lg:min-h-[500px]
          lg:p-4 w-full relative gap-6"
          >
            <div
              className="flex flex-col lg:w-[50%] 
            w-full lg:pt-24 order-1 lg:order-none justify-between py-12"
            >
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  transition: {
                    delay: 0.8,
                    duration: 1.2,
                    ease: "easeInOut",
                  },
                }}
                className="flex flex-col text-white/70 xl:text-base text-[14px] 
                xl:gap-8 gap-4 lg:text-left text-center"
              >
                <p>
                  Discover a variety of delectable dishes crafted with the
                  finest ingredients and utmost care. Each item on our menu
                  promises to delight your taste buds and provide an
                  unforgettable dining experience.
                </p>

                <p>
                  We are confident that the dishes at Ember restaurant will not
                  disappoint you. Let&apos;s explore the menu together.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  transition: {
                    delay: 0.8,
                    duration: 1.2,
                    ease: "easeInOut",
                  },
                }}
                className="flex w-full relative items-center justify-center"
              >
                <ButtonDishes
                  buttonStyles="bg-primary 
                border border-white/50 text-white 
                hover:bg-white/20 justify-center px-6 hover:scale-[1.1] text-base"
                />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{
                opacity: 1,
                x: 0,
                transition: {
                  delay: 0.8,
                  duration: 1.3,
                  ease: "easeInOut",
                },
              }}
              className="xl:w-[45%] w-[80%] lg:mx-0 mx-auto relative lg:h-[500px] h-[300px]"
            >
              <Image
                src="/dishes/dishes-1.jpg"
                alt=""
                priority
                fill
                sizes="(max-width: 600px) 100vw, 50vw"
                className="rounded-[15px] object-cover cursor-pointer 
                duration-300 ease-in-out transition-all select-none opacity-80 hover:opacity-100"
              />
            </motion.div>
          </div>
        </main>

        <main id="menu" className="flex flex-col h-fit gap-6">
          <div className="flex flex-col lg:items-start items-center">
            <motion.h2
              initial={{ opacity: 0, x: 150 }}
              animate={{
                opacity: 1,
                x: 0,
                transition: {
                  delay: 0.8,
                  duration: 1.2,
                  ease: "easeInOut",
                },
              }}
              className="lg:text-2xl text-xl font-bold text-center lg:text-left"
            >
              What Types Of Dishes Does{" "}
              <span className="text-accent">Ember</span> Restaurant Offer?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, x: -100 }}
              animate={{
                opacity: 1,
                x: 0,
                transition: {
                  delay: 0.8,
                  duration: 1.2,
                  ease: "easeInOut",
                },
              }}
              className="text-white/50 xl:text-[15px] text-[13px] text-center lg:text-left"
            >
              Below is a list of the dishes available at our restaurant. Feel
              free to explore.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                delay: 0.8,
                duration: 1.3,
                ease: "easeInOut",
              },
            }}
            className="relative w-full xl:container"
          >
            <ListDishes />
          </motion.div>
        </main>

        <div className="flex flex-col gap-12">
          <section id="appetizers" className="flex flex-col relative">
            <motion.h1
              initial={{ opacity: 0, x: 50 }}
              animate={{
                opacity: 1,
                x: 0,
                transition: {
                  delay: 0.8,
                  duration: 1.2,
                  ease: "easeInOut",
                },
              }}
              className="xl:text-4xl text-2xl text-white font-bold uppercase"
            >
              Appetizers
            </motion.h1>

            <DishesTypes dishes={appetizers} />
          </section>

          <section id="desserts">
            <motion.h1
              initial={{ opacity: 0, x: 50 }}
              animate={{
                opacity: 1,
                x: 0,
                transition: {
                  delay: 0.8,
                  duration: 1.2,
                  ease: "easeInOut",
                },
              }}
              className="xl:text-4xl text-2xl text-white font-bold uppercase"
            >
              Desserts
            </motion.h1>

            <DishesTypes dishes={desserts} />
          </section>

          <section id="hotpots">
            <motion.h1
              initial={{ opacity: 0, x: 50 }}
              animate={{
                opacity: 1,
                x: 0,
                transition: {
                  delay: 0.8,
                  duration: 1.2,
                  ease: "easeInOut",
                },
              }}
              className="xl:text-4xl text-2xl text-white font-bold uppercase"
            >
              Hotpots
            </motion.h1>
            <DishesTypes dishes={hotpots} />
          </section>

          {/* Main courses */}
          <section id="main-courses">
            <h1 className="xl:text-4xl text-2xl text-white font-bold uppercase">
              Main Courses
            </h1>
            <DishesTypes dishes={main_courses} />
          </section>

          {/* Beverages */}
          <section id="beverages">
            <motion.h1
              initial={{ opacity: 0, x: 50 }}
              animate={{
                opacity: 1,
                x: 0,
                transition: {
                  delay: 0.8,
                  duration: 1.2,
                  ease: "easeInOut",
                },
              }}
              className="xl:text-4xl text-2xl text-white font-bold uppercase"
            >
              Beverages
            </motion.h1>
            <DishesTypes dishes={beverages} />
          </section>

          <section id="specialty-dishes">
            <motion.h1
              initial={{ opacity: 0, x: 50 }}
              animate={{
                opacity: 1,
                x: 0,
                transition: {
                  delay: 0.8,
                  duration: 1.2,
                  ease: "easeInOut",
                },
              }}
              className="xl:text-4xl text-2xl text-white font-bold uppercase"
            >
              Specialty Dishes
            </motion.h1>

            <DishesTypes dishes={specialty_dishes} />
          </section>
        </div>

        <div className="overflow-x-hidden flex flex-col gap-4">
          <motion.h1
            initial={{ opacity: 0, x: 50 }}
            animate={{
              opacity: 1,
              x: 0,
              transition: {
                delay: 0.8,
                duration: 1.2,
                ease: "easeInOut",
              },
            }}
            className="lg:text-3xl text-2xl lg:text-left 
            text-center font-bold"
          >
            What Customers Say About Our Dishes?
          </motion.h1>

          <UsersReview users={userDishesReviews} />
        </div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{
            opacity: 1,
            x: 0,
            transition: {
              delay: 0.8,
              duration: 1.2,
              ease: "easeInOut",
            },
          }}
          id="reservation"
          className="container xl:h-[30vh] h-fit pt-8 flex flex-col gap-4"
        >
          <div className="flex flex-col relative">
            <h1 className="xl:text-3xl text-xl font-bold">
              Make A Reservation Or Adding Dishes To Your Cart?
            </h1>
            <p className="text-white/50">Please login to continue!</p>
          </div>

          <div className="mx-auto xl:mx-0">
            <LoginButton />
          </div>
        </motion.div>
      </div>

      {/* Modal */}
      <ModalDishes />
    </React.Fragment>
  );
};

export default DishesPage;
