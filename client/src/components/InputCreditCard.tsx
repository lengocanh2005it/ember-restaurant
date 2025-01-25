"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAddOrder } from "@/hooks/use-add-order";
import {
  useAppStore,
  useCartStore,
  useDiscountStore,
  useOrderStore,
  useReservationStore,
  useUserStore,
} from "@/store";
import { Button, Input, Textarea } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  amount: z.preprocess((val) => {
    if (typeof val === "string") {
      return parseFloat(val);
    }
    return val;
  }, z.number({ message: "Invalid Amount." }).positive({ message: "Amount must be positive." })),
  description: z.string().optional(),
});

interface InputCreditCardProps {
  onClose: () => void;
}

const InputCreditCard: React.FC<InputCreditCardProps> = ({ onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      description: "",
    },
  });

  const options = {
    style: {
      base: {
        color: "white",
      },
      invalid: {
        color: "red",
      },
    },
  };

  const { user } = useUserStore();
  const { setDiscount } = useDiscountStore();
  const { orderData } = useOrderStore();
  const { setReservationPayment, reservationPayment } = useReservationStore();
  const { setSelectedCarts } = useCartStore();
  const { type } = useAppStore();

  const { mutate } = useAddOrder(user?.id!);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { amount, description } = values;

    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) return;

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      console.error(error);
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      if (type === "order" && orderData) {
        mutate({
          ...orderData,
          payment_method_id: paymentMethod.id,
          payment_description: description,
        });
      } else if (type === "reservation") {
        //  paymentDto = {};
      }
      setIsLoading(false);
      setDiscount(null);
      setSelectedCarts([]);
      onClose();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 2200);
  }

  function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();
    form.handleSubmit(onSubmit)();
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={handleFormSubmit}
          className="flex flex-col lg:gap-4 gap-2"
        >
          <div className="flex flex-col gap-2">
            <h1 className="lg:text-[14px] text-[13px] font-semibold">
              Card Information
            </h1>

            <div className="border dark:border-white/30 p-4 rounded-lg">
              <CardElement options={options} />
            </div>
          </div>

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-white text-black">
                  Amount
                </FormLabel>
                <FormControl>
                  <Input
                    aria-labelledby="amount"
                    placeholder="Ex: 10"
                    variant="bordered"
                    endContent="USD"
                    {...field}
                    value={String(field.value)}
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
                  Description (Optional)
                </FormLabel>
                <FormControl>
                  <Textarea
                    aria-labelledby="description"
                    aria-label="description"
                    placeholder="Your description..."
                    variant="bordered"
                    {...field}
                    value={String(field.value)}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {isLoading ? (
            <>
              <Button
                color="primary"
                isLoading
                className="w-fit dark:bg-white dark:text-black mx-auto"
              >
                Loading...
              </Button>
            </>
          ) : (
            <>
              <Button
                type="submit"
                color="primary"
                className="dark:bg-white dark:text-black w-fit mx-auto"
              >
                Pay
              </Button>
            </>
          )}
        </form>
      </Form>
    </>
  );
};

export default InputCreditCard;
