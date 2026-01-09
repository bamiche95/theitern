"use client";

interface YouTubeEmbedProps {
  url: string;
  title?: string;
}

function getYouTubeId(url: string) {
  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtube.com")) {
      return parsed.searchParams.get("v");
    }

    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.slice(1);
    }
  } catch {
    return null;
  }

  return null;
}

export default function YouTubeEmbed({ url, title }: YouTubeEmbedProps) {
  const videoId = getYouTubeId(url);

  if (!videoId) {
    return (
      <div className="w-full p-6 bg-slate-100 rounded-xl text-slate-500 text-center text-sm">
        Invalid YouTube link
      </div>
    );
  }

  return (
<div className="relative max-w-4xl mx-auto aspect-video rounded-2xl overflow-hidden shadow-xl bg-black">
 
  <iframe
    src={`https://www.youtube-nocookie.com/embed/${videoId}`}
    title={title || "YouTube video"}
    className="absolute inset-0 w-full h-full border-0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
    loading="lazy"
  />

</div>

  );
}
