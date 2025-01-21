import React from "react";
import ListReviewsOffCustomers from "@/components/ListReviewsOffCustomers";

const ReviewsPage: React.FC = () => {
  return (
    <main className="relative container mx-auto px-4 py-6 flex flex-col lg:gap-4 gap-2">
      <div
        className="flex flex-col lg:items-start items-center lg:justify-start 
        justify-center lg:text-left text-center"
      >
        <h1 className="lg:text-2xl text-xl uppercase font-bold">All reviews</h1>

        <p className="lg:text-base text-[14px] dark:text-white/70 text-black/80">
          Below is the list of customers. Please click on them to see their
          reviews in detail.
        </p>
      </div>

      <ListReviewsOffCustomers />
    </main>
  );
};

export default ReviewsPage;
