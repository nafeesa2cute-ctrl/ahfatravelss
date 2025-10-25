import { useState } from 'react';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import ToursPage from './pages/ToursPage';
import ExperiencesPage from './pages/ExperiencesPage';
import ContactPage from './pages/ContactPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedPackageId, setSelectedPackageId] = useState<string | undefined>(undefined);

  const handleNavigate = (page: string, packageId?: string) => {
    setCurrentPage(page);
    if (packageId) {
      setSelectedPackageId(packageId);
    } else {
      setSelectedPackageId(undefined);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Navigation currentPage={currentPage} onNavigate={handleNavigate} />

      {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
      {currentPage === 'tours' && <ToursPage onNavigate={handleNavigate} />}
      {currentPage === 'experiences' && <ExperiencesPage onNavigate={handleNavigate} />}
      {currentPage === 'contact' && <ContactPage selectedPackageId={selectedPackageId} />}
    </div>
  );
}

export default App;
