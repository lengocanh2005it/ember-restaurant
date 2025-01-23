"use client";
import { Tooltip } from "@heroui/react";
import { SquarePenIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

interface EditAdminButtonProps {
  path: string;
}

const EditAdminButton: React.FC<EditAdminButtonProps> = ({ path }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(path);
  };

  return (
    <Tooltip content="Edit" showArrow className="dark:text-white text-black">
      <SquarePenIcon
        onClick={handleClick}
        className="opacity-50 hover:opacity-100 
        ease-in-out duration-250 transition-opacity cursor-pointer select-none"
      />
    </Tooltip>
  );
};

export default EditAdminButton;
