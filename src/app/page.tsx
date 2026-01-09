import { getSiteSettings } from "@/lib/settings";
import { getAllCourses } from "@/lib/courses";
import CourseCard from "@/app/components/CourseCard";
import { Sparkles } from "lucide-react";
import WhyChooseUs from "@/app/components/WhyChooseUs";
import ReviewCarousel from "./components/ReviewCarousel";
import HeroSection from "./components/HeroSection";
import YouTubeSection from "@/app/components/YouTubeSection";
import ImageCarousel from "@/app/components/ImageCarousel";

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
              <h2 className="text-4xl font-bold text-slate-900">{settings.courses_title}</h2>
              <p className="text-slate-500 mt-2">{settings.courses_subtitle}</p>
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
    w-full
    mx-auto
    scroll-mt-24
   bg-gradient-to-br from-slate-100 via-blue-50 to-slate-50
  "
        >

          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-4 max-w-7xl mx-auto">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                {settings.reviews_title}
              </h2>
              <p className="text-slate-500 mt-2">{settings.reviews_subtitle}</p>
            </div>

            <span className="text-sm font-medium text-slate-400 md:ml-auto">
              Showing {courses.length} results
            </span>
          </div>



          <div >
            <ReviewCarousel />
          </div>
        </section>
 <YouTubeSection settings={settings} />

 <div>

 </div>
 <ImageCarousel settings={settings} />  
      </main>
    </>
  );
}