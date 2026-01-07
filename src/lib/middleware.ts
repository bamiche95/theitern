import { NextRequest } from "next/server";
import { verifyToken } from "./auth";

export function requireAdmin(req: NextRequest) {
  const token = req.cookies.get("adminToken")?.value;
  if (!token) return false;

  const payload = verifyToken(token);
  return payload || false;
}
