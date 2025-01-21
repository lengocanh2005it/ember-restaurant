"use client";
import LoginButton from "@/components/buttons/LoginButton";
import RegisterButton from "@/components/buttons/RegisterButton";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CiMenuFries } from "react-icons/ci";
const links = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Services",
    path: "/services",
  },
  {
    name: "Dishes",
    path: "/dishes",
  },
  {
    name: "Review",
    path: "/review",
  },
  {
    name: "About",
    path: "/about",
  },
];

const NavbarMobile = () => {
  const pathName = usePathname();

  return (
    <div>
      <Sheet>
        <SheetTrigger
          className="opacity-60 transition-all duration-200 
      hover:opacity-100 flex justify-center items-center dark:text-white"
        >
          <CiMenuFries className="text-accent text-2xl" />
        </SheetTrigger>

        <SheetContent
          className="text-white bg-primary border-l-transparent
      flex flex-col items-center gap-6 justify-center"
          aria-describedby="ember"
        >
          <SheetTitle className="text-white">
            <div className="flex relative mt-24 mb-8 text-center">
              <Link href="/">
                <h1 className="text-5xl font-normal">
                  Ember<span className="text-accent">.</span>
                </h1>
              </Link>
            </div>
          </SheetTitle>

          <nav className="flex flex-col text-xl gap-8 items-center justify-center relative">
            {links.map((link, index) => {
              return (
                <Link
                  href={link.path}
                  key={index}
                  className={`
                text-xl capitalize hover:text-accent transition-all
                ${
                  link.path === pathName &&
                  "text-accent border-b-2 border-accent"
                }
              `}
                >
                  {link.name}
                </Link>
              );
            })}

            <SheetDescription className="mt-4 w-full relative">
              <div
                className="flex lg:flex-row flex-col gap-4 w-full 
            items-center justify-between"
              >
                <LoginButton />
                <RegisterButton />
              </div>
            </SheetDescription>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default NavbarMobile;
