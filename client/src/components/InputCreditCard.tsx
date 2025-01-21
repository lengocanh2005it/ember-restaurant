"use client";
import { CreatePaymentDetailsDto } from "@/api/payments/utils/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { usePayment } from "@/hooks/use-payment";
import {
  useCartStore,
  useDiscountStore,
  useOrderStore,
  useReservationStore,
  useUserStore,
} from "@/store";
import { CachedOrderData, CachedReservationData } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useQueryClient } from "@tanstack/react-query";
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
});

interface InputCreditCardProps {
  onClose: () => void;
}

const InputCreditCard: React.FC<InputCreditCardProps> = ({ onClose }) => {
  const query = useQueryClient();
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
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
  const { orderPayment, setOrderPayment } = useOrderStore();
  const { setReservationPayment, reservationPayment } = useReservationStore();
  const { setSelectedCarts } = useCartStore();

  const { mutate: mutatePayment } = usePayment(user?.id!);

  const cachedOrderData = query.getQueryData([
    "orderData",
    user?.id!,
  ]) as CachedOrderData;

  const cachedReservationData = query.getQueryData([
    "reservationData",
    user?.id!,
  ]) as CachedReservationData;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { amount } = values;
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement!,
    });

    if (error) {
      console.error(error);
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      onClose();

      setIsLoading(false);

      let data = null;

      if (
        orderPayment &&
        orderPayment.orderId !== "" &&
        orderPayment.totalPrice !== 0
      ) {
        query.removeQueries({
          queryKey: ["orderData", user?.id!],
          exact: true,
        });
        query.removeQueries({
          queryKey: ["reservationData", user?.id!],
          exact: true,
        });
        setReservationPayment({
          reservationId: "",
          totalPrice: 0,
        });
      }

      if (
        reservationPayment &&
        reservationPayment.reservationId !== "" &&
        reservationPayment.totalPrice !== 0
      ) {
        query.removeQueries({
          queryKey: ["orderData", user?.id!],
          exact: true,
        });
        query.removeQueries({
          queryKey: ["reservationData", user?.id!],
          exact: true,
        });
        setOrderPayment({
          orderId: "",
          totalPrice: 0,
        });
      }

      if (cachedOrderData) {
        query.removeQueries({
          queryKey: ["reservationData", user?.id!],
          exact: true,
        });
        data = {
          payments: {
            amount,
            source: paymentMethod?.id!,
            payment_method: "card",
            type: "order",
            userId: user?.id!,
          },
          order: cachedOrderData,
        };
      } else if (
        orderPayment &&
        orderPayment.orderId !== "" &&
        orderPayment.totalPrice !== 0
      ) {
        data = {
          payments: {
            amount,
            source: paymentMethod?.id!,
            payment_method: "card",
            type: "order",
            userId: user?.id!,
            orderId: orderPayment.orderId,
          },
        };
      } else if (cachedReservationData) {
        data = {
          payments: {
            amount,
            source: paymentMethod?.id,
            payment_method: "card",
            type: "reservation",
            userId: user?.id!,
          },
          reservation: cachedReservationData,
        };
      } else if (
        reservationPayment &&
        reservationPayment.reservationId !== "" &&
        reservationPayment.totalPrice !== 0
      ) {
        data = {
          payments: {
            amount,
            source: paymentMethod?.id!,
            payment_method: "card",
            type: "reservation",
            userId: user?.id!,
            reservationId: reservationPayment.reservationId,
          },
        };
      }

      mutatePayment(data as CreatePaymentDetailsDto);

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
