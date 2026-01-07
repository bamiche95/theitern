import Link from "next/link";
import db from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { Course } from "@/types/course";
import { Plus, Edit2, CheckCircle, Circle, Users, CreditCard } from "lucide-react";
import DeleteCourseButton from "./DeleteCourseButton"; // Import the new component
async function getCourses(): Promise<any[]> {
  const [rows] = await db.query<RowDataPacket[]>(`
    SELECT 
      c.id, 
      c.title, 
      c.slug, 
      c.thumbnail, 
      c.published,
      c.price,
      c.payment_link,
      GROUP_CONCAT(t.name SEPARATOR ', ') AS tutor_names
    FROM courses c
    LEFT JOIN course_tutors ct ON c.id = ct.course_id
    LEFT JOIN tutors t ON ct.tutor_id = t.id
    GROUP BY c.id
    ORDER BY c.id DESC
  `);
  return rows;
}

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Modules</h1>
          <p className="text-slate-600">Manage and edit your Module content</p>
        </div>

        {/* Action Bar */}
        <div className="mb-8 flex justify-end">
          <Link href="/admin/courses/new">
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
              <Plus className="w-5 h-5" />
              Add New Module
            </button>
          </Link>
        </div>

        {/* Courses List */}
        {courses.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <p className="text-slate-600 text-lg mb-6">No modules yet. Start by creating your first module!</p>
            <Link href="/admin/courses/new">
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
                <Plus className="w-5 h-5" />
                Create First Module
              </button>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Title</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Slug</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Tutors</th>
                    

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course, index) => (
                    <tr 
                      key={course.id}
                      className="border-b border-slate-200 hover:bg-slate-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900">{course.title}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-md font-mono text-sm">
                          {course.slug}
                        </span>
                      </td>
                      <td className="px-6 py-4">
  <div className="flex items-center gap-2">
    <Users className="w-4 h-4 text-slate-400" />
    <span className={`text-sm ${course.tutor_names ? 'text-slate-700' : 'text-slate-400 italic'}`}>
      {course.tutor_names || "Not assigned"}
    </span>
  </div>
</td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 w-fit px-3 py-1 rounded-md"
                             style={{
                               backgroundColor: course.published ? "#dcfce7" : "#fef3c7",
                             }}>
                          {course.published ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span className="text-green-700 text-sm font-medium">Published</span>
                            </>
                          ) : (
                            <>
                              <Circle className="w-4 h-4 text-amber-600" />
                              <span className="text-amber-700 text-sm font-medium">Draft</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Link href={`/admin/courses/${course.id}`}>
                          <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition-colors duration-200">
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </button>
                        </Link>
                        <DeleteCourseButton 
                        courseId={course.id} 
                        courseTitle={course.title} 
                      />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-slate-200">
              {courses.map((course) => (
                <div key={course.id} className="p-6 hover:bg-slate-50 transition-colors duration-150">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Title</p>
                      <p className="font-semibold text-slate-900">{course.title}</p>
                    </div>

                    <div>
                      <p className="text-sm text-slate-600 mb-1">Slug</p>
                      <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-md font-mono text-sm inline-block">
                        {course.slug}
                      </span>
                    </div>

                    <div>
                      <p className="text-sm text-slate-600 mb-2">Status</p>
                      <div className="flex items-center gap-2 w-fit px-3 py-1 rounded-md"
                           style={{
                             backgroundColor: course.published ? "#dcfce7" : "#fef3c7",
                           }}>
                        {course.published ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-green-700 text-sm font-medium">Published</span>
                          </>
                        ) : (
                          <>
                            <Circle className="w-4 h-4 text-amber-600" />
                            <span className="text-amber-700 text-sm font-medium">Draft</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200">
                      <Link href={`/admin/courses/${course.id}`}>
                        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition-colors duration-200">
                          <Edit2 className="w-4 h-4" />
                          Edit Course
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Stats */}
        {courses.length > 0 && (
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow p-6 text-center">
              <p className="text-slate-600 text-sm font-medium mb-2">Total Courses</p>
              <p className="text-3xl font-bold text-slate-900">{courses.length}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-6 text-center">
              <p className="text-slate-600 text-sm font-medium mb-2">Published</p>
              <p className="text-3xl font-bold text-green-600">{courses.filter(c => c.published).length}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-6 text-center">
              <p className="text-slate-600 text-sm font-medium mb-2">Drafts</p>
              <p className="text-3xl font-bold text-amber-600">{courses.filter(c => !c.published).length}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}