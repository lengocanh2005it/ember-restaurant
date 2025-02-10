"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import RegisterForm from "@/components/form/RegisterForm";
import PhotosWelcome from "@/components/Photos/PhotosWelcome";

const RegisterPage = () => {
  return (
    <section className="container relative xl:h-screen">
      <div
        className="container mx-auto py-10 justify-between lg:px-12 relative h-full
         w-full flex flex-col xl:flex-row gap-8 items-center"
      >
        <motion.div
          initial={{ opacity: 0, transform: "translateX(-100px)" }}
          animate={{
            opacity: 1,
            transform: "translateX(0)",
            transition: {
              delay: 0.4,
              duration: 0.6,
              ease: "easeIn",
            },
          }}
          className="relative bg-primary shadow-xl border border-[#646464]
           p-4 text-[15px] flex flex-col rounded-[20px] gap-3 xl:w-[35%] w-full order-2 xl:order-none"
        >
          <h2
            className="text-center lg:text-3xl text-2xl font-medium hover:scale-110
        ease-in-out transition-all duration-300"
          >
            Register
          </h2>
          <RegisterForm />
        </motion.div>

        <div className="xl:w-[50%] h-full relative order-1 xl:order-none w-full md:w-full">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                delay: 0.4,
                duration: 0.6,
                ease: "easeIn",
              },
            }}
            className="flex flex-col text-[15px] mb-3 lg:text-left text-center lg:items-start
             lg:justify-start
            items-center justify-center"
          >
            <h2 className="lg:text-3xl text-2xl font-bold">
              Register With{" "}
              <Link href="/" passHref>
                <span className="font-semibold text-accent hover:text-accent-hover">
                  Ember.
                </span>
              </Link>
            </h2>

            <p className="text-white/70 text-[16px]">
              Create a new account to explore our restaurant!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                delay: 0.4,
                duration: 0.6,
                ease: "easeInOut",
              },
            }}
            className="w-full xl:min-h-[450px] h-[200px] relative"
          >
            <PhotosWelcome />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;
