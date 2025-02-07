import axios from "@/lib/axios";
import { AuthOptions } from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_SECRET_ID as string,
    }),
    FacebookProvider({
      clientId: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_FACEBOOK_SECRET_ID as string,
      authorization: {
        params: { scope: "email public_profile" },
      },
    }),
  ],
  pages: {
    error: "/login",
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (!account || !profile) return false;

      const { provider } = account;

      try {
        let response = null;

        if (provider === "google") {
          const { email, name, sub } = profile;

          response = await axios.post("/auth/social/login", {
            email,
            name,
            subId: sub,
            image: (profile as any).picture,
            provider,
          });
        } else if (provider === "facebook") {
          const { id, name, picture } = profile as any;

          response = await axios.post("/auth/social/login", {
            name,
            subId: id,
            image: picture.data.url,
            provider,
          });
        }

        if (!response || !response.data?.data) {
          throw new Error("Response must contain data.");
        }

        const { accessToken, userId, refreshToken } = response.data.data;

        if (accessToken && userId && refreshToken) {
          account.access_token = accessToken;
          account.userId = userId;
        }

        return true;
      } catch (err) {
        console.error("Error saving user: ", err);
        return false;
      }
    },

    async session({ session, token }) {
      if (token && token.accessToken) {
        session.user.accessToken = token.accessToken as string;
        session.user.userId = token.userId as string;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      return baseUrl + "/home";
    },

    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.userId = account.userId;
      }
      return token;
    },
  },
  secret: process.env.NEXT_PUBLIC_AUTH_SECRET,
};
