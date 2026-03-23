'use client';

import { useBookingStore, TOURS_DATA } from '@/store/booking-store';
import TourCard from '@/components/TourCard';
import { MapPin, Check } from 'lucide-react';

const TOTAL_STEPS = 8;

export default function StepTours() {
  const { selectedTours, getTourExtrasPrice, currentStep } = useBookingStore();
  
  const selectedCount = selectedTours.length;
  const extrasPrice = getTourExtrasPrice();
  
  // Count total destinations selected
  const totalDestinations = selectedTours.reduce((acc, tour) => acc + tour.selectedDestinations.length, 0);

  return (
    <div className="animate-fade-in-up">
      {/* Header Section */}
      <header className="mb-12">
        <span className="text-[#b6004f] font-bold tracking-widest text-xs uppercase mb-2 block">
          Step {currentStep} of {TOTAL_STEPS}
        </span>
        <h2 className="text-4xl font-extrabold tracking-tight text-[#2c2f30] mb-4 leading-tight">
          Curate your experiences.
        </h2>
        <p className="text-[#595c5d] text-lg">
          Select the cultural and natural wonders you'd like to explore in Azerbaijan.
        </p>
      </header>

      {/* Tour cards */}
      <div className="space-y-12">
        {TOURS_DATA.map((tour) => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>

      {/* Summary Floating Card */}
      {selectedCount > 0 && (
        <div className="mt-16 bg-[#eff1f2] rounded-3xl p-6 border border-[#006a2e]/5">
          <h4 className="text-sm font-bold text-[#006a2e] uppercase tracking-widest mb-4">
            Tour Selection Summary
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-2xl shadow-sm">
              <p className="text-xs text-[#595c5d] mb-1">Total Tours</p>
              <p className="text-2xl font-extrabold text-[#2c2f30]">
                {String(selectedCount).padStart(2, '0')}
              </p>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm">
              <p className="text-xs text-[#595c5d] mb-1">Destinations</p>
              <p className="text-2xl font-extrabold text-[#b6004f]">
                {String(totalDestinations).padStart(2, '0')}
              </p>
            </div>
          </div>
          {extrasPrice > 0 && (
            <div className="mt-4 p-4 bg-[#ff8fa8]/20 rounded-2xl">
              <p className="text-sm text-[#660029]">
                <span className="font-bold">+${extrasPrice}</span> in optional add-ons selected
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
