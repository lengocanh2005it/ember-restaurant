"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { StarIcon } from "lucide-react";

interface UsersReviewProps {
  users: Array<{ [key: string]: string }>;
}

const UsersReview: React.FC<UsersReviewProps> = ({ users }) => {
  return (
    <div className="flex flex-col lg:gap-4 gap-2">
      {users.map((user, index) => {
        return (
          <motion.div
            initial={{ opacity: 0, x: index === 0 ? -200 : 200 }}
            animate={{
              opacity: 1,
              x: 0,
              transition: {
                delay: 0.8,
                duration: index === 0 ? 1.5 : index * 1.5,
                ease: "easeInOut",
              },
            }}
            key={index}
            className={`${
              index === 1
                ? "xl:flex-row-reverse flex-col xl:pl-[100px]"
                : "row xl:w-[90%] w-full flex-col"
            } flex xl:flex-row xl:gap-6 gap-0 relative p-2`}
          >
            <div
              className="xl:w-[70%] lg:w-[45%] md:w-[40%] mx-auto xl:mx-0
             w-[90%] h-[50vh] relative select-none"
            >
              {user && user.image && (
                <Image
                  src={user.image}
                  alt="user"
                  priority
                  sizes="(max-width:600px) 100vw, 50vw"
                  fill
                  className="bg-blend-lighten object-cover"
                />
              )}
            </div>

            <div
              className={`flex flex-col xl:text-start text-center items-center 
                xl:items-start xl:gap-6 gap-2 py-6 justify-between select-none ${
                  index === 1
                    ? "xl:items-end items-center xl:text-right text-center"
                    : ""
                }`}
            >
              <div
                className={`flex flex-col xl:text-[16px] text-[12px] ${
                  index === 1 ? "xl:mr-[-50px]" : "xl:ml-[-50px]"
                }`}
              >
                <h2 className="xl:text-4xl text-2xl font-bold text-white">
                  {user.name}
                </h2>
                <p className="text-white/60 font-medium italic">
                  {user.position}
                </p>
              </div>

              <p className="text-white/70 italic xl:text-base text-[14px]">
                {user.review}
              </p>

              <div className="flex items-center gap-5 text-xl">
                <p className="lg:text-[16px] text-[14px] text-white/50 font-medium">
                  {user.date}
                </p>

                <div className="flex items-center text-yellow-500 gap-1 text-3xl cursor-pointer">
                  {Array.from({ length: Number(user.star) }).map((_, index) => {
                    return (
                      <span key={index}>
                        <StarIcon />
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default UsersReview;
