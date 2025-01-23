"use client";
import { CreateAreaDto } from "@/api/areas/utils/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAddArea } from "@/hooks/use-add-area";
import { stringToTime, timeToString } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Time } from "@internationalized/date";
import { Button, Input, Textarea, TimeInput } from "@heroui/react";
import { ClockIcon } from "lucide-react";
import { DateTime } from "luxon";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z
  .object({
    name: z
      .string({ message: "Name can't be empty." })
      .min(2, { message: "Name must be at least 2 characters." }),
    capacity: z
      .number({ message: "Capacity must be a number." })
      .positive({ message: "Capacity must be a positive value." })
      .min(1, { message: "Capacity must be at least 1." }),
    floor_number: z
      .number({ message: "Floor number must be a number." })
      .positive({ message: "Floor number must be a positive value." })
      .min(1, { message: "Floor number must be at least 1." }),
    description: z.string().optional(),
    start_time: z.string({ message: "Start time is required." }).refine(
      (value) => {
        const timeRegex: RegExp = /^([01]\d|2[0-3]):([0-5]\d)$/;
        return timeRegex.test(value);
      },
      { message: "Invalid time format. Expected HH:MM." }
    ),
    end_time: z.string({ message: "End time is required." }).refine(
      (value) => {
        const timeRegex: RegExp = /^([01]\d|2[0-3]):([0-5]\d)$/;
        return timeRegex.test(value);
      },
      { message: "Invalid time format. Expected HH:MM." }
    ),
  })
  .superRefine(({ start_time, end_time }, ctx) => {
    const startTime = DateTime.fromFormat(start_time, "HH:mm");
    const endTime = DateTime.fromFormat(end_time, "HH:mm");

    if (startTime >= endTime) {
      ctx.addIssue({
        code: "custom",
        message: "Start time can't be greater than End time.",
        path: ["start_time"],
      });

      ctx.addIssue({
        code: "custom",
        message: "End time must be greater than Start time.",
        path: ["end_time"],
      });
    }
  });

const CreateAreaForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      capacity: 1,
      floor_number: 1,
      start_time: undefined,
      end_time: undefined,
      description: "",
    },
  });

  const { mutate: mutateAddArea } = useAddArea();

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { name, description, start_time, end_time, floor_number, capacity } =
      values;

    const data: CreateAreaDto = {
      name,
      description,
      floor_number,
      capacity,
      operating_hours: start_time + "-" + end_time,
    };

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      form.reset({
        name: "",
        description: "",
        start_time: "",
        end_time: "",
        floor_number: 1,
        capacity: 1,
      });
      mutateAddArea(data);
    }, 2500);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative flex flex-col lg:gap-4 gap-3 lg:w-1/2
         w-full mx-auto lg:p-5 p-3 border dark:border-white/30 shadow-custom rounded-xl"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="dark:text-white text-black">Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Area's name..."
                  {...field}
                  aria-labelledby="name"
                  aria-label="name"
                />
              </FormControl>
              <FormMessage className="dark:text-red-400 text-red-500" />
            </FormItem>
          )}
        />

        <div className="grid lg:grid-cols-2 grid-cols-1 gap-3">
          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-white text-black">
                  Capacity Number
                </FormLabel>
                <FormControl>
                  <Input
                    isRequired
                    aria-labelledby="capacity"
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
            name="floor_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-white text-black">
                  Floor Number
                </FormLabel>
                <FormControl>
                  <Input
                    aria-labelledby="floor_number"
                    {...field}
                    value={field.value ? field.value.toString() : ""}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    type="number"
                  />
                </FormControl>
                <FormMessage className="dark:text-red-400 text-red-500" />
              </FormItem>
            )}
          />
        </div>

        <div className="grid lg:grid-cols-2 grid-cols-1 gap-2">
          <FormField
            control={form.control}
            name="start_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-white text-black">
                  Start Time
                </FormLabel>
                <FormControl>
                  <TimeInput
                    aria-labelledby="time"
                    aria-label="time"
                    value={field.value ? stringToTime(field.value) : null}
                    onChange={(value: Time | null) =>
                      field.onChange(timeToString(value as Time))
                    }
                    onBlur={field.onBlur}
                    startContent={<ClockIcon />}
                  />
                </FormControl>
                <FormMessage className="dark:text-red-400 text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="end_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-white text-black">
                  End Time
                </FormLabel>
                <FormControl>
                  <TimeInput
                    aria-labelledby="end_time"
                    aria-label="end_time"
                    value={field.value ? stringToTime(field.value) : null}
                    onChange={(value: Time | null) =>
                      field.onChange(timeToString(value as Time))
                    }
                    onBlur={field.onBlur}
                    startContent={<ClockIcon />}
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="About the description..."
                  aria-labelledby="description"
                  aria-label="description"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isLoading ? (
          <>
            <Button
              isLoading
              color="primary"
              className="dark:bg-white dark:text-black text-white w-fit mx-auto"
            >
              Please wait...
            </Button>
          </>
        ) : (
          <>
            <Button
              type="submit"
              color="primary"
              className="dark:bg-white dark:text-black text-white w-fit mx-auto"
            >
              Submit
            </Button>
          </>
        )}
      </form>
    </Form>
  );
};

export default CreateAreaForm;
