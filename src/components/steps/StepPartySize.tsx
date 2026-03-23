'use client';

import { useBookingStore } from '@/store/booking-store';
import { Minus, Plus, Users, AlertCircle, Maximize2 } from 'lucide-react';

const TOTAL_STEPS = 10;

interface CounterRowProps {
  label: string;
  sublabel: string;
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  minValue?: number;
  maxValue?: number;
}

function CounterRow({ 
  label, 
  sublabel, 
  value, 
  onIncrement, 
  onDecrement,
  minValue = 0,
  maxValue = 20 
}: CounterRowProps) {
  const canDecrement = value > minValue;
  const canIncrement = value < maxValue;

  return (
    <div className="bg-[#eff1f2] p-6 rounded-3xl flex items-center justify-between">
      <div>
        <h3 className="text-lg font-bold text-[#2c2f30]">{label}</h3>
        <p className="text-sm text-[#595c5d]">{sublabel}</p>
      </div>
      <div className="flex items-center gap-6">
        {/* Decrement button */}
        <button
          onClick={onDecrement}
          disabled={!canDecrement}
          aria-label={`Decrease ${label}`}
          className={`
            w-12 h-12 rounded-full bg-white flex items-center justify-center
            border border-[#abadae]/20
            transition-all active:scale-90 duration-200
            ${canDecrement 
              ? 'text-[#757778] hover:text-[#006a2e] hover:shadow-md' 
              : 'text-[#757778] opacity-30 cursor-not-allowed'
            }
          `}
        >
          <Minus className="w-5 h-5" strokeWidth={1.5} />
        </button>
        
        {/* Value display */}
        <span className="text-2xl font-extrabold w-4 text-center text-[#2c2f30]">
          {value}
        </span>
        
        {/* Increment button */}
        <button
          onClick={onIncrement}
          disabled={!canIncrement}
          aria-label={`Increase ${label}`}
          className={`
            w-12 h-12 rounded-full bg-white flex items-center justify-center
            border border-[#abadae]/20
            transition-all active:scale-90 duration-200
            ${canIncrement 
              ? 'text-[#006a2e] shadow-sm hover:shadow-md' 
              : 'text-[#757778] opacity-30 cursor-not-allowed'
            }
          `}
        >
          <Plus className="w-5 h-5" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}

export default function StepPartySize() {
  const { adults, children, setAdults, setChildren, currentStep } = useBookingStore();
  const totalPeople = adults + children;

  return (
    <div className="animate-fade-in-up">
      {/* Header Section */}
      <section className="mb-12">
        <span className="text-[#b6004f] font-bold tracking-widest text-xs uppercase mb-2 block">
          Step {currentStep} of {TOTAL_STEPS}
        </span>
        <h2 className="text-4xl font-extrabold tracking-tight text-[#2c2f30] mb-4 leading-tight">
          How many people are traveling?
        </h2>
        <p className="text-[#595c5d] text-lg">
          Help us curate the perfect logistics for your group size.
        </p>
      </section>

      {/* Quick Select Bento Grid */}
      <section className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
        {[
          { count: 1, label: 'Solo Traveler' },
          { count: 2, label: 'Couple' },
          { count: 3, label: 'Small Group' },
          { count: 4, label: 'Family' },
          { count: 5, label: 'Large Party' },
        ].map((option) => {
          const isSelected = adults === option.count && children === 0;
          return (
            <button
              key={option.count}
              onClick={() => {
                setAdults(option.count);
                setChildren(0);
              }}
              className={`
                bg-white p-6 rounded-2xl flex flex-col items-center justify-center
                transition-all active:scale-95 group shadow-sm
                ${option.count === 5 ? 'col-span-1 md:col-span-2' : ''}
                ${isSelected 
                  ? 'border-2 border-[#006a2e] shadow-md relative' 
                  : 'border border-transparent hover:border-[#006a2e]/30'
                }
              `}
            >
              <span className={`text-2xl font-bold mb-1 transition-colors ${isSelected ? 'text-[#006a2e]' : 'group-hover:text-[#006a2e]'}`}>
                {option.count === 5 ? '5+' : option.count}
              </span>
              <span className="text-xs text-[#595c5d] font-medium">{option.label}</span>
              {isSelected && (
                <div className="absolute -top-2 -right-2 bg-[#006a2e] text-white p-1 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </section>
      
      {/* Precise Counter Section */}
      <section className="space-y-6">
        <CounterRow
          label="Adults"
          sublabel="Ages 13 or above"
          value={adults}
          onIncrement={() => setAdults(adults + 1)}
          onDecrement={() => setAdults(adults - 1)}
          minValue={1}
          maxValue={20}
        />
        
        <CounterRow
          label="Children"
          sublabel="Ages 2–12"
          value={children}
          onIncrement={() => setChildren(children + 1)}
          onDecrement={() => setChildren(children - 1)}
          minValue={0}
          maxValue={20}
        />
      </section>

      {/* Large group warning */}
      {totalPeople > 12 && (
        <div className="mt-6 p-4 bg-[#ff8fa8]/20 rounded-2xl border border-[#b6004f]/10">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#b6004f] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
            <p className="text-sm text-[#660029]">
              Large groups may need multiple vehicles. We'll show suitable options in the transport step.
            </p>
          </div>
        </div>
      )}

      {/* Decorative Image */}
      <div className="mt-16 relative h-48 rounded-3xl overflow-hidden group">
        <img 
          className="w-full h-full object-cover grayscale opacity-20 group-hover:grayscale-0 group-hover:opacity-40 transition-all duration-700" 
          src="https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=800&auto=format&fit=crop"
          alt="Friends traveling together"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#f5f6f7] via-transparent to-transparent" />
        <button
          onClick={() => useBookingStore.getState().setFullscreenImage('https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=800&auto=format&fit=crop')}
          className="absolute top-4 right-4 w-9 h-9 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors shadow-md"
        >
          <Maximize2 className="w-4 h-4" strokeWidth={2} />
        </button>
        <div className="absolute bottom-6 left-6 right-6">
          <p className="text-xs font-semibold text-[#595c5d] italic tracking-wide">
            "Travel is better when shared." — Caspian Curators
          </p>
        </div>
      </div>
    </div>
  );
}
