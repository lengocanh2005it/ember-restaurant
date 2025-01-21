export type ResetPasswordDto = {
  token: string;
  newPassword: string;
};

export type SendEmailDto = {
  email: string;
};
