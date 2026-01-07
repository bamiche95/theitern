import { getAllCourses } from "@/lib/courses";
import CourseCard from "@/app/components/CourseCard";
export default async function AllCoursesPage() {
  const courses = await getAllCourses();
    return (
    <main className="min-h-screen bg-white">
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>               
                <h2 className="text-3xl font-bold text-slate-900">All Courses</h2>
                <p className="text-slate-500 mt-2">Browse our complete list of courses.</p>
            </div>
            <div className="h-px flex-1 bg-slate-100 mx-8 hidden md:block" />
            <span className="text-sm font-medium text-slate-400">Showing {courses.length} results</span>
        </div>
              {courses.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                      {courses.map((course: any) => (
                        <CourseCard key={course.id} course={course} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                      <p className="text-slate-400">No courses available at the moment. Check back soon!</p>
                    </div>
                  )}
        </section>
    </main>
  );
}
