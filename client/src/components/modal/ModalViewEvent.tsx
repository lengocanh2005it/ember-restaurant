"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Event } from "@/utils";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import { EyeIcon } from "lucide-react";
import React from "react";

interface ModalViewEventProps {
  event: Event;
}

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

const ModalViewEvent: React.FC<ModalViewEventProps> = ({ event }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const details = [
    { key: 1, name: "Start Date", value: event.start_date.split("T")[0] },
    { key: 2, name: "End Date", value: event.end_date.split("T")[0] },
    { key: 3, name: "Title", value: event.title },
    { key: 4, name: "Description", value: event.description },
    { key: 6, name: "Guests Number", value: event.guests_number },
    {
      key: 7,
      name: "Type",
      value: typeMap[event.type as keyof typeof typeMap],
    },
    {
      key: 8,
      name: "Status",
      value: statusMap[event.status as keyof typeof statusMap],
    },
    ...(event.note ? [{ key: 5, name: "Note", value: event.note }] : []),
  ];

  return (
    <>
      <Tooltip content="View" showArrow className="dark:text-white text-black">
        <EyeIcon
          className="cursor-pointer opacity-50 hover:opacity-100 
              duration-250 ease-in-out transition-opacity select-none"
          onClick={onOpen}
        />
      </Tooltip>

      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        placement="center"
        size="lg"
        onOpenChange={onOpenChange}
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.3,
                ease: "easeOut",
              },
            },
            exit: {
              y: -20,
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: "easeIn",
              },
            },
          },
        }}
      >
        <ModalContent className="dark:text-white text-black">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col lg:text-left text-center">
                View Event
              </ModalHeader>

              <ModalBody>
                <ScrollArea className="h-[400px] pr-3 w-full">
                  <div className="flex flex-col gap-2">
                    <div
                      className={`flex flex-col lg:gap-1 lg:items-start items-center justify-between p-2
               border dark:border-white/20 border-black/60 rounded-md lg:text-left text-center`}
                    >
                      <h1
                        className="lg:text-[14px] text-[13px]
                    dark:text-white/50 text-black/60"
                      >
                        Title
                      </h1>
                      <p>{event.title ? event.title : "Null"}</p>
                    </div>

                    <div className="grid lg:grid-cols-2 grid-cols-1 gap-2">
                      <div
                        className={`flex lg:flex-row flex-col lg:gap-2 items-center justify-between p-2
               border dark:border-white/20 border-black/60 rounded-md lg:text-left text-center`}
                      >
                        <h1
                          className="lg:text-[14px] text-[13px]
                    dark:text-white/50 text-black/60"
                        >
                          Start Date
                        </h1>
                        <p>
                          {event.start_date
                            ? event.start_date.split("T")[0]
                            : "Null"}
                        </p>
                      </div>

                      <div
                        className={`flex lg:flex-row flex-col lg:gap-2 items-center justify-between p-2
               border dark:border-white/20 border-black/60 rounded-md lg:text-left text-center`}
                      >
                        <h1
                          className="lg:text-[14px] text-[13px]
                    dark:text-white/50 text-black/60"
                        >
                          End Date
                        </h1>
                        <p>
                          {event.end_date
                            ? event.end_date.split("T")[0]
                            : "Null"}
                        </p>
                      </div>
                    </div>

                    <div className="grid lg:grid-cols-2 grid-cols-1 gap-2">
                      <div
                        className={`flex lg:flex-row flex-col lg:gap-2 items-center justify-between p-2
               border dark:border-white/20 border-black/60 rounded-md lg:text-left text-center`}
                      >
                        <h1
                          className="lg:text-[14px] text-[13px]
                    dark:text-white/50 text-black/60"
                        >
                          Guests Number
                        </h1>
                        <p>
                          {event.guests_number ? event.guests_number : "Null"}
                        </p>
                      </div>

                      <div
                        className={`flex lg:flex-row flex-col lg:gap-2 items-center justify-between p-2
               border dark:border-white/20 border-black/60 rounded-md lg:text-left text-center`}
                      >
                        <h1
                          className="lg:text-[14px] text-[13px]
                    dark:text-white/50 text-black/60"
                        >
                          Status
                        </h1>
                        <p>
                          {event.status
                            ? statusMap[event.status as keyof typeof statusMap]
                            : "Null"}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`flex lg:flex-row flex-col lg:gap-2 items-center justify-between p-2
               border dark:border-white/20 border-black/60 rounded-md lg:text-left text-center`}
                    >
                      <h1
                        className="lg:text-[14px] text-[13px]
                    dark:text-white/50 text-black/60"
                      >
                        Type Event
                      </h1>
                      <p>
                        {event.type
                          ? typeMap[event.type as keyof typeof typeMap]
                          : "Null"}
                      </p>
                    </div>

                    <div
                      className={`flex flex-col lg:gap-1 lg:items-start items-center justify-between p-2
               border dark:border-white/20 border-black/60 rounded-md lg:text-left text-center`}
                    >
                      <h1
                        className="lg:text-[14px] text-[13px]
                    dark:text-white/50 text-black/60"
                      >
                        Description
                      </h1>
                      <p>{event.description ? event.description : "Null"}</p>
                    </div>

                    {event.note !== "" && (
                      <div
                        className={`flex flex-col lg:gap-1 lg:items-start items-center justify-between p-2
               border dark:border-white/20 border-black/60 rounded-md lg:text-left text-center`}
                      >
                        <h1
                          className="lg:text-[14px] text-[13px]
                    dark:text-white/50 text-black/60"
                        >
                          Note
                        </h1>
                        <p>{event.note}</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </ModalBody>

              <ModalFooter
                className="relative flex lg:items-end lg:justify-end 
              justify-center items-center"
              >
                <Button
                  color="primary"
                  onPress={onClose}
                  className="dark:bg-white dark:text-black"
                >
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalViewEvent;
