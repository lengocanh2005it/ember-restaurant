"use client";
import LoadingPage from "@/components/LoadingPage";
import ModalConfirm from "@/components/modal/ModalConfirm";
import ModalUpdateDish from "@/components/modal/ModalUpdateDish";
import ModalViewDish from "@/components/modal/ModalViewDish";
import { useProducts } from "@/hooks/use-products";
import { Product } from "@/utils";
import { Button, Pagination } from "@heroui/react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const DishesList: React.FC = () => {
  const [dishes, setDishes] = useState<Product[]>([]);
  const [page, setPage] = useState<number>(1);
  const itemsPerPage = 3;
  const router = useRouter();
  const pathname = usePathname();

  const { data, isLoading, isError } = useProducts();

  const handleClick = () => {
    router.push(`${pathname}/add`);
  };

  useEffect(() => {
    if (data) {
      setDishes(data as Product[]);
    }
  }, [data]);

  const pages = React.useMemo(() => {
    return Math.ceil((dishes.length ?? 0) / itemsPerPage);
  }, [dishes]);

  const items = React.useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    return dishes?.slice(start, end);
  }, [page, dishes]);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <div>Error...</div>;
  }

  return (
    <>
      {dishes.length !== 0 ? (
        <>
          <div className="flex flex-col gap-6 relative">
            <div className="flex flex-col gap-4">
              {items?.map((dish: Product) => (
                <div
                  className="border border-white/20 relative h-full shadow-custom 
                  rounded-xl lg:py-4 py-2"
                  key={dish.id}
                >
                  <div
                    className="flex lg:flex-row flex-col lg:items-center lg:justify-between
                   lg:px-8 gap-2 items-center justify-center"
                  >
                    <div
                      className="lg:w-[15vw] md:w-1/2 w-3/4 lg:h-[25vh] h-[30vh] relative 
                      flex items-center justify-center"
                    >
                      {dish.image && (
                        <Image
                          src={dish.image}
                          alt=""
                          priority
                          sizes="(max-width:600px) 100vw, 50vw"
                          fill
                          className="select-none cursor-pointer"
                        />
                      )}
                    </div>

                    <div
                      className="lg:w-[75%] lg:flex-row flex-col w-full h-full relative
               flex lg:items-center lg:justify-between lg:gap-6 gap-2"
                    >
                      <div
                        className="flex lg:flex-row flex-col lg:items-center
                 lg:gap-10 gap-2 lg:justify-between lg:w-[50%] w-full"
                      >
                        <div className="flex flex-col gap-2 flex-1 items-center justify-center">
                          <h1 className="dark:text-white/80 text-black/80">
                            Name
                          </h1>

                          <p className="lg:text-2xl text-xl text-center break-words font-medium">
                            {dish?.name}
                          </p>
                        </div>

                        <div className="flex flex-col gap-2 flex-1 items-center justify-center">
                          <h1 className="dark:text-white/80 text-black/80">
                            Price
                          </h1>

                          <p className="lg:text-2xl text-xl font-medium">
                            {dish.price}$
                          </p>
                        </div>

                        <div className="flex flex-col gap-2 flex-1 items-center justify-center">
                          <h1 className="dark:text-white/80 text-black/80">
                            Rate Star
                          </h1>

                          <p className="lg:text-2xl text-xl font-medium">
                            {dish.average_rating}⭐
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-center flex-1 justify-center gap-2">
                        <h1 className="dark:text-white/80 text-black/80">
                          Stock Quantity
                        </h1>

                        <p className="lg:text-2xl text-xl font-medium">
                          {dish.stock}
                        </p>
                      </div>

                      <div className="flex flex-col items-center flex-1 justify-center gap-4">
                        <h1 className="dark:text-white/80 text-black/80">
                          Options
                        </h1>

                        <div className="flex items-center lg:gap-2 gap-1">
                          <ModalViewDish dish={dish} />

                          <ModalUpdateDish dish={dish} />

                          <ModalConfirm id={dish.id} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {items.length !== 0 && (
              <div className="flex lg:items-start lg:justify-start items-center justify-center">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="secondary"
                  classNames={{
                    cursor: "bg-foreground text-background",
                  }}
                  total={pages}
                  page={page}
                  onChange={(page) => setPage(page)}
                />
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-4 items-center justify-center h-[50vh] relative">
            <div className="flex flex-col gap-2 items-center">
              <h1 className="lg:text-2xl text-xl uppercase font-bold dark:text-white text-black">
                There are no dishes available at the restaurant!
              </h1>

              <p className="lg:text-base text-[14px] dark:text-white/60 text-black/60">
                Please add a dish to the menu for customers to see!
              </p>
            </div>

            <Button
              color="primary"
              className="dark:bg-white dark:text-black"
              onPress={handleClick}
            >
              Go
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default DishesList;
