"use client";
import { CreateReviewDto } from "@/api/reviews/utils/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ReviewEnum } from "@/config/enums/enums";
import { useAddReview } from "@/hooks/use-add-review";
import { useAppStore, useUserStore } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Select, SelectItem, Textarea } from "@heroui/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  comment: z.string().min(1, {
    message: "Review must be at least 1 characters.",
  }),
  ratingNumber: z.preprocess((val) => {
    if (val === "" || val === undefined || val === null) {
      return undefined;
    }
    return Number(val);
  }, z.number({ message: "Invalid rating number." }).min(1, "Rating must be at least 1.")),
});

const ratings = [
  { key: "1", label: "1" },
  { key: "2", label: "2" },
  { key: "3", label: "3" },
  { key: "4", label: "4" },
  { key: "5", label: "5" },
];

const OrdersReservationsPointsWithReview: React.FC = () => {
  const { isAdmin } = useAppStore();
  const { user } = useUserStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { mutate: mutateAddReview } = useAddReview();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: "",
      ratingNumber: 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { ratingNumber, comment } = values;

    const data: CreateReviewDto = {
      type: ReviewEnum.RESTAURANT,
      userId: user?.id!,
      comment,
      rating_number: ratingNumber,
      date: new Date(),
    };

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      mutateAddReview(data);
      form.reset({
        comment: "",
        ratingNumber: undefined,
      });
    }, 2500);
  }

  return (
    <>
      {!isAdmin && (
        <>
          <section className="relative mx-auto py-6 px-4 flex flex-col lg:gap-4 gap-2">
            <div
              className="relative flex flex-col lg:items-start lg:justify-start lg:text-left
           items-center justify-center text-center"
            >
              <h1 className="lg:text-2xl text-xl font-bold md:text-left text-center">
                Your Reviews
              </h1>

              <p className="lg:text-base text-[14px] dark:text-white/70 text-black/80">
                Your review helps us create the best experience for you and
                others.
              </p>
            </div>

            <div
              className="relative lg:w-1/2 w-full mx-auto bg-white border
         dark:border-white/40 rounded-xl shadow-custom p-4
          dark:bg-primary dark:text-white 
        flex flex-col gap-2"
            >
              <div className="flex flex-col text-base items-center text-center">
                <h2 className="lg:text-2xl text-xl font-bold text-center">
                  Leave a Review
                </h2>

                <p
                  className="lg:text-base text-[14px] 
                text-center dark:text-white/70 text-black/70"
                >
                  If you&apos;ve already experienced the restaurant, don&apos;t
                  hesitate to share your own experience!
                </p>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-2"
                >
                  <FormField
                    control={form.control}
                    name="ratingNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dark:text-white text-black">
                          Rating Number
                        </FormLabel>
                        <FormControl>
                          <Select
                            items={ratings}
                            label="Select rating number"
                            className="dark:text-white"
                            aria-labelledby="rating"
                            selectedKeys={
                              field.value !== undefined ? [field.value] : []
                            }
                            onSelectionChange={(keys) => {
                              const selectedKey = Array.from(keys)[0];
                              field.onChange(Number(selectedKey));
                            }}
                            {...field}
                          >
                            {(ratings) => (
                              <SelectItem
                                key={ratings.key}
                                className="text-black dark:text-white"
                                aria-labelledby="rating"
                              >
                                {ratings.label}
                              </SelectItem>
                            )}
                          </Select>
                        </FormControl>
                        <FormMessage className="dark:text-red-300 text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="comment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dark:text-white text-black">
                          Your Review
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Write your reviews about our restaurant..."
                            {...field}
                            aria-labelledby="review"
                          />
                        </FormControl>
                        <FormMessage className="dark:text-red-300 text-red-500" />
                      </FormItem>
                    )}
                  />

                  {isLoading ? (
                    <>
                      <Button type="button" className="w-fit mx-auto" isLoading>
                        Please wait...
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        type="submit"
                        color="primary"
                        className="w-fit dark:bg-white dark:text-black text-white
                         mx-auto"
                      >
                        Submit
                      </Button>
                    </>
                  )}
                </form>
              </Form>
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default OrdersReservationsPointsWithReview;
