"use client";
import LoadingPage from "@/components/LoadingPage";
import RecentOrders from "@/components/RecentOrders";
import UpdateProfile from "@/components/UpdateProfile";
import VouchersList from "@/components/VouchersList";
import { useDiscount } from "@/hooks/use-discounts-of-user";
import { useRedeemPoint } from "@/hooks/use-redeem-point";
import { useAppStore, useUserStore } from "@/store";
import { DiscountWithQuantity } from "@/utils/types";
import { Button, Chip, Pagination, Tooltip } from "@heroui/react";
import {
  AwardIcon,
  CrownIcon,
  GiftIcon,
  LaptopMinimalIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  ShieldIcon,
  UserRoundCheckIcon,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";

const ProfilePage: React.FC = () => {
  const [vouchers, setVouchers] = useState<DiscountWithQuantity[]>([]);
  const [page, setPage] = useState<number>(1);
  const initialPages = 3;
  const { user } = useUserStore();
  const { isAdmin } = useAppStore();

  const { data, isLoading: isVoucherLoading, isError } = useDiscount(user?.id!);

  useEffect(() => {
    if (data) {
      setVouchers(data as DiscountWithQuantity[]);
    }
  }, [data]);

  const totalPages = useMemo(() => {
    return Math.ceil(vouchers?.length / initialPages) ?? 0;
  }, [vouchers]);

  const items = useMemo(() => {
    const start = (page - 1) * initialPages;
    const end = start + initialPages;

    return vouchers?.slice(start, end) ?? [];
  }, [page, vouchers]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const badges = [
    ...(isAdmin ? [{ name: "Admin", icon: <ShieldIcon /> }] : []),
    { name: "Creator", icon: <UserRoundCheckIcon /> },
    ...(!isAdmin ? [{ name: "Loyal customer", icon: <CrownIcon /> }] : []),
    { name: "Developer", icon: <LaptopMinimalIcon /> },
  ];

  const { mutate: mutateRedeemPoint } = useRedeemPoint(user?.id!);

  const handleClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      mutateRedeemPoint(user?.id!);
    }, 2200);
  };

  const infos = [
    {
      name: user?.email,
      icon: (
        <Tooltip
          content="Email"
          showArrow
          className="dark:text-white text-black"
        >
          <MailIcon />
        </Tooltip>
      ),
    },
    {
      name: user?.phone,
      icon: (
        <Tooltip
          content="Phone Number"
          showArrow
          className="dark:text-white text-black"
        >
          <PhoneIcon />
        </Tooltip>
      ),
    },
    {
      name: user?.address,
      icon: (
        <Tooltip
          content="Location"
          showArrow
          className="dark:text-white text-black"
        >
          <MapPinIcon />
        </Tooltip>
      ),
    },
  ];

  if (isVoucherLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <div>Error when fetching discounts!</div>;
  }

  return (
    <div
      className="w-full h-fit container mx-auto flex flex-col lg:gap-4 gap-2 xl:py-4 
    md:py-3 py-2 dark:bg-primary dark:text-white"
    >
      <div
        className="flex flex-col relative lg:justify-start justify-center lg:text-left
       text-center lg:px-2"
      >
        <h1
          className="md:text-2xl text-xl font-bold text-black
       dark:text-white md:text-left text-center"
        >
          Your Profile
        </h1>

        <p className="lg:text-base text-[14px] dark:text-white/70 text-black/70">
          View and edit your account information easily.
        </p>
      </div>

      <div
        className="md:w-[80%] w-full mx-auto flex flex-col
       gap-4 relative md:px-6 px-2 border shadow-custom dark:border-white/30 rounded-[15px] md:py-6 py-2"
      >
        <div className="w-full mx-auto px-2 py-1 flex flex-col gap-4">
          <div className="flex md:items-center px-4 md:justify-between md:flex-row flex-col">
            <div
              className="flex items-center xl:gap-3 md:gap-3 gap-1 
            justify-center xl:flex-row flex-col"
            >
              {user?.image && user.image && (
                <Tooltip
                  content="Avatar"
                  showArrow
                  className="dark:text-white text-black"
                >
                  <Image
                    src={user.image}
                    alt="Avatar"
                    width={70}
                    height={70}
                    className="rounded-full cursor-pointer select-none object-cover"
                  />
                </Tooltip>
              )}

              <div className="flex flex-col justify-center md:text-left text-center">
                <h1 className="xl:text-xl md:text-xl text-base font-semibold">
                  {user?.name ? user?.name : user?.username}
                  {isAdmin && (
                    <>
                      &nbsp;
                      <span className="dark:text-white/70 text-black/70 font-medium">
                        (Admin)
                      </span>
                    </>
                  )}
                </h1>
                <p
                  className="md:text-base text-[14px]
                 text-black/70 dark:text-white/70"
                >
                  Job: {user?.job ? user?.job : "None"}
                </p>
              </div>
            </div>

            <UpdateProfile />
          </div>

          <div className="flex flex-col gap-2">
            {infos.map((info, index) => {
              return (
                <div key={index} className="flex items-center gap-2">
                  {info.icon}
                  <span className="text-wrap">
                    {info.name ? info.name : "None"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 text-base">
            <h4 className="lg:text-base text-[14px] font-medium">Badges</h4>

            <div className="flex xl:items-center gap-1 xl:flex-row flex-col">
              {badges.map((badge, index) => {
                return (
                  <Chip
                    key={index}
                    color="primary"
                    className="cursor-pointer dark:text-black dark:bg-white bg-black text-white"
                  >
                    {badge.name}
                  </Chip>
                );
              })}
            </div>
          </div>

          {!isAdmin && (
            <>
              <div className="flex flex-col gap-3 text-base">
                <h4 className="lg:text-base text-[14px] font-medium">
                  Loyalty Points
                </h4>

                <div
                  className="flex items-center gap-2 px-4 py-2 w-fit shadow-custom 
            rounded-[15px] dark:bg-white dark:text-black"
                >
                  <AwardIcon />
                  <p className="xl:text-3xl md:text-2xl text-xl font-bold">
                    {user?.loyalty_points}
                  </p>
                </div>

                <div
                  className="flex gap-2 xl:items-center md:items-center items-start 
                xl:flex-row md:flex-row flex-col"
                >
                  {isLoading ? (
                    <>
                      <Button
                        isLoading
                        color="primary"
                        className="dark:bg-black dark:text-white"
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
                        <GiftIcon />
                        Redeem
                      </Button>
                    </>
                  )}

                  <Chip>
                    <span className="text-[12px]">Note:</span> 500 points = 10%
                    percent
                  </Chip>
                </div>
              </div>
            </>
          )}
        </div>

        {!isAdmin && (
          <>
            <div className="flex flex-col lg:gap-3 gap-2">
              <h5
                className="text-base md:text-left text-center
               font-medium text-black dark:text-white"
              >
                Vouchers List
              </h5>

              <div className="flex flex-col lg:gap-6 gap-4">
                {items.length !== 0 ? (
                  <div className="flex flex-col gap-3">
                    <VouchersList vouchers={items} />

                    <div className="flex lg:justify-start justify-center">
                      <Pagination
                        initialPage={page}
                        total={totalPages}
                        showControls
                        showShadow
                        isCompact
                        onChange={(page) => setPage(page)}
                        classNames={{
                          cursor:
                            "dark:bg-white dark:text-black bg-black text-white",
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <p
                      className="lg:px-4 px-2 dark:text-white/60 text-black/60 
                    lg:text-[14px] text-[13px] lg:text-left text-center"
                    >
                      You don&apos;t have any vouchers. Please pay for your
                      order or reservation with the required amount mentioned in
                      the notification to receive the corresponding voucher.
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <h5
                className="text-base md:text-left text-center
               font-medium dark:text-white text-black"
              >
                Your Orders
              </h5>

              <RecentOrders />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
