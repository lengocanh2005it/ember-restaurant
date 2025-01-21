"user client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

const NavbarWelcome = () => {
  const pathName = usePathname();
  return (
    <nav className="flex gap-8">
      {links.map((link, index) => {
        return (
          <Link
            key={index}
            href={link.path}
            className={`${
              link.path === pathName && "text-accent border-accent border-b-2"
            } capitalize font-medium hover:text-accent transition-all`}
          >
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
};

export default NavbarWelcome;
