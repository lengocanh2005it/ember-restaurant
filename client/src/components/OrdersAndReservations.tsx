"use client";
import React from "react";
import Image from "next/image";
import { Tabs, Tab, Card, CardBody, Chip } from "@nextui-org/react";
import { useAppStore, useUserStore } from "@/store";

const OrdersReservationsPoints: React.FC = () => {
  const { isAdmin } = useAppStore();
  const { user } = useUserStore();

  const items = [
    {
      title: "Total Orders",
      description: "This is the total number of orders placed.",
      number: user?.total_orders ? user?.total_orders : 0,
      image: "/svg/shopping-cart-svgrepo-com.svg",
    },
    {
      title: "Total Reservations",
      description: "This is the total number of reservations placed.",
      number: user?.total_reservations ? user?.total_reservations : 0,
      image: "/svg/calendar-svgrepo-com.svg",
    },
    {
      title: "Loyalty Points",
      description: "This is the total number of loyalty points earned.",
      number: user?.loyalty_points ? user?.loyalty_points : 0,
      image: "/svg/badge-svgrepo-com.svg",
    },
  ];

  const tabs = [
    {
      key: "total_orders",
      title: "Orders",
      component: (
        <p className="text-[14px] md:text-left text-center">
          You will have one additional order if you have successfully completed
          the payment for that order.
        </p>
      ),
    },
    {
      key: "current_reservations",
      title: "Reservations",
      component: (
        <p className="text-[14px] md:text-left text-center">
          You will have one additional reservation if you have successfully
          completed the payment for that reservation.
        </p>
      ),
    },
    {
      key: "loyalty_points",
      title: "Points",
      component: (
        <p className="text-[14px] md:text-left text-center">
          You will receive{" "}
          <span className="text-base font-bold dark:text-red-300 text-red-400">
            10
          </span>{" "}
          loyalty points for successfully completing a payment for an order and{" "}
          <span className="text-base font-bold dark:text-red-300 text-red-400">
            15
          </span>{" "}
          points for successfully completing a payment for a reservation.
        </p>
      ),
    },
  ];

  return (
    <>
      {!isAdmin && (
        <>
          <section
            className="w-full flex flex-col relative container mx-auto py-6 lg:pt-2
           dark:text-white dark:bg-primary lg:gap-6 gap-4"
          >
            <div className="flex flex-col relative lg:gap-4 gap-3">
              <div
                className="flex flex-col lg:items-start items-center lg:justify-start justify-center
              lg:text-left text-center"
              >
                <h1
                  className="lg:text-2xl text-xl font-bold text-black
             dark:text-white dark:bg-primary md:text-left text-center"
                >
                  Your Dashboard
                </h1>

                <p className="lg:text-base text-[14px] dark:text-white/70 text-black/80">
                  Follow your journey with us – from orders to reservations to
                  rewards.
                </p>
              </div>

              <div className="flex xl:gap-6 md:gap-4 xl:flex-row flex-col gap-2">
                {items.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="flex justify-between bg-white
              dark:text-white dark:bg-black
              cursor-pointer rounded-lg shadow-custom p-4
               ease-in-out transition-all duration-300 hover:shadow-custom_hover
               border border-transparent dark:border-white/60
                lg:flex-row flex-col-reverse
                 lg:text-left text-center"
                    >
                      <div className="flex flex-col gap-4 text-[14px]">
                        <h2 className="font-bold lg:text-base text-[14px]">
                          {item.title}
                        </h2>

                        <p
                          className="lg:text-6xl md:text-4xl text-3xl 
                      font-semibold text-black dark:text-white"
                        >
                          {item.number}
                        </p>

                        <p className="text-gray-500 italic dark:text-white/80">
                          {item.description}
                        </p>
                      </div>

                      {item.image && (
                        <Image
                          src={item.image}
                          alt="image"
                          priority
                          width={150}
                          height={150}
                          sizes="(max-width:600px) 100vw, 50vw"
                          className="select-none mx-auto lg:mx-0 object-cover"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div
              className="relative flex flex-col gap-2 md:mx-0 mx-auto 
              lg:items-start items-center lg:justify-start
            justify-center w-fit"
            >
              <Tabs aria-label="Notes">
                {tabs.map((tab) => (
                  <Tab key={tab.key} title={tab.title}>
                    <Card className="w-fit">
                      <CardBody className="flex flex-col gap-2 md:items-start items-center">
                        <Chip color="danger">Note:</Chip>
                        {tab.component}
                      </CardBody>
                    </Card>
                  </Tab>
                ))}
              </Tabs>
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default OrdersReservationsPoints;
