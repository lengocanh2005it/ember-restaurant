"use client";
import Facebook from "@/components/ui/facebook";
import Google from "@/components/ui/google";
import { Button, Tooltip } from "@heroui/react";
import { signIn } from "next-auth/react";
import React from "react";

const buttons = [
  {
    icon: <Google />,
    provider: "google",
    name: "Google",
  },
  {
    icon: <Facebook />,
    provider: "facebook",
    name: "Facebook",
  },
];

const ButtonLoginOthers: React.FC = () => {
  return (
    <React.Fragment>
      {buttons.map((button, index) => {
        return (
          <Tooltip
            key={index}
            content={button.name}
            className="dark:text-white text-black"
          >
            <Button
              onPress={() => signIn(button.provider)}
              isIconOnly
              className="rounded-full bg-white flex items-center justify-center"
            >
              {button.icon}
            </Button>
          </Tooltip>
        );
      })}
    </React.Fragment>
  );
};

export default ButtonLoginOthers;
