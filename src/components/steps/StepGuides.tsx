'use client';

import { useBookingStore, GUIDE_GENDER_OPTIONS } from '@/store/booking-store';
import { Award, Footprints, Info, UserSearch, Map } from 'lucide-react';

const TOTAL_STEPS = 8;

export default function StepGuides() {
  const { 
    guideCertification, 
    guideGender, 
    setGuideCertification, 
    setGuideGender,
    currentStep,
  } = useBookingStore();

  const showGenderPreference = guideCertification === 'certified' || guideCertification === 'not-necessary';

  const handleCertificationSelect = (id: string) => {
    setGuideCertification(id);
    if (id === 'no-need') {
      setGuideGender(null);
    }
  };

  return (
    <div className="animate-fade-in-up">
      {/* Editorial Header */}
      <section className="mb-12">
        <span className="text-[#b6004f] font-bold tracking-widest text-xs uppercase mb-2 block">
          Step {currentStep} of {TOTAL_STEPS}
        </span>
        <h2 className="text-4xl lg:text-[2.5rem] font-extrabold tracking-tight text-[#2c2f30] mb-4 leading-tight">
          Elevate your experience with a local expert.
        </h2>
        <p className="text-[#595c5d] text-lg">
          Our guides are certified storytellers who bring the Silk Road's history to life.
        </p>
      </section>

      {/* Main Selection: Large Chips */}
      <section className="space-y-4 mb-12">
        <label className="block text-sm font-bold mb-4 uppercase tracking-widest text-[#595c5d]">
          Guide Requirement
        </label>
        <div className="grid grid-cols-1 gap-4">
          
          {/* Option: Certified Guide */}
          <label className="relative group cursor-pointer block">
            <input 
              type="radio" 
              name="guide_choice" 
              checked={guideCertification === 'certified'}
              onChange={() => handleCertificationSelect('certified')}
              className="peer hidden" 
            />
            <div className={`
              flex items-center justify-between p-6 bg-white rounded-[1.5rem] border-2 transition-all duration-300 shadow-soft
              ${guideCertification === 'certified' ? 'border-[#006a2e] bg-[#006a2e]/5' : 'border-transparent hover:border-[#abadae]/30'}
            `}>
              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110
                  ${guideCertification === 'certified' ? 'bg-[#006a2e]/10 text-[#006a2e]' : 'bg-[#eff1f2] text-[#595c5d]'}`}>
                  <Award className="w-8 h-8" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#2c2f30]">Certified Guide</h3>
                  <p className="text-sm text-[#595c5d]">Professional, licensed local expert</p>
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                ${guideCertification === 'certified' ? 'bg-[#006a2e] border-[#006a2e]' : 'border-[#abadae]'}`}>
                {guideCertification === 'certified' && <div className="w-2 h-2 bg-white rounded-full"></div>}
              </div>
            </div>
          </label>

          {/* Option: Not Necessary */}
          <label className="relative group cursor-pointer block">
            <input 
              type="radio" 
              name="guide_choice" 
              checked={guideCertification === 'not-necessary'}
              onChange={() => handleCertificationSelect('not-necessary')}
              className="peer hidden" 
            />
            <div className={`
              flex items-center justify-between p-6 bg-white rounded-[1.5rem] border-2 transition-all duration-300 shadow-soft
              ${guideCertification === 'not-necessary' ? 'border-[#006a2e] bg-[#006a2e]/5' : 'border-transparent hover:border-[#abadae]/30'}
            `}>
              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110
                  ${guideCertification === 'not-necessary' ? 'bg-[#006a2e]/10 text-[#006a2e]' : 'bg-[#eff1f2] text-[#595c5d]'}`}>
                  <Footprints className="w-8 h-8" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#2c2f30]">Not Necessary</h3>
                  <p className="text-sm text-[#595c5d]">I prefer exploring on my own</p>
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                ${guideCertification === 'not-necessary' ? 'bg-[#006a2e] border-[#006a2e]' : 'border-[#abadae]'}`}>
                {guideCertification === 'not-necessary' && <div className="w-2 h-2 bg-white rounded-full"></div>}
              </div>
            </div>
          </label>

          {/* Option: No need a guide */}
          <label className="relative group cursor-pointer block">
            <input 
              type="radio" 
              name="guide_choice" 
              checked={guideCertification === 'no-need'}
              onChange={() => handleCertificationSelect('no-need')}
              className="peer hidden" 
            />
            <div className={`
              flex items-center justify-between p-6 bg-white rounded-[1.5rem] border-2 transition-all duration-300 shadow-soft
              ${guideCertification === 'no-need' ? 'border-[#006a2e] bg-[#006a2e]/5' : 'border-transparent hover:border-[#abadae]/30'}
            `}>
              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110
                  ${guideCertification === 'no-need' ? 'bg-[#006a2e]/10 text-[#006a2e]' : 'bg-[#eff1f2] text-[#595c5d]'}`}>
                  <Map className="w-8 h-8" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#2c2f30]">No need a guide</h3>
                  <p className="text-sm text-[#595c5d]">I already know my way around</p>
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                ${guideCertification === 'no-need' ? 'bg-[#006a2e] border-[#006a2e]' : 'border-[#abadae]'}`}>
                {guideCertification === 'no-need' && <div className="w-2 h-2 bg-white rounded-full"></div>}
              </div>
            </div>
          </label>

        </div>
      </section>

      {/* Secondary Preference: Gender */}
      <div className={`transition-all duration-300 ${showGenderPreference ? 'opacity-100 max-h-40' : 'opacity-40 max-h-40 overflow-hidden pointer-events-none'}`}>
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <UserSearch className="w-5 h-5 text-[#b6004f]" strokeWidth={2} />
            <label className="text-sm font-bold uppercase tracking-widest text-[#595c5d]">
              Guide Gender Preference
            </label>
          </div>
          <div className="flex flex-wrap gap-3">
            {GUIDE_GENDER_OPTIONS.map((option) => {
              const isSelected = guideGender === option.id;
              return (
                <label key={option.id} className="cursor-pointer block">
                  <input
                    type="radio"
                    name="gender_pref"
                    checked={isSelected}
                    onChange={() => showGenderPreference && setGuideGender(option.id)}
                    className="hidden"
                  />
                  <div className={`
                    px-6 py-4 rounded-2xl font-semibold text-sm border-2 transition-all
                    ${isSelected 
                      ? 'border-[#006a2e] bg-[#5dfd8a]/20 text-[#006a2e]' 
                      : 'border-transparent bg-[#eff1f2] text-[#595c5d] hover:border-[#abadae]/30'
                    }
                  `}>
                    {option.label}
                  </div>
                </label>
              );
            })}
          </div>
        </section>
      </div>

      {/* Design Accent: Informational Card */}
      <section className="mt-12 p-6 bg-gradient-to-br from-[#006a2e]/5 to-[#006942]/5 rounded-[2rem] border border-[#006a2e]/10">
        <div className="flex gap-4">
          <Info className="w-6 h-6 text-[#006a2e] flex-shrink-0" strokeWidth={2} />
          <p className="text-[#005e3a] leading-relaxed text-sm md:text-base">
            Most travelers booking tours in the <span className="font-bold">Old City (Icherisheher)</span> find that a guide adds significant value to the historical context.
          </p>
        </div>
      </section>
    </div>
  );
}
