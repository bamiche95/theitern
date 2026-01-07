// src/app/categories/[slug]/page.tsx
import db from "@/lib/db";
import { RowDataPacket } from "mysql2";
import ModuleCard from "@/app/components/ModuleCard";
import NextLink from "next/link"; 
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import { BookOpen, Users, Award } from 'lucide-react';
import Image from "next/image";
function renderDelta(deltaOps: any) {
  if (!deltaOps) return "";
  const converter = new QuillDeltaToHtmlConverter(deltaOps, {});
  return converter.convert();
}

async function getCategoryData(slug: string) {
  const [categories] = await db.query<RowDataPacket[]>(
    "SELECT id, name, enrollment_fee, payment_link, content, thumbnail FROM categories WHERE slug = ?",
    [slug]
  );

  if (categories.length === 0) return null;

  const category = categories[0];
  category.content = category.content ? JSON.parse(category.content) : null;

  const [courses] = await db.query<RowDataPacket[]>(
    "SELECT * FROM courses WHERE category_id = ? AND published = 1",
    [category.id]
  );

  return { category, courses };
}

export default async function CategoryPage({ 
  params 
}: { 
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params; 
  const data = await getCategoryData(slug);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white">
        <div className="text-center">
          <h1 className="text-5xl font-black text-slate-900 mb-4">Course Not Found</h1>
          <p className="text-slate-500 text-lg">The course you're looking for doesn't exist.</p>
          <NextLink href="/" className="inline-block mt-8 px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition">
            Back to Home
          </NextLink>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-16 md:py-24 px-4 md:px-6">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-72 md:w-96 h-72 md:h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-8 left-20 w-56 md:w-72 h-56 md:h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Content */}
            <div className="animate-in fade-in slide-in-from-left-8 duration-700">
              <div className="inline-block mb-4 md:mb-6">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-blue-500/20 border border-blue-400/50 rounded-full text-blue-300 text-xs md:text-sm font-semibold">
                  <BookOpen className="w-3 h-3 md:w-4 md:h-4" />
                  Professional Course
                </span>
              </div>
              
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-4 md:mb-6 leading-tight">
                {data.category.name}
              </h1>
              
              <p className="text-base md:text-lg lg:text-xl text-blue-100 mb-6 md:mb-8 leading-relaxed">
                Master in-demand skills with our comprehensive, industry-leading curriculum designed by experts.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 md:gap-6 mb-6 md:mb-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 md:p-3 bg-blue-500/20 rounded-lg flex-shrink-0">
                    <Users className="w-5 h-5 md:w-6 md:h-6 text-blue-300" />
                  </div>
                  <div>
                    <p className="text-blue-200 text-xs md:text-sm font-medium">Active Students</p>
                    <p className="text-white text-base md:text-lg font-bold">{data.courses.length}+ Modules</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 md:p-3 bg-blue-500/20 rounded-lg flex-shrink-0">
                    <Award className="w-5 h-5 md:w-6 md:h-6 text-blue-300" />
                  </div>
                  <div>
                    <p className="text-blue-200 text-xs md:text-sm font-medium">Certification</p>
                    <p className="text-white text-base md:text-lg font-bold">You'll be prepared to take the certification exam</p>
                  </div>
                </div>
              </div>

              <NextLink 
                href={data.category.payment_link || "#"}
                target="_blank"
                className="inline-flex items-center px-6 md:px-8 py-3 md:py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-all shadow-2xl shadow-blue-500/50 active:scale-95 text-base md:text-lg gap-2 w-full md:w-auto justify-center md:justify-start"
              >
                Enroll Now
                <span className="text-lg md:text-xl">→</span>
              </NextLink>
            </div>

            {/* Right Image */}
            {data.category.thumbnail && (
              <div className="relative group animate-in fade-in slide-in-from-right-8 duration-700 delay-100 mt-8 md:mt-0">
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl md:rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition duration-500"></div>
                <div className="relative w-full h-auto aspect-square max-w-xs sm:max-w-sm md:max-w-none mx-auto overflow-hidden rounded-xl md:rounded-2xl shadow-2xl border border-white/20 bg-white">
                  <img
                    src={data.category.thumbnail}
                    alt={data.category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        
        {/* Course Description */}
        <section className="mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="bg-white border border-slate-200 rounded-3xl p-10 shadow-lg hover:shadow-xl transition-shadow">
            <h2 className="text-3xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-blue-600" />
              About This Course
            </h2>
            <div 
              className="prose prose-lg max-w-none text-slate-700 leading-relaxed
                prose-headings:text-slate-900 prose-headings:font-bold
                prose-a:text-blue-600 prose-a:font-semibold
                prose-strong:text-slate-900
                prose-code:bg-slate-100 prose-code:rounded prose-code:px-2 prose-code:py-1"
              dangerouslySetInnerHTML={{ __html: renderDelta(data.category.content?.ops) }} 
            />
          </div>
        </section>

        {/* Divider */}
        <div className="relative my-20">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-6 bg-white text-slate-600 font-bold text-lg">
              Course Modules
            </span>
          </div>
        </div>

        {/* Modules Grid */}
        {data.courses.length > 0 ? (
          <section className="animate-in fade-in duration-700">
            <h2 className="text-3xl font-black text-slate-900 mb-12">
              {data.courses.length} {data.courses.length === 1 ? 'Module' : 'Modules'} Included
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.courses.map((course: any, index: number) => (
                <div
                  key={course.id}
                  className="animate-in fade-in slide-in-from-bottom-6 duration-500"
                  style={{
                    transitionDelay: `${index * 75}ms`,
                  }}
                >
                  <ModuleCard course={course} />
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section className="animate-in fade-in scale-in-95 duration-500">
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl p-20 text-center border-2 border-dashed border-slate-300">
              <div className="inline-block mb-6 p-4 bg-slate-200 rounded-full">
                <BookOpen className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-700 mb-3">
                No Modules Available Yet
              </h3>
              <p className="text-slate-500 text-lg">
                This course is currently being prepared. Check back soon!
              </p>
            </div>
          </section>
        )}
      </div>

      {/* CTA Section */}
      <section className="relative mt-32 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight animate-in fade-in duration-700">
            Start Your Learning Journey Today
          </h2>
          
          <p className="text-xl text-blue-100 mb-10 animate-in fade-in duration-700 delay-100">
            Join thousands of students mastering their skills with our world-class instructors.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in duration-700 delay-200">
            <NextLink 
              href={data.category.payment_link || "#"}
              target="_blank"
              className="px-12 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-slate-100 transition-all shadow-2xl active:scale-95 text-lg"
            >
              Enroll Now at ${data.category.enrollment_fee} Per Month
            </NextLink>
            
            <NextLink 
              href="/allcourses"
              className="px-12 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all text-lg"
            >
              Back to Courses
            </NextLink>
          </div>
        </div>
      </section>

      {/* Animations */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}