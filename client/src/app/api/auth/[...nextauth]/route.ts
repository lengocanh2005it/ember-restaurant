import axios from "@/lib/axios";
import * as signature from "cookie-signature";
import NextAuth from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import { cookies } from "next/headers";

const handler = NextAuth({
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
    async signIn({ account, profile, user }) {
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

        if (!response || !response.data.data)
          throw new Error("Response must be contain data.");

        if (response.data.data) {
          const { accessToken, userId, refreshToken, sessionID } =
            response.data.data;

          if (accessToken && userId && refreshToken && sessionID) {
            account.access_token = accessToken;
            account.refresh_token = refreshToken;
            user.id = userId;
            account.session_state = sessionID;

            const cookieStore = await cookies();

            const signedSessionID =
              "s:" +
              signature.sign(
                sessionID,
                process.env.NEXT_PUBLIC_SESSION_SECRET_KEY as string
              );

            cookieStore.set({
              name: "user_session",
              value: signedSessionID,
              path: "/",
              httpOnly: process.env.NODE_ENV === "production" ? true : false,
              secure: process.env.NODE_ENV === "production" ? true : false,
              maxAge: 1000 * 60 * 30,
              sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            });

            cookieStore.set({
              name: "accessToken",
              value: accessToken,
              path: "/",
              httpOnly: false,
              secure: process.env.NODE_ENV === "production" ? true : false,
              maxAge: 1000 * 60 * 2,
              sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            });
          }
        }

        return true;
      } catch (err) {
        console.error("Error saving user: ", err);
        return false;
      }
    },
    async session({ session, token }) {
      if (token) {
        (session.user as any).accessToken = token.accessToken;
        (session.user as any).refreshToken = token.refreshToken;
        (session.user as any).userId = token.id;
        (session.user as any).email = token.email;
        (session.user as any).session_state = token.sessionID;
      }

      return session;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl + "/home";
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        token.accessToken = account.access_token;
        token.id = user.id;
        token.email = user.email;
        token.refreshToken = account.refresh_token;
        token.sessionID = account.session_state;
      }
      return token;
    },
  },
  secret: process.env.NEXT_PUBLIC_AUTH_SECRET,
});

export { handler as GET, handler as POST };
