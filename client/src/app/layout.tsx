import ButtonScroll from "@/components/buttons/ButtonScroll";
import Footer from "@/components/layouts/Footer";
import NextUIWrapper from "@/components/NextUIWrapper";
import ReactQueryProvider from "@/components/ReactQueryProvider";
import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import "./globals.css";
import GoogleCaptchaWrapper from "@/components/GoogleCaptchaProvider";

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-Rubik",
});

export const metadata: Metadata = {
  title: "Ember. Restaurant",
  description: "",
  icons: {
    icon: "/ember_logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <GoogleCaptchaWrapper>
      <ReactQueryProvider>
        <html lang="en">
          <body className={`${rubik.className}`}>
            <NextUIWrapper>
              {children}
              <Footer />
              <ButtonScroll />

              <ToastContainer
                position="top-right"
                autoClose={5000}
                pauseOnFocusLoss={false}
                pauseOnHover={false}
                rtl={false}
                theme="colored"
                className="text-base rounded-lg cursor-pointer"
                toastStyle={{ backgroundColor: "#28a745", color: "#fff" }}
              />
            </NextUIWrapper>
          </body>
        </html>
      </ReactQueryProvider>
    </GoogleCaptchaWrapper>
  );
}
