"use client";
import { UpdateUserDto } from "@/api/users/utils/types";
import { EditIcon } from "@/components/icons/EditIcon";
import ModalConfirmUpdateProfile from "@/components/modal/ModalConfirmUpdateProfile";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { User } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import {
  AwardIcon,
  BriefcaseIcon,
  HandPlatterIcon,
  MailIcon,
  MapPinIcon,
  PhoneCallIcon,
  ShoppingCartIcon,
  SignatureIcon,
} from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface ModalUpdateProfileProps {
  user: User;
}

const formSchema = z.object({
  name: z
    .string({ message: "Name can't be empty." })
    .min(2, { message: "Name must be at least 2 characters." })
    .max(50, {
      message: "Name can't be exceeded 50 characters.",
    }),
  job: z
    .string({ message: "Job can't be empty." })
    .min(2, { message: "Job must be at least 2 characters." })
    .max(50, {
      message: "Job can't be exceeded 50 characters.",
    }),
  address: z
    .string({ message: "Address can't be empty" })
    .min(5, { message: "Address must be at least 5 characters." })
    .max(255, {
      message: "Address can't be exceeded 255 characters.",
    }),
  total_orders: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        return parseFloat(val);
      }
      return val;
    },
    z.number({ message: "Total orders must be a number." }).nonnegative({
      message: "Total orders must be a non-negative number.",
    })
  ),
  total_reservations: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        return parseFloat(val);
      }
      return val;
    },
    z.number({ message: "Total reservations must be a number." }).nonnegative({
      message: "Total reservations must a non-negative number.",
    })
  ),
  loyalty_points: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        return parseFloat(val);
      }
      return val;
    },
    z.number({ message: "Loyalty point must be a number." }).nonnegative({
      message: "Loyalty point must be a non-negative number.",
    })
  ),
});

const ModalUpdateProfile: React.FC<ModalUpdateProfileProps> = ({ user }) => {
  const [profileCustomerPayload, setProfileCustomerPayload] =
    useState<UpdateUserDto>({
      userId: user.id,
      name: user.name,
      job: user.job,
      email: user.email,
      phone: user.phone,
      address: user.address,
      loyalty_points: user.loyalty_points,
      total_reservations: user.total_reservations,
      total_orders: user.total_orders,
    });
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      job: user?.job ? user.job : "",
      address: user?.address ? user.address : "",
      name: user?.name ? user.name : "",
      total_reservations: user?.total_reservations
        ? user?.total_reservations
        : 0,
      total_orders: user?.total_orders ? user.total_orders : 0,
      loyalty_points: user?.loyalty_points ? user.loyalty_points : 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsConfirmModalOpen(true);
    const {
      name,
      address,
      loyalty_points,
      total_reservations,
      total_orders,
      job,
    } = values;

    const data: UpdateUserDto = {
      userId: user.id,
      name,
      email: user.email,
      phone: user.phone,
      address,
      loyalty_points,
      total_reservations,
      total_orders,
      job,
    };
    setProfileCustomerPayload(data);
  }

  return (
    <>
      <Tooltip content="Edit profile" className="dark:text-white text-black">
        <span
          className="text-lg text-default-400 cursor-pointer active:opacity-50"
          onClick={onOpen}
        >
          <EditIcon />
        </span>
      </Tooltip>

      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        size="xl"
        placement="center"
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
                Update Customer&apos;s Profile
              </ModalHeader>

              <ModalBody>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col lg:gap-4 gap-2"
                  >
                    <div className="grid lg:grid-cols-2 grid-cols-1 lg:gap-3 gap-1">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="dark:text-white text-black">
                              Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                startContent={<SignatureIcon />}
                                {...field}
                                placeholder="user123"
                                aria-labelledby="username"
                              />
                            </FormControl>
                            <FormMessage className="dark:text-red-400 text-red-500" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="job"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="dark:text-white text-black">
                              Job
                            </FormLabel>
                            <FormControl>
                              <Input
                                startContent={<BriefcaseIcon />}
                                {...field}
                                placeholder="Fullstack Developer"
                                aria-label="job"
                                aria-labelledby="job"
                              />
                            </FormControl>
                            <FormMessage className="dark:text-red-400 text-red-500" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-white text-black">
                            Address
                          </FormLabel>
                          <FormControl>
                            <Input
                              startContent={<MapPinIcon />}
                              {...field}
                              placeholder="England"
                              aria-label="address"
                              aria-labelledby="address"
                            />
                          </FormControl>
                          <FormMessage className="dark:text-red-400 text-red-500" />
                        </FormItem>
                      )}
                    />

                    <div className="grid lg:grid-cols-3 grid-cols-1 gap-4">
                      <FormField
                        control={form.control}
                        name="total_orders"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="dark:text-white text-black">
                              Total Orders
                            </FormLabel>
                            <FormControl>
                              <Input
                                startContent={<ShoppingCartIcon />}
                                {...field}
                                value={String(field.value)}
                                placeholder="10"
                                aria-label="total_orders"
                                aria-labelledby="total_orders"
                              />
                            </FormControl>
                            <FormMessage className="dark:text-red-400 text-red-500" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="total_reservations"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="dark:text-white text-black">
                              Total Reservations
                            </FormLabel>

                            <FormControl>
                              <Input
                                {...field}
                                startContent={<HandPlatterIcon />}
                                value={String(field.value)}
                                placeholder="10"
                                aria-label="total_reservations"
                                aria-labelledby="total_reservations"
                              />
                            </FormControl>
                            <FormMessage className="dark:text-red-400 text-red-500" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="loyalty_points"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="dark:text-white text-black">
                              Loyalty Points
                            </FormLabel>

                            <FormControl>
                              <Input
                                startContent={<AwardIcon />}
                                {...field}
                                value={String(field.value)}
                                placeholder="10"
                                aria-label="loyalty_points"
                                aria-labelledby="loyalty_points"
                              />
                            </FormControl>
                            <FormMessage className="dark:text-red-400 text-red-500" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex items-center md:justify-end justify-center md:gap-3 gap-2">
                      <Button
                        color="primary"
                        className="dark:bg-white dark:text-black"
                        onPress={onClose}
                      >
                        Cancel
                      </Button>

                      <Button
                        color="primary"
                        type="submit"
                        className="dark:bg-white dark:text-black"
                      >
                        Update
                      </Button>

                      {isConfirmModalOpen && (
                        <ModalConfirmUpdateProfile
                          closeModal={onClose}
                          userUpdatePayload={profileCustomerPayload}
                          isOpen={isConfirmModalOpen}
                          onClose={() => setIsConfirmModalOpen(false)}
                        />
                      )}
                    </div>
                  </form>
                </Form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalUpdateProfile;
