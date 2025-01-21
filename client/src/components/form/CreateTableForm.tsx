import { CreateTableDto } from "@/api/tables/utils/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAddTable } from "@/hooks/use-add-table";
import { useAreas } from "@/hooks/use-areas";
import { useUserStore } from "@/store";
import { Area } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const types = [
  { key: "normal", label: "Normal" },
  { key: "vip", label: "VIP" },
];

const formSchema = z.object({
  name: z
    .string({ message: "Table name can't be empty." })
    .min(2, { message: "Table name must be at least 2 characters." }),
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
  note: z.string().optional(),
  areaId: z
    .string({ message: "Please choose one area" })
    .min(1, { message: "Please choose one area." }),
  type: z.enum(["normal", "vip"], { message: "Please choose a valid type." }),
});

interface CreateTableFormProps {
  onClose: () => void;
}

const CreateTableForm: React.FC<CreateTableFormProps> = ({ onClose }) => {
  const { user } = useUserStore();
  const { data } = useAreas();
  const [areas, setAreas] = useState<Record<string, string>[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { mutate: mutateAddTable } = useAddTable(user?.id!);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      capacity: undefined,
      price: undefined,
      note: "",
      areaId: undefined,
      type: undefined,
    },
  });

  const handleReset = () => {
    form.reset({
      name: "",
      capacity: undefined,
      price: undefined,
      note: "",
      areaId: undefined,
      type: undefined,
    });
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { name, note, price, capacity, areaId, type } = values;

    setIsLoading(true);

    const data: CreateTableDto = {
      name,
      note,
      price,
      capacity,
      areaId,
      type,
    };

    setTimeout(() => {
      setIsLoading(false);
      mutateAddTable(data);
      handleReset();
    }, 2500);
  }

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
              <FormLabel className="dark:text-white text-black">
                Table Name
              </FormLabel>

              <FormControl>
                <Input
                  placeholder="Name..."
                  {...field}
                  aria-label="name"
                  aria-labelledby="name"
                />
              </FormControl>

              <FormMessage className="dark:text-red-400 text-red-500" />
            </FormItem>
          )}
        />

        <div className="grid lg:grid-cols-2 grid-cols-1 gap-2">
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
        </div>

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
                  defaultSelectedKeys={field.value || []}
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
          name="areaId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="dark:text-white text-black">Area</FormLabel>
              <FormControl>
                <Select
                  items={areas}
                  placeholder="Choose one area..."
                  aria-labelledby="area"
                  defaultSelectedKeys={field.value || []}
                  isDisabled={areas.length === 0}
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
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="About the note..."
                  aria-labelledby="note"
                  aria-label="note"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="relative flex lg:justify-end justify-center items-center gap-2">
          <Button
            type="button"
            color="primary"
            onPress={() => {
              onClose();
              handleReset();
            }}
            className="dark:bg-white dark:text-black text-white"
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
  );
};

export default CreateTableForm;
