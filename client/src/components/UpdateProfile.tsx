"use client";
import { UpdateProfileOfUserDto } from "@/api/users/utils/types";
import ButtonLoading from "@/components/buttons/ButtonLoading";
import ModalOTP from "@/components/modal/ModalOTP";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useUpdateEmail } from "@/hooks/use-update-email";
import useUpdateProfile from "@/hooks/use-update-profile";
import { useAppStore, useUserStore } from "@/store";
import { isValidEmail, showSuccessToast } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Tooltip,
} from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { CircleCheckIcon, PencilIcon, XIcon } from "lucide-react";
import Image from "next/image";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { debounce } from "lodash";

const profiles = [
  { id: 1, name: "name" },
  { id: 2, name: "job" },
  { id: 3, name: "email" },
  { id: 4, name: "phone" },
  { id: 5, name: "address" },
  { id: 6, name: "image" },
];

const imageSchema = z
  .instanceof(File)
  .refine((file) => file.type.startsWith("image/"), {
    message: "Invalid images",
  });

const formSchema = z.object({
  name: z.string().min(1).max(255),
  job: z.string().min(1).max(255),
  email: z.string().email().max(255),
  phone: z.string().min(1).max(255),
  address: z.string().min(1).max(255),
  image: imageSchema.optional(),
});

const UpdateProfile: React.FC = () => {
  const query = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [isShow, setIsShow] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isChange, setIsChange] = useState<boolean>(false);
  const [originalEmail, setOriginalEmail] = useState<string>("");
  const [newProfile, setNewProfile] = useState<UpdateProfileOfUserDto | null>(
    null
  );
  const { user } = useUserStore();
  const { otp, isExistedEmail, setIsExistedEmail } = useAppStore();

  useEffect(() => {
    setOriginalEmail(user?.email!);

    return () => {
      setIsExistedEmail(true);
    };
  }, [user?.email, setIsExistedEmail]);

  const isVerifyEmail = query.getQueryData(["isVerifyEmail"]) as boolean;
  const isVerified = query.getQueryData(["isVerified"]) as boolean;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
      job: user?.job || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
    },
  });

  const email = useWatch({
    control: form.control,
    name: "email",
  });

  const { mutate: profileMutate } = useUpdateProfile();
  const { mutate: mutateUpdateEmail, isPending } = useUpdateEmail();

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (!file.type.startsWith("image/")) {
        setImageError("Invalid image format.");
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        setImageError("Image size exceeds 2MB.");
        return;
      }

      setImageError(null);
      form.setValue("image", file);
    }
  };

  const handleChange = debounce((value: string) => {
    if (isValidEmail(value) && value !== originalEmail) {
      mutateUpdateEmail({
        email: value,
        userId: user?.id!,
        options: "check",
      });
    }
    setIsLoading(false);
  }, 2000);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { name, job, address, phone, image, email } = values;

    if (imageError) return;

    const data: UpdateProfileOfUserDto = {
      userId: user?.id!,
      name,
      job,
      image,
      address,
      email,
      phone,
    };

    if (originalEmail === email) {
      profileMutate(data);
      setIsOpen(false);
      return;
    }

    setIsChange(true);

    setTimeout(() => {
      setIsChange(false);

      if (!isVerified) {
        mutateUpdateEmail({
          userId: user?.id!,
          email,
          options: "verify",
        });

        setIsShow(true);

        showSuccessToast(
          "Please check your email to receive the verification code!",
          "bottom-right",
          {
            backgroundColor: "#28a745",
            color: "#fff",
          }
        );

        setNewProfile(data as UpdateProfileOfUserDto);
      }

      if (isVerified) {
        profileMutate(data);
        query.setQueryData(["isVerified"], false);
        setIsOpen(false);
      }
    }, 2200);
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        className="p-4 w-fit lg:mx-0 mx-auto border rounded-xl shadow-custom dark:border-white/20"
        onClick={() => setIsOpen(true)}
      >
        <Tooltip
          content="Update Profile"
          className="dark:text-white text-black"
        >
          <PencilIcon className="cursor-pointer" />
        </Tooltip>
      </div>

      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        isDismissable={false}
        isKeyboardDismissDisabled={false}
        placement="center"
        size="lg"
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
        <ModalContent className="dark:text-white text-black">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 lg:text-left text-center">
                <h1>Update Profile</h1>

                <p
                  className="dark:text-white/70 text-black/70 lg:text-[14px] text-[13px]
                font-medium"
                >
                  Make changes to your profile here. Click save when you&apos;re
                  done.
                </p>
              </ModalHeader>
              <ModalBody>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col lg:gap-4 gap-2"
                  >
                    <div className="flex flex-col md:gap-3 gap-2">
                      {profiles.map((profileItem) => (
                        <FormField
                          key={profileItem.id}
                          control={form.control}
                          name={
                            (profileItem.name as "name") ||
                            "address" ||
                            "job" ||
                            "phone" ||
                            "email"
                          }
                          render={({ field }) => (
                            <FormItem
                              className="flex md:flex-row flex-col md:items-center
                       md:justify-between md:gap-2"
                            >
                              <FormLabel className="dark:text-white text-black md:w-[20%] w-full">
                                {profileItem.name.charAt(0).toUpperCase() +
                                  profileItem.name.slice(1)}
                              </FormLabel>

                              <FormControl
                                aria-label={profileItem.name}
                                className={`${
                                  profileItem.name === "image" && "w-full"
                                }`}
                              >
                                {profileItem.name === "image" ? (
                                  <div className="flex flex-col gap-1">
                                    <div
                                      className="flex md:flex-row-reverse
                               flex-col-reverse md:items-center md:justify-end gap-2"
                                    >
                                      {user && user.image && (
                                        <Image
                                          src={user.image}
                                          alt=""
                                          sizes="(max-width:600px) 100vw, 50vw"
                                          priority
                                          className="object-cover rounded-full lg:block hidden"
                                          width={50}
                                          height={50}
                                        />
                                      )}

                                      <Input
                                        type="file"
                                        variant="faded"
                                        onChange={handleImageChange}
                                      />
                                    </div>

                                    {imageError && (
                                      <p className="text-red-500">
                                        {imageError}
                                      </p>
                                    )}
                                  </div>
                                ) : (
                                  <>
                                    <Input
                                      aria-label="input"
                                      aria-labelledby="input"
                                      className="col-span-3"
                                      label={
                                        profileItem.name
                                          .charAt(0)
                                          .toUpperCase() +
                                        profileItem.name.slice(1)
                                      }
                                      variant="faded"
                                      {...field}
                                      onChange={(e) => {
                                        field.onChange(e);
                                        if (profileItem.id === 3) {
                                          setIsLoading(true);
                                          handleChange(e.target.value);
                                        }
                                      }}
                                      endContent={
                                        profileItem.id === 3 && isLoading ? (
                                          <div
                                            className="animate-spin dark:text-white text-black/70
                                           w-4 h-4"
                                          >
                                            <svg
                                              className="w-full h-full"
                                              viewBox="0 0 24 24"
                                              fill="none"
                                              xmlns="http://www.w3.org/2000/svg"
                                            >
                                              <circle
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                                className="opacity-25"
                                              />
                                              <path
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v4a4 4 0 000 8v4a8 8 0 01-8-8z"
                                                className="opacity-75"
                                              />
                                            </svg>
                                          </div>
                                        ) : profileItem.id === 3 &&
                                          isVerified === true ? (
                                          <Tooltip
                                            content="Verified successfully!"
                                            className="dark:text-white text-black"
                                          >
                                            <CircleCheckIcon
                                              className="text-green-600 
                                            cursor-pointer select-none"
                                            />
                                          </Tooltip>
                                        ) : isExistedEmail &&
                                          profileItem.id === 3 &&
                                          email !== originalEmail &&
                                          isValidEmail(email) ? (
                                          <Tooltip
                                            content="This email has been used by another user!"
                                            className="dark:text-white text-black"
                                          >
                                            <XIcon className="text-red-500 cursor-pointer select-none" />
                                          </Tooltip>
                                        ) : !isExistedEmail &&
                                          profileItem.id === 3 &&
                                          email !== originalEmail &&
                                          isValidEmail(email) ? (
                                          <Tooltip
                                            content="New valid email!"
                                            className="dark:text-white text-black"
                                          >
                                            <CircleCheckIcon
                                              className="text-green-600
                                             cursor-pointer select-none"
                                            />
                                          </Tooltip>
                                        ) : null
                                      }
                                    />
                                  </>
                                )}
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>

                    {isChange === false ? (
                      <Button
                        type="submit"
                        color="primary"
                        className={`dark:bg-white dark:text-black w-fit mx-auto px-4
                          ${
                            isExistedEmail &&
                            email !== originalEmail &&
                            isValidEmail(email) &&
                            "hidden"
                          }`}
                      >
                        Save Profile
                      </Button>
                    ) : (
                      <ButtonLoading content="Loading..." />
                    )}
                  </form>
                </Form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      {isShow && (
        <ModalOTP
          isOpen={isShow}
          setIsOpen={setIsShow}
          newProfile={newProfile as UpdateProfileOfUserDto}
          key={"otp"}
        />
      )}
    </div>
  );
};

export default UpdateProfile;
