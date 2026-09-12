import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Image } from '@react-three/drei';
import * as THREE from 'three';

interface PhotoCardProps {
  url: string;
  phrase: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  delay?: number;
  onClick: () => void;
}

export function PhotoCard({ url, phrase, position, rotation = [0, 0, 0], delay = 0, onClick }: PhotoCardProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating animation
      const t = state.clock.elapsedTime + delay;
      groupRef.current.position.y = position[1] + Math.sin(t * 1.5) * 0.8;
      groupRef.current.position.x = position[0] + Math.cos(t * 1.2) * 0.5;
      
      // Target rotations
      const baseEuler = new THREE.Euler(...rotation);
      const baseQuat = new THREE.Quaternion().setFromEuler(baseEuler);
      
      if (hovered) {
         // Look at camera a bit when hovered
         const lookAtQuat = new THREE.Quaternion().setFromRotationMatrix(
            new THREE.Matrix4().lookAt(groupRef.current.position, state.camera.position, new THREE.Vector3(0,1,0))
         );
         groupRef.current.quaternion.slerp(lookAtQuat, 0.1);
         groupRef.current.scale.lerp(new THREE.Vector3(1.15, 1.15, 1.15), 0.1);
      } else {
         groupRef.current.quaternion.slerp(baseQuat, 0.08);
         groupRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
  });

  return (
    <group 
      ref={groupRef} 
      position={position}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }}
    >
      {/* 
        Usamos el componente Image de drei. Renderiza la foto nativamente en WebGL, 
        evitando los errores de opacidad/fondo negro del HTML. 
        Al aplicar side={THREE.DoubleSide} la foto se ve por ambas caras.
      */}
      <Image 
        url={url} 
        transparent 
        opacity={1} 
        scale={[4.5, 5.5]} // Fotos más grandes
        side={THREE.DoubleSide}
        radius={0.7} // Bordes redondeados elegantes
      />
    </group>
  );
}
