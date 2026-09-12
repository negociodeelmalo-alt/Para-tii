import React from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';

interface PhotoModalProps {
  url: string;
  phrase: string;
  onClose: () => void;
}

export function PhotoModal({ url, phrase, onClose }: PhotoModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Background overlay */}
      <motion.div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <motion.div 
        className="relative z-10 w-full max-w-lg md:max-w-3xl flex flex-col items-center justify-center bg-gradient-to-b from-purple-900/40 to-pink-900/40 p-6 md:p-10 rounded-3xl border border-pink-500/30 shadow-[0_0_50px_rgba(236,72,153,0.3)]"
        initial={{ opacity: 0, scale: 0.8, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 30 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-pink-600 transition-colors z-20 cursor-pointer"
        >
          <X size={24} />
        </button>
        
        <img 
          src={url} 
          alt="Rosa" 
          className="w-full max-h-[50vh] object-contain rounded-3xl mb-8 shadow-2xl border-4 border-pink-300/30"
        />
        
        <p className="text-3xl md:text-5xl font-dancing font-bold text-center text-pink-100 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] leading-relaxed px-4">
          {phrase}
        </p>
      </motion.div>
    </div>
  );
}
