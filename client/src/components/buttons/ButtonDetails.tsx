"use client";
import React from "react";
import { ShoppingCartIcon, EyeIcon } from "lucide-react";
import { Button } from "@heroui/react";
import { useAppStore } from "@/store";

const buttons = [
  { name: "Add To Cart", icon: <ShoppingCartIcon /> },
  { name: "See Detail", icon: <EyeIcon /> },
];

const ButtonDetails = () => {
  const { setIsClose } = useAppStore();

  const handleClick = (id: string) => {
    document.getElementById(`${id}`)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex items-center lg:gap-4 gap-2 mx-auto lg:flex-row flex-col">
      {buttons.map((button, index) => {
        return (
          <Button
            key={index}
            className="bg-primary border-white/30 border text-white px-6 hover:bg-white/40"
            startContent={button.icon}
            onPress={() => {
              if (button.name === "Add To Cart") {
                handleClick("reservation");
              } else {
                setIsClose(false);
              }
            }}
          >
            {button.name}
          </Button>
        );
      })}
    </div>
  );
};

export default ButtonDetails;
