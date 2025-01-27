"use client";
import { UpdateProfileOfUserDto } from "@/api/users/utils/types";
import { useUpdateEmail } from "@/hooks/use-update-email";
import { useVerifyEmail } from "@/hooks/use-verify-email";
import { useAppStore } from "@/store";
import { showSuccessToast } from "@/utils";
import {
  Button,
  InputOtp,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

interface ModalOTPProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  newProfile: UpdateProfileOfUserDto;
}

const ModalOTP: React.FC<ModalOTPProps> = ({
  isOpen,
  setIsOpen,
  newProfile,
}) => {
  const query = useQueryClient();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [countdown, setCountdown] = useState(120);
  const [isDisabled, setIsDisabled] = useState(true);
  const { otp, setOTP, setIsExistedEmail } = useAppStore();
  const { mutate: mutateUpdateEmail } = useUpdateEmail();
  const { mutate: mutateVerifyEmail } = useVerifyEmail();

  const isVerified = query.getQueryData(["isVerified"]) as boolean;

  useEffect(() => {
    if (countdown === 0) {
      setIsDisabled(false);
      return;
    }

    if (isVerified) {
      setOTP("");
      setIsOpen(false);
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, setIsOpen, isVerified, setOTP]);

  const handleResend = () => {
    mutateUpdateEmail({
      userId: newProfile.userId,
      email: newProfile.email,
      options: "verify",
    });

    showSuccessToast(
      "We have resent the OTP to your email. Please check and enter the code.",
      "bottom-right",
      {
        backgroundColor: "#28a745",
        color: "#fff",
      }
    );

    setCountdown(120);

    setIsDisabled(true);
  };

  const handleClickSubmit = () => {
    setIsLoading(true);

    setTimeout(() => {
      mutateVerifyEmail({
        newEmail: newProfile.email,
        verificationCode: otp,
      });

      setIsLoading(false);
    }, 2500);
  };

  const handleClickCancel = () => {
    setIsOpen(false);
    setOTP("");
  };

  return (
    <>
      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        size="lg"
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
        onOpenChange={() => {
          setIsOpen(false);
        }}
      >
        <ModalContent
          onClick={(e) => e.stopPropagation()}
          className="dark:text-white text-black"
        >
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 lg:text-left text-center">
                Verification Code
              </ModalHeader>

              <ModalBody className="lg:text-left text-center">
                <p>
                  We have sent a verification code to your email. Please enter
                  the code within 2 minutes. If you do not receive the email,
                  you can request a resend.
                </p>

                <div className="flex items-center justify-center">
                  <InputOtp
                    length={6}
                    value={otp}
                    onValueChange={(value) => setOTP(value)}
                    aria-label="otp"
                    aria-labelledby="otp"
                  />
                </div>
              </ModalBody>

              <ModalFooter className="flex items-center lg:gap-1 gap-2 flex-row justify-center">
                <Button
                  onPress={handleClickCancel}
                  color="primary"
                  className="dark:bg-white dark:text-black w-fit"
                >
                  Cancel
                </Button>

                <Button
                  color="primary"
                  onPress={handleResend}
                  className={`${
                    isDisabled
                      ? `dark:bg-gray-300 bg-gray-400 dark:text-black 
                      pointer-events-none select-none opacity-60`
                      : "dark:text-black dark:bg-white text-white opacity-100"
                  } w-fit`}
                >
                  {isDisabled && <span className="text-base">{countdown}</span>}{" "}
                  Resend OTP
                </Button>
              </ModalFooter>

              {otp.length === 6 &&
                (isLoading ? (
                  <>
                    <Button
                      isLoading
                      color="primary"
                      className="dark:bg-white dark:text-black w-fit mx-auto"
                    >
                      Please wait...
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onPress={handleClickSubmit}
                      color="primary"
                      className="
            dark:bg-white dark:text-black w-fit mx-auto"
                    >
                      Submit
                    </Button>
                  </>
                ))}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalOTP;
