import RequestDetails from "@/components/RequestDetails";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Request, User } from "@/utils";
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

interface ModalViewRequestProps {
  request: Request;
  user: User;
}

const ModalViewRequest: React.FC<ModalViewRequestProps> = ({ request }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Tooltip content="View" className="dark:text-white text-black">
        <EyeIcon
          className="cursor-pointer opacity-60 hover:opacity-100 duration-250 ease-in-out
              transition-opacity"
          onClick={onOpen}
        />
      </Tooltip>

      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        placement="center"
        size="xl"
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
              <ModalHeader className="lg:text-xl text-[20px] lg:text-left text-center flex justify-center">
                Request Details
              </ModalHeader>

              <ModalBody>
                <ScrollArea className="max-h-[400px] rounded-md p-4 flex flex-col gap-2">
                  <RequestDetails request={request} method="view" />
                </ScrollArea>
              </ModalBody>

              <ModalFooter className="relative flex justify-center items-center">
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

export default ModalViewRequest;
