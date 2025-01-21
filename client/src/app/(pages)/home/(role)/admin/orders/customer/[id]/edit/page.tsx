"use client";
import { UpdateOrderDto } from "@/api/orders/utils/types";
import { CheckIcon } from "@/components/icons/CheckIcon";
import LoadingPage from "@/components/LoadingPage";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { useOrderById } from "@/hooks/use-order";
import { useUpdateOrder } from "@/hooks/use-update-order";
import { methodMap, deliveryMap, statusMap } from "@/utils/maps";
import { Order } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Chip, Select, SelectItem, Textarea } from "@nextui-org/react";
import { useQueryClient } from "@tanstack/react-query";
import { XIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const statuses = [
  { key: "pending", label: "Pending" },
  { key: "success", label: "Success" },
  { key: "error", label: "Error" },
];

const formSchema = z.object({
  status: z.enum(["pending", "success", "error"], {
    message: "Please choose a valid status.",
  }),
  admin_message: z.string().optional(),
});

const EditOrderOfCustomer: React.FC = () => {
  const [isHandling, setIsHandling] = useState<boolean>(false);
  const [order, setOrder] = useState<Order | null>(null);
  const query = useQueryClient();

  const { mutate: mutateUpdateOrderStatus } = useUpdateOrder(
    order?.user.id ? order.user.id : ""
  );

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsHandling(true);
    const { admin_message, status } = values;

    if (!order) return;

    const {
      id,
      delivery_method,
      delivery_address,
      payment,
      total_price,
      order_details,
      user,
      createdAt,
    } = order;

    const data: UpdateOrderDto = {
      id,
      delivery_method,
      delivery_address,
      payment_method: payment.payment_method,
      status,
      total_price: Number(total_price),
      order_details,
      userId: user.id,
      admin_message,
      createdAt,
    };

    setTimeout(() => {
      setIsHandling(false);
      mutateUpdateOrderStatus(data);
      form.reset({
        admin_message: "",
        status: "pending",
      });
    }, 2500);
  }

  const cachedData = query.getQueryData(["orderId"]) as string;

  const { data, isLoading, isError } = useOrderById(cachedData);

  useEffect(() => {
    if (data) {
      setOrder(data as Order);
    }
  }, [data]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: order?.status ? (order.status as any) : "error",
      admin_message: "",
    },
  });

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <div>Error...</div>;
  }

  return (
    <main className="w-full relative container mx-auto lg:px-4 py-6 flex flex-col lg:gap-6 gap-4">
      <div
        className="flex flex-col lg:items-start items-center lg:justify-start 
        justify-center lg:text-left text-center"
      >
        <h1 className="lg:text-2xl text-xl uppercase font-bold">Edit order</h1>

        <p className="lg:text-base text-[14px] dark:text-white/70 text-black/80">
          Check the customer&apos;s order and confirm their order.
        </p>
      </div>

      <div className="relative lg:w-[50%] w-full container mx-auto">
        <div
          className="flex flex-col gap-1 dark:bg-black/30 dark:text-white 
       lg:p-6 p-4 border dark:border-white/30 rounded-xl shadow-custom"
        >
          <div className="flex flex-col gap-1">
            <h1 className="lg:text-base text-[14px]">
              Order ID:{" "}
              <span className="font-medium lg:text-xl text-base">
                #{order?.id}
              </span>
            </h1>

            <div className="grid lg:grid-cols-2 grid-cols-1">
              <div className="flex items-center gap-1">
                <p className="lg:text-[14px] text-[12px] dark:text-white/60 text-black/70">
                  Date:
                </p>

                <p>{(order?.createdAt as unknown as string)?.split("T")[0]}</p>
              </div>

              <div className="flex items-center gap-1">
                <p className="lg:text-[14px] text-[12px] dark:text-white/60 text-black/70">
                  Total Price:
                </p>

                <p>{order?.total_price + "$"}</p>
              </div>

              <div className="flex items-center gap-1">
                <p className="lg:text-[14px] text-[12px] dark:text-white/60 text-black/70">
                  Payment Method:
                </p>

                <p>
                  {
                    methodMap[
                      order?.payment?.payment_method as keyof typeof methodMap
                    ]
                  }
                </p>
              </div>

              <div className="flex items-center gap-1">
                <p className="lg:text-[14px] text-[12px] dark:text-white/60 text-black/70">
                  Delivery Method:
                </p>

                <p>
                  {
                    deliveryMap[
                      order?.delivery_method as keyof typeof deliveryMap
                    ]
                  }
                </p>
              </div>

              {order?.delivery_address && (
                <div className="flex items-center gap-1">
                  <p className="lg:text-[14px] text-[12px] dark:text-white/60 text-black/70">
                    Delivery Address:
                  </p>

                  <p>{order.delivery_address}</p>
                </div>
              )}

              <div className="flex items-center gap-1">
                <p className="lg:text-[14px] text-[12px] dark:text-white/60 text-black/70">
                  Status:
                </p>

                <p>{statusMap[order?.status as keyof typeof statusMap]}</p>
              </div>
            </div>

            <div className="flex flex-col relative">
              <h1 className="dark:text-white/60 text-black/70">
                Order Details:
              </h1>

              <p>
                {order &&
                  order.order_details &&
                  order.order_details
                    .map(
                      (detail) =>
                        detail.product.name + " (" + detail.quantity + ")"
                    )
                    .join(", ")}
              </p>
            </div>

            {order?.note && (
              <div className="flex items-center flex-col gap-1">
                <p className="lg:text-[14px] text-[12px] dark:text-white/60 text-black/70">
                  Note About Order
                </p>

                <p className="break-words">{order.note}</p>
              </div>
            )}
          </div>

          <Separator className="mx-2" />

          <div className="flex flex-col gap-1">
            <div
              className="flex flex-col gap-2 lg:items-start lg:justify-start
             items-center justify-center"
            >
              <h1>Payment Status</h1>

              <Chip
                color={order?.is_paid === true ? "success" : "danger"}
                variant="dot"
                startContent={
                  order?.is_paid === true ? <CheckIcon /> : <XIcon />
                }
              >
                {order?.is_paid === true ? "Paid" : "Not Paid"}
              </Chip>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col lg:gap-4 gap-3"
              >
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
                          items={statuses}
                          placeholder="Choose status"
                          aria-labelledby="status"
                          {...field}
                        >
                          {statuses.map((sta) => (
                            <SelectItem
                              key={sta.key}
                              aria-labelledby="status"
                              className="dark:text-white text-black"
                            >
                              {sta.label}
                            </SelectItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormMessage className="dark:text-red-400 text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="admin_message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark:text-white text-black">
                        Your Message (Optional)
                      </FormLabel>

                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Your message..."
                          aria-labelledby="message"
                        />
                      </FormControl>
                      <FormMessage className="dark:text-red-400 text-red-500" />
                    </FormItem>
                  )}
                />

                {isHandling ? (
                  <>
                    <Button
                      type="button"
                      isLoading
                      className="w-fit mx-auto dark:bg-white dark:text-black"
                    >
                      Please wait...
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      type="submit"
                      className="w-fit mx-auto dark:bg-white dark:text-black"
                      color="primary"
                    >
                      Submit
                    </Button>
                  </>
                )}
              </form>
            </Form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default EditOrderOfCustomer;
