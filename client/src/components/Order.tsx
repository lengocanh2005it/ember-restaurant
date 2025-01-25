"use client";
import CreateOrder from "@/components/CreateOrder";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store";
import React, { Dispatch, SetStateAction, useEffect } from "react";

interface OrderProps {
  setCheckedItems: Dispatch<SetStateAction<Record<string, boolean>>>;
}

const Order: React.FC<OrderProps> = ({ setCheckedItems }) => {
  const [totalPrice, setTotalPrice] = React.useState<number>(0);
  const { selectedCarts } = useCartStore();

  useEffect(() => {
    const arrayPrices = selectedCarts.map((item) => {
      return parseFloat(
        (Math.round(item.product.price * item.quantity * 100) / 100).toFixed(2)
      );
    });

    setTotalPrice(
      Math.floor(
        arrayPrices.reduce((accumulator, currentValue) => {
          return accumulator + currentValue;
        }, 0) * 100
      ) / 100
    );
  }, [selectedCarts]);

  return (
    <div
      className="lg:w-[450px] sm:w-[500px] w-full mx-auto flex flex-col gap-4 p-4 rounded-lg
     border dark:border-white/30 shadow-custom"
    >
      <div className="flex flex-col">
        <div className="relative flex flex-col lg:gap-2 gap-1 text-center justify-center items-center">
          <h1 className="md:text-2xl text-xl font-medium text-center">
            New Order
          </h1>

          <p className="md:text-base text-[14px] dark:text-white/70 text-black/70">
            Review and confirm your selected items before placing your order.
          </p>
        </div>

        <ScrollArea className="h-[250px] rounded-md p-4 flex flex-col gap-2">
          {selectedCarts.map((item) => (
            <>
              <div
                className="text-base"
                key={
                  item.id + (new Date().getTime() + item.quantity).toString()
                }
              >
                <h1 className="lg:text-xl text-base font-medium italic">
                  {item.product.name}
                </h1>

                <div className="flex items-center justify-between">
                  <p
                    className="dark:text-white/70 text-black/70 
                  lg:text-[14px] text-[13px]"
                  >
                    Quantity:{" "}
                  </p>
                  <p className="lg:text-2xl md:text-xl text-base font-medium">
                    {item.quantity}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <p
                    className="dark:text-white/70 text-black/70
                   lg:text-[14px] text-[13px]"
                  >
                    Total price:{" "}
                  </p>

                  <p className="font-medium">
                    {parseFloat(
                      (
                        Math.round(item.product.price * item.quantity * 100) /
                        100
                      ).toFixed(2)
                    )}
                    $
                  </p>
                </div>
              </div>

              <Separator className="my-2" />
            </>
          ))}
        </ScrollArea>

        <div className="flex items-center justify-between">
          <p className="lg:text-xl text-base dark:text-white/70 text-black/70">
            Total Price:
          </p>
          <p className="lg:text-2xl text-xl font-medium">{totalPrice}$</p>
        </div>

        <Separator className="my-2" />

        <CreateOrder
          total_price={totalPrice}
          setCheckedItems={setCheckedItems}
        />
      </div>
    </div>
  );
};

export default Order;
