'use client';

import { useEffect, useState } from 'react';
import { useBookingStore } from '@/store/booking-store';
import { X, RotateCcw, Maximize2 } from 'lucide-react';
import ProgressBar from './ProgressBar';
import BottomNav from './BottomNav';
import StepPartySize from './steps/StepPartySize';
import StepDates from './steps/StepDates';
import StepTransport from './steps/StepTransport';
import StepGuides from './steps/StepGuides';
import StepTours from './steps/StepTours';
import StepItinerary from './steps/StepItinerary';
import StepHotels from './steps/StepHotels';
import StepDining from './steps/StepDining';
import StepCheckout from './steps/StepCheckout';
import StepSuccess from './steps/StepSuccess';

const TOTAL_STEPS = 8;

export default function BookingWizard() {
  const { currentStep, isSubmitted } = useBookingStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#f5f6f7] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-[#006a2e] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#595c5d] text-sm font-medium">Loading your journey...</p>
        </div>
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <StepPartySize />;
      case 2: return <StepDates />;
      case 3: return <StepTransport />;
      case 4: return <StepGuides />;
      case 5: return <StepTours />;
      case 6: return <StepItinerary />;
      case 7: return <StepCheckout />;
      case 8: return <StepSuccess />;
      default: return <StepPartySize />;
    }
  };

  const isSuccessStep = currentStep === 8 && isSubmitted;

  return (
    <div className="min-h-screen bg-[#f5f6f7] flex flex-col">
      {/* Top Navigation Header */}
      {!isSuccessStep && (
        <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md after:content-[''] after:block after:h-[2px] after:w-full after:bg-gradient-to-r after:from-pink-500 after:to-orange-400">
          <div className="flex justify-between items-center h-16 px-6 max-w-2xl mx-auto w-full">
            <div className="flex items-center gap-4">
              <button className="text-zinc-500 hover:opacity-80 transition-opacity active:scale-95 duration-200">
                <X className="w-6 h-6" strokeWidth={1.5} />
              </button>
              <h1 className="font-extrabold text-lg text-emerald-600 tracking-tight">
                Azerbaijan Tour Planner
              </h1>
            </div>
            <ResetButton />
          </div>
        </header>
      )}

      {/* Sticky Progress Bar */}
      {!isSuccessStep && <ProgressBar />}

      {/* Main Content */}
      <main className={`flex-grow max-w-2xl mx-auto w-full px-6 ${isSuccessStep ? 'pt-8 pb-8' : 'pt-28 pb-36'}`}>
        {renderStep()}
      </main>

      {/* Bottom Navigation */}
      {!isSuccessStep && (
        <div className="max-w-2xl mx-auto w-full">
          <BottomNav />
        </div>
      )}

      {/* Global Image Modal */}
      <FullscreenImageModal />
    </div>
  );
}

function ResetButton() {
  const { resetBooking, isSubmitted } = useBookingStore();
  const [showConfirm, setShowConfirm] = useState(false);

  if (isSubmitted) return null;

  const handleReset = () => {
    resetBooking();
    setShowConfirm(false);
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowConfirm(false)}
          className="px-3 py-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-700 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleReset}
          className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
        >
          Reset
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-xl transition-all active:scale-95"
      aria-label="Reset booking"
    >
      <RotateCcw className="w-5 h-5" strokeWidth={1.5} />
    </button>
  );
}

function FullscreenImageModal() {
  const { fullscreenImage, setFullscreenImage } = useBookingStore();
  
  if (!fullscreenImage) return null;
  
  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 md:p-10 cursor-zoom-out animate-fade-in"
      onClick={() => setFullscreenImage(null)}
    >
      <button 
        type="button"
        className="absolute top-4 right-4 md:top-6 md:right-6 text-white/50 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors shadow-lg"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setFullscreenImage(null); }}
      >
        <X className="w-6 h-6" />
      </button>
      <img 
        src={fullscreenImage} 
        alt="Fullscreen zoom" 
        className="max-w-full max-h-full object-contain rounded border border-white/10 shadow-2xl cursor-default" 
        onClick={(e) => e.stopPropagation()} 
      />
    </div>
  );
}
