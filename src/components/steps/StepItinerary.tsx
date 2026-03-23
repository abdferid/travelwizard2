'use client';

import { useEffect, useState, useRef } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useBookingStore, TOURS_DATA, ItineraryItem } from '@/store/booking-store';
import { GripVertical, AlertTriangle, RotateCcw, Map, Coffee, Lightbulb, X } from 'lucide-react';

const TOTAL_STEPS = 10;

// Toast notification
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-20 left-4 right-4 z-50 animate-fade-in">
      <div className="max-w-2xl mx-auto bg-[#2c2f30] text-white rounded-2xl px-5 py-4 shadow-elevated flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0" strokeWidth={1.5} />
        <p className="text-sm flex-1 font-medium">{message}</p>
        <button onClick={onClose} className="text-white/60 hover:text-white">
          <X className="w-4 h-4" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}

// Sortable item component
function SortableItem({ item }: { item: ItineraryItem }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const tour = item.tourId ? TOURS_DATA.find(t => t.id === item.tourId) : null;
  const destinationNames = item.destinations
    .map(destId => tour?.destinations.find(d => d.id === destId)?.name)
    .filter(Boolean);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        relative bg-white rounded-2xl p-5 touch-none
        transition-all duration-200 shadow-soft
        ${isDragging ? 'opacity-50 shadow-elevated z-50 ring-2 ring-[#006a2e]' : ''}
        ${item.isFreeDay ? 'bg-gradient-to-r from-[#eff1f2] to-white' : ''}
      `}
    >
      {/* Drag handle */}
      <div 
        {...attributes} 
        {...listeners}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 cursor-grab active:cursor-grabbing touch-none text-[#abadae] hover:text-[#595c5d]"
      >
        <GripVertical className="w-5 h-5" strokeWidth={1.5} />
      </div>
      
      <div className="pl-10">
        <div className="flex items-center gap-4 mb-2">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-extrabold ${
            item.isFreeDay 
              ? 'bg-[#e6e8ea] text-[#595c5d]' 
              : 'bg-[#006a2e] text-white'
          }`}>
            {item.day}
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-[#2c2f30]">{item.tourTitle}</h4>
            {item.isFreeDay && (
              <p className="text-xs text-[#595c5d]">Explore at your own pace</p>
            )}
          </div>
          {item.isFreeDay && (
            <span className="px-3 py-1 bg-[#e6e8ea] text-[#595c5d] text-[10px] font-bold tracking-wider uppercase rounded-lg">
              Leisure
            </span>
          )}
        </div>
        
        {!item.isFreeDay && destinationNames.length > 0 && (
          <div className="flex flex-wrap gap-2 pl-14">
            {destinationNames.slice(0, 3).map((name, i) => (
              <span key={i} className="px-3 py-1 bg-[#eff1f2] text-[#595c5d] text-xs font-medium rounded-lg">
                {name}
              </span>
            ))}
            {destinationNames.length > 3 && (
              <span className="px-3 py-1 bg-[#eff1f2] text-[#757778] text-xs font-medium rounded-lg">
                +{destinationNames.length - 3} more
              </span>
            )}
          </div>
        )}
        
        {item.isFreeDay && (
          <div className="flex flex-wrap gap-2 pl-14">
            <span className="px-3 py-1 bg-white text-[#595c5d] text-xs font-medium rounded-lg flex items-center gap-1 border border-[#e6e8ea]">
              <Coffee className="w-3 h-3" strokeWidth={1.5} /> Cafes
            </span>
            <span className="px-3 py-1 bg-white text-[#595c5d] text-xs font-medium rounded-lg border border-[#e6e8ea]">Shopping</span>
            <span className="px-3 py-1 bg-white text-[#595c5d] text-xs font-medium rounded-lg border border-[#e6e8ea]">Strolling</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function StepItinerary() {
  const { 
    itineraryOrder, 
    itineraryModified,
    initializeItinerary, 
    reorderItinerary,
    resetItineraryOrder,
    getTripDuration,
    selectedTours,
    currentStep,
  } = useBookingStore();
  
  const [showToast, setShowToast] = useState(false);
  const hasShownToast = useRef(false);
  const tripDuration = getTripDuration();
  const freeDaysCount = Math.max(0, tripDuration - selectedTours.length);

  useEffect(() => {
    initializeItinerary();
  }, [initializeItinerary]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = itineraryOrder.findIndex(item => item.id === active.id);
      const newIndex = itineraryOrder.findIndex(item => item.id === over.id);
      
      reorderItinerary(oldIndex, newIndex);
      
      if (!hasShownToast.current) {
        setShowToast(true);
        hasShownToast.current = true;
      }
    }
  };

  return (
    <div className="animate-fade-in-up">
      {showToast && (
        <Toast 
          message="Route order changed — this may affect travel times"
          onClose={() => setShowToast(false)}
        />
      )}
      
      {/* Header */}
      <section className="mb-10">
        <span className="text-[#b6004f] font-bold tracking-widest text-xs uppercase mb-2 block">
          Step {currentStep} of {TOTAL_STEPS}
        </span>
        <h2 className="text-4xl font-extrabold tracking-tight text-[#2c2f30] mb-4 leading-tight">
          Your day-by-day itinerary.
        </h2>
        <p className="text-[#595c5d] text-lg">
          {tripDuration} day{tripDuration > 1 ? 's' : ''} of adventure
          {freeDaysCount > 0 && ` · ${freeDaysCount} free day${freeDaysCount > 1 ? 's' : ''}`}
        </p>
      </section>

      {/* Map placeholder */}
      <div className="relative h-48 bg-gradient-to-br from-[#eff1f2] to-[#e6e8ea] rounded-3xl overflow-hidden mb-8 border border-[#dadddf]">
        <div className="absolute inset-0 opacity-30">
          <svg className="w-full h-full" viewBox="0 0 400 200">
            <path d="M0 100 Q100 80 200 100 T400 100" stroke="#757778" strokeWidth="2" fill="none" />
            <path d="M50 50 Q150 100 250 50 T400 80" stroke="#757778" strokeWidth="1.5" fill="none" strokeDasharray="4,4" />
            <circle cx="80" cy="90" r="6" fill="#006a2e" />
            <circle cx="180" cy="100" r="6" fill="#006a2e" />
            <circle cx="300" cy="85" r="6" fill="#006a2e" />
          </svg>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-soft mb-3">
            <Map className="w-7 h-7 text-[#006a2e]" strokeWidth={1.5} />
          </div>
          <p className="text-sm font-bold text-[#2c2f30]">Route Preview</p>
          <p className="text-xs text-[#595c5d] mt-1">Drag items below to reorder</p>
        </div>
      </div>

      {/* Modified indicator & reset */}
      {itineraryModified && (
        <div className="mb-6 flex items-center justify-between p-4 bg-[#ff8fa8]/20 rounded-2xl border border-[#b6004f]/10">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-[#b6004f]" strokeWidth={1.5} />
            <span className="text-sm font-semibold text-[#660029]">Route has been modified</span>
          </div>
          <button
            onClick={resetItineraryOrder}
            className="px-4 py-2 text-sm font-semibold text-[#b6004f] hover:bg-[#ff8fa8]/20 rounded-xl transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" strokeWidth={1.5} />
            Reset
          </button>
        </div>
      )}

      {/* Itinerary list with dnd-kit */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={itineraryOrder.map(item => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {itineraryOrder.map((item) => (
              <SortableItem key={item.id} item={item} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Tips */}
      <div className="mt-8 flex items-start gap-4 p-4">
        <div className="p-3 rounded-2xl bg-[#e6e8ea] text-[#595c5d]">
          <Lightbulb className="w-5 h-5" strokeWidth={1.5} />
        </div>
        <div>
          <h5 className="font-bold text-sm text-[#2c2f30]">Pro Tip</h5>
          <p className="text-xs text-[#595c5d] leading-relaxed mt-1">
            Hold and drag any day to reorder. Free days can be placed anywhere. Your guide will confirm the optimized route.
          </p>
        </div>
      </div>
    </div>
  );
}
