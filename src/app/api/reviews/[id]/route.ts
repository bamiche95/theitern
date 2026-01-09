import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

// PATCH: Approve/Disapprove a review
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { content } = await req.json();

    // Admin approves the review and optionally updates content
    await db.query(
      "UPDATE reviews SET is_approved = 1, content = ? WHERE id = ?",
      [content, id]
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE: Remove a review
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.query("DELETE FROM reviews WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}