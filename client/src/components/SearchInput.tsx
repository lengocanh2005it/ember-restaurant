"use client";
import { Input } from "@nextui-org/react";
import { SearchIcon } from "lucide-react";

export default function SearchInput() {
  return (
    <div className="lg:w-[300px] w-[250px]">
      <Input
        label="Search"
        isClearable
        radius="lg"
        classNames={{
          label: "text-black/50 dark:text-white/90",
          input: [
            "bg-transparent",
            "text-black/90 dark:text-white/90",
            "placeholder:text-default-700/50 dark:placeholder:text-white/60",
          ],
        }}
        aria-labelledby="search"
        aria-label="search"
        placeholder="Search everything..."
        startContent={
          <SearchIcon
            width={20}
            height={20}
            className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 
            pointer-events-none flex-shrink-0"
          />
        }
      />
    </div>
  );
}
