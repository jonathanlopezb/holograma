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

  // Load realistic ball model
  // Place 'ball.glb' in public/models/
  let ballModel;
  try {
    ballModel = useGLTF('/models/ball.glb');
  } catch (e) {
    ballModel = null;
  }
  const { scene } = ballModel || { scene: null };

  return (
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
