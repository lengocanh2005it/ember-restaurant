import CreatePromotionForm from "@/components/form/CreatePromotionForm";
import React from "react";

const CreatePromotionPage: React.FC = () => {
  return (
    <main
      className="relative container mx-auto px-8 
    py-4 flex flex-col lg:gap-6 gap-4"
    >
      <div
        className="relative flex flex-col lg:text-base text-[14px] 
      lg:text-left text-center lg:items-start items-center"
      >
        <h1 className="lg:text-2xl text-xl uppercase font-bold">
          New Promotion
        </h1>

        <p className="lg:text-base text-[14px] dark:text-white/80 text-black/80">
          Create a new promotion to attract more customers.
        </p>
      </div>

      <CreatePromotionForm />
    </main>
  );
};

export default CreatePromotionPage;
