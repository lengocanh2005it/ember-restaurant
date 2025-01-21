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
  CardBody,
  Card,
  Chip,
} from "@nextui-org/react";
import { EyeIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Product } from "@/utils";

interface ModalViewDishProps {
  dish: Product;
}

const ModalViewDish: React.FC<ModalViewDishProps> = ({ dish }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const router = useRouter();
  const pathname = usePathname();

  const handleClick = () => {
    router.push(`${pathname}/dishes/feedback/?id=${dish.id}`);
  };

  const rows = [
    { key: 1, title: "Name", value: dish.name },
    { key: 2, title: "Price", value: dish.price + " $" },
    { key: 3, title: "Ingredients", value: dish.ingredients },
    { key: 4, title: "Ratings Number", value: dish.average_rating + "⭐" },
    { key: 5, title: "Description", value: dish.description },
  ];

  return (
    <>
      <EyeIcon
        className="cursor-pointer opacity-80 hover:opacity-100 
         duration-250 ease-in-out transition-opacity"
        onClick={onOpen}
      />

      <Modal
        backdrop="opaque"
        placement="center"
        isOpen={isOpen}
        size="lg"
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
                View Details
              </ModalHeader>

              <ModalBody>
                {rows.map((row) => (
                  <div
                    key={row.key}
                    className={`flex ${
                      row.key === 3 || row.key === 5
                        ? "flex-col items-start justify-start"
                        : "lg:flex-row lg:items-center lg:justify-between flex-col"
                    } lg:gap-2 p-1 border dark:border-white/20 border-black/10 rounded-lg px-2`}
                  >
                    <h1 className="dark:text-white/80 text-black/70">
                      {row.title}
                    </h1>

                    <p>{row.value}</p>
                  </div>
                ))}
              </ModalBody>

              <ModalFooter className="flex lg:flex-row flex-col items-center lg:justify-between">
                <Chip
                  color="primary"
                  className="dark:bg-white dark:text-black cursor-pointer opacity-60 hover:opacity-100
                  duration-250 ease-in-out transition-opacity"
                  onClick={handleClick}
                >
                  View Feedback
                </Chip>

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

export default ModalViewDish;
