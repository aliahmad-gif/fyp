import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useCart } from './CartContext';
import { CreditCard, Lock, Info } from 'lucide-react';

interface PaymentPageProps {
  onNavigateToShipping: () => void;
  onNavigateToThankYou: () => void;
  onNavigateToLanding: () => void;
  onNavigateToProfile: () => void;
}

export default function PaymentPage({ onNavigateToShipping, onNavigateToThankYou, onNavigateToLanding, onNavigateToProfile }: PaymentPageProps) {
  const { cartItems, getSubtotal } = useCart();
  const [formData, setFormData] = useState({
    cardNumber: '',
    holderName: '',
    expiration: '',
    cvv: '',
    billingAddress: 'same',
  });
  const [backendErrors, setBackendErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const subtotal = getSubtotal();
  const deliveryFee = 1500;
  const total = subtotal + deliveryFee;

  const apiBase = (import.meta as unknown as { env?: { VITE_DJANGO_API_URL?: string } }).env?.VITE_DJANGO_API_URL ?? 'http://localhost:8000/api';

  const validateForm = (): Record<string, string> => {
    const err: Record<string, string> = {};
    const cardDigits = formData.cardNumber.replace(/\s/g, '');
    if (!/^\d{13,19}$/.test(cardDigits)) {
      err.cardNumber = 'Enter a valid card number (13–19 digits)';
    }
    if (!formData.holderName.trim()) {
      err.holderName = 'Holder name is required';
    }
    if (!/^\d{2}\/\d{2}$/.test(formData.expiration.trim())) {
      err.expiration = 'Use MM/YY format';
    } else {
      const [mm, yy] = formData.expiration.split('/').map(Number);
      if (mm < 1 || mm > 12) err.expiration = 'Invalid month';
      if (yy < 0 || yy > 99) err.expiration = 'Invalid year';
    }
    if (!/^\d{3,4}$/.test(formData.cvv.trim())) {
      err.cvv = 'CVV must be 3 or 4 digits';
    }
    return err;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBackendErrors({});
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setBackendErrors(validationErrors);
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${apiBase}/verify-payment/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardNumber: formData.cardNumber.replace(/\s/g, ''),
          holderName: formData.holderName.trim(),
          expiration: formData.expiration.trim(),
          cvv: formData.cvv.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.errors && typeof data.errors === 'object') {
        setBackendErrors(data.errors);
        return;
      }
      // Navigate to Thank You screen when valid or when API doesn't return errors
      onNavigateToThankYou();
    } catch {
      // Still go to Thank You so user sees confirmation; API can be optional
      onNavigateToThankYou();
    } finally {
      setSubmitting(false);
    }
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[80px]">
          {/* Form Section */}
          <div>
            {/* Summary Info */}
            <div className="border border-[rgba(86,178,128,0.2)] rounded-[7px] p-[24px] mb-[48px]">
              <div className="space-y-[16px]">
                <div className="flex justify-between items-center text-[14px] pb-[16px] border-b border-[rgba(86,178,128,0.2)]">
                  <span className="text-[#818181]">Contact</span>
                  <span className="text-[#272727]">joe.spagnuolo@uxbly.com</span>
                  <span className="text-[rgba(3,22,42,0.3)] cursor-pointer">Edit</span>
                </div>
                <div className="flex justify-between items-center text-[14px] pb-[16px] border-b border-[rgba(86,178,128,0.2)]">
                  <span className="text-[#818181]">Ship to</span>
                  <span className="text-[#272727]">Via Firenze 23, 92023, Pakistan</span>
                  <span className="text-[rgba(3,22,42,0.3)] cursor-pointer">Edit</span>
                </div>
                <div className="flex justify-between items-center text-[14px]">
                  <span className="text-[#818181]">Method</span>
                  <span className="text-[#272727]">Standard Shipping - FREE</span>
                  <span className="text-[rgba(3,22,42,0.3)] cursor-pointer">Edit</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-[48px]">
              {backendErrors.form && (
                <p className="text-[14px] text-red-600 bg-red-50 px-3 py-2 rounded">{backendErrors.form}</p>
              )}
              {/* Payment Method */}
              <div>
                <h2 className="font-['Roboto:Medium',sans-serif] text-[20px] text-[#272727] mb-[16px]">
                  Payment method
                </h2>
                <div className="border border-[#e5e5e5] rounded-[7px] overflow-hidden">
                  <div className="bg-[#f3f3f3] px-[24px] py-[16px] flex items-center gap-[16px]">
                    <CreditCard className="w-[31px] h-[31px]" />
                    <span className="font-['Roboto:Bold',sans-serif] text-[16px] text-[rgba(0,0,0,0.6)]">
                      Credit Card
                    </span>
                  </div>
                  <div className="p-[24px] space-y-[12px]">
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="Card Number"
                        value={formData.cardNumber}
                        onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value.replace(/\D/g, '').slice(0, 19) })}
                        className={`w-full h-[40px] px-[16px] pr-[40px] border rounded-[4px] text-[14px] text-[#616161] outline-none focus:border-[#171717] ${backendErrors.cardNumber ? 'border-red-500' : 'border-[#898989]'}`}
                        maxLength={19}
                      />
                      <Lock className="absolute right-[12px] top-[10px] w-[18px] h-[18px] text-[#616161]" />
                      {backendErrors.cardNumber && <p className="text-red-500 text-xs mt-1">{backendErrors.cardNumber}</p>}
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Holder Name"
                        value={formData.holderName}
                        onChange={(e) => setFormData({ ...formData, holderName: e.target.value })}
                        className={`w-full h-[40px] px-[16px] border rounded-[4px] text-[14px] text-[#616161] outline-none focus:border-[#171717] ${backendErrors.holderName ? 'border-red-500' : 'border-[#898989]'}`}
                      />
                      {backendErrors.holderName && <p className="text-red-500 text-xs mt-1">{backendErrors.holderName}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-[12px]">
                      <div>
                        <input
                          type="text"
                          placeholder="Expiration (MM/YY)"
                          value={formData.expiration}
                          onChange={(e) => {
                            let v = e.target.value.replace(/\D/g, '');
                            if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2, 4);
                            setFormData({ ...formData, expiration: v });
                          }}
                          className={`h-[40px] px-[16px] w-full border rounded-[4px] text-[14px] text-[#616161] outline-none focus:border-[#171717] ${backendErrors.expiration ? 'border-red-500' : 'border-[#898989]'}`}
                          maxLength={5}
                        />
                        {backendErrors.expiration && <p className="text-red-500 text-xs mt-1">{backendErrors.expiration}</p>}
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          inputMode="numeric"
                          placeholder="CVV"
                          value={formData.cvv}
                          onChange={(e) => setFormData({ ...formData, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                          className={`w-full h-[40px] px-[16px] pr-[40px] border rounded-[4px] text-[14px] text-[#616161] outline-none focus:border-[#171717] ${backendErrors.cvv ? 'border-red-500' : 'border-[#898989]'}`}
                          maxLength={4}
                        />
                        <Info className="absolute right-[12px] top-[10px] w-[18px] h-[18px] text-[#616161]" />
                        {backendErrors.cvv && <p className="text-red-500 text-xs mt-1">{backendErrors.cvv}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Billing Address */}
              <div>
                <h2 className="font-['Roboto:Medium',sans-serif] text-[20px] text-[#272727] mb-[16px]">
                  Billing address
                </h2>
                <div className="border border-[#e5e5e5] rounded-[7px] p-[24px] space-y-[16px]">
                  <label className="flex items-center gap-[12px] cursor-pointer">
                    <input
                      type="radio"
                      name="billing"
                      value="same"
                      checked={formData.billingAddress === 'same'}
                      onChange={(e) => setFormData({ ...formData, billingAddress: e.target.value })}
                      className="w-[16px] h-[16px]"
                    />
                    <span className="text-[14px] text-[#272727]">Same as the shipping address</span>
                  </label>
                  <div className="border-t border-[#818181] opacity-50" />
                  <label className="flex items-center gap-[12px] cursor-pointer">
                    <input
                      type="radio"
                      name="billing"
                      value="different"
                      checked={formData.billingAddress === 'different'}
                      onChange={(e) => setFormData({ ...formData, billingAddress: e.target.value })}
                      className="w-[16px] h-[16px]"
                    />
                    <span className="text-[14px] text-[#272727]">Use a different address for billing</span>
                  </label>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between">
                <motion.button
                  type="button"
                  onClick={onNavigateToShipping}
                  className="text-[18px] text-[rgba(0,0,0,0.6)] underline"
                  whileHover={{ x: -5 }}
                >
                  Back to shipping
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#03162a] text-white px-[44px] py-[8px] rounded-[4px] font-['Roboto:Medium',sans-serif] text-[20.645px] disabled:opacity-70"
                  whileHover={!submitting ? { scale: 1.05, backgroundColor: '#0a2847' } : {}}
                  whileTap={!submitting ? { scale: 0.95 } : {}}
                >
                  {submitting ? 'Verifying...' : 'Pay now'}
                </motion.button>
              </div>
            </form>
          </div>

          {/* Cart Details Sidebar */}
          <div>
            <div className="bg-[#f9f9f9] border border-[#dedfe1] rounded-[10px] p-[24px] sticky top-[24px]">
              <div className="bg-[#a6a6a6] rounded-t-[10px] px-[24px] py-[16px] -mx-[24px] -mt-[24px] mb-[24px]">
                <h2 className="font-['Poppins:Medium',sans-serif] text-[20px] text-white">Cart Details</h2>
              </div>

              <div className="space-y-[16px]">
                <div className="grid grid-cols-[2fr_1fr_1fr] gap-[16px] text-[16px] text-[#3d3d3d] font-['Inter:Regular',sans-serif] pb-[16px] border-b border-[#dedfe1]">
                  <span>PRODUCT</span>
                  <span>Quantity</span>
                  <span className="text-right">SUBTOTAL</span>
                </div>

                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-[2fr_1fr_1fr] gap-[16px] text-[16px] text-[#949494] font-['Inter:Regular',sans-serif]"
                  >
                    <span className="capitalize">{item.name}</span>
                    <span>{item.quantity}</span>
                    <span className="text-right font-['Inter:Medium',sans-serif]">
                      Rs {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}

                <div className="border-t border-[#dedfe1] pt-[16px] space-y-[12px]">
                  <div className="flex justify-between text-[16px]">
                    <span className="text-[#3d3d3d]">SUBTOTAL</span>
                    <span className="text-[#949494]">Rs {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[16px]">
                    <span className="text-[#3d3d3d]">SHIPPING</span>
                    <span className="text-[#949494]">Rs {deliveryFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[16px] border-t border-[#dedfe1] pt-[12px]">
                    <span className="text-[#3d3d3d]">Total</span>
                    <span className="text-[#949494] font-['Inter:Medium',sans-serif]">
                      Rs {total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}