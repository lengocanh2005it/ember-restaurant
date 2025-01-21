"use client";
import { useUpdateReviews } from "@/hooks/use-update-review";
import { Review } from "@/utils";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import React, { useState } from "react";

interface ModalConfirmShowReviewsProps {
  reviews: Review[];
}

const ModalConfirmShowReviews: React.FC<ModalConfirmShowReviewsProps> = ({
  reviews,
}) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { mutate: mutateUpdateReviews } = useUpdateReviews();

  const handleClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onClose();
    }, 2500);
  };

  return (
    <>
      <Button
        onPress={onOpen}
        color="primary"
        className="dark:bg-white dark:text-black"
      >
        Save
      </Button>

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
              <ModalHeader className="flex flex-col gap-1">Confirm</ModalHeader>

              <ModalBody className="relative flex flex-col gap-1">
                <h1 className="lg:text-base text-[15px] font-bold">
                  Do you want to display all reviews on the home page?
                </h1>

                <p className="lg:text-[14px] text-[12px] dark:text-white/60 text-black/60">
                  If you choose &apos;Yes&apos;, all of these reviews will be
                  displayed on the restaurant&apos;s home page.
                </p>
              </ModalBody>

              <ModalFooter>
                <Button
                  color="primary"
                  className="dark:bg-white dark:text-black"
                  onPress={onClose}
                >
                  No
                </Button>

                {isLoading ? (
                  <>
                    <Button
                      isLoading
                      color="primary"
                      className="dark:bg-white dark:text-black"
                    >
                      Please wait...
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      color="primary"
                      className="dark:bg-white dark:text-black text-white"
                      onPress={handleClick}
                    >
                      Yes
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

export default ModalConfirmShowReviews;
