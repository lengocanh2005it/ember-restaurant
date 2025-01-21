"use client";
import React from "react";
import UserProfile from "@/components/UserProfile";
import Logo from "@/components/Logo";
import HomeLinks from "@/components/HomeLinks";
import SearchInput from "@/components/SearchInput";
import Announcement from "@/components/Announcement";
import ButtonSwitch from "@/components/buttons/ButtonSwitch";
import CustomerSupport from "@/components/CustomerSupport";
import { useAppStore } from "@/store";

const NavbarHome: React.FC = () => {
  const { isAdmin } = useAppStore();

  return (
    <div
      className="w-full sticky top-0 h-fit lg:px-6 md:px-8 container xl:py-2 flex items-center
     justify-between gap-4 border-b border-black/10 dark:border-white/10"
    >
      <Logo />
      <HomeLinks setIsOpen={() => {}} />

      <div className="flex items-center gap-8 justify-between">
        <div className="flex items-center gap-6">
          <SearchInput />
          {!isAdmin && <CustomerSupport />}
          <Announcement />
          <ButtonSwitch />
        </div>

        <UserProfile />
      </div>
    </div>
  );
};

export default NavbarHome;
