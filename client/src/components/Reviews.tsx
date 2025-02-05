"use client";
import EditAdminButton from "@/components/EditAdminButton";
import LoadingPage from "@/components/LoadingPage";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useReviews } from "@/hooks/use-reviews";
import { useAppStore } from "@/store";
import { Review } from "@/utils";
import { format } from "date-fns";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const ReviewSlider: React.FC = () => {
  const { isAdmin } = useAppStore();
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );
  const [reviews, setReviews] = useState<Review[]>([]);

  const { data, isLoading, isError } = useReviews("true");

  useEffect(() => {
    if (data) {
      setReviews(data as Review[]);
    }
  }, [data]);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <div>Error...</div>;
  }

  return (
    <section className="w-full container mx-auto py-6 relative flex flex-col lg:gap-4 gap-2">
      <div
        className="relative flex flex-col lg:items-start lg:justify-start 
        lg:text-left items-center justify-center text-center"
      >
        <div className="flex lg:flex-row flex-col lg:gap-1 items-center">
          <h1 className="lg:text-2xl text-xl font-semibold md:text-left text-center">
            Customer Reviews
          </h1>

          {isAdmin && <EditAdminButton path="/home/admin/reviews" />}
        </div>

        <p className="lg:text-base text-[14px] dark:text-white/70 text-black/80">
          See why our customers keep coming back and what they love most about
          us.
        </p>
      </div>

      {reviews && reviews.length !== 0 ? (
        <Carousel
          plugins={[plugin.current]}
          className="w-full max-w-xl mx-auto relative"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent className="flex">
            {reviews.map((review) => (
              <CarouselItem
                key={review.id}
                className="relative w-full max-w-full"
              >
                <div className="relative select-none cursor-pointer rounded-xl">
                  <Card className="w-full rounded-xl border dark:border-white/20 border-black/20">
                    <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                      <div className="flex flex-col items-center mb-4">
                        <div
                          className="relative w-20 h-20 bg-gray-100 
                        rounded-full flex items-center justify-center"
                        >
                          {review.user && review.user.image && (
                            <Image
                              src={review.user.image}
                              alt=""
                              priority
                              sizes="(max-width: 600px) 100vw, 50vw"
                              fill
                              className="object-cover rounded-full select-none"
                            />
                          )}
                        </div>
                        <div className="mt-2">
                          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                            {review?.user?.name
                              ? review?.user.name
                              : review.user.username}
                          </h3>
                          <h4 className="text-[14px]text-black/60 italic dark:text-white/60">
                            Loyalty Customer
                          </h4>
                          <p className="text-black/70 text-sm dark:text-white/80">
                            {format(review.date, "dd/MM/yyyy")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center mb-4">
                        <span className="text-yellow-500 text-xl">
                          {"★".repeat(review.rating_number)}
                        </span>
                        <span className="text-gray-300 text-xl">
                          {"★".repeat(5 - review.rating_number)}
                        </span>
                      </div>
                      <p className="text-black/80 text-base dark:text-white/80">
                        &quot;{review.comment}&quot;
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            className="absolute xl:left-[-50px] md:left-[-50px] left-0 
          opacity-50 hover:opacity-100"
          />

          <CarouselNext
            className="absolute xl:right-[-50px] md:right-[-50px] right-0 
          opacity-50 hover:opacity-100"
          />
        </Carousel>
      ) : (
        <>
          <div className="flex flex-col gap-1  relative items-center text-center justify-center">
            <h1 className="lg:text-xl text-base uppercase font-bold">
              Empty Featured Reviews
            </h1>

            {isAdmin ? (
              <>
                <p className="lg:text-base text-[15px] dark:text-white/60 text-black/70">
                  There are currently no featured reviews from customers. Please
                  wait for their feedback!
                </p>
              </>
            ) : (
              <>
                <p className="lg:text-base text-[15px] dark:text-white/60 text-black/70">
                  This restaurant currently has no featured customer reviews.
                  Please visit regularly or leave a review below to share your
                  feedback for Ember.
                </p>
              </>
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default ReviewSlider;
