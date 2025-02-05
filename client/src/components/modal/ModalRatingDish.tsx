"use client";
import { CreateReviewDto } from "@/api/reviews/utils/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ReviewEnum } from "@/config/enums/enums";
import { useAddReview } from "@/hooks/use-add-review";
import { useUserStore } from "@/store";
import { Product } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
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
import { StarIcon } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const ratings = [
  { key: "1", title: "1" },
  { key: "2", title: "2" },
  { key: "3", title: "3" },
  { key: "4", title: "4" },
  { key: "5", title: "5" },
];

const formSchema = z.object({
  ratingNumber: z.preprocess((val) => {
    if (val === "" || val === undefined || val === null) {
      return undefined;
    }
    return Number(val);
  }, z.number({ message: "Invalid rating number." }).min(1, "Rating must be at least 1.")),
  comment: z
    .string({ message: "Comment must be a string." })
    .min(1, { message: "Comment can't be empty." }),
});

interface ModalRatingDishProps {
  product: Product;
}

const categoryMap: Record<string, string> = {
  appetizer: "Appetizer",
  dessert: "Dessert",
  main_course: "Main Course",
  snack: "Snack",
  signature_dishes: "Signature Dishes",
  beverage: "Beverage",
  hotpot: "Hot Pot",
};

const ModalRatingDish: React.FC<ModalRatingDishProps> = ({ product }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { onOpen, onOpenChange, isOpen, onClose } = useDisclosure();

  const { user } = useUserStore();

  const { mutate: mutateAddReview } = useAddReview();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ratingNumber: undefined,
      comment: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { ratingNumber, comment } = values;

    setIsLoading(true);

    const data: CreateReviewDto = {
      userId: user?.id!,
      comment,
      rating_number: ratingNumber,
      type: ReviewEnum.PRODUCT,
      date: new Date(),
      productId: product.id,
    };

    setTimeout(() => {
      setIsLoading(false);
      mutateAddReview(data);
      form.reset({
        ratingNumber: undefined,
        comment: "",
      });
      onClose();
    }, 2500);
  }

  return (
    <>
      <Tooltip
        content="Rating"
        showArrow
        className="dark:bg-white dark:text-black text-black"
      >
        <StarIcon
          size={30}
          className="opacity-50 hover:opacity-100 
            duration-250 ease-in-out transition-opacity cursor-pointer select-none"
          onClick={onOpen}
        />
      </Tooltip>

      <Modal
        backdrop="opaque"
        placement="center"
        isOpen={isOpen}
        size="lg"
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
              <ModalHeader className="flex flex-col gap-1 lg:text-left text-center">
                Your Rating
              </ModalHeader>

              <ModalBody>
                <div className="flex flex-col gap-1">
                  <div className="flex md:flex-row flex-col md:justify-between md:items-center gap-1">
                    <h1>
                      Dish&apos;s Name:{" "}
                      <span className="font-medium">{product.name}</span>
                    </h1>

                    <p>
                      Price:{" "}
                      <span className="font-medium">
                        {product.price}$ (USD)
                      </span>
                    </p>
                  </div>

                  <div className="flex md:flex-row flex-col md:justify-between md:items-center gap-1">
                    <p>
                      Rating number:{" "}
                      <span className="font-medium">
                        {product.average_rating}⭐
                      </span>
                    </p>

                    <p>
                      Category:{" "}
                      <span className="font-medium">
                        {
                          categoryMap[
                            product.category as keyof typeof categoryMap
                          ]
                        }
                      </span>
                    </p>
                  </div>
                </div>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-3"
                  >
                    <FormField
                      control={form.control}
                      name="ratingNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-white text-black">
                            Rating Number
                          </FormLabel>

                          <FormControl>
                            <Select
                              items={ratings}
                              label="Select rating number"
                              className="dark:text-white text-black"
                              selectedKeys={
                                field.value ? [field.value] : undefined
                              }
                              aria-labelledby="rating"
                              {...field}
                            >
                              {(ratings) => (
                                <SelectItem
                                  key={ratings.key}
                                  className="text-black dark:text-white"
                                  aria-labelledby="rating"
                                >
                                  {ratings.title}
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
                      name="comment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-white text-black">
                            Your Comment
                          </FormLabel>

                          <FormControl>
                            <Textarea
                              placeholder="Write your comment about this dish..."
                              {...field}
                              aria-labelledby="review"
                            />
                          </FormControl>
                          <FormMessage className="dark:text-red-300 text-red-500" />
                        </FormItem>
                      )}
                    />

                    <div
                      className="lg:text-[14px] text-[13px] flex flex-col 
                    dark:text-white/60 text-black/70 lg:text-left text-center 
                    lg:items-start items-center"
                    >
                      <p className="font-medium lg:text-base text-[14px]">
                        Note:
                      </p>

                      <p>
                        Once you have submitted a review for the dish, you are
                        fully responsible for your comments.
                      </p>
                    </div>

                    <div
                      className="relative flex lg:items-end lg:justify-end 
                    gap-3 flex-row items-center justify-center"
                    >
                      <Button
                        color="primary"
                        className="dark:bg-white dark:text-black"
                        onPress={onClose}
                      >
                        Close
                      </Button>

                      {isLoading ? (
                        <>
                          <Button
                            isLoading
                            color="primary"
                            className="dark:bg-white dark:text-black"
                          >
                            Please wait...
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            color="primary"
                            className="dark:bg-white dark:text-black text-white"
                            type="submit"
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

export default ModalRatingDish;
