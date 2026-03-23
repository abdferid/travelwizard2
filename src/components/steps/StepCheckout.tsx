'use client';

import { useBookingStore, COUNTRY_CODES, HOTELS_DATA, TRANSPORT_OPTIONS, TOURS_DATA, DINING_EXPERIENCES } from '@/store/booking-store';
import { User, Phone, MessageSquare, ChevronDown, MapPin, Car, Users, UtensilsCrossed, Building, Calendar, CheckCircle2 } from 'lucide-react';

const TOTAL_STEPS = 8;

// Elegant input component matching HTML reference
function ElegantInput({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  icon: Icon,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  icon?: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  required?: boolean;
}) {
  return (
    <div className="relative bg-[#eff1f2] rounded-2xl border-b-2 border-[#abadae]/30 focus-within:border-[#006a2e] transition-colors">
      {Icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#757778]">
          <Icon className="w-5 h-5" strokeWidth={1.5} />
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className={`
          w-full bg-transparent pt-7 pb-3 text-[#2c2f30] font-medium
          placeholder:text-[#abadae] focus:outline-none
          ${Icon ? 'pl-12 pr-4' : 'px-4'}
        `}
      />
      <label className={`
        absolute top-3 text-[10px] font-bold uppercase tracking-wider text-[#757778]
        ${Icon ? 'left-12' : 'left-4'}
      `}>
        {label}{required && <span className="text-[#b6004f] ml-0.5">*</span>}
      </label>
    </div>
  );
}

// Country code selector
function CountryCodeSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const selectedCountry = COUNTRY_CODES.find(c => c.code === value);
  
  return (
    <div className="relative bg-[#eff1f2] rounded-2xl border-b-2 border-[#abadae]/30 focus-within:border-[#006a2e]">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent pt-7 pb-3 px-4 text-[#2c2f30] font-medium appearance-none focus:outline-none cursor-pointer"
      >
        {COUNTRY_CODES.map((country) => (
          <option key={country.code} value={country.code}>
            {country.flag} {country.code} ({country.country})
          </option>
        ))}
      </select>
      <label className="absolute left-4 top-3 text-[10px] font-bold uppercase tracking-wider text-[#757778]">
        Country
      </label>
      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#757778] pointer-events-none" strokeWidth={1.5} />
    </div>
  );
}

// Trip summary component
function TripSummary() {
  const { 
    adults, 
    children: childCount,
    startDate,
    endDate,
    selectedTransport,
    selectedTours,
    selectedHotel,
    selectedDiningExperiences,
    guideCertification,
    getTripDuration,
    getTotalPrice,
    getTourExtrasPrice,
    getHotelPrice,
    getDiningExperiencesPrice,
  } = useBookingStore();
  
  const tripDuration = getTripDuration();
  const transportData = TRANSPORT_OPTIONS.find(t => t.id === selectedTransport);
  const hotelData = HOTELS_DATA.find(h => h.id === selectedHotel);
  const selectedToursData = TOURS_DATA.filter(t => selectedTours.some(st => st.tourId === t.id));
  const diningData = DINING_EXPERIENCES.filter(d => selectedDiningExperiences.includes(d.id));

  // Calculate prices inline
  const transportPrice = transportData ? transportData.pricePerDay * Math.max(1, tripDuration) : 0;
  const guidePrice = guideCertification === 'certified' ? 50 * Math.max(1, tripDuration) : 0;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-soft border border-[#eff1f2]">
      <h3 className="text-sm font-bold text-[#006a2e] uppercase tracking-widest mb-6">Trip Summary</h3>
      
      {/* Dates & Travelers */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[#eff1f2] p-4 rounded-2xl">
          <div className="flex items-center gap-2 text-[#757778] mb-1">
            <Calendar className="w-4 h-4" strokeWidth={1.5} />
            <span className="text-xs font-medium">Dates</span>
          </div>
          <p className="text-sm font-bold text-[#2c2f30]">{formatDate(startDate)}</p>
          <p className="text-sm font-bold text-[#2c2f30]">{formatDate(endDate)}</p>
          <p className="text-xs text-[#595c5d] mt-1">{tripDuration} days</p>
        </div>
        <div className="bg-[#eff1f2] p-4 rounded-2xl">
          <div className="flex items-center gap-2 text-[#757778] mb-1">
            <Users className="w-4 h-4" strokeWidth={1.5} />
            <span className="text-xs font-medium">Travelers</span>
          </div>
          <p className="text-sm font-bold text-[#2c2f30]">{adults} adult{adults > 1 ? 's' : ''}</p>
          {childCount > 0 && (
            <p className="text-sm font-bold text-[#2c2f30]">{childCount} child{childCount > 1 ? 'ren' : ''}</p>
          )}
        </div>
      </div>
      
      {/* Line items */}
      <div className="space-y-4 border-t border-[#eff1f2] pt-6">
        {/* Transport */}
        {transportData && (
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#eff1f2] flex items-center justify-center text-[#595c5d]">
                <Car className="w-4 h-4" strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-semibold text-[#2c2f30]">{transportData.title}</p>
                <p className="text-xs text-[#595c5d]">${transportData.pricePerDay}/day × {Math.max(1, tripDuration)}</p>
              </div>
            </div>
            <span className="font-bold text-[#2c2f30]">${transportPrice}</span>
          </div>
        )}
        
        {/* Guide */}
        {guideCertification === 'certified' && (
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#eff1f2] flex items-center justify-center text-[#595c5d]">
                <User className="w-4 h-4" strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-semibold text-[#2c2f30]">Certified Guide</p>
                <p className="text-xs text-[#595c5d]">$50/day × {Math.max(1, tripDuration)}</p>
              </div>
            </div>
            <span className="font-bold text-[#2c2f30]">${guidePrice}</span>
          </div>
        )}
        
        {/* Tours */}
        {selectedToursData.length > 0 && getTourExtrasPrice() > 0 && (
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#eff1f2] flex items-center justify-center text-[#595c5d]">
                <MapPin className="w-4 h-4" strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-semibold text-[#2c2f30]">Tour Add-ons</p>
                <p className="text-xs text-[#595c5d]">{selectedToursData.map(t => t.title).join(', ')}</p>
              </div>
            </div>
            <span className="font-bold text-[#2c2f30]">${getTourExtrasPrice()}</span>
          </div>
        )}
        

      </div>
      
      {/* Total */}
      <div className="mt-6 pt-6 border-t-2 border-[#006a2e]/20 flex justify-between items-center">
        <span className="text-lg font-bold text-[#2c2f30]">Estimated Total</span>
        <span className="text-3xl font-extrabold text-[#006a2e]">${getTotalPrice().toLocaleString()}</span>
      </div>
      
      <p className="mt-3 text-xs text-[#595c5d] text-center">
        Final pricing confirmed after consultation
      </p>
    </div>
  );
}

export default function StepCheckout() {
  const { 
    contactInfo, 
    updateContactInfo,
    currentStep,
  } = useBookingStore();

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <section className="mb-10">
        <span className="text-[#b6004f] font-bold tracking-widest text-xs uppercase mb-2 block">
          Step {currentStep} of {TOTAL_STEPS}
        </span>
        <h2 className="text-4xl font-extrabold tracking-tight text-[#2c2f30] mb-4 leading-tight">
          Almost there!
        </h2>
        <p className="text-[#595c5d] text-lg">
          Share your details and we'll connect via WhatsApp to finalize your journey.
        </p>
      </section>

      {/* Contact Form */}
      <div className="bg-white rounded-3xl p-6 shadow-soft border border-[#eff1f2] mb-8">
        <h3 className="text-sm font-bold text-[#006a2e] uppercase tracking-widest mb-6">Contact Details</h3>
        
        <div className="space-y-4">
          {/* Name row */}
          <div className="grid grid-cols-2 gap-4">
            <ElegantInput
              label="First Name"
              value={contactInfo.firstName}
              onChange={(value) => updateContactInfo('firstName', value)}
              icon={User}
              required
              placeholder="John"
            />
            <ElegantInput
              label="Last Name"
              value={contactInfo.lastName}
              onChange={(value) => updateContactInfo('lastName', value)}
              required
              placeholder="Smith"
            />
          </div>

          {/* Phone row */}
          <div className="grid grid-cols-3 gap-4">
            <CountryCodeSelect
              value={contactInfo.countryCode}
              onChange={(value) => updateContactInfo('countryCode', value)}
            />
            <div className="col-span-2">
              <ElegantInput
                label="WhatsApp Number"
                value={contactInfo.whatsappNumber}
                onChange={(value) => updateContactInfo('whatsappNumber', value)}
                type="tel"
                icon={Phone}
                required
                placeholder="555 123 4567"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="relative bg-[#eff1f2] rounded-2xl border-b-2 border-[#abadae]/30 focus-within:border-[#006a2e]">
            <div className="absolute left-4 top-6 text-[#757778]">
              <MessageSquare className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <textarea
              value={contactInfo.notes}
              onChange={(e) => updateContactInfo('notes', e.target.value)}
              placeholder="Dietary restrictions, special requests, celebration dates..."
              rows={3}
              className="w-full bg-transparent pt-7 pb-3 pl-12 pr-4 text-[#2c2f30] font-medium placeholder:text-[#abadae] focus:outline-none resize-none"
            />
            <label className="absolute left-12 top-3 text-[10px] font-bold uppercase tracking-wider text-[#757778]">
              Special Requests (optional)
            </label>
          </div>
        </div>
      </div>

      {/* Trip Summary */}
      <TripSummary />

      {/* WhatsApp note */}
      <div className="mt-8 p-5 bg-gradient-to-br from-[#25D366]/10 to-[#006a2e]/10 rounded-3xl border border-[#006a2e]/10">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#25D366] flex items-center justify-center">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </div>
          <div>
            <h4 className="font-bold text-[#2c2f30]">We'll reach out on WhatsApp</h4>
            <p className="mt-1 text-sm text-[#595c5d]">
              After submission, our travel concierge will contact you within 24 hours to confirm details, answer questions, and lock in your adventure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
