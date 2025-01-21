"use client";
import { CreateOrderDetailsDto } from "@/api/orders/utils/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import VoucherList from "@/components/VoucherList";
import { StatusEnum } from "@/config/enums/enums";
import { useReOrder } from "@/hooks/use-re-order";
import { useDiscountStore, useUserStore } from "@/store";
import { DiscountWithQuantity, Order } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Textarea,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { HistoryIcon } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  note: z.string().optional(),
});

interface ModalReOrderProps {
  order: Order;
}

const ModalReOrder: React.FC<ModalReOrderProps> = ({ order }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      note: "",
    },
  });

  const { user } = useUserStore();
  const { discount, setDiscount } = useDiscountStore();

  const { mutate: mutateReOrder } = useReOrder(user?.id!);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { note } = values;

    setIsLoading(true);

    const { total_price, delivery_address, delivery_method, user, payment } =
      order;

    const data: CreateOrderDetailsDto = {
      order: {
        userId: user.id,
        phone_number: user.phone,
        delivery_address,
        delivery_method,
        payment_method: payment.payment_method,
        note,
        total_price,
        status: StatusEnum.PENDING,
      },
      products: order.order_details.map((detail) => ({
        productId: detail.product.id,
        quantity: detail.quantity,
      })),
      userId: user.id,
      ...(discount ? { discountId: discount.discount.id } : {}),
    };

    setTimeout(() => {
      setIsLoading(false);
      setDiscount(null);
      mutateReOrder(data);
      onClose();
    }, 2500);
  }

  const renderVouchers = (voucher: DiscountWithQuantity) => {
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

  return (
    <>
      <Tooltip
        content="Re-order"
        showArrow
        className="dark:text-white text-black"
      >
        <HistoryIcon
          className="opacity-50 hover:opacity-100 
                duration-250 ease-in-out transition-opacity cursor-pointer"
          onClick={onOpen}
        />
      </Tooltip>

      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        placement="center"
        size="lg"
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
              <ModalHeader className="flex flex-col gap-1">
                <h1 className="lg:text-base text-[15px] font-bold">
                  More Information
                </h1>

                <p className="lg:text-[15px] text-[14px] dark:text-white/60 text-black/70 font-normal">
                  Please provide more information to complete re ordering.
                </p>
              </ModalHeader>

              <ModalBody>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-3"
                  >
                    <FormField
                      control={form.control}
                      name="note"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-white text-black">
                            Note
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              aria-labelledby="note"
                              placeholder="Note about the order..."
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="flex items-center gap-2">
                      <p>Voucher: </p>

                      {discount ? (
                        <> {renderVouchers(discount)}</>
                      ) : (
                        <>
                          <VoucherList content="badge" />
                        </>
                      )}
                    </div>

                    <div className="flex items-center justify-end gap-3">
                      <Button
                        type="button"
                        color="primary"
                        className="dark:bg-white dark:text-black"
                        onPress={onClose}
                      >
                        Cancel
                      </Button>

                      {isLoading ? (
                        <>
                          <Button
                            type="button"
                            isLoading
                            color="primary"
                            className="dark:bg-white
                          text-black"
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
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalReOrder;
