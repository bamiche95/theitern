import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

import { revalidateTag } from "next/cache";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const courseId = Number(id);

    if (!Number.isInteger(courseId) || courseId <= 0) {
      return NextResponse.json({ error: "Invalid course ID" }, { status: 400 });
    }

    const body = await req.json();
    // 1. Extract the new fields from the request body
const { title, slug, short_description, category_id, price, payment_link, thumbnail } = body;
    if (!title || !slug) {
      return NextResponse.json({ error: "Title and slug are required" }, { status: 400 });
    }

    // 2. Fetch OLD SLUG (Before update)
    const [oldCourse]: any = await db.query(
      "SELECT slug FROM courses WHERE id = ?",
      [courseId]
    );
    const oldSlug = oldCourse[0]?.slug;

    // 3. UPDATE COURSE
await db.query(
  `UPDATE courses 
   SET title = ?, 
       slug = ?, 
       short_description = ?, 
       category_id = ?, 
      
       thumbnail = ? 
   WHERE id = ?`,
  [
    title,
    slug,
    short_description,
    category_id === "" ? null : Number(category_id),
    thumbnail || null, // ADDED THIS
    courseId,
  ]
);

    // 4. SYNC NAVIGATION (If slug changed)
    if (oldSlug && oldSlug !== slug) {
      const oldUrl = `/courses/${oldSlug}`;
      const newUrl = `/courses/${slug}`;
      await db.query("UPDATE nav_items SET url = ? WHERE url = ?", [newUrl, oldUrl]);
    }

    // 5. REVALIDATE CACHE
    revalidateTag("bootstrap", "max");

    // 6. FETCH UPDATED COURSE & RETURN
    // Make sure to SELECT the new fields so the frontend gets them back
  const [rows]: any = await db.query(
  "SELECT id, title, slug, short_description, category_id, thumbnail FROM courses WHERE id = ? LIMIT 1",
  [courseId]
);

    if (!rows.length) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const course = rows[0];
    return NextResponse.json({
      id: Number(course.id),
      title: course.title,
      slug: course.slug,
      short_description: course.short_description,
      category_id: course.category_id ? Number(course.category_id) : null,
      
     
      thumbnail: course.thumbnail || null,
    });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to update course" }, { status: 500 });
  }
}



export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Get the slug of the course before we delete it
    const [courseRows]: any = await db.query(
      "SELECT slug FROM courses WHERE id = ?", 
      [id]
    );

    if (courseRows.length > 0) {
      const slug = courseRows[0].slug;
      const targetUrl = `/courses/${slug}`;

      // 2. Remove any navigation items pointing to this course
      // This handles both parent links and child links
      await db.query(
        "DELETE FROM nav_items WHERE url = ?", 
        [targetUrl]
      );
      
      const [navItems]: any = await db.query("SELECT id FROM nav_items WHERE url = ?", [targetUrl]);

if (navItems.length > 0) {
    const navId = navItems[0].id;
    // Delete the item AND any children that belong to it
    await db.query("DELETE FROM nav_items WHERE id = ? OR parent_id = ?", [navId, navId]);
}
    }

    // 3. Now delete the course
    await db.query("DELETE FROM courses WHERE id = ?", [id]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}