import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from './CartContext';
import { ShoppingCart, Check } from 'lucide-react';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  category: string;
  description?: string;
  onClick?: () => void;
}

const sizes = ['S', 'M', 'L', 'XL'];

export function ProductCard({
  id,
  name,
  price,
  originalPrice,
  discount,
  image,
  category,
  description,
  onClick,
}: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [showAddedMessage, setShowAddedMessage] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    addToCart({
      id: `${id}-${selectedSize}`,
      name,
      price,
      size: selectedSize,
      image,
      category,
    });

    setShowAddedMessage(true);
    setTimeout(() => {
      setShowAddedMessage(false);
      setSelectedSize('');
    }, 2000);
  };

  return (
    <motion.div
      className="relative w-full h-full"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="bg-white rounded-[20px] border border-[rgba(0,0,0,0.1)] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col cursor-pointer">
        {/* Product Image */}
        <div className="relative w-full h-[400px] overflow-hidden bg-[#f0eeed]">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />

          {/* Discount Badge - Always Visible */}
          {discount && (
            <motion.div
              className="absolute top-4 right-4 bg-[rgba(255,51,51,0.95)] backdrop-blur-sm px-[14px] py-[8px] rounded-[62px] shadow-lg"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <p className="text-white text-[16px] font-['Satoshi:Medium',sans-serif] font-bold">-{discount}%</p>
            </motion.div>
          )}

          {/* Hover Overlay - Size Selection & Add to Cart */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-end p-6 gap-4"
              >
                {/* Size Selector */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="w-full"
                >
                  <p className="text-white text-[16px] font-['Inter:Medium',sans-serif] mb-3 text-center">
                    Select Size:
                  </p>
                  <div className="flex gap-[10px] justify-center">
                    {sizes.map((size) => (
                      <motion.button
                        key={size}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSize(size);
                        }}
                        className={`flex items-center justify-center w-[60px] h-[60px] rounded-[12px] border-2 transition-all duration-200 ${selectedSize === size
                          ? 'bg-white border-white text-black shadow-lg scale-110'
                          : 'bg-white/10 border-white/50 text-white hover:bg-white/20 hover:border-white backdrop-blur-sm'
                          }`}
                        whileHover={{ scale: selectedSize === size ? 1.1 : 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <p className="text-[18px] font-['Inter:Bold',sans-serif]">{size}</p>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Add to Cart Button */}
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart();
                  }}
                  disabled={showAddedMessage}
                  className={`w-full h-[56px] rounded-[12px] flex items-center justify-center gap-2 transition-all duration-300 shadow-lg ${showAddedMessage
                    ? 'bg-green-600'
                    : 'bg-white hover:bg-gray-100'
                    }`}
                  whileHover={!showAddedMessage ? { scale: 1.02 } : {}}
                  whileTap={!showAddedMessage ? { scale: 0.98 } : {}}
                >
                  <AnimatePresence mode="wait">
                    {showAddedMessage ? (
                      <motion.div
                        key="added"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2"
                      >
                        <Check className="w-5 h-5 text-white" />
                        <span className="text-white text-[16px] font-['Inter:Bold',sans-serif]">
                          Added to Cart!
                        </span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="add"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2"
                      >
                        <ShoppingCart className="w-5 h-5 text-black" />
                        <span className="text-black text-[16px] font-['Inter:Bold',sans-serif]">
                          Add to Cart
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Product Info - Always Visible */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Product Name */}
          <h3 className="text-[22px] font-['Inter:Bold',sans-serif] text-black mb-2 line-clamp-2 min-h-[56px]">
            {name}
          </h3>

          {/* Description */}
          {description && (
            <p className="text-[14px] text-[rgba(0,0,0,0.6)] font-['Inter:Regular',sans-serif] mb-4 line-clamp-2 min-h-[40px]">
              {description}
            </p>
          )}

          {/* Price - Always at bottom */}
          <div className="mt-auto flex items-center gap-3">
            <p className="text-[28px] font-['Roboto_Slab:Bold',sans-serif] text-black">
              Rs {price.toLocaleString()}
            </p>
            {originalPrice && (
              <p className="text-[20px] font-['Roboto_Slab:Bold',sans-serif] text-[rgba(0,0,0,0.3)] line-through">
                Rs {originalPrice.toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
