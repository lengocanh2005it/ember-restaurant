"use client";
import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Tooltip,
} from "@heroui/react";
import { MessageSquareQuote } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import RequestDetails from "@/components/RequestDetails";
import { Request } from "@/utils";

interface ModalViewResponseProps {
  request: Request;
}

const ModalViewResponse: React.FC<ModalViewResponseProps> = ({ request }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Tooltip
        content="View Response Of Request"
        className="dark:bg-white text-black"
      >
        <MessageSquareQuote
          className="cursor-pointer opacity-60 hover:opacity-100 transition-opacity duration-250
        ease-in-out"
          onClick={onOpen}
        />
      </Tooltip>

      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        size="xl"
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
              <ModalHeader
                className="text-center relative flex flex-col items-center
               justify-center w-fit mx-auto"
              >
                View Request Details
              </ModalHeader>

              <ModalBody>
                <ScrollArea className="max-h-[400px] rounded-md p-4 flex flex-col gap-2">
                  <RequestDetails request={request} method="view" />
                </ScrollArea>
              </ModalBody>

              <ModalFooter className="relative flex flex-col items-center justify-center">
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

export default ModalViewResponse;
