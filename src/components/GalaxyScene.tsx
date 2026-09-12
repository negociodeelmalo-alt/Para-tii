import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Environment, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { HeartGalaxy } from './HeartGalaxy';
import { PhotoCard } from './PhotoCard';
import { FloatingWords } from './FloatingWords';
import { SpiralGalaxy } from './SpiralGalaxy';

function CameraAnimation({ isStarted }: { isStarted: boolean }) {
  const { camera } = useThree();
  const [animating, setAnimating] = useState(false);
  
  // Set initial position far away
  React.useEffect(() => {
    camera.position.set(0, 0, 300);
  }, [camera]);

  React.useEffect(() => {
    if (isStarted) setAnimating(true);
  }, [isStarted]);

  useFrame((state, delta) => {
    if (animating) {
      const targetZ = 25;
      const distance = camera.position.z - targetZ;
      
      if (distance > 0.5) {
         const speed = Math.max(0.1, distance * 0.03); // Fast travel through the tunnel
         camera.position.z -= speed;
         camera.rotation.z += delta * (distance * 0.015); // Spin the camera while traveling
      } else {
         camera.position.z = targetZ;
         camera.rotation.z = THREE.MathUtils.lerp(camera.rotation.z, 0, 0.05);
         if (Math.abs(camera.rotation.z) < 0.01) {
             camera.rotation.z = 0;
             setAnimating(false);
         }
      }
    }
  });

  return (
    <OrbitControls 
      enableZoom={true} 
      enablePan={false} 
      enableDamping 
      dampingFactor={0.05} 
      rotateSpeed={0.5} 
      minDistance={10} 
      maxDistance={150} 
      autoRotate={!animating && isStarted}
      autoRotateSpeed={0.8}
    />
  );
}

export function GalaxyScene({ isStarted, onPhotoClick }: { isStarted: boolean, onPhotoClick: (url: string, phrase: string) => void }) {
  return (
    <div className="absolute inset-0 z-0 bg-black">
      <Canvas camera={{ fov: 60, position: [0, 0, 300] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ff66b2" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#9933ff" />
        
        {/* Lots of stars and sparkles for the galactic feel */}
        <Stars radius={100} depth={100} count={15000} factor={6} saturation={1} fade speed={2} />
        <Sparkles count={800} scale={60} size={15} speed={0.4} opacity={0.6} color="#ff99cc" />
        <Sparkles count={800} scale={80} size={20} speed={0.2} opacity={0.4} color="#9933ff" />
        
        <HeartGalaxy />
        <SpiralGalaxy />
        <FloatingWords />
        
        {/* The 4 photos requested - Spaced out significantly */}
        <PhotoCard 
          url="https://i.imgur.com/lXM2RUN.jpeg" 
          phrase="No estamos juntos pero sigues siendo mia 🔐💕" 
          position={[-14, 8, 4]} 
          rotation={[0, 0.5, -0.1]}
          delay={0}
          onClick={() => onPhotoClick("https://i.imgur.com/lXM2RUN.jpeg", "No estamos juntos pero sigues siendo mia 🔐💕")}
        />
        <PhotoCard 
          url="https://i.imgur.com/IKEUQLJ.jpeg" 
          phrase="Te deseo lo mejor corazón ❤️‍🔥✨" 
          position={[14, 6, -2]} 
          rotation={[0, -0.4, 0.1]}
          delay={1}
          onClick={() => onPhotoClick("https://i.imgur.com/IKEUQLJ.jpeg", "Te deseo lo mejor corazón ❤️‍🔥✨")}
        />
        <PhotoCard 
          url="https://i.imgur.com/Bio1azs.jpeg" 
          phrase="Eres una bebita muy preciosa 🥺💖" 
          position={[-12, -8, 6]} 
          rotation={[0, 0.6, 0.05]}
          delay={2}
          onClick={() => onPhotoClick("https://i.imgur.com/Bio1azs.jpeg", "Eres una bebita muy preciosa 🥺💖")}
        />
        <PhotoCard 
          url="https://i.imgur.com/5eoJhAe.jpeg" 
          phrase="Dios te cuide y siempre te tenga en sus brazos 🙏🌸" 
          position={[12, -9, 2]} 
          rotation={[0, -0.5, -0.05]}
          delay={3}
          onClick={() => onPhotoClick("https://i.imgur.com/5eoJhAe.jpeg", "Dios te cuide y siempre te tenga en sus brazos 🙏🌸")}
        />

        {/* New 3 photos (Spiderman x Hello Kitty theme) */}
        <PhotoCard 
          url="https://i.imgur.com/nNDQrtn.jpeg" 
          phrase="Tú mi Hello Kitty y yo tu Spider-Man 🕷️🎀" 
          position={[0, 11, -5]} 
          rotation={[0.1, 0, 0.05]}
          delay={4}
          onClick={() => onPhotoClick("https://i.imgur.com/nNDQrtn.jpeg", "Tú mi Hello Kitty y yo tu Spider-Man 🕷️🎀")}
        />
        <PhotoCard 
          url="https://i.imgur.com/yznaLwA.jpeg" 
          phrase="Siempre cuidándote desde cerquita 🕸️💖" 
          position={[-16, 0, -3]} 
          rotation={[-0.1, 0.4, 0.1]}
          delay={5}
          onClick={() => onPhotoClick("https://i.imgur.com/yznaLwA.jpeg", "Siempre cuidándote desde cerquita 🕸️💖")}
        />
        <PhotoCard 
          url="https://i.imgur.com/rd4BLYZ.jpeg" 
          phrase="Hacemos la mejor combinación 🥰✨" 
          position={[16, -2, 4]} 
          rotation={[0.2, -0.5, -0.1]}
          delay={6}
          onClick={() => onPhotoClick("https://i.imgur.com/rd4BLYZ.jpeg", "Hacemos la mejor combinación 🥰✨")}
        />

        <CameraAnimation isStarted={isStarted} />
      </Canvas>
    </div>
  );
}
