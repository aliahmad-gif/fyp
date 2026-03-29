import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from './CartContext';
import { useAuth } from '../contexts/AuthContext';
import { ModelViewer } from '../landing3d/ModelViewer';
import { saveCheckoutToFirebaseAndBackend } from '../database-firebase-postgresql';
import { Trash2, Minus, Plus, ArrowLeft } from 'lucide-react';

interface CartPageProps {
  onNavigateToLanding: () => void;
  onNavigateToShipping: () => void;
  onNavigateToProfile: () => void;
}

export default function CartPage({ onNavigateToLanding, onNavigateToShipping, onNavigateToProfile }: CartPageProps) {
  const { cartItems, removeFromCart, updateQuantity, getSubtotal } = useCart();
  const { user } = useAuth();

  const subtotal = getSubtotal();
  const deliveryFee = cartItems.length > 0 ? 1500 : 0;
  const total = subtotal + deliveryFee;

  const handleGoToCheckout = async () => {
    if (cartItems.length > 0) {
      try {
        await saveCheckoutToFirebaseAndBackend(
          {
            cartItems: cartItems.map(({ id, name, price, size, image, quantity, category, color }) => ({
              id,
              name,
              price,
              size,
              image,
              quantity,
              category,
              color,
            })),
            subtotal,
            deliveryFee,
            total,
          },
          user?.id,
          user?.email
        );
      } catch (e) {
        console.warn('Checkout save failed:', e);
      }
    }
    onNavigateToShipping();
  };

  return (
    <div className="bg-white min-h-screen w-full">
      <p />

      {/* Breadcrumb */}
      <div className="px-[64px] pt-[40px] pb-[24px]">
        <motion.button
          onClick={onNavigateToLanding}
          className="flex items-center gap-2 text-[rgba(0,0,0,0.6)] hover:text-black transition-colors"
          whileHover={{ x: -5 }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-['Satoshi:Regular',sans-serif] text-[16px]">Back to Shopping</span>
        </motion.button>
      </div>

      {/* Main Content */}
      <div className="px-[64px] pb-[64px]">
        <h1 className="font-['Poppins:Bold',sans-serif] text-[48px] text-black mb-[48px]">Your cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-[120px]">
            <p className="font-['Inter:Regular',sans-serif] text-[24px] text-[rgba(0,0,0,0.6)] mb-[24px]">
              Your cart is empty
            </p>
            <motion.button
              onClick={onNavigateToLanding}
              className="bg-[#171717] text-white px-[32px] py-[16px] rounded-[8px] font-['Inter:Medium',sans-serif]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Continue Shopping
            </motion.button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-[48px]">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-[24px]">
              <AnimatePresence>
                {cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="border border-[rgba(0,0,0,0.1)] rounded-[20px] p-[24px]"
                  >
                    <div className="flex gap-[16px]">
                      {/* Product Image - 3D when .gltf/.glb, else image */}
                      <div className="w-[124px] h-[124px] bg-[#f0eeed] rounded-[8.658px] overflow-hidden flex-shrink-0 min-w-[124px]">
                        {typeof item.image === 'string' && (item.image.endsWith('.gltf') || item.image.endsWith('.glb')) ? (
                          <div className="w-full h-full min-h-0 overflow-hidden">
                            <ModelViewer modelPath={item.image} className="min-h-0" />
                          </div>
                        ) : (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-['Inter:Bold',sans-serif] text-[20px] text-black mb-[4px]">
                            {item.name}
                          </h3>
                          <div className="font-['Inter:Regular',sans-serif] text-[14px] text-black space-y-[4px]">
                            <p>
                              <span>Size: </span>
                              <span className="text-[rgba(0,0,0,0.6)]">{item.size}</span>
                            </p>
                            {item.color && (
                              <p>
                                <span>Color: </span>
                                <span className="text-[rgba(0,0,0,0.6)]">{item.color}</span>
                              </p>
                            )}
                          </div>
                        </div>
                        <p className="font-['Inter:Bold',sans-serif] text-[24px] text-black">
                          Rs {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col items-end justify-between">
                        <motion.button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#FF3333]"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash2 className="w-[24px] h-[24px]" />
                        </motion.button>

                        {/* Quantity Controls */}
                        <div className="bg-[#f0f0f0] rounded-[62px] flex gap-[20px] items-center px-[20px] py-[12px]">
                          <motion.button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Minus className="w-[20px] h-[20px]" />
                          </motion.button>
                          <span className="font-['Satoshi:Medium',sans-serif] text-[14px] text-black min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <motion.button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Plus className="w-[20px] h-[20px]" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-[rgba(0,0,0,0.1)] rounded-[20px] p-[24px] sticky top-[24px]"
              >
                <h2 className="font-['Poppins:Bold',sans-serif] text-[24px] text-black mb-[24px]">
                  Order Summary
                </h2>

                <div className="space-y-[20px] mb-[24px]">
                  <div className="flex justify-between items-center">
                    <span className="font-['Inter:Regular',sans-serif] text-[20px] text-[rgba(0,0,0,0.6)]">
                      Subtotal
                    </span>
                    <span className="font-['Inter:Bold',sans-serif] text-[20px] text-black">
                      Rs {subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-['Inter:Regular',sans-serif] text-[20px] text-[rgba(0,0,0,0.6)]">
                      Delivery Fee
                    </span>
                    <span className="font-['Inter:Bold',sans-serif] text-[20px] text-black">
                      Rs {deliveryFee.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-[1px] bg-[rgba(0,0,0,0.1)]" />
                  <div className="flex justify-between items-center">
                    <span className="font-['Satoshi:Regular',sans-serif] text-[20px] text-black">
                      Total
                    </span>
                    <span className="font-['Roboto_Slab:Bold',sans-serif] text-[24px] text-black">
                      Rs {total.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <motion.button
                  onClick={handleGoToCheckout}
                  className="w-full bg-[#171717] text-white rounded-[62px] h-[60px] flex items-center justify-center gap-[12px] font-['Satoshi:Medium',sans-serif] text-[16px]"
                  whileHover={{ scale: 1.02, backgroundColor: "#2d2d2d" }}
                  whileTap={{ scale: 0.98 }}
                >
                  Go to Checkout
                  <ArrowLeft className="w-[24px] h-[24px] rotate-180" />
                </motion.button>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}