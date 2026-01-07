export interface CourseSection {
  id: number;
  course_id: number;
  type: string; // hero, introduction, detailed_description, etc.
  section_order: number;
  content: any; // JSON content for the section
  created_at: string;
}

export interface Course {
  id: number;
  title: string;
  slug: string;
  thumbnail: string | null;
  published: boolean;
  sections?: CourseSection[]; // populated when fetching the course
    created_at: string;
      updated_at: string;
      short_description: string;
      category_id?: number | null; // Ensure this exists!
}
