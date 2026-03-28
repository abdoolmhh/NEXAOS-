import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function ParticleField() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const pos = new Float32Array(9000);
    for (let i = 0; i < 3000; i++) {
      pos[3 * i] = (Math.random() - 0.5) * 25;
      pos[3 * i + 1] = (Math.random() - 0.5) * 25;
      pos[3 * i + 2] = (Math.random() - 0.5) * 15;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.008;
      ref.current.rotation.x = state.clock.elapsedTime * 0.004;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#006D44"
        size={0.025}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.35}
      />
    </Points>
  );
}

function DistortedBlob({ pos, d = 0.4, spd = 1 }: { pos: [number, number, number], d?: number, spd?: number }) {
  return (
    <Float speed={spd} floatIntensity={2}>
      <mesh position={pos}>
        <Sphere args={[1.2, 64, 64]}>
          <MeshDistortMaterial
            color="#006D44"
            distort={d}
            speed={2}
            transparent
            opacity={0.08}
            roughness={0}
          />
        </Sphere>
      </mesh>
    </Float>
  );
}

function ScrollHandler({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
  useFrame(() => {
    if (containerRef.current) {
      containerRef.current.style.transform = `translateY(${window.scrollY * 0.25}px)`;
    }
  });
  return null;
}

export default function Background3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 opacity-60 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 6], fov: 70 }}>
        <ScrollHandler containerRef={containerRef} />
        <ParticleField />
        <DistortedBlob pos={[4, 2, -4]} d={0.5} spd={1.2} />
        <DistortedBlob pos={[-4, -2, -5]} d={0.3} spd={0.8} />
        <DistortedBlob pos={[0, -4, -6]} d={0.4} spd={1.5} />
      </Canvas>
    </div>
  );
}
