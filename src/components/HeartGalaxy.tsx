import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function HeartGalaxy() {
  const pointsRef = useRef<THREE.Points>(null);

  const particlesCount = 8000;
  
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    const col = new Float32Array(particlesCount * 3);
    const color = new THREE.Color();
    
    for (let i = 0; i < particlesCount; i++) {
      // Parametric heart formula
      const t = Math.random() * Math.PI * 2;
      const xBase = 16 * Math.pow(Math.sin(t), 3);
      const yBase = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      
      const scale = 0.4 + (Math.random() * 0.2); // slight thickness variation
      
      // Add some random scatter
      const r = Math.random() * 1.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      const px = xBase * scale + r * Math.sin(phi) * Math.cos(theta);
      const py = yBase * scale + r * Math.sin(phi) * Math.sin(theta);
      const pz = r * Math.cos(phi) * (Math.random() * 2 - 1) * 2; // flatten a bit on Z

      pos[i * 3] = px;
      pos[i * 3 + 1] = py;
      pos[i * 3 + 2] = pz;
      
      // Color gradient from pink to purple to white
      const mixRatio = Math.random();
      if (mixRatio < 0.5) {
        color.setHex(0xff3366).lerp(new THREE.Color(0x9933ff), mixRatio * 2);
      } else {
        color.setHex(0x9933ff).lerp(new THREE.Color(0xffffff), (mixRatio - 0.5) * 2);
      }
      
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }
    
    return [pos, col];
  }, []);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.1;
      // Slight floating motion
      pointsRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
