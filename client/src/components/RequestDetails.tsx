import { format } from "date-fns";
import React from "react";
import { Tooltip } from "@heroui/react";
import Image from "next/image";
import { Request } from "@/utils";

interface RequestDetailsProps {
  request: Request;
}

const RequestDetails: React.FC<RequestDetailsProps> = ({ request }) => {
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
                      tm?.sender?.name ? tm?.sender?.name : tm?.sender?.username
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
                  <Tooltip
                    content={format(tm?.createdAt, "EEEE, dd/MM/yyyy HH:mm")}
                    className="dark:text-black dark:bg-white text-white bg-black"
                  >
                    {tm?.message}
                  </Tooltip>
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
                      tm?.sender?.name ? tm?.sender?.name : tm.sender?.username
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
                  <Tooltip
                    content={format(tm?.createdAt, "EEEE, dd/MM/yyyy HH:mm")}
                    className="dark:text-black dark:bg-white text-white bg-black"
                  >
                    {tm?.message}
                  </Tooltip>
                </div>
              </div>
            );
          }
        })}
    </>
  );
};

export default RequestDetails;
