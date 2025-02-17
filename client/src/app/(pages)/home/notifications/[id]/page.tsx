"use client";
import LoadingPage from "@/components/LoadingPage";
import { useNotification } from "@/hooks/use-notification";
import { Notification } from "@/utils";
import { Separator } from "@radix-ui/react-separator";
import { format } from "date-fns";
import { EyeIcon } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const NotificationPage: React.FC = () => {
  const [notification, setNotification] = useState<Notification>({
    id: "",
    image: "",
    number: 0,
    title: "",
    content: "",
    createdAt: new Date(),
    name: "",
  });

  const params = useParams();
  const { id } = params;

  const { data, isLoading, isError } = useNotification(id as string);

  useEffect(() => {
    if (data) {
      setNotification(data as Notification);
    }
  }, [data]);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <div>Error...</div>;
  }

  return (
    <>
      <main className="w-full container mx-auto flex flex-col gap-4 lg:px-8 px-2 py-4 relative group">
        <div className="lg:w-[60%] w-full mx-auto relative lg:h-[60vh] h-[30vh]">
          {notification.image && (
            <Image
              src={notification?.image}
              alt="image"
              priority
              fill
              sizes="(max-width:600px) 100vw, 50vw"
              className="object-cover cursor-pointer opacity-90 
          group-hover:opacity-100 duration-250 ease-in-out transition-opacity rounded-lg"
            />
          )}
        </div>

        <Separator className="px-2 dark:bg-white/10 bg-black/10 w-full h-[2px]" />

        <div className="flex flex-col gap-2 container mx-auto">
          <div className="flex flex-col lg:gap-4 gap-2 relative">
            <h1 className="lg:text-2xl text-xl font-bold lg:text-left text-center">
              {notification?.title ? notification?.title : ""}
            </h1>

            <p
              className="lg:text-[16px] text-[14px] dark:text-white/70 text-black/80
            lg:min-h-[50vh] min-h-[30vh]"
            >
              {notification?.content ? notification.content : ""}
            </p>
          </div>

          <div className="flex flex-col-reverse gap-6 justify-end items-end">
            <div className="flex items-end justify-end gap-1 flex-col">
              <h1 className="lg:text-xl text-base dark:text-white/80 text-black/80">
                By {notification.name}
              </h1>

              <p className="lg:text-[14px] text-[12px] dark:text-white/80 text-black/70">
                Admin of Ember. Restaurant.
              </p>
            </div>

            <div className="flex flex-col gap-2 relative justify-end items-end">
              <p className="lg:text-xl text-base dark:text-white/50 text-black/60">
                {format(
                  notification?.createdAt ? notification.createdAt : new Date(),
                  "dd/MM/yyyy"
                )}
              </p>

              <div className="flex flex-row gap-2 items-center justify-end">
                <EyeIcon className="opacity-50" />
                <p className="dark:text-white/90 text-black/60 lg:text-2xl text-xl">
                  {notification.number}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default NotificationPage;
