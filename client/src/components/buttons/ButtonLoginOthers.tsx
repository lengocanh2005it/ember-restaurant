"use client";
import Facebook from "@/components/ui/facebook";
import Google from "@/components/ui/google";
import { Button, Tooltip } from "@heroui/react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  const handleLogin = (provider: string) => {
    const baseUrl =
      process.env.NEXT_PUBLIC_NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_BASE_PROD_URL
        : process.env.NEXT_PUBLIC_BASE_DEV_URL;

    router.push(`${baseUrl}/auth/${provider}/login`);
  };

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
              onPress={() => handleLogin(button.provider)}
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
