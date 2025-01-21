import React from "react";
import CreateNotificationForm from "@/components/form/CreateNotificationForm";

const NotificationCreatePage: React.FC = () => {
  return (
    <main className="w-full container mx-auto px-6 py-4 flex flex-col gap-6">
      <div className="flex flex-col relative lg:justify-start justify-center lg:text-left text-center">
        <h1 className="lg:text-2xl text-xl uppercase font-bold">
          New Notification
        </h1>

        <p className="lg:text-base text-[15px] dark:text-white/70 text-black/80">
          If there&apos;s anything new, please create a notification right away
          to keep customers informed!
        </p>
      </div>

      <CreateNotificationForm />
    </main>
  );
};

export default NotificationCreatePage;
