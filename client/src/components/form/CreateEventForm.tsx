"use client";
import { CreateEventDto } from "@/api/events/utils/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAddEvent } from "@/hooks/use-add-event";
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
import React, { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const types = [
  { key: "concert", label: "Concert" },
  { key: "food_festival", label: "Food Festival" },
  { key: "cooking_class", label: "Cooking Class" },
  { key: "holiday_event", label: "Holiday Event" },
];

const imageSchema = z
  .instanceof(File, { message: "Please choose an image." })
  .refine((file) => file.type.startsWith("image/"), {
    message: "Invalid images",
  });

const formSchema = z
  .object({
    title: z
      .string()
      .min(2, { message: "Title must contain at least 2 character(s)" })
      .max(255, {
        message: "The title cannot be longer than 255 character(s).",
      }),
    guests_number: z
      .number({ message: "Must be at least 1 guest." })
      .positive({ message: "Must be a positive value." })
      .min(1, { message: "Must be at least 1 guest." }),
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
      .min(2, { message: "Description must contain at least 2 character(s)" }),
    note: z.string().optional(),
    image: imageSchema,
    type: z.enum(
      ["concert", "food_festival", "cooking_class", "holiday_event"],
      {
        message: "Please choose a valid type.",
      }
    ),
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

const CreateEventForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const { mutate: mutateAddEvent } = useAddEvent();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      start_date: undefined,
      end_date: undefined,
      description: "",
      note: "",
      image: undefined,
      guests_number: 1,
      type: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const {
      title,
      start_date,
      end_date,
      description,
      note,
      image,
      guests_number,
      type,
    } = values;

    const data: CreateEventDto = {
      title,
      start_date,
      end_date,
      description,
      note,
      image,
      guests_number,
      type,
    };

    setTimeout(() => {
      setIsLoading(false);
      mutateAddEvent(data);
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
        className="flex flex-col lg:gap-3 gap-1 relative container mx-auto lg:w-[50%] w-full
        border dark:border-white/30 p-4 shadow-custom rounded-xl dark:text-white text-black"
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
                <Input
                  placeholder="Title..."
                  {...field}
                  aria-labelledby="title"
                />
              </FormControl>
              <FormMessage className="dark:text-red-400 text-red-500" />
            </FormItem>
          )}
        />

        <div className="relative grid lg:grid-cols-2 grid-cols-1 lg:gap-3 gap-4">
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-white text-black">
                  Start Date
                </FormLabel>
                <FormControl>
                  <DatePicker
                    aria-labelledby="date"
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
                <FormLabel className="dark:text-white text-black">
                  End Date
                </FormLabel>
                <FormControl>
                  <DatePicker
                    aria-labelledby="date"
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
            name="guests_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-white text-black">
                  Number Of Guests
                </FormLabel>
                <FormControl>
                  <Input
                    aria-labelledby="guests"
                    {...field}
                    min={1}
                    value={field.value ? field.value.toString() : ""}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    type="number"
                  />
                </FormControl>
                <FormMessage className="dark:text-red-400 text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-white text-black">
                  Type
                </FormLabel>
                <FormControl>
                  <Select
                    items={types}
                    placeholder="Choose one type of this event..."
                    aria-labelledby="method"
                    defaultSelectedKeys={field.value || []}
                    {...field}
                  >
                    {(method) => (
                      <SelectItem
                        key={method.key}
                        className="text-black dark:text-white"
                        aria-labelledby="method"
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
        </div>

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
                Note About The Event (Optional)
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  aria-labelledby="note"
                  placeholder="Note..."
                />
              </FormControl>
              <FormMessage className="dark:text-red-400 text-red-500" />
            </FormItem>
          )}
        />

        {isLoading ? (
          <>
            <Button
              isLoading
              color="primary"
              className="dark:bg-white dark:text-black w-fit mx-auto"
            >
              Please wait...
            </Button>
          </>
        ) : (
          <>
            <Button
              type="submit"
              color="primary"
              className="dark:bg-white dark:text-black w-fit mx-auto"
            >
              Submit
            </Button>
          </>
        )}
      </form>
    </Form>
  );
};

export default CreateEventForm;
