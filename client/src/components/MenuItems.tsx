"use client";
import ButtonOrder from "@/components/buttons/ButtonOrder";
import ModalRatingDish from "@/components/modal/ModalRatingDish";
import ModalViewItemMenu from "@/components/modal/ModalViewItemMenu";
import { Separator } from "@/components/ui/separator";
import { useAppStore } from "@/store";
import { Product } from "@/utils/types";
import { Chip, Tooltip } from "@heroui/react";
import { CircleAlertIcon, TagIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

interface MenuItemProps {
  item: Product;
}

const categoryMap: Record<string, string> = {
  appetizer: "Appetizer",
  dessert: "Dessert",
  main_course: "Main Course",
  snack: "Snack",
  signature_dishes: "Signature Dishes",
  beverage: "Beverage",
  hotpot: "Hot Pot",
};

const MenuItems: React.FC<MenuItemProps> = ({ item }) => {
  const { isAdmin } = useAppStore();

  const router = useRouter();

  const handleClick = () => {
    router.push(`/home/admin/menu/dishes/feedback/?id=${item.id}`);
  };

  return (
    <div
      className="border border-black/10 dark:border-white/40 rounded-2xl shadow-custom
       hover:shadow-custom_hover px-4 py-4 flex flex-col 
    justify-between group cursor-pointer ease-in-out gap-2
    transition-all duration-300 dark:bg-primary dark:text-white"
    >
      <ModalViewItemMenu product={item} />

      <Separator className="px-6" />

      <div
        className={`flex flex-col gap-2 lg:text-base text-[14px] ${
          item.stock === 0
            ? "opacity-50 pointer-events-none"
            : "opacity-100 pointer-events-auto"
        }`}
      >
        <div className="flex items-center gap-1 lg:text-[14px] text-[13px]">
          <Tooltip content="Category" className="dark:text-white text-black">
            <TagIcon size={15} />
          </Tooltip>
          <p>{categoryMap[item.category]}</p>
        </div>

        <h3 className="text-base font-bold lg:text-left text-center">
          {item.name}
        </h3>

        <p
          className="text-gray-600 dark:text-white/50 lg:text-[14px] 
        text-[12px] lg:text-left text-center"
        >
          {item.description}
        </p>

        <div
          className="text-black/80 font-semibold dark:text-white/80 flex lg:flex-row flex-col
        items-center gap-1"
        >
          <p>Price:</p>
          <p className="lg:text-2xl text-xl text-green-600 dark:text-green-400">
            {item.price}$
          </p>
        </div>

        <div
          className="text-black/80 font-semibold dark:text-white/80 flex lg:flex-row flex-col
        items-center gap-1"
        >
          <p className="lg:text-[14px] text-[13px]">Items in Stock:</p>
          <p className="lg:text-base text-[15px]">{item.stock}</p>
        </div>
      </div>

      <div
        className={`flex lg:flex-row flex-col gap-3 ${
          !isAdmin && "items-center"
        } justify-start ${
          isAdmin ? "justify-between items-center" : "justify-between"
        } ${item.stock === 0 && "opacity-50"}`}
      >
        {isAdmin && (
          <Chip
            color="primary"
            className="dark:bg-white dark:text-black hover:opacity-100 opacity-60
          duration-300 ease-in-out transition-opacity cursor-pointer"
            onClick={handleClick}
          >
            View Reviews
          </Chip>
        )}

        {item.stock !== 0 && (
          <Tooltip
            content="Average Rating"
            className="dark:text-white text-black"
          >
            <p className="lg:text-2xl text-xl">
              {item?.average_rating ? item.average_rating : 0}⭐
            </p>
          </Tooltip>
        )}

        {isAdmin && item.stock === 0 && (
          <Tooltip
            content="The item is out of stock."
            className="text-white w-fit"
            color="primary"
          >
            <CircleAlertIcon
              className="cursor-pointer opacity-70 hover:opacity-100 duration-300 ease-in-out
                      transition-all"
            />
          </Tooltip>
        )}

        {!isAdmin && (
          <>
            <div className="relative flex items-center gap-2 lg:flex-row flex-col-reverse">
              <ModalRatingDish product={item} />

              {item.stock === 0 ? (
                <>
                  <Tooltip
                    content="The dish is out of stock. We will restock it as soon as possible!"
                    className="text-white"
                    color="primary"
                  >
                    <CircleAlertIcon
                      className="cursor-pointer opacity-70 hover:opacity-100 duration-300 ease-in-out
                    transition-all"
                    />
                  </Tooltip>
                </>
              ) : (
                <ButtonOrder product={item} />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MenuItems;
