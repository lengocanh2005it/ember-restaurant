"use client";
import React, { ChangeEvent, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Tooltip,
  Textarea,
} from "@heroui/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { EditIcon } from "@/components/icons/EditIcon";
import ModalConfirmUpdateNotification from "@/components/modal/ModalConfirmUpdateNotification";
import { UpdateNotificationDto } from "@/api/notifications/utils/types";
import { Notification } from "@/utils";

const imageSchema = z
  .instanceof(File)
  .refine((file) => file.type.startsWith("image/"), {
    message: "Invalid images",
  });

const formSchema = z.object({
  title: z
    .string({ message: "Title can't be empty." })
    .min(2, { message: "Title must be at least 2 characters." }),
  content: z
    .string({ message: "Content can't be empty." })
    .min(5, { message: "Content must be at least 5 characters." }),
  image: imageSchema.optional(),
});

interface ModalUpdateNotificationProps {
  notification: Notification;
}

const ModalUpdateNotification: React.FC<ModalUpdateNotificationProps> = ({
  notification,
}) => {
  const [updateNotification, setUpdateNotification] =
    useState<UpdateNotificationDto>({
      notificationId: notification.id,
      title: notification.title,
      content: notification.content,
    });
  const [imageError, setImageError] = useState<string | null>(null);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: notification?.title ? notification.title : "",
      content: notification?.content ? notification.content : "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { title, content, image } = values;

    const data: UpdateNotificationDto = {
      notificationId: notification.id,
      title,
      content,
      image,
    };

    setUpdateNotification(data);
  }

  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image")) {
      setImageError("Invalid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageError("File size exceeded 5 MB.");
      return;
    }

    setImageError(null);
    form.setValue("image", file);
  };

  return (
    <>
      <Tooltip content="Edit" className="dark:text-white text-black">
        <span
          className="text-lg text-default-400 cursor-pointer active:opacity-50"
          onClick={onOpen}
        >
          <EditIcon />
        </span>
      </Tooltip>

      <Modal
        backdrop="opaque"
        size="lg"
        placement="center"
        isOpen={isOpen}
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
              <ModalHeader className="flex flex-col gap-1 lg:text-left text-center">
                Notification Update
              </ModalHeader>

              <ModalBody>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col lg:gap-4 gap-2"
                  >
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-white text-black">
                            Title
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Title..."
                              {...field}
                              aria-labelledby="title"
                            />
                          </FormControl>
                          <FormMessage className="dark:text-red-400 text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-white text-black">
                            Content
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Content..."
                              {...field}
                              aria-labelledby="title"
                            />
                          </FormControl>
                          <FormMessage className="dark:text-red-400 text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-white text-black">
                            Image
                          </FormLabel>
                          <FormControl>
                            <Input type="file" onChange={handleChangeImage} />
                          </FormControl>
                          {imageError && (
                            <p className="dark:text-red-400 text-red-500">
                              {imageError}
                            </p>
                          )}
                        </FormItem>
                      )}
                    />

                    <div className="flex items-center lg:justify-end justify-center gap-3">
                      <Button
                        color="primary"
                        className="dark:bg-white dark:text-black"
                        onPress={onClose}
                      >
                        Close
                      </Button>

                      <ModalConfirmUpdateNotification
                        updateNotificationPayload={updateNotification}
                        onCloseFc={onClose}
                      />
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

export default ModalUpdateNotification;
