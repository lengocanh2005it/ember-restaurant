"use client";
import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure,
  Textarea,
  Tooltip,
  Chip,
} from "@heroui/react";
import { SendIcon, XIcon, HelpCircleIcon, HistoryIcon } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAddSupportTicket } from "@/hooks/use-add-support-ticket";
import { useRouter } from "next/navigation";
import { CreateSupportTicketDto } from "@/api/support-ticket/utils/types";
import { useUserStore } from "@/store";

const formSchema = z.object({
  request: z.string({ message: "Request must be a string." }).min(1, {
    message: "Request must contain at least 1 character(s).",
  }),
});

export default function CustomerSupport() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useUserStore();
  const router = useRouter();

  const { mutate: mutateCreateSupportTicket } = useAddSupportTicket(user?.id!);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      request: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const { request } = values;

    const data: CreateSupportTicketDto = {
      userId: user?.id!,
      request,
    };

    setTimeout(() => {
      setIsLoading(false);
      mutateCreateSupportTicket(data);
      form.reset({
        request: "",
      });
    }, 2500);
  }

  const handleClick = () => {
    router.push("/home/customers/requests");
    onClose();
  };

  const handleCloseClick = () => {
    onClose();
    setTimeout(() => {
      form.reset({
        request: "",
      });
    }, 800);
  };

  return (
    <>
      <Tooltip
        showArrow
        color="primary"
        placement="top"
        content="Have a request?"
        className="text-white p-2 dark:text-black dark:bg-white"
      >
        <p onClick={onOpen} className="cursor-pointer">
          <HelpCircleIcon size={35} />
        </p>
      </Tooltip>

      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        size="xl"
        isDismissable={false}
        isKeyboardDismissDisabled={false}
        onOpenChange={() => {
          onOpenChange();
          handleCloseClick();
        }}
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
        placement="center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col text-black dark:text-white">
                <h1 className="lg:text-xl text-base font-bold lg:text-left text-center">
                  Make A Request
                </h1>

                <p
                  className="lg:text-[15px] text-[14px] lg:text-left text-center
                 text-black/80 dark:text-white/80 font-normal"
                >
                  If you have any request that need answering, don&apos;t
                  hesitate to ask us!
                </p>
              </ModalHeader>

              <ModalBody className="text-black dark:text-white">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-4"
                  >
                    <FormField
                      control={form.control}
                      name="request"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-white text-black">
                            Your Request
                          </FormLabel>

                          <FormControl>
                            <Textarea
                              placeholder="Please write your request here..."
                              aria-labelledby="request"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage className="dark:text-red-400 text-red-500" />
                        </FormItem>
                      )}
                    />

                    <div className="relative flex lg:items-end lg:justify-end items-center justify-center">
                      <Chip
                        className="opacity-80 hover:opacity-100 
                      cursor-pointer ease-in-out transition-opacity
                       duration-300 dark:bg-white dark:text-black"
                        color="primary"
                        onClick={handleClick}
                      >
                        View all your past requests.
                      </Chip>
                    </div>

                    <div
                      className="relative flex sm:flex-row flex-col-reverse lg:items-center 
                    gap-2 lg:justify-end items-center justify-center"
                    >
                      <Button
                        onPress={handleCloseClick}
                        color="primary"
                        className="dark:bg-white dark:text-black w-fit"
                        startContent={<XIcon />}
                      >
                        Cancel
                      </Button>

                      {isLoading ? (
                        <>
                          <Button
                            isLoading
                            color="primary"
                            className="dark:bg-white dark:text-black w-fit"
                          >
                            Please wait...
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            type="submit"
                            color="primary"
                            className="dark:bg-white dark:text-black w-fit"
                            startContent={<SendIcon />}
                          >
                            Send Request
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
}
