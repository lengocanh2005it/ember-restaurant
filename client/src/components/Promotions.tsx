"use client";
import EditAdminButton from "@/components/EditAdminButton";
import LoadingPage from "@/components/LoadingPage";
import { usePromotions } from "@/hooks/use-promotions";
import { useRedeemPoint } from "@/hooks/use-redeem-point";
import { useAppStore, useUserStore } from "@/store";
import { Promotion } from "@/utils";
import { Button, Pagination } from "@heroui/react";
import { GiftIcon, ShoppingCartIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

const loyaltyProgram = {
  title: "Loyalty Points",
  description:
    "Earn 1 point for every $10 spent. Redeem 500 points for a $10 discount.",
};

const Promotions: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isAdmin } = useAppStore();
  const { user } = useUserStore();
  const router = useRouter();
  const [promotions, setPromotions] = useState<Promotion[]>([]);

  const { data, isLoading: isPromotionsLoading, isError } = usePromotions();

  const itemsPerPage = 2;

  useEffect(() => {
    if (data) {
      setPromotions(data as Promotion[]);
    }
  }, [data]);

  const totalPages = useMemo(() => {
    return Math.ceil((promotions?.length ?? 0) / itemsPerPage) ?? 0;
  }, [promotions]);

  const items = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    return promotions?.slice(start, end) ?? [];
  }, [page, promotions]);

  const { mutate: mutateRedeemPoint } = useRedeemPoint(user?.id!);

  const handleClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      mutateRedeemPoint(user?.id!);
    }, 2200);
  };

  const handleCreateClick = () => {
    router.push("/home/admin/promotions/add");
  };

  if (isPromotionsLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <div>Error...</div>;
  }

  return (
    <section className="w-full h-fit py-6 lg:px-6 px-4 justify-start flex flex-col lg:gap-4 gap-3">
      <div
        className="relative flex flex-col lg:items-start items-center lg:text-left text-center
       lg:justify-start justify-center"
      >
        <div className="relative flex lg:gap-1 lg:flex-row flex-col items-center">
          <h1 className="lg:text-2xl text-xl font-bold lg:text-left text-center">
            Exclusive Promotions
          </h1>

          {isAdmin && <EditAdminButton path="/home/admin/promotions" />}
        </div>

        <p className="lg:text-base text-[14px] dark:text-white/70 text-black/80">
          Discover special deals and limited-time offers just for you.
        </p>
      </div>

      <div className="flex flex-col lg:gap-6 gap-4">
        {promotions.length !== 0 ? (
          <>
            <div className="flex flex-col gap-2">
              <div className="grid lg:grid-cols-2 grid-cols-1 w-full lg:gap-8 gap-5 lg:px-6">
                {items.map((promo, index) => (
                  <div
                    key={index}
                    className="border dark:border-white/30 rounded-lg p-4 shadow-custom
                 bg-white dark:bg-primary dark:text-white w-full
                  flex items-center lg:flex-row flex-col justify-between lg:gap-6 gap-4 relative"
                  >
                    <div
                      className="absolute lg:left-[-20px] lg:top-[-30px] z-[10] 
                lg:w-[120px] lg:h-[120px] w-[100px] h-[100px] rounded-lg right-[-20px] top-[-30px]"
                    >
                      <Image
                        src="/new_logo.png"
                        alt=""
                        sizes="(max-width:600px) 100vw, 50vw"
                        priority
                        fill
                        className="object-cover select-none rounded-lg"
                      />
                    </div>

                    <div className="lg:w-[60%] w-full lg:h-[40vh] h-[35vh] relative rounded-lg">
                      {promo.image && (
                        <Image
                          src={promo.image}
                          alt="promotion"
                          priority
                          sizes="(max-width:600px) 100vw, 50vw"
                          fill
                          className="rounded-lg cursor-pointer opacity-80 hover:opacity-100 
                    ease-in-out duration-300 transition-all"
                        />
                      )}
                    </div>

                    <div
                      className="text-center text-[14px] relative flex flex-col 
                    lg:gap-3 gap-2 justify-center items-center lg:h-full
                     lg:w-[50%] w-full"
                    >
                      <div
                        className="relative flex-col flex gap-1 text-center lg:w-full
                        h-full lg:justify-center items-center"
                      >
                        <h3
                          className="font-semibold lg:text-2xl text-xl
                         text-black dark:text-white max-w-full break-words "
                        >
                          {promo.title}
                        </h3>

                        <p
                          className="dark:text-white/50 text-black/70 max-w-full
                         break-words "
                        >
                          {promo.description}
                        </p>

                        <div className="font-semibold flex flex-col">
                          <p>Use Code</p>
                          <p
                            className="lg:text-xl text-base text-green-500 break-words 
                          max-w-full"
                          >
                            {promo.code.toUpperCase()}
                          </p>
                        </div>

                        <div className="relative flex items-center gap-2">
                          <p>Start Date:</p>
                          <p
                            className="lg:text-base text-[14px] dark:text-white text-black 
                          font-bold"
                          >
                            {promo.start_date.split("T")[0]}
                          </p>
                        </div>

                        <div className="relative flex items-center gap-2">
                          <p>End Date:</p>
                          <p
                            className="lg:text-base text-[14px] dark:text-white text-black 
                          font-bold"
                          >
                            {promo.end_date.split("T")[0]}
                          </p>
                        </div>
                      </div>

                      {promo.note && (
                        <p className="lg:text-[14px] text-[12px] dark:text-white/60 text-black/50">
                          Note: {promo.note}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {promotions.length !== 0 && (
                <div className="flex md:items-start md:justify-start items-center justify-center">
                  <Pagination
                    loop
                    showControls
                    isCompact
                    showShadow
                    classNames={{
                      cursor: "bg-foreground text-background",
                    }}
                    color="primary"
                    total={totalPages}
                    initialPage={page}
                    onChange={(page) => setPage(page)}
                  />
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-2 relative items-center text-center justify-center">
              <h1 className="lg:text-xl text-base uppercase font-bold">
                Empty Promotions
              </h1>

              {isAdmin ? (
                <>
                  <p className="lg:text-[14px] text-[13px] dark:text-white/60 text-black/70">
                    Let&apos;s create promotions to attract more new customers!
                  </p>

                  <Button
                    color="primary"
                    className="dark:bg-white dark:text-black"
                    onPress={handleCreateClick}
                  >
                    Go to Create
                  </Button>
                </>
              ) : (
                <>
                  <p className="lg:text-[14px] text-[13px] dark:text-white/60 text-black/70">
                    We will soon post information about promotions. Please visit
                    our restaurant regularly to get the latest updates!
                  </p>
                </>
              )}
            </div>
          </>
        )}

        {!isAdmin && (
          <div className="flex flex-col lg:gap-5 gap-3">
            <div
              className="relative flex flex-col lg:items-start lg:justify-start lg:text-left
           items-center justify-center text-center"
            >
              <h2 className="lg:text-2xl text-xl font-bold md:text-left text-center">
                Loyalty Program
              </h2>

              <p className="lg:text-base text-[14px] dark:text-white/70 text-black/80">
                A program designed to thank you for choosing us. Enjoy premium
                rewards and exclusive benefits.
              </p>
            </div>

            <div
              className="border dark:border-white/20 rounded-xl p-4
           bg-white dark:bg-primary dark:text-white flex flex-col shadow-custom
            gap-4 relative mx-auto w-fit"
            >
              <div
                className="w-full lg:h-[400px] md:h-[500px] 
              h-[300px] relative flex items-center justify-center"
              >
                <Image
                  src="/promotions/loyalty.png"
                  alt=""
                  priority
                  sizes="(max-width:600px)"
                  objectFit="cover"
                  fill
                ></Image>
              </div>

              <div className="flex flex-col gap-2 lg:text-left text-center">
                <h3 className="font-semibold text-2xl text-center">
                  {loyaltyProgram.title}
                </h3>

                <p className="text-gray-700 dark:text-white/60 italic md:text-base text-[14px]">
                  {loyaltyProgram.description}
                </p>

                <div
                  className="flex lg:items-center lg:justify-center 
              lg:flex-row flex-col items-center justify-center lg:gap-6 gap-3"
                >
                  <Button
                    color="primary"
                    className="dark:bg-white dark:text-black"
                    onPress={() => {
                      router.push("/home/menu");
                    }}
                  >
                    <ShoppingCartIcon /> Order
                  </Button>

                  {isLoading ? (
                    <>
                      <Button
                        isLoading
                        color="primary"
                        className="dark:bg-white dark:text-black"
                      >
                        Please wait...
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        color="primary"
                        className="dark:bg-white dark:text-black"
                        onPress={handleClick}
                      >
                        <GiftIcon /> Redeem
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Promotions;
