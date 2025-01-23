"use client";
import { CreateProductDto } from "@/api/products/utils/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { categories } from "@/config/constants";
import { useAddProduct } from "@/hooks/use-add-product";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Select, SelectItem, Textarea } from "@heroui/react";
import React, { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const imageSchema = z
  .instanceof(File, { message: "Please choose a image." })
  .refine((file) => file.type.startsWith("image/"), {
    message: "Invalid image.",
  });

const formSchema = z.object({
  name: z
    .string({ message: "Name mustn't be empty." })
    .min(2, { message: "Name must contain at least 2 character(s)." })
    .max(50),
  description: z
    .string({ message: "Description mustn't be empty." })
    .min(1, { message: "Description must be a least 1 characters." })
    .max(255),
  price: z.preprocess((val) => {
    if (typeof val === "string") {
      return parseFloat(val);
    }
    return val;
  }, z.number({ message: "Invalid amount." }).positive({ message: "Amount must be positive." })),
  category: z.enum(
    [
      "appetizer",
      "dessert",
      "hotpot",
      "main_course",
      "beverage",
      "signature_dishes",
      "snack",
    ],
    {
      message: "Please choose a valid category.",
    }
  ),
  image: imageSchema,
  ingredients: z
    .string({ message: "Ingredients must be a string." })
    .min(1, { message: "Ingredients can't be empty." }),
  stock: z.preprocess((val) => {
    if (typeof val === "string") {
      return parseFloat(val);
    }
    return val;
  }, z.number({ message: "Invalid stock number." }).positive({ message: "Stock number must be positive." })),
});

const AddDishToMenuPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const { mutate: mutateAddProduct } = useAddProduct();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: 0,
      description: "",
      category: undefined,
      stock: 0,
      ingredients: "",
      image: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { name, description, price, image, category, ingredients, stock } =
      values;

    const data: CreateProductDto = {
      name,
      description,
      price,
      category,
      image,
      ingredients,
      stock,
    };

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      mutateAddProduct(data);
      form.reset({
        name: "",
        price: 0,
        description: "",
        category: undefined,
        stock: 0,
        ingredients: "",
        image: undefined,
      });
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
    <div className="container mx-auto py-4 flex flex-col lg:gap-4 gap-2">
      <div
        className="relative flex flex-col lg:items-start 
      lg:justify-start items-center justify-center"
      >
        <h1 className="lg:text-2xl text-xl uppercase font-bold">New Dish</h1>

        <p className="lg:text-base text-[14px] dark:text-white/70 text-black/70">
          Create A New Dish For Menu
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2 lg:w-1/2 w-full px-6 py-3 mx-auto flex flex-col gap-2
           border dark:border-white/40 shadow-custom rounded-xl"
        >
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 dark:text-white text-black">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-white text-black">
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Name..." />
                  </FormControl>
                  <FormMessage className="dark:text-red-300 text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-white text-black">
                    Price ($)
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      value={String(field.value)}
                      placeholder="20"
                      endContent="USD"
                    />
                  </FormControl>
                  <FormMessage className="dark:text-red-300 text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-white text-black">
                    Category
                  </FormLabel>
                  <FormControl>
                    <Select
                      items={categories}
                      aria-labelledby="category"
                      placeholder="Select categories"
                      {...field}
                    >
                      {(category) => (
                        <SelectItem
                          key={category.key}
                          className="text-black dark:text-white"
                          aria-labelledby="category"
                        >
                          {category.label}
                        </SelectItem>
                      )}
                    </Select>
                  </FormControl>
                  <FormMessage className="dark:text-red-300 text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-white text-black">
                    Dish Image
                  </FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-2">
                      <Input type="file" onChange={handleImageChange} />

                      {imageError && (
                        <p className="dark:text-red-300 text-red-400">
                          {imageError}
                        </p>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage className="dark:text-red-300 text-red-400" />
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
                  <Textarea {...field} placeholder="Description..." />
                </FormControl>
                <FormMessage className="dark:text-red-300 text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ingredients"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-white text-black">
                  Ingredients
                </FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Ingredients..." />
                </FormControl>
                <FormMessage className="dark:text-red-300 text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-white text-black">
                  Stock Number
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    value={String(field.value)}
                    placeholder="100"
                  />
                </FormControl>
                <FormMessage className="dark:text-red-300 text-red-400" />
              </FormItem>
            )}
          />

          {isLoading ? (
            <>
              <Button
                isLoading
                color="primary"
                type="button"
                className="dark:bg-white
             dark:text-black w-fit mx-auto"
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
    </div>
  );
};

export default AddDishToMenuPage;
