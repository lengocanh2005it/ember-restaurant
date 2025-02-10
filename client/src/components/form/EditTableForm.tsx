"use client";
import { UpdateTableDto } from "@/api/tables/utils/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useUpdateTable } from "@/hooks/use-update-table";
import { Table } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Select, SelectItem, Textarea } from "@heroui/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { areaOrTableStatues } from "@/config/constants";

interface EditTableFormProps {
  table: Table;
  onClose: () => void;
  areaId: string;
}

const types = [
  { key: "normal", label: "Normal" },
  { key: "vip", label: "VIP" },
];

const availabilities = [
  { key: "true", label: "No Availability" },
  { key: "false", label: "Availability" },
];

const formSchema = z.object({
  name: z.string({ message: "Name of table can't be empty." }).min(1, {
    message: "Name of table can't be empty.",
  }),
  note: z.string().optional(),
  capacity: z
    .number({ message: "Capacity must be a number." })
    .positive({ message: "Capacity must be a positive value." })
    .min(1, { message: "Capacity must be at least 1." }),
  price: z.preprocess((val) => {
    if (typeof val === "string") {
      return parseFloat(val);
    }
    return val;
  }, z.number({ message: "Invalid price." }).positive({ message: "Price must be positive." })),
  type: z.enum(["normal", "vip"], { message: "Please choose a valid type." }),
  status: z.enum(["running", "maintenance"], {
    message: "Please choose a valid status.",
  }),
  is_reserved: z.enum(["true", "false"], {
    message: "Please choose one value.",
  }),
});

const EditTableForm: React.FC<EditTableFormProps> = ({
  table,
  onClose,
  areaId,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: table.name,
      note: table?.note ? table.note : "",
      capacity: table?.capacity ? table.capacity : 1,
      price: table?.price ? table.price : 0,
      type: table.type as "normal" | "vip",
      status: table.status as "running" | "maintenance",
      is_reserved: table.is_reserved === true ? "true" : "false",
    },
  });

  const { mutate: mutateUpdateTable } = useUpdateTable(areaId);

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const { name, capacity, type, status, is_reserved, note, price } = values;

    const updateTableDto: UpdateTableDto = {
      tableId: table.id,
      name,
      note,
      type,
      capacity,
      status,
      is_reserved: is_reserved === "true" ? true : false,
      price,
      areaId,
    };

    setTimeout(() => {
      setIsLoading(false);
      mutateUpdateTable(updateTableDto);
      onClose();
    }, 2500);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col lg:gap-3 gap-2"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="dark:text-white text-black">Name</FormLabel>

              <FormControl>
                <Input
                  placeholder="Name of table..."
                  aria-label="name"
                  aria-labelledby="name"
                  {...field}
                />
              </FormControl>

              <FormMessage className="dark:text-red-400 text-red-500" />
            </FormItem>
          )}
        />

        <div className="relative grid lg:grid-cols-2 grid-cols-1 gap-2">
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
                    aria-labelledby="capacity"
                    endContent="Guests"
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

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-white text-black">
                  Price
                </FormLabel>
                <FormControl>
                  <Input
                    endContent="USD"
                    aria-labelledby="price"
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

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-white text-black">
                  Table Type
                </FormLabel>
                <FormControl>
                  <Select
                    items={types}
                    placeholder="Choose one type of table..."
                    aria-labelledby="type"
                    defaultSelectedKeys={[`${table.type}`]}
                    isDisabled={types.length === 0}
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
                    items={areaOrTableStatues}
                    defaultSelectedKeys={[`${table.status}`]}
                    placeholder="Choose one status..."
                    aria-labelledby="status"
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
        </div>

        <FormField
          control={form.control}
          name="is_reserved"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="dark:text-white text-black">
                Table Status
              </FormLabel>
              <FormControl>
                <Select
                  key={field.value || ""}
                  items={availabilities}
                  defaultSelectedKeys={[
                    `${table.is_reserved === true ? "true" : "false"}`,
                  ]}
                  placeholder="Choose one value..."
                  aria-labelledby="status"
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
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="dark:text-white text-black">
                Note About Table
              </FormLabel>

              <FormControl>
                <Textarea
                  placeholder="Note about table..."
                  aria-label="note"
                  aria-labelledby="note"
                  {...field}
                />
              </FormControl>

              <FormMessage className="dark:text-red-400 text-red-500" />
            </FormItem>
          )}
        />

        <div className="flex lg:items-end lg:justify-end justify-center items-center gap-2">
          <Button
            color="primary"
            className="dark:bg-white dark:text-black text-white"
            onPress={onClose}
          >
            Close
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
                Edit
              </Button>
            </>
          )}
        </div>
      </form>
    </Form>
  );
};

export default EditTableForm;
