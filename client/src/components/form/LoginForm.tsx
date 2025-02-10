"use client";
import ButtonLoginOthers from "@/components/buttons/ButtonLoginOthers";
import ModalResetPassword from "@/components/modal/ModalResetPassword";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/hooks/use-login";
import { Button, Checkbox, Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { EyeIcon, EyeOffIcon, LockIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  username: z
    .string({ message: "Please fill this field." })
    .min(1, { message: "Username can't be empty." })
    .max(50, { message: "Username can't be more than 50 characters long." }),

  password: z
    .string({ message: "Please fill this field." })
    .min(1, { message: "Password can't be empty." })
    .max(255, { message: "Password can't be more than 255 characters long." }),
});

const LoginForm: React.FC = () => {
  const [isShow, setIsShow] = React.useState<boolean>(false);
  const { mutate: mutateLogin } = useLogin();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isChecked, setIsChecked] = React.useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleClick = () => {
    setIsShow(!isShow);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    setTimeout(async () => {
      mutateLogin(values);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <>
      <Form {...form}>
        <motion.form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-3 w-full h-full lg:px-3 px-2"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: {
              delay: 0.6,
              duration: 0.7,
              ease: "easeInOut",
            },
          }}
        >
          <div className="grid grid-cols-1 gap-2">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className="text-white dark:text-white"
                    htmlFor="username"
                  >
                    Username
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center relative">
                      <Input
                        startContent={
                          <UserIcon className="text-black dark:text-white" />
                        }
                        id="username"
                        color="default"
                        placeholder="Enter your username"
                        className="w-full text-black text-[14px] dark:text-white"
                        autoComplete=""
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="dark:text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className="text-white dark:text-white"
                    htmlFor="password"
                  >
                    Password
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center relative">
                      <Input
                        startContent={
                          <LockIcon className="text-black dark:text-white" />
                        }
                        id="password"
                        color="default"
                        placeholder="Enter your password"
                        type={isShow ? "text" : "password"}
                        className="w-full text-black dark:text-white text-[14px]"
                        autoComplete=""
                        endContent={
                          !isShow ? (
                            <>
                              <EyeOffIcon
                                className="text-black dark:text-white cursor-pointer opacity-60
                           hover:opacity-100 ease-in-out transition-opacity"
                                onClick={handleClick}
                              />
                            </>
                          ) : (
                            <>
                              <EyeIcon
                                className="text-black dark:text-white cursor-pointer opacity-60
                           hover:opacity-100 ease-in-out transition-opacity"
                                onClick={handleClick}
                              />
                            </>
                          )
                        }
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="dark:text-red-400" />
                </FormItem>
              )}
            />

            <FormItem className="flex md:justify-between md:items-center md:flex-row flex-col">
              <div className="flex items-center">
                <Checkbox id="terms" isSelected={isChecked} />

                <Label
                  htmlFor="terms"
                  className="text-[12px] text-white/70 font-medium leading-none 
                  peer-disabled:cursor-not-allowed peer-visible:opacity-70
            select-none cursor-pointer"
                  onClick={() => {
                    setIsChecked(!isChecked);
                  }}
                >
                  Remember me
                </Label>
              </div>

              <ModalResetPassword />
            </FormItem>

            {isLoading ? (
              <Button
                isLoading
                className="w-fit mx-auto font-bold bg-white/20 text-white/80"
              >
                Loading...
              </Button>
            ) : (
              <Button
                type="submit"
                color="default"
                className="w-fit mx-auto font-bold"
              >
                Login
              </Button>
            )}
          </div>

          <div className="flex flex-col lg:mt-5 mt-3 gap-2">
            <span className="text-center text-white/40">or login with</span>

            <div className="flex gap-2 items-center justify-center">
              <ButtonLoginOthers />
            </div>
          </div>

          <div className="my-2 mx-auto text-[14px] text-white/60">
            <p className="select-none">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-accent underline transition-all duration-150 hover:text-accent-hover"
              >
                Sign up
              </Link>
            </p>
          </div>
        </motion.form>
      </Form>
    </>
  );
};

export default LoginForm;
