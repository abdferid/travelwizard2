'use client';

import { useRef } from 'react';
import { useBookingStore, DINING_EXPERIENCES } from '@/store/booking-store';
import { Clock, Check, ChevronLeft, ChevronRight, ChevronsRight, Sparkles, Maximize2 } from 'lucide-react';

const TOTAL_STEPS = 10;

// Type badge
function TypeBadge({ type }: { type: string }) {
  const styles: Record<string, string> = {
    signature: 'bg-[#ff8fa8]/30 text-[#770031]',
    cultural: 'bg-[#5dfd8a]/30 text-[#005d27]',
    rooftop: 'bg-sky-100 text-sky-700',
    traditional: 'bg-amber-100 text-amber-700',
  };
  
  return (
    <span className={`px-3 py-1 rounded-lg text-[10px] font-extrabold tracking-wider uppercase ${styles[type] || 'bg-[#e6e8ea] text-[#595c5d]'}`}>
      {type}
    </span>
  );
}

// Dining card
function DiningCard({ 
  experience, 
  isSelected, 
  onToggle,
  adults,
  children: childCount
}: { 
  experience: typeof DINING_EXPERIENCES[0]; 
  isSelected: boolean;
  onToggle: () => void;
  adults: number;
  children: number;
}) {
  const totalPrice = experience.price * adults + (experience.price * 0.5 * childCount);

  return (
    <div
      onClick={onToggle}
      className={`
        min-w-[280px] snap-center cursor-pointer
        bg-white rounded-3xl overflow-hidden transition-all duration-300
        shadow-soft border
        ${isSelected 
          ? 'ring-2 ring-[#006a2e] shadow-emerald-500/10' 
          : 'border-[#abadae]/10 hover:shadow-md'
        }
      `}
    >
      {/* Image */}
      <div className="relative h-44">
        <img
          src={experience.image}
          alt={experience.name}
          className="w-full h-full object-cover"
        />
        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute top-4 right-4 w-8 h-8 bg-[#006a2e] rounded-full flex items-center justify-center shadow-lg">
            <Check className="w-5 h-5 text-white" strokeWidth={2} />
          </div>
        )}
        {/* Type badge */}
        <div className="absolute top-4 left-4">
          <TypeBadge type={experience.type} />
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); useBookingStore.getState().setFullscreenImage(experience.image); }}
          className="absolute bottom-4 right-4 w-9 h-9 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors shadow-md"
        >
          <Maximize2 className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        <h4 className="text-lg font-bold text-[#2c2f30] mb-2">{experience.name}</h4>
        <p className="text-sm text-[#595c5d] line-clamp-2 mb-3">{experience.description}</p>

        {/* Duration & highlight */}
        <div className="flex items-center gap-3 text-xs text-[#757778] mb-4">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
            {experience.duration}
          </span>
          {experience.highlights[0] && (
            <>
              <span>·</span>
              <span>{experience.highlights[0]}</span>
            </>
          )}
        </div>

        {/* Price */}
        <div className="pt-4 border-t border-[#eff1f2] flex justify-between items-baseline">
          <div>
            <span className="text-2xl font-extrabold text-[#2c2f30]">${experience.price}</span>
            <span className="text-sm text-[#595c5d]">/person</span>
          </div>
          {isSelected && (
            <span className="text-sm font-bold text-[#006a2e]">
              ${Math.round(totalPrice)} total
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function SkipButton({ onSkip }: { onSkip: () => void }) {
  return (
    <button
      onClick={onSkip}
      className="w-full py-4 px-6 border-2 border-dashed border-[#abadae]/30 rounded-2xl text-[#595c5d] hover:border-[#006a2e]/30 hover:text-[#006a2e] transition-all flex items-center justify-center gap-2 text-sm font-semibold"
    >
      <ChevronsRight className="w-5 h-5" strokeWidth={1.5} />
      Skip — no special dining
    </button>
  );
}

export default function StepDining() {
  const { 
    selectedDiningExperiences,
    toggleDiningExperience,
    getDiningExperiencesPrice,
    adults,
    children: childCount,
    skipStep,
    setCurrentStep,
    markStepComplete,
    currentStep,
  } = useBookingStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const totalDiningPrice = getDiningExperiencesPrice();
  const selectedExperiences = DINING_EXPERIENCES.filter(e => selectedDiningExperiences.includes(e.id));

  const handleSkip = () => {
    skipStep(8);
    markStepComplete(8);
    setCurrentStep(9);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -300 : 300,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <section className="mb-10">
        <span className="text-[#b6004f] font-bold tracking-widest text-xs uppercase mb-2 block">
          Step {currentStep} of {TOTAL_STEPS}
        </span>
        <h2 className="text-4xl font-extrabold tracking-tight text-[#2c2f30] mb-4 leading-tight">
          Taste of Azerbaijan.
        </h2>
        <p className="text-[#595c5d] text-lg">
          Add memorable culinary experiences to your journey.
        </p>
      </section>

      {/* Selection summary */}
      {selectedExperiences.length > 0 && (
        <div className="mb-8 p-5 bg-[#5dfd8a]/20 rounded-3xl border border-[#006a2e]/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-[#2c2f30]">
                {selectedExperiences.length} experience{selectedExperiences.length > 1 ? 's' : ''} selected
              </p>
              <p className="text-sm text-[#595c5d]">
                {selectedExperiences.map(e => e.name).join(', ')}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-extrabold text-[#006a2e]">${Math.round(totalDiningPrice)}</p>
              <p className="text-xs text-[#595c5d]">total</p>
            </div>
          </div>
        </div>
      )}

      {/* Carousel navigation */}
      <div className="flex justify-end gap-2 mb-4">
        <button
          onClick={() => scroll('left')}
          className="w-10 h-10 bg-white border border-[#abadae]/20 rounded-full flex items-center justify-center text-[#595c5d] hover:text-[#006a2e] hover:border-[#006a2e]/30 transition-all shadow-sm"
        >
          <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
        </button>
        <button
          onClick={() => scroll('right')}
          className="w-10 h-10 bg-white border border-[#abadae]/20 rounded-full flex items-center justify-center text-[#595c5d] hover:text-[#006a2e] hover:border-[#006a2e]/30 transition-all shadow-sm"
        >
          <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
        </button>
      </div>

      {/* Horizontal carousel */}
      <div 
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto no-scrollbar pb-4 -mx-6 px-6 snap-x snap-mandatory"
      >
        {DINING_EXPERIENCES.map((experience) => (
          <DiningCard
            key={experience.id}
            experience={experience}
            isSelected={selectedDiningExperiences.includes(experience.id)}
            onToggle={() => toggleDiningExperience(experience.id)}
            adults={adults}
            children={childCount}
          />
        ))}
      </div>

      {/* Skip button */}
      <div className="mt-8">
        <SkipButton onSkip={handleSkip} />
      </div>

      {/* Feature callout */}
      <div className="mt-8 p-5 bg-gradient-to-br from-[#ff8fa8]/20 to-[#ff8fa8]/10 rounded-3xl border border-[#b6004f]/10">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-[#ff8fa8]/30 flex items-center justify-center text-[#b6004f]">
            <Sparkles className="w-5 h-5" strokeWidth={1.5} />
          </div>
          <div>
            <h4 className="font-bold text-[#2c2f30]">Curated by Local Experts</h4>
            <p className="mt-1 text-sm text-[#595c5d]">
              Each experience features authentic cuisine, live cultural elements, and exclusive access not available to regular diners.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
