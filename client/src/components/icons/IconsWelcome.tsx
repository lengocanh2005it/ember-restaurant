"use client";
import React from "react";
import Link from "next/link";
import { FaComments } from "react-icons/fa";
import {
  HeadsetIcon,
  PhoneCallIcon,
  MessageCircleMoreIcon,
} from "lucide-react";

const icons = [
  {
    icon: <HeadsetIcon />,
    path: "/help",
  },
  {
    icon: <PhoneCallIcon />,
    path: "/phone",
  },
  {
    icon: <MessageCircleMoreIcon />,
    path: "/chat",
  },
];

const IconsWelcome = ({
  IconStyles,
  ContainerStyles,
}: {
  IconStyles: string;
  ContainerStyles: string;
}) => {
  return (
    <div className={ContainerStyles}>
      {icons.map((icon, index) => {
        return (
          <Link key={index} href={icon.path} className={IconStyles}>
            {icon.icon}
          </Link>
        );
      })}
    </div>
  );
};

export default IconsWelcome;
