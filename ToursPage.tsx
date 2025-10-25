import { useState, useEffect } from 'react';
import { Calendar, Users, MapPin, Sparkles } from 'lucide-react';
import { supabase, TourPackage, Destination } from '../lib/supabase';

type ToursPageProps = {
  onNavigate: (page: string, packageId?: string) => void;
};

export default function ToursPage({ onNavigate }: ToursPageProps) {
  const [packages, setPackages] = useState<(TourPackage & { destination?: Destination })[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      const { data: packagesData, error: packagesError } = await supabase
        .from('tour_packages')
        .select('*')
        .order('is_featured', { ascending: false });

      if (packagesError) throw packagesError;

      const { data: destinationsData, error: destinationsError } = await supabase
        .from('destinations')
        .select('*');

      if (destinationsError) throw destinationsError;

      const enrichedPackages = packagesData?.map((pkg) => ({
        ...pkg,
        destination: destinationsData?.find((d) => d.id === pkg.destination_id),
      }));

      setPackages(enrichedPackages || []);
    } catch (error) {
      console.error('Error loading packages:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-emerald-900 to-slate-900 flex items-center justify-center">
        <div className="text-amber-400 text-2xl animate-pulse">Loading luxury experiences...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-emerald-900 to-slate-900 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-white drop-shadow-2xl">
            Curated{' '}
            <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">
              Kerala
            </span>{' '}
            Experiences
          </h1>
          <p className="text-xl text-amber-100/80 max-w-3xl mx-auto font-light">
            Handcrafted luxury tours showcasing the finest destinations in God's Own Country
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              onMouseEnter={() => setHoveredCard(pkg.id)}
              onMouseLeave={() => setHoveredCard(null)}
              className="group relative bg-gradient-to-b from-slate-800/50 to-slate-900/50 rounded-2xl overflow-hidden backdrop-blur-sm border border-amber-500/20 hover:border-amber-400/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/20"
              style={{
                transform:
                  hoveredCard === pkg.id
                    ? 'perspective(1000px) rotateX(2deg) rotateY(-2deg)'
                    : 'none',
                transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
              }}
            >
              {pkg.is_featured && (
                <div className="absolute top-4 left-4 z-10 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-600 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  FEATURED
                </div>
              )}

              <div className="relative h-64 overflow-hidden">
                <img
                  src={pkg.image_url}
                  alt={pkg.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-serif font-bold text-white drop-shadow-lg mb-1">
                    {pkg.title}
                  </h3>
                  {pkg.destination && (
                    <div className="flex items-center gap-1 text-amber-300 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>{pkg.destination.name}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-gray-300 text-sm line-clamp-3">{pkg.description}</p>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-amber-200">
                    <Calendar className="w-4 h-4" />
                    <span>{pkg.duration_days} Days</span>
                  </div>
                  <div className="flex items-center gap-2 text-amber-200">
                    <Users className="w-4 h-4" />
                    <span>All Group Sizes</span>
                  </div>
                </div>

                <div className="border-t border-amber-500/20 pt-4 flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-xs">Starting from</p>
                    <p className="text-2xl font-bold text-amber-400">
                      ₹{pkg.price.toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigate('contact', pkg.id)}
                    className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-600 text-white font-medium rounded-lg shadow-lg hover:shadow-amber-500/50 hover:scale-105 transition-all duration-300"
                  >
                    Book Now
                  </button>
                </div>

                <div className="pt-2">
                  <p className="text-xs text-gray-400 mb-2">Includes:</p>
                  <div className="flex flex-wrap gap-2">
                    {pkg.inclusions.slice(0, 3).map((inclusion, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-emerald-900/30 text-emerald-300 text-xs rounded-full border border-emerald-500/20"
                      >
                        {inclusion}
                      </span>
                    ))}
                    {pkg.inclusions.length > 3 && (
                      <span className="px-2 py-1 bg-amber-900/30 text-amber-300 text-xs rounded-full border border-amber-500/20">
                        +{pkg.inclusions.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
