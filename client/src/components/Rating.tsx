import React from "react";
import { motion } from "framer-motion";
import { FaClock, FaComment, FaCommentSlash, FaStar } from "react-icons/fa";
import CountUp from "react-countup";

const stats = [
  {
    num: 12,
    icon: <FaClock />,
    text: "Years Of Operation",
  },
  {
    num: 1300,
    icon: <FaComment />,
    text: "Positive Reviews",
  },
  {
    num: 50,
    icon: <FaCommentSlash />,
    text: "Negative Reviews",
  },
  {
    num: 650,
    icon: <FaStar />,
    text: "Average Good Stars",
  },
];

const Rating: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: {
          delay: 0.4,
          duration: 0.5,
          ease: "easeInOut",
        },
      }}
      className="xl:gap-2 gap-6 grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1"
    >
      {stats.map((stat, index) => {
        return (
          <div
            key={index}
            className="flex flex-col flex-1 xl:gap-4 gap-2 items-center justify-center xl:justify-start"
          >
            <CountUp
              end={stat.num}
              duration={5}
              delay={2}
              className="text-center text-4xl xl:text-6xl md:text-5xl font-extrabold"
            />
            <div className="flex xl:gap-2 gap-1 items-center min-w-[300px] justify-center">
              <i className="xl:text-4xl text-2xl">{stat.icon}</i>
              <p className="leading-snug text-white/60 font-bold xl:text-xl text-[15px]">
                {stat.text}
              </p>
            </div>
          </div>
        );
      })}
    </motion.div>
  );
};

export default Rating;
