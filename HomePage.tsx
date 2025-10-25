import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

type HomePageProps = {
  onNavigate: (page: string) => void;
};

const keralaVideos = [
  {
    name: 'Alleppey Backwaters',
    url: 'https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4',
  },
  {
    name: 'Munnar Tea Plantations',
    url: 'https://videos.pexels.com/video-files/6894907/6894907-uhd_2560_1440_30fps.mp4',
  },
  {
    name: 'Kerala Beaches',
    url: 'https://videos.pexels.com/video-files/3571379/3571379-uhd_2560_1440_30fps.mp4',
  },
  {
    name: 'Waterfalls',
    url: 'https://videos.pexels.com/video-files/3044127/3044127-uhd_2560_1440_30fps.mp4',
  },
  {
    name: 'Kerala Heritage',
    url: 'https://videos.pexels.com/video-files/3571273/3571273-uhd_2560_1440_30fps.mp4',
  },
];

export default function HomePage({ onNavigate }: HomePageProps) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const videoElement = document.getElementById('hero-video') as HTMLVideoElement;

    if (videoElement) {
      const handleVideoEnd = () => {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % keralaVideos.length);
          setIsTransitioning(false);
        }, 800);
      };

      videoElement.addEventListener('ended', handleVideoEnd);
      return () => videoElement.removeEventListener('ended', handleVideoEnd);
    }
  }, [currentVideoIndex]);

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      <div
        className={`absolute inset-0 transition-opacity duration-800 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <video
          id="hero-video"
          key={currentVideoIndex}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={keralaVideos[currentVideoIndex].url} type="video/mp4" />
        </video>
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70"></div>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
        <div className="space-y-6 max-w-4xl animate-fade-in">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white drop-shadow-2xl tracking-tight leading-tight">
            Discover the Soul of{' '}
            <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">
              Kerala
            </span>
          </h1>

          <p className="text-lg md:text-2xl text-amber-100/90 font-light tracking-wide drop-shadow-lg max-w-2xl mx-auto">
            Experience luxury travel through backwaters, tea plantations, pristine beaches, and ancient heritage
          </p>

          <button
            onClick={() => onNavigate('tours')}
            className="group relative mt-8 px-10 py-4 bg-gradient-to-r from-amber-500 to-yellow-600 text-white text-lg font-semibold rounded-full shadow-2xl hover:shadow-amber-500/50 transition-all duration-500 hover:scale-110 overflow-hidden"
          >
            <span className="relative z-10">Explore Tours</span>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </button>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-amber-400 drop-shadow-lg" />
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {keralaVideos.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsTransitioning(true);
              setTimeout(() => {
                setCurrentVideoIndex(index);
                setIsTransitioning(false);
              }, 400);
            }}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentVideoIndex
                ? 'w-12 bg-gradient-to-r from-amber-400 to-yellow-500'
                : 'w-6 bg-white/50 hover:bg-white/80'
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
}
