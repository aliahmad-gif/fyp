import { useState } from 'react';
import { CheckCircle, MapPin, Star, Search, ArrowRight, Home } from 'lucide-react';

const mockTailors = [
  {
    id: 1,
    name: 'Ahmed Stitch House',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    rating: 4.8,
    reviews: 127,
    distance: '1.2 km',
    specialty: 'Traditional & Modern Wear'
  },
  {
    id: 2,
    name: 'Royal Tailors',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    rating: 4.6,
    reviews: 89,
    distance: '2.5 km',
    specialty: 'Wedding & Formal Suits'
  },
  {
    id: 3,
    name: 'Premium Stitching Center',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
    rating: 4.9,
    reviews: 203,
    distance: '3.1 km',
    specialty: 'Custom Tailoring'
  }
];

export default function MeasurementWizardStep4() {
  const [location, setLocation] = useState('');
  const [showTailors, setShowTailors] = useState(false);

  const handleSearch = () => {
    setShowTailors(true);
  };

  const handleFindNearMe = () => {
    setLocation('Detecting location...');
    setTimeout(() => {
      setLocation('Lahore, Pakistan');
      setShowTailors(true);
    }, 1000);
  };

  return (
    <div className="w-full max-w-3xl">
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="flex-1 h-1 bg-green-600 rounded-full" />
          <div className="flex-1 h-1 bg-green-600 rounded-full" />
          <div className="flex-1 h-1 bg-green-600 rounded-full" />
          <div className="flex-1 h-1 bg-green-600 rounded-full" />
        </div>
        <p className="text-sm text-gray-600">Step 4 of 4</p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        {/* Completion Confirmation */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-gray-900 mb-3 tracking-tight">Measurements Saved!</h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Your custom size profile is ready. Now let's find a skilled tailor near you to bring your perfect fit to life.
          </p>
        </div>

        {/* Tailor Matching Section */}
        <div className="mb-8">
          <h2 className="text-gray-900 mb-6">Find a Tailor</h2>

          {/* Find Near Me Button */}
          <button
            onClick={handleFindNearMe}
            className="w-full py-4 px-6 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all flex items-center justify-center gap-2 hover:shadow-lg mb-8"
            style={{ fontSize: '16px' }}
          >
            <MapPin className="w-5 h-5" />
            <span>Find Tailors</span>
          </button>
        </div>

        {/* Navigation */}
        <div className="text-center">
          <a
            href="#"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </a>
        </div>
      </div>

      {/* Success Message */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-2 text-sm text-gray-500">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span>Your measurements have been securely saved to your profile</span>
        </div>
      </div>
    </div>
  );
}