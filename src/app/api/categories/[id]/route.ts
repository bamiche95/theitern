import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { ResultSetHeader } from "mysql2";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name, enrollment_fee, payment_link, content, thumbnail } = await req.json();

    // If no fields to update
    if (!name && enrollment_fee == null && !payment_link && !content && !thumbnail) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    // Slug update if name changed
    const slug = name ? name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "") : null;

    // Serialize content to JSON string if provided
    const contentString = content ? JSON.stringify(content) : null;

    await db.query(
      `
      UPDATE categories
      SET
        name = COALESCE(?, name),
        slug = COALESCE(?, slug),
        enrollment_fee = COALESCE(?, enrollment_fee),
        payment_link = COALESCE(?, payment_link),
        content = COALESCE(?, content),
        thumbnail = COALESCE(?, thumbnail)
      WHERE id = ?
      `,
      [
        name ?? null,
        slug,
        enrollment_fee ?? null,
        payment_link ?? null,
        contentString,
        thumbnail ?? null,
        id,
      ]
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("PATCH category error:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}



export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Note: This might fail if courses are still linked to this category 
    // depending on your Foreign Key constraints (ON DELETE RESTRICT)
    await db.query("DELETE FROM categories WHERE id = ?", [id]);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: "Cannot delete category while courses are assigned to it." }, { status: 500 });
  }
}