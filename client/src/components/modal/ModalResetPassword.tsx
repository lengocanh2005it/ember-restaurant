"use client";
import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Input,
  useDisclosure,
} from "@nextui-org/react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSendEmail } from "@/hooks/use-reset-password";
import { MailIcon } from "lucide-react";

const formSchema = z.object({
  email: z
    .string({ message: "Please enter this field." })
    .email({ message: "Invalid email." }),
});

const ModalResetPassword: React.FC = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const { mutate: mutateSendEmail } = useSendEmail();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      mutateSendEmail(values);
    }, 2500);
  }

  const handleSendClick = () => {
    form.handleSubmit(onSubmit)();
  };

  return (
    <>
      <p
        className="text-[12px] underline hover:text-blue-300 
      transition-all duration-250 ease-in-out cursor-pointer"
        onClick={onOpen}
      >
        Forgot your password?
      </p>

      <Modal
        isOpen={isOpen}
        backdrop="opaque"
        onOpenChange={onOpenChange}
        placement="center"
        className="bg-primary text-white"
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
        <ModalContent className="text-white">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Reset Password
              </ModalHeader>

              <ModalBody>
                <Form {...form}>
                  <form className="space-y-3">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Email</FormLabel>
                          <FormControl>
                            <Input
                              startContent={
                                <MailIcon className="text-black opacity-70 dark:text-white" />
                              }
                              placeholder="luke01@gmail.com.uk"
                              isRequired
                              className="text-black dark:text-white"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-white/70">
                            Please enter the email associated with your account.
                          </FormDescription>

                          <FormMessage className="dark:text-red-400 text-red-400" />
                        </FormItem>
                      )}
                    />

                    <div className="flex md:flex-row flex-col md:items-center md:justify-end gap-2">
                      <Button
                        type="button"
                        className="w-fit"
                        onPress={() => {
                          onClose();
                          setTimeout(() => {
                            form.reset({
                              email: "",
                            });
                          }, 700);
                        }}
                      >
                        Cancel
                      </Button>

                      {isLoading ? (
                        <>
                          <Button isLoading className="w-fit">
                            Please wait...
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            type="button"
                            className="w-fit"
                            onClick={handleSendClick}
                          >
                            Send
                          </Button>
                        </>
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

export default ModalResetPassword;
