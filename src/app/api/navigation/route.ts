import { NextRequest, NextResponse } from "next/server"; // Added NextRequest to imports
import db from "@/lib/db";
import { requireAdmin } from "@/lib/middleware";

interface NavItem {
  id: number;
  label: string;
  url: string;
  parent_id: number | null;
  display_order: number;
  is_active: number;
  children?: NavItem[];
}

// GET: Fetch and build the menu tree
export async function GET() {
  try {
    // Remove the ORDER BY parent_id. 
    // We only need to order by display_order so siblings are in the right place.
    const [rows] = await db.query(
      "SELECT * FROM nav_items WHERE is_active = 1 ORDER BY display_order ASC"
    );

    const items = rows as NavItem[];

    const buildTree = (data: NavItem[], parentId: number | null = null): NavItem[] => {
      return data
        .filter((item) => item.parent_id === parentId)
        .map((item) => ({
          ...item,
          children: buildTree(data, item.id),
        }));
    };

    const tree = buildTree(items);
    return NextResponse.json(tree);
  } catch (error) {
    console.error("Navigation Fetch Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST: Create a new navigation item
export async function POST(req: NextRequest) {
  // 1. Security check
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { label, url, parent_id, display_order } = body;

    // 2. Validation
    if (!label || !url) {
      return NextResponse.json({ error: "Label and URL are required" }, { status: 400 });
    }

    // 3. Insert into Database
    // We default is_active to 1 (true)
    const [result] = await db.query(
      `INSERT INTO nav_items (label, url, parent_id, display_order, is_active) 
       VALUES (?, ?, ?, ?, 1)`,
      [label, url, parent_id || null, display_order || 0]
    );

    return NextResponse.json({ 
      success: true, 
      id: (result as any).insertId 
    }, { status: 201 });

  } catch (error) {
    console.error("Navigation Create Error:", error);
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
  }
}

// DELETE: Remove item (cascades to children)
export async function DELETE(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await db.query("DELETE FROM nav_items WHERE id = ?", [id]);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { id, label, url, parent_id } = body;

    await db.query(
      "UPDATE nav_items SET label = ?, url = ?, parent_id = ? WHERE id = ?",
      [label, url, parent_id || null, id]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}