import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function SpiralGalaxy() {
  const pointsRef = useRef<THREE.Points>(null);
  const particlesCount = 30000;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    const col = new Float32Array(particlesCount * 3);
    const color = new THREE.Color();
    
    for (let i = 0; i < particlesCount; i++) {
      const radius = Math.random() * 60;
      const spinAngle = radius * 0.4;
      const branchAngle = ((i % 4) * Math.PI * 2) / 4;
      
      const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 4;
      const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 3;
      const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 4;

      pos[i * 3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      pos[i * 3 + 1] = randomY - 20; // Posicionada debajo del corazón
      pos[i * 3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;
      
      // Colores de la galaxia (Azules oscuros, púrpuras, rosas brillantes)
      const mix = Math.random();
      if (mix < 0.4) color.setHex(0x1a0033);
      else if (mix < 0.7) color.setHex(0x9900ff);
      else color.setHex(0xff3399);
      
      // Brillo intenso hacia el centro
      color.lerp(new THREE.Color(0xffffff), Math.max(0, 1 - (radius / 20)));

      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }
    
    return [pos, col];
  }, []);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y -= delta * 0.08; // Rota en sentido contrario
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.12} vertexColors transparent opacity={0.9} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}
