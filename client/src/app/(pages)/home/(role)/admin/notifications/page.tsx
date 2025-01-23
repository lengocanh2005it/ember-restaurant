"use client";
import React, { useState, useEffect } from "react";
import ViewNotifications from "@/components/ViewNotifications";
import { Button, Pagination } from "@heroui/react";
import { useNotifications } from "@/hooks/use-notifications";
import LoadingComponent from "@/components/LoadingComponent";
import { usePathname, useRouter } from "next/navigation";
import { Notification } from "@/utils/types";
import LoadingPage from "@/components/LoadingPage";

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { data, isLoading, isError } = useNotifications();
  const [page, setPage] = useState<number>(1);
  const itemsPerPage = 3;
  const router = useRouter();
  const pathname = usePathname();

  const pages = React.useMemo(() => {
    return Math.ceil((notifications?.length ?? 0) / itemsPerPage);
  }, [notifications]);

  const items = React.useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    return notifications?.slice(start, end) ?? [];
  }, [notifications, page]);

  const handleClick = () => {
    router.push(`${pathname}/add`);
  };

  useEffect(() => {
    if (data) {
      setNotifications(data as Notification[]);
    }
  }, [data]);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <div>Error...</div>;
  }

  return (
    <main className="w-full lg:container mx-auto lg:px-6 py-4 flex flex-col gap-4">
      <div
        className="flex lg:flex-row flex-col items-center lg:justify-between justify-center
       gap-2"
      >
        <div
          className="flex flex-col lg:items-start items-center lg:justify-start 
        justify-center lg:text-left text-center"
        >
          <h1 className="lg:text-2xl text-xl uppercase font-bold">
            All Notifications
          </h1>

          <p className="lg:text-base text-[14px] dark:text-white/70 text-black/80">
            Here are all the notifications from the restaurant.
          </p>
        </div>

        <Button
          color="primary"
          className="dark:bg-white dark:text-black text-white w-fit lg:mx-0 mx-auto"
          onPress={handleClick}
        >
          Add New Notification
        </Button>
      </div>

      <ViewNotifications notifications={items} />

      {notifications.length !== 0 && (
        <div className="relative flex lg:justify-start justify-center lg:items-start items-center">
          <Pagination
            showControls
            total={pages}
            initialPage={page}
            isCompact
            showShadow
            classNames={{
              cursor: "bg-foreground text-background",
            }}
            onChange={(page) => setPage(page)}
          />
        </div>
      )}
    </main>
  );
};

export default NotificationsPage;
