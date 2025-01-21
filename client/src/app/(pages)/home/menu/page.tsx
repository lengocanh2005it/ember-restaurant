"use client";
import React from "react";
import MenuList from "@/components/MenuList";

const MenuPage: React.FC = () => {
  return (
    <div className="w-full container dark:bg-primary dark:text-white">
      <MenuList />
    </div>
  );
};

export default MenuPage;
