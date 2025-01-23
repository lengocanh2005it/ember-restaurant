"use client";
import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { useUpdateProfileCustomer } from "@/hooks/use-update-profile-user";
import { UpdateProfileOfUserDto } from "@/api/users/utils/types";

interface ModalConfirmUpdateProfileProps {
  isOpen: boolean;
  onClose: () => void;
  userUpdatePayload: UpdateProfileOfUserDto;
  closeModal: () => void;
}

const ModalConfirmUpdateProfile: React.FC<ModalConfirmUpdateProfileProps> = ({
  isOpen,
  onClose,
  userUpdatePayload,
  closeModal,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { mutate: mutateUpdateProfileCustomer } = useUpdateProfileCustomer();

  const handleUpdate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onClose();
      closeModal();
      mutateUpdateProfileCustomer(userUpdatePayload);
    }, 2500);
    setTimeout(() => {
      closeModal();
    }, 3100);
  };

  return (
    <>
      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        onClose={onClose}
        size="lg"
        placement="center"
        className="border dark:border-white/20 border-black/20"
      >
        <ModalContent className="dark:text-white text-black">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Confirm Update Profile
              </ModalHeader>

              <ModalBody>
                <div className="flex flex-col lg:gap-2 gap-1">
                  <h1 className="lg:text-[16px] text-[14px] font-bold">
                    Do you want to change this customer&apos;s profile?
                  </h1>

                  <p className="lg:text-[13px] text-[12px] dark:text-white/70 text-black/50">
                    If you change, this customer&apos;s profile will be changed
                    in the restaurant&apos;s databases.
                  </p>
                </div>
              </ModalBody>

              <ModalFooter>
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
                      Please wait
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      color="danger"
                      className="dark:bg-white dark:text-black"
                      onPress={handleUpdate}
                    >
                      Submit
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

export default ModalConfirmUpdateProfile;
