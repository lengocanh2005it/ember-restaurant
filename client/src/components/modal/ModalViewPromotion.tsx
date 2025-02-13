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
import { EyeIcon } from "lucide-react";
import { Promotion } from "@/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ModalViewPromotionProps {
  promotion: Promotion;
}

const ModalViewPromotion: React.FC<ModalViewPromotionProps> = ({
  promotion,
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const rows = [
    {
      key: 1,
      label: "",
      value: (
        <div className="grid md:grid-cols-2 grid-cols-1 gap-2">
          <div
            className="flex items-center justify-between gap-1 border
           dark:border-white/30 border-black/20 p-2 rounded-md"
          >
            <p className="dark:text-white/70 text-black/70">Start Date</p>
            <p>{promotion.start_date.split("T")[0]}</p>
          </div>

          <div
            className="flex items-center justify-between gap-1 
          border dark:border-white/30 border-black/20 p-2 rounded-md"
          >
            <p className="dark:text-white/70 text-black/70">End Date</p>
            <p>{promotion.end_date.split("T")[0]}</p>
          </div>
        </div>
      ),
      className: "",
    },
    {
      key: 3,
      label: "Title",
      value: promotion.title,
      className:
        "flex flex-col border dark:border-white/30 border-black/20 p-2 rounded-md",
    },
    {
      key: 4,
      label: "Code",
      value: promotion.code,
      className:
        "flex items-center justify-between gap-1 border dark:border-white/30 border-black/20 p-2 rounded-md",
    },
    {
      key: 7,
      label: "Discount",
      value:
        promotion.discount.type === "percentage"
          ? promotion.discount.value + "%"
          : promotion.discount.value + " USD",
      className:
        "flex items-center justify-between gap-1 border dark:border-white/30 border-black/20 p-2 rounded-md",
    },
    {
      key: 5,
      label: "Description",
      value: promotion.description,
      className:
        "flex flex-col gap-1 flex flex-col gap-1 border dark:border-white/30 border-black/20 p-2 rounded-md",
    },
    ...(promotion.note
      ? [
          {
            key: 6,
            label: "Note",
            value: promotion.note,
            className:
              "flex flex-col gap-1 flex flex-col gap-1 border dark:border-white/30 border-black/20 p-2 rounded-md",
          },
        ]
      : []),
  ];

  return (
    <>
      <Tooltip className="dark:bg-white text-black" content="View" showArrow>
        <EyeIcon
          onClick={onOpen}
          className="opacity-50 hover:opacity-100 
                duration-250 ease-in-out transition-opacity cursor-pointer select-none"
        />
      </Tooltip>

      <Modal
        backdrop="opaque"
        placement="center"
        size="lg"
        isOpen={isOpen}
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
                View Promotion
              </ModalHeader>

              <ModalBody>
                <ScrollArea className="h-[450px] lg:px-3 px-4">
                  <div className="flex flex-col gap-2">
                    {rows.map((row) => (
                      <div key={row.key} className={row.className}>
                        <p className="dark:text-white/70 text-black/70">
                          {row.label}
                        </p>

                        <p>{row.value}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </ModalBody>

              <ModalFooter className="relative flex lg:justify-end justify-center">
                <Button
                  color="primary"
                  className="dark:bg-white dark:text-black text-white"
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

export default ModalViewPromotion;
