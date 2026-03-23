'use client';

import { useState, useRef, useEffect } from 'react';
import { useBookingStore, Tour, Destination } from '@/store/booking-store';
import {
  Star,
  Images,
  X,
  CheckCircle,
  MapPin,
  Check,
  ChevronLeft,
  ChevronRight,
  Landmark,
  Building2,
  Utensils,
  Maximize2
} from 'lucide-react';

interface TourCardProps {
  tour: Tour;
}

// Helper to pick an icon based on destination name keywords
const getDestinationIcon = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes('museum') || lower.includes('palace')) return <Landmark className="w-6 h-6" />;
  if (lower.includes('lunch') || lower.includes('restaurant')) return <Utensils className="w-6 h-6" />;
  if (lower.includes('tower') || lower.includes('city')) return <Building2 className="w-6 h-6" />;
  if (lower.includes('mosque') || lower.includes('castle')) return <Landmark className="w-6 h-6" />;
  return <MapPin className="w-6 h-6" />;
};

export default function TourCard({ tour }: TourCardProps) {
  const [viewState, setViewState] = useState<'default' | 'gallery' | 'customize'>('default');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const {
    isTourSelected,
    selectTour,
    deselectTour,
    adults,
    children: childCount,
    getSelectedDestinations,
    isDestinationSelected,
    toggleDestination
  } = useBookingStore();

  const isSelected = isTourSelected(tour.id);
  const selectedDestinations = getSelectedDestinations(tour.id);

  // Auto-select tour when "Select Tour" is clicked and switch to customize
  const handleSelectTour = () => {
    if (!isSelected) {
      selectTour(tour.id);
    }
    setViewState('customize');
  };

  const scrollGallery = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Track scroll position for gallery dots
  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const index = Math.round(scrollRef.current.scrollLeft / scrollRef.current.clientWidth);
        setCurrentImageIndex(index);
      }
    };
    const el = scrollRef.current;
    if (el) el.addEventListener('scroll', handleScroll);
    return () => { if (el) el.removeEventListener('scroll', handleScroll); };
  }, [viewState]);

  // Calculate extras cost for the selected destinations in this tour
  const extrasTotal = selectedDestinations.reduce((sum, destId) => {
    const dest = tour.destinations.find(d => d.id === destId);
    if (!dest || dest.isFree) return sum;
    return sum + (dest.pricePerAdult || 0) * adults + (dest.pricePerChild || 0) * childCount;
  }, 0);

  // STATE 3: Customization Flow
  if (viewState === 'customize') {
    return (
      <section className="animate-fade-in-up">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-[#006a2e]/10 text-[#006a2e] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            Selected
          </span>
          <h2 className="text-[#595c5d] font-semibold text-sm">Customization Flow</h2>
        </div>

        <div className="bg-white rounded-[2rem] overflow-hidden shadow-[0_12px_32px_rgba(44,47,48,0.12)] border border-[#006a2e]/10">
          <div className="p-6 pb-2">
            <h3 className="text-2xl font-extrabold tracking-tight text-[#2c2f30]">Customize Your Destinations</h3>
            <p className="mt-2 text-[#595c5d] text-sm md:text-base">Tailor your itinerary by adding or removing stops.</p>
          </div>

          <div className="p-6 space-y-4">
            {tour.destinations.map(dest => {
              const destIsSelected = isDestinationSelected(tour.id, dest.id);
              return (
                <div key={dest.id} className={`flex items-center justify-between p-4 rounded-2xl transition-colors ${dest.isFree ? 'bg-[#eff1f2]' : 'bg-white border border-[#abadae]/20'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${dest.isFree ? 'bg-[#5dfd8a]/30 text-[#005d27]' : 'bg-[#ff8fa8]/20 text-[#b6004f]'}`}>
                      {getDestinationIcon(dest.name)}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#2c2f30] text-sm md:text-base">{dest.name}</h4>
                      {dest.isFree ? (
                        <span className="text-xs font-bold text-[#006a2e] flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" strokeWidth={3} /> Included
                        </span>
                      ) : (
                        <div className="flex flex-col sm:flex-row sm:gap-2">
                          <span className="text-xs font-bold text-[#b6004f]">
                            +${dest.pricePerAdult} / adult
                          </span>
                          {dest.pricePerChild !== undefined && dest.pricePerChild > 0 && (
                            <span className="text-xs font-bold text-[#b6004f]">
                              +${dest.pricePerChild} / child
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={destIsSelected}
                      onChange={() => toggleDestination(tour.id, dest.id)}
                    />
                    <div className="w-11 h-6 bg-[#dadddf] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#006a2e]"></div>
                  </label>
                </div>
              );
            })}
          </div>

          <div className="p-6 bg-white border-t border-[#abadae]/10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[#595c5d] font-medium text-sm">Tour Extras Estimate:</span>
              <span className="text-xl font-extrabold text-[#2c2f30]">${extrasTotal.toFixed(2)}</span>
            </div>
            <button
              onClick={() => setViewState('default')}
              className="w-full min-h-[56px] flex items-center justify-center gap-2 bg-gradient-to-br from-[#5dfd8a] to-[#006a2e] text-white font-bold rounded-xl shadow-lg hover:brightness-110 active:scale-[0.98] transition-all"
            >
              <CheckCircle className="w-5 h-5" strokeWidth={2.5} /> Confirm Selections
            </button>
          </div>
        </div>
      </section>
    );
  }

  // STATE 2: Gallery View
  if (viewState === 'gallery') {
    return (
      <section className="animate-fade-in-up">
        {/* We can hide these pills or keep them to orient the user */}
        <div className="flex items-center gap-2 mb-4 opacity-70">
          <span className="bg-[#006a2e]/10 text-[#006a2e] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {isSelected ? 'Selected' : 'Available'}
          </span>
          <h2 className="text-[#595c5d] font-semibold text-sm">Gallery Swipeable</h2>
        </div>

        <div className="bg-white rounded-[2rem] overflow-hidden shadow-[0_8px_24px_rgba(44,47,48,0.06)] border border-[#abadae]/10">
          <div className="relative group/gallery">
            <div ref={scrollRef} className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar h-72">
              {tour.galleryImages.map((img, idx) => (
                <div key={idx} className="min-w-full h-full snap-center shrink-0 relative">
                  <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    onClick={(e) => { e.stopPropagation(); useBookingStore.getState().setFullscreenImage(img); }}
                    className="absolute bottom-4 right-4 w-9 h-9 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors shadow-md"
                  >
                    <Maximize2 className="w-4 h-4" strokeWidth={2} />
                  </button>
                </div>
              ))}
            </div>

            {/* Pagination Dots */}
            {tour.galleryImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 px-3 py-1.5 bg-black/20 backdrop-blur-md rounded-full">
                {tour.galleryImages.map((_, idx) => (
                  <div key={idx} className={`w-1.5 h-1.5 rounded-full transition-colors ${currentImageIndex === idx ? 'bg-white' : 'bg-white/40'}`}></div>
                ))}
              </div>
            )}

            {/* Arrows */}
            <button onClick={() => scrollGallery('left')} className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#2c2f30] shadow-md opacity-0 group-hover/gallery:opacity-100 transition-opacity">
              <ChevronLeft className="w-5 h-5" strokeWidth={2} />
            </button>
            <button onClick={() => scrollGallery('right')} className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#2c2f30] shadow-md opacity-0 group-hover/gallery:opacity-100 transition-opacity">
              <ChevronRight className="w-5 h-5" strokeWidth={2} />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <h3 className="text-2xl font-extrabold tracking-tight text-[#2c2f30]">{tour.title}</h3>
              <p className="mt-2 text-[#595c5d] leading-relaxed line-clamp-2 md:line-clamp-none">{tour.description}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setViewState('default')}
                className="flex-1 min-h-[56px] flex items-center justify-center gap-2 bg-[#eff1f2] text-[#595c5d] rounded-xl font-bold transition-all hover:bg-[#e0e3e4] active:scale-[0.98]"
              >
                <X className="w-5 h-5" strokeWidth={2.5} /> Close Gallery
              </button>
              <button
                onClick={handleSelectTour}
                className="flex-1 min-h-[56px] flex items-center justify-center gap-2 bg-gradient-to-br from-[#5dfd8a] to-[#006a2e] text-white font-bold rounded-xl shadow-lg hover:brightness-110 transition-all active:scale-[0.98]"
              >
                {isSelected ? 'Edit Selections' : 'Select Tour'}
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // STATE 1: Default View
  return (
    <section className="animate-fade-in-up">
      <div className="flex items-center gap-2 mb-4 opacity-70">
        <span className="bg-[#006a2e]/10 text-[#006a2e] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          {isSelected ? 'Selected' : 'Available'}
        </span>
        <h2 className="text-[#595c5d] font-semibold text-sm">Default View</h2>
      </div>

      <div className={`bg-white rounded-[2rem] overflow-hidden shadow-[0_8px_24px_rgba(44,47,48,0.06)] border transition-colors ${isSelected ? 'border-[#006a2e]' : 'border-[#abadae]/10'}`}>
        <div className="relative h-64 w-full">
          <img src={tour.heroImage} alt={tour.title} className="w-full h-full object-cover" />
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
            <Star className="w-4 h-4 text-[#b6004f] fill-current" />
            <span className="text-xs font-bold text-[#2c2f30]">4.9</span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); useBookingStore.getState().setFullscreenImage(tour.heroImage); }}
            className="absolute bottom-4 right-4 w-9 h-9 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors shadow-md"
          >
            <Maximize2 className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-2xl font-extrabold tracking-tight text-[#2c2f30]">{tour.title}</h3>
            <p className="mt-2 text-[#595c5d] leading-relaxed line-clamp-2">{tour.description}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setViewState('gallery')}
              className="flex-1 min-h-[56px] flex items-center justify-center gap-2 border border-[#abadae]/30 rounded-xl text-[#006a2e] font-bold hover:bg-[#eff1f2] transition-all active:scale-[0.98]"
            >
              <Images className="w-5 h-5" /> View Gallery
            </button>
            <button
              onClick={handleSelectTour}
              className="flex-1 min-h-[56px] flex items-center justify-center gap-2 bg-gradient-to-br from-[#5dfd8a] to-[#006a2e] text-white font-bold rounded-xl shadow-lg hover:brightness-110 transition-all active:scale-[0.98]"
            >
              {isSelected ? 'Edit Selections' : 'Select Tour'}
            </button>
          </div>

          {/* Selected Indicator Summary */}
          {isSelected && (
            <div className="flex items-center justify-between mt-4 p-4 bg-[#5dfd8a]/20 rounded-2xl border border-[#006a2e]/10 animate-fade-in-up">
              <span className="text-sm font-semibold text-[#005d27]">
                {selectedDestinations.length} destination{selectedDestinations.length > 1 ? 's' : ''} selected
              </span>
              <button onClick={() => deselectTour(tour.id)} className="text-xs font-bold text-[#b6004f] hover:text-[#770031] transition-colors">
                Deselect Tour
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
