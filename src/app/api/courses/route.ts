import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { requireAdmin } from "@/lib/middleware";



export async function GET(req: NextRequest) {
  try {
    // Optional: check admin authentication
    // const isAdmin = requireAdmin(req);
    // if (!isAdmin) return NextResponse.json({ success: false }, { status: 401 });

    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT id, title, slug, short_description, thumbnail, published FROM courses ORDER BY created_at DESC"
    );

    return NextResponse.json({ success: true, courses: rows });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}



export async function POST(req: NextRequest) {
  try {
    // Note: ensure requireAdmin is properly implemented to check session/headers
    const isAdmin = requireAdmin(req);
    if (!isAdmin) return NextResponse.json({ success: false }, { status: 401 });

    const { 
      title, 
      slug, 
      short_description, 
      thumbnail, 
      published, 
      category_id,
    
    } = await req.json();

   const [result] = await db.query<ResultSetHeader>(
  `INSERT INTO courses (
      title, 
      slug, 
      short_description, 
      thumbnail, 
      published, 
      category_id
    ) VALUES (?, ?, ?, ?, ?, ?)`,
  [
    title,
    slug,
    short_description,
    thumbnail || null,
    published ? 1 : 0,
    category_id || null,
  ]
);


    return NextResponse.json({
      success: true,
      course: {
        id: result.insertId,
        title,
        slug,
        short_description,
        thumbnail,
        published,
       
      },
    });

  } catch (err: any) {
    console.error("Course Creation Error:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

