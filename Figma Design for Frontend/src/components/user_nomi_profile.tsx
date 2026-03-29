import AdminRole from '../imports/AdminRole-12-2632';
import ProfileAccountInfo from './ProfileAccountInfo';

export interface UserNomiProfileProps {
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
 * User profile page shown when profile icon is clicked.
 * Contains account info + sidebar dashboard (Order List, Tracking, Tailor Progress, etc.)
 */
export default function UserNomiProfile({
  onNavigateToOrders,
  onNavigateToMeasurements,
  onNavigateToAddress,
  onNavigateToPaymentMethods,
  onNavigateToReturns,
  onNavigateToReviews,
  onNavigateToCancellations,
  onNavigateToTailorProgress,
  onNavigateToTailorReviews,
  onLogout,
}: UserNomiProfileProps) {
  return (
    <div
      className="min-h-[80vh] w-full"
      onClick={(e) => {
        const target = e.target as HTMLElement;
        const navItem = target.closest('[data-name*="List"]');

        if (navItem) {
          const text = navItem.textContent?.trim().toLowerCase();

          if (text?.includes('your measurements')) {
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
            onNavigateToOrders();
          } else if (text?.includes('order tracking')) {
            e.preventDefault();
            onNavigateToOrders();
          } else if (text?.includes('order status')) {
            e.preventDefault();
            onNavigateToOrders();
          } else if (text?.includes('shipment tracking')) {
            e.preventDefault();
            onNavigateToOrders();
          } else if (text?.includes('delivery status')) {
            e.preventDefault();
            onNavigateToOrders();
          } else if (text?.includes('active orders')) {
            e.preventDefault();
            onNavigateToOrders();
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
      }}
    >
      <div className="max-w-2xl mx-auto px-4 py-6">
        <ProfileAccountInfo />
      </div>
      <AdminRole />
    </div>
  );
}
