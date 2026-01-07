"use client";
import dynamic from "next/dynamic";
import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { UserCheck } from "lucide-react";
const Editor = dynamic(() => import("@/app/components/Editor"), { 
  ssr: false,
  loading: () => <p className="text-slate-500">Loading Editor...</p>,
});

export default function CourseContentEditor() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const courseId = Number(id);

  const [introduction, setIntroduction] = useState<any>(null);
  const [details, setDetails] = useState<any>(null);
  const [whoFor, setWhoFor] = useState<any>(null);
  const [virtualInfo, setVirtualInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
const [availableTutors, setAvailableTutors] = useState<any[]>([]);
  const [selectedTutorIds, setSelectedTutorIds] = useState<number[]>([]);
  useEffect(() => {
    async function fetchContent() {
      try {
        const res = await fetch(`/api/courses/${courseId}/content`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();

        setIntroduction(data.introduction?.html || data.introduction || { ops: [] });
        setDetails(data.detailed_description?.html || data.detailed_description || { ops: [] });
        setWhoFor(data.who_is_course_for?.html || data.who_is_course_for || { ops: [] });
        setVirtualInfo(data.virtual_learning_info?.html || data.virtual_learning_info || { ops: [] });

      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    if (courseId) fetchContent();
  }, [courseId]);

  // Memoize the defaultValues to prevent unnecessary re-renders
  const memoizedIntroduction = useMemo(() => introduction, [introduction]);
  const memoizedDetails = useMemo(() => details, [details]);
  const memoizedWhoFor = useMemo(() => whoFor, [whoFor]);
  const memoizedVirtualInfo = useMemo(() => virtualInfo, [virtualInfo]);
useEffect(() => {
    async function initData() {
      try {
        // Fetch Content & Assigned Tutors
        const contentRes = await fetch(`/api/courses/${courseId}/content`);
        const contentData = await contentRes.json();
        
        const s = contentData.sections;
        setIntroduction(s.introduction?.html || s.introduction || { ops: [] });
        setDetails(s.detailed_description?.html || s.detailed_description || { ops: [] });
        setWhoFor(s.who_is_course_for?.html || s.who_is_course_for || { ops: [] });
        setVirtualInfo(s.virtual_learning_info?.html || s.virtual_learning_info || { ops: [] });
        setSelectedTutorIds(contentData.tutorIds || []);

        // Fetch All Available Tutors for the dropdown
        const tutorsRes = await fetch('/api/tutors');
        const tutorsData = await tutorsRes.json();
        setAvailableTutors(tutorsData);

      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    if (courseId) initData();
  }, [courseId]);


async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/courses/${courseId}/content`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sections: {
            introduction,
            detailed_description: details,
            who_is_course_for: whoFor,
            virtual_learning_info: virtualInfo,
          },
          tutorIds: selectedTutorIds
        }),
      });
      if ((await res.json()).success) router.push(`/admin/courses/${courseId}`);
    } catch (err) { alert("Error saving"); }
    finally { setSaving(false); }
  }

  const toggleTutor = (id: number) => {
    setSelectedTutorIds(prev => 
      prev.includes(id) ? prev.filter(tId => tId !== id) : [...prev, id]
    );
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-600 text-lg">Loading content...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Edit Module Content</h1>
          <p className="text-slate-600">Customize your module information below</p>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-10">
          <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 mb-4 text-slate-900 font-bold text-lg">
              <UserCheck className="w-5 h-5 text-blue-600" />
              Assign Tutors
            </div>
            <p className="text-sm text-slate-500 mb-4">Select one or more tutors for this Module</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-2">
              {availableTutors.map((tutor) => (
                <label 
                  key={tutor.id} 
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedTutorIds.includes(tutor.id) 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={selectedTutorIds.includes(tutor.id)}
                    onChange={() => toggleTutor(tutor.id)}
                  />
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200">
                    <img src={tutor.profile_image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{tutor.name}</p>
                    <p className="text-xs text-slate-500">{tutor.expertise}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Introduction Section */}
          <div>
            <label className="block text-lg font-semibold text-slate-900 mb-3">
              Introduction
            </label>
            <p className="text-sm text-slate-500 mb-4">
              Brief overview of your module
            </p>
            <Editor defaultValue={memoizedIntroduction} onTextChange={setIntroduction} />
          </div>

          {/* Detailed Description Section */}
          <div>
            <label className="block text-lg font-semibold text-slate-900 mb-3">
              Detailed Description
            </label>
            <p className="text-sm text-slate-500 mb-4">
              In-depth information about this Module
            </p>
            <Editor defaultValue={memoizedDetails} onTextChange={setDetails} />
          </div>

          {/* Who is this course for Section */}
          <div>
            <label className="block text-lg font-semibold text-slate-900 mb-3">
              Who is this Module for?
            </label>
            <p className="text-sm text-slate-500 mb-4">
              Target audience and prerequisites
            </p>
            <Editor defaultValue={memoizedWhoFor} onTextChange={setWhoFor} />
          </div>

          {/* Virtual Learning Info Section */}
          <div>
            <label className="block text-lg font-semibold text-slate-900 mb-3">
              Virtual Learning Information
            </label>
            <p className="text-sm text-slate-500 mb-4">
              Details about online access and participation
            </p>
            <Editor defaultValue={memoizedVirtualInfo} onTextChange={setVirtualInfo} />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-8 border-t border-slate-200">
            <button 
              onClick={() => router.back()}
              className="px-6 py-3 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors duration-200"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={saving}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
            >
              {saving && (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {saving ? "Saving..." : "Save All Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}