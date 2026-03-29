import React, { useState, useEffect } from 'react';
import TailorCard from './TailorCard';
import { getTailorsFromFirebase, tailorToDiscoveryShape } from '../../../database-firebase-postgresql/TAILOR_FIREBASE';

interface TailorDiscoveryProps {
  onViewProfile: (tailorId: string) => void;
}

/** Fallback static data when Firebase has no tailors or fails */
const FALLBACK_TAILORS = [
  { id: '1', name: 'Hamza Khan', location: 'Karachi, Pakistan', specialty: 'Wedding Gowns', image: 'https://images.unsplash.com/photo-1695266391814-a276948f1775?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwdGFpbG9yJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY3OTk0NDg4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
  { id: '2', name: 'Bilal Ahmed', location: 'Lahore, Pakistan', specialty: 'Bespoke Suits', image: 'https://images.unsplash.com/photo-1661332186404-cfddad48db04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB0YWlsb3IlMjBtYW58ZW58MXx8fHwxNzY3OTk0NDg4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
  { id: '3', name: 'Kamran Hassan', location: 'Islamabad, Pakistan', specialty: 'Evening Wear', image: 'https://images.unsplash.com/photo-1704636487840-ca122b5759c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwZGVzaWduZXIlMjBtYWxlfGVufDF8fHx8MTc2Nzk5NDQ4OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
  { id: '4', name: 'Ahmed Ali', location: 'Rawalpindi, Pakistan', specialty: 'Alterations', image: 'https://images.unsplash.com/photo-1633655442168-c6ef0ed2f984?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWlsb3IlMjBtZWFzdXJpbmclMjBzdWl0fGVufDF8fHx8MTc2Nzk5NDQ4OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
  { id: '5', name: 'Imran Malik', location: 'Faisalabad, Pakistan', specialty: 'Couture', image: 'https://images.unsplash.com/photo-1684259498917-b0cde0133e14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwc2VhbXN0cmVzcyUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3Njc5OTQ0ODl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
  { id: '6', name: 'Usman Siddiqui', location: 'Multan, Pakistan', specialty: 'Menswear', image: 'https://images.unsplash.com/photo-1765124894810-e8bdc5652592?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmFmdHNtYW4lMjB0YWlsb3IlMjBtYW58ZW58MXx8fHwxNzY3OTk0NDkwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
  { id: '7', name: 'Faisal Noor', location: 'Peshawar, Pakistan', specialty: 'Traditional Wear', image: 'https://images.unsplash.com/photo-1679836670163-6ebe5fc2bc15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZXNwb2tlJTIwdGFpbG9yJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY3OTk0NDkwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
  { id: '8', name: 'Hassan Raza', location: 'Gujranwala, Pakistan', specialty: 'Bespoke Suits', image: 'https://images.unsplash.com/photo-1695266391814-a276948f1775?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwdGFpbG9yJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY3OTk0NDg4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
];

const LOCATION_OPTIONS = ['All Locations', 'Karachi, Pakistan', 'Lahore, Pakistan', 'Islamabad, Pakistan', 'Rawalpindi, Pakistan', 'Faisalabad, Pakistan', 'Multan, Pakistan', 'Peshawar, Pakistan', 'Gujranwala, Pakistan'];

export default function TailorDiscovery({ onViewProfile }: TailorDiscoveryProps) {
  const [specialty, setSpecialty] = useState('');
  const [location, setLocation] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [tailors, setTailors] = useState<typeof FALLBACK_TAILORS>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getTailorsFromFirebase()
      .then((list) => {
        if (cancelled) return;
        const shaped = list.map(tailorToDiscoveryShape).filter((t) => t.name || t.id);
        setTailors(shaped.length > 0 ? shaped : FALLBACK_TAILORS);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : 'Failed to load tailors');
        setTailors(FALLBACK_TAILORS);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const filteredTailors = tailors.filter((t) => {
    const matchSpecialty = !specialty || t.specialty.toLowerCase().includes(specialty.toLowerCase());
    const matchLocation = !location || location === 'All Locations' || t.location.toLowerCase().includes(location.toLowerCase().split(',')[0].trim());
    const q = searchQuery.trim().toLowerCase();
    const matchSearch = !q || t.name.toLowerCase().includes(q) || t.location.toLowerCase().includes(q) || t.specialty.toLowerCase().includes(q);
    return matchSpecialty && matchLocation && matchSearch;
  });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="mb-2">Find Your Perfect Tailor</h1>
          <p className="text-neutral-600">
            Discover skilled tailors and designers in your area
          </p>
        </div>
      </div>

      {/* Search + Filters: Search, Location, Specialty */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-3 items-end">
            {/* Search */}
            <div className="min-w-[220px] flex-1 max-w-md">
              <label className="block text-sm font-medium text-neutral-700 mb-1">Search</label>
              <input
                type="text"
                placeholder="Search by name, location or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent bg-white placeholder:text-neutral-400"
              />
            </div>
            {/* Location */}
            <div className="min-w-[200px] max-w-xs">
              <label className="block text-sm font-medium text-neutral-700 mb-1">Location</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent appearance-none bg-white"
              >
                {LOCATION_OPTIONS.map((loc) => (
                  <option key={loc} value={loc === 'All Locations' ? '' : loc}>{loc}</option>
                ))}
              </select>
            </div>
            {/* Specialty */}
            <div className="min-w-[200px] max-w-xs">
              <label className="block text-sm font-medium text-neutral-700 mb-1">Specialty</label>
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
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <p className="text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 mb-4">
            {error} — showing default list.
          </p>
        )}
        {loading ? (
          <p className="text-neutral-600 mb-6">Loading tailors…</p>
        ) : (
          <p className="text-neutral-600 mb-6">
            {filteredTailors.length} tailors found
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {(loading ? [] : filteredTailors).map((tailor) => (
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
