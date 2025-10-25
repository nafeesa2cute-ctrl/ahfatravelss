import { useEffect, useRef, useState } from 'react';
import { Waves, Coffee, Palmtree, Ship, Mountain, Sparkles } from 'lucide-react';

type ExperiencesPageProps = {
  onNavigate: (page: string) => void;
};

const experiences = [
  {
    icon: Ship,
    title: 'Houseboat Luxury',
    description:
      'Drift through serene backwaters aboard traditional kettuvallams transformed into floating palaces. Experience Kerala cuisine, witness village life, and embrace the tranquil rhythm of waterways.',
    image: 'https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg',
    features: ['Private Chef', 'Sunset Cruises', 'Traditional Decor', 'Premium Amenities'],
  },
  {
    icon: Coffee,
    title: 'Spice Plantation Tours',
    description:
      'Walk through aromatic spice gardens where cardamom, pepper, and vanilla grow wild. Learn ancient cultivation secrets and experience farm-to-table dining with freshly harvested spices.',
    image: 'https://images.pexels.com/photos/631317/pexels-photo-631317.jpeg',
    features: ['Guided Tours', 'Spice Tastings', 'Organic Farming', 'Fresh Cuisine'],
  },
  {
    icon: Mountain,
    title: 'Hill Station Retreats',
    description:
      'Escape to misty mountains where emerald tea estates blanket the slopes. Breathe crisp mountain air, explore valleys, and witness sunrise over rolling hills in luxury resorts.',
    image: 'https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg',
    features: ['Tea Factory Tours', 'Nature Walks', 'Mountain Views', 'Cool Climate'],
  },
  {
    icon: Waves,
    title: 'Beach Wellness',
    description:
      'Rejuvenate on pristine beaches with authentic Ayurvedic treatments. Combine ocean therapy with traditional healing practices for complete mind-body wellness.',
    image: 'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg',
    features: ['Ayurvedic Spa', 'Yoga Sessions', 'Beach Access', 'Wellness Programs'],
  },
  {
    icon: Palmtree,
    title: 'Cultural Immersion',
    description:
      'Experience Kerala\'s rich heritage through Kathakali performances, temple festivals, and traditional art forms. Witness centuries-old traditions kept alive in modern times.',
    image: 'https://images.pexels.com/photos/3581364/pexels-photo-3581364.jpeg',
    features: ['Dance Performances', 'Temple Visits', 'Local Festivals', 'Art Workshops'],
  },
  {
    icon: Sparkles,
    title: 'Wildlife Adventures',
    description:
      'Explore dense forests and wildlife sanctuaries home to elephants, tigers, and exotic birds. Experience nature at its finest with guided safaris and eco-tourism.',
    image: 'https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg',
    features: ['Jungle Safaris', 'Bird Watching', 'Elephant Encounters', 'Nature Trails'],
  },
];

export default function ExperiencesPage({ onNavigate }: ExperiencesPageProps) {
  const [visibleSections, setVisibleSections] = useState<Set<number>>(new Set());
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute('data-index'));
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, index]));
          }
        });
      },
      { threshold: 0.2 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-emerald-900 to-slate-900">
      <div className="relative h-[60vh] overflow-hidden">
        <img
          src="https://images.pexels.com/photos/3571264/pexels-photo-3571264.jpeg"
          alt="Kerala Experience"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-slate-900"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white drop-shadow-2xl mb-6">
            Crafted{' '}
            <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">
              Experiences
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-amber-100/90 max-w-3xl font-light">
            Immerse yourself in the authentic beauty, culture, and luxury of Kerala
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16 space-y-6">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white">
            Our Expertise
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
            For over a decade, Ahfa Travels has been crafting bespoke journeys through Kerala's most
            enchanting destinations. We combine local expertise with luxury service to create
            unforgettable experiences that showcase the true soul of God's Own Country.
          </p>
        </div>

        <div className="space-y-24">
          {experiences.map((experience, index) => {
            const Icon = experience.icon;
            const isVisible = visibleSections.has(index);
            const isEven = index % 2 === 0;

            return (
              <div
                key={index}
                ref={(el) => (sectionRefs.current[index] = el)}
                data-index={index}
                className={`flex flex-col ${
                  isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } gap-8 items-center transition-all duration-1000 ${
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-20'
                }`}
              >
                <div className="flex-1 relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-yellow-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  <div className="relative rounded-2xl overflow-hidden border border-amber-500/30">
                    <img
                      src={experience.image}
                      alt={experience.title}
                      className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>
                </div>

                <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl shadow-lg">
                      <Icon className="w-8 h-8 text-white" strokeWidth={2} />
                    </div>
                    <h3 className="text-3xl md:text-4xl font-serif font-bold text-white">
                      {experience.title}
                    </h3>
                  </div>

                  <p className="text-lg text-gray-300 leading-relaxed">
                    {experience.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    {experience.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-amber-300 text-sm"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500"></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => onNavigate('tours')}
                    className="mt-4 px-8 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-amber-500/50 hover:scale-105 transition-all duration-300"
                  >
                    Explore This Experience
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-24 text-center">
          <div className="inline-block p-12 bg-gradient-to-br from-slate-800/50 to-emerald-900/50 rounded-3xl border border-amber-500/30 backdrop-blur-sm">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
              Ready to Begin Your Journey?
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl">
              Let us craft a personalized Kerala experience that exceeds your dreams
            </p>
            <button
              onClick={() => onNavigate('contact')}
              className="px-10 py-4 bg-gradient-to-r from-amber-500 to-yellow-600 text-white text-lg font-semibold rounded-full shadow-2xl hover:shadow-amber-500/50 hover:scale-105 transition-all duration-300"
            >
              Contact Us Today
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
