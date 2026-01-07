import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    // 1. Define Static Pages
    const suggestions = [
      { label: "Home Page", url: "/" },
      { label: "About Us", url: "/about" },
      { label: "Contact Us", url: "/contact" },
      { label: "All Courses", url: "/courses" },
    ];

    // 2. Fetch Categories from the categories table
    const [categories]: any = await db.query("SELECT name, slug FROM categories");
    
    categories.forEach((cat: any) => {
      suggestions.push({
        label: `Category: ${cat.name}`,
        url: `/categories/${cat.slug}`
      });
    });

    // 3. Fetch Courses from the courses table
    const [courses]: any = await db.query("SELECT title, slug FROM courses");
    
    courses.forEach((course: any) => {
      suggestions.push({
        label: `Course: ${course.title}`,
        url: `/courses/${course.slug}`
      });
    });

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error("Link Suggestion Error:", error);
    return NextResponse.json({ error: "Failed to fetch suggestions" }, { status: 500 });
  }
}