"use client";
import EditAdminButton from "@/components/EditAdminButton";
import LoadingComponent from "@/components/LoadingComponent";
import NotificationDetailsItem from "@/components/NotificationDetailsItem";
import NotificationsList from "@/components/NotificationsList";
import { useAppStore, useNotificationStore } from "@/store";
import React, { useState } from "react";

const NotificationsPage: React.FC = () => {
  const [isClick, setIsClick] = useState<boolean>(false);
  const { notification } = useNotificationStore();
  const { isAdmin } = useAppStore();

  return (
    <div className="container relative flex flex-col gap-4 lg:px-6 px-2 lg:py-8 py-4">
      <div
        className="flex flex-col lg:items-start items-center lg:justify-start 
        justify-center lg:text-left text-center"
      >
        <div className="flex items-center lg:gap-4 gap-2 lg:flex-row flex-col lg:text-left text-center">
          <h1 className="lg:text-2xl text-xl font-bold md:text-left text-center">
            Ember&apos; Notifications
          </h1>

          {isAdmin && <EditAdminButton path="/home/admin/notifications" />}
        </div>

        <p className="lg:text-[15px] text-[14px] dark:text-white/80 text-black/80">
          Below is the list of the latest announcements from Ember Restaurant.
        </p>
      </div>

      <div className="flex relative w-full gap-10 lg:flex-row flex-col">
        {!isClick ? (
          <>
            {notification && (
              <NotificationDetailsItem notification={notification} />
            )}
          </>
        ) : (
          <>
            <div className="lg:w-[45%] w-full flex flex-col items-center justify-center">
              <LoadingComponent />
            </div>
          </>
        )}

        <NotificationsList setIsClick={setIsClick} />
      </div>
    </div>
  );
};

export default NotificationsPage;
