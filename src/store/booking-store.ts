'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Tour and destination types
export interface Destination {
  id: string;
  name: string;
  description: string;
  duration: string; // e.g., "2 hours"
  isFree: boolean;
  pricePerAdult?: number;
  pricePerChild?: number;
}

export interface Tour {
  id: string;
  title: string;
  description: string;
  heroImage: string;
  galleryImages: string[];
  destinations: Destination[];
  basePrice: number;
  duration: string; // e.g., "Full Day"
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
}

// Tour selection state
export interface TourSelection {
  tourId: string;
  selectedDestinations: string[]; // destination IDs
}

// Sample tours data
export const TOURS_DATA: Tour[] = [
  {
    id: 'historical-baku',
    title: 'Historical Baku Discovery',
    description: 'Explore the ancient walled city, stunning architecture, and centuries of history in Azerbaijan\'s capital.',
    heroImage: 'https://images.unsplash.com/photo-1603551180323-cf2e10b59813?w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1603551180323-cf2e10b59813?w=800&q=80',
      'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800&q=80',
      'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&q=80',
      'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?w=800&q=80',
    ],
    destinations: [
      { id: 'old-city', name: 'Old City (Icherisheher)', description: 'UNESCO World Heritage Site with ancient walls', duration: '2 hours', isFree: true },
      { id: 'maiden-tower', name: 'Maiden Tower', description: 'Iconic 12th century stone tower', duration: '45 min', isFree: true },
      { id: 'palace-shirvanshahs', name: 'Palace of the Shirvanshahs', description: '15th century royal residence', duration: '1.5 hours', isFree: false, pricePerAdult: 15, pricePerChild: 8 },
      { id: 'carpet-museum', name: 'Azerbaijan Carpet Museum', description: 'World\'s largest collection of Azerbaijani carpets', duration: '1 hour', isFree: false, pricePerAdult: 12, pricePerChild: 6 },
      { id: 'fountain-square', name: 'Fountain Square', description: 'Vibrant city center with cafes and shops', duration: '1 hour', isFree: true },
    ],
    basePrice: 0,
    duration: 'Full Day',
    difficulty: 'Easy',
  },
  {
    id: 'gobustan-mud',
    title: 'Gobustan & Mud Volcanoes',
    description: 'Journey to ancient rock art and otherworldly bubbling mud volcanoes in this unique day trip.',
    heroImage: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=800&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80',
    ],
    destinations: [
      { id: 'gobustan-petroglyphs', name: 'Gobustan Petroglyphs', description: 'UNESCO-listed ancient rock carvings', duration: '2 hours', isFree: true },
      { id: 'gobustan-museum', name: 'Gobustan Museum', description: 'Interactive museum about rock art', duration: '1 hour', isFree: false, pricePerAdult: 10, pricePerChild: 5 },
      { id: 'mud-volcanoes', name: 'Mud Volcanoes', description: 'Rare geological phenomenon', duration: '1.5 hours', isFree: true },
      { id: 'bibi-heybat', name: 'Bibi-Heybat Mosque', description: 'Rebuilt historic mosque with stunning views', duration: '45 min', isFree: false, pricePerAdult: 8, pricePerChild: 4 },
    ],
    basePrice: 0,
    duration: 'Half Day',
    difficulty: 'Moderate',
  },
  {
    id: 'gabala-adventure',
    title: 'Gabala Mountain Adventure',
    description: 'Escape to the lush mountains of Gabala for waterfalls, cable cars, and breathtaking nature.',
    heroImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
      'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&q=80',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80',
      'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80',
    ],
    destinations: [
      { id: 'tufandag', name: 'Tufandag Mountain Resort', description: 'Cable car with panoramic mountain views', duration: '2 hours', isFree: false, pricePerAdult: 25, pricePerChild: 15 },
      { id: 'seven-beauties', name: 'Seven Beauties Waterfall', description: 'Stunning cascading waterfall in forest', duration: '1.5 hours', isFree: true },
      { id: 'nohur-lake', name: 'Nohur Lake', description: 'Serene mountain lake with boat rides', duration: '1 hour', isFree: false, pricePerAdult: 10, pricePerChild: 5 },
      { id: 'gabala-shooting', name: 'Gabala Shooting Club', description: 'Olympic-standard shooting experience', duration: '1 hour', isFree: false, pricePerAdult: 35, pricePerChild: 20 },
      { id: 'local-lunch', name: 'Traditional Mountain Lunch', description: 'Authentic Azerbaijani cuisine', duration: '1 hour', isFree: false, pricePerAdult: 18, pricePerChild: 10 },
    ],
    basePrice: 0,
    duration: 'Full Day',
    difficulty: 'Moderate',
  },
];

// Itinerary item for Step 6
export interface ItineraryItem {
  id: string;
  day: number;
  tourId: string | null; // null for free days
  tourTitle: string;
  destinations: string[];
  isFreeDay: boolean;
}

// Hotel type for Step 7
export interface Hotel {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  pricePerNight: number;
  amenities: string[];
  location: string;
}

// Sample hotels data
export const HOTELS_DATA: Hotel[] = [
  {
    id: 'four-seasons',
    name: 'Four Seasons Baku',
    description: 'Luxurious waterfront hotel with stunning Caspian Sea views',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    rating: 5,
    pricePerNight: 350,
    amenities: ['Spa', 'Pool', 'Restaurant', 'Gym', 'Sea View'],
    location: 'Baku Boulevard',
  },
  {
    id: 'fairmont',
    name: 'Fairmont Baku',
    description: 'Iconic Flame Towers location with panoramic city views',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80',
    rating: 5,
    pricePerNight: 280,
    amenities: ['Spa', 'Pool', 'Multiple Restaurants', 'Gym'],
    location: 'Flame Towers',
  },
  {
    id: 'hilton',
    name: 'Hilton Baku',
    description: 'Modern comfort in the heart of the city center',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80',
    rating: 4,
    pricePerNight: 180,
    amenities: ['Restaurant', 'Gym', 'Business Center', 'Bar'],
    location: 'City Center',
  },
  {
    id: 'boulevard',
    name: 'Boulevard Hotel',
    description: 'Boutique hotel steps from the seaside promenade',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
    rating: 4,
    pricePerNight: 120,
    amenities: ['Restaurant', 'Bar', 'Room Service'],
    location: 'Boulevard',
  },
  {
    id: 'old-city-inn',
    name: 'Old City Inn',
    description: 'Charming boutique hotel within the ancient walls',
    image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&q=80',
    rating: 3,
    pricePerNight: 85,
    amenities: ['Breakfast', 'WiFi', 'Historic Location'],
    location: 'Icherisheher',
  },
];

// Restaurant/Dining type for Step 8
export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  description: string;
  image: string;
  priceRange: '$' | '$$' | '$$$';
  rating: number;
  mealType: 'breakfast' | 'lunch' | 'dinner';
}

// Sample restaurants data
export const RESTAURANTS_DATA: Restaurant[] = [
  // Breakfast options
  {
    id: 'mugam-club',
    name: 'Mugam Club',
    cuisine: 'Azerbaijani',
    description: 'Traditional breakfast with live mugam music',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
    priceRange: '$$',
    rating: 4.8,
    mealType: 'breakfast',
  },
  {
    id: 'paul-baku',
    name: 'Paul Baku',
    cuisine: 'French Bakery',
    description: 'Fresh pastries and European breakfast',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
    priceRange: '$$',
    rating: 4.5,
    mealType: 'breakfast',
  },
  // Lunch options
  {
    id: 'firuze',
    name: 'Firuze Restaurant',
    cuisine: 'Azerbaijani',
    description: 'Authentic local cuisine in Old City setting',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
    priceRange: '$$',
    rating: 4.7,
    mealType: 'lunch',
  },
  {
    id: 'scalini',
    name: 'Scalini',
    cuisine: 'Italian',
    description: 'Fine Italian dining with Caspian views',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
    priceRange: '$$$',
    rating: 4.6,
    mealType: 'lunch',
  },
  {
    id: 'dolma',
    name: 'Dolma Restaurant',
    cuisine: 'Azerbaijani',
    description: 'Famous for traditional dolma varieties',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
    priceRange: '$$',
    rating: 4.8,
    mealType: 'lunch',
  },
  // Dinner options
  {
    id: 'chinar',
    name: 'Chinar Restaurant',
    cuisine: 'Azerbaijani Fine Dining',
    description: 'Upscale Azerbaijani cuisine with modern twist',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80',
    priceRange: '$$$',
    rating: 4.9,
    mealType: 'dinner',
  },
  {
    id: 'sumakh',
    name: 'Sumakh',
    cuisine: 'Modern Azerbaijani',
    description: 'Contemporary take on traditional flavors',
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&q=80',
    priceRange: '$$$',
    rating: 4.7,
    mealType: 'dinner',
  },
  {
    id: 'mangal-steak',
    name: 'Mangal Steakhouse',
    cuisine: 'Steakhouse',
    description: 'Premium cuts and local kebabs',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80',
    priceRange: '$$$',
    rating: 4.6,
    mealType: 'dinner',
  },
];

// Dining selection per day - DEPRECATED, now using DiningExperience
export interface DayDining {
  day: number;
  breakfast: string | null;
  lunch: string | null;
  dinner: string | null;
}

// NEW: Special Dining Experience type
export interface DiningExperience {
  id: string;
  name: string;
  description: string;
  image: string;
  type: 'signature' | 'cultural' | 'rooftop' | 'traditional';
  price: number;
  duration: string;
  highlights: string[];
}

// Special Dining Experiences data
export const DINING_EXPERIENCES: DiningExperience[] = [
  {
    id: 'exp-mugam',
    name: 'Mugam Music Dinner',
    description: 'Traditional Azerbaijani feast with live mugam music performance',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
    type: 'cultural',
    price: 65,
    duration: '3 hours',
    highlights: ['Live Music', '7-Course Meal', 'Traditional Dance'],
  },
  {
    id: 'exp-flame',
    name: 'Flame Towers Sky Dinner',
    description: 'Fine dining with panoramic views of Baku from the iconic towers',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
    type: 'rooftop',
    price: 120,
    duration: '2.5 hours',
    highlights: ['360° Views', 'Sunset Timing', 'Chef\'s Tasting Menu'],
  },
  {
    id: 'exp-old-city',
    name: 'Old City Food Tour',
    description: 'Walking tour through historic streets with multiple food stops',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
    type: 'traditional',
    price: 45,
    duration: '4 hours',
    highlights: ['6 Food Stops', 'Local Guide', 'Hidden Gems'],
  },
  {
    id: 'exp-wine',
    name: 'Azerbaijani Wine Tasting',
    description: 'Curated wine experience featuring local vineyards and pairings',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80',
    type: 'signature',
    price: 85,
    duration: '2 hours',
    highlights: ['5 Wine Tastings', 'Cheese Pairing', 'Sommelier Host'],
  },
  {
    id: 'exp-kebab',
    name: 'Master Kebab Experience',
    description: 'Learn the art of Azerbaijani kebab from a master grill chef',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80',
    type: 'traditional',
    price: 55,
    duration: '3 hours',
    highlights: ['Hands-on Cooking', 'Recipe Book', 'Family-style Feast'],
  },
  {
    id: 'exp-caspian',
    name: 'Caspian Seafood Feast',
    description: 'Fresh catch dining on a private seaside terrace',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80',
    type: 'signature',
    price: 95,
    duration: '2.5 hours',
    highlights: ['Fresh Sturgeon', 'Caviar Tasting', 'Sea Views'],
  },
];

// User contact info for Step 9
export interface UserContactInfo {
  firstName: string;
  lastName: string;
  countryCode: string;
  whatsappNumber: string;
  notes: string;
}

// Country codes for phone selector
export const COUNTRY_CODES = [
  { code: '+994', country: 'Azerbaijan', flag: '🇦🇿' },
  { code: '+1', country: 'USA/Canada', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦' },
  { code: '+7', country: 'Russia', flag: '🇷🇺' },
  { code: '+90', country: 'Turkey', flag: '🇹🇷' },
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+86', country: 'China', flag: '🇨🇳' },
];

// Transport options data
export const TRANSPORT_OPTIONS = [
  {
    id: 'sedan',
    title: 'Standard Sedan',
    description: 'Comfortable sedan for small groups',
    capacity: 4,
    pricePerDay: 45,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-72sCm6vDeDDf4cAoHvCflcH6X240-2K-2ku6P6s7DzgtM_2lNF1HbLdGycO7UoL6Y6TbePWIe1RkBMH5x8L9_5ov4ISN00at6IRZmKFTbpWS71wuqNlzaDwRuqNESRuAG5ByebXdTucJV4omuTUjjuqGCfvDkBonLGRAhZTAcGNR_eAWdMSMZOH_g2u0aARsuVZ2d4P0a6LeNREdoebDZCIIQ-FkLInwCinPcl_1PhOllCmFXI3HzukhMC6CZ0ZPWS7264bjnqU',
  },
  {
    id: 'suv',
    title: 'Premium SUV',
    description: 'Spacious SUV for family trips',
    capacity: 6,
    pricePerDay: 65,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9Md83IsN-5LWvaI9WslJzWubfLcpQBD04qGYhvWcUnzMPMVmo3mjQT_LjTr4HKcfU8ikmZA_l1YSS1BDA5z8LuGJhKhNvvet3FbZZe2i5ukm0L6xhz5QpESdwr1v6LKzdaBFJLQdU6D76yWJxxrMgF-E8P899w7RrHChGYKFW-uM93u_vRD96d2BRTGCum7WcCG7rvyHlA645fs8gNi_I7PqOF8Y4PEXyhqrFtGduQnn8rplnvXBA1M8t5DFy6jIYC4l-pUmaaT8',
  },
  {
    id: 'minivan',
    title: 'Travel Minibus',
    description: 'Perfect for medium groups',
    capacity: 12,
    pricePerDay: 85,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0YVGJxKrGhoOXowFqi5jC7SmklATV7ie4Jd24VW00No0SJ7VcXHoL19OAqGjyeiWCMCOF9gYFfcMVbEKHLlstDvskOM8YPS6e4iem0BBZ6xXQ1VQ1fPrWLKeSgmEpt7R2D6jk7bqW6BWQedXdvGR3U5-KyVNfusEv9_YDTOSvDVNqHHpue5z8izYm8KTB3Ra5hgGG1hIyT4bEDWV-Pv3qc1f_QWdSbT32GgcSKsM1FSE1aA5LydySURpcl9KRvk9aEOBDDUwQPP4',
  },
  {
    id: 'sprinter',
    title: 'Mercedes Sprinter',
    description: 'Premium transport for larger groups',
    capacity: 15,
    pricePerDay: 120,
    image: 'https://images.unsplash.com/photo-1638210134460-7a0e5d0335e2?w=800&auto=format&fit=crop',
  },
  {
    id: 'bus',
    title: 'Tour Bus',
    description: 'Ideal for big groups and tours',
    capacity: 40,
    pricePerDay: 200,
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop',
  },
];

// Guide options
export const GUIDE_CERTIFICATION_OPTIONS = [
  { id: 'certified', label: 'Certified Guide' },
  { id: 'not-necessary', label: 'Not Necessary' },
  { id: 'no-need', label: 'No need a guide' },
];

export const GUIDE_GENDER_OPTIONS = [
  { id: 'male', label: 'Male' },
  { id: 'female', label: 'Female' },
  { id: 'no-preference', label: 'No Preference' },
];

// Booking state interface
export interface BookingState {
  // Step 1: Party Size
  adults: number;
  children: number;
  
  // Step 2: Dates
  startDate: string | null;
  endDate: string | null;
  
  // Step 3: Transport
  selectedTransport: string | null;
  
  // Step 4: Guides
  guideCertification: string | null;
  guideGender: string | null;
  
  // Step 5: Tours
  selectedTours: TourSelection[];
  
  // Step 6: Itinerary
  itineraryOrder: ItineraryItem[];
  itineraryModified: boolean;
  
  // Step 7: Hotels
  selectedHotel: string | null;
  
  // Step 8: Dining Experiences (NEW - simplified)
  selectedDiningExperiences: string[]; // experience IDs
  
  // Step 9: Contact Info (was Step 9, now Step 8 in UX but still Step 9 in code)
  contactInfo: UserContactInfo;
  
  // Step 10: Submission
  isSubmitted: boolean;
  submissionId: string | null;
  
  // Skipped steps tracking
  skippedSteps: number[];
  
  // Navigation
  currentStep: number;
  completedSteps: number[];
  
  // Actions
  setAdults: (count: number) => void;
  setChildren: (count: number) => void;
  setStartDate: (date: string | null) => void;
  setEndDate: (date: string | null) => void;
  setSelectedTransport: (transportId: string | null) => void;
  setGuideCertification: (option: string | null) => void;
  setGuideGender: (option: string | null) => void;
  
  // Tour actions
  selectTour: (tourId: string) => void;
  deselectTour: (tourId: string) => void;
  isTourSelected: (tourId: string) => boolean;
  toggleDestination: (tourId: string, destinationId: string) => void;
  isDestinationSelected: (tourId: string, destinationId: string) => boolean;
  getSelectedDestinations: (tourId: string) => string[];
  getTourExtrasPrice: () => number;
  
  // Step 6: Itinerary actions
  initializeItinerary: () => void;
  reorderItinerary: (fromIndex: number, toIndex: number) => void;
  resetItineraryOrder: () => void;
  
  // Step 7: Hotel actions
  setSelectedHotel: (hotelId: string | null) => void;
  getHotelPrice: () => number;
  
  // Step 8: Dining Experience actions (NEW)
  toggleDiningExperience: (experienceId: string) => void;
  getDiningExperiencesPrice: () => number;
  
  // Step 9: Contact actions
  updateContactInfo: (field: keyof UserContactInfo, value: string) => void;
  
  // Step 10: Submission
  submitBooking: () => Promise<string>;
  getBookingPayload: () => object;
  
  // Skip step action
  skipStep: (step: number) => void;
  isStepSkipped: (step: number) => boolean;
  
  setCurrentStep: (step: number) => void;
  markStepComplete: (step: number) => void;
  canProceedToStep: (step: number) => boolean;
  getStepValidation: (step: number) => { isValid: boolean; error: string | null };
  getTotalPrice: () => number;
  getTripDuration: () => number;
  resetBooking: () => void;

  // UX: fullscreen image viewer
  fullscreenImage: string | null;
  setFullscreenImage: (url: string | null) => void;
}

const initialContactInfo: UserContactInfo = {
  firstName: '',
  lastName: '',
  countryCode: '+994',
  whatsappNumber: '',
  notes: '',
};

const initialState = {
  adults: 1,
  children: 0,
  startDate: null,
  endDate: null,
  selectedTransport: null,
  guideCertification: null,
  guideGender: null,
  selectedTours: [] as TourSelection[],
  itineraryOrder: [] as ItineraryItem[],
  itineraryModified: false,
  selectedHotel: null,
  selectedDiningExperiences: [] as string[],
  contactInfo: initialContactInfo,
  fullscreenImage: null as string | null,
  isSubmitted: false,
  submissionId: null,
  skippedSteps: [] as number[],
  currentStep: 1,
  completedSteps: [] as number[],
};

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setFullscreenImage: (url) => set({ fullscreenImage: url }),

      setAdults: (count) => set({ adults: Math.max(1, Math.min(20, count)) }),
      setChildren: (count) => set({ children: Math.max(0, Math.min(20, count)) }),
      
      setStartDate: (date) => {
        const { endDate } = get();
        // If end date exists and is before new start date, clear end date
        if (date && endDate && new Date(endDate) < new Date(date)) {
          set({ startDate: date, endDate: null });
        } else {
          set({ startDate: date });
        }
      },
      
      setEndDate: (date) => set({ endDate: date }),
      
      setSelectedTransport: (transportId) => set({ selectedTransport: transportId }),
      
      setGuideCertification: (option) => set({ guideCertification: option }),
      
      setGuideGender: (option) => set({ guideGender: option }),
      
      // Tour actions
      selectTour: (tourId) => {
        const { selectedTours } = get();
        const tour = TOURS_DATA.find(t => t.id === tourId);
        if (!tour || selectedTours.some(t => t.tourId === tourId)) return;
        
        // Auto-select free destinations
        const freeDestinations = tour.destinations
          .filter(d => d.isFree)
          .map(d => d.id);
        
        set({
          selectedTours: [
            ...selectedTours,
            { tourId, selectedDestinations: freeDestinations }
          ]
        });
      },
      
      deselectTour: (tourId) => {
        const { selectedTours } = get();
        set({
          selectedTours: selectedTours.filter(t => t.tourId !== tourId)
        });
      },
      
      isTourSelected: (tourId) => {
        const { selectedTours } = get();
        return selectedTours.some(t => t.tourId === tourId);
      },
      
      toggleDestination: (tourId, destinationId) => {
        const { selectedTours } = get();
        let tourSelection = selectedTours.find(t => t.tourId === tourId);
        
        // If tour not selected yet, select it first to unblock user
        if (!tourSelection) {
          get().selectTour(tourId);
          // Re-fetch tour after auto-selecting
          tourSelection = get().selectedTours.find(t => t.tourId === tourId);
          if (!tourSelection) return;
        }
        
        const isSelected = tourSelection.selectedDestinations.includes(destinationId);
        const updatedDestinations = isSelected
          ? tourSelection.selectedDestinations.filter(id => id !== destinationId)
          : [...tourSelection.selectedDestinations, destinationId];
        
        set({
          selectedTours: get().selectedTours.map(t =>
            t.tourId === tourId
              ? { ...t, selectedDestinations: updatedDestinations }
              : t
          )
        });
      },
      
      isDestinationSelected: (tourId, destinationId) => {
        const { selectedTours } = get();
        const tourSelection = selectedTours.find(t => t.tourId === tourId);
        return tourSelection?.selectedDestinations.includes(destinationId) ?? false;
      },
      
      getSelectedDestinations: (tourId) => {
        const { selectedTours } = get();
        const tourSelection = selectedTours.find(t => t.tourId === tourId);
        return tourSelection?.selectedDestinations ?? [];
      },
      
      getTourExtrasPrice: () => {
        const state = get();
        let total = 0;
        
        for (const selection of state.selectedTours) {
          const tour = TOURS_DATA.find(t => t.id === selection.tourId);
          if (!tour) continue;
          
          for (const destId of selection.selectedDestinations) {
            const dest = tour.destinations.find(d => d.id === destId);
            if (dest && !dest.isFree) {
              total += (dest.pricePerAdult ?? 0) * state.adults;
              total += (dest.pricePerChild ?? 0) * state.children;
            }
          }
        }
        
        return total;
      },
      
      // Step 6: Itinerary actions - now includes free days
      initializeItinerary: () => {
        const state = get();
        const { selectedTours } = state;
        const tripDuration = state.getTripDuration();
        
        // Build tour items
        const tourItems: ItineraryItem[] = selectedTours.map((selection, index) => {
          const tour = TOURS_DATA.find(t => t.id === selection.tourId);
          return {
            id: `itinerary-${selection.tourId}`,
            day: index + 1,
            tourId: selection.tourId,
            tourTitle: tour?.title ?? 'Unknown Tour',
            destinations: selection.selectedDestinations,
            isFreeDay: false,
          };
        });
        
        // Add free days if trip is longer than tours
        const freeDaysNeeded = Math.max(0, tripDuration - tourItems.length);
        const freeDayItems: ItineraryItem[] = [];
        for (let i = 0; i < freeDaysNeeded; i++) {
          freeDayItems.push({
            id: `free-day-${i + 1}`,
            day: tourItems.length + i + 1,
            tourId: null,
            tourTitle: 'Free Day / Leisure',
            destinations: [],
            isFreeDay: true,
          });
        }
        
        const allItems = [...tourItems, ...freeDayItems];
        set({ itineraryOrder: allItems, itineraryModified: false });
      },
      
      reorderItinerary: (fromIndex, toIndex) => {
        const { itineraryOrder } = get();
        const newOrder = [...itineraryOrder];
        const [removed] = newOrder.splice(fromIndex, 1);
        newOrder.splice(toIndex, 0, removed);
        // Update day numbers
        const updatedOrder = newOrder.map((item, index) => ({
          ...item,
          day: index + 1,
        }));
        set({ itineraryOrder: updatedOrder, itineraryModified: true });
      },
      
      resetItineraryOrder: () => {
        // Re-initialize to trigger the free days logic
        get().initializeItinerary();
      },
      
      // Step 7: Hotel actions
      setSelectedHotel: (hotelId) => set({ selectedHotel: hotelId }),
      
      getHotelPrice: () => {
        const state = get();
        if (!state.selectedHotel) return 0;
        const hotel = HOTELS_DATA.find(h => h.id === state.selectedHotel);
        if (!hotel) return 0;
        const nights = Math.max(0, state.getTripDuration() - 1);
        return hotel.pricePerNight * Math.max(1, nights);
      },
      
      // Step 8: Dining Experience actions (NEW - simplified)
      toggleDiningExperience: (experienceId) => {
        const { selectedDiningExperiences } = get();
        const isSelected = selectedDiningExperiences.includes(experienceId);
        if (isSelected) {
          set({ selectedDiningExperiences: selectedDiningExperiences.filter(id => id !== experienceId) });
        } else {
          set({ selectedDiningExperiences: [...selectedDiningExperiences, experienceId] });
        }
      },
      
      getDiningExperiencesPrice: () => {
        const { selectedDiningExperiences, adults, children } = get();
        let total = 0;
        for (const expId of selectedDiningExperiences) {
          const exp = DINING_EXPERIENCES.find(e => e.id === expId);
          if (exp) {
            // Price per person, children at 50%
            total += exp.price * adults + (exp.price * 0.5) * children;
          }
        }
        return total;
      },
      
      // Step 9: Contact actions
      updateContactInfo: (field, value) => {
        const { contactInfo } = get();
        set({ contactInfo: { ...contactInfo, [field]: value } });
      },
      
      // Skip step action
      skipStep: (step) => {
        const { skippedSteps, completedSteps } = get();
        if (!skippedSteps.includes(step)) {
          set({ 
            skippedSteps: [...skippedSteps, step],
            completedSteps: [...completedSteps, step]
          });
        }
      },
      
      isStepSkipped: (step) => {
        return get().skippedSteps.includes(step);
      },
      
      // Step 10: Submission
      getBookingPayload: () => {
        const state = get();
        
        // Build comprehensive payload
        const payload = {
          booking: {
            id: `BK-${Date.now()}`,
            createdAt: new Date().toISOString(),
            status: 'pending',
          },
          travelers: {
            adults: state.adults,
            children: state.children,
            total: state.adults + state.children,
          },
          dates: {
            start: state.startDate,
            end: state.endDate,
            duration: state.getTripDuration(),
            nights: Math.max(0, state.getTripDuration() - 1),
          },
          transport: state.selectedTransport ? {
            id: state.selectedTransport,
            details: TRANSPORT_OPTIONS.find(t => t.id === state.selectedTransport) ?? null,
            skipped: false,
          } : { skipped: true },
          guide: {
            certification: state.guideCertification,
            genderPreference: state.guideGender,
            skipped: state.skippedSteps.includes(4),
          },
          tours: state.selectedTours.map(selection => {
            const tour = TOURS_DATA.find(t => t.id === selection.tourId);
            return {
              tourId: selection.tourId,
              tourTitle: tour?.title ?? 'Unknown',
              destinations: selection.selectedDestinations.map(destId => {
                const dest = tour?.destinations.find(d => d.id === destId);
                return {
                  id: destId,
                  name: dest?.name ?? 'Unknown',
                  isFree: dest?.isFree ?? true,
                  pricePerAdult: dest?.pricePerAdult ?? 0,
                  pricePerChild: dest?.pricePerChild ?? 0,
                };
              }),
            };
          }),
          itinerary: state.itineraryOrder.map(item => ({
            day: item.day,
            tourId: item.tourId,
            tourTitle: item.tourTitle,
            destinations: item.destinations,
            isFreeDay: item.isFreeDay,
          })),
          hotel: state.selectedHotel ? {
            id: state.selectedHotel,
            details: HOTELS_DATA.find(h => h.id === state.selectedHotel) ?? null,
            skipped: false,
          } : { skipped: true },
          diningExperiences: state.selectedDiningExperiences.map(expId => {
            const exp = DINING_EXPERIENCES.find(e => e.id === expId);
            return exp ?? null;
          }).filter(Boolean),
          contact: {
            firstName: state.contactInfo.firstName,
            lastName: state.contactInfo.lastName,
            whatsapp: `${state.contactInfo.countryCode}${state.contactInfo.whatsappNumber}`,
            notes: state.contactInfo.notes,
          },
          pricing: {
            transport: (() => {
              const transport = TRANSPORT_OPTIONS.find(t => t.id === state.selectedTransport);
              return transport ? transport.pricePerDay * Math.max(1, state.getTripDuration()) : 0;
            })(),
            guide: state.guideCertification === 'certified' ? 50 * Math.max(1, state.getTripDuration()) : 0,
            tourExtras: state.getTourExtrasPrice(),
            hotel: state.getHotelPrice(),
            diningExperiences: state.getDiningExperiencesPrice(),
            total: state.getTotalPrice(),
          },
          skippedSteps: state.skippedSteps,
        };
        
        return payload;
      },
      
      submitBooking: async () => {
        const state = get();
        const payload = state.getBookingPayload();
        
        // Log the payload (ready for webhook)
        console.log('='.repeat(60));
        console.log('BOOKING SUBMISSION PAYLOAD');
        console.log('='.repeat(60));
        console.log(JSON.stringify(payload, null, 2));
        console.log('='.repeat(60));
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Generate submission ID
        const submissionId = `BK-${Date.now().toString(36).toUpperCase()}`;
        
        set({ isSubmitted: true, submissionId });
        
        return submissionId;
      },
      
      setCurrentStep: (step) => set({ currentStep: step }),
      
      markStepComplete: (step) => {
        const { completedSteps } = get();
        if (!completedSteps.includes(step)) {
          set({ completedSteps: [...completedSteps, step] });
        }
      },
      
      canProceedToStep: (step) => {
        const state = get();
        // Can always go back
        if (step < state.currentStep) return true;
        // Can only proceed if current and all previous steps are valid
        for (let i = 1; i < step; i++) {
          const validation = state.getStepValidation(i);
          if (!validation.isValid) return false;
        }
        return true;
      },
      
      getStepValidation: (step) => {
        const state = get();
        
        switch (step) {
          case 1: // Party Size
            if (state.adults < 1) {
              return { isValid: false, error: 'At least 1 adult is required' };
            }
            const totalPeople = state.adults + state.children;
            if (totalPeople > 40) {
              return { isValid: false, error: 'Maximum 40 travelers allowed' };
            }
            return { isValid: true, error: null };
            
          case 2: // Dates
            if (!state.startDate) {
              return { isValid: false, error: 'Please select a start date' };
            }
            if (!state.endDate) {
              return { isValid: false, error: 'Please select an end date' };
            }
            if (new Date(state.endDate) <= new Date(state.startDate)) {
              return { isValid: false, error: 'End date must be after start date' };
            }
            return { isValid: true, error: null };
            
          case 3: // Transport - OPTIONAL (can skip)
            // If skipped, it's valid
            if (state.skippedSteps.includes(3)) {
              return { isValid: true, error: null };
            }
            if (!state.selectedTransport) {
              return { isValid: false, error: 'Please select transport or skip this step' };
            }
            const transport = TRANSPORT_OPTIONS.find(t => t.id === state.selectedTransport);
            const totalTravelers = state.adults + state.children;
            if (transport && totalTravelers > transport.capacity) {
              return { isValid: false, error: `Selected transport only fits ${transport.capacity} people` };
            }
            return { isValid: true, error: null };
            
          case 4: // Guides - OPTIONAL (can skip)
            if (state.skippedSteps.includes(4)) {
              return { isValid: true, error: null };
            }
            if (!state.guideCertification) {
              return { isValid: false, error: 'Please select a guide preference or skip' };
            }
            if (state.guideCertification === 'certified' && !state.guideGender) {
              return { isValid: false, error: 'Please select guide gender preference' };
            }
            return { isValid: true, error: null };
            
          case 5: // Tours
            if (state.selectedTours.length === 0) {
              return { isValid: false, error: 'Please select at least one tour' };
            }
            return { isValid: true, error: null };
            
          case 6: // Itinerary
            if (state.itineraryOrder.length === 0) {
              return { isValid: false, error: 'Please arrange your itinerary' };
            }
            return { isValid: true, error: null };
            
          case 7: // Contact (formerly Step 9)
            if (!state.contactInfo.firstName.trim()) {
              return { isValid: false, error: 'Please enter your first name' };
            }
            if (!state.contactInfo.lastName.trim()) {
              return { isValid: false, error: 'Please enter your last name' };
            }
            if (!state.contactInfo.whatsappNumber.trim()) {
              return { isValid: false, error: 'Please enter your WhatsApp number' };
            }
            if (state.contactInfo.whatsappNumber.length < 7) {
              return { isValid: false, error: 'Please enter a valid phone number' };
            }
            return { isValid: true, error: null };
            
          case 8: // Success (formerly Step 10)
            return { isValid: true, error: null };
            
          default:
            return { isValid: true, error: null };
        }
      },
      
      getTripDuration: () => {
        const { startDate, endDate } = get();
        if (!startDate || !endDate) return 0;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
      },
      
      getTotalPrice: () => {
        const state = get();
        let total = 0;
        
        // Transport cost
        if (state.selectedTransport) {
          const transport = TRANSPORT_OPTIONS.find(t => t.id === state.selectedTransport);
          if (transport) {
            const days = state.getTripDuration();
            total += transport.pricePerDay * Math.max(1, days);
          }
        }
        
        // Guide cost (if certified)
        if (state.guideCertification === 'certified') {
          const days = state.getTripDuration();
          total += 50 * Math.max(1, days); // $50/day for certified guide
        }
        
        // Tour extras cost
        total += state.getTourExtrasPrice();
        
        // Hotel cost
        total += state.getHotelPrice();
        
        // Dining experiences cost
        total += state.getDiningExperiencesPrice();
        
        return total;
      },
      
      resetBooking: () => set(initialState),
    }),
    {
      name: 'travel-booking-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        adults: state.adults,
        children: state.children,
        startDate: state.startDate,
        endDate: state.endDate,
        selectedTransport: state.selectedTransport,
        guideCertification: state.guideCertification,
        guideGender: state.guideGender,
        selectedTours: state.selectedTours,
        itineraryOrder: state.itineraryOrder,
        itineraryModified: state.itineraryModified,
        selectedHotel: state.selectedHotel,
        selectedDiningExperiences: state.selectedDiningExperiences,
        contactInfo: state.contactInfo,
        isSubmitted: state.isSubmitted,
        submissionId: state.submissionId,
        skippedSteps: state.skippedSteps,
        currentStep: state.currentStep,
        completedSteps: state.completedSteps,
      }),
    }
  )
);
