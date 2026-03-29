import React from 'react';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatWidgetLandingProps {
  onNavigateToChat?: () => void;
}

export default function ChatWidgetLanding({ onNavigateToChat }: ChatWidgetLandingProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onNavigateToChat?.()}
        className="w-14 h-14 rounded-full bg-[#6b4f3f] text-white shadow-lg flex items-center justify-center hover:opacity-90 transition-shadow"
        aria-label="Chat"
      >
        <MessageCircle size={24} />
      </motion.button>
    </div>
  );
}
