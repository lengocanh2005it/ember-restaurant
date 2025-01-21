"use client";
import { UpdateCartDto } from "@/api/carts/utils/types";
import { Separator } from "@/components/ui/separator";
import { useUpdateCart } from "@/hooks/use-update-cart";
import { useUserStore } from "@/store";
import { Cart } from "@/utils";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { SquarePenIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

interface ModalUpdateCartProps {
  cart: Cart;
}

const ModalUpdateCart: React.FC<ModalUpdateCartProps> = ({ cart }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(
    cart?.quantity ? cart.quantity : 1
  );
  const [note, setNote] = useState<string>(cart.note ? cart.note : "");
  const { user } = useUserStore();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const { mutate: mutateUpdateCart } = useUpdateCart(user?.id!);

  useEffect(() => {
    if (cart.quantity) {
      setQuantity(cart.quantity);
    }

    if (cart.note) {
      setNote(cart.note);
    } else {
      setNote("");
    }
  }, [cart]);

  const handleClick = () => {
    setIsLoading(true);

    const data: UpdateCartDto = {
      cartId: cart.id,
      quantity,
      userId: user?.id!,
      note,
    };

    setTimeout(() => {
      setIsLoading(false);
      onClose();
      mutateUpdateCart(data);
    }, 2500);
  };

  return (
    <>
      <Tooltip content="Edit" showArrow className="dark:text-white text-black">
        <SquarePenIcon
          size={30}
          className="opacity-60 hover:opacity-100"
          onClick={onOpen}
        />
      </Tooltip>

      <Modal
        backdrop="opaque"
        placement="center"
        isOpen={isOpen}
        onOpenChange={() => {
          onOpenChange();
          setQuantity(cart.quantity);
        }}
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
                Edit Cart
              </ModalHeader>

              <ModalBody>
                <div
                  className="flex lg:flex-row flex-col lg:items-center 
                lg:justify-between lg:gap-2 p-2 px-4 border dark:border-white/30
                 border-black/60 rounded-xl lg:text-left text-center"
                >
                  <h1>Name</h1>
                  <p>{cart.product.name}</p>
                </div>

                <div
                  className="flex lg:flex-row flex-col lg:items-center 
                lg:justify-between lg:gap-2 p-2 px-4 border dark:border-white/30
                 border-black/60 rounded-xl lg:text-left text-center"
                >
                  <h1>Price</h1>
                  <p>{cart.product.price}$ / item</p>
                </div>

                <Separator className="px-6 dark:bg-white/60 bg-black/60" />

                <div className="flex flex-col gap-1">
                  <div className="flex flex-col gap-2">
                    <h1>Quantity</h1>

                    <Input
                      type="number"
                      value={quantity.toString()}
                      variant="bordered"
                      onChange={(e) => {
                        setQuantity(Number(e.target.value));
                        if (Number(e.target.value) <= 0) {
                          setError("Invalid quantity.");
                        } else {
                          setError("");
                        }
                      }}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <h1>Note About Cart</h1>

                    <Textarea
                      type="text"
                      onChange={(e) => setNote(e.target.value)}
                      value={note}
                      variant="bordered"
                      aria-label="note"
                      aria-labelledby="note"
                      placeholder="Note..."
                    />
                  </div>
                </div>

                {error && (
                  <p className="lg:text-[14px] text-[12px] dark:text-red-400 text-red-500">
                    {error}
                  </p>
                )}
              </ModalBody>

              <ModalFooter
                className="relative flex lg:items-end lg:justify-end items-center
               justify-center"
              >
                <Button
                  color="primary"
                  className="dark:bg-white dark:text-black text-white"
                  onPress={() => {
                    onClose();
                    setQuantity(cart.quantity);
                  }}
                >
                  Cancel
                </Button>

                {isLoading ? (
                  <>
                    <Button
                      isLoading
                      color="primary"
                      className="dark:bg-white dark:text-black text-white"
                    >
                      Please wait...
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      color="primary"
                      onPress={handleClick}
                      className={`${
                        error !== "" &&
                        "opacity-30 select-none pointer-events-none"
                      } dark:bg-white dark:text-black text-white`}
                    >
                      Edit
                    </Button>
                  </>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalUpdateCart;
