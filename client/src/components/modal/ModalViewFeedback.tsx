"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Chip,
  Pagination,
} from "@nextui-org/react";
import { useQueryClient } from "@tanstack/react-query";
import { Separator } from "@/components/ui/separator";
import { User } from "@/utils";

interface ModalViewFeedbackProps {
  feedbacks: { comment: string; id: string; date: string }[];
}

const ModalViewFeedback: React.FC<ModalViewFeedbackProps> = ({ feedbacks }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [customer, setCustomer] = useState<User | null>(null);
  const [page, setPage] = useState<number>(1);
  const initialPages = 3;

  const totalPages = useMemo(() => {
    return Math.ceil(feedbacks.length / initialPages) ?? 0;
  }, [feedbacks]);

  const items = useMemo(() => {
    const start = (page - 1) * initialPages;
    const end = start + initialPages;

    return feedbacks?.slice(start, end) ?? [];
  }, [feedbacks, page]);

  const query = useQueryClient();

  const cachedData = query.getQueryData(["customer"]);

  useEffect(() => {
    if (cachedData) {
      setCustomer(cachedData as User);
    }
  }, [cachedData]);

  return (
    <>
      {feedbacks.length !== 0 && (
        <Chip
          className="dark:bg-white dark:text-black
            cursor-pointer opacity-60 hover:opacity-100 duration-250 ease-in-out
             transition-opacity"
          color="primary"
          onClick={onOpen}
        >
          View Feedback
        </Chip>
      )}

      <Modal
        backdrop="opaque"
        placement="center"
        size="xl"
        isOpen={isOpen}
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
              <ModalHeader className="flex flex-col gap-1">
                Feedback
              </ModalHeader>

              <ModalBody>
                <>
                  {items.map((item) => {
                    return (
                      <div key={item.id} className="flex flex-col gap-1">
                        <div className="flex flex-col">
                          <p className="dark:text-white/50 text-black/70">
                            {item.date.split("T")[0]}
                          </p>
                          <p className="lg:text-[15px] text-[14px] truncate max-w-[500px]">
                            {item.comment}
                          </p>
                        </div>

                        <Separator className="mx-2" />
                      </div>
                    );
                  })}

                  <Pagination
                    initialPage={page}
                    total={totalPages}
                    onChange={(page) => setPage(page)}
                    showControls
                    showShadow
                    isCompact
                    classNames={{
                      cursor:
                        "dark:bg-white dark:text-black bg-black text-white",
                    }}
                  />
                </>
              </ModalBody>

              <ModalFooter>
                <Button
                  color="primary"
                  className="dark:bg-white dark:text-black"
                  onPress={onClose}
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

export default ModalViewFeedback;
