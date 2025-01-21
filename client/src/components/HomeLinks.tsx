"use client";
import Link from "next/link";
import React, { Dispatch, SetStateAction } from "react";
import { usePathname } from "next/navigation";
import {
  HouseIcon,
  MenuIcon,
  HandPlatterIcon,
  ShoppingCartIcon,
  ShieldIcon,
} from "lucide-react";
import { useAppStore } from "@/store";

interface HomeLinksProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const HomeLinks: React.FC<HomeLinksProps> = ({ setIsOpen }) => {
  const pathName = usePathname();
  const { isAdmin } = useAppStore();

  const links = [
    { name: "Home", path: "/home", icon: <HouseIcon size={20} /> },
    { name: "Menu", path: "/home/menu", icon: <MenuIcon size={20} /> },
    ...(isAdmin
      ? []
      : [
          {
            name: "Reservations",
            path: "/home/reservations",
            icon: <HandPlatterIcon size={20} />,
          },
        ]),
    ...(isAdmin
      ? []
      : [
          {
            name: "Orders",
            path: "/home/orders",
            icon: <ShoppingCartIcon size={20} />,
          },
        ]),
    ...(isAdmin
      ? [
          {
            name: "Admin Page",
            path: "/home/admin",
            icon: <ShieldIcon />,
          },
        ]
      : []),
  ];

  return (
    <div
      className="flex md:gap-8 gap-4 items-center justify-between cursor-pointer 
    md:flex-row flex-col"
    >
      {links.map((link, index) => {
        return (
          <div key={index} className="flex flex-col items-center">
            {link.icon}
            <Link
              href={link.path}
              className={`text-[18px]font-medium ${
                pathName === link.path ? "border-b-3 border-accent" : ""
              }`}
              onClick={() =>
                setTimeout(() => {
                  setIsOpen(false);
                }, 1000)
              }
            >
              {link.name}
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default HomeLinks;
