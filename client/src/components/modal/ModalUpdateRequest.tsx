"use client";
import { UpdateSupportTicketDto } from "@/api/support-ticket/utils/types";
import RequestDetails from "@/components/RequestDetails";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUpdateRequest } from "@/hooks/use-update-support-ticket";
import { useUserStore } from "@/store";
import { Request } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import { SendIcon, SquarePenIcon } from "lucide-react";
import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  request: z
    .string({ message: "Response must be a string." })
    .min(1, { message: "Response can't be empty." }),
});

interface ModalUpdateRequestProps {
  requestData: Request;
}

const ModalUpdateRequest: React.FC<ModalUpdateRequestProps> = ({
  requestData,
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { user } = useUserStore();

  const { mutate: mutateUpdateRequest } = useUpdateRequest();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      request: "",
    },
  });

  const handleClick = (request: string) => {
    const data: UpdateSupportTicketDto = {
      userId: user?.id!,
      requestId: requestData.id,
      response: request,
      type: "user",
      original_request: requestData.original_request,
    };

    mutateUpdateRequest(data);

    form.reset({
      request: "",
    });
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { request } = values;

    const data: UpdateSupportTicketDto = {
      userId: user?.id!,
      requestId: requestData.id,
      response: request,
      type: "user",
      original_request: requestData.original_request,
    };

    mutateUpdateRequest(data);

    form.reset({
      request: "",
    });
  }

  const response = useWatch({
    control: form.control,
    name: "request",
  });

  return (
    <>
      <Tooltip content="Edit" className="dark:bg-white text-black">
        <SquarePenIcon onClick={onOpen} className="cursor-pointer" />
      </Tooltip>

      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        placement="center"
        size="xl"
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
              <ModalHeader
                className="lg:text-xl text-base text-center
              flex justify-center"
              >
                Update Request
              </ModalHeader>

              <ModalBody className="flex flex-col gap-2 py-4">
                <ScrollArea className="max-h-[400px] rounded-md p-4 flex flex-col gap-2">
                  <RequestDetails request={requestData} />
                </ScrollArea>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-2"
                  >
                    <FormField
                      control={form.control}
                      name="request"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Your response..."
                              aria-labelledby="request"
                              aria-label="request"
                              endContent={
                                response ? (
                                  <Tooltip
                                    color="primary"
                                    className="dark:text-black dark:bg-white text-white"
                                    content="Send"
                                  >
                                    <SendIcon
                                      className="cursor-pointer"
                                      onClick={() => {
                                        handleClick(form.getValues("request"));
                                      }}
                                    />
                                  </Tooltip>
                                ) : null
                              }
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="dark:text-red-400 text-red-500" />
                        </FormItem>
                      )}
                    />
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

export default ModalUpdateRequest;
