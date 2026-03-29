import './tailor-styles.css';
import React, { useState } from 'react';
import TailorDiscovery from './components/TailorDiscovery';
import TailorProfile from './components/TailorProfile';

export default function App() {
  const [currentView, setCurrentView] = useState<'discovery' | 'profile'>('discovery');
  const [selectedTailorId, setSelectedTailorId] = useState<string | null>(null);

  const handleViewProfile = (tailorId: string) => {
    setSelectedTailorId(tailorId);
    setCurrentView('profile');
  };

  const handleBackToDiscovery = () => {
    setCurrentView('discovery');
    setSelectedTailorId(null);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {currentView === 'discovery' ? (
        <TailorDiscovery onViewProfile={handleViewProfile} />
      ) : (
        <TailorProfile tailorId={selectedTailorId!} onBack={handleBackToDiscovery} />
      )}
    </div>
  );
}
