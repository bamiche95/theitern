import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

// PATCH: update carousel item
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // <-- params is a Promise
) {
  try {
    const { id } = await params; // ✅ unwrap promise

    const { image_url, link_url, sort_order, is_active } = await req.json();

    await db.query(
      `UPDATE carousel_images
       SET image_url = ?, link_url = ?, sort_order = ?, is_active = ?
       WHERE id = ?`,
      [image_url, link_url, sort_order, is_active, id]
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE: delete carousel item
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // ✅ unwrap promise

    await db.query("DELETE FROM carousel_images WHERE id = ?", [id]);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
