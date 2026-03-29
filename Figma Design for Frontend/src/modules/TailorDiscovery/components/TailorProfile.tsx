import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, MessageCircle, Award } from 'lucide-react';

interface TailorProfileProps {
  tailorId: string;
  onBack: () => void;
}

// Mock data for the profile (reviews removed)
const profileData = {
  id: '1',
  name: 'Maria Rodriguez',
  location: 'New York, NY',
  coverImage: 'https://images.unsplash.com/photo-1632991727906-8386e1388975?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwZGVzaWduZXIlMjBzdHVkaW98ZW58MXx8fHwxNzY3ODI3MTIwfDA&ixlib=rb-4.1.0&q=80&w=1080',
  profileImage: 'https://images.unsplash.com/photo-1760278245703-0be8320c5eb1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB0YWlsb3IlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjY5NDY5MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
  about: 'With over 15 years of experience in haute couture and bridal fashion, I specialize in creating custom wedding gowns and evening wear that celebrate each client\'s unique style. Every piece is crafted with meticulous attention to detail and the finest materials.',
  specialties: ['Wedding Gowns', 'Evening Wear', 'Couture', 'Bridal Alterations', 'Custom Design', 'Fabric Consultation'],
  availability: 'Available for bookings',
};

export default function TailorProfile({ tailorId, onBack }: TailorProfileProps) {
  const navigate = useNavigate();

  const handleMessageClick = () => {
    navigate('/chat-with-tailor', { state: { selectedContact: profileData.name, chatType: 'tailor' } });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="sticky top-0 z-20 bg-white border-b border-neutral-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-neutral-700 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Discovery
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
        <div className="relative">
          {/* Profile Info */}
          <div className="px-4 sm:px-6 lg:px-8 pt-8">
            <div className="relative mb-6">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                {/* Profile Photo */}
                <div className="relative">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white overflow-hidden bg-neutral-100 shadow-xl">
                    <img
                      src={profileData.profileImage}
                      alt={profileData.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pb-2">
                  <button
                    onClick={handleMessageClick}
                    className="flex-1 sm:flex-none px-6 py-3 border-2 border-neutral-900 text-neutral-900 rounded-lg hover:bg-neutral-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Message
                  </button>
                </div>
              </div>
            </div>

            {/* Name and Location */}
            <div className="mb-6 pb-6 border-b border-neutral-200">
              <h1 className="mb-2">{profileData.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-neutral-600 mb-3">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-5 h-5" />
                  <span>{profileData.location}</span>
                </div>
              </div>

              {/* Availability Indicator */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-emerald-700">{profileData.availability}</span>
              </div>
            </div>

            {/* About Section */}
            <div className="mb-8">
              <h2 className="mb-3">About</h2>
              <p className="text-neutral-700 leading-relaxed">
                {profileData.about}
              </p>
            </div>

            {/* Specialties */}
            <div className="mb-8">
              <h2 className="mb-4">Specialties</h2>
              <div className="flex flex-wrap gap-2">
                {profileData.specialties.map((specialty, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-full"
                  >
                    <Award className="w-4 h-4" />
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}