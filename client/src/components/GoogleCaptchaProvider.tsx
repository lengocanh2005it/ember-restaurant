"use client";
import React, { ReactNode } from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

interface GoogleCaptchaWrapperProps {
  children: ReactNode;
}

const GoogleCaptchaWrapper: React.FC<GoogleCaptchaWrapperProps> = ({
  children,
}) => {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
};

export default GoogleCaptchaWrapper;
