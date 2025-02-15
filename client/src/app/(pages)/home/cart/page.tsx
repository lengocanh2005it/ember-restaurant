"use client";
import LoadingPage from "@/components/LoadingPage";
import ModalNoteCart from "@/components/modal/ModalNoteCart";
import ModalUpdateCart from "@/components/modal/ModalUpdateCart";
import Order from "@/components/Order";
import { useCart } from "@/hooks/use-carts-of-user";
import { useDeleteCart } from "@/hooks/use-delete-cart";
import { useCartStore, useUserStore } from "@/store";
import { Cart } from "@/utils";
import { Checkbox, Pagination, Tooltip } from "@heroui/react";
import { TrashIcon } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const CartPage: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const itemsPerPage = 3;
  const { user } = useUserStore();
  const { selectedCarts, carts, setCarts, setSelectedCarts } = useCartStore();

  const handleCheckboxChange = (item: Cart) => {
    setCheckedItems((prevCheckedItems) => {
      const updatedCheckedItems = {
        ...prevCheckedItems,
        [item.product.id]: !prevCheckedItems[item.product.id],
      };

      const selectedItems = carts.filter(
        (cart) => updatedCheckedItems[cart.product.id]
      );

      setSelectedCarts(selectedItems);

      return updatedCheckedItems;
    });
  };

  const { data, isLoading, isError } = useCart(user?.id!);

  useEffect(() => {
    if (data) {
      setCarts(data);
    }
  }, [data, setCarts]);

  const { mutate: mutateDeleteCart } = useDeleteCart(user?.id!);

  const array = React.useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    return carts?.slice(start, end) ?? [];
  }, [page, carts]);

  const totalPages = React.useMemo(() => {
    return Math.ceil(carts?.length / itemsPerPage) ?? 0;
  }, [carts]);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <div>Error...</div>;
  }

  return (
    <main className="relative w-full container flex flex-col lg:gap-6 gap-4 py-6">
      <div className="flex flex-col relative lg:justify-start justify-center">
        <h1 className="lg:text-3xl text-2xl md:text-left text-center font-bold">
          Your Carts
        </h1>

        <p
          className="dark:text-white/80 text-black/80 lg:text-base text-[14px] 
        md:text-left text-center"
        >
          View and manage all your active and saved carts in one place.
        </p>
      </div>

      <div className="flex flex-col gap-4 text-base">
        {array.length === 0 ? (
          <>
            <div className="relative flex flex-col gap-2 py-8 items-center justify-center">
              <div
                className="flex flex-col gap-1 lg:text-left text-center
               lg:justify-start justify-center"
              >
                <h1 className="lg:text-3xl md:text-2xl text-xl text-center font-bold">
                  Empty Carts!
                </h1>

                <p className="dark:text-white/70 text-black/70 lg:text-base text-[14px]">
                  Go to the menu, choose a dish, and add it to your cart now!
                </p>
              </div>

              <div
                className="relative lg:w-[400px] lg:h-[400px]
               md:w-[300px] md:h-[300px] w-[200px] h-[200px]"
              >
                <Image
                  src={"/empty-cart-1.png"}
                  alt="image"
                  priority
                  sizes="(max-width:600px) 100vw, 50vw"
                  fill
                  className="object-cover select-none"
                />
              </div>
            </div>
          </>
        ) : (
          <>
            {array.map((item: Cart) => (
              <div
                className="flex lg:flex-row flex-col gap-8 hover:cursor-pointer
             dark:hover:bg-secondary hover:bg-[#f2f2f2] px-4 py-4
             rounded-lg ease-in-out transition-all duration-300 items-center
              border dark:border-white/20 shadow-custom"
                key={item.product.id}
              >
                <Checkbox
                  isSelected={checkedItems[item.product.id] || false}
                  onValueChange={() => handleCheckboxChange(item)}
                >
                  <div
                    className="lg:w-[10vw] lg:h-[15vh] md:h-[30vh] md:w-[35vw]
                   w-[50vw] h-[25vh] relative flex lg:items-start items-center select-none"
                  >
                    {item.product.image && (
                      <Image
                        src={item.product.image}
                        alt="image"
                        priority
                        sizes="(max-width:600px) 100vw, 50vw"
                        className="select-none"
                        fill
                      />
                    )}
                  </div>
                </Checkbox>

                <div className="flex md:flex-row flex-col gap-3 w-full lg:px-10 justify-between">
                  <div className="flex flex-col md:gap-2 flex-1 lg:text-left text-center">
                    <p
                      className="lg:text-xl text-base font-medium dark:text-white/60
                    text-black/70"
                    >
                      Item
                    </p>

                    <h1 className="xl:text-xl lg:text-base text-[14px] font-medium">
                      {item.product.name}
                    </h1>
                  </div>

                  <div className="flex flex-col md:gap-2 flex-1 lg:text-left text-center">
                    <p
                      className="lg:text-xl text-base font-medium dark:text-white/60
                    text-black/70"
                    >
                      Quantity
                    </p>

                    <h1 className="xl:text-xl lg:text-base text-[14px] font-medium">
                      {item.quantity}
                    </h1>
                  </div>

                  <div className="flex flex-col md:gap-2 flex-1 lg:text-left text-center">
                    <p
                      className="lg:text-xl text-base font-medium dark:text-white/60
                    text-black/70"
                    >
                      Price
                    </p>

                    <h1 className="xl:text-xl lg:text-base text-[14px] font-medium">
                      {item.product.price}$/item
                    </h1>
                  </div>

                  <div className="flex flex-col gap-2 flex-1 lg:items-start items-center">
                    <p
                      className="lg:text-xl text-base font-medium dark:text-white/60
                    text-black/70"
                    >
                      Note About Cart
                    </p>

                    <ModalNoteCart note={item.note ? item.note : "Null"} />
                  </div>

                  <div className="flex flex-col gap-2 flex-1 lg:items-start items-center">
                    <p
                      className="lg:text-xl text-base font-medium dark:text-white/60
                    text-black/70"
                    >
                      Option
                    </p>

                    <div className="flex gap-2 items-center">
                      <span
                        onClick={() => {
                          setSelectedCarts([]);
                          setCheckedItems({});
                        }}
                      >
                        <ModalUpdateCart cart={item} />
                      </span>

                      <Tooltip
                        content="Delete"
                        showArrow
                        className="dark:text-white text-black"
                      >
                        <TrashIcon
                          size={30}
                          className="opacity-60 hover:opacity-100"
                          onClick={() => {
                            mutateDeleteCart({
                              userId: user?.id!,
                              cartId: item.id!,
                            });
                            setSelectedCarts(
                              selectedCarts.filter(
                                (cart) => cart.id !== item.id
                              )
                            );
                          }}
                        />
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {array.length !== 0 && (
              <div className="flex flex-col lg:justify-start justify-center">
                <Pagination
                  loop
                  showControls
                  total={totalPages}
                  showShadow
                  isCompact
                  page={page}
                  color="primary"
                  classNames={{
                    cursor: "bg-foreground text-background",
                  }}
                  onChange={(page) => setPage(page)}
                />
              </div>
            )}
          </>
        )}
      </div>

      {selectedCarts.length !== 0 && (
        <Order setCheckedItems={setCheckedItems} />
      )}
    </main>
  );
};

export default CartPage;
