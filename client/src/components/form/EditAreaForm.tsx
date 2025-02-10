"use client";
import { UpdateAreaDto } from "@/api/areas/utils/types";
import ModalChooseTables from "@/components/modal/ModalChooseTables";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useTables } from "@/hooks/use-tables";
import { useUpdateArea } from "@/hooks/use-update-area";
import { Area, stringToTime, Table, timeToString } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Time } from "@internationalized/date";
import {
  Button,
  Input,
  Select,
  SelectItem,
  SharedSelection,
  Textarea,
  TimeInput,
} from "@heroui/react";
import { ClockIcon } from "lucide-react";
import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { areaOrTableStatues } from "@/config/constants";

const choices = [
  { key: "true", label: "True" },
  { key: "false", label: "False" },
];

const formSchema = z
  .object({
    name: z.string({ message: "Name of area can't be empty." }).min(1, {
      message: "Name of area can't be empty.",
    }),
    description: z.string({ message: "Description can't be empty." }).min(1, {
      message: "Description can't be empty.",
    }),
    capacity: z
      .number({ message: "Capacity must be a number." })
      .positive({ message: "Capacity must be a positive value." })
      .min(1, { message: "Capacity must be at least 1." }),
    floor_number: z
      .number({ message: "Floor number must be a number." })
      .positive({ message: "Floor number must be a positive value." })
      .min(1, { message: "Floor number must be at least 1." }),
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
    is_full: z.enum(["true", "false"], {
      message: "Please choose a valid value.",
    }),
    status: z.enum(["running", "maintenance"], {
      message: "Please choose a valid status.",
    }),
    tableIds: z
      .array(
        z
          .string()
          .min(1, { message: "Area must be contains at least 1 tables." })
      )
      .or(z.string({ message: "Area must be contains at least 1 tables." }))
      .transform((val) => {
        if (typeof val === "string") {
          return val.split(",").filter((id) => id.trim() !== "");
        }
        return val.filter((id) => id.trim() !== "");
      })
      .refine((val) => Array.isArray(val) && val.length > 0, {
        message: "Area must be contains at least 1 tables.",
      }),
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

interface EditAreaFormProps {
  area: Area;
}

const typeMap = {
  normal: "Normal",
  vip: "VIP",
};

const EditAreaForm: React.FC<EditAreaFormProps> = ({ area }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(
    new Set(area.tables.map((table) => table.id))
  );
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: area.name ? area.name : "",
      description: area.description ? area.description : "",
      capacity: area.capacity ? area.capacity : 1,
      floor_number: area.floor_number ? area.floor_number : 1,
      start_time: area.operating_hours.split("-")[0],
      end_time: area.operating_hours.split("-")[1],
      is_full: area.is_full === true ? "true" : "false",
      status: area.status as "running" | "maintenance",
      tableIds: area.tables.map((table) => table.id),
    },
  });

  const handleSelectionChange = (keys: SharedSelection) => {
    setSelectedKeys(new Set(Array.from(keys).map((key) => String(key))));
  };

  useEffect(() => {
    if (area && area.tables && area.tables.length) {
      setTables(area.tables);
    }
  }, [area]);

  const { data, refetch } = useTables("none");

  const { mutate: mutateUpdateArea } = useUpdateArea(area.id);

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const {
      name,
      description,
      capacity,
      is_full,
      start_time,
      end_time,
      status,
      floor_number,
    } = values;

    const updateAreaDto: UpdateAreaDto = {
      name,
      description,
      capacity,
      is_full: is_full === "true" ? true : false,
      status,
      operating_hours: start_time + "-" + end_time,
      tableIds: Array.from(selectedKeys),
      areaId: area.id,
      floor_number,
    };

    setTimeout(() => {
      setIsLoading(false);
      mutateUpdateArea(updateAreaDto);
    }, 2500);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col lg:gap-3 gap-2 lg:w-1/2 w-full relative mx-auto p-6 shadow-custom
        border dark:border-white/20 rounded-xl"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="dark:text-white text-black">Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Name..."
                  aria-label="name"
                  aria-labelledby="name"
                  {...field}
                />
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
                  aria-label="description"
                  aria-labelledby="description"
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

        <div className="relative grid lg:grid-cols-2 grid-cols-1 gap-2">
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
                    defaultSelectedKeys={[`${area.status}`]}
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

          <FormField
            control={form.control}
            name="is_full"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-white text-black">
                  Is Full?
                </FormLabel>
                <FormControl>
                  <Select
                    key={field.value || ""}
                    items={choices}
                    defaultSelectedKeys={[
                      `${area.is_full === true ? "true" : "false"}`,
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
        </div>

        <FormField
          control={form.control}
          name="tableIds"
          render={({ field }) => (
            <FormItem>
              <div className="flex md:flex-row flex-col md:items-center md:justify-between gap-1">
                <FormLabel className="dark:text-white text-black">
                  Tables
                </FormLabel>

                {data && data?.length !== 0 && (
                  <ModalChooseTables
                    tables={data as Table[]}
                    setTables={setTables}
                    original_tables={tables}
                    setSelectedKeys={setSelectedKeys}
                    refetch={refetch}
                  />
                )}
              </div>
              <FormControl>
                <Select
                  items={tables}
                  placeholder="Choose one table..."
                  aria-labelledby="table"
                  selectionMode="multiple"
                  selectedKeys={selectedKeys}
                  onSelectionChange={handleSelectionChange}
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

        {isLoading ? (
          <>
            <Button
              color="primary"
              isLoading
              className="w-fit mx-auto dark:bg-white dark:text-black
        text-white"
            >
              Please wait...
            </Button>
          </>
        ) : (
          <>
            <Button
              type="submit"
              color="primary"
              className="w-fit mx-auto dark:bg-white dark:text-black
        text-white"
            >
              Submit
            </Button>
          </>
        )}
      </form>
    </Form>
  );
};

export default EditAreaForm;
