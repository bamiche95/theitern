//Always rememeber that categories are treated as Courses
// src\app\api\categories\route.tsx
import { NextRequest, NextResponse } from "next/server";

import db from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export async function GET() {
  try {
    const [rows] = await db.query<RowDataPacket[]>("SELECT * FROM categories ORDER BY name ASC");

    const categories = rows.map(row => ({
      ...row,
      content: row.content ? JSON.parse(row.content as string) : null
    }));

    return NextResponse.json({ success: true, categories });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}


export async function POST(req: NextRequest) { 
  try {
    const { name, enrollment_fee = "0", payment_link = null, content = null, thumbnail = null } = await req.json();

    const slug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");

    // Serialize content to JSON string
    const contentString = content ? JSON.stringify(content) : null;

    const [result] = await db.query<ResultSetHeader>(
      `INSERT INTO categories 
        (name, slug, enrollment_fee, payment_link, content, thumbnail) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, slug, enrollment_fee, payment_link, contentString, thumbnail]
    );

    return NextResponse.json({
      success: true,
      category: {
        id: result.insertId,
        name,
        slug,
        enrollment_fee,
        payment_link,
        content,
        thumbnail, // send back the base64 string
      },
    });
  } catch (err: any) {
    console.error("POST /categories error:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}




