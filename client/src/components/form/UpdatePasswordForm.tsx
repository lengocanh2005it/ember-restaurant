"use client";
import ModalConfirmUpdatePassword from "@/components/modal/ModalConfirmUpdatePassword";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button, Input, InputOtp } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const formSchema = z
  .object({
    password: z
      .string({ message: "Current password must be a string." })
      .min(1, { message: "Current password can't be empty." }),
    newPassword: z
      .string({ message: "New password must be a string." })
      .min(1, { message: "New password can't be empty." }),
    confirmNewPassword: z.string().optional(),
    otp: z
      .string({ message: "OTP must be a string." })
      .min(6, { message: "OTP length must be equal to 6 characters." }),
  })
  .superRefine(({ newPassword, confirmNewPassword, password }, ctx) => {
    if (newPassword !== confirmNewPassword) {
      ctx.addIssue({
        code: "custom",
        message: "The new password you re-entered does not match.",
        path: ["confirmNewPassword"],
      });
    }

    if (password === newPassword) {
      ctx.addIssue({
        code: "custom",
        message:
          "The new password must be different from the original password.",
        path: ["newPassword"],
      });
    }
  });

const UpdatePasswordForm: React.FC = () => {
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [isShowNewPassword, setIsShowNewPassword] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      newPassword: "",
      confirmNewPassword: "",
      otp: "",
    },
    shouldUnregister: true,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    setTimeout(() => {
      setIsOpen(true);
      setIsLoading(false);
    }, 2000);
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col lg:gap-3 gap-2 lg:w-1/2 w-full mx-auto border
         dark:border-white/20 shadow-custom lg:px-4 lg:py-3 px-3 py-2 rounded-xl"
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-white text-black">
                  Current Password
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Please enter your current password..."
                    {...field}
                    autoComplete="current-password"
                    type={isShowPassword ? "text" : "password"}
                    endContent={
                      isShowPassword ? (
                        <EyeIcon
                          onClick={() => setIsShowPassword(!isShowPassword)}
                          className="cursor-pointer"
                        />
                      ) : (
                        <EyeOffIcon
                          onClick={() => setIsShowPassword(!isShowPassword)}
                          className="cursor-pointer"
                        />
                      )
                    }
                  />
                </FormControl>
                <FormMessage className="dark:text-red-400 text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-white text-black">
                  New Password
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Please enter your new password..."
                    {...field}
                    type={isShowNewPassword ? "text" : "password"}
                    autoComplete="new-password"
                    endContent={
                      isShowNewPassword ? (
                        <EyeIcon
                          onClick={() =>
                            setIsShowNewPassword(!isShowNewPassword)
                          }
                          className="cursor-pointer"
                        />
                      ) : (
                        <EyeOffIcon
                          onClick={() =>
                            setIsShowNewPassword(!isShowNewPassword)
                          }
                          className="cursor-pointer"
                        />
                      )
                    }
                  />
                </FormControl>
                <FormMessage className="dark:text-red-400 text-red-500" />
                <FormDescription className="lg:text-left text-center">
                  Note: When changing your password, choose a strong and unique
                  one that you haven&apos;t used before to enhance security and
                  protect your account.
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmNewPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-white text-black">
                  Confirm New Password
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Please enter your current password..."
                    type="password"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="dark:text-red-400 text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem className="w-full flex-1 flex flex-col">
                <FormLabel className="dark:text-white text-black">
                  OTP Code
                </FormLabel>
                <FormControl className="flex flex-col items-center justify-center w-full">
                  <InputOtp length={6} {...field} />
                </FormControl>
                <FormMessage className="dark:text-red-400 text-red-500 text-center" />
                <FormDescription className="text-center">
                  Please enter the OTP from the Google Authenticator app that
                  you have linked.
                </FormDescription>
              </FormItem>
            )}
          />

          {isLoading ? (
            <Button
              isLoading
              className="w-fit mx-auto dark:bg-white dark:text-black text-white"
              color="primary"
            >
              Please wait...
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-fit mx-auto dark:bg-white dark:text-black text-white"
              color="primary"
            >
              Submit
            </Button>
          )}
        </form>
      </Form>

      {isOpen && (
        <ModalConfirmUpdatePassword
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          form={form}
        />
      )}
    </>
  );
};

export default UpdatePasswordForm;
