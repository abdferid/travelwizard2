'use client';

import { useRef } from 'react';
import { useBookingStore, HOTELS_DATA } from '@/store/booking-store';
import { Star, MapPin, Check, ChevronLeft, ChevronRight, ChevronsRight, Lightbulb, Maximize2 } from 'lucide-react';

const TOTAL_STEPS = 10;

// Star rating component
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-[#dadddf]'}`}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

// Hotel card
function HotelCard({ 
  hotel, 
  isSelected, 
  onSelect,
  nights 
}: { 
  hotel: typeof HOTELS_DATA[0]; 
  isSelected: boolean;
  onSelect: () => void;
  nights: number;
}) {
  const totalPrice = hotel.pricePerNight * Math.max(1, nights);

  return (
    <div
      onClick={onSelect}
      className={`
        min-w-[300px] snap-center cursor-pointer
        bg-white rounded-3xl overflow-hidden transition-all duration-300
        shadow-soft border
        ${isSelected 
          ? 'ring-2 ring-[#006a2e] shadow-emerald-500/10' 
          : 'border-[#abadae]/10 hover:shadow-md'
        }
      `}
    >
      {/* Image */}
      <div className="relative h-52">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute top-4 right-4 w-8 h-8 bg-[#006a2e] rounded-full flex items-center justify-center shadow-lg">
            <Check className="w-5 h-5 text-white" strokeWidth={2} />
          </div>
        )}
        {/* Rating overlay */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full">
          <StarRating rating={hotel.rating} />
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); useBookingStore.getState().setFullscreenImage(hotel.image); }}
          className="absolute bottom-4 right-4 w-9 h-9 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors shadow-md"
        >
          <Maximize2 className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-[#2c2f30] mb-1">{hotel.name}</h3>
        <div className="flex items-center gap-1 text-[#595c5d] text-sm mb-3">
          <MapPin className="w-4 h-4" strokeWidth={1.5} />
          <span>{hotel.location}</span>
        </div>
        
        <p className="text-sm text-[#595c5d] line-clamp-2 mb-4">{hotel.description}</p>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mb-4">
          {hotel.amenities.slice(0, 3).map((amenity, i) => (
            <span key={i} className="px-3 py-1 bg-[#eff1f2] text-[#595c5d] text-xs font-medium rounded-lg">
              {amenity}
            </span>
          ))}
          {hotel.amenities.length > 3 && (
            <span className="px-3 py-1 bg-[#eff1f2] text-[#757778] text-xs font-medium rounded-lg">
              +{hotel.amenities.length - 3}
            </span>
          )}
        </div>

        {/* Price */}
        <div className="pt-4 border-t border-[#eff1f2] flex justify-between items-baseline">
          <div>
            <span className="text-2xl font-extrabold text-[#2c2f30]">${hotel.pricePerNight}</span>
            <span className="text-sm text-[#595c5d]">/night</span>
          </div>
          {nights > 0 && (
            <span className="text-sm font-bold text-[#006a2e]">
              ${totalPrice} total
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
      Skip — I'll arrange my own accommodation
    </button>
  );
}

export default function StepHotels() {
  const { 
    selectedHotel, 
    setSelectedHotel, 
    getTripDuration,
    skipStep,
    setCurrentStep,
    markStepComplete,
    currentStep,
  } = useBookingStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const nights = Math.max(0, getTripDuration() - 1);
  const selectedHotelData = HOTELS_DATA.find(h => h.id === selectedHotel);
  const totalPrice = selectedHotelData ? selectedHotelData.pricePerNight * Math.max(1, nights) : 0;

  const handleSkip = () => {
    setSelectedHotel(null);
    skipStep(7);
    markStepComplete(7);
    setCurrentStep(8);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -320 : 320,
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
          Where will you stay?
        </h2>
        <p className="text-[#595c5d] text-lg">
          {nights > 0 ? `${nights} night${nights > 1 ? 's' : ''} of comfort awaits.` : 'Select your accommodation.'}
        </p>
      </section>

      {/* Selection summary */}
      {selectedHotel && selectedHotelData && (
        <div className="mb-8 p-5 bg-[#5dfd8a]/20 rounded-3xl border border-[#006a2e]/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={selectedHotelData.image} alt="" className="w-14 h-14 rounded-2xl object-cover" />
              <div>
                <p className="font-bold text-[#2c2f30]">{selectedHotelData.name}</p>
                <p className="text-sm text-[#595c5d]">${selectedHotelData.pricePerNight}/night</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-extrabold text-[#006a2e]">${totalPrice}</p>
              <p className="text-xs text-[#595c5d]">{nights} night{nights > 1 ? 's' : ''}</p>
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
        {HOTELS_DATA.map((hotel) => (
          <HotelCard
            key={hotel.id}
            hotel={hotel}
            isSelected={selectedHotel === hotel.id}
            onSelect={() => setSelectedHotel(hotel.id)}
            nights={nights}
          />
        ))}
      </div>

      {/* Skip button */}
      <div className="mt-8">
        <SkipButton onSkip={handleSkip} />
      </div>

      {/* Tip */}
      <div className="mt-8 flex items-start gap-4 p-4">
        <div className="p-3 rounded-2xl bg-[#e6e8ea] text-[#595c5d]">
          <Lightbulb className="w-5 h-5" strokeWidth={1.5} />
        </div>
        <div>
          <h5 className="font-bold text-sm text-[#2c2f30]">Good to know</h5>
          <p className="text-xs text-[#595c5d] leading-relaxed mt-1">
            Rates are per room. For larger groups, additional rooms will be arranged. Final configuration confirmed by our team.
          </p>
        </div>
      </div>
    </div>
  );
}
