'use client';

import { useState } from 'react';
import { useBookingStore } from '@/store/booking-store';
import { ArrowLeft, ArrowRight, Loader2, Send } from 'lucide-react';

const TOTAL_STEPS = 10;

export default function BottomNav() {
  const { 
    currentStep, 
    setCurrentStep, 
    getStepValidation, 
    markStepComplete,
    getTotalPrice,
    getTripDuration,
    submitBooking,
    isSubmitted,
  } = useBookingStore();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validation = getStepValidation(currentStep);
  const isFirstStep = currentStep === 1;
  const isCheckoutStep = currentStep === 9;
  const isSuccessStep = currentStep === 10;
  const tripDuration = getTripDuration();
  const totalPrice = getTotalPrice();

  if (isSuccessStep && isSubmitted) return null;

  const handleBack = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = async () => {
    if (!validation.isValid) return;
    
    markStepComplete(currentStep);
    
    if (isCheckoutStep) {
      setIsSubmitting(true);
      try {
        await submitBooking();
        setCurrentStep(10);
      } catch (error) {
        console.error('Submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }
    
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const getButtonText = () => {
    if (isSubmitting) return 'Submitting...';
    if (isCheckoutStep) return 'Submit Request';
    return 'Next';
  };

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex flex-col bg-white/80 backdrop-blur-xl shadow-[0_-8px_24px_rgba(44,47,48,0.06)] rounded-t-3xl border-t border-zinc-100">
      {/* Price preview */}
      {(tripDuration > 0 || totalPrice > 0) && (
        <div className="px-6 py-3 flex justify-between items-center border-b border-zinc-100">
          {tripDuration > 0 && (
            <span className="text-sm text-[#595c5d] font-medium">
              {tripDuration} {tripDuration === 1 ? 'day' : 'days'}
            </span>
          )}
          {totalPrice > 0 && (
            <span className="text-lg font-extrabold text-[#2c2f30]">
              ${totalPrice.toLocaleString()}
            </span>
          )}
        </div>
      )}
      
      {/* Navigation buttons */}
      <div className="px-6 py-4 pb-safe flex justify-between items-center gap-4">
        {/* Back Button */}
        <button
          onClick={handleBack}
          disabled={isFirstStep || isSubmitting}
          className={`
            flex items-center justify-center gap-2 
            border rounded-2xl px-8 py-4 min-h-[56px]
            font-semibold text-sm
            transition-all active:scale-[0.98] duration-200
            ${isFirstStep || isSubmitting
              ? 'text-zinc-300 border-zinc-100 cursor-not-allowed' 
              : 'text-zinc-500 border-zinc-200 hover:border-zinc-300 hover:brightness-110'
            }
          `}
        >
          <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
          Back
        </button>
        
        {/* Next/Submit Button */}
        <button
          onClick={handleNext}
          disabled={!validation.isValid || isSubmitting}
          className={`
            flex-1 flex items-center justify-center gap-2
            rounded-2xl px-8 py-4 min-h-[56px]
            font-semibold text-sm
            transition-all active:scale-[0.98] duration-200
            ${validation.isValid && !isSubmitting
              ? 'bg-gradient-to-br from-[#25D366] to-[#006a2e] text-white shadow-lg shadow-emerald-500/20 hover:brightness-110'
              : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
            }
          `}
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin" strokeWidth={1.5} />
          ) : isCheckoutStep ? (
            <Send className="w-5 h-5" strokeWidth={1.5} />
          ) : null}
          {getButtonText()}
          {!isSubmitting && !isCheckoutStep && validation.isValid && (
            <ArrowRight className="w-5 h-5" strokeWidth={1.5} />
          )}
        </button>
      </div>
      
      {/* Validation error */}
      {!validation.isValid && validation.error && (
        <div className="absolute -top-12 left-6 right-6 text-center">
          <span className="inline-block px-4 py-2 bg-[#f95630] text-white text-xs font-semibold rounded-2xl shadow-lg">
            {validation.error}
          </span>
        </div>
      )}
    </nav>
  );
}
