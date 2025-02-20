"use client";
import QRScanForm from "@/components/form/QRScanForm";
import { useCreate2FA } from "@/hooks/use-create-2fa";
import { useAppStore } from "@/store";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import React from "react";

const ModalGoogleAuthenticator: React.FC = () => {
  const { isModalQRShow, setIsModalQRShow, setIsEnabled } = useAppStore();
  const query = useQueryClient();
  const { mutate: mutateCreate2FA } = useCreate2FA();

  const data = query.getQueryData(["google-authenticator"]) as string;

  const handleCloseClick = () => {
    mutateCreate2FA({ type: "cancel" });
    setIsModalQRShow(false);
    setIsEnabled(false);
  };

  return (
    <Modal
      backdrop="opaque"
      placement="center"
      size="lg"
      isDismissable={false}
      isKeyboardDismissDisabled={false}
      isOpen={isModalQRShow}
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
      onOpenChange={handleCloseClick}
    >
      <ModalContent className="dark:text-white text-black">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 md:text-left text-center">
              QR Scan
            </ModalHeader>

            <ModalBody>
              {data && (
                <div className="flex items-center justify-center flex-col text-center lg:gap-3 gap-2">
                  <div
                    className="md:w-[200px] md:h-[200px] h-[150px] w-[150px] relative flex flex-col
                items-center justify-center"
                  >
                    <Image
                      src={data}
                      alt=""
                      fill
                      className="object-cover cursor-pointer"
                    />
                  </div>

                  <p className="dark:text-white/80 text-black/80 md:text-[14px] text-[13px]">
                    Please use the &quot;Google Authenticator&quot; app to scan
                    this QR code. If you haven&apos;t installed the app yet, you
                    can download it from
                    <a
                      href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline ml-1 mr-1"
                    >
                      Google Play
                    </a>
                    or
                    <a
                      href="https://apps.apple.com/us/app/google-authenticator/id388497605"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline ml-1"
                    >
                      App Store
                    </a>
                    .
                  </p>
                </div>
              )}

              <QRScanForm />
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalGoogleAuthenticator;
