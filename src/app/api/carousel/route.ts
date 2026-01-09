// app/api/carousel/route.ts
import { NextResponse, NextRequest } from "next/server";
import db from "@/lib/db";



export async function POST(req: NextRequest) {
  try {
    const { image_url, link_url, sort_order } = await req.json();

    if (!image_url) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    await db.query(
      `INSERT INTO carousel_images (image_url, link_url, sort_order, is_active)
       VALUES (?, ?, ?, 1)`,
      [image_url, link_url ?? null, sort_order ?? 0]
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}



export async function GET() {
  const [rows] = await db.query(
    "SELECT * FROM carousel_images WHERE is_active = 1 ORDER BY sort_order ASC"
  );

  return NextResponse.json({ images: rows });
}


