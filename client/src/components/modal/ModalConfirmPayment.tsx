"use client";
import ModalShowPayments from "@/components/modal/ModalShowPayments";
import { useAddOrder } from "@/hooks/use-add-order";
import {
  useCartStore,
  useDiscountStore,
  useOrderStore,
  useUserStore,
} from "@/store";
import { CachedOrderData } from "@/utils";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import React, { Dispatch, SetStateAction, useState } from "react";

interface ModalConfirmPaymentProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onClose: () => void;
  setCheckedItems: Dispatch<SetStateAction<Record<string, boolean>>>;
}

const ModalConfirmPayment: React.FC<ModalConfirmPaymentProps> = ({
  isOpen,
  setIsOpen,
  onClose,
  setCheckedItems,
}) => {
  const query = useQueryClient();
  const { user } = useUserStore();
  const { setSelectedCarts } = useCartStore();
  const { setDiscount } = useDiscountStore();
  const { orderData } = useOrderStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { mutate: mutateAddOrder } = useAddOrder(user?.id!);

  const handlePayment = () => {
    setIsLoading(true);
    setTimeout(() => {
      if (orderData) {
        const {
          phone_number,
          delivery_method,
          delivery_address,
          payment_method,
          total_price,
          discountId,
          promotionCode,
        } = orderData.order;

        mutateAddOrder({
          order: {
            userId: user?.id!,
            phone_number,
            delivery_method,
            payment_method,
            total_price,
            delivery_address,
            discountId,
            promotionCode,
          },
          userId: user?.id!,
          products: orderData.products,
        });
      }
      setIsOpen(false);
      onClose();
      setSelectedCarts([]);
      setCheckedItems({});
      setDiscount(null);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      setIsLoading(false);
    }, 2200);
  };

  return (
    <Modal
      backdrop="opaque"
      classNames={{
        backdrop:
          "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
      }}
      isDismissable={false}
      isKeyboardDismissDisabled={false}
      placement="center"
      size="lg"
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
      isOpen={isOpen}
      onOpenChange={(open) => setIsOpen(open)}
    >
      <ModalContent className="dark:text-white text-black">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 lg:text-left text-center">
              Credit Card Payment
            </ModalHeader>

            <ModalBody className="relative flex flex-col gap-2 items-center">
              <p className="lg:text-[14px] text-[13px] text-center">
                Would you like to pay for this order now? If yes, please click
                the Payment button below. If not, you can click the No Payment
                button. You can still make the payment later from the
                &quot;Orders&quot; page.
              </p>

              <ModalShowPayments />
            </ModalBody>

            <ModalFooter className="flex lg:items-end lg:justify-end items-center justify-center">
              {isLoading ? (
                <>
                  <Button
                    color="primary"
                    className="dark:bg-white dark:text-black"
                    isLoading
                  >
                    Please wait...
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    color="primary"
                    className="dark:bg-white dark:text-black"
                    onPress={handlePayment}
                  >
                    No Payment
                  </Button>
                </>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalConfirmPayment;
