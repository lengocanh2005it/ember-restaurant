"use client";
import { UpdateReservationDto } from "@/api/reservation/utils/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAreas } from "@/hooks/use-areas";
import { useUpdateReservation } from "@/hooks/use-update-reservation";
import { Area, Reservation } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  fromDate,
  getLocalTimeZone,
  now,
  toZoned,
  ZonedDateTime,
} from "@internationalized/date";
import {
  Button,
  Chip,
  DatePicker,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { stageStatues } from "@/config/constants";

const methods = [
  { key: "card", label: "Credit Card" },
  { key: "cash", label: "Pay In Cash" },
];

const formSchema = z.object({
  date_time: z.custom<ZonedDateTime>(
    (val) => {
      if (!val) {
        return false;
      }
      if (val instanceof ZonedDateTime) {
        return (
          typeof val.timeZone === "string" &&
          val.timeZone.length > 0 &&
          val.toAbsoluteString() !== null
        );
      }
      return false;
    },
    {
      message: "Invalid or missing date and time.",
    }
  ),
  guests: z
    .number({ message: "Must be at least 1 guest." })
    .positive({ message: "Must be a positive value." })
    .min(1, { message: "Must be at least 1 guest." }),
  method: z.enum(["card", "cash"], {
    message: "Please choose a valid payment method.",
  }),
  note: z.string().optional(),
  areaId: z
    .string({ message: "Please choose one area." })
    .min(1, { message: "Please choose one area." }),
  status: z.enum(["pending", "success", "error"], {
    message: "Please choose a valid status.",
  }),
  admin_message: z.string().optional(),
});

interface EditReservationFromProp {
  reservation: Reservation;
}

const typeMap = {
  vip: "VIP",
  normal: "Normal",
};

const EditReservationForm: React.FC<EditReservationFromProp> = ({
  reservation,
}) => {
  const [areas, setAreas] = useState<Area[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { mutate: mutateUpdateReservation } = useUpdateReservation(
    reservation.user.id
  );

  const { data: areasData } = useAreas();

  useEffect(() => {
    if (areasData) {
      setAreas(areasData as Area[]);
    }
  }, [areasData]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date_time: toZoned(
        fromDate(new Date(reservation.date_time), getLocalTimeZone()),
        "Asia/Ho_Chi_Minh"
      ),
      guests: reservation?.guests_count ? reservation.guests_count : 1,
      note: reservation.note ? reservation.note : "Null",
      method: reservation.payment.payment_method as "cash" | "card",
      areaId: reservation?.tables[0]?.area?.id,
      status: reservation.status as "pending" | "success" | "error",
      admin_message: reservation.admin_message ? reservation.admin_message : "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { status, admin_message } = values;

    const { id, guests_count, payment, note, user, date_time } = reservation;

    setIsLoading(true);

    const cleanedDate = date_time.toString().split("[")[0];

    const data: UpdateReservationDto = {
      reservationId: id,
      date_time: new Date(cleanedDate),
      guests_count,
      payment_method: payment.payment_method as "card" | "cash",
      status,
      userId: user.id,
      areaId: reservation?.tables[0]?.area?.id,
      note,
      tableIds: reservation.tables.map((table) => table.id),
      admin_message,
    };

    setTimeout(() => {
      setIsLoading(false);
      mutateUpdateReservation(data);
      form.reset({
        admin_message: "",
      });
    }, 2500);
  }

  return (
    <div
      className="relative lg:w-[60%] w-full mx-auto p-4
    border dark:border-white/20 rounded-xl shadow-custom"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-2 lg:w-[90%] w-full mx-auto"
        >
          <div className="grid md:grid-cols-2 grid-cols-1 lg:gap-4 gap-2">
            <FormField
              control={form.control}
              name="date_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-white text-black">
                    Date And Time
                  </FormLabel>
                  <FormControl>
                    <DatePicker
                      isDisabled
                      hideTimeZone
                      showMonthAndYearPickers
                      aria-labelledby="date-and-time"
                      aria-label="date-and-time"
                      defaultValue={now(getLocalTimeZone())}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="dark:text-red-400 text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="guests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-white text-black">
                    Number Of Guests
                  </FormLabel>
                  <FormControl>
                    <Input
                      isDisabled
                      aria-labelledby="guests"
                      {...field}
                      value={field.value ? field.value.toString() : ""}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      type="number"
                      min={1}
                    />
                  </FormControl>
                  <FormMessage className="dark:text-red-400 text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-white text-black">
                    Payment Method
                  </FormLabel>
                  <FormControl>
                    <Select
                      key={field.value || ""}
                      items={methods}
                      isDisabled
                      defaultSelectedKeys={[
                        `${reservation?.payment?.payment_method}`,
                      ]}
                      placeholder="Choose payment method..."
                      aria-labelledby="method"
                      selectedKeys={field.value ? [field.value] : []}
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
              name="areaId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-white text-black">
                    Area
                  </FormLabel>
                  <FormControl>
                    <Select
                      defaultSelectedKeys={[
                        `${reservation?.tables[0]?.area?.id}`,
                      ]}
                      items={areas}
                      aria-labelledby="areas"
                      isDisabled
                      {...field}
                    >
                      {areas.map((method) => (
                        <SelectItem
                          key={method.id}
                          aria-labelledby="method"
                          className="dark:text-white text-black"
                        >
                          {method.name}
                        </SelectItem>
                      ))}
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col gap-1">
            <h1 className="lg:text-[15px] text-[14px] font-medium">Tables</h1>

            <div className="flex items-center justify-center gap-2 flex-row overflow-x-auto p-1">
              {reservation.tables.map((table) => (
                <Chip key={table.id}>
                  {table.name +
                    " (" +
                    typeMap[table.type as keyof typeof typeMap] +
                    ")"}
                </Chip>
              ))}
            </div>
          </div>

          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-white text-black">
                  Notice Of Reservation
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    aria-labelledby="notice"
                    aria-label="notice"
                    isDisabled
                  />
                </FormControl>
                <FormMessage className="dark:text-red-400 text-red-500" />
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
                    key={field.value || ""}
                    items={stageStatues}
                    defaultSelectedKeys={[`${reservation.status}`]}
                    placeholder="Choose one status..."
                    aria-labelledby="status"
                    selectedKeys={field.value ? [field.value] : []}
                    {...field}
                  >
                    {(method) => (
                      <SelectItem
                        key={method.key}
                        className="text-black dark:text-white"
                        aria-labelledby="status"
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
            name="admin_message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-white text-black">
                  Your Message (Optional)
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Your message..."
                    aria-labelledby="admin_message"
                    aria-label="admin_message"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {isLoading ? (
            <>
              <Button
                isLoading
                className="w-fit mx-auto dark:bg-white dark:text-black"
                color="primary"
              >
                Please wait...
              </Button>
            </>
          ) : (
            <>
              <Button
                type="submit"
                color="primary"
                className="mx-auto font-bold dark:bg-white dark:text-black text-white"
              >
                Edit
              </Button>
            </>
          )}
        </form>
      </Form>
    </div>
  );
};

export default EditReservationForm;
