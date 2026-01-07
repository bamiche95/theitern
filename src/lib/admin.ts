import db from "./db"; // Ensure this points to the Singleton pool above
import { cookies } from "next/headers";
import { RowDataPacket } from "mysql2";
import { verifyToken } from "./auth";

export async function getCurrentAdmin() {
  const cookieStore = await cookies(); 
  const token = cookieStore.get("adminToken")?.value;

  if (!token) return null;

  try {
    const payload: any = verifyToken(token);
    if (!payload) return null;

    // The query now uses the pooled singleton
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT id, name, email FROM admins WHERE id = ?",
      [payload.id]
    );

    return rows[0] || null;
  } catch (error) {
    console.error("Auth DB Error:", error);
    return null;
  }
}