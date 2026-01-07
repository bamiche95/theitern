// lib/courses.ts or lib/settings.ts
import db from "@/lib/db";


export const getAllCourses = async () => {
  try {
    const [rows]: any = await db.query(
      "SELECT * FROM categories "
    );
    return rows;

  } catch (error) {
    console.error("Error fetching categories(courses):", error);
    return [];
  }
};