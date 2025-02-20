"use client";
import { UpdatePasswordDto } from "@/api/users/utils/types";
import { formSchema } from "@/components/form/UpdatePasswordForm";
import { useUpdatePassword } from "@/hooks/use-update-password";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import React, { Dispatch, SetStateAction, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

interface ModalConfirmUpdatePasswordProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

const ModalConfirmUpdatePassword: React.FC<ModalConfirmUpdatePasswordProps> = ({
  isOpen,
  setIsOpen,
  form,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { mutate: mutateUpdatePassword } = useUpdatePassword();

  const handleUpdateClick = () => {
    setIsLoading(true);

    const data: UpdatePasswordDto = {
      password: form.getValues("password"),
      newPassword: form.getValues("newPassword"),
      otp: form.getValues("otp"),
    };

    setTimeout(() => {
      setIsOpen(false);
      mutateUpdatePassword(data);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <Modal
      backdrop="opaque"
      placement="center"
      size="lg"
      isDismissable={false}
      isKeyboardDismissDisabled={false}
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
      onOpenChange={() => setIsOpen(false)}
    >
      <ModalContent className="dark:text-white text-black">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 lg:text-left text-center">
              Update Password Confirm
            </ModalHeader>

            <ModalBody className="relative flex flex-col lg:text-left text-center">
              <h1 className="lg:text-xl text-[16px] font-bold">
                Are you sure you want to change the password?
              </h1>

              <p className="lg:text-[15px] text-[14px] dark:text-white/80 text-black/80">
                This action cannot be{" "}
                <span className="font-medium dark:text-red-400 text-red-500">
                  undone
                </span>
                . After a successful password change, you will need to log in
                again to apply the new password.
              </p>
            </ModalBody>

            <ModalFooter className="flex lg:justify-end justify-center items-center">
              <Button
                color="primary"
                onPress={() => setIsOpen(false)}
                className="dark:bg-white dark:text-black text-white"
              >
                Cancel
              </Button>

              {isLoading ? (
                <Button
                  isLoading
                  className="dark:bg-white dark:text-black text-white"
                  color="primary"
                >
                  Please wait...
                </Button>
              ) : (
                <Button color="danger" onPress={handleUpdateClick}>
                  Change
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalConfirmUpdatePassword;
