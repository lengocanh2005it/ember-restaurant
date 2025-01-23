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
  Chip,
} from "@heroui/react";
import { EyeIcon } from "lucide-react";
import { Area } from "@/utils/types";
import { usePathname, useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ModalViewAreaProps {
  area: Area;
}

const statusMap = {
  running: "Running",
  maintenance: "Maintenance",
};

const typeMap = {
  normal: "Normal",
  vip: "VIP",
};

const ModalViewArea: React.FC<ModalViewAreaProps> = ({ area }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();
  const pathname = usePathname();

  const rows = [
    { key: 1, title: "Name", value: area.name },
    { key: 2, title: "Capacity Number", value: area.capacity + " Guests" },
    { key: 3, title: "Operating Hours", value: area.operating_hours },
    {
      key: 4,
      title: "Status",
      value: statusMap[area.status as keyof typeof statusMap],
    },
    { key: 5, title: "Floor Number", value: area.floor_number },
    { key: 6, title: "Description", value: area.description },
    {
      key: 7,
      title: "Tables",
      value: (
        <ScrollArea className="lg:h-[30px] h-[50px] rounded-md flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {area.tables.map((table) => (
              <Chip
                key={table.id}
                color="primary"
                className="dark:bg-white dark:text-black text-white"
              >
                {table.name +
                  " (" +
                  typeMap[table.type as keyof typeof typeMap] +
                  ")"}
              </Chip>
            ))}
          </div>
        </ScrollArea>
      ),
    },
  ];

  const handleClick = (areaId: string) => {
    router.push(`${pathname}/details/?areaId=${areaId}&tables=true`);
  };

  return (
    <>
      <Tooltip content="View" className="dark:text-white text-black">
        <EyeIcon
          className="cursor-pointer opacity-70 hover:opacity-100 ease-in-out duration-250
              transition-opacity"
          onClick={onOpen}
        />
      </Tooltip>

      <Modal
        backdrop="opaque"
        isOpen={isOpen}
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
        onOpenChange={onOpenChange}
      >
        <ModalContent className="dark:text-white text-black">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 lg:text-left text-center">
                Area Details
              </ModalHeader>

              <ModalBody className="flex flex-col lg:gap-3 gap-2">
                {rows.map((row) => (
                  <div
                    key={row.key}
                    className={`flex flex-col p-1 px-2 
                  rounded-lg border dark:border-white/20 border-black/20
                  ${
                    row.key !== 7 &&
                    row.key !== 6 &&
                    "md:flex-row md:items-center md:justify-between"
                  }
                  ${row.key === 6 && "flex-col"}`}
                  >
                    <h1 className="lg:text-[15px] text-[14px] dark:text-white/70 text-black/70">
                      {row.title}
                    </h1>

                    {row.key !== 7 ? (
                      <p className="lg:text-base text-[15px] truncate break-words">
                        {row.value}
                      </p>
                    ) : (
                      <>{row.value}</>
                    )}
                  </div>
                ))}
              </ModalBody>

              <ModalFooter
                className="flex relative lg:justify-between lg:flex-row flex-col
               justify-center items-center"
              >
                <Chip
                  color="primary"
                  className="dark:bg-white dark:text-black text-white opacity-70 hover:opacity-100
                  duration-300 ease-in-out transition-opacity cursor-pointer"
                  onClick={() => handleClick(area.id)}
                >
                  See tables details
                </Chip>

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

export default ModalViewArea;
