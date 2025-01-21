import React, { useMemo, useState } from "react";
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
import { Review } from "@/utils";
import { format } from "date-fns";

interface ModalViewFeedbackReservationsProps {
  reviews: Review[];
}

const ModalViewFeedbackReservations: React.FC<
  ModalViewFeedbackReservationsProps
> = ({ reviews }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [page, setPage] = useState<number>(1);
  const initialPages = 3;

  const totalPages = useMemo(() => {
    return Math.ceil(reviews.length / initialPages) ?? 0;
  }, [reviews]);

  const items = useMemo(() => {
    const start = (page - 1) * initialPages;
    const end = start + initialPages;

    return reviews?.slice(start, end) ?? [];
  }, [page, reviews]);

  return (
    <>
      <Chip
        className="dark:bg-white dark:text-black
                opacity-60 hover:opacity-100 ease-in-out transition-opacity
                duration-250 cursor-pointer"
        color="primary"
        onClick={onOpen}
      >
        View Feedback
      </Chip>

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
              <ModalHeader className="flex flex-col gap-1 lg:text-left text-center">
                Reservation Feedback
              </ModalHeader>

              <ModalBody className="flex flex-col gap-3">
                {reviews.length !== 0 ? (
                  <>
                    <div className="relative flex flex-col gap-2">
                      {items.map((item) => (
                        <div key={item.id} className="flex flex-col">
                          <p
                            className="lg:text-base text-[14px] dark:text-white/70
                          text-black/70"
                          >
                            {format(item.date, "dd/MM/yyyy")}
                          </p>

                          <h1
                            className="lg:text-base text-[14px] max-w-[400px]
                           truncate"
                          >
                            {item.comment}
                          </h1>
                        </div>
                      ))}
                    </div>

                    <div className="flex lg:justify-start lg:items-start justify-center items-start">
                      <Pagination
                        initialPage={page}
                        total={totalPages}
                        onChange={(page) => setPage(page)}
                        showControls
                        showShadow
                        isCompact
                        classNames={{
                          cursor: "dark:bg-white dark:text-black",
                        }}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <h1 className="text-center font-semibold lg:text-xl text-base">
                      Empty Feedback.
                    </h1>
                  </>
                )}
              </ModalBody>

              <ModalFooter className="flex lg:justify-end lg:items-end justify-center items-center">
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

export default ModalViewFeedbackReservations;
