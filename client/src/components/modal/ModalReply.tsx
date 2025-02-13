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
  Select,
  SelectItem,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import { ReplyIcon } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  response: z.string({ message: "Response must be a string." }).min(1, {
    message: "Response can't be empty.",
  }),
  status: z.enum(["pending", "success", "error"], {
    message: "Please choose a valid property.",
  }),
});

interface ModalReplyProps {
  request: Request;
}

const statusProps = [
  { key: "success", label: "Success" },
  { key: "error", label: "Error" },
  { key: "pending", label: "Pending" },
];

const ModalReply: React.FC<ModalReplyProps> = ({ request }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { user } = useUserStore();

  const { mutate: mutateUpdateResponse } = useUpdateRequest(request?.user?.id);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      response: "",
      status: request.status as "pending" | "success" | "error",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { response, status } = values;

    const data: UpdateSupportTicketDto = {
      requestId: request.id,
      response,
      status,
      userId: user?.id === request.user.id ? request.user.id : user?.id!,
      original_request: request.original_request,
      type: "admin",
    };

    mutateUpdateResponse(data);
    form.reset({
      response: "",
    });
  }

  return (
    <>
      <Tooltip content="Reply" className="dark:text-white text-black">
        <ReplyIcon
          className="cursor-pointer opacity-60 hover:opacity-100 transition-opacity duration-250
        ease-in-out"
          onClick={onOpen}
        />
      </Tooltip>

      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        isDismissable={false}
        isKeyboardDismissDisabled={false}
        onOpenChange={onOpenChange}
        placement="center"
        size="xl"
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
              <ModalHeader className="lg:text-xl text-[20px] text-center flex justify-center">
                Customer Request Response
              </ModalHeader>

              <ModalBody className="flex flex-col gap-2 py-4">
                <ScrollArea className="max-h-[350px] rounded-md p-4 flex flex-col gap-2">
                  <RequestDetails request={request} />
                </ScrollArea>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-2"
                  >
                    <FormField
                      control={form.control}
                      name="response"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Your response..."
                              {...field}
                              aria-label="response"
                              aria-labelledby="response"
                            />
                          </FormControl>
                          <FormMessage className="dark:text-red-400 text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select
                              items={statusProps}
                              label="Status"
                              aria-labelledby="status"
                              defaultSelectedKeys={[`${request.status}`]}
                              {...field}
                            >
                              {(type) => (
                                <SelectItem
                                  key={type.key}
                                  className="text-black dark:text-white"
                                  aria-labelledby="status"
                                >
                                  {type.label}
                                </SelectItem>
                              )}
                            </Select>
                          </FormControl>
                          <FormMessage className="dark:text-red-400" />
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

export default ModalReply;
