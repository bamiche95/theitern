import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { requireAdmin } from "@/lib/middleware";

export async function PUT(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { items } = await req.json();

  try {
    // We update each item's display_order
    for (const item of items) {
      await db.query(
        "UPDATE nav_items SET display_order = ? WHERE id = ?",
        [item.display_order, item.id]
      );
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}