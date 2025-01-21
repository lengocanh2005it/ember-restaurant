"use client";
import React, { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import MessageHeader from "@/components/MessageHeader";
import { User } from "@/utils/types";

interface MessageChatProps {
  userId: string;
}

const MessageChat: React.FC<MessageChatProps> = ({ userId }) => {
  const [customer, setCustomer] = useState<User | null>(null);
  const query = useQueryClient();
  const cachedData = query.getQueryData(["customer", userId]);

  useEffect(() => {
    setCustomer((cachedData as User)!);
  }, [cachedData]);

  return (
    <main className="relative w-full container mx-auto px-4 py-6 flex flex-col gap-2 text-base">
      {customer ? (
        <MessageHeader customer={customer} />
      ) : (
        <h1 className="lg:text-xl text-base uppercase font-bold">
          Customer Not Found.
        </h1>
      )}
    </main>
  );
};

export default MessageChat;
