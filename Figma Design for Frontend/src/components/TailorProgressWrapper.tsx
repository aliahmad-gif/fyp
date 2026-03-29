import TailorProgress from '../imports/TailorProgress';

interface TailorProgressWrapperProps {
  onNavigateToOrderList: () => void;
  onNavigateToProfile: () => void;
  onNavigateToMeasurements: () => void;
  onNavigateToAddress: () => void;
  onNavigateToPaymentMethods: () => void;
  onNavigateToReturns: () => void;
  onNavigateToReviews: () => void;
  onNavigateToCancellations: () => void;
  onNavigateToTailorReviews: () => void;
  onLogout: () => void;
}

export default function TailorProgressWrapper({
  onNavigateToOrderList,
  onNavigateToProfile,
  onNavigateToMeasurements,
  onNavigateToAddress,
  onNavigateToPaymentMethods,
  onNavigateToReturns,
  onNavigateToReviews,
  onNavigateToCancellations,
  onNavigateToTailorReviews,
  onLogout,
}: TailorProgressWrapperProps) {
  return (
    <div onClick={(e) => {
      const target = e.target as HTMLElement;
      
      // Handle sidebar navigation clicks
      const navItem = target.closest('[data-name*="List"]');
      
      if (navItem) {
        const text = navItem.textContent?.trim().toLowerCase();
        
        if (text?.includes('profile') && !text.includes('order')) {
          e.preventDefault();
          onNavigateToProfile();
        } else if (text?.includes('your measurements')) {
          e.preventDefault();
          onNavigateToMeasurements();
        } else if (text?.includes('my address')) {
          e.preventDefault();
          onNavigateToAddress();
        } else if (text?.includes('payment methods')) {
          e.preventDefault();
          onNavigateToPaymentMethods();
        } else if (text?.includes('order list')) {
          e.preventDefault();
          onNavigateToOrderList();
        } else if (text?.includes('product reviews') || text?.includes('order reviews')) {
          e.preventDefault();
          onNavigateToReviews();
        } else if (text?.includes('my returns')) {
          e.preventDefault();
          onNavigateToReturns();
        } else if (text?.includes('my cancellations')) {
          e.preventDefault();
          onNavigateToCancellations();
        } else if (text?.includes('tailor reviews')) {
          e.preventDefault();
          onNavigateToTailorReviews();
        } else if (text?.includes('logout')) {
          e.preventDefault();
          onLogout();
        }
      }
    }}>
      <TailorProgress />
    </div>
  );
}
