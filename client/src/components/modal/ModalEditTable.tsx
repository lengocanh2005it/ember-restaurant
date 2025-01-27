import EditTableForm from "@/components/form/EditTableForm";
import { Table } from "@/utils";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import { SquarePenIcon } from "lucide-react";
import React from "react";

interface ModalEditTableProps {
  table: Table;
  areaId: string;
}

const ModalEditTable: React.FC<ModalEditTableProps> = ({ table, areaId }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Tooltip content="Edit" className="dark:text-white text-black">
        <SquarePenIcon
          className="cursor-pointer opacity-70 hover:opacity-100 duration-300 ease-in-out
                transition-opacity"
          onClick={onOpen}
        />
      </Tooltip>

      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        placement="center"
        isDismissable={false}
        isKeyboardDismissDisabled={false}
        size="lg"
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
        onOpenChange={onOpenChange}
      >
        <ModalContent className="dark:text-white text-black">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 lg:text-left text-center">
                Edit Table
              </ModalHeader>

              <ModalBody>
                <EditTableForm
                  table={table}
                  onClose={onClose}
                  areaId={areaId}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalEditTable;
