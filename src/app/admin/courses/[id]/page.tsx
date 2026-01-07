import { getCourseById } from "@/lib/course";
import { Course } from "@/types/course";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Settings, FileText, BookOpen } from "lucide-react";
import db from "@/lib/db";
import { RowDataPacket } from "mysql2";

// Import your new components
import PublishToggle from "./PublishToggle";
import EditableCourseHeader from "./EditableCourseHeader";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CourseAdminPage({ params }: Props) {
  const { id } = await params;
  const courseId = Number(id);

  if (!Number.isInteger(courseId)) return notFound();

  // 1. Fetch Course and Categories in parallel for better performance
  const [course, [categories]] = await Promise.all([
    getCourseById(courseId),
    db.query<RowDataPacket[]>("SELECT id, name FROM categories")
  ]);
  if (!course) return notFound();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <Link 
          href="/admin/courses"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Courses
        </Link>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          
          {/* 2. REPLACED STATIC HEADER WITH EDITABLE HEADER */}
          <div className="mb-8">
            <EditableCourseHeader 
              course={course} 
              categories={categories as any} 
            />
            
            {/* Status Toggle stays outside the editable area for clarity */}
            <div className="mt-6 flex justify-end border-t border-slate-50 pt-6">
              <div className="flex flex-col items-end gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Course Status</span>
                <PublishToggle courseId={course.id} initialStatus={!!course.published} />
              </div>
            </div>
          </div>

          <hr className="my-8 border-slate-200" />

          {/* Management Section */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Next Steps: </h2>
            <p className="text-lg text-slate-900 mb-6">Click "Edit Content" to add or modify core modules details</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href={`/admin/courses/${course.id}/content`}>
                <button className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
                  <BookOpen className="w-5 h-5" />
                  Edit Module
                </button>
              </Link>

              <button disabled className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-slate-100 text-slate-400 rounded-lg font-semibold cursor-not-allowed opacity-50">
                <Settings className="w-5 h-5" />
                Settings
              </button>

              <button disabled className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-slate-100 text-slate-400 rounded-lg font-semibold cursor-not-allowed opacity-50">
                <FileText className="w-5 h-5" />
                SEO
              </button>

              <div className="text-center py-4 px-6 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                <p className="text-slate-500 text-sm">More actions coming soon</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <p className="text-slate-600 text-sm font-medium mb-2">Module ID</p>
            <p className="text-2xl font-bold text-slate-900">{course.id}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <p className="text-slate-600 text-sm font-medium mb-2">Status</p>
            <p className="text-2xl font-bold" style={{ color: course.published ? "#16a34a" : "#d97706" }}>
              {course.published ? "Live" : "Draft"}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <p className="text-slate-600 text-sm font-medium mb-2">Last Updated</p>
            <p className="text-sm font-medium text-slate-600">
              {new Date(course.updated_at || course.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}