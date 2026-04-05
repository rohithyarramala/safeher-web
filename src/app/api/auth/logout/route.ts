import { NextResponse } from "next/server";

const ACCESS_COOKIE = "safeher_access_token";
const REFRESH_COOKIE = "safeher_refresh_token";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out successfully." });

  response.cookies.set(ACCESS_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  response.cookies.set(REFRESH_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
