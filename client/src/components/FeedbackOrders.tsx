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
import { useAddReview } from "@/hooks/use-add-review";
import { useUserStore } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Select, SelectItem, Textarea } from "@nextui-org/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  description: z
    .string()
    .min(1, { message: "Feedback must be at least 1 character(s)." }),
  orderIds: z
    .string({ message: "Please choose at least 1 Order ID." })
    .min(1, { message: "Please choose at least 1 Order ID." }),
});

interface FeedbackOrdersProps {
  orders: string[];
}

const FeedbackOrders: React.FC<FeedbackOrdersProps> = ({ orders }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const orderIds = orders.map((order) => ({
    key: order,
    label: "#" + order,
  }));

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      orderIds: "",
      description: "",
    },
  });

  const { mutate: mutateAddReview } = useAddReview();

  const { user } = useUserStore();

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { description, orderIds } = values;
    setIsLoading(true);

    const data: CreateReviewDto = {
      orderIds: orderIds.split(","),
      comment: description,
      userId: user?.id!,
      date: new Date(),
      type: "order",
    };

    setTimeout(() => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        mutateAddReview(data);
      });
      form.reset({
        description: "",
        orderIds: "",
      });
    }, 2500);
  }

  return (
    <div
      className="bg-white p-4 flex flex-col gap-4 dark:bg-primary dark:text-white
     lg:w-[45%] w-full mx-auto border dark:border-white/30 shadow-custom rounded-xl lg:mb-6 mb-4"
    >
      <div className="flex flex-col xl:text-left text-center items-center">
        <h2 className="lg:text-2xl text-xl font-bold text-black dark:text-white">
          Order Feedback
        </h2>

        <p className="lg:text-base text-[15px] dark:text-white/80 text-black/80">
          Please leave your feedback about your orders.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-2"
          >
            <FormField
              control={form.control}
              name="orderIds"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel className="dark:text-white text-black">
                    Your Orders
                  </FormLabel>

                  <FormControl>
                    <Select
                      items={orderIds}
                      placeholder="Select your OrderID"
                      className="dark:text-white text-black"
                      selectionMode="multiple"
                      aria-labelledby="orders-id"
                      selectedKeys={field.value ? field.value.split(",") : []}
                      onSelectionChange={(keys) =>
                        field.onChange(Array.from(keys).join(","))
                      }
                      {...field}
                    >
                      {(id) => (
                        <SelectItem
                          key={id.key}
                          className="dark:text-white text-black"
                          aria-labelledby="orders-id"
                        >
                          {id.label}
                        </SelectItem>
                      )}
                    </Select>
                  </FormControl>

                  <FormMessage className="dark:text-red-400 text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-white text-black">
                    Feedback
                  </FormLabel>

                  <FormControl>
                    <Textarea
                      placeholder="Your feedback..."
                      {...field}
                      aria-labelledby="feedback"
                      aria-label="feedback"
                    />
                  </FormControl>

                  <FormMessage className="dark:text-red-400 text-red-500" />
                </FormItem>
              )}
            />

            {isLoading ? (
              <>
                <Button
                  color="primary"
                  className="dark:bg-white text-black w-fit mx-auto"
                  isLoading
                >
                  Please wait...
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="primary"
                  type="submit"
                  className="dark:bg-white dark:text-black text-white w-fit mx-auto"
                  aria-labelledby="submit"
                >
                  Submit
                </Button>
              </>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
};

export default FeedbackOrders;
