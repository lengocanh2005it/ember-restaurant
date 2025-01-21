"use client";
import React from "react";
import { Select, SelectItem } from "@nextui-org/react";
import { useAppStore } from "@/store";

type Category = {
  key: string;
  label: string;
};

const categories: Category[] = [
  { key: "all", label: "All" },
  { key: "appetizer", label: "Appetizers" },
  { key: "dessert", label: "Desserts" },
  { key: "hotpot", label: "Hot Pots" },
  { key: "main_course", label: "Main Courses" },
  { key: "beverage", label: "Beverages" },
  { key: "signature_dishes", label: "Signature Dishes" },
  { key: "snack", label: "Snacks" },
];

const Categories: React.FC = () => {
  const { setCategory } = useAppStore();

  return (
    <Select
      items={categories}
      label="Choose Category"
      placeholder="Select a specific category"
      defaultSelectedKeys={["all"]}
      onChange={(e) => {
        setCategory(e.target.value);
      }}
      className="dark:bg-primary dark:text-white"
    >
      {(category) => (
        <SelectItem key={category.key} className="text-black dark:text-white">
          {category.label}
        </SelectItem>
      )}
    </Select>
  );
};

export default Categories;
