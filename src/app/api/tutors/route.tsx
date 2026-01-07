// src/app/api/tutors/route.tsx
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { requireAdmin } from "@/lib/middleware";

// GET all tutors
export async function GET(req: NextRequest) {
  try {
    const [rows] = await db.query<RowDataPacket[]>("SELECT * FROM tutors ORDER BY created_at DESC");
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tutors" }, { status: 500 });
  }
}

// POST a new tutor

export async function POST(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    // ✅ FIX: Read JSON instead of formData
    const { name, email, bio, expertise, profile_image } = await req.json();

    // Basic validation
    if (!name || !email) {
      return NextResponse.json({ error: "Name and Email are required" }, { status: 400 });
    }

    const [result] = await db.query<ResultSetHeader>(
      "INSERT INTO tutors (name, email, bio, expertise, profile_image) VALUES (?, ?, ?, ?, ?)",
      [name, email, bio, expertise, profile_image || null]
    );

    return NextResponse.json({ id: result.insertId, success: true });
  } catch (error: any) {
    console.error("Database Error:", error);
    
    // Handle duplicate email error
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: "A tutor with this email already exists" }, { status: 400 });
    }

    return NextResponse.json({ error: "Failed to create tutor" }, { status: 500 });
  }
}

// PUT (Update) tutor
export async function PUT(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id, name, email, bio, expertise, profile_image } = await req.json();
    await db.query(
      "UPDATE tutors SET name = ?, email = ?, bio = ?, expertise = ?, profile_image = ? WHERE id = ?",
      [name, email, bio, expertise, profile_image, id]
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update tutor" }, { status: 500 });
  }
}

// DELETE tutor
export async function DELETE(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    await db.query("DELETE FROM tutors WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete tutor" }, { status: 500 });
  }
}

