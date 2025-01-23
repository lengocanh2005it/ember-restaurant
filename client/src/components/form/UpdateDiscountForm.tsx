"use client";
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Button,
  DatePicker,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { useUpdateDiscount } from "@/hooks/use-update-discount";
import { UpdateDiscountDto } from "@/api/discounts/utils/types";
import { dateToCalendarDate, calendarDateToDate } from "@/utils";
import { Discount } from "@/utils/types";
import { currencies, statuses, types } from "@/config/constants";

const formSchema = z
  .object({
    type: z.enum(["percentage", "fixed_amount"], {
      message: "Please choose a valid type.",
    }),
    value: z.preprocess((val) => {
      if (typeof val === "string") {
        return parseFloat(val);
      }
      return val;
    }, z.number({ message: "Value must be a number!" }).positive({ message: "Value must be positive number!" })),
    status: z.enum(["true", "false"], {
      message: "Please choose a valid status.",
    }),
    currency: z.enum(["vnd", "usd"], {
      message: "Please choose a valid currency.",
    }),
    start_date: z
      .date({ required_error: "Start date is required." })
      .refine((date) => !isNaN(date.getTime()), {
        message: "Invalid Start date.",
      })
      .refine((date) => date >= new Date(), {
        message: "Start date must be greater than or equal to current date.",
      }),
    end_date: z
      .date({ required_error: "End date is required." })
      .refine((date) => !isNaN(date.getTime()), {
        message: "Invalid End date.",
      })
      .refine((date) => date >= new Date(), {
        message: "End date must be greater than or equal to current date.",
      }),
    description: z.string().optional(),
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

interface UpdateDiscountFormProps {
  onClose: () => void;
  discount: Discount;
}

const UpdateDiscountForm: React.FC<UpdateDiscountFormProps> = ({
  onClose,
  discount,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: discount.type as "percentage" | "fixed_amount",
      status: discount.is_active === true ? "true" : "false",
      currency: discount.currency as "vnd" | "usd",
      start_date: new Date(discount.start_date),
      end_date: new Date(discount.end_date),
      value: discount.value,
    },
  });

  const { mutate: mutateUpdateDiscount } = useUpdateDiscount();

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const { type, description, value, start_date, end_date, status, currency } =
      values;

    const data: UpdateDiscountDto = {
      discountId: discount.id,
      type,
      description,
      value,
      start_date,
      end_date,
      is_active: status === "true" ? true : false,
      currency,
    };

    setTimeout(() => {
      setIsLoading(false);
      onClose();
      mutateUpdateDiscount(data);
    }, 2500);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col lg:gap-3"
      >
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-2 relative">
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
                    items={types}
                    aria-labelledby="type"
                    placeholder="Choose a type of discount"
                    defaultSelectedKeys={[`${discount.type}`]}
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
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-white text-black">
                  Status
                </FormLabel>
                <FormControl>
                  <Select
                    items={statuses}
                    aria-labelledby="status"
                    placeholder="Choose status of discount"
                    defaultSelectedKeys={[
                      `${discount.is_active}` === "true" ? "true" : "false",
                    ]}
                    {...field}
                  >
                    {statuses.map((type) => (
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
        </div>

        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="dark:text-white text-black">
                Value ({(form.getValues("currency") as string).toUpperCase()})
              </FormLabel>
              <FormControl>
                <Input
                  aria-labelledby="value"
                  isRequired
                  {...field}
                  value={String(field.value)}
                />
              </FormControl>
              <FormMessage className="dark:text-red-300 text-red-400" />
            </FormItem>
          )}
        />

        <div className="flex lg:flex-row flex-col lg:items-center gap-2 relative">
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
                    isRequired
                    aria-labelledby="start_date"
                    value={field.value ? dateToCalendarDate(field.value) : null}
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
            name="end_date"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="dark:text-white text-black">
                  End Date
                </FormLabel>
                <FormControl>
                  <DatePicker
                    isRequired
                    aria-labelledby="end_date"
                    value={field.value ? dateToCalendarDate(field.value) : null}
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
                  aria-labelledby="currency"
                  placeholder="Choose a currency of discount"
                  defaultSelectedKeys={new Set([discount.currency])}
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

        <div
          className="flex lg:flex-row flex-col lg:items-center 
        lg:justify-end lg:gap-3 gap-1 lg:mt-0 mt-2"
        >
          <Button
            color="primary"
            className="dark:bg-white dark:text-black w-fit lg:mx-0 mx-auto"
            onPress={onClose}
          >
            Cancel
          </Button>

          {isLoading ? (
            <>
              <Button
                isLoading
                color="primary"
                className="dark:bg-white dark:text-black w-fit lg:mx-0 mx-auto"
              >
                Please wait...
              </Button>
            </>
          ) : (
            <>
              <Button
                type="submit"
                color="primary"
                className="dark:bg-white dark:text-black w-fit lg:mx-0 mx-auto"
              >
                Update
              </Button>
            </>
          )}
        </div>
      </form>
    </Form>
  );
};

export default UpdateDiscountForm;
