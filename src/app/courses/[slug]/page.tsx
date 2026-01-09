// src/app/courses/[slug]/page.tsx
import db from "@/lib/db";
import { notFound } from "next/navigation";
import * as Icons from "lucide-react";
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
// Note: ReactPlayer is a client component, you may need a wrapper if using in Server Components
import NextLink from "next/link"; // ✅ Rename the Next.js Link to avoid conflict
import { ExternalLink } from "lucide-react"; // ✅ Only import specific icons needed
import TutorList from "@/app/components/TutorList";

function renderDelta(deltaOps: any) {
  if (!deltaOps) return "";
  const converter = new QuillDeltaToHtmlConverter(deltaOps, {});
  return converter.convert();
}


export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

// 1. Fetch Course along with category info
const [courseRows]: any = await db.query(`
  SELECT c.*, cat.enrollment_fee, cat.payment_link AS category_payment_link
  FROM courses c
  LEFT JOIN categories cat ON c.category_id = cat.id
  WHERE c.slug = ?
`, [slug]);

const course = courseRows[0];
console.log("Fetched Course:", course);
if (!course) notFound();
  // 2. Fetch Tutors
  const [tutors]: any = await db.query(`
    SELECT t.*, ct.role 
    FROM tutors t
    JOIN course_tutors ct ON t.id = ct.tutor_id
    WHERE ct.course_id = ?`, 
    [course.id]
  );

  // 3. Fetch Course Sections
  const [sectionRows]: any = await db.query(
    "SELECT * FROM course_sections WHERE course_id = ?",
    [course.id]
  );

  const sections = sectionRows.sort((a: any, b: any) => a.section_order - b.section_order);

  const sectionTitles: Record<string, string> = {
    introduction: "Module Overview",
    who_is_course_for: "Who Should Take This Module?",
    virtual_learning_info: "The Learning Experience",
    detailed_description: "Full Module Curriculum"
  };

  return (
    <main className="min-h-screen bg-white pb-20">
      <section className="relative h-[600px] flex items-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-20"
          >
            <source src="/uploads/tutor.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-3 gap-12 items-center w-full">
          <div className="lg:col-span-2 text-left">
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight text-white">
              {course.title}
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl leading-relaxed mb-8">
              {course.short_description}
            </p>
          </div>

          <div className="bg-white opacity-95 border border-slate-200 rounded-2xl p-8 shadow-2xl">
           
            <div className="text-4xl font-black mb-8 text-blue-600">${course.enrollment_fee}</div>
            
            {/* ✅ FIXED: Using NextLink (renamed) to avoid conflict with Lucide Link icon */}
            <NextLink 
              href={course.category_payment_link || "#"} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all text-center flex items-center justify-center gap-2 shadow-lg mb-6 active:scale-[0.98]"
            >
              Enroll in Course
            </NextLink>

            <div className="space-y-3 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                <Icons.ShieldCheck className="w-5 h-5 text-green-500 flex-shrink-0" /> 
                Instructor-led
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {sections.map((section: any) => {
            const contentData = typeof section.content === 'string' 
              ? JSON.parse(section.content) 
              : section.content;

            const htmlContent = renderDelta(contentData?.html?.ops);

            return (
              <div key={section.id} className="bg-white p-8 shadow-xl/30 shadow-blue-300 hover:shadow-lg transition-shadow duration-300 mb-20">
                <h2 className="text-2xl font-bold mb-6 text-slate-900 flex items-center gap-3">
                  <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                  {sectionTitles[section.type] || section.type.replace(/_/g, ' ')}
                </h2>

                <div 
                  className="prose prose-lg prose-slate max-w-none 
                             prose-p:text-slate-600 prose-p:leading-relaxed 
                             prose-strong:text-slate-900 prose-strong:font-bold
                             prose-ul:list-disc prose-li:text-slate-600"
                  dangerouslySetInnerHTML={{ __html: htmlContent }} 
                />
              </div>
            );
          })}
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 shadow-xl/20 border border-slate-100 rounded-xl">
            <h3 className="text-xl font-bold mb-6 text-slate-900">Your Instructors</h3>
            <div className="space-y-6">
             <TutorList tutors={tutors} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA Section */}
      <section className="relative mt-24 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
            Ready to Transform Your Skills?
          </h2>
     
          <NextLink 
            href={course.category_payment_link || "#"}
            target="_blank"
            className="inline-block px-12 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-slate-100 transition-all shadow-2xl active:scale-[0.98] text-lg"
          >
            Enroll Now at ${course.enrollment_fee}
          </NextLink>
        </div>
      </section>
    </main>
  );
}