import React from "react";
import { Chip, ChipProps } from "@nextui-org/react";
import Image from "next/image";
import { User } from "@/utils";

interface MessageHeaderProps {
  customer: User;
}

const statusColorProps: Record<string, ChipProps["color"]> = {
  active: "success",
  offline: "default",
};

const MessageHeader: React.FC<MessageHeaderProps> = ({ customer }) => {
  return (
    <div className="relative flex items-center justify-between gap-4 text-base">
      <div className="relative flex items-center gap-4">
        <div className="relative w-[50px] h-[50px] rounded-full cursor-pointer">
          {customer.image && (
            <Image
              src={customer.image}
              alt="customer"
              priority
              sizes="(max-width: 600px) 100vw, 50vw"
              fill
              className="rounded-full relative cursor-pointer"
            />
          )}
        </div>

        <div className="relative flex flex-col gap-2 lg:text-base text-[14px]">
          <h1 className="lg:text-xl text-base uppercase font-bold">
            {customer?.name ? customer.name : customer.username}
          </h1>

          <Chip
            color={statusColorProps["offline"]}
            variant="dot"
            className="border-none text-default-600"
          >
            Offline
          </Chip>
        </div>
      </div>
    </div>
  );
};

export default MessageHeader;
