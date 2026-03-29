import React from 'react';
import UserNomiProfile from './user_nomi_profile';

interface ProfileWrapperProps {
  onNavigateToOrders: () => void;
  onNavigateToMeasurements: () => void;
  onNavigateToAddress: () => void;
  onNavigateToPaymentMethods: () => void;
  onNavigateToReturns: () => void;
  onNavigateToReviews: () => void;
  onNavigateToCancellations: () => void;
  onNavigateToTailorProgress: () => void;
  onNavigateToTailorReviews: () => void;
  onLogout: () => void;
}

/**
 * When profile icon is clicked, this wrapper renders UserNomiProfile
 * (account info + sidebar dashboard with Order List, Tracking, Tailor Progress, etc.)
 */
export default function ProfileWrapper(props: ProfileWrapperProps) {
  return <UserNomiProfile {...props} />;
}
