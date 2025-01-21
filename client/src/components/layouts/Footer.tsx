"use client";
import React from "react";
import AddressFooter from "@/components/AddressFooter";
import SocialIcons from "@/components/icons/SocialIcons";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button, Input } from "@nextui-org/react";

const links = [
  { title: "Home", path: "/home" },
  { title: "Services", path: "/services" },
  { title: "Customer reviews", path: "/review" },
  { title: "About", path: "/about" },
];

const privacies = [
  { title: "Privacy Policy", path: "/privacy" },
  { title: "Terms of Use", path: "/terms" },
  { title: "Return and Exchange Policy", path: "/return-policy" },
];

const Footer: React.FC = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: {
          delay: 0.3,
          duration: 0.5,
          ease: "easeInOut",
        },
      }}
      className="bg-gray-800 text-white lg:py-8 py-4"
    >
      <div
        className="container mx-auto px-6 lg:px-20 grid grid-cols-1 
      md:grid-cols-3 lg:grid-cols-4 lg:gap-6 gap-4"
      >
        {/* Information of restaurant */}
        <div>
          <h1 className="md:text-3xl text-2xl font-semibold md:mb-4 mb-2">
            <span
              className="text-accent
             hover:text-accent-hover"
            >
              Ember.
            </span>{" "}
            Restaurant
          </h1>
          <p className="text-white/50 lg:text-[15px] text-[14px]">
            Our restaurant offers fantastic dishes made from the freshest
            ingredients.
          </p>

          <AddressFooter containerStyles="flex items-center gap-2" />
        </div>

        <div>
          <h2 className="text-xl font-medium mb-4">Operating hours</h2>
          <ul className="text-white/80">
            <li className="hover:text-white">Mon - Fri: 8:00 AM - 10:00 PM</li>
            <li className="hover:text-white">Sat - Sun: 9:00 AM - 11:00 PM</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-medium mb-4">Quick Links</h2>
          <ul className="">
            {links.map((link, index) => {
              return (
                <li key={index}>
                  <Link
                    href={link.path}
                    className="hover:underline hover:text-accent transition-all"
                  >
                    {link.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-medium">Social media</h2>
            <div className="flex space-x-4">
              <SocialIcons />
            </div>
          </div>
          <div>
            <h2 className="lg:text-base text-[14px] font-medium mb-2">
              Register to receive news
            </h2>
            <form action="#" className="flex flex-col lg:gap-4 gap-2">
              <Input label="Email" className="dark:text-white" />

              <Button color="primary" className="dark:bg-white dark:text-black">
                Register
              </Button>
            </form>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-medium lg:mb-4 mb-0">
            Policies and Terms
          </h2>
          <ul>
            {privacies.map((privacy, index) => {
              return (
                <li key={index}>
                  <Link
                    href={privacy.path}
                    className="hover:underline hover:text-accent transition-all"
                  >
                    {privacy.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-medium mb-4">Location and Map</h2>
          <div className="mt-4">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345093775!2d144.95373631566612!3d-37.81720974202145!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf5779d05a6d0b175!2sMelbourne%20CBD%2C%20Melbourne%20VIC%2C%20Australia!5e0!3m2!1sen!2sus!4v1618479184579!5m2!1sen!2sus"
              width="100%"
              height="200"
              allowFullScreen
              loading="lazy"
              title="Google Maps"
              className="border-0 rounded-[10px]"
            ></iframe>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-medium lg:mb-4 mb-0">
            Customer Feedback
          </h2>
          <Link
            href="/submit-feedback"
            className="hover:underline hover:text-accent transition-all"
          >
            Submit Feedback or Complaints
          </Link>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-medium lg:mb-4 mb-0">Customer Service</h2>
          <div className="flex flex-col gap-1">
            <ul>
              <li>
                <Link
                  href="/faq"
                  className="hover:underline hover:text-accent transition-all"
                >
                  Frequently Asked Questions (FAQ)
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="hover:underline hover:text-accent transition-all"
                >
                  Online Support (OS)
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="text-center mt-8">
        &copy; 2024 <span className="text-accent">Ember.</span>&nbsp; Restaurant
        | All rights reserved.
      </div>
    </motion.footer>
  );
};

export default Footer;
