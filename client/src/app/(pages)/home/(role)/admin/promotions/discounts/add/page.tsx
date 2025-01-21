import DiscountForm from "@/components/form/DiscountForm";
import React from "react";

const AddDiscountPage: React.FC = () => {
  return (
    <section
      className="relative container mx-auto lg:px-8 
  py-4 flex flex-col lg:gap-6 gap-4"
    >
      <div
        className="flex flex-col lg:items-start items-center lg:justify-start 
        justify-center lg:text-left text-center"
      >
        <h1 className="lg:text-2xl text-xl uppercase font-bold">
          New Discount
        </h1>

        <p className="lg:text-base text-[14px] dark:text-white/70 text-black/80">
          Create a new discount to attract more customers.
        </p>
      </div>

      <DiscountForm />
    </section>
  );
};

export default AddDiscountPage;
