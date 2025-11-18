export interface TruckLocation {
  lat: number;
  lng: number;
  address: string;
  name: string;
  updatedAt?: Date;
}

export interface TruckEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  location: string;
  description?: string;
  type: 'this-week' | 'upcoming';
  createdAt?: Date;
}

export interface WeeklySchedule {
  day: string;
  location?: string;
  time?: string;
  notes?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  flavors?: string[];
  addOns?: string[];
  toppings?: string[];
  price?: string;
}

export interface NavigationProps {
  className?: string;
}

export interface FooterProps {
  className?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  message: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: React.ReactNode;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  initials: string;
}

export interface MerchandiseItem {
  id: string;
  name: string;
  description: string;
  price?: string;
  image?: string;
  available: boolean;
}
