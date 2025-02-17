import { Notification } from "@/utils";
import { Button, Tooltip } from "@heroui/react";
import { format } from "date-fns";
import { ClockIcon, EyeIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

interface NotificationDetailsItemProps {
  notification: Notification;
}

const NotificationDetailsItem: React.FC<NotificationDetailsItemProps> = ({
  notification,
}) => {
  const router = useRouter();

  const handleClick = (id: string) => {
    router.push(`/home/notifications/${id}`);
  };

  return (
    <div
      className="lg:w-[45%] w-full relative flex flex-col lg:gap-4 gap-3 border
     dark:border-white/30 p-3 rounded-xl hover:dark:border-white/50
      ease-in-out transition-all duration-300 shadow-custom"
    >
      <div className="relative w-full lg:h-[80%] h-[45vh] rounded-lg">
        {notification.image && (
          <Image
            fill
            sizes="(max-width: 600px) 100vw, 50vw"
            priority
            alt="image"
            src={notification.image}
            className="cursor-pointer select-none rounded-xl object-cover
          opacity-70 hover:opacity-100 duration-250 ease-in-out transition-opacity"
          />
        )}
      </div>

      <div className="flex flex-col gap-2 lg:items-start items-center">
        <h3
          className="lg:text-xl text-base font-medium dark:text-white text-black
        lg:text-left text-center"
        >
          {notification.title}
        </h3>

        <div className="text-base flex flex-col gap-3 w-full">
          <p
            className="line-clamp-2 text-[14px] dark:text-white/70 text-black/80
          lg:text-left text-center"
          >
            {notification.content}
          </p>

          <div
            className="flex md:flex-row md:items-center md:justify-between flex-col 
            justify-center items-center w-full dark:text-gray-300 text-black lg:gap-1 gap-2"
          >
            <div className="flex items-center gap-1">
              <Tooltip
                content="Posted Date"
                className="dark:text-white text-black"
              >
                <ClockIcon />
              </Tooltip>

              <span>
                {format(
                  notification?.createdAt ? notification.createdAt : new Date(),
                  "dd/MM/yyyy"
                )}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <Tooltip content="Views" className="dark:text-white text-black">
                <EyeIcon />
              </Tooltip>

              <span className="text-xl font-bold">{notification.number}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex lg:items-end lg:justify-end items-center justify-center">
        <Button
          className="dark:bg-white dark:text-black"
          color="primary"
          onPress={() => {
            handleClick(notification.id);
          }}
          startContent={<EyeIcon />}
        >
          See Details
        </Button>
      </div>
    </div>
  );
};

export default NotificationDetailsItem;
