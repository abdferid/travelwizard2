'use client';

import { useEffect, useState } from 'react';
import { useBookingStore } from '@/store/booking-store';
import { CheckCircle, PartyPopper, Sparkles, Clock, Headphones, Home, ArrowLeft } from 'lucide-react';

// Confetti particle
function ConfettiPiece({ delay, left, color }: { delay: number; left: number; color: string }) {
  return (
    <div
      className="absolute w-3 h-3 rounded-sm animate-confetti"
      style={{
        left: `${left}%`,
        backgroundColor: color,
        animationDelay: `${delay}s`,
        transform: `rotate(${Math.random() * 360}deg)`,
      }}
    />
  );
}

// Confetti container
function Confetti() {
  const colors = ['#006a2e', '#5dfd8a', '#b6004f', '#ff8fa8', '#25D366', '#f97316', '#ec4899'];
  const pieces = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    delay: Math.random() * 0.5,
    left: Math.random() * 100,
    color: colors[Math.floor(Math.random() * colors.length)],
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map((piece) => (
        <ConfettiPiece key={piece.id} {...piece} />
      ))}
    </div>
  );
}

export default function StepSuccess() {
  const { submissionId, resetBooking, contactInfo } = useBookingStore();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  const whatsappMessage = encodeURIComponent(
    `Hi! I just submitted a tour request (ID: ${submissionId || 'pending'}). Looking forward to discussing my Azerbaijan adventure!`
  );
  const countryData = { dial: '+994' }; // Default to Azerbaijan
  const whatsappLink = `https://wa.me/${countryData.dial.replace('+', '')}501234567?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-[#f5f6f7] flex flex-col">
      {showConfetti && <Confetti />}
      
      {/* Header */}
      <header className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-md shadow-sm h-16 flex items-center justify-between px-6 max-w-2xl mx-auto left-0 right-0">
        <div className="flex items-center gap-3">
          <ArrowLeft className="w-6 h-6 text-[#006a2e]" strokeWidth={1.5} />
          <h1 className="font-extrabold text-xl tracking-tight text-[#006a2e]">
            Azerbaijan Tour Planner
          </h1>
        </div>
      </header>
      
      {/* Progress bar - full */}
      <div className="fixed top-16 left-0 w-full z-30 h-1.5 bg-[#e6e8ea]">
        <div className="h-full w-full bg-gradient-to-r from-[#b6004f] to-[#ff8fa8] shadow-[0_0_8px_rgba(182,0,79,0.3)]" />
      </div>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-md mx-auto px-8 pt-32 pb-24 flex flex-col items-center justify-center text-center">
        {/* Icon with decorations */}
        <div className="relative mb-12">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-[#5dfd8a]/20 blur-3xl rounded-full scale-150" />
          
          {/* Main icon */}
          <div className="relative bg-white p-8 rounded-[2.5rem] shadow-soft border border-[#5dfd8a]/20 animate-scale-in">
            <CheckCircle className="w-20 h-20 text-[#006a2e]" strokeWidth={1.5} fill="#5dfd8a" />
          </div>
          
          {/* Floating badges */}
          <div className="absolute -top-4 -right-4 bg-[#b6004f] text-white p-3 rounded-2xl rotate-12 shadow-lg animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <PartyPopper className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <div className="absolute -bottom-2 -left-6 bg-[#79fbb7] text-[#005d27] p-3 rounded-2xl -rotate-12 shadow-lg animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <Sparkles className="w-6 h-6" strokeWidth={1.5} />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-extrabold text-[#2c2f30] tracking-tight mb-4 animate-fade-in-up">
          Itinerary Saved!
        </h2>

        {/* Description */}
        <div className="bg-[#eff1f2]/50 p-6 rounded-3xl mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <p className="text-[#595c5d] leading-relaxed text-lg">
            Your comprehensive travel plan is secured. Our team will contact you via{' '}
            <span className="text-[#006a2e] font-bold">WhatsApp</span> shortly.
          </p>
        </div>

        {/* Info cards */}
        <div className="w-full grid grid-cols-1 gap-4 text-left animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          {/* Next step card */}
          <div className="bg-white p-5 rounded-2xl flex items-start gap-4 shadow-sm">
            <div className="bg-[#006a2e]/10 p-2 rounded-lg">
              <Clock className="w-5 h-5 text-[#006a2e]" strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-bold text-[#2c2f30]">Next Step</p>
              <p className="text-sm text-[#595c5d]">Reviewing availability for your selected destinations</p>
            </div>
          </div>

          {/* Concierge card */}
          <div className="bg-white p-5 rounded-2xl flex items-start gap-4 shadow-sm">
            <div className="bg-[#79fbb7]/30 p-2 rounded-lg">
              <Headphones className="w-5 h-5 text-[#006942]" strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-bold text-[#2c2f30]">Concierge Access</p>
              <p className="text-sm text-[#595c5d]">
                Your personal advisor is assigned to trip{' '}
                <span className="font-mono font-bold text-[#006a2e]">#{submissionId || 'AZ' + Date.now().toString().slice(-4)}</span>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom CTA */}
      <footer className="fixed bottom-0 left-0 w-full z-40 flex flex-col gap-3 px-6 pb-10 pt-4 max-w-md mx-auto right-0">
        {/* WhatsApp button */}
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-[#25D366] text-white font-bold text-lg py-5 px-8 rounded-2xl shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] hover:brightness-110 flex items-center justify-center gap-3"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Chat on WhatsApp
        </a>

        {/* Return home button */}
        <button
          onClick={() => resetBooking()}
          className="w-full bg-gradient-to-br from-[#006a2e] to-[#005d27] text-white font-bold text-lg py-5 px-8 rounded-2xl shadow-lg shadow-emerald-900/20 transition-all active:scale-[0.98] hover:brightness-110 flex items-center justify-center gap-3"
        >
          <span>Start New Trip</span>
          <Home className="w-5 h-5" strokeWidth={1.5} />
        </button>
      </footer>

      {/* Background pattern */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-[0.03] z-0">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>
    </div>
  );
}
