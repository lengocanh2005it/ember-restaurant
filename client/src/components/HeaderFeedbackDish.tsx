import { Product } from "@/utils";
import Image from "next/image";
import React from "react";

interface HeaderFeedbackDishProps {
  product: Product;
}

const HeaderFeedbackDish: React.FC<HeaderFeedbackDishProps> = ({ product }) => {
  return (
    <div className="relative flex flex-col gap-2">
      <div
        className="flex flex-col lg:items-start items-center lg:justify-start 
        justify-center lg:text-left text-center"
      >
        <h1 className="lg:text-2xl text-xl uppercase font-bold">
          Reviews of the dish
        </h1>

        <p className="lg:text-base text-[14px] dark:text-white/70 text-black/80">
          Below is the list of customers who have reviewed this dish.
        </p>
      </div>

      <div className="relative flex items-center lg:gap-4 gap-1 lg:flex-row flex-col lg:px-10 px-0">
        <div className="relative lg:w-[10vw] lg:h-[20vh] w-[35vw] h-[25vh]">
          {product.image && (
            <Image
              src={product.image}
              alt=""
              priority
              fill
              sizes="(max-width:600px) 100vw, 50vw"
              className="select-none"
            />
          )}
        </div>

        <div className="flex flex-col gap-2 lg:text-left text-center">
          <h1 className="lg:text-xl text-base font-bold uppercase">
            {product?.name ? product.name : ""}
          </h1>

          <p className="lg:text-base text-[14px] dark:text-white/70 text-black/70 break-words">
            {product?.description ? product.description : ""}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeaderFeedbackDish;
