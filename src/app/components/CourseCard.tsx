'use client';
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';

function renderDelta(delta: any) {
  if (!delta) return "";

  const ops = Array.isArray(delta) ? delta : delta.ops;
  if (!ops) return "";

  const converter = new QuillDeltaToHtmlConverter(ops, {
    paragraphTag: "p",
  });

  return converter.convert();
}


export default function CourseCard({ course }: { course: any }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

const imageUrl = course.thumbnail
  ? course.thumbnail.startsWith("http")
    ? course.thumbnail
    : new URL(course.thumbnail, process.env.NEXT_PUBLIC_BASE_URL).toString()
  : null;


  const courseHref = `/categories/${course.slug}`;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">

      {/* Thumbnail Container */}
      <div className="relative aspect-square w-full bg-gradient-to-br from-blue-500 to-indigo-600 overflow-hidden">
        {/* MAKE THE IMAGE CLICKABLE HERE */}
        <Link href={courseHref} className="block w-full h-full">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={course.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-white/30 text-6xl font-black select-none">
                {course.name.substring(0, 2).toUpperCase()}
              </span>
            </div>
          )}
        </Link>

        {/* Price Badge */}

      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <Link href={courseHref}>
          <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors cursor-pointer">
            {course.name}
          </h3>
        </Link>

        <div
          className="text-slate-600 text-sm line-clamp-2 mb-4 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{
            __html: course.content
              ? renderDelta(course.content)
              : "<p>No description available.</p>",
          }}
        />


        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Clock className="w-4 h-4" />
            <span>{course.duration || 'Instructor-led'}</span>
          </div>

          <Link
            href={courseHref}
            className="flex items-center gap-1 text-sm font-bold text-blue-600 hover:gap-2 transition-all"
          >
            Learn More <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}