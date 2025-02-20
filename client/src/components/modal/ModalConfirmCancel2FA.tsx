"use client";
import React, { Dispatch, SetStateAction } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { useAppStore } from "@/store";
import { useCreate2FA } from "@/hooks/use-create-2fa";

interface ModalConfirmCancel2FAProps {
  isShow: boolean;
  setIsShow: Dispatch<SetStateAction<boolean>>;
}

const ModalConfirmCancel2FA: React.FC<ModalConfirmCancel2FAProps> = ({
  isShow,
  setIsShow,
}) => {
  const { setIsEnabled } = useAppStore();
  const { mutate: mutateCreate2FA } = useCreate2FA();

  const handleDisabledClick = () => {
    mutateCreate2FA({ type: "cancel" });
    setIsEnabled(false);
    setIsShow(false);
  };

  return (
    <>
      <Modal
        backdrop="opaque"
        placement="center"
        size="lg"
        isOpen={isShow}
        isKeyboardDismissDisabled={false}
        isDismissable={false}
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
        onOpenChange={() => setIsShow(false)}
      >
        <ModalContent className="dark:text-white text-black">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 lg:text-left text-center">
                Cancel 2FA Confirm
              </ModalHeader>

              <ModalBody className="relative flex flex-col lg:text-left text-center">
                <h1 className="lg:text-xl text-[16px] font-bold">
                  Do you want to disable 2FA?
                </h1>

                <p className="lg:text-[15px] text-[14px] dark:text-white/80 text-black/80">
                  If you click &quot;Disable&quot;, two-factor authentication
                  will be turned off, and your account will no longer have this
                  extra layer of security.
                </p>
              </ModalBody>

              <ModalFooter className="flex lg:items-end lg:justify-end justify-center items-center">
                <Button
                  color="primary"
                  className="dark:bg-white dark:text-black text-white"
                  onPress={() => setIsShow(false)}
                >
                  Close
                </Button>

                <Button
                  color="primary"
                  onPress={handleDisabledClick}
                  className="dark:bg-white dark:text-black text-white"
                >
                  Disable
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalConfirmCancel2FA;
