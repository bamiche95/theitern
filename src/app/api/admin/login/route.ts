import { NextRequest, NextResponse } from "next/server";
import { loginAdmin } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const result = await loginAdmin(email, password);

  if (!result.success || !result.token) {
    return NextResponse.json({ success: false, message: result.message || "Login failed" }, { status: 401 });
  }

  const res = NextResponse.json({ success: true });

  // Now token is guaranteed to be a string
  res.cookies.set("adminToken", result.token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
  });

  return res;
}
