import db from "./db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { RowDataPacket } from "mysql2";

const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";

// Sign a JWT token for admin
export function signToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
}

// Verify JWT token, returns payload or null
export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

// Login admin
export async function loginAdmin(email: string, password: string) {
  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT * FROM admins WHERE email = ?",
    [email]
  );

  if (rows.length === 0) return { success: false, message: "Admin not found" };

  const admin = rows[0];
  const isValid = await bcrypt.compare(password, admin.password_hash);
  if (!isValid) return { success: false, message: "Invalid password" };

  const token = jwt.sign({ id: admin.id, email: admin.email }, JWT_SECRET, {
    expiresIn: "1d",
  });

  return { success: true, token };
}
