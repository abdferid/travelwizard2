'use client';

import { useBookingStore } from '@/store/booking-store';

const TOTAL_STEPS = 8;

export default function ProgressBar() {
  const { currentStep, isSubmitted } = useBookingStore();

  if (currentStep === 8 && isSubmitted) return null;

  const progressPercent = (currentStep / TOTAL_STEPS) * 100;

  return (
    <div className="fixed top-16 left-0 w-full z-40 h-1.5 bg-[#e6e8ea]">
      <div 
        className="h-full bg-gradient-to-r from-pink-500 to-orange-400 transition-all duration-500 ease-out"
        style={{ width: `${progressPercent}%` }}
      />
    </div>
  );
}
