import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

// GET: Fetch reviews (Public gets approved, Admin gets all)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const onlyApproved = searchParams.get("approved") === "true";

    let query = "SELECT * FROM reviews ORDER BY created_at DESC";
    if (onlyApproved) {
      query = "SELECT * FROM reviews WHERE is_approved = 1 ORDER BY created_at DESC";
    }

    const [reviews] = await db.query<RowDataPacket[]>(query);
    return NextResponse.json({ success: true, reviews });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  try {
    const { full_name, position, content } = await req.json();

    if (!full_name || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await db.query<ResultSetHeader>(
      `INSERT INTO reviews (full_name, position, content, is_approved)
       VALUES (?, ?, ?, 1)`,
      [full_name, position ?? null, content]
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
