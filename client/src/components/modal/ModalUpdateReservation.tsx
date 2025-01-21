"use client";
import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Tooltip,
} from "@nextui-org/react";
import { SquarePenIcon } from "lucide-react";
import UpdateReservationForm from "@/components/form/UpdateReservationForm";
import { useQueryClient } from "@tanstack/react-query";

const ModalUpdateReservation: React.FC = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const query = useQueryClient();

  return (
    <>
      <Tooltip
        content="Update"
        className="dark:text-white text-black"
        showArrow
      >
        <SquarePenIcon
          className="opacity-50 hover:opacity-100 ease-in-out
           cursor-pointer duration-250 transition-opacity"
          onClick={() => {
            onOpen();
            query.removeQueries({
              queryKey: ["new_tables"],
            });
          }}
        />
      </Tooltip>

      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        placement="center"
        size="xl"
        onOpenChange={() => {
          onOpenChange();
          query.removeQueries({
            queryKey: ["new_tables"],
          });
        }}
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
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 lg:text-left text-center">
                Reservation Update
              </ModalHeader>

              <ModalBody>
                <UpdateReservationForm onClose={onClose} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalUpdateReservation;
