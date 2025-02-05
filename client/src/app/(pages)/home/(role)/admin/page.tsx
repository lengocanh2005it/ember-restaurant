"use client";
import { Accordion, AccordionItem, Button, Chip } from "@heroui/react";
import {
  BellRingIcon,
  CaptionsIcon,
  GiftIcon,
  HandPlatterIcon,
  MenuIcon,
  PercentIcon,
  ShieldIcon,
  ShoppingCartIcon,
  TableIcon,
  UsersIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const SettingsPage: React.FC = () => {
  const router = useRouter();

  const menus = [
    { key: 1, title: "Add a dish to the menu.", path: "/home/admin/menu/add" },
    {
      key: 2,
      title: "See all dishes from the menu.",
      path: "/home/admin/menu",
    },
  ];

  const customers = [
    {
      key: 1,
      title: "See all customers of the restaurant.",
      path: "/home/admin/customers",
    },
    {
      key: 2,
      title: "View all requests from customers.",
      path: "/home/admin/customers/requests",
    },
  ];

  const notifications = [
    {
      key: 1,
      title: "See all notifications of the restaurant.",
      path: "/home/admin/notifications",
    },
    {
      key: 2,
      title: "Create a new notification.",
      path: "/home/admin/notifications/add",
    },
  ];

  const orders = [
    {
      key: 1,
      title: "See all orders of the customers.",
      path: "/home/admin/orders",
    },
  ];

  const reservations = [
    {
      key: 1,
      title: "See all reservations of the customers.",
      path: "/home/admin/reservations",
    },
  ];

  const reviews = [
    {
      key: 1,
      title: "See all reviews of the restaurant",
      path: "/home/admin/reviews",
    },
  ];

  const events = [
    {
      key: 1,
      title: "See all events of the restaurant.",
      path: "/home/admin/events",
    },
    {
      key: 2,
      title: "Create a new event.",
      path: "/home/admin/events/add",
    },
  ];

  const promotions = [
    {
      key: 1,
      title: "See all promotions of the restaurant.",
      path: "/home/admin/promotions",
    },
    {
      key: 2,
      title: "See all discounts of the restaurant.",
      path: "/home/admin/promotions/discounts",
    },
    {
      key: 3,
      title: "Create a new promotion.",
      path: "/home/admin/promotions/add",
    },
    {
      key: 4,
      title: "Create a new discount.",
      path: "/home/admin/promotions/discounts/add",
    },
  ];

  const areas = [
    {
      key: 1,
      title: "See all areas of the restaurant.",
      path: "/home/admin/areas",
    },
    {
      key: 2,
      title: "Create a new area.",
      path: "/home/admin/areas/add",
    },
  ];

  return (
    <main className="w-full container mx-auto px-3 py-5 flex flex-col lg:gap-6 gap-3">
      <div className="flex flex-col lg:gap-1 gap-3 lg:items-start lg:text-left text-center">
        <div className="flex relative lg:flex-row flex-col items-center gap-2">
          <ShieldIcon size={40} />
          <h1 className="lg:text-2xl text-xl font-bold">Admin Page</h1>
        </div>

        <div
          className="relative flex items-center
         lg:justify-between lg:flex-row flex-col gap-2 w-full"
        >
          <p
            className="lg:text-base text-[14px] dark:text-white/60
         text-black/70"
          >
            This page is used to view, edit, delete, and update all the features
            that the restaurant currently has.
          </p>

          <Chip
            className="lg:text-[14px] text-[13px] text-white/80 dark:bg-white
          dark:text-black"
            color="primary"
          >
            <span className="dark:text-black/60 text-white/60">Note</span>: Only
            restaurant managers can access this page.
          </Chip>
        </div>
      </div>

      <Accordion selectionMode="multiple">
        {/* Menu */}
        <AccordionItem
          startContent={<MenuIcon />}
          key="1"
          aria-label="menu"
          title="MENU"
          subtitle="Options for menu. Click to expand."
        >
          <div className="flex flex-col gap-1">
            {menus.map((menu) => (
              <div
                key={menu.key}
                className="flex lg:flex-row flex-col lg:justify-between
              lg:items-center lg:gap-4 gap-1"
              >
                <Chip
                  variant="dot"
                  color="success"
                  className="border-none lg:text-base text-[14px]"
                >
                  {menu.title}
                </Chip>

                <Button
                  color="primary"
                  className="dark:bg-white dark:text-black w-fit"
                  onPress={() => {
                    router.push(menu.path);
                  }}
                >
                  Click
                </Button>
              </div>
            ))}
          </div>
        </AccordionItem>

        {/* Customers */}
        <AccordionItem
          startContent={<UsersIcon />}
          key="2"
          aria-label="customers"
          title="CUSTOMERS"
          subtitle="Options for customers. Click to expand."
        >
          <div className="flex flex-col gap-1">
            {customers.map((customer) => (
              <div
                key={customer.key}
                className="flex lg:flex-row flex-col lg:justify-between
              lg:items-center lg:gap-4 gap-1"
              >
                <Chip
                  variant="dot"
                  color="success"
                  className="border-none lg:text-base text-[14px] text-wrap"
                >
                  {customer.title}
                </Chip>

                <Button
                  color="primary"
                  className="dark:bg-white dark:text-black w-fit"
                  onPress={() => {
                    router.push(customer.path);
                  }}
                >
                  Click
                </Button>
              </div>
            ))}
          </div>
        </AccordionItem>

        {/* Notifications */}
        <AccordionItem
          startContent={<BellRingIcon />}
          key="3"
          aria-label="notifications"
          title="NOTIFICATIONS"
          subtitle="Options for notifications. Click to expand."
        >
          <div className="flex flex-col gap-2">
            {notifications.map((notification) => (
              <div
                key={notification.key}
                className="flex lg:flex-row flex-col lg:justify-between
            lg:items-center lg:gap-4 gap-1"
              >
                <Chip
                  variant="dot"
                  color="success"
                  className="border-none lg:text-base text-[14px]"
                >
                  {notification.title}
                </Chip>

                <Button
                  color="primary"
                  className="dark:bg-white dark:text-black w-fit"
                  onPress={() => {
                    router.push(notification.path);
                  }}
                >
                  Click
                </Button>
              </div>
            ))}
          </div>
        </AccordionItem>

        {/* Orders */}
        <AccordionItem
          startContent={<ShoppingCartIcon />}
          key="5"
          aria-label="orders"
          title="ORDERS"
          subtitle="All orders from customers. Click to expand."
        >
          <div className="flex flex-col gap-2">
            {orders.map((order) => (
              <div
                key={order.key}
                className="flex lg:flex-row flex-col lg:justify-between
              lg:items-center lg:gap-4 gap-1"
              >
                <Chip
                  variant="dot"
                  color="success"
                  className="border-none lg:text-base text-[14px]"
                >
                  {order.title}
                </Chip>

                <Button
                  color="primary"
                  className="dark:bg-white dark:text-black w-fit"
                  onPress={() => {
                    router.push(order.path);
                  }}
                >
                  Click
                </Button>
              </div>
            ))}
          </div>
        </AccordionItem>

        {/* Reservations */}
        <AccordionItem
          startContent={<HandPlatterIcon />}
          key="6"
          aria-label="reservations"
          title="RESERVATIONS"
          subtitle="All reservations from customers. Click to expand."
        >
          <div className="flex flex-col gap-2">
            {reservations.map((reservation) => (
              <div
                key={reservation.key}
                className="flex lg:flex-row flex-col lg:justify-between
              lg:items-center lg:gap-4 gap-1"
              >
                <Chip
                  variant="dot"
                  color="success"
                  className="border-none lg:text-base text-[14px]"
                >
                  {reservation.title}
                </Chip>

                <Button
                  color="primary"
                  className="dark:bg-white dark:text-black w-fit"
                  onPress={() => {
                    router.push(reservation.path);
                  }}
                >
                  Click
                </Button>
              </div>
            ))}
          </div>
        </AccordionItem>

        {/* Reviews */}
        <AccordionItem
          startContent={<CaptionsIcon />}
          key="7"
          aria-label="reviews"
          title="REVIEWS"
          subtitle="All reviews of customers about the restaurant. Click to expand."
        >
          <div className="flex flex-col gap-2">
            {reviews.map((review) => (
              <div
                key={review.key}
                className="flex lg:flex-row flex-col lg:justify-between
              lg:items-center lg:gap-4 gap-1"
              >
                <Chip
                  variant="dot"
                  color="success"
                  className="border-none lg:text-base text-[14px]"
                >
                  {review.title}
                </Chip>

                <Button
                  color="primary"
                  className="dark:bg-white dark:text-black w-fit"
                  onPress={() => {
                    router.push(review.path);
                  }}
                >
                  Click
                </Button>
              </div>
            ))}
          </div>
        </AccordionItem>

        {/* Events */}
        <AccordionItem
          startContent={<GiftIcon />}
          key="8"
          aria-label="events"
          title="EVENTS"
          subtitle="All events of the restaurant. Click to expand."
        >
          <div className="flex flex-col gap-2">
            {events.map((event) => (
              <div
                key={event.key}
                className="flex lg:flex-row flex-col lg:justify-between
              lg:items-center lg:gap-4 gap-1"
              >
                <Chip
                  variant="dot"
                  color="success"
                  className="border-none lg:text-base text-[14px]"
                >
                  {event.title}
                </Chip>

                <Button
                  color="primary"
                  className="dark:bg-white dark:text-black w-fit"
                  onPress={() => {
                    router.push(event.path);
                  }}
                >
                  Click
                </Button>
              </div>
            ))}
          </div>
        </AccordionItem>

        {/* Promotions */}
        <AccordionItem
          startContent={<PercentIcon />}
          key="9"
          aria-label="promotions"
          title="PROMOTIONS"
          subtitle="All promotions of the restaurant. Click to expand."
        >
          <div className="flex flex-col gap-2">
            {promotions.map((promotion) => (
              <div
                key={promotion.key}
                className="flex lg:flex-row flex-col lg:justify-between
              lg:items-center lg:gap-4 gap-1"
              >
                <Chip
                  variant="dot"
                  color="success"
                  className="border-none lg:text-base text-[14px]"
                >
                  {promotion.title}
                </Chip>

                <Button
                  color="primary"
                  className="dark:bg-white dark:text-black w-fit"
                  onPress={() => {
                    router.push(promotion.path);
                  }}
                >
                  Click
                </Button>
              </div>
            ))}
          </div>
        </AccordionItem>

        {/* Areas */}
        <AccordionItem
          startContent={<TableIcon />}
          key="10"
          aria-label="areas"
          title="AREAS"
          subtitle="All areas of the restaurant. Click to expand."
        >
          <div className="flex flex-col gap-2">
            {areas.map((area) => (
              <div
                key={area.key}
                className="flex lg:flex-row flex-col lg:justify-between
              lg:items-center lg:gap-4 gap-1"
              >
                <Chip
                  variant="dot"
                  color="success"
                  className="border-none lg:text-base text-[14px]"
                >
                  {area.title}
                </Chip>

                <Button
                  color="primary"
                  className="dark:bg-white dark:text-black w-fit"
                  onPress={() => {
                    router.push(area.path);
                  }}
                >
                  Click
                </Button>
              </div>
            ))}
          </div>
        </AccordionItem>
      </Accordion>
    </main>
  );
};

export default SettingsPage;
