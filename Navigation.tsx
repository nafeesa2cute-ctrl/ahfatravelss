import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import Logo from './Logo';

type NavigationProps = {
  currentPage: string;
  onNavigate: (page: string) => void;
};

export default function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'tours', label: 'Tour Packages' },
    { id: 'experiences', label: 'Experiences' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavigate = (page: string) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 via-black/50 to-transparent backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <button
            onClick={() => handleNavigate('home')}
            className="transition-transform hover:scale-105 duration-300"
          >
            <Logo />
          </button>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`relative text-sm font-medium tracking-wide transition-all duration-300 group ${
                  currentPage === item.id
                    ? 'text-amber-400'
                    : 'text-white hover:text-amber-300'
                }`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-amber-400 to-yellow-500 transition-all duration-300 ${
                    currentPage === item.id ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                ></span>
              </button>
            ))}
            <button
              onClick={() => handleNavigate('contact')}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-600 text-white font-medium rounded-lg shadow-lg hover:shadow-amber-500/50 hover:scale-105 transition-all duration-300"
            >
              Book Now
            </button>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white hover:text-amber-400 transition-colors"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-lg border-t border-amber-500/20">
          <div className="px-4 py-6 space-y-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`block w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                  currentPage === item.id
                    ? 'bg-gradient-to-r from-amber-500/20 to-yellow-600/20 text-amber-400 border border-amber-500/30'
                    : 'text-white hover:bg-amber-500/10 hover:text-amber-300'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => handleNavigate('contact')}
              className="w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-white font-medium rounded-lg shadow-lg hover:shadow-amber-500/50 transition-all duration-300"
            >
              Book Now
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
