"use client";
import { UpdateOrderDto } from "@/api/orders/utils/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import VoucherList from "@/components/VoucherList";
import { useUpdateOrder } from "@/hooks/use-update-order";
import { useDiscountStore, useOrderStore, useUserStore } from "@/store";
import { DiscountWithQuantity, Order, OrderDetails, Product } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  CardBody,
  Chip,
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
import { RotateCcwIcon, SquarePenIcon, XIcon } from "lucide-react";
import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { ScrollArea } from "@/components/ui/scroll-area";

const deliveries = [
  { key: "home_delivery", label: "Home Delivery" },
  { key: "pick_up", label: "Pick Up" },
];

const payments = [
  { key: "card", label: "Credit Card" },
  { key: "cash", label: "Pay In Cash" },
];

const formSchema = z
  .object({
    note: z.string().optional(),
    delivery_address: z.string().optional(),
    payment_method: z.enum(["card", "cash"], {
      message: "Please choose this field.",
    }),
    delivery_method: z.enum(["home_delivery", "pick_up"], {
      message: "Please choose this field.",
    }),
    promotionCode: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.delivery_method === "home_delivery") {
        return data.delivery_address && data.delivery_address.trim() !== "";
      }

      return true;
    },
    {
      path: ["delivery_address"],
      message: "Delivery address can't be empty.",
    }
  );

interface ModalUpdateOrderProps {
  onCloseFC: () => void;
}

const ModalUpdateOrder: React.FC<ModalUpdateOrderProps> = ({ onCloseFC }) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { orderUpdate } = useOrderStore();
  const { discount, setDiscount } = useDiscountStore();
  const { user } = useUserStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [orderDetails, setOrderDetails] = useState<OrderDetails[]>([]);
  const [historyOrderDetails, setHistoryOrderDetails] = useState<
    OrderDetails[]
  >([]);

  const { mutate: mutateUpdateOrder } = useUpdateOrder(user?.id!);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      delivery_address: orderUpdate?.delivery_address,
      note: orderUpdate?.note ? orderUpdate.note : "",
      payment_method: orderUpdate?.payment?.payment_method as "card" | "cash",
      delivery_method: orderUpdate?.delivery_method as
        | "home_delivery"
        | "pick_up",
      promotionCode: "",
    },
  });

  const handleRemoveOrderDetail = (orderDetailToRemove: OrderDetails) => {
    const newProducts = orderDetails.filter(
      (product: OrderDetails) => product.id !== orderDetailToRemove.id
    );

    setHistoryOrderDetails((prevState: OrderDetails[]) => [
      ...prevState,
      orderDetailToRemove,
    ]);

    setOrderDetails(newProducts);
  };

  const promotionCode = useWatch({
    control: form.control,
    name: "promotionCode",
  });

  const handleUndoItem = () => {
    const lastItem = historyOrderDetails[historyOrderDetails.length - 1];

    setOrderDetails((prevState: OrderDetails[]) => [...prevState, lastItem]);

    setHistoryOrderDetails((prevState: OrderDetails[]) =>
      prevState.filter((state) => state.id != lastItem.id)
    );
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!orderDetails.length) return;

    setIsLoading(true);

    const {
      delivery_address,
      delivery_method,
      payment_method,
      note,
      promotionCode,
    } = values;

    const { createdAt, status, id, total_price } = orderUpdate as Order;

    const data: UpdateOrderDto = {
      createdAt,
      status,
      id,
      userId: user?.id!,
      delivery_method,
      payment_method,
      note,
      order_details: orderDetails,
      total_price,
      ...(discount ? { discountId: discount.discount.id } : {}),
      ...(delivery_address !== "" ? { delivery_address } : {}),
      promotionCode,
    };

    setTimeout(() => {
      setIsLoading(false);
      mutateUpdateOrder(data);
      onClose();
      onCloseFC();
      setDiscount(null);
    }, 2500);
  }

  const deliveryMethod = useWatch({
    control: form.control,
    name: "delivery_method",
  });

  const renderVoucher = (voucher: DiscountWithQuantity) => {
    return (
      <Chip
        key={voucher.discount.id}
        color="primary"
        className="dark:bg-white dark:text-black text-white"
        onClose={() => {
          setDiscount(null);
        }}
      >
        {voucher.discount.value}
        {voucher.discount.type === "percentage" ? "%" : " USD"}
      </Chip>
    );
  };

  React.useEffect(() => {
    if (orderUpdate?.order_details) {
      setOrderDetails(orderUpdate.order_details);
    }
  }, [orderUpdate]);

  return (
    <>
      <Tooltip content="Update" className="dark:text-white text-black">
        <SquarePenIcon
          className="opacity-50 hover:opacity-100 
                  transition-opacity duration-300 ease-in-out cursor-pointer"
          onClick={onOpen}
        />
      </Tooltip>

      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        placement="center"
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
        <ModalContent
          className="dark:text-white text-black"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 lg:text-left text-center">
                Update Order
              </ModalHeader>

              <ModalBody className="flex flex-col gap-6">
                <div className="flex flex-col flex-wrap gap-2 rounded-md flex-1">
                  <>
                    {orderDetails.length === 0 ? (
                      <div className="flex items-center justify-center w-full flex-1 flex-wrap">
                        <div
                          className="flex items-center gap-1 lg:text-[14px] 
                          text-[12px] dark:text-red-400 text-red-500 text-center justify-center"
                        >
                          <p>Empty Products</p>
                          <XIcon />
                        </div>
                      </div>
                    ) : (
                      <ScrollArea className="flex flex-col flex-wrap md:h-[100px] h-[60px] rounded-md w-full">
                        <div className="flex flex-col gap-2">
                          {orderDetails.map((detail, index) => (
                            <Chip
                              key={index}
                              color="primary"
                              className="dark:bg-white dark:text-black text-white"
                              onClose={() => {
                                handleRemoveOrderDetail(detail);
                              }}
                            >
                              {detail.product.name +
                                " (" +
                                detail.quantity +
                                ")"}
                            </Chip>
                          ))}
                        </div>
                      </ScrollArea>
                    )}

                    {historyOrderDetails.length !== 0 && (
                      <div className="relative flex items-end justify-end">
                        <Tooltip
                          content="Undo"
                          className="dark:text-white text-black"
                        >
                          <RotateCcwIcon
                            onClick={handleUndoItem}
                            className="opacity-50 hover:opacity-100 duration-250
                             ease-in-out transition-opacity cursor-pointer"
                          />
                        </Tooltip>
                      </div>
                    )}
                  </>
                </div>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col lg:gap-4 gap-2"
                  >
                    <div className="grid lg:grid-cols-2 grid-cols-1 lg:gap-4 gap-2">
                      {/* Payment method */}
                      <FormField
                        control={form.control}
                        name="payment_method"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Payment Method</FormLabel>
                            <FormControl>
                              <Select
                                items={payments}
                                id="payment_method"
                                placeholder="Select a payment method"
                                aria-labelledby="delivery_method"
                                defaultSelectedKeys={[
                                  `${orderUpdate?.payment?.payment_method}`,
                                ]}
                                selectedKeys={field.value ? [field.value] : []}
                                {...field}
                              >
                                {payments.map((payment) => (
                                  <SelectItem
                                    key={payment.key}
                                    className="dark:text-white text-black"
                                    aria-labelledby="delivery_method"
                                  >
                                    {payment.label}
                                  </SelectItem>
                                ))}
                              </Select>
                            </FormControl>
                            <FormMessage className="dark:text-red-300 text-red-500" />
                          </FormItem>
                        )}
                      />

                      {/* delivery method */}
                      <FormField
                        control={form.control}
                        name="delivery_method"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel
                              htmlFor="delivery_method"
                              className="dark:text-white text-black"
                            >
                              Delivery Method
                            </FormLabel>

                            <FormControl>
                              <Select
                                id="delivery_method"
                                placeholder="Select a delivery method"
                                aria-labelledby="delivery_method"
                                items={payments}
                                defaultSelectedKeys={[
                                  `${orderUpdate?.delivery_method}`,
                                ]}
                                selectedKeys={field.value ? [field.value] : []}
                                {...field}
                              >
                                {deliveries.map((delivery) => (
                                  <SelectItem
                                    key={delivery.key}
                                    className="dark:text-white text-black"
                                    aria-labelledby="delivery_method"
                                  >
                                    {delivery.label}
                                  </SelectItem>
                                ))}
                              </Select>
                            </FormControl>
                            <FormMessage className="dark:text-red-400" />
                          </FormItem>
                        )}
                      />
                    </div>

                    {deliveryMethod === "home_delivery" && (
                      <FormField
                        control={form.control}
                        name="delivery_address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel
                              htmlFor="delivery_address"
                              className="dark:text-white text-black"
                            >
                              Delivery Address
                            </FormLabel>
                            <FormControl>
                              <Input
                                id="delivery_address"
                                placeholder="Enter delivery address..."
                                aria-label="delivery-address"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="dark:text-red-400 text-red-500" />
                          </FormItem>
                        )}
                      />
                    )}

                    {(!discount || !orderUpdate?.discounts) && (
                      <FormField
                        control={form.control}
                        name="promotionCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel
                              htmlFor="promotionCode"
                              className="dark:text-white text-black"
                            >
                              Promotion Code (Optional)
                            </FormLabel>

                            <FormControl>
                              <Input
                                id="promotionCode"
                                placeholder="Enter promotion code if you have..."
                                aria-label="PromotionCode"
                                aria-labelledby="PromotionCode"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    )}

                    {/* Note */}
                    <FormField
                      control={form.control}
                      name="note"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="note">Note</FormLabel>
                          <FormControl>
                            <Textarea
                              id="note"
                              placeholder="Is there any note about the order?"
                              aria-label="Note"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {orderUpdate?.discounts &&
                      orderUpdate?.discounts.length === 0 &&
                      promotionCode === "" && (
                        <div className="flex items-center gap-2">
                          <p>Voucher: </p>

                          {discount ? (
                            <>{renderVoucher(discount)}</>
                          ) : (
                            <>
                              <VoucherList content="badge" />
                            </>
                          )}
                        </div>
                      )}

                    <div
                      className="flex md:items-end md:justify-end gap-2 w-full relative 
                    justify-center items-center"
                    >
                      <Button
                        color="primary"
                        className="dark:bg-white dark:text-black text-white"
                        onPress={() => {
                          onClose();
                          setDiscount(null);
                        }}
                      >
                        Cancel
                      </Button>

                      {!isLoading ? (
                        <Button
                          color="primary"
                          type="submit"
                          isDisabled={orderDetails.length === 0}
                          className={`${
                            orderDetails.length === 0
                              ? "opacity-30 select-none pointer-events-none"
                              : ""
                          } dark:bg-white dark:text-black text-white`}
                        >
                          Update
                        </Button>
                      ) : (
                        <Button
                          isLoading
                          color="primary"
                          className="dark:bg-white dark:text-black
                        text-white"
                        >
                          Loading...
                        </Button>
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

export default ModalUpdateOrder;
