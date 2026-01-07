import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { ResultSetHeader } from "mysql2";
import { requireAdmin } from "@/lib/middleware";

export async function POST(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> } // 1. Define params as a Promise
) {
  const isAdmin = requireAdmin(req);
  if (!isAdmin) return NextResponse.json({ success: false }, { status: 401 });

  // 2. Await the params to get the id
  const { id } = await params;
  const courseId = parseInt(id, 10);

  if (isNaN(courseId)) {
    return NextResponse.json({ success: false, message: "Invalid course ID" }, { status: 400 });
  }

  const { type, section_order, content } = await req.json();

  const [result] = await db.query<ResultSetHeader>(
    "INSERT INTO course_sections (course_id, type, section_order, content) VALUES (?, ?, ?, ?)",
    [courseId, type, section_order, JSON.stringify(content)]
  );

  return NextResponse.json({ success: true, sectionId: result.insertId });
}


