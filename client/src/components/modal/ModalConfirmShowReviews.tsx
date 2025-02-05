"use client";
import { UpdateFeaturedReviewDto } from "@/api/reviews/utils/types";
import { useUpdateFeaturedReviews } from "@/hooks/use-update-featured-review";
import {
  Button,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Selection,
  useDisclosure,
} from "@heroui/react";
import { HomeIcon } from "lucide-react";
import React, { Dispatch, SetStateAction, useState } from "react";

interface ModalConfirmShowReviewsProps {
  reviewsId: string[];
  setReviewsId: Dispatch<SetStateAction<Selection>>;
  userId: string;
}

const ModalConfirmShowReviews: React.FC<ModalConfirmShowReviewsProps> = ({
  reviewsId,
  setReviewsId,
  userId,
}) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { mutate: mutateUpdateFeaturedReviews } =
    useUpdateFeaturedReviews(userId);

  const handleClick = () => {
    setIsLoading(true);
    const data: UpdateFeaturedReviewDto = {
      reviewIds: reviewsId,
      userId,
    };
    setTimeout(() => {
      setIsLoading(false);
      mutateUpdateFeaturedReviews(data);
      setReviewsId(new Set());
      onClose();
    }, 2500);
  };

  return (
    <>
      <Chip
        onClick={onOpen}
        color="primary"
        startContent={<HomeIcon size={20} />}
        className="dark:bg-white dark:text-black cursor-pointer transition-opacity px-2 
        opacity-70 hover:opacity-100 duration-250"
      >
        Display in Home Page
      </Chip>

      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        placement="center"
        size="xl"
        isDismissable={false}
        isKeyboardDismissDisabled={false}
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
                Confirmation
              </ModalHeader>

              <ModalBody className="relative flex flex-col gap-1">
                <h1 className="lg:text-base text-[15px] font-bold uppercase lg:text-left text-center">
                  Display all reviews on the home page?
                </h1>

                <p
                  className="lg:text-[15px] text-[13px] dark:text-white/60 text-black/60 
                lg:text-left text-center"
                >
                  If you choose &apos;Yes&apos;, all of these reviews will be
                  displayed on the restaurant&apos;s home page.
                </p>
              </ModalBody>

              <ModalFooter className="relative flex lg:items-end lg:justify-end items-center justify-center">
                <Button
                  color="primary"
                  className="dark:bg-white dark:text-black"
                  onPress={onClose}
                >
                  Cancel
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

export default ModalConfirmShowReviews;
