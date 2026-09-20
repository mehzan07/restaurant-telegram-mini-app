export type TabView = 'home' | 'menu' | 'book-table' | 'about' | 'contact';

export type Language = 'EN' | 'SV';

export interface Dish {
  id: string;
  title: string;
  titleSv: string;
  sub: string;
  subSv: string;
  price: number;
  category: 'starters' | 'mains' | 'desserts' | 'drinks';
  desc: string;
  descSv: string;
  pairing: string;
  pairingNotes: string;
  pairingNotesSv: string;
  allergens: string;
  allergensSv: string;
  tags: string[]; // 'gf' | 'vg' | 'local'
  tagLabel?: string;
  tagLabelSv?: string;
  imageUrl?: string;
  isSignature?: boolean;
}

export interface BookingState {
  guests: number | '8+';
  date: string;
  time: string;
  seatingArea: string;
  fullName: string;
  countryCode: string;
  phone: string;
  email: string;
  specialRequests: string;
}

export interface ConfirmedBooking extends BookingState {
  id: string;
  createdAt: string;
}

export interface Producer {
  name: string;
  role: string;
  roleSv: string;
  distance: string;
}

export interface FAQItem {
  question: string;
  questionSv: string;
  answer: string;
  answerSv: string;
}

export interface TastingCourse {
  courseNumber: number;
  name: string;
  nameSv: string;
  category: string;
  categorySv: string;
  desc: string;
  descSv: string;
  pairing: string;
  pairingSv: string;
}

