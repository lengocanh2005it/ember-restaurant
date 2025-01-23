"use client";
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button, Select, SelectItem, Textarea } from "@heroui/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAddReview } from "@/hooks/use-add-review";
import { CreateReviewDto } from "@/api/reviews/utils/types";
import { useUserStore } from "@/store";

const formSchema = z.object({
  comment: z
    .string({ message: "Comment must be a string." })
    .min(1, { message: "Comment must be at least 1 characters." }),
  reservationIds: z
    .string({ message: "Please choose at least 1 reservation ID." })
    .min(1, {
      message: "Please choose at least 1 reservation ID.",
    }),
});

interface FeedbackReservationFormProps {
  reservations: string[];
}

const FeedbackReservationForm: React.FC<FeedbackReservationFormProps> = ({
  reservations,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useUserStore();

  const reservationIds = reservations.map((reservation) => ({
    key: reservation,
    label: "#" + reservation,
  }));

  const { mutate: mutateAddReview } = useAddReview();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: "",
      reservationIds: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { comment, reservationIds } = values;

    setIsLoading(true);

    const data: CreateReviewDto = {
      userId: user?.id!,
      reservationIds: reservationIds.split(","),
      comment,
      type: "reservation",
      date: new Date(),
    };

    setTimeout(() => {
      setIsLoading(false);
      mutateAddReview(data);
    }, 2500);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 w-full flex flex-col"
      >
        <FormField
          control={form.control}
          name="reservationIds"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="dark:text-white text-black">
                Your Reservations
              </FormLabel>

              <FormControl>
                <Select
                  items={reservationIds}
                  placeholder="Select your reservationId"
                  className="dark:text-white text-black"
                  selectionMode="multiple"
                  aria-labelledby="reservations-id"
                  {...field}
                >
                  {(id) => (
                    <SelectItem
                      key={id.key}
                      className="dark:text-white text-black"
                      aria-labelledby="reservations-id"
                    >
                      {id.label}
                    </SelectItem>
                  )}
                </Select>
              </FormControl>

              <FormMessage className="dark:text-red-300 text-red-400" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="dark:text-white text-black">
                Feedback
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Your feedback..."
                  {...field}
                  aria-labelledby="comment"
                  aria-label="comment"
                />
              </FormControl>
              <FormMessage className="dark:text-red-300 text-red-500" />
            </FormItem>
          )}
        />

        {isLoading ? (
          <>
            <Button
              type="button"
              color="primary"
              className="w-fit mx-auto dark:bg-white dark:text-black text-white"
              isLoading
            >
              Please wait...
            </Button>
          </>
        ) : (
          <>
            <Button
              type="submit"
              color="primary"
              className="w-fit mx-auto dark:bg-white dark:text-black text-white"
            >
              Submit
            </Button>
          </>
        )}
      </form>
    </Form>
  );
};

export default FeedbackReservationForm;
