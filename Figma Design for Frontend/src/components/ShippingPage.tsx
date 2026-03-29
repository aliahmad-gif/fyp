import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useCart } from './CartContext';
import { ArrowLeft } from 'lucide-react';

interface ShippingPageProps {
  onNavigateToCart: () => void;
  onNavigateToPayment: () => void;
  onNavigateToLanding: () => void;
  onNavigateToProfile: () => void;
}

export default function ShippingPage({ onNavigateToCart, onNavigateToPayment, onNavigateToLanding, onNavigateToProfile }: ShippingPageProps) {
  const { cartItems, getSubtotal } = useCart();
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    shippingNote: '',
    city: '',
    postalCode: '',
    province: '',
    country: 'Pakistan',
    saveInfo: false,
  });
  const [backendErrors, setBackendErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const subtotal = getSubtotal();
  const deliveryFee = 1500;
  const total = subtotal + deliveryFee;

  const apiBase = import.meta.env?.VITE_DJANGO_API_URL ?? 'http://localhost:8000/api';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBackendErrors({});
    setSubmitting(true);
    try {
      const res = await fetch(`${apiBase}/verify-shipping/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          shippingNote: formData.shippingNote,
          city: formData.city,
          postalCode: formData.postalCode,
          province: formData.province,
          country: formData.country,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.valid) {
        onNavigateToPayment();
        return;
      }
      if (data.errors && typeof data.errors === 'object') {
        setBackendErrors(data.errors);
      }
    } catch {
      setBackendErrors({ form: 'Could not verify with server. Try again.' });
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
          <span className="font-['Roboto:Medium',sans-serif] text-[16px] text-[#56b280]">Cart</span>
          <span className="text-black">›</span>
          <span className="font-['Roboto:Medium',sans-serif] text-[16px] text-[#272727]">Details</span>
          <span className="text-black">›</span>
          <span className="font-['Roboto:Medium',sans-serif] text-[16px] text-[#616161]">Shipping</span>
          <span className="text-black">›</span>
          <span className="font-['Roboto:Medium',sans-serif] text-[16px] text-[#616161]">Payment</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[80px]">
          {/* Form Section */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-[48px]">
              {backendErrors.form && (
                <p className="text-[14px] text-red-600 bg-red-50 px-3 py-2 rounded">{backendErrors.form}</p>
              )}
              {/* Contact */}
              <div>
                <div className="flex items-center justify-between mb-[16px]">
                  <h2 className="font-['Roboto:Medium',sans-serif] text-[20px] text-[#272727]">Contact</h2>
                  <p className="text-[14px]">
                    <span className="text-[#616161]">Do you have an account?</span>{' '}
                    <span className="text-[#56b280] cursor-pointer">Login</span>
                  </p>
                </div>
                <input
                  type="text"
                  placeholder="Email or mobile phone number"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full h-[40px] px-[16px] border rounded-[4px] text-[14px] text-[#616161] outline-none focus:border-[#56b280] ${backendErrors.email ? 'border-red-500' : 'border-[#56b280]'}`}
                  required
                />
                {backendErrors.email && <p className="text-red-600 text-[12px] mt-1">{backendErrors.email}</p>}
              </div>

              {/* Shipping Address */}
              <div>
                <h2 className="font-['Roboto:Medium',sans-serif] text-[20px] text-[#272727] mb-[16px]">
                  Shipping Address
                </h2>
                <div className="space-y-[12px]">
                  <div className="grid grid-cols-2 gap-[12px]">
                    <input
                      type="text"
                      placeholder="Name"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="h-[40px] px-[16px] border border-[#898989] rounded-[4px] text-[14px] text-[#616161] outline-none focus:border-[#171717]"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Second Name"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="h-[40px] px-[16px] border border-[#898989] rounded-[4px] text-[14px] text-[#616161] outline-none focus:border-[#171717]"
                      required
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Address and number"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full h-[40px] px-[16px] border border-[#898989] rounded-[4px] text-[14px] text-[#616161] outline-none focus:border-[#171717]"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Shipping note (optional)"
                    value={formData.shippingNote}
                    onChange={(e) => setFormData({ ...formData, shippingNote: e.target.value })}
                    className="w-full h-[40px] px-[16px] border border-[#898989] rounded-[4px] text-[14px] text-[#616161] outline-none focus:border-[#171717]"
                  />
                  <div className="grid grid-cols-3 gap-[12px]">
                    <input
                      type="text"
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="h-[40px] px-[16px] border border-[#898989] rounded-[4px] text-[14px] text-[#616161] outline-none focus:border-[#171717]"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Postal Code"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      className="h-[40px] px-[16px] border border-[#898989] rounded-[4px] text-[14px] text-[#616161] outline-none focus:border-[#171717]"
                      required
                    />
                    <select
                      value={formData.province}
                      onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                      className="h-[40px] px-[16px] border border-[#898989] rounded-[4px] text-[14px] text-[#272727] outline-none focus:border-[#171717]"
                      required
                    >
                      <option value="">Province</option>
                      <option value="Punjab">Punjab</option>
                      <option value="Sindh">Sindh</option>
                      <option value="KPK">KPK</option>
                      <option value="Balochistan">Balochistan</option>
                    </select>
                  </div>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full h-[40px] px-[16px] border border-[#898989] rounded-[4px] text-[14px] text-[#272727] outline-none focus:border-[#171717]"
                  >
                    <option value="Pakistan">Pakistan</option>
                  </select>
                  <label className="flex items-center gap-[8px] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.saveInfo}
                      onChange={(e) => setFormData({ ...formData, saveInfo: e.target.checked })}
                      className="w-[16px] h-[16px]"
                    />
                    <span className="text-[14px] text-[#272727]">
                      Save this informations for a future fast checkout
                    </span>
                  </label>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between">
                <motion.button
                  type="button"
                  onClick={onNavigateToCart}
                  className="text-[18px] text-[#03162a] underline"
                  whileHover={{ x: -5 }}
                >
                  Back to cart
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#171717] text-white px-[44px] py-[8px] rounded-[4px] font-['Inter:Medium',sans-serif] text-[20.645px] disabled:opacity-70"
                  whileHover={!submitting ? { scale: 1.05, backgroundColor: '#2d2d2d' } : {}}
                  whileTap={!submitting ? { scale: 0.95 } : {}}
                >
                  {submitting ? 'Verifying...' : 'Continue to payment'}
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