"use client";
import React, { ChangeEvent, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button, Input, Textarea } from "@nextui-org/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAddNotification } from "@/hooks/use-add-notification";
import { CreateNotificationDto } from "@/api/notifications/utils/types";
import { useUserStore } from "@/store";

const imageSchema = z
  .instanceof(File, { message: "Please choose one image." })
  .refine((file) => file.type.startsWith("image/"), {
    message: "Invalid image format. Only images are allowed.",
  });

const formSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Title must contain at least 2 character(s)." })
    .max(50, { message: "Title must not contain more than 50 character(s)." }),
  content: z
    .string()
    .min(2, { message: "Content must contain at least 2 character(s)." }),
  image: imageSchema,
});

const CreateNotificationForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const { mutate: mutateAddNotification } = useAddNotification();
  const { user } = useUserStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      image: undefined,
    },
  });

  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files?.[0];

    if (!files) {
      setImageError("Please select an image.");
      return;
    }

    if (!files.type.startsWith("image/")) {
      setImageError("Invalid image format.");
      return;
    }

    if (files.size > 5 * 1024 * 1024) {
      setImageError("Image size exceeds 5MB.");
      return;
    }

    setImageError(null);

    form.setValue("image", files);
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const { title, content, image } = values;

    const data: CreateNotificationDto = {
      title,
      content,
      image,
      userId: user?.id!,
    };

    setTimeout(() => {
      setIsLoading(false);
      form.reset({
        title: "",
        content: "",
        image: undefined,
      });
      mutateAddNotification(data);
    }, 2500);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-2 lg:w-[60%] w-full mx-auto p-5 border
         dark:border-white/20 border-black/10 rounded-xl shadow-custom"
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
                  placeholder="Lorem 1"
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
                  placeholder="Lorem 1..."
                  {...field}
                  aria-labelledby="content"
                />
              </FormControl>
              <FormMessage className="dark:text-red-400 text-red-400" />
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
                <Input onChange={handleChangeImage} type="file" />
              </FormControl>

              <FormMessage className="dark:text-red-400 text-red-500" />
              {imageError && (
                <p className="dark:text-red-400 text-red-500">{imageError}</p>
              )}
            </FormItem>
          )}
        />

        {isLoading ? (
          <>
            <Button
              isLoading
              color="primary"
              className="dark:bg-white dark:text-black w-fit mx-auto"
            >
              Please wait...
            </Button>
          </>
        ) : (
          <>
            <Button
              type="submit"
              color="primary"
              className="dark:bg-white dark:text-black w-fit mx-auto"
            >
              Create
            </Button>
          </>
        )}
      </form>
    </Form>
  );
};

export default CreateNotificationForm;
