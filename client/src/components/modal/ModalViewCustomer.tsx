import { EyeIcon } from "@/components/icons/EyeIcon";
import { Separator } from "@/components/ui/separator";
import { User } from "@/utils";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { BriefcaseIcon, MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import Image from "next/image";
import React from "react";

interface ModalViewCustomerProps {
  user: User;
}

const ModalViewCustomer: React.FC<ModalViewCustomerProps> = ({ user }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const profiles = [
    {
      key: 1,
      icon: (
        <BriefcaseIcon className="dark:text-white/60 text-black/60 lg:block hidden" />
      ),
      title: "Job",
      value: user.job ? user.job : "Job: Null",
    },
    {
      key: 2,
      icon: (
        <MailIcon className="dark:text-white/60 text-black/60 lg:block hidden" />
      ),
      title: "Email",
      value: user.email ? user.email : "Email: Null",
    },
    {
      key: 3,
      icon: (
        <PhoneIcon className="dark:text-white/60 text-black/60 lg:block hidden" />
      ),
      title: "Phone number",
      value: user.phone ? user.phone : "Phone number: Null",
    },
    {
      key: 4,
      icon: (
        <MapPinIcon className="dark:text-white/60 text-black/60 lg:block hidden" />
      ),
      title: "Address",
      value: user.address ? user.address : "Address: Null",
    },
  ];

  const totals = [
    {
      key: 1,
      title: "Total Orders",
      value: user.total_orders ? user.total_orders : 0,
    },
    {
      key: 2,
      title: "Total Reservations",
      value: user.total_reservations ? user.total_reservations : 0,
    },
    {
      key: 3,
      title: "Loyalty Points",
      value: user.loyalty_points ? user.loyalty_points : 0,
    },
  ];

  return (
    <>
      <Tooltip content="Details" className="dark:text-white text-black">
        <span
          className="text-lg text-default-400 cursor-pointer active:opacity-50"
          onClick={onOpen}
        >
          <EyeIcon />
        </span>
      </Tooltip>

      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        placement="center"
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
              <ModalHeader className="flex flex-col gap-1 text-center">
                Customer&apos;s Profile
              </ModalHeader>

              <ModalBody>
                <div className="flex flex-col lg:gap-2 gap-4">
                  <div
                    className="flex flex-col gap-2 
                  items-center justify-center"
                  >
                    <div
                      className="relative lg:w-[120px] lg:h-[120px] w-[80px] h-[80px]
                     rounded-full flex flex-col items-center justify-center"
                    >
                      {user && user.image && (
                        <Image
                          src={user.image}
                          alt="user"
                          sizes="(max-width:600px) 100vw, 50vw"
                          priority
                          fill
                          className="cursor-pointer select-none
                         rounded-full object-cover"
                        />
                      )}
                    </div>

                    <div
                      className="flex flex-col items-center 
                    justify-center"
                    >
                      <Tooltip
                        color="primary"
                        className="dark:text-black dark:bg-white text-white"
                        content={
                          "Username: " +
                          (user?.username ? user.username : "Null")
                        }
                      >
                        <h1 className="lg:text-xl text-center text-base font-medium">
                          {user.name ? user.name : user.username}
                        </h1>
                      </Tooltip>

                      <p
                        className="lg:text-base text-[14px] dark:text-white/70
                        text-black/70 text-center"
                      >
                        Loyalty Customer
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col lg:gap-2">
                    {profiles.map((profile) => (
                      <>
                        <div
                          key={profile.key}
                          className="flex items-center lg:justify-start
                           justify-center gap-2 opacity-60 
                          hover:opacity-100 ease-in-out
                           duration-300 transition-all cursor-pointer
                     hover:bg-default-200 p-2 rounded-md"
                        >
                          {profile.icon}

                          <Tooltip
                            content={profile.title}
                            className="dark:text-white text-black"
                          >
                            <p className="lg:text-left text-center">
                              {profile.value}
                            </p>
                          </Tooltip>
                        </div>

                        <Separator className="mx-2" />
                      </>
                    ))}
                  </div>

                  <div className="grid lg:grid-cols-3 grid-cols-1 lg:gap-2">
                    {totals.map((total) => (
                      <div
                        key={total.key}
                        className="flex flex-col items-center lg:gap-2 text-center text-nowrap"
                      >
                        <h1
                          className="lg:text-base text-[14px]
                         dark:text-white/70 text-black/60"
                        >
                          {total.title}
                        </h1>

                        <p className="lg:text-xl text-base dark:text-white text-black">
                          {total.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </ModalBody>

              <ModalFooter className="flex justify-center items-center">
                <Button
                  color="primary"
                  className="dark:bg-white dark:text-black"
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

export default ModalViewCustomer;
