/*
  # Ahfa Travels Database Schema

  ## Overview
  This migration creates the database schema for the Ahfa Travels luxury Kerala tourism website.
  It includes tables for destinations, tour packages, bookings, and customer inquiries.

  ## New Tables
  
  ### `destinations`
  Stores Kerala destinations with details
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text) - Destination name (e.g., "Munnar", "Alleppey")
  - `description` (text) - Rich description of the destination
  - `location` (text) - Geographic location details
  - `highlights` (text array) - Key attractions and features
  - `image_url` (text) - Primary image URL from Pexels
  - `video_url` (text, optional) - Video URL if available
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `tour_packages`
  Stores tour package offerings
  - `id` (uuid, primary key) - Unique identifier
  - `destination_id` (uuid, foreign key) - Links to destinations table
  - `title` (text) - Package title
  - `description` (text) - Detailed package description
  - `duration_days` (integer) - Tour duration in days
  - `price` (numeric) - Package price
  - `inclusions` (text array) - What's included in the package
  - `itinerary` (jsonb) - Day-by-day itinerary details
  - `image_url` (text) - Package image URL
  - `is_featured` (boolean) - Whether to feature on homepage
  - `available_from` (date) - Start date of availability
  - `available_to` (date) - End date of availability
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `bookings`
  Stores customer bookings
  - `id` (uuid, primary key) - Unique identifier
  - `package_id` (uuid, foreign key) - Links to tour_packages table
  - `customer_name` (text) - Customer full name
  - `customer_email` (text) - Customer email
  - `customer_phone` (text) - Customer phone number
  - `travel_date` (date) - Desired travel start date
  - `num_travelers` (integer) - Number of people traveling
  - `special_requests` (text, optional) - Any special requirements
  - `status` (text) - Booking status (pending, confirmed, cancelled)
  - `created_at` (timestamptz) - Booking creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `contact_inquiries`
  Stores general contact form submissions
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text) - Inquirer name
  - `email` (text) - Inquirer email
  - `phone` (text, optional) - Inquirer phone
  - `message` (text) - Inquiry message
  - `status` (text) - Inquiry status (new, responded, closed)
  - `created_at` (timestamptz) - Inquiry timestamp

  ## Security
  
  - All tables have RLS enabled
  - Public read access for destinations and tour_packages (for browsing)
  - Authenticated insert access for bookings and inquiries (future auth implementation)
  - Admin-only access for updates and deletes (via service role)

  ## Notes
  
  - Using timestamptz for all timestamps to ensure timezone awareness
  - JSONB for flexible itinerary storage
  - Text arrays for multi-value fields like highlights and inclusions
  - Default values provided where appropriate for better data integrity
*/

-- Create destinations table
CREATE TABLE IF NOT EXISTS destinations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  location text NOT NULL,
  highlights text[] DEFAULT '{}',
  image_url text NOT NULL,
  video_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tour_packages table
CREATE TABLE IF NOT EXISTS tour_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id uuid REFERENCES destinations(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  duration_days integer NOT NULL DEFAULT 1,
  price numeric(10, 2) NOT NULL,
  inclusions text[] DEFAULT '{}',
  itinerary jsonb DEFAULT '[]'::jsonb,
  image_url text NOT NULL,
  is_featured boolean DEFAULT false,
  available_from date,
  available_to date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id uuid REFERENCES tour_packages(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  travel_date date NOT NULL,
  num_travelers integer NOT NULL DEFAULT 1,
  special_requests text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create contact_inquiries table
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for destinations (public read)
CREATE POLICY "Anyone can view destinations"
  ON destinations FOR SELECT
  USING (true);

-- RLS Policies for tour_packages (public read)
CREATE POLICY "Anyone can view tour packages"
  ON tour_packages FOR SELECT
  USING (true);

-- RLS Policies for bookings (allow inserts, users can view their own)
CREATE POLICY "Anyone can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view own bookings by email"
  ON bookings FOR SELECT
  USING (customer_email = current_setting('request.jwt.claims', true)::json->>'email');

-- RLS Policies for contact_inquiries (allow inserts)
CREATE POLICY "Anyone can submit contact inquiries"
  ON contact_inquiries FOR INSERT
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tour_packages_destination ON tour_packages(destination_id);
CREATE INDEX IF NOT EXISTS idx_tour_packages_featured ON tour_packages(is_featured);
CREATE INDEX IF NOT EXISTS idx_bookings_package ON bookings(package_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_email ON bookings(customer_email);

-- Insert sample Kerala destinations
INSERT INTO destinations (name, description, location, highlights, image_url) VALUES
('Munnar', 'A breathtaking hill station nestled in the Western Ghats, Munnar is renowned for its sprawling tea plantations, misty mountains, and cool climate. This picturesque destination offers a perfect blend of natural beauty and tranquility.', 'Idukki District, Kerala', ARRAY['Tea Plantations', 'Eravikulam National Park', 'Mattupetty Dam', 'Echo Point', 'Top Station'], 'https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg'),
('Alleppey', 'Known as the Venice of the East, Alleppey is famous for its serene backwaters, traditional houseboats, and lush paddy fields. Experience the quintessential Kerala lifestyle on a luxury houseboat cruise through tranquil waters.', 'Alappuzha District, Kerala', ARRAY['Backwater Cruises', 'Houseboat Stays', 'Alappuzha Beach', 'Nehru Trophy Boat Race', 'Village Life'], 'https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg'),
('Kochi', 'A vibrant port city blending ancient heritage with modern charm, Kochi showcases colonial architecture, spice markets, and the iconic Chinese fishing nets. This cultural hub offers a glimpse into Kerala''s rich history.', 'Ernakulam District, Kerala', ARRAY['Fort Kochi', 'Chinese Fishing Nets', 'Mattancherry Palace', 'Jewish Synagogue', 'Marine Drive'], 'https://images.pexels.com/photos/3581364/pexels-photo-3581364.jpeg'),
('Wayanad', 'A pristine hill district covered with dense forests, coffee plantations, and wildlife sanctuaries. Wayanad is an adventure lover''s paradise with trekking trails, waterfalls, and ancient caves.', 'Wayanad District, Kerala', ARRAY['Chembra Peak', 'Edakkal Caves', 'Soochipara Falls', 'Wildlife Sanctuary', 'Spice Plantations'], 'https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg'),
('Kovalam', 'An internationally acclaimed beach destination with crescent-shaped golden beaches, swaying palms, and azure waters. Kovalam offers luxury resorts, Ayurvedic treatments, and spectacular sunsets.', 'Thiruvananthapuram District, Kerala', ARRAY['Lighthouse Beach', 'Hawah Beach', 'Samudra Beach', 'Ayurvedic Spas', 'Water Sports'], 'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg'),
('Thekkady', 'Home to the renowned Periyar Wildlife Sanctuary, Thekkady is a nature lover''s delight with its spice plantations, bamboo rafting, and elephant encounters. The region is famous for its aromatic spices and rich biodiversity.', 'Idukki District, Kerala', ARRAY['Periyar Wildlife Sanctuary', 'Spice Plantations', 'Bamboo Rafting', 'Elephant Rides', 'Nature Trails'], 'https://images.pexels.com/photos/631317/pexels-photo-631317.jpeg'),
('Varkala', 'A stunning cliff-side beach destination with dramatic red laterite cliffs, natural springs, and pristine beaches. Varkala is known for its spiritual significance and laid-back atmosphere.', 'Thiruvananthapuram District, Kerala', ARRAY['Varkala Beach', 'Papanasam Beach', 'Janardhana Temple', 'Cliff Views', 'Natural Springs'], 'https://images.pexels.com/photos/3601425/pexels-photo-3601425.jpeg'),
('Kumarakom', 'A tranquil backwater village on the banks of Vembanad Lake, Kumarakom is famous for its bird sanctuary, luxury resorts, and authentic Kerala experiences. Perfect for those seeking peace and natural beauty.', 'Kottayam District, Kerala', ARRAY['Vembanad Lake', 'Bird Sanctuary', 'Backwater Cruises', 'Luxury Resorts', 'Village Walks'], 'https://images.pexels.com/photos/2583852/pexels-photo-2583852.jpeg'),
('Athirapally', 'Home to Kerala''s most spectacular waterfall, Athirapally features cascading waters amidst lush rainforests. Often called the Niagara of India, this majestic destination offers breathtaking natural beauty.', 'Thrissur District, Kerala', ARRAY['Athirapally Falls', 'Vazhachal Falls', 'Rainforest Trekking', 'Wildlife Spotting', 'River Rafting'], 'https://images.pexels.com/photos/2087391/pexels-photo-2087391.jpeg')
ON CONFLICT DO NOTHING;

-- Insert sample tour packages
INSERT INTO tour_packages (destination_id, title, description, duration_days, price, inclusions, is_featured, image_url) 
SELECT 
  d.id,
  CASE d.name
    WHEN 'Munnar' THEN 'Misty Mountain Escape'
    WHEN 'Alleppey' THEN 'Luxury Houseboat Experience'
    WHEN 'Kochi' THEN 'Heritage & Culture Tour'
    WHEN 'Wayanad' THEN 'Adventure in the Wild'
    WHEN 'Kovalam' THEN 'Beach Paradise Retreat'
    WHEN 'Thekkady' THEN 'Wildlife & Spice Trail'
    WHEN 'Varkala' THEN 'Cliff & Beach Getaway'
    WHEN 'Kumarakom' THEN 'Serene Backwater Sojourn'
    WHEN 'Athirapally' THEN 'Waterfall Wonderland'
  END,
  CASE d.name
    WHEN 'Munnar' THEN 'Immerse yourself in the misty mountains and emerald tea estates. This luxury package includes stays at premium resorts, guided plantation tours, and nature walks through pristine valleys.'
    WHEN 'Alleppey' THEN 'Cruise through Kerala''s legendary backwaters in a luxury houseboat. Enjoy traditional Kerala cuisine, witness village life, and experience the magic of floating through tranquil waters.'
    WHEN 'Kochi' THEN 'Explore the cultural heart of Kerala with visits to historic Fort Kochi, spice markets, colonial architecture, and authentic Kathakali performances.'
    WHEN 'Wayanad' THEN 'Trek through coffee plantations, explore ancient caves, and spot wildlife in this adventure-packed tour of Wayanad''s natural wonders.'
    WHEN 'Kovalam' THEN 'Relax on pristine beaches, indulge in authentic Ayurvedic treatments, and enjoy luxury beachfront accommodation with stunning ocean views.'
    WHEN 'Thekkady' THEN 'Experience Kerala''s wild side with boat safaris in Periyar, spice plantation tours, and encounters with elephants in their natural habitat.'
    WHEN 'Varkala' THEN 'Discover the unique cliff beaches of Varkala, visit ancient temples, and enjoy the natural mineral springs by the sea.'
    WHEN 'Kumarakom' THEN 'Experience the tranquility of Vembanad Lake with bird watching, village tours, and stays at exclusive lakeside resorts.'
    WHEN 'Athirapally' THEN 'Witness the majestic Athirapally Falls, trek through dense rainforests, and experience the raw power of nature.'
  END,
  CASE d.name
    WHEN 'Munnar' THEN 3
    WHEN 'Alleppey' THEN 2
    WHEN 'Kochi' THEN 2
    WHEN 'Wayanad' THEN 4
    WHEN 'Kovalam' THEN 3
    WHEN 'Thekkady' THEN 3
    WHEN 'Varkala' THEN 2
    WHEN 'Kumarakom' THEN 2
    WHEN 'Athirapally' THEN 1
  END,
  CASE d.name
    WHEN 'Munnar' THEN 18999.00
    WHEN 'Alleppey' THEN 24999.00
    WHEN 'Kochi' THEN 12999.00
    WHEN 'Wayanad' THEN 22999.00
    WHEN 'Kovalam' THEN 21999.00
    WHEN 'Thekkady' THEN 17999.00
    WHEN 'Varkala' THEN 14999.00
    WHEN 'Kumarakom' THEN 19999.00
    WHEN 'Athirapally' THEN 8999.00
  END,
  CASE d.name
    WHEN 'Munnar' THEN ARRAY['Luxury Resort Accommodation', 'All Meals', 'Tea Plantation Tours', 'Private Transportation', 'Professional Guide']
    WHEN 'Alleppey' THEN ARRAY['Private Luxury Houseboat', 'All Meals On Board', 'Backwater Cruise', 'Traditional Entertainment', 'Sunset Viewing']
    WHEN 'Kochi' THEN ARRAY['Heritage Hotel Stay', 'Breakfast Included', 'Guided City Tour', 'Kathakali Performance', 'Airport Transfers']
    WHEN 'Wayanad' THEN ARRAY['Resort Accommodation', 'All Meals', 'Trekking Guide', 'Wildlife Safari', 'Cave Exploration']
    WHEN 'Kovalam' THEN ARRAY['Beachfront Resort', 'Breakfast & Dinner', 'Ayurvedic Massage', 'Beach Activities', 'Airport Pickup']
    WHEN 'Thekkady' THEN ARRAY['Resort Stay', 'All Meals', 'Periyar Boat Safari', 'Spice Plantation Tour', 'Elephant Interaction']
    WHEN 'Varkala' THEN ARRAY['Cliff-view Hotel', 'Breakfast Included', 'Temple Visit', 'Beach Access', 'Yoga Session']
    WHEN 'Kumarakom' THEN ARRAY['Lakeside Resort', 'All Meals', 'Bird Watching Tour', 'Village Walk', 'Sunset Cruise']
    WHEN 'Athirapally' THEN ARRAY['Jungle Resort', 'Lunch Included', 'Waterfall Tour', 'Forest Trekking', 'Transportation']
  END,
  d.name IN ('Munnar', 'Alleppey', 'Kovalam'),
  d.image_url
FROM destinations d
ON CONFLICT DO NOTHING;