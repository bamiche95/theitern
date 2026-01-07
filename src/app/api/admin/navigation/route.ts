import { NextRequest, NextResponse } from "next/server"; // Added NextRequest to imports
import db from "@/lib/db";
import { requireAdmin } from "@/lib/middleware";

export async function GET() {
  // This returns a FLAT list so the Admin UI can see every single row
  const [rows] = await db.query("SELECT * FROM nav_items ORDER BY display_order ASC");
  return NextResponse.json(rows);
}

