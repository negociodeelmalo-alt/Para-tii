import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

const words = [
  "Hermosa 💖", "Preciosa 🌸", "Mi vida 🥰", "Amor ❤️", "Luz ✨", "Estrella ⭐", 
  "Única 💎", "Mágica 🪄", "Te Quiero 💘", "Especial 🌟", "Bella 🌹", "Cielo 🌌",
  "Ternura 🧸", "Dulzura 🍭", "Infinita ♾️", "Princesa 👑", "Encanto 🎀", "Maravilla 🌺",
  "Reina 👸🏻", "Tesoro 💍", "Angelito 👼", "Perfecta 💝", "Inolvidable 🌠", "Mi sol ☀️",
  "Consentida 🥺", "Destino 💫", "Alegría 🦋", "Incomparable 🌷", "Fascinante 🥂", "Divina 🍷",
  "Radiante 🌅", "Espléndida 🎇", "Mi todo 🌍", "Sublime ☄️", "Preciada 🎁",
  "Amada 💞", "Magnífica 🤩", "Inspiración 💭", "Paraíso 🏝️", "Magia 🔮", "Mi paz 🕊️",
  "Preciosidad 💖", "Estrellita 🌟", "Muñeca 🎀", "Bebita 🥺", "Mi niña 👧",
  "Suspiro 🌬️", "Mi luna 🌙", "Mi universo 🌌", "Diosa 🤍"
];

export function FloatingWords() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.06;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {words.map((word, i) => {
        // Distribute words in a sphere around the heart
        const phi = Math.acos(-1 + (2 * i) / words.length);
        const theta = Math.sqrt(words.length * Math.PI) * phi;
        
        // Much larger radius to spread out the 50 words and avoid overlap
        const r = 25 + Math.random() * 15;
        
        const x = r * Math.cos(theta) * Math.sin(phi);
        const y = r * Math.sin(theta) * Math.sin(phi);
        const z = r * Math.cos(phi);

        return (
          <FloatingWord 
            key={i} 
            word={word} 
            position={[x, y, z]} 
            delay={i * 0.5} 
          />
        );
      })}
    </group>
  );
}

function FloatingWord({ word, position, delay }: { word: string, position: [number, number, number], delay: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  const colorClass = useMemo(() => Math.random() > 0.5 ? "text-pink-200" : "text-purple-200", []);
  // Set distance factor exactly in the middle between the previous 20-30 (too big) and 8-14 (too small)
  const distFactor = useMemo(() => 15 + Math.random() * 5, []);
  
  useFrame((state) => {
    if (groupRef.current) {
      // Faster, more dynamic bobbing effect
      const t = state.clock.elapsedTime + delay;
      groupRef.current.position.y = position[1] + Math.sin(t * 1.5) * 0.8;
      groupRef.current.position.x = position[0] + Math.cos(t * 1.2) * 0.5;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <Html transform sprite center distanceFactor={distFactor} className="pointer-events-none">
        <div className={`font-dancing font-bold text-2xl md:text-3xl whitespace-nowrap drop-shadow-[0_2px_4px_rgba(255,255,255,0.4)] ${colorClass}`}>
          {word}
        </div>
      </Html>
    </group>
  );
}
