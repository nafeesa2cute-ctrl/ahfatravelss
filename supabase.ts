import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Destination = {
  id: string;
  name: string;
  description: string;
  location: string;
  highlights: string[];
  image_url: string;
  video_url?: string;
  created_at: string;
  updated_at: string;
};

export type TourPackage = {
  id: string;
  destination_id: string;
  title: string;
  description: string;
  duration_days: number;
  price: number;
  inclusions: string[];
  itinerary: any;
  image_url: string;
  is_featured: boolean;
  available_from?: string;
  available_to?: string;
  created_at: string;
  updated_at: string;
};

export type Booking = {
  package_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  travel_date: string;
  num_travelers: number;
  special_requests?: string;
};

export type ContactInquiry = {
  name: string;
  email: string;
  phone?: string;
  message: string;
};
