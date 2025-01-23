"use client";
import { CreateReservationDto } from "@/api/reservation/utils/types";
import VoucherList from "@/components/VoucherList";
import ModalConfirmPaymentReservation from "@/components/modal/ModalConfirmPaymentReservation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAddReservation } from "@/hooks/use-add-reservation";
import { useAreas } from "@/hooks/use-areas";
import { useFindTablesByTypes } from "@/hooks/use-find-tables-with-types";
import { useTables } from "@/hooks/use-tables";
import { useDiscountStore, useOrderStore, useUserStore } from "@/store";
import {
  Area,
  CachedReservationData,
  DiscountWithQuantity,
  Table,
} from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { getLocalTimeZone, now, ZonedDateTime } from "@internationalized/date";
import {
  Button,
  Checkbox,
  Chip,
  DatePicker,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

const formSchema = z
  .object({
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
    type: z.string().optional(),
    method: z.enum(["card", "cash"], {
      message: "Please choose a valid payment method.",
    }),
    note: z.string().optional(),
    agreedToTerms: z
      .boolean({ message: "You must agree with the terms and conditions." })
      .refine((val) => val === true, {
        message: "You must agree with the terms and conditions.",
      }),
    areaId: z
      .string({ message: "Please choose one area." })
      .min(1, { message: "Please choose one area." }),
    tableIds: z
      .array(z.string({ message: "Please choose tables." }))
      .or(z.string({ message: "Please choose tables." }))
      .transform((val) => {
        if (typeof val === "string") {
          return val.split(",");
        }
        return val;
      }),
    promotionCode: z.string().optional(),
  })
  .superRefine(({ type, areaId, tableIds }, ctx) => {
    if (type && areaId && !tableIds) {
      ctx.addIssue({
        code: "custom",
        message: "Please choose tables.",
        path: ["tableIds"],
      });
    }
  });

const types = [
  { key: "normal", label: "Normal" },
  { key: "vip", label: "Vip" },
];

const methods = [
  { key: "card", label: "Credit Card" },
  { key: "cash", label: "Pay In Cash" },
];

const typeMap = {
  normal: "Normal",
  vip: "VIP",
};

const ReservationForm: React.FC = () => {
  const [areas, setAreas] = useState<Record<string, string | boolean>[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isShow, setIsShow] = useState<boolean>(false);
  const { data: tablesData } = useTables("area");
  const { data } = useAreas();
  const query = useQueryClient();

  useEffect(() => {
    if (tablesData) {
      setTables(tablesData);
    }
  }, [tablesData]);

  const { mutate: mutateFindTableByTypes } = useFindTablesByTypes();

  useEffect(() => {
    if (data) {
      setAreas(
        (data as Area[]).map((area) => ({
          key: area.id,
          label: area.name,
        }))
      );
    }
  }, [data]);

  const handleClick = (areaId: string, type?: string) => {
    if (areaId && type === "undefined") {
      mutateFindTableByTypes({
        areaId,
      });
    } else if (areaId && type !== "undefined") {
      mutateFindTableByTypes({
        type,
        areaId,
      });
    }
  };

  const { user } = useUserStore();
  const { discount, setDiscount } = useDiscountStore();
  const { setOrderPayment } = useOrderStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: undefined,
      areaId: undefined,
      guests: 1,
      method: undefined,
      agreedToTerms: false,
      note: "",
      date_time: now(getLocalTimeZone()),
      tableIds: [],
      promotionCode: "",
    },
  });

  const promotionCode = useWatch({
    control: form.control,
    name: "promotionCode",
  });

  const areaId = useWatch({
    control: form.control,
    name: "areaId",
  });

  const tableType = useWatch({
    control: form.control,
    name: "type",
  });

  const renderVouchers = (voucher: DiscountWithQuantity) => {
    return (
      <Chip
        key={voucher.discount.id}
        color="primary"
        className="dark:bg-white dark:text-black text-white"
        onClose={() => setDiscount(null)}
      >
        {voucher.discount.value}
        {voucher.discount.type === "percentage" ? "%" : " USD"}
      </Chip>
    );
  };

  const { mutate: mutateAddReservation } = useAddReservation(user?.id!);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const { guests, method, note, areaId, tableIds, date_time, promotionCode } =
      values;
    setIsLoading(true);

    const cleanedDate = date_time.toString().split("[")[0];

    const data: CreateReservationDto = {
      userId: user?.id!,
      guests_count: guests,
      payment_method: method,
      areaId,
      tableIds,
      date_time: new Date(cleanedDate),
      note,
      ...(!discount && promotionCode ? [{ promotionCode }] : []),
      ...(discount && !promotionCode
        ? [{ discountId: discount.discount.id }]
        : []),
    };

    setTimeout(() => {
      const cachedData: CachedReservationData = {
        payment_method: method,
        note,
        guests_count: guests,
        areaId,
        tableIds,
        date_time: new Date(cleanedDate),
        userId: user?.id!,
        ...(discount && !promotionCode
          ? [{ discountId: discount.discount.id }]
          : []),
        ...(!discount && promotionCode ? [{ promotionCode }] : []),
      };

      if (method === "card") {
        setIsShow(true);
        query.setQueryData(
          ["reservationData", user?.id!],
          cachedData as CachedReservationData
        );
      } else {
        query.removeQueries({
          queryKey: ["reservationData", user?.id!],
        });
        mutateAddReservation(data);
        setIsShow(false);
      }

      setOrderPayment({
        orderId: "",
        totalPrice: 0,
      });

      setDiscount(null);

      form.reset({
        guests: 1,
        note: "",
        type: undefined,
        method: undefined,
        agreedToTerms: false,
        date_time: now(getLocalTimeZone()),
        promotionCode: "",
      });

      setIsLoading(false);
    }, 2500);
  };

  return (
    <>
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
                      isRequired
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
          </div>

          <div
            className={`relative grid ${
              discount ? "lg:grid-cols-1" : "lg:grid-cols-2"
            } grid-cols-1 gap-2`}
          >
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

            {!discount && (
              <FormField
                control={form.control}
                name="promotionCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      htmlFor="promotionCode"
                      className="dark:text-white text-black"
                    >
                      Promotion Code (Optional)
                    </FormLabel>

                    <FormControl>
                      <Input
                        id="promotionCode"
                        placeholder="Enter promotion code if you have..."
                        aria-label="PromotionCode"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
          </div>

          <div className="grid lg:grid-cols-2 grid-cols-1 gap-2">
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
                      items={areas}
                      key={field.value || ""}
                      placeholder="Choose one area..."
                      aria-labelledby="area"
                      disabled={areas.length === 0}
                      selectedKeys={field.value ? [field.value] : []}
                      onSelectionChange={(selected) => {
                        const selectedKey = Array.from(selected)[0];
                        field.onChange(selectedKey);
                        handleClick(selectedKey as string, tableType);
                      }}
                      {...field}
                    >
                      {(method) => (
                        <SelectItem
                          key={method.key as string}
                          className="text-black dark:text-white"
                          aria-labelledby="area"
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
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-white text-black">
                    Tables Type (Optional)
                  </FormLabel>
                  <FormControl>
                    <Select
                      key={field.value || ""}
                      items={types}
                      placeholder="Choose table type..."
                      aria-labelledby="type"
                      selectedKeys={field.value ? [field.value] : []}
                      onSelectionChange={(selected) => {
                        const selectedKey = Array.from(selected)[0];
                        field.onChange(selectedKey);
                        handleClick(
                          form.getValues("areaId"),
                          selectedKey as string
                        );
                      }}
                      {...field}
                    >
                      {(type) => (
                        <SelectItem
                          key={type.key}
                          className="text-black dark:text-white"
                          aria-labelledby="type"
                        >
                          {type.label}
                        </SelectItem>
                      )}
                    </Select>
                  </FormControl>
                  <FormMessage className="dark:text-red-400 text-red-500" />
                </FormItem>
              )}
            />
          </div>

          {areaId && tablesData.length !== 0 && (
            <>
              <FormField
                control={form.control}
                name="tableIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-white text-black">
                      Tables
                    </FormLabel>
                    <FormControl>
                      <Select
                        items={tables}
                        placeholder="Choose one table..."
                        aria-labelledby="table"
                        selectionMode="multiple"
                        isDisabled={tables.length === 0}
                        disabledKeys={tables
                          .filter((table) => table.is_reserved)
                          .map((table) => table.id)}
                        {...field}
                      >
                        {(type) => (
                          <SelectItem
                            key={type.id}
                            className="text-black dark:text-white"
                            aria-labelledby="table"
                          >
                            {type.name +
                              " (" +
                              typeMap[type.type as keyof typeof typeMap] +
                              ")"}
                          </SelectItem>
                        )}
                      </Select>
                    </FormControl>
                    <FormMessage className="dark:text-red-400 text-red-500" />
                  </FormItem>
                )}
              />
            </>
          )}

          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-white text-black">
                  Your Notice (Optional)
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter your notice..."
                    {...field}
                    aria-labelledby="notice"
                  />
                </FormControl>
                <FormMessage className="dark:text-red-400 text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="agreedToTerms"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Checkbox
                    isSelected={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    aria-labelledby="check"
                  >
                    <span className="text-[14px]">
                      I agree with the reservation policies and terms.
                    </span>
                  </Checkbox>
                </FormControl>
                <FormMessage className="dark:text-red-400 text-red-500" />
              </FormItem>
            )}
          />

          {isShow && (
            <ModalConfirmPaymentReservation
              isOpen={isShow}
              setIsOpen={setIsShow}
            />
          )}

          {!promotionCode && (
            <div className="flex items-center gap-2">
              <p>Voucher: </p>

              {discount ? (
                <>{renderVouchers(discount)}</>
              ) : (
                <VoucherList content="badge" />
              )}
            </div>
          )}

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
                Submit
              </Button>
            </>
          )}
        </form>
      </Form>
    </>
  );
};

export default ReservationForm;
