"use client";
import { format } from "date-fns";
import React, { useEffect } from "react";
import Image from "next/image";
import { Request } from "@/utils";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Tooltip,
} from "@heroui/react";
import { TrashIcon } from "lucide-react";
import { useDeleteTicketMessage } from "@/hooks/use-delete-ticket-messages";
import { useAppStore, useUserStore } from "@/store";

interface RequestDetailsProps {
  request: Request;
  method: "update" | "view";
}

const RequestDetails: React.FC<RequestDetailsProps> = ({ request, method }) => {
  const { user } = useUserStore();
  const { mutate: mutateDeleteTicketMessage } = useDeleteTicketMessage(
    user?.id!
  );
  const { isAdmin } = useAppStore();

  return (
    <>
      {request?.ticket_messages &&
        request?.ticket_messages?.length !== 0 &&
        request?.ticket_messages?.map((tm) => {
          if (tm?.sender_type === "user") {
            return (
              <div
                key={tm?.id}
                className="flex sm:items-center gap-2 flex-col sm:flex-row sm:mb-2"
              >
                <div
                  className="md:w-[50px] md:h-[50px] w-[40px] h-[40px] relative rounded-full select-none 
          cursor-pointer"
                >
                  <Tooltip
                    content={
                      (tm?.sender?.name
                        ? tm.sender.name
                        : tm?.sender?.username) +
                      (tm?.sender?.id === user?.id ? " (You)" : " (Customer)")
                    }
                    placement="left-start"
                    className="dark:text-black dark:bg-white text-white bg-black"
                  >
                    {tm.sender && tm.sender.image && (
                      <Image
                        src={tm.sender.image}
                        alt="avatar"
                        priority
                        sizes="(max-width: 600px) 100vw, 50vw"
                        fill
                        className="rounded-full select-none"
                      />
                    )}
                  </Tooltip>
                </div>

                <div
                  className="px-4 py-1 border dark:border-white/20 cursor-pointer
    border-black/20 hover:dark:border-white/30 hover:border-black/40 w-fit
    ease-in-out transition-opacity duration-250 rounded-3xl max-w-full break-words sm:mb-0 mb-2"
                >
                  {tm.deletedAt ? (
                    <Tooltip
                      content={format(tm?.createdAt, "EEEE, dd/MM/yyyy HH:mm")}
                      className="dark:text-black dark:bg-white text-white bg-black"
                    >
                      <p
                        className={`lg:text-[14px] text-[13px] italic dark:text-white/50
             text-black/50 select-none`}
                      >
                        This message has been removed.
                      </p>
                    </Tooltip>
                  ) : method === "update" && !isAdmin ? (
                    <Dropdown>
                      <DropdownTrigger>
                        <div>
                          <Tooltip
                            content={format(
                              tm?.createdAt,
                              "EEEE, dd/MM/yyyy HH:mm"
                            )}
                            className="dark:text-black dark:bg-white text-white bg-black"
                          >
                            <p className={`lg:text-[14px] text-[13px]`}>
                              {tm?.message}
                            </p>
                          </Tooltip>
                        </div>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="options">
                        <DropdownItem
                          key="delete"
                          endContent={<TrashIcon />}
                          onPress={() => mutateDeleteTicketMessage(tm.id)}
                        >
                          Delete
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  ) : (
                    <Tooltip
                      content={format(tm?.createdAt, "EEEE, dd/MM/yyyy HH:mm")}
                      className="dark:text-black dark:bg-white text-white bg-black"
                    >
                      <p className="lg:text-[14px] text-[13px]">
                        {tm?.message}
                      </p>
                    </Tooltip>
                  )}
                </div>
              </div>
            );
          } else if (tm?.sender_type === "admin") {
            return (
              <div
                key={tm?.id}
                className="flex sm:items-center sm:justify-start justify-end items-end gap-2 flex-col
                 sm:flex-row-reverse sm:mb-2"
              >
                <div
                  className="md:w-[50px] md:h-[50px] w-[40px] h-[40px] relative rounded-full 
                  select-none cursor-pointer"
                >
                  <Tooltip
                    content={
                      (tm?.sender?.name
                        ? tm.sender.name
                        : tm?.sender?.username) +
                      (tm?.sender?.id === user?.id ? " (You)" : " (Admin)")
                    }
                    placement="right-end"
                    className="dark:text-black dark:bg-white text-white bg-black"
                  >
                    {tm.sender && tm.sender.image && (
                      <Image
                        src={tm.sender.image}
                        alt="avatar"
                        priority
                        sizes="(max-width: 600px) 100vw, 50vw"
                        fill
                        className="rounded-full select-none"
                      />
                    )}
                  </Tooltip>
                </div>

                <div
                  className="px-4 py-1 border dark:border-white/20 cursor-pointer
border-black/20 hover:dark:border-white/30 hover:border-black/40
ease-in-out transition-opacity duration-250 rounded-3xl w-fit break-words sm:mb-0 mb-2"
                >
                  {tm.deletedAt ? (
                    <Tooltip
                      content={format(tm?.createdAt, "EEEE, dd/MM/yyyy HH:mm")}
                      className="dark:text-black dark:bg-white text-white bg-black"
                    >
                      <p
                        className={`lg:text-[14px] text-[13px] italic dark:text-white/50
             text-black/50 select-none`}
                      >
                        This message has been removed.
                      </p>
                    </Tooltip>
                  ) : method === "update" && isAdmin ? (
                    <Dropdown>
                      <DropdownTrigger>
                        <div>
                          <Tooltip
                            content={format(
                              tm?.createdAt,
                              "EEEE, dd/MM/yyyy HH:mm"
                            )}
                            className="dark:text-black dark:bg-white text-white bg-black"
                          >
                            <p className={`lg:text-[14px] text-[13px]`}>
                              {tm?.message}
                            </p>
                          </Tooltip>
                        </div>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="options">
                        <DropdownItem
                          key="delete"
                          endContent={<TrashIcon />}
                          onPress={() => mutateDeleteTicketMessage(tm.id)}
                        >
                          Delete
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  ) : (
                    <Tooltip
                      content={format(tm?.createdAt, "EEEE, dd/MM/yyyy HH:mm")}
                      className="dark:text-black dark:bg-white text-white bg-black"
                    >
                      <p className="lg:text-[14px] text-[13px]">
                        {tm?.message}
                      </p>
                    </Tooltip>
                  )}
                </div>
              </div>
            );
          }
        })}
    </>
  );
};

export default RequestDetails;
