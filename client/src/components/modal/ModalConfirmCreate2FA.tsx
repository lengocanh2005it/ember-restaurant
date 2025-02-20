"use client";
import { Confirm2FADto } from "@/api/users/utils/types";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { useConfirm2FA } from "@/hooks/use-confirm-2fa";
import { useSendOTP } from "@/hooks/use-send-otp";
import { useAppStore, useUserStore } from "@/store";
import { showErrorToast } from "@/utils";
import {
  Button,
  Chip,
  Input,
  InputOtp,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Tooltip,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  email: z
    .string({ message: "Email must be a string." })
    .email({ message: "Invalid email." }),
});

const ModalConfirmCreate2FA: React.FC = () => {
  const { otp, setOTP, isRegistered, setIsRegistered } = useAppStore();
  const { user } = useUserStore();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });
  const [isClick, setIsClick] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(120);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const { mutate: mutateConfirm2FA } = useConfirm2FA();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const { mutate: mutateSendOTP } = useSendOTP();

  useEffect(() => {
    if (user && user.email) {
      setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    if (countdown === 0 || !isClick) {
      if (countdown === 0) {
        setOTP("");
        setIsDisabled(false);
        setIsClick(false);
      }
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, isClick, setOTP]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    setEmail(values.email);
  }

  const handleSubmitClick = () => {
    if (!otp || otp.length !== 6) {
      showErrorToast("Please enter the full OTP.", "bottom-right", {
        backgroundColor: "#dc3545",
        color: "#fff",
      });
      return;
    }

    setIsLoading(true);

    const data: Confirm2FADto = {
      otp,
      email: user?.email ? user.email : form.getValues("email"),
    };

    setTimeout(() => {
      mutateConfirm2FA(data);
      setIsLoading(false);
    }, 2000);
  };

  const handleSendOTPClick = () => {
    setOTP("");
    mutateSendOTP(email);
    setCountdown(120);
    setIsDisabled(true);
    setIsClick(true);
  };

  return (
    <>
      <Modal
        backdrop="opaque"
        placement="center"
        size="lg"
        isDismissable={false}
        isKeyboardDismissDisabled={false}
        isOpen={isRegistered}
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
          setIsRegistered(false);
          setOTP("");
        }}
      >
        <ModalContent className="dark:text-white text-black">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 lg:text-left text-center">
                Verify Some Information
              </ModalHeader>

              <ModalBody className="flex flex-col lg:py-4 py-2">
                <p className="text-center dark:text-white/80 text-black/80">
                  We need to verify some information before proceeding with the
                  next steps to enable 2FA for you, ensuring that you are the
                  rightful owner of this account.
                </p>

                <Separator className="px-2 dark:bg-white/50 bg-black/50" />

                {!email ? (
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="flex flex-col lg:gap-3 gap-2"
                    >
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="dark:text-white text-black">
                              Email
                            </FormLabel>

                            <FormControl>
                              <Input placeholder="shadcn" {...field} />
                            </FormControl>

                            <FormDescription className="lg:text-left text-center">
                              Because your account is not linked to any email,
                              please update your email so we can send the OTP
                              verification code to you.
                            </FormDescription>

                            <FormMessage className="dark:text-red-400 text-red-500" />
                          </FormItem>
                        )}
                      />

                      <div className="flex items-center justify-center lg:gap-3 gap-2">
                        <Button
                          color="primary"
                          className="dark:bg-white dark:text-black text-white"
                          onPress={() => setIsRegistered(false)}
                        >
                          Cancel
                        </Button>

                        <Button
                          type="submit"
                          color="primary"
                          className="dark:bg-white dark:text-black text-white"
                        >
                          Submit
                        </Button>
                      </div>
                    </form>
                  </Form>
                ) : (
                  <div className="flex flex-col lg:gap-2 gap-1 items-center justify-center text-center">
                    <div className="flex flex-col lg:gap-2 gap-1 items-center justify-center text-center">
                      <p className="dark:text-white/80 text-black/80">
                        Your account is linked to an email &quot;
                        <span className="font-medium italic dark:text-white text-black">
                          {email}
                        </span>
                        &quot;. Please click the &quot;Send OTP&quot; button
                        below to receive the verification code from us via this
                        email.
                      </p>

                      {!isClick ? (
                        <Chip
                          color="primary"
                          className="dark:bg-white dark:text-black text-white cursor-pointer
                      opacity-80 hover:opacity-100 ease-in-out transition-opacity duration-300"
                          onClick={handleSendOTPClick}
                        >
                          Send OTP
                        </Chip>
                      ) : (
                        <Tooltip
                          className="dark:bg-white dark:text-black text-white bg-black"
                          content={`You need to wait ${countdown}s before requesting OTP again.`}
                        >
                          <Chip
                            color="primary"
                            className="dark:bg-white dark:text-black text-white cursor-default opacity-30"
                          >
                            Send OTP
                          </Chip>
                        </Tooltip>
                      )}
                    </div>

                    {isClick && (
                      <div className="flex flex-col items-center justify-center lg:gap-2 gap-1">
                        <InputOtp
                          length={6}
                          value={otp}
                          onValueChange={(value) => setOTP(value)}
                          aria-label="otp"
                          aria-labelledby="otp"
                        />

                        <div className="flex flex-col items-center justify-center text-center">
                          <p className="dark:text-white/80 text-black/80">
                            Please enter the OTP you received via email.
                          </p>

                          <p
                            className="lg:text-[13px] text-[12px] dark:text-white/70 text-black/70
                          italic"
                          >
                            The OTP is only valid for 2 minutes. Please enter it
                            quickly!
                          </p>
                        </div>

                        {isLoading ? (
                          <Button
                            color="primary"
                            className="dark:bg-white dark:text-black text-white"
                            isLoading
                          >
                            Please wait...
                          </Button>
                        ) : (
                          <Button
                            color="primary"
                            className="dark:bg-white dark:text-black text-white"
                            onPress={handleSubmitClick}
                          >
                            Submit
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalConfirmCreate2FA;
