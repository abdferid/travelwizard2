'use client';

import { useBookingStore, TRANSPORT_OPTIONS } from '@/store/booking-store';
import { Users, Check, ChevronsRight, Eye, Info, Maximize2 } from 'lucide-react';

const TOTAL_STEPS = 10;

function SkipButton({ onSkip }: { onSkip: () => void }) {
  return (
    <button
      onClick={onSkip}
      className="w-full py-4 px-6 border-2 border-dashed border-[#abadae]/30 rounded-2xl text-[#595c5d] hover:border-[#006a2e]/30 hover:text-[#006a2e] transition-all flex items-center justify-center gap-2 text-sm font-semibold"
    >
      <ChevronsRight className="w-5 h-5" strokeWidth={1.5} />
      Skip — I'll arrange my own transport
    </button>
  );
}

export default function StepTransport() {
  const { 
    selectedTransport, 
    setSelectedTransport, 
    adults, 
    children,
    getTripDuration,
    skipStep,
    setCurrentStep,
    markStepComplete,
    currentStep,
  } = useBookingStore();
  
  const totalPeople = adults + children;
  const tripDuration = getTripDuration();

  const handleSkip = () => {
    setSelectedTransport(null);
    skipStep(3);
    markStepComplete(3);
    setCurrentStep(4);
  };

  return (
    <div className="animate-fade-in-up">
      {/* Header Section */}
      <section className="mb-10">
        <span className="text-[#b6004f] font-bold tracking-widest text-xs uppercase mb-2 block">
          Step {currentStep} of {TOTAL_STEPS}
        </span>
        <h2 className="text-4xl font-extrabold tracking-tight text-[#2c2f30] mb-4 leading-tight">
          Choose your vehicle.
        </h2>
        <p className="text-[#595c5d] text-lg">
          Select the most comfortable way to traverse the scenic landscapes of Azerbaijan.
        </p>
      </section>

      {/* Vehicle Selection List */}
      <div className="space-y-6">
        {TRANSPORT_OPTIONS.map((transport) => {
          const isSelected = selectedTransport === transport.id;
          const hasEnoughCapacity = transport.capacity >= totalPeople;
          const priceForTrip = transport.pricePerDay * Math.max(1, tripDuration);
          
          return (
            <label key={transport.id} className="block cursor-pointer group">
              <input 
                type="radio" 
                name="vehicle" 
                checked={isSelected}
                onChange={() => setSelectedTransport(transport.id)}
                disabled={!hasEnoughCapacity}
                className="hidden peer"
              />
              <div className={`
                relative bg-white p-6 rounded-[1.5rem] transition-all duration-300
                shadow-soft flex items-center gap-6
                ${isSelected 
                  ? 'ring-2 ring-[#006a2e] shadow-emerald-500/10' 
                  : hasEnoughCapacity
                    ? 'hover:shadow-xl hover:-translate-y-1 hover:border-transparent cursor-pointer'
                    : 'opacity-50 cursor-not-allowed'
                }
              `}>
                {/* Vehicle image */}
                <div className="relative w-32 h-24 bg-[#eff1f2] rounded-xl overflow-hidden flex-shrink-0 group/img">
                  <img 
                    src={transport.image} 
                    alt={transport.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110"
                  />
                  {/* Hover Buttons */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-1.5 backdrop-blur-[2px]">
                    <button 
                      type="button" 
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); useBookingStore.getState().setFullscreenImage(transport.image); }}
                      className="bg-white/95 text-[#006a2e] text-[10px] uppercase tracking-wider font-extrabold px-3 py-1.5 rounded-lg hover:bg-white hover:scale-105 transition-all shadow-sm flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" strokeWidth={2.5} /> Preview
                    </button>
                    <button 
                      type="button" 
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                      className="bg-[#006a2e]/95 text-white text-[10px] uppercase tracking-wider font-extrabold px-3 py-1.5 rounded-lg hover:bg-[#006a2e] hover:scale-105 transition-all shadow-sm flex items-center gap-1"
                    >
                      <Info className="w-3 h-3" strokeWidth={2.5} /> Details
                    </button>
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-[#2c2f30] mb-1">{transport.title}</h3>
                  <div className="flex items-center gap-2 text-[#595c5d]">
                    <Users className="w-4 h-4" strokeWidth={1.5} />
                    <span className="text-sm font-medium">Up to {transport.capacity} people</span>
                  </div>
                  <p className="text-xs text-[#595c5d]/70 mt-2">{transport.description}</p>
                  
                  {/* Price */}
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-lg font-extrabold text-[#2c2f30]">${transport.pricePerDay}</span>
                    <span className="text-sm text-[#595c5d]">/day</span>
                    {tripDuration > 0 && (
                      <span className="text-sm font-semibold text-[#006a2e] ml-2">
                        ${priceForTrip} total
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Selection indicator */}
                <div className={`
                  w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0
                  ${isSelected ? 'border-[#006a2e] bg-[#006a2e]' : 'border-[#abadae]'}
                `}>
                  {isSelected && <Check className="w-4 h-4 text-white" strokeWidth={2} />}
                </div>
              </div>
            </label>
          );
        })}
      </div>

      {/* Skip button */}
      <div className="mt-8">
        <SkipButton onSkip={handleSkip} />
      </div>
    </div>
  );
}
