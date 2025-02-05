"use client";
import { UpdateEventDto } from "@/api/events/utils/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useUpdateEvent } from "@/hooks/use-update-event";
import { calendarDateToDate, dateToCalendarDate } from "@/utils";
import { Event } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  DatePicker,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import { SquarePenIcon } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ScrollArea } from "@/components/ui/scroll-area";

const types = [
  { key: "concert", label: "Concert" },
  { key: "food_festival", label: "Food Festival" },
  { key: "cooking_class", label: "Cooking Class" },
  { key: "holiday_event", label: "Holiday Event" },
];

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

interface ModalUpdateEventProps {
  event: Event;
}

const ModalUpdateEvent: React.FC<ModalUpdateEventProps> = ({ event }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const { mutate: mutateUpdateEvent } = useUpdateEvent();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: event.title ? event.title : "",
      start_date: event.start_date ? new Date(event.start_date) : undefined,
      end_date: event.end_date ? new Date(event.end_date) : undefined,
      description: event.description ? event.description : "",
      note: event.note ? event.note : "",
      guests_number: event.guests_number ? event.guests_number : 1,
      type: event.type as
        | "concert"
        | "food_festival"
        | "cooking_class"
        | "holiday_event",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const {
      title,
      description,
      start_date,
      end_date,
      note,
      guests_number,
      type,
    } = values;
    setIsLoading(true);

    const data: UpdateEventDto = {
      eventId: event.id,
      title,
      description,
      start_date,
      end_date,
      note,
      guests_number,
      type,
      status:
        start_date > new Date()
          ? "scheduled"
          : end_date > new Date()
          ? "ongoing"
          : "finished",
    };

    setTimeout(() => {
      mutateUpdateEvent(data);
      setIsLoading(false);
      onClose();
    }, 2500);
  }

  return (
    <>
      <Tooltip
        content="Update"
        showArrow
        className="dark:text-white text-black"
      >
        <SquarePenIcon
          className="cursor-pointer opacity-50 hover:opacity-100 
              duration-250 ease-in-out transition-opacity select-none"
          onClick={onOpen}
        />
      </Tooltip>

      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        placement="center"
        isDismissable={false}
        isKeyboardDismissDisabled={false}
        onOpenChange={onOpenChange}
        size="lg"
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.3,
                ease: "easeOut",
              },
            },
            exit: {
              y: -20,
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: "easeIn",
              },
            },
          },
        }}
      >
        <ModalContent className="dark:text-white text-black">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 lg:text-left text-center">
                Update Event
              </ModalHeader>

              <ModalBody>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col lg:gap-3 gap-2"
                  >
                    <ScrollArea className="h-[480px] pr-4 pb-4 w-full relative">
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

                            <FormMessage className="dark:text-red-300 text-red-500" />
                          </FormItem>
                        )}
                      />

                      <div className="relative grid lg:grid-cols-2 grid-cols-1 gap-3">
                        <FormField
                          control={form.control}
                          name="start_date"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="dark:text-white">
                                Start Date
                              </FormLabel>
                              <FormControl>
                                <DatePicker
                                  isRequired
                                  aria-labelledby="date"
                                  value={
                                    field.value
                                      ? dateToCalendarDate(field.value)
                                      : null
                                  }
                                  onChange={(dateValue) => {
                                    field.onChange(
                                      dateValue
                                        ? calendarDateToDate(dateValue)
                                        : null
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
                              <FormLabel className="dark:text-white">
                                End Date
                              </FormLabel>
                              <FormControl>
                                <DatePicker
                                  isRequired
                                  aria-labelledby="date"
                                  value={
                                    field.value
                                      ? dateToCalendarDate(field.value)
                                      : null
                                  }
                                  onChange={(dateValue) => {
                                    field.onChange(
                                      dateValue
                                        ? calendarDateToDate(dateValue)
                                        : null
                                    );
                                  }}
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
                          name="type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="dark:text-white text-black">
                                Type Event
                              </FormLabel>
                              <FormControl>
                                <Select
                                  items={types}
                                  placeholder="Choose one type of this event..."
                                  aria-labelledby="method"
                                  defaultSelectedKeys={new Set([event.type])}
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
                                  isRequired
                                  aria-labelledby="guests"
                                  {...field}
                                  min={1}
                                  value={
                                    field.value ? field.value.toString() : ""
                                  }
                                  onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                  }
                                  type="number"
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
                              Note About The Event (Optional)
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Note..."
                                {...field}
                                aria-labelledby="note"
                              />
                            </FormControl>
                            <FormMessage className="dark:text-red-400 text-red-500" />
                          </FormItem>
                        )}
                      />
                    </ScrollArea>

                    <div className="flex items-center justify-end gap-4">
                      <Button
                        color="primary"
                        className="dark:bg-white dark:text-black text-white"
                        onPress={onClose}
                      >
                        Cancel
                      </Button>

                      {isLoading ? (
                        <>
                          <Button
                            isLoading
                            color="primary"
                            className="dark:bg-white dark:text-black text-white"
                          >
                            Please wait...
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            type="submit"
                            color="primary"
                            className="dark:bg-white dark:text-black text-white"
                          >
                            Submit
                          </Button>
                        </>
                      )}
                    </div>
                  </form>
                </Form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalUpdateEvent;
