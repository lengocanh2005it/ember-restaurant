"use client";
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button, Card, CardBody, Input, Tooltip } from "@heroui/react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useResetPassword } from "@/hooks/use-reset-password";
import { EyeIcon, EyeOff, EyeOffIcon, LockIcon } from "lucide-react";
import { ResetPasswordDto } from "@/api/reset-password/utils/types";

interface ResetPasswordFormProps {
  token: string;
}

const formSchema = z
  .object({
    password: z
      .string({ message: "Please enter this field." })
      .min(2, { message: "Password must be at least 2 characters long." })
      .max(255, {
        message: "Password can't be more than 255 characters long.",
      }),
    confirmPassword: z.string({ message: "Please enter this field." }),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Password did not match.",
        path: ["confirmPassword"],
      });
    }
  });

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ token }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isHidePassword, setIsHidePassword] = useState<boolean>(false);

  const { mutate: mutateResetPassword } = useResetPassword();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleClick = () => {
    setIsHidePassword(!isHidePassword);
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const data: ResetPasswordDto = {
      token,
      newPassword: values.password,
    };
    setTimeout(() => {
      setIsLoading(false);
      mutateResetPassword(data);
      form.reset({
        password: "",
        confirmPassword: "",
      });
    }, 3000);
  }

  return (
    <Card className="lg:w-[500px] w-[300px] mx-auto bg-primary text-white border border-white/30">
      <CardBody className="p-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-2 flex flex-col gap-2 justify-center"
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white lg:text-base text-[14px]">
                    New Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type={isHidePassword ? "text" : "password"}
                      isRequired
                      startContent={
                        <LockIcon className="text-black dark:text-white" />
                      }
                      endContent={
                        <Tooltip
                          content={
                            isHidePassword ? "Hide Password" : "Show Password"
                          }
                          className="text-black"
                        >
                          {isHidePassword ? (
                            <EyeIcon
                              className="cursor-pointer"
                              onClick={handleClick}
                            />
                          ) : (
                            <EyeOffIcon
                              className="cursor-pointer"
                              onClick={handleClick}
                            />
                          )}
                        </Tooltip>
                      }
                      placeholder="Your new password..."
                      {...field}
                      className="text-black dark:text-white"
                    />
                  </FormControl>
                  <FormDescription className="text-white/80">
                    This is your new password.
                  </FormDescription>
                  <FormMessage className="dark:text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white lg:text-base text-[14px]">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      startContent={
                        <LockIcon className="text-black dark:text-white" />
                      }
                      endContent={
                        isHidePassword ? (
                          <EyeIcon className="cursor-pointer" />
                        ) : (
                          <EyeOff className="cursor-pointer" />
                        )
                      }
                      placeholder="Please confirm your new password..."
                      type={isHidePassword ? "text" : "password"}
                      className="text-black dark:text-white"
                      isRequired
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="dark:text-red-400" />
                </FormItem>
              )}
            />

            {isLoading ? (
              <>
                <Button isLoading className="w-fit mx-auto">
                  Loading...
                </Button>
              </>
            ) : (
              <>
                <Button type="submit" className="w-fit mx-auto font-bold">
                  Submit
                </Button>
              </>
            )}
          </form>
        </Form>
      </CardBody>
    </Card>
  );
};

export default ResetPasswordForm;
