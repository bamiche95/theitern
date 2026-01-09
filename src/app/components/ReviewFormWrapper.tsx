// src/app/components/ReviewFormWrapper.tsx
"use client";

import { useState } from "react";
import ReviewForm from "./ReviewForm";

export default function ReviewFormWrapper() {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  return (
    <>
      {/* Review Form Modal */}
      <ReviewForm 
        isOpen={isReviewModalOpen} 
        onClose={() => setIsReviewModalOpen(false)} 
      />

      {/* Floating Review Button 
      
      
      */}
      <button
        onClick={() => setIsReviewModalOpen(true)}
        className=" px-6 py-3 bg-blue-600 text-white font-bold rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 flex items-center gap-2 z-30"
      >
        <span>✨</span>
        Write a Review
      </button>
      
    </>
  );
}