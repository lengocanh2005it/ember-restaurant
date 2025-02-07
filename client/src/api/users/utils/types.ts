export type UpdateUserDto = {
  userId: string;
  name: string;
  job: string;
  email: string;
  phone: string;
  address: string;
  total_orders: number;
  total_reservations: number;
  loyalty_points: number;
  image?: File;
};

export type UpdateEmailOfUserDto = {
  email: string;
  userId: string;
  options: string;
};

export type UpdateProfileOfUserDto = {
  userId: string;
  name: string;
  job: string;
  email: string;
  phone: string;
  address: string;
  image?: File;
};

export type VerifyEmailDto = {
  newEmail: string;
  verificationCode: string;
};

export type CreateSessionOfUserDto = {
  userId: string;
  accessToken: string;
  refreshToken: string;
};
