/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { GalaxyScene } from './components/GalaxyScene';
import { PhotoModal } from './components/PhotoModal';
import { AnimatePresence, motion } from 'motion/react';
import { Volume2, VolumeX, ArrowLeft } from 'lucide-react';

export default function App() {
  const [entered, setEntered] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<{url: string, phrase: string} | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVoicePlaying, setIsVoicePlaying] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const welcomeVoiceRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Background galaxy song (Adolescentes - Virgen 1:14 loop)
    const audio = new Audio('/music.mp3?v=2');
    audio.loop = true;
    audioRef.current = audio;

    // Welcome voice audio
    const voice = new Audio('/welcome_voice.mp3');
    welcomeVoiceRef.current = voice;

    voice.onplay = () => setIsVoicePlaying(true);
    voice.onended = () => setIsVoicePlaying(false);
    voice.onpause = () => setIsVoicePlaying(false);

    // Try auto-play immediately when opening app
    const playVoiceGreeting = () => {
      voice.play().catch(() => {
        // If browser blocks unmuted autoplay without user gesture,
        // trigger it on the very first touch/click anywhere
        const onFirstInteraction = () => {
          voice.play().catch(() => {});
          window.removeEventListener('click', onFirstInteraction);
          window.removeEventListener('touchstart', onFirstInteraction);
        };
        window.addEventListener('click', onFirstInteraction, { once: true });
        window.addEventListener('touchstart', onFirstInteraction, { once: true });
      });
    };

    // Small delay to ensure smooth page load
    const timer = setTimeout(playVoiceGreeting, 500);

    return () => {
      clearTimeout(timer);
      audio.pause();
      voice.pause();
      audioRef.current = null;
      welcomeVoiceRef.current = null;
    };
  }, []);

  const handleReplayVoice = () => {
    if (welcomeVoiceRef.current) {
      welcomeVoiceRef.current.currentTime = 0;
      welcomeVoiceRef.current.play().catch(console.error);
    }
  };

  const handleEnter = () => {
    // Stop voice message if it's still playing
    if (welcomeVoiceRef.current) {
      welcomeVoiceRef.current.pause();
      welcomeVoiceRef.current.currentTime = 0;
      setIsVoicePlaying(false);
    }

    setEntered(true);
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn("Audio autoplay blocked:", err);
      });
    }
  };

  const handleBackToHome = () => {
    setEntered(false);
    // Pause and rewind galaxy music
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(console.error);
    }
  };

  return (
    <main className="w-full h-screen overflow-hidden bg-black font-sans relative select-none">
      <GalaxyScene 
        isStarted={entered} 
        onPhotoClick={(url, phrase) => setSelectedPhoto({url, phrase})}
      />

      {/* Galaxy Top Controls: Back Button, Instruction Banner, Music Toggle */}
      <AnimatePresence>
        {entered && (
          <>
            {/* Return to Home Button */}
            <motion.button
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ delay: 1.4, duration: 0.5 }}
              onClick={handleBackToHome}
              title="Volver a la pantalla de inicio"
              className="absolute top-4 left-4 z-40 px-3.5 py-2 rounded-full bg-black/60 backdrop-blur-md border border-pink-500/40 text-pink-200 hover:text-white hover:bg-pink-950/60 hover:border-pink-300 transition-all shadow-[0_0_15px_rgba(236,72,153,0.3)] cursor-pointer flex items-center gap-2 font-playfair text-xs sm:text-sm tracking-wider"
            >
              <ArrowLeft className="w-4 h-4 text-pink-400" />
              <span className="hidden sm:inline">VOLVER AL INICIO</span>
              <span className="sm:hidden">INICIO</span>
            </motion.button>

            {/* Center Instruction Banner */}
            <motion.div 
              initial={{ opacity: 0, y: -40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 1.5, duration: 1, ease: "easeOut" }}
              className="absolute top-4 sm:top-5 left-1/2 -translate-x-1/2 z-30 pointer-events-none px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-pink-950/40 backdrop-blur-md border border-pink-500/30 shadow-[0_0_25px_rgba(236,72,153,0.35)] flex items-center gap-2 max-w-[55vw] sm:max-w-[70vw]"
            >
              <span className="text-pink-300 text-base sm:text-lg animate-pulse shrink-0">✨</span>
              <p className="font-dancing text-lg sm:text-2xl md:text-3xl font-bold tracking-wide text-pink-100 whitespace-nowrap drop-shadow-[0_2px_10px_rgba(236,72,153,0.8)] truncate">
                Toca cada foto y mira tu sorpresa 💖
              </p>
              <span className="text-pink-300 text-base sm:text-lg animate-pulse shrink-0">✨</span>
            </motion.div>

            {/* Sound Control Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 1.6, duration: 0.5 }}
              onClick={toggleAudio}
              title={isPlaying ? "Silenciar música" : "Reproducir música"}
              className="absolute top-4 right-4 z-40 px-3.5 py-2 rounded-full bg-black/60 backdrop-blur-md border border-pink-500/40 text-pink-300 hover:text-white hover:bg-pink-950/60 hover:border-pink-300 transition-all shadow-[0_0_15px_rgba(236,72,153,0.3)] cursor-pointer flex items-center gap-2"
            >
              {isPlaying ? (
                <>
                  <Volume2 className="w-4 h-4 text-pink-400 animate-pulse" />
                  <span className="hidden sm:inline font-playfair text-xs tracking-wider text-pink-200">MÚSICA ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-pink-400/60" />
                  <span className="hidden sm:inline font-playfair text-xs tracking-wider text-pink-300/60">MÚSICA OFF</span>
                </>
              )}
            </motion.button>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!entered && (
          <WelcomeScreen 
            onEnter={handleEnter} 
            onReplayVoice={handleReplayVoice}
            isVoicePlaying={isVoicePlaying}
          />
        )}
        
        {selectedPhoto && (
          <PhotoModal 
            url={selectedPhoto.url} 
            phrase={selectedPhoto.phrase} 
            onClose={() => setSelectedPhoto(null)} 
          />
        )}
      </AnimatePresence>
    </main>
  );
}

