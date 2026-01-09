"use client";

import { useState } from "react";

export default function TutorList({ tutors }: { tutors: any[] }) {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  return (
    <div className="space-y-6">
      {tutors.map((tutor) => (
        <div
          key={tutor.id}
          className="pb-6 border-b border-slate-100 last:border-b-0 last:pb-0"
        >
          <div className="flex gap-4 mb-4">
            <div className="w-16 h-16 rounded-xl bg-slate-200 overflow-hidden flex-shrink-0 border-2 border-white shadow-md">
              {tutor.profile_image ? (
                <img
                  src={tutor.profile_image}
                  alt={tutor.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 font-bold text-lg">
                  {tutor.name.charAt(0)}
                </div>
              )}
            </div>

            <div>
              <h4 className="font-bold text-base text-slate-900">
                {tutor.name}
              </h4>
              <p className="text-blue-600 text-xs font-bold uppercase tracking-wider">
                {tutor.role || tutor.expertise}
              </p>
            </div>
          </div>

          <div className="text-slate-600 text-sm leading-relaxed">
            <p className={expanded[tutor.id] ? "" : "line-clamp-3"}>
              {tutor.bio}
            </p>

            {tutor.bio?.length > 120 && (
              <button
                onClick={() =>
                  setExpanded((prev) => ({
                    ...prev,
                    [tutor.id]: !prev[tutor.id],
                  }))
                }
                className="mt-2 text-blue-600 text-xs font-bold hover:underline"
              >
                {expanded[tutor.id] ? "Show less" : "Read more"}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
