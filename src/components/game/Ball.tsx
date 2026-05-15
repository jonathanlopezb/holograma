// @ts-nocheck
'use client';

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, BallCollider } from '@react-three/rapier';
import { useGameStore } from '@/lib/store';
import * as THREE from 'three';

export default function Ball() {
  const ballRef = useRef<any>(null);
  const { gameState } = useGameStore();

  // Reset ball to kick position when game enters PLAYING state
  useEffect(() => {
    if (gameState === 'PLAYING' && ballRef.current) {
      ballRef.current.setTranslation({ x: 0, y: 0.22, z: 5 }, true);
      ballRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      ballRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
    }
  }, [gameState]);

  // Listen for shoot events
  useEffect(() => {
    const handleShoot = (e: CustomEvent<{ dx: number; dy: number; dz: number; spin: number }>) => {
      if (!ballRef.current) return;
      const { dx, dy, dz, spin } = e.detail;
      ballRef.current.applyImpulse({ x: dx, y: dy, z: dz }, true);
      ballRef.current.applyTorqueImpulse({ x: 0, y: spin, z: 0 }, true);
    };
    window.addEventListener('ball-shoot', handleShoot as EventListener);
    return () => window.removeEventListener('ball-shoot', handleShoot as EventListener);
  }, []);

  return (
    <RigidBody
      ref={ballRef}
      colliders={false}
      restitution={0.65}
      friction={0.4}
      linearDamping={0.05}
      angularDamping={0.1}
      position={[0, 0.22, 5]}
      canSleep={false}
      name="ball"
    >
      <BallCollider args={[0.22]} />
      <mesh castShadow>
        <sphereGeometry args={[0.22, 32, 32]} />
        {/* Classic black-white panel ball */}
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.4}
          metalness={0.05}
        />
      </mesh>
      {/* Black panels overlay (visual only) */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={i}
          position={[
            Math.sin((i / 5) * Math.PI * 2) * 0.15,
            Math.cos((i / 5) * Math.PI * 2) * 0.15,
            0.1,
          ]}
        >
          <circleGeometry args={[0.06, 5]} />
          <meshStandardMaterial color="#111111" />
        </mesh>
      ))}
    </RigidBody>
  );
}
