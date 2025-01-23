import React from "react";
import { FullscreenIcon, HandPlatterIcon } from "lucide-react";
import { Button } from "@heroui/react";

const icons = [
  { title: "View Full Menu", icon: <FullscreenIcon />, id: "menu" },
  { title: "Make A Reservation", icon: <HandPlatterIcon />, id: "reservation" },
];

interface ButtonDishesProps {
  buttonStyles: string;
}

const handleClick = (id: string) => {
  document.getElementById(`${id}`)?.scrollIntoView({ behavior: "smooth" });
};

const ButtonDishes: React.FC<ButtonDishesProps> = ({ buttonStyles }) => {
  return (
    <div className="flex gap-5 relative md:flex-row flex-col mx-auto lg:mx-0">
      {icons.map((icon, index) => {
        return (
          <Button
            key={index}
            className={buttonStyles}
            onPress={() => handleClick(icon.id)}
            endContent={icon.icon}
          >
            {icon.title}
          </Button>
        );
      })}
    </div>
  );
};

export default ButtonDishes;
