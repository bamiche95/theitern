import db from "./db";
import { RowDataPacket } from "mysql2";
import { Course, CourseSection } from "@/types/course";

export async function getCourseById(courseId: number): Promise<Course | null> {
  // ✅ Added category_id to the SELECT fields
  const [courses] = await db.query<RowDataPacket[]>(
    "SELECT id, title, slug, thumbnail, short_description, category_id, published, price, payment_link FROM courses WHERE id = ?",
    [courseId]
  );

  if (courses.length === 0) return null;

  const course = courses[0] as Course;

  // Fetch sections for this course
  const [sections] = await db.query<RowDataPacket[]>(
    "SELECT * FROM course_sections WHERE course_id = ? ORDER BY section_order ASC",
    [courseId]
  );

  course.sections = sections as CourseSection[];

  return course;
}


export async function getCourseContent(courseId: number) {
  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT type, content FROM course_sections WHERE course_id = ?",
    [courseId]
  );

  const contentMap: Record<string, string> = {};

  rows.forEach(row => {
    contentMap[row.type] = row.content?.html || "";
  });

  return contentMap;
}


