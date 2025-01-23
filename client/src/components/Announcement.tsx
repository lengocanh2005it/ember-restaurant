"use client";
import React from "react";
import { Badge } from "@heroui/react";
import { BellIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useNotificationStore } from "@/store";

const Announcement: React.FC = () => {
  const { notification } = useNotificationStore();

  const routes = useRouter();

  return (
    <div className="flex flex-col items-center">
      {notification ? (
        <>
          <Badge content="" size="lg" color="danger">
            <BellIcon
              className="cursor-pointer"
              size={30}
              onClick={() => routes.push("/home/notifications")}
            />
          </Badge>
        </>
      ) : (
        <>
          <BellIcon
            className="cursor-pointer"
            size={30}
            onClick={() => routes.push("/home/notifications")}
          />
        </>
      )}
    </div>
  );
};

export default Announcement;
