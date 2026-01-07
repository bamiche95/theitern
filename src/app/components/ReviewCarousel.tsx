// src/app/components/ReviewCarousel.tsx
"use client";
import { useEffect, useState, useRef } from "react";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";

const styles = `
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .review-card {
    animation: slideIn 0.5s ease-out;
  }

  .carousel-scroll {
    scroll-behavior: smooth;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .carousel-scroll::-webkit-scrollbar {
    display: none;
  }

  .dot {
    transition: all 0.3s ease;
  }

  .dot.active {
    background-color: rgb(37, 99, 235);
    transform: scale(1.3);
  }

  .dot:not(.active) {
    background-color: rgb(203, 213, 225);
  }
`;

export default function ReviewCarousel() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetch("/api/reviews?approved=true")
      .then(res => res.json())
      .then(data => setReviews(data.reviews || []));
  }, []);

  // Auto-scroll effect
  useEffect(() => {
    if (!autoPlay || reviews.length === 0) return;

    autoPlayTimerRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % reviews.length);
    }, 5000); // Change slide every 5 seconds

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [autoPlay, reviews.length]);

  // Scroll to current index
  useEffect(() => {
    if (scrollContainerRef.current && reviews.length > 0) {
      const cardWidth = scrollContainerRef.current.children[0]?.clientWidth || 300;
      const gap = 24; // gap-6 = 24px
      scrollContainerRef.current.scrollLeft = currentIndex * (cardWidth + gap);
    }
  }, [currentIndex, reviews]);

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + reviews.length) % reviews.length);
    setAutoPlay(false);
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % reviews.length);
    setAutoPlay(false);
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    setAutoPlay(false);
  };

  // Resume autoplay after user interaction
  useEffect(() => {
    const resumeAutoPlayTimer = setTimeout(() => {
      setAutoPlay(true);
    }, 8000); // Resume after 8 seconds of no interaction

    return () => clearTimeout(resumeAutoPlayTimer);
  }, [currentIndex]);

  if (reviews.length === 0) return null;

  return (
    <>
      <style>{styles}</style>
      <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
     

          {/* Carousel Container */}
          <div className="relative">
            {/* Carousel */}
           <div
  ref={scrollContainerRef}
  className="
    carousel-scroll
    flex gap-4 md:gap-6
    overflow-x-auto
    pb-4
    snap-x snap-mandatory
  "
>
                {reviews.map((review: any) => (
    <div
      key={review.id}
      className="
        review-card
        snap-center
        min-w-[85%]
        sm:min-w-[70%]
        md:min-w-[400px]
        bg-white
        p-6 md:p-8
        rounded-2xl
        shadow-md
        
        hover:shadow-lg
        transition
        flex flex-col justify-between
      "
    >
                  <div>
                    <Quote className="w-8 h-8 text-blue-100 mb-4" />
                    <p className="text-slate-600 italic mb-6 leading-relaxed">"{review.content}"</p>
                    {review.rating && (
                      <div className="flex gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`text-lg ${i < review.rating ? "text-yellow-400" : "text-slate-300"}`}>
                            ★
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
                      {review.full_name[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{review.full_name}</h4>
                      <p className="text-xs text-slate-500">
                        {review.position} {review.company && `at ${review.company}`}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            {reviews.length > 1 && (
              <>
               {/* Navigation Arrows (desktop only) */}
<div className="hidden md:block">
  <button
    onClick={handlePrev}
    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-20 p-2 bg-blue-600 text-white rounded-full"
  >
    <ChevronLeft className="w-6 h-6" />
  </button>

  <button
    onClick={handleNext}
    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-20 p-2 bg-blue-600 text-white rounded-full"
  >
    <ChevronRight className="w-6 h-6" />
  </button>
</div>

              </>
            )}
          </div>

          {/* Dot Navigation */}
          {reviews.length > 1 && (
            <div className="flex justify-center gap-3 mt-10">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                   className={`
    dot
    w-4 h-4
    rounded-full
    ${index === currentIndex ? "active" : ""}
  `}
  aria-label={`Go to review ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Auto-play indicator */}
          <div className="text-center mt-6 text-sm text-slate-500">
            {autoPlay}
          </div>
        </div>
      </section>
    </>
  );
}