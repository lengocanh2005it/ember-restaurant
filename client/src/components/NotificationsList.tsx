"use client";
import LoadingPage from "@/components/LoadingPage";
import { useNotifications } from "@/hooks/use-notifications";
import { useAppStore, useNotificationStore } from "@/store";
import { Notification } from "@/utils";
import { Button, Tooltip } from "@nextui-org/react";
import { format } from "date-fns";
import { ArrowDownIcon, ArrowUpIcon, ClockIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { Dispatch, SetStateAction } from "react";
import SwiperCore from "swiper/core";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";

interface NotificationListProps {
  setIsClick: Dispatch<SetStateAction<boolean>>;
}

const NotificationsList: React.FC<NotificationListProps> = ({ setIsClick }) => {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const router = useRouter();

  const { setNotification } = useNotificationStore();
  const { isAdmin } = useAppStore();

  const { data, isLoading, isError } = useNotifications();

  const handleClick = () => {
    router.push(`/home/admin/notifications/add`);
  };

  SwiperCore.use([Autoplay]);

  React.useEffect(() => {
    if (data) {
      setNotifications(data as Notification[]);
      setNotification(data[0] as Notification);
    }
  }, [data, setNotification]);

  const swiperRef = React.useRef<SwiperClass | null>(null);

  React.useEffect(() => {
    const swiperInstance = swiperRef.current;

    if (swiperInstance) {
      swiperInstance.on("slideChangeTransitionEnd", () => {
        if (swiperInstance.isEnd) {
          setTimeout(() => {
            swiperInstance.slideTo(0, 500);
          }, 5000);
        }
      });
    }
  }, []);

  const handleSlidePrev = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const handleSlideNext = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <div>Error...</div>;
  }

  return (
    <>
      {notifications.length !== 0 ? (
        <>
          <Swiper
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            slidesPerView={3}
            spaceBetween={15}
            autoplay={{
              delay: 6000,
              disableOnInteraction: false,
            }}
            wrapperClass="w-full"
            direction="vertical"
            className="flex lg:w-[60%] w-full
             lg:h-[500px] h-[1000px] relative lg:p-2 p-1 overflow-y-hidden"
          >
            {notifications.map((notification: Notification) => (
              <SwiperSlide
                key={notification.id}
                className="h-fit flex-1 border dark:border-white/20
                relative flex gap-5 p-2 rounded-xl lg:flex-row flex-col
                hover:dark:border-white/40 hover:cursor-pointer
                 ease-in-out transition-opacity duration-250 group
                px-3 shadow-custom"
                onClick={() => {
                  setNotification(notification as Notification);
                  setIsClick(true);
                  setTimeout(() => {
                    setIsClick(false);
                  }, 1000);
                }}
              >
                <Tooltip
                  showArrow
                  content={notification.title}
                  className="dark:text-white text-black"
                >
                  <div
                    className="relative lg:w-[40%] w-full h-full rounded-md"
                    onClick={() => {
                      setNotification(notification);
                      setIsClick(true);
                      setTimeout(() => {
                        setIsClick(false);
                      }, 1000);
                    }}
                  >
                    {notification.image && (
                      <Image
                        src={notification.image}
                        alt="background"
                        fill
                        priority
                        sizes="(max-width: 600px) 100vw, 50vw"
                        className="object-cover cursor-pointer rounded-xl
                      ease-in-out transition-opacity opacity-70 group-hover:opacity-100"
                      />
                    )}
                  </div>
                </Tooltip>

                <div
                  className="relative flex flex-col justify-between 
                lg:text-base text-[14px] font-medium w-full"
                >
                  <div
                    className="flex flex-col gap-1 lg:items-start items-center
                   lg:text-left text-center"
                  >
                    <Tooltip
                      showArrow
                      content={notification.title}
                      className="dark:text-white text-black"
                    >
                      <h1
                        onClick={() => {
                          setNotification(notification);
                          setIsClick(true);
                          setTimeout(() => {
                            setIsClick(false);
                          }, 1000);
                        }}
                        className="lg:text-lg text-base font-medium w-fit text-wrap hover:underline
                         hover:text-blue-700 hover:cursor-pointer lg:text-left text-center"
                      >
                        {notification.title}
                      </h1>
                    </Tooltip>

                    <p className="line-clamp-2 text-[14px] dark:text-white/80 text-black/80">
                      {notification.content}
                    </p>
                  </div>

                  <p
                    className="flex items-center justify-end
                   gap-2 dark:text-gray-300 text-black/60"
                  >
                    <ClockIcon />{" "}
                    {format(
                      notification?.createdAt
                        ? notification.createdAt
                        : new Date(),
                      "dd/MM/yyyy"
                    )}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div
            className="flex flex-row lg:items-end lg:justify-end gap-4
           absolute lg:right-0 -bottom-4"
          >
            <ArrowUpIcon
              size={40}
              onClick={handleSlidePrev}
              className="cursor-pointer border p-1 dark:border-white/30
               border-black/20 rounded-full opacity-50 hover:opacity-100 
               duration-300 ease-in-out transition-all"
            />

            <ArrowDownIcon
              size={40}
              onClick={handleSlideNext}
              className="cursor-pointer border p-1 dark:border-white/30
               border-black/20 rounded-full opacity-50 hover:opacity-100
                duration-300 ease-in-out transition-all"
            />
          </div>
        </>
      ) : (
        <>
          <div
            className="flex flex-col lg:gap-2 gap-1 text-center container mx-auto 
          h-[40vh] justify-center items-center"
          >
            <h1
              className="lg:text-2xl text-xl font-bold
             dark:text-white text-black"
            >
              Empty Notifications
            </h1>

            {isAdmin ? (
              <>
                <p
                  className="lg:text-base text-[15px] dark:text-white/60
             text-black/60"
                >
                  Ember&apos; restaurant currently has no notifications. If
                  there&apos;s anything new, please create a notification!
                </p>
              </>
            ) : (
              <>
                <p
                  className="lg:text-base text-[15px] dark:text-white/60
             text-black/60"
                >
                  Ember&apos; restaurant has not any notifications. Please go
                  back later!
                </p>
              </>
            )}

            {isAdmin && (
              <Button
                onPress={handleClick}
                color="primary"
                className="dark:bg-white dark:text-black"
              >
                Go to Create
              </Button>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default NotificationsList;
