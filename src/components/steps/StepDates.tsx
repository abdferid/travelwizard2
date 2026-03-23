'use client';

import { useState, useMemo } from 'react';
import { useBookingStore } from '@/store/booking-store';
import { format, addDays, startOfDay } from 'date-fns';
import { DayPicker, DateRange } from 'react-day-picker';
import { PlaneTakeoff, PlaneLanding, Sparkles, Lightbulb } from 'lucide-react';
import 'react-day-picker/style.css';

const TOTAL_STEPS = 10;

export default function StepDates() {
  const { startDate, endDate, setStartDate, setEndDate, currentStep } = useBookingStore();
  
  const [range, setRange] = useState<DateRange | undefined>(() => {
    if (startDate && endDate) {
      return { from: new Date(startDate), to: new Date(endDate) };
    }
    if (startDate) {
      return { from: new Date(startDate), to: undefined };
    }
    return undefined;
  });

  const today = useMemo(() => startOfDay(new Date()), []);
  const maxDate = useMemo(() => addDays(today, 365), [today]);

  const handleRangeSelect = (newRange: DateRange | undefined) => {
    setRange(newRange);
    
    if (newRange?.from) {
      setStartDate(newRange.from.toISOString());
    } else {
      setStartDate(null);
    }
    
    if (newRange?.to) {
      setEndDate(newRange.to.toISOString());
    } else {
      setEndDate(null);
    }
  };

  const tripDuration = useMemo(() => {
    if (!range?.from || !range?.to) return 0;
    const diffTime = Math.abs(range.to.getTime() - range.from.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [range]);

  return (
    <div className="animate-fade-in-up">
      {/* Header Section */}
      <section className="mb-12">
        <span className="text-[#b6004f] font-bold tracking-widest text-xs uppercase mb-2 block">
          Step {currentStep} of {TOTAL_STEPS}
        </span>
        <h2 className="text-4xl font-extrabold tracking-tight text-[#2c2f30] mb-4 leading-tight">
          When are you planning to visit?
        </h2>
        <p className="text-[#595c5d] text-lg leading-relaxed">
          Choose the dates for your Silk Road adventure. We'll find the best cultural festivals and tours for your window.
        </p>
      </section>

      {/* Date Selection Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Calendar Component */}
        <div className="lg:col-span-7 bg-white p-6 rounded-[2rem] shadow-soft border border-[#eff1f2]">
          <style jsx global>{`
            .rdp-root {
              --rdp-accent-color: #006a2e;
              --rdp-accent-background-color: #006a2e;
              margin: 0 auto;
              font-family: 'Plus Jakarta Sans', sans-serif;
            }
            .rdp-month_caption {
              font-weight: 700;
              font-size: 1.125rem;
              padding: 0.5rem 0;
            }
            .rdp-weekday {
              font-weight: 700;
              color: #757778;
              font-size: 0.75rem;
              text-transform: uppercase;
              letter-spacing: 0.05em;
            }
            .rdp-day {
              border-radius: 0.75rem;
              font-weight: 600;
            }
            .rdp-day_button {
              width: 44px;
              height: 44px;
              border-radius: 0.75rem;
            }
            .rdp-selected .rdp-day_button {
              background-color: #006a2e;
              color: white;
              box-shadow: 0 4px 12px rgba(0, 106, 46, 0.2);
            }
            /* In modern react-day-picker, .rdp-day gets the range modifiers */
            .rdp-day_range_middle, .rdp-range_middle {
              background-color: rgba(0, 106, 46, 0.1);
              color: #006a2e;
              border-radius: 0;
            }
            .rdp-day_range_middle .rdp-day_button, .rdp-range_middle .rdp-day_button {
              background-color: transparent;
              color: #006a2e;
            }
            .rdp-day_range_start, .rdp-range_start {
              background-color: rgba(0, 106, 46, 0.1);
              border-top-left-radius: 0.75rem;
              border-bottom-left-radius: 0.75rem;
            }
            .rdp-day_range_end, .rdp-range_end {
              background-color: rgba(0, 106, 46, 0.1);
              border-top-right-radius: 0.75rem;
              border-bottom-right-radius: 0.75rem;
            }
            .rdp-day_range_start .rdp-day_button, .rdp-range_start .rdp-day_button,
            .rdp-day_range_end .rdp-day_button, .rdp-range_end .rdp-day_button {
              background-color: #006a2e;
              color: white;
              border-radius: 0.75rem;
            }
            .rdp-today:not(.rdp-selected) .rdp-day_button {
              border: 2px solid #006a2e;
              font-weight: 700;
            }
            .rdp-disabled .rdp-day_button {
              color: #abadae;
              opacity: 0.3;
            }
            .rdp-chevron {
              fill: #006a2e;
            }
          `}</style>
          
          <DayPicker
            mode="range"
            selected={range}
            onSelect={handleRangeSelect}
            disabled={{ before: today }}
            startMonth={today}
            endMonth={maxDate}
            showOutsideDays={false}
            fixedWeeks
          />
        </div>

        {/* Selection Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          {/* Selection Card */}
          <div className="bg-[#eff1f2] p-6 rounded-[2rem]">
            <h4 className="font-bold mb-4 text-[#2c2f30]">Your Selection</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-white p-4 rounded-2xl">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-[#006a2e]">
                  <PlaneTakeoff className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-xs text-[#595c5d] font-medium">Start Date</p>
                  <p className="font-bold text-[#2c2f30]">
                    {range?.from ? format(range.from, 'MMM d, yyyy') : 'Select date'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white p-4 rounded-2xl">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-[#006a2e]">
                  <PlaneLanding className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-xs text-[#595c5d] font-medium">End Date</p>
                  <p className="font-bold text-[#2c2f30]">
                    {range?.to ? format(range.to, 'MMM d, yyyy') : 'Select date'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Duration badge */}
            {tripDuration > 0 && (
              <div className="mt-6 p-4 bg-[#ff8fa8]/20 rounded-2xl border border-[#b6004f]/10">
                <div className="flex items-center gap-2 text-[#b6004f] mb-1">
                  <Sparkles className="w-4 h-4" strokeWidth={1.5} />
                  <span className="text-sm font-bold">{tripDuration} Day Adventure</span>
                </div>
                <p className="text-xs text-[#660029]/80 leading-snug">
                  Perfect duration to explore Azerbaijan's highlights!
                </p>
              </div>
            )}
          </div>

          {/* Tip Card */}
          <div className="flex items-start gap-4 p-4">
            <div className="p-3 rounded-2xl bg-[#e6e8ea] text-[#595c5d]">
              <Lightbulb className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <div>
              <h5 className="font-bold text-sm text-[#2c2f30]">Travel Tip</h5>
              <p className="text-xs text-[#595c5d] leading-relaxed mt-1">
                Most cultural tours in the Caucasus are best enjoyed in 4-day windows.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick select pills */}
      <div className="mt-8">
        <p className="text-xs font-bold text-[#757778] uppercase tracking-widest mb-3">Quick Select</p>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { label: 'Weekend', days: 2 },
            { label: '5 Days', days: 5 },
            { label: '1 Week', days: 7 },
            { label: '10 Days', days: 10 },
            { label: '2 Weeks', days: 14 },
          ].map((option) => (
            <button
              key={option.label}
              onClick={() => {
                const from = today;
                const to = addDays(today, option.days);
                handleRangeSelect({ from, to });
              }}
              className="px-5 py-3 bg-white border border-[#abadae]/20 rounded-2xl text-sm font-semibold text-[#595c5d] hover:border-[#006a2e]/30 hover:text-[#006a2e] transition-all whitespace-nowrap shadow-sm"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
