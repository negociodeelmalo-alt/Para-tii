import { motion } from 'motion/react';
import React from 'react';
import { Volume2 } from 'lucide-react';

interface WelcomeScreenProps {
  onEnter: () => void;
  onReplayVoice?: () => void;
  isVoicePlaying?: boolean;
}

export function WelcomeScreen({ onEnter, onReplayVoice, isVoicePlaying }: WelcomeScreenProps) {
  return (
    <motion.div 
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-pink-900 via-purple-900 to-black overflow-hidden"
      exit={{ opacity: 0, scale: 1.2, filter: 'blur(10px)' }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
    >
      {/* Animated stars background for the welcome screen */}
      <div className="absolute inset-0 opacity-50 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-screen animate-pulse"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center text-center px-4"
      >
        <h1 className="text-5xl md:text-7xl font-dancing text-pink-300 drop-shadow-[0_0_15px_rgba(236,72,153,0.8)] mb-4">
          Feliz Cumpleaños Rosa
        </h1>
        
        <p className="text-xl md:text-2xl font-playfair text-purple-200 mb-4 max-w-lg">
          Hoy el universo brilla un poquito más porque es tu día especial.
        </p>

        {onReplayVoice && (
          <motion.button
            onClick={onReplayVoice}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mb-6 px-4 py-1.5 rounded-full bg-pink-950/60 hover:bg-pink-900/70 border border-pink-400/40 text-pink-200 text-xs sm:text-sm font-playfair flex items-center gap-2 shadow-[0_0_15px_rgba(236,72,153,0.35)] transition-all cursor-pointer"
          >
            <Volume2 className={`w-4 h-4 text-pink-400 ${isVoicePlaying ? 'animate-pulse' : ''}`} />
            <span>{isVoicePlaying ? 'Escuchando voz...' : 'Escuchar voz de bienvenida 🎙️'}</span>
          </motion.button>
        )}

        <motion.img 
          src="https://i.imgur.com/GLY79lM.gif" 
          alt="Ositos lindos" 
          className="w-44 h-44 md:w-60 md:h-60 object-cover rounded-3xl shadow-[0_0_30px_rgba(236,72,153,0.5)] mb-8 border-4 border-pink-400/30"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        />

        <motion.button
          onClick={onEnter}
          whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(236,72,153,0.8)" }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full text-white font-playfair font-bold text-xl md:text-2xl tracking-wide shadow-lg border border-pink-400/50 transition-all cursor-pointer relative overflow-hidden group"
        >
          <span className="relative z-10">Entra a mi corazón bebita</span>
          <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"></div>
        </motion.button>
      </motion.div>

      {/* Floating decorative hearts */}
      <FloatingHearts />
    </motion.div>
  );
}

function FloatingHearts() {
  const hearts = Array.from({ length: 15 });
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {hearts.map((_, i) => {
        const left = `${Math.random() * 100}%`;
        const size = Math.random() * 20 + 10;
        const duration = Math.random() * 10 + 5;
        const delay = Math.random() * 5;
        return (
          <motion.div
            key={i}
            className="absolute bottom-[-50px] text-pink-400/40"
            style={{ left, fontSize: size }}
            animate={{
              y: ['0vh', '-110vh'],
              x: ['0px', `${(Math.random() - 0.5) * 100}px`],
              rotate: [0, 360]
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            ♥
          </motion.div>
        );
      })}
    </div>
  );
}
