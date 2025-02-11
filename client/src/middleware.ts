import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import axios from "@/lib/axios";
import { UserSessionData } from "@/utils";
import { PAGE_ROLE } from "@/config/enums/enums";

export async function middleware(req: NextRequest) {
  const userSessionCookie = req.cookies.get("user_session");
  const isLoggedInCookie = req.cookies.get("isLoggedIn");

  if (
    !userSessionCookie ||
    !isLoggedInCookie ||
    (isLoggedInCookie && isLoggedInCookie.value === "false")
  )
    return NextResponse.redirect(
      new URL("/login/?error=InformationMissing", req.url)
    );

  const sessionID = userSessionCookie.value;

  const encodedSessionID = encodeURIComponent(sessionID);

  const response = await axios.get(
    `/auth/session/?sessionId=${encodedSessionID}`
  );

  const userSessionData: UserSessionData = response.data.data;

  const currentUrl = req.nextUrl.pathname;

  const isHasRequiredRoles = userSessionData.roles.some(
    (role) => role === PAGE_ROLE.ADMIN || role === PAGE_ROLE.MANAGER
  );

  if (currentUrl.startsWith("/home/admin") && !isHasRequiredRoles)
    return NextResponse.redirect(new URL("/unauthorized", req.url));

  return NextResponse.next();
}

export const config = {
  matcher: ["/home/:path*"],
};
