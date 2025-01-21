"use client";
import { UpdateReservationDto } from "@/api/reservation/utils/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useAreas } from "@/hooks/use-areas";
import { useGetAllTablesOfArea } from "@/hooks/use-tables-of-area";
import { useUpdateReservation } from "@/hooks/use-update-reservation";
import { useReservationStore, useUserStore } from "@/store";
import { Area, Table } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  fromDate,
  getLocalTimeZone,
  toZoned,
  ZonedDateTime,
} from "@internationalized/date";
import {
  Button,
  Card,
  CardBody,
  Chip,
  DatePicker,
  Input,
  Select,
  SelectItem,
  Textarea,
  Tooltip,
} from "@nextui-org/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { RotateCwIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

const typeMap = {
  normal: "Normal",
  vip: "VIP",
};

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
  payment_method: z.enum(["card", "cash"], {
    message: "Please choose a valid payment method.",
  }),
  note: z.string().optional(),
  areaId: z
    .string({ message: "Please choose one area." })
    .min(1, { message: "Please choose one area." }),
  newTableIds: z
    .array(z.string({ message: "Please choose tables." }))
    .or(z.string())
    .transform((val) => {
      if (typeof val === "string") {
        return val.split(",");
      }
      return val;
    })
    .optional(),
});

export const methods = [
  { key: "card", label: "Credit Card" },
  { key: "cash", label: "Pay In Cash" },
];

interface UpdateReservationFormProps {
  onClose: () => void;
}

const UpdateReservationForm: React.FC<UpdateReservationFormProps> = ({
  onClose,
}) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [areas, setAreas] = useState<Area[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [newTables, setNewTables] = useState<Table[]>([]);
  const [historyTables, setHistoryTables] = useState<Table[]>([]);
  const { user } = useUserStore();
  const { reservationUpdate } = useReservationStore();

  const { mutate: mutateUpdateReservation } = useUpdateReservation(user?.id!);
  const query = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      note: reservationUpdate?.note ? reservationUpdate.note : "",
      payment_method: reservationUpdate?.payment?.payment_method as
        | "card"
        | "cash",
      guests: reservationUpdate?.guests_count,
      date_time: toZoned(
        fromDate(new Date(reservationUpdate?.date_time!), getLocalTimeZone()),
        "Asia/Ho_Chi_Minh"
      ),
      areaId: reservationUpdate?.tables[0]?.area?.id,
      newTableIds: [],
    },
  });

  const { data } = useAreas();

  const areaId = useWatch({
    control: form.control,
    name: "areaId",
  });

  useEffect(() => {
    if (data) {
      setAreas(data as Area[]);
    }
  }, [data]);

  useEffect(() => {
    if (reservationUpdate?.tables && reservationUpdate?.tables.length !== 0) {
      setTables(reservationUpdate.tables);
    }
  }, [reservationUpdate]);

  const handleRemoveTable = (tableToRemove: Table) => {
    const newTables = tables.filter((table) => table.id !== tableToRemove.id);

    setHistoryTables((prevTables: Table[]) => [...prevTables, tableToRemove]);

    setTables(newTables);
  };

  const handleResetTable = () => {
    const newTable = historyTables[historyTables.length - 1];

    setTables((prevTables: Table[]) => [...prevTables, newTable]);

    setHistoryTables((prevTables: Table[]) =>
      prevTables.filter((table) => table.id !== newTable.id)
    );
  };

  const { data: cachedData } = useQuery({
    queryKey: ["new_tables"],
  });

  useEffect(() => {
    if (cachedData && (cachedData as any).tables) {
      setNewTables((cachedData as any).tables as Table[]);
    }
  }, [cachedData]);

  const { mutate } = useGetAllTablesOfArea();

  const handleSelectClick = (areaId: string) => {
    if (areaId !== reservationUpdate?.tables[0]?.area?.id) {
      mutate(areaId);

      setTables([]);
    } else {
      setNewTables([]);
      query.removeQueries({
        queryKey: ["new_tables"],
      });
      setTables(reservationUpdate.tables);
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const { date_time, payment_method, note, guests, areaId } = values;

    const cleanedDate = date_time.toString().split("[")[0];

    const payload: UpdateReservationDto = {
      reservationId: reservationUpdate?.id!,
      date_time: new Date(cleanedDate),
      payment_method,
      note,
      guests_count: guests,
      userId: user?.id!,
      areaId,
      tableIds: tables.map((table) => table.id),
      status: "pending",
    };

    setTimeout(() => {
      setIsLoading(false);
      onClose();
      mutateUpdateReservation(payload);
    }, 2500);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col lg:gap-3 gap-3"
      >
        <div className="relative grid lg:grid-cols-2 grid-cols-1 gap-2">
          {/* Date */}
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
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Guests */}
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
                    type="number"
                    aria-labelledby="guests"
                    value={field.value ? field.value.toString() : ""}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Method */}
        <FormField
          control={form.control}
          name="payment_method"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="dark:text-white text-black">
                Payment Method
              </FormLabel>
              <FormControl>
                <Select
                  defaultSelectedKeys={[
                    `${reservationUpdate?.payment?.payment_method}`,
                  ]}
                  items={methods}
                  aria-labelledby="method"
                  placeholder="Choose a payment method..."
                  {...field}
                >
                  {methods.map((method) => (
                    <SelectItem
                      key={method.key}
                      aria-labelledby="method"
                      className="dark:text-white text-black"
                    >
                      {method.label}
                    </SelectItem>
                  ))}
                </Select>
              </FormControl>
            </FormItem>
          )}
        />

        <div
          className={`grid ${newTables.length !== 0 && "grid-cols-2"}
        grid-cols-1 gap-2`}
        >
          {/* Area */}
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
                      `${reservationUpdate?.tables[0]?.area?.id}`,
                    ]}
                    items={areas}
                    onSelectionChange={(e) => {
                      handleSelectClick(e.currentKey as string);
                    }}
                    aria-labelledby="areas"
                    placeholder="Choose one area..."
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

          {newTables.length !== 0 && (
            <FormField
              control={form.control}
              name="newTableIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-white text-black">
                    New Tables
                  </FormLabel>
                  <FormControl>
                    <Select
                      items={newTables}
                      aria-labelledby="new_tables"
                      placeholder="Choose new tables..."
                      selectionMode="multiple"
                      {...field}
                    >
                      {newTables.map((method) => (
                        <SelectItem
                          key={method.id}
                          aria-labelledby="new_tables"
                          className="dark:text-white text-black"
                          onClick={() => {
                            setTables((prevState: Table[]) => {
                              const isChecked = prevState.some(
                                (state) => state.id === method.id
                              );

                              if (isChecked) {
                                return prevState.filter(
                                  (state) => state.id !== method.id
                                );
                              } else {
                                return [...prevState, method];
                              }
                            });
                          }}
                        >
                          {method.name +
                            " (" +
                            typeMap[method.type as keyof typeof typeMap] +
                            ")"}
                        </SelectItem>
                      ))}
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
          )}
        </div>

        {/* Tables */}
        {areaId && (
          <div className="flex flex-col gap-1">
            <p className="font-medium lg:text-[14px] text-[13px]">Tables</p>

            <Card>
              <CardBody>
                <div className="flex items-center gap-1">
                  {tables.length !== 0 ? (
                    <div className="flex items-center justify-between flex-1">
                      <div className="flex items-center gap-1">
                        {tables.map((table) => (
                          <Chip
                            key={table.id}
                            onClose={() => {
                              handleRemoveTable(table);
                            }}
                          >
                            {table.name +
                              " (" +
                              typeMap[table.type as keyof typeof typeMap] +
                              ")"}
                          </Chip>
                        ))}
                      </div>

                      {areaId === reservationUpdate?.tables[0]?.area?.id &&
                        historyTables.length !== 0 && (
                          <>
                            <Tooltip
                              content="Reset Tables"
                              className="dark:text-white text-black"
                              showArrow
                            >
                              <RotateCwIcon
                                className="cursor-pointer opacity-60 hover:opacity-100 duration-300 
                            ease-in-out transition-opacity"
                                onClick={handleResetTable}
                              />
                            </Tooltip>
                          </>
                        )}
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between flex-1 text-center">
                        <h1
                          className="lg:text-base text-[14px] w-full dark:text-white/60 
                        text-black/70"
                        >
                          Empty Tables.
                        </h1>

                        {areaId === reservationUpdate?.tables[0]?.area?.id &&
                          historyTables.length !== 0 && (
                            <>
                              <Tooltip
                                content="Reset Tables"
                                className="dark:text-white text-black"
                                showArrow
                              >
                                <RotateCwIcon
                                  className="cursor-pointer opacity-60 hover:opacity-100 duration-300 
                            ease-in-out transition-opacity"
                                  onClick={handleResetTable}
                                />
                              </Tooltip>
                            </>
                          )}
                      </div>
                    </>
                  )}
                </div>
              </CardBody>
            </Card>
          </div>
        )}

        {/* Note */}
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="dark:text-white text-black">Note</FormLabel>
              <FormControl>
                <Textarea
                  aria-labelledby="note"
                  {...field}
                  placeholder="Note about your reservation..."
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex items-center justify-center">
          {isLoading ? (
            <>
              <Button
                type="button"
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
                className={`dark:bg-white dark:text-black text-white ${
                  tables.length === 0 && "opacity-25 pointer-events-none"
                }`}
                disabled={tables.length === 0}
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

export default UpdateReservationForm;
