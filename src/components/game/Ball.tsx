// @ts-nocheck
'use client';

import { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import { useGameStore } from '@/lib/store';

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

  // Load realistic ball model
  /* 
  let ballModel;
  try {
    ballModel = useGLTF('/models/ball.glb');
  } catch (e) {
    ballModel = null;
  }
  const scene = ballModel?.scene;
  */
  const scene = null;


  return (
    <RigidBody
      ref={ballRef}
      colliders="ball"
      position={[0, 0.22, 5]}
      restitution={0.8}
      friction={0.5}
      name="ball"
    >
      {scene ? (
        <primitive object={scene} scale={0.22} />
      ) : (
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.22, 32, 32]} />
          <meshStandardMaterial 
            color="#ffffff" 
            roughness={0.15} 
            metalness={0.8}
            emissive="#00f2ff"
            emissiveIntensity={0.2}
          />
        </mesh>
      )}

    </RigidBody>
  );
}

// try { useGLTF.preload('/models/ball.glb'); } catch (e) {}
