"use client";
import Announcement from "@/components/Announcement";
import ButtonSwitch from "@/components/buttons/ButtonSwitch";
import CustomerSupport from "@/components/CustomerSupport";
import HomeLinks from "@/components/HomeLinks";
import UserProfile from "@/components/UserProfile";
import SearchInput from "@/components/SearchInput";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { useState } from "react";
import { CiMenuFries } from "react-icons/ci";
import { useAppStore } from "@/store";

const NavbarHomeMobile = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { isAdmin } = useAppStore();

  return (
    <div>
      <div
        className="w-full p-4 flex lg:gap-5 gap-3 
      sm:justify-between lg:flex-row flex-col"
      >
        <UserProfile />

        <div className="flex items-center gap-4 justify-between">
          <div className="flex gap-4 items-center sm:justify-center justify-between">
            <Announcement />
            {!isAdmin && <CustomerSupport />}
          </div>

          <div className="flex items-center justify-between gap-1">
            <ButtonSwitch />

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger
                className="opacity-60 transition-all duration-200 
      hover:opacity-100 flex justify-center items-center ease-in-out"
              >
                <CiMenuFries className="lg:text-2xl text-xl" />
              </SheetTrigger>

              <SheetContent
                className="text-black bg-white border-l-transparent
      flex flex-col items-center gap-1 container dark:bg-primary dark:text-white w-fit"
              >
                <SheetTitle className="flex relative mt-24 mb-12 text-center">
                  <Link href="/">
                    <h1 className="lg:text-5xl text-3xl font-normal">Ember.</h1>
                  </Link>
                </SheetTitle>

                <SheetDescription className="flex flex-col gap-10 items-center text-base">
                  <SearchInput />

                  <HomeLinks setIsOpen={setIsOpen} />
                </SheetDescription>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavbarHomeMobile;
