"use client";
import ModalConfirmCancel2FA from "@/components/modal/ModalConfirmCancel2FA";
import ModalConfirmCreate2FA from "@/components/modal/ModalConfirmCreate2FA";
import ModalGoogleAuthenticator from "@/components/modal/ModalGoogleAuthenticator";
import { useAppStore, useUserStore } from "@/store";
import { Accordion, AccordionItem, Chip, Switch, Tooltip } from "@heroui/react";
import { LockIcon, UserCheckIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const SettingsPage: React.FC = () => {
  const { user } = useUserStore();
  const {
    isModalQRShow,
    setIsEnabled,
    isEnabled,
    isRegistered,
    setIsRegistered,
  } = useAppStore();
  const [isShow, setIsShow] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleSwitchChange = async () => {
    if (isEnabled) {
      setIsShow(true);
    } else {
      setIsRegistered(true);
    }
  };

  useEffect(() => {
    if (user && user.two_factor_enabled) {
      setIsEnabled(true);
    } else {
      setIsEnabled(false);
    }
  }, [setIsEnabled, user]);

  const handleUpdateClick = () => {
    router.push(`${pathname}/update-password`);
  };

  return (
    <main className="w-full h-fit container p-4 flex flex-col lg:gap-6 gap-4 md:py-4">
      <div
        className="flex flex-col relative lg:justify-start justify-center lg:text-left
   text-center lg:px-2"
      >
        <h1 className="lg:text-2xl text-xl font-bold">Settings Page</h1>

        <p className="lg:text-base text-[14px] dark:text-white/70 text-black/70">
          Update your password to keep your account secure and up to date.
        </p>
      </div>

      <Accordion>
        <AccordionItem
          key="1"
          aria-label="Two-Factor Authentication (2FA)"
          title="Two-Factor Authentication (2FA)"
          startContent={<UserCheckIcon />}
        >
          <div className="flex md:flex-row flex-col md:gap-0 gap-2 md:justify-between overflow-x-hidden">
            <p className="lg:text-[15px] text-[14px] dark:text-white/60 text-black/60">
              Add an extra layer of security to your account by enabling 2FA.
              You&apos;ll need to verify your identity with a second factor,
              such as a code sent to your phone or app.
            </p>

            <Switch
              color="success"
              isSelected={isEnabled}
              onChange={handleSwitchChange}
            />
          </div>
        </AccordionItem>

        <AccordionItem
          key="2"
          aria-label="Update Password"
          title="Update Password"
          startContent={<LockIcon />}
        >
          <div className="flex md:flex-row flex-col md:justify-between overflow-x-hidden">
            <p className="lg:text-[15px] text-[14px] dark:text-white/60 text-black/60">
              Update your password to keep your account secure and up to date.
            </p>

            {user?.two_factor_enabled ? (
              <Chip
                color="primary"
                className="dark:bg-white dark:text-black text-white cursor-pointer opacity-80
              hover:opacity-100 ease-in-out transition-opacity duration-300"
                onClick={handleUpdateClick}
              >
                Go to Update
              </Chip>
            ) : (
              <Tooltip
                content="Please enable 2FA to update your password!"
                className="dark:text-black dark:bg-white text-white bg-black"
                placement="left-start"
              >
                <Chip
                  color="primary"
                  className="dark:bg-white dark:text-black text-white opacity-80
                  select-none"
                >
                  Go to Update
                </Chip>
              </Tooltip>
            )}
          </div>
        </AccordionItem>
      </Accordion>

      {isModalQRShow && <ModalGoogleAuthenticator />}

      {isShow && (
        <ModalConfirmCancel2FA isShow={isShow} setIsShow={setIsShow} />
      )}

      {isRegistered && <ModalConfirmCreate2FA />}
    </main>
  );
};

export default SettingsPage;
