"use client";
import { CreateDiscountDto } from "@/api/discounts/utils/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { currencies, types } from "@/config/constants";
import { useAddDiscount } from "@/hooks/use-add-discount";

import { calendarDateToDate, dateToCalendarDate } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  DatePicker,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z
  .object({
    type: z.enum(["percentage", "fixed"], {
      message: "Please choose a valid type.",
    }),
    value: z.preprocess((val) => {
      if (typeof val === "string") {
        return parseFloat(val);
      }
      return val;
    }, z.number({ message: "Value must be a number!" }).positive({ message: "Value must be positive number!" })),
    currency: z.enum(["vnd", "usd"], {
      message: "Please choose a valid currency.",
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
    due_date: z
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
    description: z.string().optional(),
  })
  .superRefine(({ start_date, due_date }, ctx) => {
    if (start_date > due_date) {
      ctx.addIssue({
        code: "custom",
        message: "End date must be greater than Start date.",
        path: ["end_date"],
      });
    }
  });

const DiscountForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: undefined,
      currency: undefined,
      value: 0,
      start_date: undefined,
      due_date: undefined,
      description: "",
    },
  });

  const { mutate: mutateAddDiscount } = useAddDiscount();

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const { type, value, description, start_date, due_date, currency } = values;

    const data: CreateDiscountDto = {
      type: type as any,
      value,
      description,
      start_date,
      end_date: due_date,
      currency,
    };
    setTimeout(() => {
      setIsLoading(false);
      mutateAddDiscount(data);
    }, 2500);
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="lg:w-[45%] w-full relative mx-auto flex flex-col gap-4
        border dark:border-white/30 shadow-custom p-4 rounded-xl"
        >
          <div className="relative grid lg:grid-cols-2 grid-cols-1 gap-2">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-white text-black">
                    Type Discount
                  </FormLabel>
                  <FormControl>
                    <Select
                      selectedKeys={field.value ? [field.value] : undefined}
                      items={types}
                      aria-labelledby="type"
                      placeholder="Choose a type of discount"
                      {...field}
                    >
                      {types.map((type) => (
                        <SelectItem
                          key={type.key}
                          aria-labelledby="type"
                          className="dark:text-white text-black"
                        >
                          {type.label}
                        </SelectItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormMessage className="dark:text-red-300 text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-white text-black">
                    Value
                  </FormLabel>
                  <FormControl>
                    <Input
                      aria-labelledby="value"
                      {...field}
                      value={String(field.value)}
                    />
                  </FormControl>
                  <FormMessage className="dark:text-red-300 text-red-400" />
                </FormItem>
              )}
            />
          </div>

          <div className="relative grid lg:grid-cols-2 grid-cols-1 gap-2">
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="dark:text-white text-black">
                    Start Date
                  </FormLabel>
                  <FormControl>
                    <DatePicker
                      aria-labelledby="start_date"
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
                  <FormMessage className="dark:text-red-300 text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="due_date"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="dark:text-white text-black">
                    End Date
                  </FormLabel>
                  <FormControl>
                    <DatePicker
                      aria-labelledby="end_date"
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
                  <FormMessage className="dark:text-red-300 text-red-400" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-white text-black">
                  Currency
                </FormLabel>
                <FormControl>
                  <Select
                    items={currencies}
                    selectedKeys={field.value ? [field.value] : undefined}
                    aria-labelledby="currency"
                    placeholder="Choose a currency of discount"
                    {...field}
                  >
                    {currencies.map((type) => (
                      <SelectItem
                        key={type.key}
                        aria-labelledby="status"
                        className="dark:text-white text-black"
                      >
                        {type.label}
                      </SelectItem>
                    ))}
                  </Select>
                </FormControl>
                <FormMessage className="dark:text-red-300 text-red-400" />
              </FormItem>
            )}
          />

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
                <FormMessage className="dark:text-red-300 text-red-400" />
              </FormItem>
            )}
          />

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
                className="w-fit mx-auto dark:bg-white dark:text-black"
              >
                Submit
              </Button>
            </>
          )}
        </form>
      </Form>
    </>
  );
};

export default DiscountForm;
