import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ModelViewer } from './ModelViewer';
import { useCart } from '../components/CartContext';
import { ShoppingCart, Check } from 'lucide-react';

const sizes = ['S', 'M', 'L', 'XL'];

export function ProductCardLanding({ product, ...individualProps }: any) {
  const mergedProps = { ...product, ...individualProps };
  const { id, name, price, modelPath, image, category, description, onClick } = mergedProps;
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [showAddedMessage, setShowAddedMessage] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    addToCart({
      id: `${id}-${selectedSize}`,
      name,
      price: typeof price === 'number' ? price : 0,
      size: selectedSize,
      image: image || '',
      category: category || '',
    });
    setShowAddedMessage(true);
    setTimeout(() => {
      setShowAddedMessage(false);
      setSelectedSize('');
    }, 2000);
  };

  return (
    <div
      className="product-card flex flex-col group bg-white shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden rounded-[16px] border border-black/[0.12] w-full min-w-0 max-w-full px-5 py-5 gap-3.5"
      style={{ minHeight: 520 }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3D / product image - hover par sizes + Add to Cart - fixed height so 3D Canvas renders */}
      <div className="w-full overflow-hidden rounded-[16px] relative flex-shrink-0 bg-gray-50 min-h-[280px]" style={{ aspectRatio: '431/500' }}>
        <div className="absolute inset-0 w-full h-full rounded-[16px] overflow-hidden">
          {modelPath ? (
            <ModelViewer modelPath={modelPath} image={image} name={name} />
          ) : (
            <div className="w-full h-full bg-gray-100 rounded-[16px] flex items-center justify-center overflow-hidden">
              {image ? (
                <img src={image} alt={name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400">No Image</span>
              )}
            </div>
          )}
        </div>

        {/* Hover overlay - S M L XL sizes + Add to Cart (clear visible) */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/55 flex flex-col items-center justify-end pb-5 pt-4 px-4 gap-4 rounded-[16px]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex gap-2.5 justify-center flex-wrap">
                {sizes.map((size) => (
                  <motion.button
                    key={size}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSize(size);
                    }}
                    className={`min-w-[48px] h-12 rounded-xl border-2 text-[16px] font-bold transition-all shadow-md ${selectedSize === size
                      ? 'bg-white border-white text-[#111827] ring-2 ring-offset-2 ring-white'
                      : 'bg-white text-[#111827] border-gray-200 hover:border-white hover:bg-gray-50'
                      }`}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {size}
                  </motion.button>
                ))}
              </div>
              <motion.button
                onClick={handleAddToCart}
                disabled={showAddedMessage}
                className="w-full max-w-[260px] h-12 rounded-xl flex items-center justify-center gap-2 font-bold text-[15px] bg-white text-[#111827] hover:bg-gray-100 disabled:bg-green-600 disabled:text-white shadow-lg border border-gray-200"
                whileHover={!showAddedMessage ? { scale: 1.02 } : {}}
                whileTap={!showAddedMessage ? { scale: 0.98 } : {}}
              >
                {showAddedMessage ? (
                  <>
                    <Check className="w-5 h-5" />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </>
                )}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Title, price, description - Add to Cart button ke neeche */}
      <div className="flex-shrink-0 flex flex-col justify-end min-h-0">
        <h3 className="font-bold text-lg leading-tight">{name || "Product"}</h3>
        <p className="text-gray-600 mt-0.5">{typeof price === 'number' ? `Rs ${price.toLocaleString()}` : (price || "Rs 0")}</p>
        {description && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{description}</p>}
      </div>
    </div>
  );
}
