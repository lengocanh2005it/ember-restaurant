"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ButtonLoginOthers from "@/components/buttons/ButtonLoginOthers";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRegister } from "@/hooks/use-register";
import { Button, Input } from "@nextui-org/react";
import { EyeIcon, EyeOffIcon, LockIcon, UserIcon } from "lucide-react";
import { CreateUserDto } from "@/api/register/utils/types";

const formSchema = z
  .object({
    username: z
      .string({ message: "Please fill this field." })
      .min(1, { message: "Username can't be empty." })
      .max(50, { message: "Username can't be more than 50 characters long." }),

    password: z
      .string({ message: "Please fill this field." })
      .min(1, { message: "Password can't be empty." })
      .max(255, {
        message: "Password can't be more than 255 characters long.",
      }),

    confirmPassword: z
      .string({ message: "Please fill this field." })
      .min(1, { message: "Password can't be empty." })
      .max(255, {
        message: "Password can't be more than 255 characters long.",
      }),
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

const RegisterForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isShow, setIsShow] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate: mutateRegister } = useRegister();

  const handleClick = () => {
    setIsShow(!isShow);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      mutateRegister(values as CreateUserDto);
      form.reset({
        username: "",
        password: "",
        confirmPassword: "",
      });
    }, 3000);
  };

  return (
    <>
      <Form {...form}>
        <motion.form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-3 w-full h-full"
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
          <div className="grid grid-cols-1 gap-3">
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
                        placeholder="Enter you username"
                        className="w-full text-black dark:text-white text-[14px]"
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
                        id="password"
                        startContent={
                          <LockIcon className="text-black dark:text-white" />
                        }
                        placeholder="Enter your password"
                        type={!isShow ? "password" : "text"}
                        className="w-full text-[14px] text-black dark:text-white"
                        autoComplete=""
                        endContent={
                          !isShow ? (
                            <>
                              <EyeOffIcon
                                className="text-black dark:text-white opacity-60 
                          hover:opacity-100 ease-in-out duration-250 transition-opacity cursor-pointer"
                                onClick={handleClick}
                              />
                            </>
                          ) : (
                            <>
                              <EyeIcon
                                className="text-black opacity-60 dark:text-white
                          hover:opacity-100 ease-in-out duration-250 transition-opacity cursor-pointer"
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

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className="text-white dark:text-white"
                    htmlFor="confirmPassword"
                  >
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center relative">
                      <Input
                        startContent={
                          <LockIcon className="text-black dark:text-white" />
                        }
                        id="confirmPassword"
                        placeholder="Confirm your password"
                        type={!isShow ? "password" : "text"}
                        className="w-full text-black dark:text-white text-[14px]"
                        autoComplete=""
                        endContent={
                          !isShow ? (
                            <>
                              <EyeOffIcon
                                className="text-black dark:text-white opacity-60 
                          hover:opacity-100 duration-250 ease-in-out transition-opacity cursor-pointer"
                                onClick={handleClick}
                              />
                            </>
                          ) : (
                            <>
                              <EyeIcon
                                className="text-black opacity-60 dark:text-white
                          hover:opacity-100 duration-250 ease-in-out transition-opacity cursor-pointer"
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

            {!isLoading ? (
              <>
                <Button type="submit" className="w-fit mx-auto font-bold">
                  Register
                </Button>
              </>
            ) : (
              <>
                <Button
                  isLoading
                  className="w-fit mx-auto font-bold bg-white/20 text-white/80"
                >
                  Creating new account...
                </Button>
              </>
            )}
          </div>

          <div className="flex flex-col mt-5 gap-2">
            <span className="text-center text-white/40">or register with</span>

            <div className="flex gap-2 items-center justify-center">
              <ButtonLoginOthers />
            </div>
          </div>

          <div className="my-2 mx-auto text-[14px] text-white/60">
            <p className="select-none">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-accent underline transition-all duration-150 hover:text-accent-hover"
              >
                Log in
              </Link>
            </p>
          </div>
        </motion.form>
      </Form>
    </>
  );
};

export default RegisterForm;
