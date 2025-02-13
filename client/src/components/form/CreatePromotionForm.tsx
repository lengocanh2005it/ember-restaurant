"use client";
import { CreatePromotionDto } from "@/api/promotions/utils/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAddPromotion } from "@/hooks/use-add-promotion";
import { useDiscounts } from "@/hooks/use-discounts";
import { useDiscountsByTypes } from "@/hooks/use-discounts-with-types";
import { calendarDateToDate, dateToCalendarDate } from "@/utils";
import { Discount } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  DatePicker,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

const types = [
  { key: "percentage", label: "Percentage" },
  { key: "fixed", label: "Fixed Amount" },
];

const imageSchema = z
  .instanceof(File, { message: "Please choose a valid image." })
  .refine((file) => file.type.startsWith("image/"), {
    message: "Invalid image.",
  });

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
    image: imageSchema,
    discountId: z.string().min(1, { message: "Please choose one discount." }),
    type: z.enum(["percentage", "fixed"], {
      message: "Please choose a valid type of discount.",
    }),
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

const CreatePromotionForm: React.FC = () => {
  const [imageError, setImageError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [discounts, setDiscounts] = useState<Record<string, string>[]>([]);
  const { data } = useDiscounts();

  useEffect(() => {
    if (data) {
      setDiscounts(
        (data as Discount[])
          .sort((a, b) => b.value - a.value)
          .map((discount) => ({
            key: discount.id,
            label:
              discount.type === "percentage"
                ? discount.value + "%"
                : discount.value + " USD",
          }))
      );
    }

    return () => {
      setDiscounts([]);
    };
  }, [data]);

  const { mutate: mutateAddPromotion } = useAddPromotion();

  const { mutate: mutateDiscountsByTypes } = useDiscountsByTypes();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      start_date: undefined,
      description: "",
      end_date: undefined,
      code: "",
      note: "",
      discountId: "",
    },
  });

  const discountValue = useWatch({
    control: form.control,
    name: "type",
  });

  const handleClickCancel = () => {
    form.reset({
      title: "",
      code: "",
      start_date: undefined,
      end_date: undefined,
      description: "",
      note: "",
      image: undefined,
    });
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    const {
      title,
      description,
      start_date,
      end_date,
      note,
      image,
      code,
      discountId,
    } = values;

    const data: CreatePromotionDto = {
      code,
      title,
      description,
      start_date,
      end_date,
      note,
      image,
      discountId,
    };

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      mutateAddPromotion(data);
      handleClickCancel();
    }, 2500);
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (!file.type.startsWith("image/")) {
        setImageError("Invalid image format.");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setImageError("Image size exceeds 5MB.");
        return;
      }

      setImageError(null);
      form.setValue("image", file);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-2 xl:w-1/2 lg:w-[80%] w-full relative mx-auto flex flex-col gap-2
        border dark:border-white/30 shadow-custom p-4 rounded-xl"
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

        <div className="grid lg:grid-cols-2 grid-cols-1 gap-2 relative">
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

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-white text-black">
                  Image
                </FormLabel>
                <FormControl>
                  <div className="flex flex-col gap-2">
                    <Input
                      type="file"
                      onChange={handleImageChange}
                      aria-labelledby="image"
                    />

                    {imageError && (
                      <p className="dark:text-red-400 text-red-500">
                        {imageError}
                      </p>
                    )}
                  </div>
                </FormControl>
                <FormMessage className="dark:text-red-400 text-red-500" />
              </FormItem>
            )}
          />
        </div>

        <div className="grid lg:grid-cols-2 grid-cols-1 gap-2">
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-white">Start Date</FormLabel>
                <FormControl>
                  <DatePicker
                    aria-labelledby="startDate"
                    value={field.value ? dateToCalendarDate(field.value) : null}
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
                    aria-labelledby="dueDate"
                    value={field.value ? dateToCalendarDate(field.value) : null}
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

        <div
          className={`${
            discountValue === "fixed" || discountValue === "percentage"
              ? "lg:grid-cols-2 grid-cols-1"
              : "grid-cols-1"
          } relative grid gap-2`}
        >
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-white text-black">
                  Type Of Discount
                </FormLabel>
                <FormControl>
                  <Select
                    items={types}
                    selectedKeys={field.value ? [field.value] : undefined}
                    placeholder="Choose a valid type of discount..."
                    aria-labelledby="type"
                    defaultSelectedKeys={field.value || []}
                    {...field}
                  >
                    {(method) => (
                      <SelectItem
                        key={method.key}
                        className="text-black dark:text-white"
                        aria-labelledby="type"
                        onPress={() => {
                          mutateDiscountsByTypes(method.key);
                        }}
                      >
                        {method.label}
                      </SelectItem>
                    )}
                  </Select>
                </FormControl>
                <FormMessage className="dark:text-red-400 text-red-500" />
              </FormItem>
            )}
          />

          {(discountValue === "fixed" || discountValue === "percentage") && (
            <FormField
              control={form.control}
              name="discountId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-white text-black">
                    Discount
                  </FormLabel>
                  <FormControl>
                    <Select
                      items={discounts}
                      selectedKeys={field.value ? [field.value] : undefined}
                      placeholder="Choose a valid discount..."
                      aria-labelledby="discount"
                      isDisabled={discounts.length === 0}
                      defaultSelectedKeys={field.value || []}
                      {...field}
                    >
                      {(method) => (
                        <SelectItem
                          key={method.key}
                          className="text-black dark:text-white"
                          aria-labelledby="discount"
                        >
                          {method.label}
                        </SelectItem>
                      )}
                    </Select>
                  </FormControl>
                  <FormMessage className="dark:text-red-400 text-red-500" />
                </FormItem>
              )}
            />
          )}
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
                Note About The Promotion (Optional)
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Note..."
                  {...field}
                  aria-labelledby="note"
                />
              </FormControl>
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
  );
};

export default CreatePromotionForm;
