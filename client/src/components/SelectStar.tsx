import React from "react";

// components
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SelectStar = () => {
  return (
    <Select>
      <SelectTrigger className="w-full ease-in-out duration-200 transition-all text-[16px]">
        <SelectValue placeholder="Select star rates" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup className="bg-primary">
          <SelectItem value="1">1</SelectItem>
          <SelectItem value="2">2</SelectItem>
          <SelectItem value="3">3</SelectItem>
          <SelectItem value="4">4</SelectItem>
          <SelectItem value="5">5</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectStar;
