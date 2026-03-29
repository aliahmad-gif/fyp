import React, { useState } from 'react';
import { Search, MapPin, Star, SlidersHorizontal } from 'lucide-react';
import TailorCard from './TailorCard';

interface TailorDiscoveryProps {
  onViewProfile: (tailorId: string) => void;
}

const tailorsData = [
  { id: '1', name: 'Hamza Khan', location: 'Karachi, Pakistan', specialty: 'Wedding Gowns', image: 'https://images.unsplash.com/photo-1695266391814-a276948f1775?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwdGFpbG9yJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY3OTk0NDg4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
  { id: '2', name: 'Bilal Ahmed', location: 'Lahore, Pakistan', specialty: 'Bespoke Suits', image: 'https://images.unsplash.com/photo-1661332186404-cfddad48db04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB0YWlsb3IlMjBtYW58ZW58MXx8fHwxNzY3OTk0NDg4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
  { id: '3', name: 'Kamran Hassan', location: 'Islamabad, Pakistan', specialty: 'Evening Wear', image: 'https://images.unsplash.com/photo-1704636487840-ca122b5759c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwZGVzaWduZXIlMjBtYWxlfGVufDF8fHx8MTc2Nzk5NDQ4OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
  { id: '4', name: 'Ahmed Ali', location: 'Rawalpindi, Pakistan', specialty: 'Alterations', image: 'https://images.unsplash.com/photo-1633655442168-c6ef0ed2f984?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWlsb3IlMjBtZWFzdXJpbmclMjBzdWl0fGVufDF8fHx8MTc2Nzk5NDQ4OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
  { id: '5', name: 'Imran Malik', location: 'Faisalabad, Pakistan', specialty: 'Couture', image: 'https://images.unsplash.com/photo-1684259498917-b0cde0133e14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwc2VhbXN0cmVzcyUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3Njc5OTQ0ODl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
  { id: '6', name: 'Usman Siddiqui', location: 'Multan, Pakistan', specialty: 'Menswear', image: 'https://images.unsplash.com/photo-1765124894810-e8bdc5652592?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmFmdHNtYW4lMjB0YWlsb3IlMjBtYW58ZW58MXx8fHwxNzY3OTk0NDkwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
  { id: '7', name: 'Faisal Noor', location: 'Peshawar, Pakistan', specialty: 'Traditional Wear', image: 'https://images.unsplash.com/photo-1679836670163-6ebe5fc2bc15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZXNwb2tlJTIwdGFpbG9yJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY3OTk0NDkwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
  { id: '8', name: 'Hassan Raza', location: 'Gujranwala, Pakistan', specialty: 'Bespoke Suits', image: 'https://images.unsplash.com/photo-1695266391814-a276948f1775?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwdGFpbG9yJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY3OTk0NDg4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
];

export default function TailorDiscovery({ onViewProfile }: TailorDiscoveryProps) {
  const [location, setLocation] = useState('');
  const [specialty, setSpecialty] = useState('');

  // Filter tailors based on location and specialty
  const filteredTailors = tailorsData.filter((tailor) => {
    const matchesLocation = location === '' || 
      tailor.location.toLowerCase().includes(location.toLowerCase());
    const matchesSpecialty = specialty === '' || 
      tailor.specialty.toLowerCase().includes(specialty.toLowerCase());
    return matchesLocation && matchesSpecialty;
  });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Find a tailor</h1>
          <p className="text-neutral-600 text-lg">
            Discover skilled tailors and designers in your area
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Enter city or area"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Specialty</label>
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent appearance-none bg-white"
              >
                <option value="">All Specialties</option>
                <option value="Wedding Gowns">Wedding Gowns</option>
                <option value="Bespoke Suits">Bespoke Suits</option>
                <option value="Evening Wear">Evening Wear</option>
                <option value="Alterations">Alterations</option>
                <option value="Couture">Couture</option>
                <option value="Menswear">Menswear</option>
                <option value="Traditional Wear">Traditional Wear</option>
              </select>
            </div>
            <button className="px-6 py-2.5 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <p className="text-neutral-700 font-medium">
            {filteredTailors.length} tailors found
          </p>
          <button className="flex items-center gap-2 px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors text-sm font-medium">
            <SlidersHorizontal className="w-4 h-4" />
            More Filters
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTailors.map((tailor) => (
            <TailorCard
              key={tailor.id}
              tailor={tailor}
              onViewProfile={onViewProfile}
            />
          ))}
        </div>
      </div>
    </div>
  );
}