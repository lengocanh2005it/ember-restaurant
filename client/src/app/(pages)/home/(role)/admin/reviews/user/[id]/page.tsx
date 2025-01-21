"use client";
import LoadingPage from "@/components/LoadingPage";
import ReviewDetailsOfCustomer from "@/components/ReviewDetailsOfCustomer";
import { useReviewsByUserId } from "@/hooks/use-reviews-of-user";
import { Review } from "@/utils";
import { Pagination } from "@nextui-org/react";
import React, { useEffect, useMemo, useState, use } from "react";

const ReviewDetails: React.FC = (props: any) => {
  const params = use(props.params) as Record<string, string>;

  const [reviews, setReviews] = useState<Review[]>([]);
  const itemsPerPage = 4;
  const [page, setPage] = useState<number>(1);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const { data, isLoading, isError } = useReviewsByUserId(params.id);

  useEffect(() => {
    if (data) {
      setReviews(data as Review[]);
    }
  }, [data]);

  useEffect(() => {
    if (reviews && reviews.length > 0) {
      const initialCheckedItems = reviews.reduce(
        (acc, review) => ({
          ...acc,
          [review.id]: review.is_featured || false,
        }),
        {}
      );
      setCheckedItems(initialCheckedItems);
    }
  }, [reviews]);

  const totalPage = useMemo(() => {
    return Math.ceil(reviews?.length / itemsPerPage) ?? 0;
  }, [reviews]);

  const items = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    return reviews?.slice(start, end) ?? [];
  }, [page, reviews]);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <div>Error...</div>;
  }

  return (
    <main className="overflow-x-hidden flex flex-col gap-2 lg:container mx-auto lg:px-6 py-4">
      <div
        className="flex flex-col lg:items-start items-center lg:justify-start 
        justify-center lg:text-left text-center"
      >
        <h1 className="lg:text-2xl text-xl uppercase font-bold">
          Review Details Of Customer
        </h1>

        <p className="lg:text-base text-[14px] dark:text-white/70 text-black/80">
          Below is the list of reviews of customer. Please click on them to see
          them.
        </p>
      </div>

      <ReviewDetailsOfCustomer
        reviews={items}
        userId={params.id as string}
        checkedItems={checkedItems}
        setCheckedItems={setCheckedItems}
      />

      {reviews.length !== 0 && (
        <div className="flex flex-col lg:justify-start lg:items-start justify-center items-center">
          <Pagination
            initialPage={page}
            total={totalPage}
            onChange={(page) => setPage(page)}
            showControls
            showShadow
            isCompact
            classNames={{
              cursor: "dark:bg-white dark:text-black",
            }}
            loop
          />
        </div>
      )}
    </main>
  );
};

export default ReviewDetails;
