"use client";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCreate2FA } from "@/hooks/use-create-2fa";
import { useVerify2Fa } from "@/hooks/use-verify-2fa";
import { useAppStore } from "@/store";
import { Button, Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  otp: z
    .string({ message: "OTP must be a string." })
    .min(1, { message: "OTP length must be at least 1 characters." }),
});

const QRScanForm: React.FC = () => {
  const { setIsModalQRShow, setIsEnabled, setIsRegistered, isRegistered } =
    useAppStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
    },
  });
  const { mutate: mutateVerify2Fa } = useVerify2Fa();
  const { mutate: mutateCreate2FA } = useCreate2FA();

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setTimeout(() => {
      mutateVerify2Fa(values.otp);
      setIsLoading(false);
    }, 2000);
  }

  const handleCloseClick = () => {
    setIsEnabled(false);
    setIsModalQRShow(false);
    mutateCreate2FA({ type: "cancel" });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col lg:gap-3 gap-2"
      >
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="dark:text-white text-black">
                OTP Code
              </FormLabel>

              <FormControl>
                <Input placeholder="OTP Code here..." {...field} />
              </FormControl>
              <FormDescription className="lg:text-left text-center">
                Please enter the OTP you received from the Google Authenticator
                app.
              </FormDescription>
              <FormMessage className="dark:text-red-400 text-red-500" />
            </FormItem>
          )}
        />

        <div className="flex lg:items-end lg:gap-2 items-center justify-center gap-1">
          <Button
            color="primary"
            className="dark:bg-white dark:text-black text-white"
            onPress={handleCloseClick}
          >
            Cancel
          </Button>

          {isLoading ? (
            <Button
              isLoading
              color="primary"
              className="dark:bg-white dark:text-black text-white"
            >
              Please wait...
            </Button>
          ) : (
            <Button
              color="primary"
              className="dark:bg-white dark:text-black text-white"
              type="submit"
            >
              Submit
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

export default QRScanForm;
