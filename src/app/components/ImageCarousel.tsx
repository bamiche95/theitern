"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
interface CarouselItem {
  id: number;
  image_url: string;
  link_url?: string | null;
}

export default function ImageCarousel({ settings }: { settings: any }) {
  const [items, setItems] = useState<CarouselItem[]>([]);
  const [index, setIndex] = useState(0);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/carousel")
      .then(res => res.json())
      .then(data => setItems(data.images || []));
  }, []);

  useEffect(() => {
    if (!items.length) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [items]);

  const handleImageClick = (imageUrl: string, linkUrl?: string | null) => {
    if (!linkUrl) {
      setEnlargedImage(imageUrl);
    }
  };

  if (!items.length) return null;

  return (
    <section className="w-full bg-gradient-to-b from-slate-50 to-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block mb-4">
            <span className="text-blue-600 font-bold tracking-widest text-xs uppercase px-4 py-2 bg-blue-50 rounded-full">
             {settings.Image_slides_tagline_title}
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight mb-4">
           {settings.Image_slides_title1}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
              {settings.Image_slides_title2}
            </span>
          </h2>
          <p className="text-lg text-slate-600">{settings.Image_slides_subtitle}</p>
        </div>

        {/* Carousel Container */}
       {/* Carousel Container */}
<div className="relative group overflow-hidden px-4">
  <div
    className="flex transition-transform duration-700 ease-out my-8"
    style={{
      // Move by 100% of the container width per index
      transform: `translateX(-${index * 100}%)`,
    }}
  >
    {items.map((item) => {
      const Card = (
        <div 
          className="w-full flex-shrink-0 px-2" // Each item takes full width of container
          onClick={() => handleImageClick(item.image_url, item.link_url)}
        >
          <div className="relative aspect-square max-w-[500px] mx-auto bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group/card cursor-pointer transform hover:scale-105">
            <img
              src={item.image_url}
              alt="carousel item"
              className="w-full h-full object-contain transition-transform duration-300 group-hover/card:scale-110"
            />
            {!item.link_url && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover/card:bg-black/40 transition-all duration-300">
                <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
              </div>
            )}
          </div>
        </div>
      );

      return (
        <div key={item.id} className="w-full flex-shrink-0">
          {item.link_url ? (
            <a href={item.link_url} target="_blank" rel="noopener noreferrer" className="block">
              {Card}
            </a>
          ) : (
            Card
          )}
        </div>
      );
    })}
  </div>
  
 

          {/* Navigation Buttons */}
          <button
            onClick={() =>
              setIndex((index - 1 + items.length) % items.length)
            }
            className="absolute -left-5 top-1/2 -translate-y-1/2 bg-white shadow-lg hover:shadow-xl text-slate-900 w-12 h-12 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-blue-600 hover:text-white z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={() => setIndex((index + 1) % items.length)}
            className="absolute -right-5 top-1/2 -translate-y-1/2 bg-white shadow-lg hover:shadow-xl text-slate-900 w-12 h-12 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-blue-600 hover:text-white z-10"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === index
                    ? "bg-blue-600 w-8"
                    : "bg-slate-300 w-2 hover:bg-slate-400"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {enlargedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setEnlargedImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={enlargedImage}
              alt="enlarged view"
              className="max-w-full max-h-full object-contain rounded-xl"
            />
            <button
              onClick={() => setEnlargedImage(null)}
              className="absolute -top-12 right-0 bg-white/10 hover:bg-white/20 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}