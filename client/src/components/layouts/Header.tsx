"use client";
import LoginButton from "@/components/buttons/LoginButton";
import RegisterButton from "@/components/buttons/RegisterButton";
import NavbarMobile from "@/components/navbar/NavbarMobile";
import NavbarWelcome from "@/components/navbar/NavbarWelcome";
import UserProfile from "@/components/UserProfile";
import { useAppStore } from "@/store";
import Link from "next/link";
import React from "react";

const Header: React.FC = () => {
  const { accessToken } = useAppStore();

  return (
    <header className="py-8 lg:py-12 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <h1
            className="xl:text-5xl lg:text-4xl md:text-3xl text-2xl hover:scale-[1.1] ease-in-out
          transition-all duration-250"
          >
            Ember<span className="text-accent">.</span>
          </h1>
        </Link>

        <div className="hidden xl:flex items-center gap-8">
          <div className="flex text-[18px] items-center px-4 mx-4">
            <NavbarWelcome />
          </div>
          {accessToken ? (
            <>
              <UserProfile />
            </>
          ) : (
            <>
              <div className="flex items-center justify-between gap-3">
                <LoginButton />
                <RegisterButton />
              </div>
            </>
          )}
        </div>

        <div className="lg:hidden flex">
          <NavbarMobile />
        </div>
      </div>
    </header>
  );
};

export default Header;
