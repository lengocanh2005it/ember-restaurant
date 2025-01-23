"use client";
import EditAdminButton from "@/components/EditAdminButton";
import LoadingPage from "@/components/LoadingPage";
import { useEvents } from "@/hooks/use-events";
import { useAppStore } from "@/store";
import { showSuccessToast } from "@/utils";
import { Event } from "@/utils/types";
import { Button, Pagination } from "@heroui/react";
import { BellIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

const typeMap = {
  holiday_event: "Holiday Event",
  food_festival: "Food Festival",
  concert: "Concert",
  cooking_class: "Cooking Class",
};

const statusMap = {
  scheduled: "Scheduled",
  ongoing: "On Going",
  finished: "Finished",
};

const UpcomingEvents: React.FC = () => {
  const router = useRouter();
  const { isAdmin } = useAppStore();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);

  const [events, setEvents] = useState<Event[]>([]);

  const { data, isLoading, isError } = useEvents();

  useEffect(() => {
    if (data) {
      setEvents(data as Event[]);
    }
  }, [data]);

  const itemsPerPage = 2;

  const totalPages = useMemo(() => {
    return Math.ceil((events?.length ?? 0) / itemsPerPage) ?? 0;
  }, [events]);

  const items = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    return events?.slice(start, end) ?? [];
  }, [page, events]);

  const handleCreateClick = () => {
    router.push("/home/admin/events/add");
  };

  const handleClick = (id: string) => {
    setLoadingId(id);

    setTimeout(() => {
      setLoadingId(null);

      showSuccessToast(
        "Successfully! Please check email frequently to receive a reminder from us!",
        "bottom-right",
        {
          backgroundColor: "#28a745",
          color: "#fff",
        }
      );
    }, 2200);
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <div>Error...</div>;
  }

  return (
    <section className="w-full container mx-auto py-6 flex flex-col gap-3 relative">
      <div
        className="relative flex flex-col lg:items-start lg:justify-start lg:text-left
           items-center justify-center text-center"
      >
        <div className="flex lg:flex-row flex-col lg:gap-4 gap-1 items-center">
          <h1 className="lg:text-2xl text-xl font-bold md:text-left text-center">
            Upcoming Events
          </h1>

          {isAdmin && <EditAdminButton path="/home/admin/events" />}
        </div>

        <p className="lg:text-base text-[14px] dark:text-white/70 text-black/80">
          Join us for upcoming events – we have something special planned!
        </p>
      </div>

      {items.length === 0 ? (
        <>
          <div className="flex flex-col gap-2 relative items-center text-center justify-center">
            <h1 className="lg:text-xl text-base uppercase font-bold">
              Empty Events
            </h1>

            {isAdmin ? (
              <>
                <p className="lg:text-[14px] text-[13px] dark:text-white/60 text-black/70">
                  Let&apos;s create events to attract more new customers!
                </p>

                <Button
                  color="primary"
                  className="dark:bg-white dark:text-black"
                  onPress={handleCreateClick}
                >
                  Go to Create
                </Button>
              </>
            ) : (
              <>
                <p className="lg:text-[14px] text-[13px] dark:text-white/60 text-black/70">
                  We will soon post information about events. Please visit our
                  restaurant regularly to get the latest updates!
                </p>
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="grid md:grid-cols-2 grid-cols-1 lg:gap-8 gap-5 lg:w-[90%] w-full mx-auto">
            {items.map((event) => (
              <div
                key={event.id}
                className="border shadow-custom dark:border-white/20 rounded-lg
                 dark:bg-primary
           dark:text-white p-4 flex justify-between flex-col gap-3 
            bg-white w-full relative"
              >
                <div className="relative w-full rounded-lg md:h-[45vh] h-[30vh]">
                  {event && event.image && (
                    <Image
                      src={event.image}
                      alt=""
                      priority
                      sizes="(max-width:600px) 100vw, 50vw"
                      objectFit="cover"
                      fill
                      className="rounded-lg cursor-pointer opacity-90 hover:opacity-100 
              ease-in-out transition-all duration-300"
                    />
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-1">
                    <h2
                      className="lg:text-2xl lg:text-left text-base text-center
                    max-w-full break-words font-semibold"
                    >
                      {event.title}
                    </h2>

                    <div className="grid lg:grid-cols-2 gap-x-10 grid-cols-1 lg:text-base text-[15px]">
                      <div
                        className="text-black/70 dark:text-white flex
                       items-center gap-1 justify-between"
                      >
                        <p className="lg:text-[14px] text-[13px]">
                          Start Date:
                        </p>
                        <p className="font-bold">
                          {event.start_date.split("T")[0]}
                        </p>
                      </div>

                      <div
                        className="text-black/70 dark:text-white flex 
                      items-center gap-1 justify-between"
                      >
                        <p className="lg:text-[14px] text-[13px]">End Date:</p>
                        <p className="font-bold">
                          {event.end_date.split("T")[0]}
                        </p>
                      </div>

                      <div
                        className="text-black/70 dark:text-white flex 
                      items-center gap-1 justify-between"
                      >
                        <p className="lg:text-[14px] text-[13px]">
                          Guests Number:
                        </p>
                        <p className="font-bold">{event.guests_number}</p>
                      </div>

                      <div
                        className="text-black/70 dark:text-white flex 
                      items-center gap-1 justify-between"
                      >
                        <p className="lg:text-[14px] text-[13px]">Type:</p>
                        <p className="font-bold">
                          {typeMap[event.type as keyof typeof typeMap]}
                        </p>
                      </div>

                      <div
                        className="text-black/70 dark:text-white
                       flex items-center gap-1 justify-between"
                      >
                        <p className="lg:text-[14px] text-[13px]">Status:</p>
                        <p className="font-bold">
                          {statusMap[event.status as keyof typeof statusMap]}
                        </p>
                      </div>
                    </div>

                    <p
                      className="text-black/70 dark:text-white/80 text-[14px] 
                    lg:text-left text-center max-w-full break-words"
                    >
                      {event.description}
                    </p>

                    {event.note && (
                      <div
                        className="flex lg:flex-row flex-col lg:items-start lg:justify-start
                      items-center lg:gap-1 lg:text-left text-center"
                      >
                        <p className="lg:text-[14px] text-[13px]">Note:</p>

                        <p className="text-gray-700 dark:text-white/80 text-[14px] italic">
                          {event.note}
                        </p>
                      </div>
                    )}
                  </div>

                  {loadingId === event.id ? (
                    <>
                      <Button
                        isLoading
                        color="primary"
                        className="dark:bg-white dark:text-black w-fit  xl:mx-0 mx-auto"
                      >
                        Please wait...
                      </Button>
                    </>
                  ) : (
                    <>
                      {!isAdmin && event.status !== "finished" && (
                        <>
                          <Button
                            color="primary"
                            className="w-fit xl:mx-0 mx-auto dark:bg-white dark:text-black"
                            onPress={() => {
                              handleClick(event.id);
                            }}
                          >
                            <BellIcon />
                            Remind me
                          </Button>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {events.length !== 0 && (
        <div className="flex lg:justify-start justify-center">
          <Pagination
            loop
            showControls
            isCompact
            showShadow
            classNames={{
              cursor: "bg-foreground text-background",
            }}
            color="primary"
            total={totalPages}
            initialPage={page}
            onChange={(page) => setPage(page)}
          />
        </div>
      )}
    </section>
  );
};

export default UpcomingEvents;
