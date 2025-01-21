export type CreateNotificationDto = {
  title: string;
  content: string;
  image?: File;
  userId: string;
};

export type UpdateNotificationDto = {
  notificationId: string;
  title: string;
  content: string;
  image?: File;
};
