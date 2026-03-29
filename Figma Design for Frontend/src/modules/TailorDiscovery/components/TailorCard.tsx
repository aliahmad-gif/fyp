import React from 'react';
import { MapPin } from 'lucide-react';

interface Tailor {
  id: string;
  name: string;
  location: string;
  specialty: string;
  image: string;
}

interface TailorCardProps {
  tailor: Tailor;
  onViewProfile: (tailorId: string) => void;
}

export default function TailorCard({ tailor, onViewProfile }: TailorCardProps) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-neutral-200 group">
      {/* Image */}
      <div className="aspect-[3/4] overflow-hidden bg-neutral-100">
        <img
          src={tailor.image}
          alt={tailor.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="mb-2">{tailor.name}</h3>
        
        <div className="flex items-center gap-1.5 text-neutral-600 mb-3">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{tailor.location}</span>
        </div>

        <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-sm">
            {tailor.specialty}
          </span>
        </div>

        <button
          onClick={() => onViewProfile(tailor.id)}
          className="w-full py-2.5 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
        >
          View Profile
        </button>
      </div>
    </div>
  );
}
