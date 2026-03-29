import OrderManagement from '../imports/OrderManagement-13-3852';

interface OrderListWrapperProps {
  onNavigateToTailorProgress: () => void;
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

export default function OrderListWrapper({
  onNavigateToTailorProgress,
  onNavigateToProfile,
  onNavigateToMeasurements,
  onNavigateToAddress,
  onNavigateToPaymentMethods,
  onNavigateToReturns,
  onNavigateToReviews,
  onNavigateToCancellations,
  onNavigateToTailorReviews,
  onLogout,
}: OrderListWrapperProps) {
  return (
    <div onClick={(e) => {
      const target = e.target as HTMLElement;
      
      // Check if clicking on an order row that has "yes" in the Tailoring column
      const orderRow = target.closest('[data-name*="List"]');
      if (orderRow) {
        const rowText = orderRow.textContent || '';
        
        // If clicking on a row with tailoring (yes) - navigate to tailor progress
        if (rowText.includes('yes') && (rowText.includes('CHAIRMAN') || rowText.includes('Winter Khaddar') || rowText.includes('Shaheen') || rowText.includes('Kishmish'))) {
          e.preventDefault();
          onNavigateToTailorProgress();
          return;
        }
        
        // Handle sidebar navigation
        const text = rowText.trim().toLowerCase();
        
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
        } else if (text?.includes('product reviews') || text?.includes('order reviews')) {
          e.preventDefault();
          onNavigateToReviews();
        } else if (text?.includes('my returns')) {
          e.preventDefault();
          onNavigateToReturns();
        } else if (text?.includes('my cancellations')) {
          e.preventDefault();
          onNavigateToCancellations();
        } else if (text?.includes('tailor progress')) {
          e.preventDefault();
          onNavigateToTailorProgress();
        } else if (text?.includes('tailor reviews')) {
          e.preventDefault();
          onNavigateToTailorReviews();
        } else if (text?.includes('logout')) {
          e.preventDefault();
          onLogout();
        }
      }
    }}>
      <OrderManagement />
    </div>
  );
}