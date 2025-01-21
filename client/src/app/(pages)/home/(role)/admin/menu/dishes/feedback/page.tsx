"use client";
import HeaderFeedbackDish from "@/components/HeaderFeedbackDish";
import LoadingPage from "@/components/LoadingPage";
import TableOfReviewDetailsDish from "@/components/table/TableOfReviewDetailsDish";
import { useProduct } from "@/hooks/use-product";
import { Product, ReviewsDetails } from "@/utils/types";
import React, { useEffect, useState, use } from "react";

const FeedbackPage: React.FC = (props: any) => {
  const searchParams = use(props.searchParams) as Record<string, string>;
  const [product, setProduct] = useState<Product | null>(null);
  const [reviewsDetails, setReviewsDetails] = useState<ReviewsDetails[]>([]);

  const { data, isLoading, isError } = useProduct({
    productId: searchParams.id,
    option: "reviews",
  });

  useEffect(() => {
    if (data) {
      setProduct(data as Product);
    }
    if (data && data.reviews) {
      setReviewsDetails(data.reviews as ReviewsDetails[]);
    }
  }, [data]);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <div>Error...</div>;
  }

  return (
    <main
      className="relative container mx-auto px-4 py-6 
    lg:text-base text-[14px] flex flex-col gap-3"
    >
      {product && (
        <>
          <HeaderFeedbackDish product={product} />

          <TableOfReviewDetailsDish
            reviewsDetails={reviewsDetails}
            productId={product.id}
          />
        </>
      )}
    </main>
  );
};

export default FeedbackPage;
