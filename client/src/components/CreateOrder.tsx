"use client";
import { CreateOrderDetailsDto } from "@/api/orders/utils/types";
import ModalConfirmPayment from "@/components/modal/ModalConfirmPayment";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import VoucherList from "@/components/VoucherList";
import { useAddOrder } from "@/hooks/use-add-order";
import { useFindPromotion } from "@/hooks/use-find-promotion";
import {
  useAppStore,
  useCartStore,
  useDiscountStore,
  useOrderStore,
  usePromotionStore,
  useReservationStore,
  useUserStore,
} from "@/store";
import { DiscountWithQuantity } from "@/utils/types";
import {
  Button,
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
import { zodResolver } from "@hookform/resolvers/zod";
import { debounce } from "lodash";
import { CheckCircleIcon, MessageCircleIcon, XCircleIcon } from "lucide-react";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

const deliveries = [
  { key: "home_delivery", label: "Home Delivery" },
  { key: "pick_up", label: "Pick Up" },
];

const payments = [
  { key: "card", label: "Credit Card" },
  { key: "cash", label: "Pay In Cash" },
];

interface CreateOrderProps {
  total_price: number;
  setCheckedItems: Dispatch<SetStateAction<Record<string, boolean>>>;
}

export const formSchema = z
  .object({
    phone_number: z
      .string()
      .min(1, { message: "Phone number can't be empty." }),
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

const CreateOrder: React.FC<CreateOrderProps> = ({
  total_price,
  setCheckedItems,
}) => {
  const [isShow, setIsShow] = useState<boolean>(false);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useUserStore();
  const { selectedCarts, setSelectedCarts } = useCartStore();
  const { discount, setDiscount } = useDiscountStore();
  const { setType } = useAppStore();
  const { setOrderData } = useOrderStore();
  const { setReservationData, setReservationPayment, setReservationUpdate } =
    useReservationStore();
  const { mutate: mutateFindPromotion } = useFindPromotion();
  const { promotions, setPromotions } = usePromotionStore();
  const [isFinding, setIsFinding] = useState<boolean>(false);

  const { mutate: mutateAddOrder } = useAddOrder(user?.id!);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      delivery_address: "",
      phone_number: user?.phone ? user.phone : "",
      note: "",
      delivery_method: undefined,
      payment_method: undefined,
      promotionCode: "",
    },
  });

  const deliveryMethod = useWatch({
    control: form.control,
    name: "delivery_method",
  });

  const promotionCode = useWatch({
    control: form.control,
    name: "promotionCode",
  });

  const paymentMethod = useWatch({
    control: form.control,
    name: "payment_method",
  });

  const handleClick = () => {
    onClose();

    setTimeout(() => {
      form.reset({
        delivery_address: "",
        phone_number: "",
        note: "",
        payment_method: undefined,
        delivery_method: undefined,
      });
      setDiscount(null);
    }, 990);
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    const {
      delivery_method,
      delivery_address,
      payment_method,
      phone_number,
      note,
      promotionCode,
    } = values;

    setReservationData(null);
    setReservationPayment(null);
    setReservationUpdate(null);
    setOrderData({
      order: {
        userId: user?.id!,
        phone_number,
        delivery_method,
        payment_method,
        total_price,
        delivery_address,
        note,
        ...(discount
          ? {
              discountId: discount.discount.id,
            }
          : []),
        promotionCode,
      },
      userId: user?.id!,
      products: selectedCarts.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
    });

    setIsLoading(true);

    setType("order");

    setTimeout(() => {
      setIsLoading(false);

      paymentMethod === "card" ? setIsShow(true) : setIsShow(false);

      if (paymentMethod === "cash") {
        mutateAddOrder({
          order: {
            userId: user?.id!,
            phone_number,
            delivery_method,
            payment_method,
            total_price,
            delivery_address,
            note,
            ...(discount
              ? {
                  discountId: discount.discount.id,
                }
              : []),
            promotionCode,
          },
          userId: user?.id!,
          products: selectedCarts.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
        });
        setOrderData(null);
        setType("");
        setPromotions([]);
        setSelectedCarts([]);
        setCheckedItems({});
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    }, 2000);
  }

  const renderVoucher = (discount: DiscountWithQuantity) => {
    return (
      <Chip
        key={discount.discount.id}
        color="primary"
        className="dark:bg-white dark:text-black text-white"
        onClose={() => {
          setDiscount(null);
        }}
      >
        {discount.discount.value}
        {discount.discount.type === "percentage" ? "%" : " USD"}
      </Chip>
    );
  };

  const handleFindPromotion = debounce((value: string) => {
    if (value) {
      mutateFindPromotion(value);
    }
    setIsFinding(false);
  }, 2000);

  return (
    <>
      <Button
        onPress={() => {
          onOpen();
          setPromotions([]);
        }}
        className="dark:bg-white dark:text-black w-fit mx-auto"
        color="primary"
      >
        Next Step
      </Button>

      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        placement="center"
        size="2xl"
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
                Confirm Order
              </ModalHeader>

              <p className="text-center lg:text-[15px] text-[14px]">
                The total value of your order is:{" "}
                <span className="lg:text-xl text-base font-bold">
                  {total_price}$
                </span>
              </p>

              <ModalBody>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-2"
                  >
                    {!promotionCode && (
                      <div className="flex items-center gap-2">
                        <p>Voucher: </p>

                        {discount ? (
                          <>{renderVoucher(discount)}</>
                        ) : (
                          <VoucherList content="badge" />
                        )}
                      </div>
                    )}

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
                              selectedKeys={
                                field.value !== undefined ? [field.value] : []
                              }
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
                          <FormMessage className="dark:text-red-400 text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="payment_method"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel
                            htmlFor="payment_method"
                            className="dark:text-white text-black"
                          >
                            Payment Method
                          </FormLabel>

                          <div className="relative flex items-center gap-2">
                            <FormControl>
                              <Select
                                items={payments}
                                selectedKeys={
                                  field.value !== undefined ? [field.value] : []
                                }
                                id="payment_method"
                                placeholder="Select a payment method"
                                aria-labelledby="delivery_method"
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

                            {paymentMethod === "cash" && (
                              <>
                                <div>
                                  <Tooltip
                                    content="Please visit our store at 123 Main Street, London,  
                                  England to pay your bill!"
                                    className="dark:text-white text-black"
                                  >
                                    <MessageCircleIcon
                                      className="cursor-pointer opacity-60 
                          hover:opacity-100 duration-250 ease-in-out"
                                    />
                                  </Tooltip>
                                </div>
                              </>
                            )}
                          </div>

                          <FormMessage className="dark:text-red-400 text-red-500" />
                        </FormItem>
                      )}
                    />

                    {/* Delivery Address */}
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

                    <div
                      className={`grid ${
                        discount ? "grid-cols-1" : "lg:grid-cols-2 grid-cols-1"
                      } gap-2`}
                    >
                      <FormField
                        control={form.control}
                        name="phone_number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel
                              htmlFor="phone_number"
                              className="dark:text-white text-black"
                            >
                              Phone Number
                            </FormLabel>
                            <FormControl>
                              <Input
                                id="phone_number"
                                placeholder="Enter phone number..."
                                aria-label="Phone number"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="dark:text-red-400 text-red-500" />
                          </FormItem>
                        )}
                      />

                      {!discount && (
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
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(e);
                                    setIsFinding(true);
                                    handleFindPromotion(e.target.value);
                                  }}
                                  endContent={
                                    isFinding ? (
                                      <div
                                        className="animate-spin dark:text-white text-black/70
                                   w-4 h-4"
                                      >
                                        <svg
                                          className="w-full h-full"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <circle
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            className="opacity-25"
                                          />
                                          <path
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v4a4 4 0 000 8v4a8 8 0 01-8-8z"
                                            className="opacity-75"
                                          />
                                        </svg>
                                      </div>
                                    ) : promotions.length !== 0 &&
                                      promotionCode !== "" ? (
                                      <Tooltip
                                        content="Valid Promotion Code"
                                        className="dark:text-white text-black"
                                      >
                                        <CheckCircleIcon className="text-success-500 cursor-pointer" />
                                      </Tooltip>
                                    ) : promotionCode !== "" ? (
                                      <Tooltip
                                        content="Invalid Promotion Code"
                                        className="dark:text-white text-black"
                                      >
                                        <XCircleIcon className="text-danger-500 cursor-pointer" />
                                      </Tooltip>
                                    ) : null
                                  }
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      )}
                    </div>

                    <FormField
                      control={form.control}
                      name="note"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="note">
                            Note About The Order (Optional)
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              id="note"
                              placeholder="Is there any note about the order?"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {isShow && (
                      <ModalConfirmPayment
                        isOpen={isShow}
                        setCheckedItems={setCheckedItems}
                        onClose={onClose}
                        setIsOpen={setIsShow}
                      />
                    )}

                    {deliveryMethod === "pick_up" && (
                      <p
                        className="lg:text-[14px]
                      text-[13px] dark:text-white/80 text-black/80 space-y-5"
                      >
                        Note: Please come to our restaurant at{" "}
                        <span className="font-bold">
                          123 Main Street, London, England
                        </span>{" "}
                        to pick up your order.
                      </p>
                    )}

                    <div className="flex lg:justify-end lg:items-end justify-center items-center gap-3">
                      <Button
                        color="primary"
                        className="dark:bg-white dark:text-black
                         bg-black text-white"
                        onPress={handleClick}
                      >
                        Cancel
                      </Button>

                      {isLoading === false ? (
                        <Button
                          color="primary"
                          type="submit"
                          className="dark:bg-white dark:text-black"
                          isDisabled={
                            promotionCode !== "" && promotions.length === 0
                          }
                        >
                          Confirm
                        </Button>
                      ) : (
                        <Button
                          isLoading
                          color="primary"
                          className="dark:bg-white
                         dark:text-black text-white"
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

export default CreateOrder;
