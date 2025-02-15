"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { InputNumber } from "antd";
import { Button } from "@heroui/react";
import { CircleDollarSignIcon, ShoppingCartIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useFeaturedProducts } from "@/hooks/use-featured-products";
import { useAddCart } from "@/hooks/use-add-cart";
import LoadingPage from "@/components/LoadingPage";
import EditAdminButton from "@/components/EditAdminButton";
import { Cart, Product } from "@/utils/types";
import { CreateCartDto } from "@/api/carts/utils/types";
import { useAppStore, useUserStore } from "@/store";

const FeatureDishes: React.FC = () => {
  const { data, isLoading: isFetching } = useFeaturedProducts();
  const [number, setNumber] = useState<number>(1);
  const { user } = useUserStore();
  const { isAdmin } = useAppStore();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  const { mutate: mutateAddCart } = useAddCart(user?.id!);

  const handleOnClick = (product: Product) => {
    const data: CreateCartDto = {
      productId: product.id,
      userId: user?.id!,
      quantity: number,
      note: "",
    };

    setLoadingId(product.id);

    setTimeout(() => {
      setLoadingId(null);
      mutateAddCart(data);
      setNumber(1);
    }, 2500);
  };

  useEffect(() => {
    if (data) {
      setFeaturedProducts(data as Product[]);
    }
  }, [data]);

  if (isFetching) {
    return <LoadingPage />;
  }

  return (
    <>
      {featuredProducts.length !== 0 && (
        <>
          <div className="w-full relative lg:px-6 px-4 flex flex-col gap-4">
            <div
              className="flex flex-col relative lg:items-start lg:justify-start items-center 
                justify-center lg:text-left text-center"
            >
              <div className="relative flex lg:flex-row flex-col lg:gap-1 items-center">
                <h1 className="lg:text-2xl text-xl font-bold">
                  Featured Dishes
                </h1>

                {isAdmin && <EditAdminButton path="/home/admin/menu" />}
              </div>

              <p className="lg:text-base text-[14px] dark:text-white/70 text-black/80">
                Discover our most popular and highly recommended dishes.
              </p>
            </div>

            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[
                Autoplay({
                  delay: 5000,
                  stopOnFocusIn: false,
                  stopOnInteraction: true,
                  stopOnMouseEnter: false,
                }),
              ]}
              className={`${
                featuredProducts.length >= 3
                  ? "lg:w-[80%]"
                  : featuredProducts.length >= 2
                  ? "lg:w-[60%]"
                  : "lg:w-[40%]"
              } mx-auto h-fit w-full`}
            >
              <CarouselContent className="-ml-8">
                {featuredProducts.map((dish) => (
                  <CarouselItem
                    key={dish.id}
                    className={`${
                      featuredProducts.length >= 3
                        ? "md:basis-1/2 lg:basis-1/3"
                        : featuredProducts.length >= 2
                        ? "md:basis-1/2"
                        : ""
                    } select-none cursor-pointer pl-8`}
                  >
                    <div className="relative w-full">
                      <Card
                        className="w-full h-full relative border hover:border-black/20
                   dark:border-white/30 shadow-custom
                ease-in-out transition-all duration-300 group"
                      >
                        <CardContent
                          className="w-full flex flex-col items-center
                         justify-center relative"
                        >
                          <div
                            className="lg:w-[70%] w-full lg:h-[25vh] h-[30vh] relative select-none opacity-90
                             group-hover:opacity-100 ease-in-out duration-250 transition-all"
                          >
                            {dish.image && (
                              <Image
                                src={dish.image}
                                alt=""
                                sizes="(max-width: 600px) 100vw, 50vw"
                                priority
                                fill
                              />
                            )}
                          </div>

                          <div
                            className="w-full px-12 space-y-2 relative opacity-90
                             group-hover:opacity-100 ease-in-out duration-250 transition-all"
                          >
                            <h1
                              className="text-center lg:text-xl text-base font-medium text-black
                       dark:text-white"
                            >
                              {dish.name}
                            </h1>

                            <div
                              className={`flex xl:flex-row flex-col
                                w-fit mx-auto lg:gap-10 gap-4
                             xl:items-center ${
                               isAdmin
                                 ? "xl:justify-center"
                                 : "xl:justify-between"
                             }`}
                            >
                              <div className="flex flex-col-reverse gap-2 items-center">
                                <div className="flex gap-2 items-center justify-center">
                                  <CircleDollarSignIcon
                                    size={20}
                                    className="opacity-90"
                                  />
                                  <p
                                    className="font-medium lg:text-3xl md:text-2xl text-xl
                                   dark:text-white text-black opacity-90
                             group-hover:opacity-100
                    ease-in-out duration-250 transition-all"
                                  >
                                    {dish.price}$
                                  </p>
                                </div>

                                {!isAdmin && (
                                  <InputNumber
                                    defaultValue={number}
                                    min={1}
                                    onChange={(value) => setNumber(value!)}
                                    className="opacity-90 group-hover:opacity-100"
                                  />
                                )}
                              </div>

                              {loadingId === dish.id ? (
                                <>
                                  <Button
                                    isLoading
                                    color="primary"
                                    className="dark:bg-[#f2f2f2] dark:text-black"
                                  ></Button>
                                </>
                              ) : (
                                <>
                                  {!isAdmin && (
                                    <Button
                                      color="primary"
                                      className="opacity-90 group-hover:opacity-100
                                     dark:bg-[#f2f2f2] dark:text-black"
                                      onPress={() => {
                                        handleOnClick(dish);
                                      }}
                                    >
                                      <ShoppingCartIcon />
                                    </Button>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <CarouselPrevious
                className="absolute xl:left-[-50px] md:left-[-50px] left-0 
        opacity-50 hover:opacity-100"
              />

              <CarouselNext
                className="absolute xl:right-[-50px] md:right-[-50px] right-0 
        opacity-50 hover:opacity-100"
              />
            </Carousel>
          </div>
        </>
      )}
    </>
  );
};

export default FeatureDishes;
