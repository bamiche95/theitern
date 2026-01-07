import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentAdmin } from "@/lib/admin";

export async function POST(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id, title, description, icon_name, gradient_key, display_order } = await req.json();

    if (id) {
      // Update existing
      await db.query(
        "UPDATE site_features SET title=?, description=?, icon_name=?, gradient_key=?, display_order=? WHERE id=?",
        [title, description, icon_name, gradient_key, display_order, id]
      );
    } else {
      // Create new
      await db.query(
        "INSERT INTO site_features (title, description, icon_name, gradient_key, display_order) VALUES (?, ?, ?, ?, ?)",
        [title, description, icon_name, gradient_key, display_order]
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const { id } = await req.json();
    await db.query("DELETE FROM site_features WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
}