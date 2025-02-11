"use client";
import LoginForm from "@/components/form/LoginForm";
import Header from "@/components/layouts/Header";
import PhotosWelcome from "@/components/Photos/PhotosWelcome";
import { showErrorToast } from "@/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import React, { use, useEffect } from "react";

const LoginPage: React.FC = (props: any) => {
  const searchParams = use(props.searchParams);
  const { error } = searchParams as any;

  useEffect(() => {
    if (error && error === "AccessDenied") {
      showErrorToast(
        "Email has been already used by another user!",
        "top-right",
        {
          backgroundColor: "#dc3545",
          color: "#fff",
        }
      );
    }

    if (error && error === "InformationMissing") {
      showErrorToast("Please log in to continue!", "top-right", {
        backgroundColor: "#dc3545",
        color: "#fff",
      });
    }

    if (error && error === "ExpiredSession") {
      showErrorToast(
        "Your session has expired, please log in again!",
        "top-right",
        {
          backgroundColor: "#dc3545",
          color: "#fff",
        }
      );
    }
  }, [error]);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: {
          delay: 0.4,
          duration: 0.6,
          ease: "easeInOut",
        },
      }}
      className="lg:h-screen"
    >
      <div className="container mx-auto flex-col justify-between lg:text-xl text-[15px]">
        <div className="lg:hidden hidden">
          <Header />
        </div>

        <div
          className="container mx-auto lg:flex justify-between h-full w-full lg:py-20 py-5
          relative items-center
        xl:pr-24"
        >
          <div className="lg:mb-3 mb-5 lg:w-[50%] w-[100%] relative h-full">
            <motion.div
              initial={{ transform: "translateX(-70px)", opacity: 0 }}
              animate={{
                transform: "translateY(0)",
                opacity: 1,
                transition: {
                  delay: 0.7,
                  duration: 0.6,
                  ease: "easeInOut",
                },
              }}
              className="relative flex flex-col mb-3 text-2xl lg:justify-start justify-center lg:items-start
              items-center lg:text-left text-center"
            >
              <h1 className="lg:text-3xl text-2xl font-bold">
                Welcome to{" "}
                <Link href="/">
                  <span className="text-accent">Ember.</span>
                </Link>
              </h1>

              <p className="text-[16px] text-white/70">
                Please login to continue.
              </p>
            </motion.div>

            <motion.div
              className="w-full lg:min-h-[450px] h-[200px] relative"
              initial={{ opacity: 0, y: 60 }}
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
              <PhotosWelcome />
            </motion.div>
          </div>

          <div
            className="relative bg-primary shadow-xl border border-[#646464] p-4 
            text-[15px] flex flex-col
          rounded-3xl justify-between h-[max-content] gap-3"
          >
            <h2
              className="text-center lg:text-3xl text-2xl font-medium hover:scale-110
               ease-in-out transition-all
            duration-300"
            >
              Login
            </h2>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: {
                  delay: 0.5,
                  duration: 0.7,
                  ease: "easeIn",
                },
              }}
              className="flex justify-between items-center lg:w-[450px] w-full h-full"
            >
              <LoginForm />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.main>
  );
};

export default LoginPage;
