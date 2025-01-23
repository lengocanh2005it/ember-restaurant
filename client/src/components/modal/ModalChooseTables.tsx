"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { showSuccessToast, Table } from "@/utils";
import {
  Accordion,
  AccordionItem,
  Button,
  Checkbox,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import React, { Dispatch, SetStateAction, useState } from "react";

interface ModalChooseTablesProps {
  tables: Table[];
  original_tables: Table[];
  setTables: Dispatch<SetStateAction<Table[]>>;
  setSelectedKeys: Dispatch<SetStateAction<Set<string>>>;
  refetch: () => void;
}

const typeMap = {
  normal: "Normal",
  vip: "VIP",
};

const ModalChooseTables: React.FC<ModalChooseTablesProps> = ({
  tables,
  original_tables,
  setTables,
  setSelectedKeys,
  refetch,
}) => {
  const [checkedKeys, setCheckedKeys] = useState<Record<string, boolean>>({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSave, setIsSave] = useState<boolean>(false);

  const handleClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      refetch();
      onOpen();
      setIsLoading(false);
    }, 1800);
  };

  const handleTextboxChange = (tableId: string) => {
    setCheckedKeys((prevState) => {
      const currentState = prevState[tableId];

      return {
        ...prevState,
        [tableId]: !currentState,
      };
    });
  };

  const handleClose = () => {
    for (const key of Object.keys(checkedKeys)) {
      if (
        !original_tables.some((table) => table.id === key) &&
        checkedKeys[key]
      ) {
        setCheckedKeys((prevState) => ({
          ...prevState,
          [key]: false,
        }));
      }
    }

    onClose();
  };

  const handleClickChoose = () => {
    setIsSave(true);
    setTimeout(() => {
      showSuccessToast("Saving successfully!", "top-right", {
        backgroundColor: "#28a745",
        color: "#fff",
      });
      for (const table of tables) {
        if (
          checkedKeys[table.id] &&
          !original_tables.some(
            (original_table) => original_table.id === table.id
          )
        ) {
          setTables((prevState) => [...prevState, table]);
        } else if (
          original_tables.some(
            (original_table) => original_table.id === table.id
          ) &&
          !checkedKeys[table.id]
        ) {
          setTables((prevState) =>
            prevState.filter((item) => item.id !== table.id)
          );

          setSelectedKeys((prevState) => {
            const newKeys = Array.from(prevState).filter(
              (item) => item !== table.id
            );

            return new Set(newKeys);
          });
        }
      }
      onClose();
      setIsSave(false);
    }, 1000);
  };

  return (
    <>
      <Chip
        color="primary"
        className={`dark:bg-white dark:text-black text-white opacity-70 hover:opacity-100
                  duration-250 ease-in-out transition-opacity cursor-pointer
                  ${isLoading && "pointer-events-none select-none"}`}
        onClick={handleClick}
        startContent={
          isLoading ? (
            <div
              className="animate-spin dark:text-black text-white/70
         w-4 h-4"
            >
              <svg
                className="w-full h-full"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  strokeWidth="4"
                  className="opacity-25"
                />
                <path
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 000 8v4a8 8 0 01-8-8z"
                  className="opacity-75"
                />
              </svg>
            </div>
          ) : null
        }
      >
        {isLoading ? "Please wait..." : "Add new tables"}
      </Chip>

      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        placement="center"
        isDismissable={false}
        isKeyboardDismissDisabled={false}
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
        onOpenChange={handleClose}
      >
        <ModalContent className="dark:text-white text-black">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 lg:text-left text-center">
                New Tables
              </ModalHeader>

              <ModalBody>
                <ScrollArea className="max-h-[300px] rounded-md lg:p-4 p-2 flex flex-col gap-2">
                  <Accordion
                    className="flex flex-col lg:gap-2 gap-3"
                    selectionMode="multiple"
                    variant="splitted"
                  >
                    {tables.map((item) => (
                      <AccordionItem
                        key={item.id}
                        value={item.id}
                        title={
                          item.name +
                          " (" +
                          typeMap[item.type as keyof typeof typeMap] +
                          ")"
                        }
                        className="lg:px-3 px-2 shadow-none rounded-lg border
                         dark:border-white/20 border-black/20"
                      >
                        <Checkbox
                          onChange={() => handleTextboxChange(item.id)}
                          isSelected={checkedKeys[item.id]}
                        >
                          <div className="flex items-center gap-1">
                            <h1 className="lg:text-[15px] text-[14px] dark:text-white/70 text-black/70">
                              Price:
                            </h1>

                            <p>{item.price}$</p>
                          </div>

                          <div className="flex items-center gap-1">
                            <h1
                              className="lg:text-[15px] text-[14px] dark:text-white/70
                             text-black/70"
                            >
                              Capacity Number:
                            </h1>

                            <p>{item.capacity} Guests</p>
                          </div>

                          <div className="flex items-center gap-1">
                            <h1
                              className="lg:text-[15px] text-[14px] dark:text-white/70
                             text-black/70"
                            >
                              Note:
                            </h1>

                            <p className="max-w-full truncate">{item.note}</p>
                          </div>
                        </Checkbox>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </ScrollArea>
              </ModalBody>

              <ModalFooter
                className="relative flex md:justify-end md:items-end
              justify-center items-center"
              >
                <Button
                  color="primary"
                  className="dark:bg-white dark:text-black text-white"
                  onPress={handleClose}
                >
                  Close
                </Button>

                {isSave ? (
                  <>
                    <Button
                      isLoading
                      color="primary"
                      className="dark:bg-white dark:text-black text-white"
                    >
                      Saving...
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      color="primary"
                      className="dark:bg-white dark:text-black text-white"
                      onPress={handleClickChoose}
                    >
                      Save
                    </Button>
                  </>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalChooseTables;
