import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { requireAdmin } from "@/lib/middleware";

const SECTIONS = [
  "introduction",
  "detailed_description",
  "who_is_course_for",
  "virtual_learning_info",
];

async function saveSections(courseId: number, body: any) {
  // Define the explicit order mapping
  const orderMap: Record<string, number> = {
    "introduction": 1,
    "who_is_course_for": 2,
    "virtual_learning_info": 3,
    "detailed_description": 4,
  };

  for (const type of SECTIONS) {
    const deltaContent = body[type] || { ops: [] };
    const order = orderMap[type] || 0; // Fallback to 0 if not found
    
    await db.query(
      `
      INSERT INTO course_sections (course_id, type, content, section_order)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        content = VALUES(content),
        section_order = VALUES(section_order)
      `,
      [courseId, type, JSON.stringify({ html: deltaContent }), order]
    );
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const courseId = parseInt(id, 10);

  // 1. Fetch Sections
  const [sectionRows] = await db.query(
    `SELECT type, content FROM course_sections WHERE course_id = ?`,
    [courseId]
  );

  // 2. Fetch Assigned Tutors
  const [tutorRows] = await db.query(
    `SELECT tutor_id FROM course_tutors WHERE course_id = ?`,
    [courseId]
  );

  const typedSections = sectionRows as { type: string; content: string }[];
  const content: Record<string, any> = {
    sections: {},
    tutorIds: (tutorRows as any[]).map(row => row.tutor_id)
  };

  for (const row of typedSections) {
    try {
      const parsed = JSON.parse(row.content);
      content.sections[row.type] = parsed.html || parsed;
    } catch {
      content.sections[row.type] = row.content;
    }
  }

  return NextResponse.json(content);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!requireAdmin(req)) return NextResponse.json({ success: false }, { status: 401 });

  const { id } = await params;
  const courseId = parseInt(id, 10);
  const { sections, tutorIds } = await req.json();

  // Save Sections
  await saveSections(courseId, sections);

  // Update Tutors: Clear old and insert new (Transaction recommended in production)
  await db.query("DELETE FROM course_tutors WHERE course_id = ?", [courseId]);
  
  if (tutorIds && tutorIds.length > 0) {
    const values = tutorIds.map((tId: number) => [courseId, tId, 'primary']);
    await db.query(
      "INSERT INTO course_tutors (course_id, tutor_id, role) VALUES ?",
      [values]
    );
  }

  return NextResponse.json({ success: true });
}