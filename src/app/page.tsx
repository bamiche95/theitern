import { getSiteSettings } from "@/lib/settings";
import { getAllCourses } from "@/lib/courses";
import CourseCard from "@/app/components/CourseCard";
import { Sparkles } from "lucide-react";
import WhyChooseUs from "@/app/components/WhyChooseUs";
import ReviewCarousel from "./components/ReviewCarousel";
import ReviewFormWrapper from "./components/ReviewFormWrapper";
import HeroSection from "./components/HeroSection";

export default async function Home() {
  const [courses, settings] = await Promise.all([
    getAllCourses(),
    getSiteSettings()
  ]);


  return (
    <>
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <HeroSection settings={settings} />

        {/* Courses Grid */}
        <section id="courses" className="py-24 px-6 max-w-7xl mx-auto scroll-mt-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Featured Courses</h2>
              <p className="text-slate-500 mt-2">Explore our most popular learning paths.</p>
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

        <WhyChooseUs />

        {/* Reviews Section */}
      <section
  id="reviews"
  className="
    py-16 md:py-24
    px-4 sm:px-6
    max-w-7xl
    mx-auto
    scroll-mt-24
  "
>

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-4">
  <div>
    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
      What Our Students Say
    </h2>
    <p className="text-slate-500 mt-2 text-sm sm:text-base">
      See what our students have to say about their learning experience.
    </p>
  </div>

  <span className="text-sm font-medium text-slate-400 md:ml-auto">
    Showing {courses.length} results
  </span>
</div>


          <ReviewFormWrapper />
          <div>
            <ReviewCarousel />
          </div>
        </section>
      </main>
    </>
  );
}