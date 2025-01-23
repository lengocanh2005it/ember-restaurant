import React from "react";
import { UtensilsIcon, CornerRightDown } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@heroui/react";

const buttons = [
  { icon: <UtensilsIcon />, title: "Choose a service" },
  { icon: <CornerRightDown />, title: "Scroll to see details" },
];

const ServiceButton = () => {
  const handleClick = () => {
    toast.error("Please log in to choose a service!", {
      position: "bottom-right",
      style: { backgroundColor: "#dc3545", color: "#fff" },
    });
  };

  return (
    <>
      {buttons.map((button, index) => {
        return (
          <Button
            key={index}
            className={`px-10 py-4 
            text-white font-bold border border-white/30 hover:bg-white/30 text-base`}
            variant="bordered"
            onClick={handleClick}
            endContent={button.icon}
          >
            {button.title}
          </Button>
        );
      })}
    </>
  );
};
export default ServiceButton;
