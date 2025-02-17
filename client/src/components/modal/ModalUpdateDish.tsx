"use client";
import { UpdateProductDto } from "@/api/products/utils/types";
import ModalConfirmUpdateDish from "@/components/modal/ModalConfirmUpdateDish";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { availabilities, categories } from "@/config/constants";
import { Product } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
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
import { PencilLineIcon, SquarePenIcon } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ScrollArea } from "@/components/ui/scroll-area";

const is_featured_array = [
  { key: "true", value: "True" },
  { key: "false", value: "False" },
];

const formSchema = z.object({
  name: z
    .string({ message: "Name can't be empty." })
    .min(5, { message: "Name must be at least 5 characters." })
    .max(255, { message: "Name can't be greater 255 characters." }),
  price: z.preprocess((val) => {
    if (typeof val === "string") {
      return parseFloat(val);
    }
    return val;
  }, z.number({ message: "Invalid amount!" }).positive({ message: "Amount must be positive!" })),
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
  ingredients: z
    .string({ message: "Ingredients must be a string." })
    .min(1, { message: "Ingredients must be at least 1 characters." }),
  is_featured: z.enum(["true", "false"], {
    message: "Please choose valid value in this field.",
  }),
  is_available: z.enum(["true", "false"], {
    message: "Please choose valid value in this field.",
  }),
  description: z
    .string({ message: "Please fill this field." })
    .min(1, { message: "Description can't be empty." })
    .max(255, { message: "Description can't be greater than 255 characters." }),
  stock: z.preprocess((val) => {
    if (typeof val === "string") {
      return parseFloat(val);
    }
    return val;
  }, z.number({ message: "Invalid stock number." }).positive({ message: "Stock number must be positive." })),
});

interface ModalUpdateDishProps {
  dish: Product;
}

const ModalUpdateDish: React.FC<ModalUpdateDishProps> = ({ dish }) => {
  const [productUpdate, setProductUpdate] = useState<UpdateProductDto>({
    id: dish.id,
    name: dish.name,
    description: dish.description,
    price: dish.price,
    category: dish.category,
    is_available: dish.is_available,
    is_featured: dish.is_featured,
    stock: dish.stock,
    ingredients: dish.ingredients,
  });

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: dish?.name ? dish.name : "",
      price: dish?.price ? dish.price : 0,
      is_featured: dish?.is_featured ? "true" : "false",
      is_available: dish?.is_available ? "true" : "false",
      description: dish?.description ? dish.description : "",
      ingredients: dish?.ingredients ? dish.ingredients : "",
      stock: dish?.stock ? dish.stock : 0,
      category: dish?.category as
        | "appetizer"
        | "dessert"
        | "hotpot"
        | "main_course"
        | "beverage"
        | "signature_dishes"
        | "snack",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const {
      name,
      description,
      price,
      category,
      is_featured,
      is_available,
      ingredients,
      stock,
    } = values;

    const data: UpdateProductDto = {
      id: productUpdate.id,
      name,
      description,
      price,
      category,
      is_featured: is_featured === "true" ? true : false,
      is_available: is_available === "false" ? false : true,
      stock,
      ingredients,
    };

    setProductUpdate(data);
  }

  return (
    <>
      <Tooltip content="Update" className="dark:text-white text-black">
        <SquarePenIcon
          className="cursor-pointer opacity-80 hover:opacity-100 duration-250
         ease-in-out transition-opacity"
          onClick={onOpen}
        />
      </Tooltip>

      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        placement="center"
        size="xl"
        isDismissable={false}
        isKeyboardDismissDisabled={false}
        onOpenChange={onOpenChange}
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
              <ModalHeader className="flex flex-col lg:text-left text-center">
                Update Dish
              </ModalHeader>

              <ModalBody>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-2 relative"
                  >
                    <ScrollArea className="h-[450px] lg:pr-4 pr-3">
                      <div className="flex flex-col">
                        <div className="grid lg:grid-cols-2 grid-cols-1 lg:gap-4">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Name..." {...field} />
                                </FormControl>
                                <FormMessage className="dark:text-red-300 text-red-500" />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                  <Input
                                    endContent="USD"
                                    placeholder="Price..."
                                    {...field}
                                    value={String(field.value)}
                                  />
                                </FormControl>
                                <FormMessage className="dark:text-red-300 text-red-500" />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="relative grid lg:grid-cols-2 grid-cols-1 flex-1 lg:gap-4">
                          <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="dark:text-white ">
                                  Category
                                </FormLabel>
                                <FormControl>
                                  <Select
                                    items={categories}
                                    placeholder="Choose one category"
                                    aria-labelledby="category"
                                    defaultSelectedKeys={
                                      new Set([dish.category])
                                    }
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
                                <FormMessage className="dark:text-red-300 text-red-500" />
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
                        </div>

                        <div className="relative grid lg:grid-cols-2 grid-cols-1 lg:gap-4">
                          <FormField
                            control={form.control}
                            name="is_featured"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="dark:text-white ">
                                  Is Featured
                                </FormLabel>
                                <FormControl>
                                  <Select
                                    items={is_featured_array}
                                    placeholder="Whether dish is featured or not?"
                                    aria-labelledby="isFeatured"
                                    defaultSelectedKeys={[
                                      `${dish.is_featured}`,
                                    ]}
                                    {...field}
                                  >
                                    {(featured) => (
                                      <SelectItem
                                        key={featured.key}
                                        className="text-black dark:text-white"
                                        aria-labelledby="isFeatured"
                                      >
                                        {featured.value}
                                      </SelectItem>
                                    )}
                                  </Select>
                                </FormControl>
                                <FormMessage className="dark:text-red-300 text-red-500" />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="is_available"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="dark:text-white ">
                                  Availability
                                </FormLabel>
                                <FormControl>
                                  <Select
                                    items={availabilities}
                                    placeholder="Whether dish is featured or not?"
                                    aria-labelledby="isFeatured"
                                    defaultSelectedKeys={[
                                      `${dish.is_available}`,
                                    ]}
                                    {...field}
                                  >
                                    {(availability) => (
                                      <SelectItem
                                        key={availability.key}
                                        className="text-black dark:text-white"
                                        aria-labelledby="isFeatured"
                                      >
                                        {availability.label}
                                      </SelectItem>
                                    )}
                                  </Select>
                                </FormControl>
                                <FormMessage className="dark:text-red-300 text-red-500" />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="ingredients"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="dark:text-white text-black">
                                Ingredients
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="About the ingredients of dish..."
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="dark:text-red-300 text-red-500" />
                            </FormItem>
                          )}
                        />

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
                      </div>
                    </ScrollArea>

                    <div className="flex lg:items-center lg:justify-end justify-center gap-3">
                      <Button
                        color="primary"
                        className="dark:bg-white dark:text-black"
                        onPress={onClose}
                      >
                        Cancel
                      </Button>

                      <ModalConfirmUpdateDish
                        productUpdate={productUpdate}
                        onCloseParent={onClose}
                      />
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

export default ModalUpdateDish;
