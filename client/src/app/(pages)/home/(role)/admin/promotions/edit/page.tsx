"use client";
import { UpdatePromotionDto } from "@/api/promotions/utils/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useUpdatePromotion } from "@/hooks/use-update-promotion";
import { dateToCalendarDate, calendarDateToDate } from "@/utils";
import { Promotion } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, DatePicker, Input, Textarea } from "@nextui-org/react";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z
  .object({
    title: z
      .string()
      .min(2, { message: "Title must contain at least 2 character(s)." })
      .max(255, {
        message: "The title cannot be longer than 255 character(s).",
      }),
    start_date: z
      .date({ required_error: "Start date is required." })
      .refine((date) => !isNaN(date.getTime()), {
        message: "Invalid Start date.",
      })
      .refine(
        (date) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          date.setHours(0, 0, 0, 0);

          return date >= today;
        },
        {
          message: "Start date must be greater than or equal to current date.",
        }
      ),
    end_date: z
      .date({ required_error: "End date is required." })
      .refine((date) => !isNaN(date.getTime()), {
        message: "Invalid Start date.",
      })
      .refine(
        (date) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          date.setHours(0, 0, 0, 0);

          return date >= today;
        },
        {
          message: "End date must be greater than or equal to current date.",
        }
      ),
    description: z
      .string({ message: "Description is required." })
      .min(2, { message: "Description must contain at least 2 character(s)." }),
    note: z.string().optional(),
    code: z
      .string({ message: "Code is required." })
      .min(1, { message: "Code is required." }),
  })
  .superRefine(({ start_date, end_date }, ctx) => {
    if (start_date > end_date) {
      ctx.addIssue({
        code: "custom",
        message: "End date must be greater than Start date.",
        path: ["end_date"],
      });
    }
  });

const EditPromotionPage: React.FC = () => {
  const query = useQueryClient();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { mutate: mutateUpdatePromotion } = useUpdatePromotion();

  const cachedData = query.getQueryData(["promotion"]) as Promotion;

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { title, description, note, start_date, end_date, code } = values;
    setIsLoading(true);

    const data: UpdatePromotionDto = {
      promotionId: cachedData.id,
      description,
      note,
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      code,
      title,
    };

    setTimeout(() => {
      setIsLoading(false);
      mutateUpdatePromotion(data);
      handleClickCancel();
    }, 2500);
  }

  const handleClickCancel = () => {
    form.reset({
      title: "",
      code: "",
      start_date: undefined,
      end_date: undefined,
      description: "",
      note: "",
    });
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: cachedData?.title ? cachedData.title : "",
      code: cachedData?.code ? cachedData.code : "",
      description: cachedData?.description ? cachedData.description : "",
      start_date: cachedData?.start_date
        ? new Date(cachedData.start_date)
        : undefined,
      end_date: cachedData?.end_date
        ? new Date(cachedData.end_date)
        : undefined,
      note: cachedData?.note ? cachedData.note : "",
    },
  });

  return (
    <section className="relative container mx-auto px-6 py-4 flex flex-col lg:gap-4 gap-2">
      <div className="flex flex-col lg:items-start items-center lg:text-left text-center">
        <h1 className="lg:text-xl text-base font-bold uppercase">
          Edit Promotion
        </h1>

        <p className="lg:text-base text-[14px] dark:text-white/70 text-black/80">
          Update promotion to notify customers.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2 lg:w-[45%] w-full relative mx-auto flex flex-col gap-2
        border dark:border-white/30 border-black/20 p-4 rounded-xl"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-white text-black">
                  Title
                </FormLabel>

                <FormControl>
                  <Input placeholder="Title..." {...field} />
                </FormControl>

                <FormMessage className="dark:text-red-400 text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-white text-black">
                  Code
                </FormLabel>

                <FormControl>
                  <Input placeholder="Code..." {...field} />
                </FormControl>

                <FormMessage className="dark:text-red-400 text-red-500" />
              </FormItem>
            )}
          />

          <div className="grid lg:grid-cols-2 grid-cols-1 gap-2">
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-white">Start Date</FormLabel>
                  <FormControl>
                    <DatePicker
                      isRequired
                      aria-labelledby="startDate"
                      value={
                        field.value ? dateToCalendarDate(field.value) : null
                      }
                      onChange={(dateValue) => {
                        field.onChange(
                          dateValue ? calendarDateToDate(dateValue) : null
                        );
                      }}
                    />
                  </FormControl>
                  <FormMessage className="dark:text-red-400 text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="end_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-white">Due Date</FormLabel>
                  <FormControl>
                    <DatePicker
                      isRequired
                      aria-labelledby="dueDate"
                      value={
                        field.value ? dateToCalendarDate(field.value) : null
                      }
                      onChange={(dateValue) => {
                        field.onChange(
                          dateValue ? calendarDateToDate(dateValue) : null
                        );
                      }}
                    />
                  </FormControl>
                  <FormMessage className="dark:text-red-400 text-red-500" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-white text-black">
                  Description
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Description..."
                    {...field}
                    aria-labelledby="description"
                  />
                </FormControl>
                <FormMessage className="dark:text-red-400 text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-white text-black">
                  Note
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="You can skip if you don't have any note about the promotion."
                    {...field}
                    aria-labelledby="note"
                  />
                </FormControl>
                <FormMessage className="dark:text-red-400 text-red-500" />
              </FormItem>
            )}
          />

          <div className="flex sm:flex-row flex-col gap-2 items-center justify-center w-fit mx-auto">
            <Button
              type="button"
              color="primary"
              className="w-fit mx-auto dark:bg-white dark:text-black"
              onPress={handleClickCancel}
            >
              Cancel
            </Button>

            {isLoading ? (
              <>
                <Button
                  color="primary"
                  className="w-fit mx-auto dark:bg-white dark:text-black"
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
          </div>
        </form>
      </Form>
    </section>
  );
};

export default EditPromotionPage;
