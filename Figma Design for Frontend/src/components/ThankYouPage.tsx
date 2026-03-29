import React from 'react';
import { motion } from 'motion/react';
import { useCart } from './CartContext';
import { CheckCircle } from 'lucide-react';

interface ThankYouPageProps {
  onNavigateToLanding: () => void;
  onNavigateToOrders: () => void;
  onNavigateToProfile: () => void;
}

export default function ThankYouPage({ onNavigateToLanding, onNavigateToOrders, onNavigateToProfile }: ThankYouPageProps) {
  const { clearCart } = useCart();

  const handleBackToShopping = () => {
    clearCart();
    onNavigateToLanding();
  };

  return (
    <div className="bg-white min-h-screen w-full">
      {/* Main Content - single header from Layout */}
      <div className="max-w-[1440px] mx-auto px-[64px] py-[40px]">
        {/* Breadcrumb Steps */}
        <div className="flex items-center gap-[10px] mb-[48px]">
          <span className="font-['Roboto:Medium',sans-serif] text-[16px] text-[rgba(3,22,42,0.3)]">Cart</span>
          <span className="text-black">›</span>
          <span className="font-['Roboto:Medium',sans-serif] text-[16px] text-[rgba(3,22,42,0.3)]">Details</span>
          <span className="text-black">›</span>
          <span className="font-['Roboto:Medium',sans-serif] text-[16px] text-[rgba(3,22,42,0.3)]">Shipping</span>
          <span className="text-black">›</span>
          <span className="font-['Roboto:Medium',sans-serif] text-[16px] text-[#272727]">Payment</span>
        </div>

        <div>
          {/* Confirmation Section */}
          <div className="flex flex-col items-center justify-center text-center py-[120px] max-w-[640px] mx-auto">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.6 }}
            >
              <CheckCircle className="w-[100px] h-[100px] text-black mb-[32px]" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-['Poppins:Medium',sans-serif] text-[26px] text-[#272727] mb-[24px]"
            >
              Payment Confirmed
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="font-['Roboto:Light',sans-serif] text-[16px] text-[#818181] max-w-[540px] mb-[48px] leading-relaxed"
            >
              Thank you for buying from Smartfitao. Now that your order is confirmed it will be ready to ship in 2 days. 
              Please check your inbox in the future for your order updates.
            </motion.p>

            <motion.button
              onClick={handleBackToShopping}
              className="bg-[#171717] text-white px-[44px] py-[8px] rounded-[4px] font-['Roboto:Medium',sans-serif] text-[20.645px] mb-[16px]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              whileHover={{ scale: 1.05, backgroundColor: '#2d2d2d' }}
              whileTap={{ scale: 0.95 }}
            >
              Back to shopping
            </motion.button>

            <motion.button
              onClick={onNavigateToOrders}
              className="bg-white border-2 border-[#171717] text-[#171717] px-[44px] py-[8px] rounded-[4px] font-['Roboto:Medium',sans-serif] text-[20.645px]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.05, backgroundColor: '#f3f4f6' }}
              whileTap={{ scale: 0.95 }}
            >
              View My Orders
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}