// @ts-nocheck
'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '@/lib/store';
import * as THREE from 'three';

export type DiveDirection = 'left' | 'right' | 'center';

interface GoalkeeperProps {
  onSave?: () => void;
  onGoal?: () => void;
}

// Goalkeeper state machine states
type GKState = 'idle' | 'taunt' | 'dive_left' | 'dive_right' | 'dive_center' | 'celebrate' | 'frustrated';

export default function Goalkeeper({ onSave, onGoal }: GoalkeeperProps) {
  const { selectedGoalkeeper, gameState } = useGameStore();
  const bodyRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);

  const [gkState, setGkState] = useState<GKState>('idle');
  const [diveTarget, setDiveTarget] = useState<THREE.Vector3>(new THREE.Vector3(0, 1, -4.8));

  // Colors per goalkeeper
  const colors = {
    DIBU: { jersey: '#4CAF50', shorts: '#fff', skin: '#d4a076' },
    NEUER: { jersey: '#dc2626', shorts: '#000', skin: '#f0c090' },
  };
  const c = colors[selectedGoalkeeper];

  // Expose dive trigger for external use via event
  useEffect(() => {
    const handleDive = (e: CustomEvent<{ direction: DiveDirection }>) => {
      const { direction } = e.detail;
      const stateMap: Record<DiveDirection, GKState> = {
        left: 'dive_left',
        right: 'dive_right',
        center: 'dive_center',
      };
      setGkState(stateMap[direction]);
      // Reset to idle after animation
      setTimeout(() => setGkState('idle'), 2000);
    };
    window.addEventListener('goalkeeper-dive', handleDive as EventListener);
    return () => window.removeEventListener('goalkeeper-dive', handleDive as EventListener);
  }, []);

  useFrame((state) => {
    if (!bodyRef.current) return;
    const t = state.clock.getElapsedTime();
    const body = bodyRef.current;

    switch (gkState) {
      case 'idle': {
        // Gentle sway side to side — Dibu more pronounced, Neuer minimal
        const swayAmp = selectedGoalkeeper === 'DIBU' ? 0.7 : 0.25;
        const swaySpeed = selectedGoalkeeper === 'DIBU' ? 1.8 : 0.9;
        body.position.x = Math.sin(t * swaySpeed) * swayAmp;
        body.position.y = 1;
        body.position.z = -4.8;
        // Bob up/down slightly
        body.position.y = 1 + Math.abs(Math.sin(t * swaySpeed * 2)) * 0.05;
        // Arm wave for Dibu
        if (leftArmRef.current && rightArmRef.current) {
          leftArmRef.current.rotation.z = selectedGoalkeeper === 'DIBU'
            ? Math.sin(t * 3) * 0.4 + 0.3
            : 0.1;
          rightArmRef.current.rotation.z = selectedGoalkeeper === 'DIBU'
            ? -(Math.sin(t * 3 + 1) * 0.4 + 0.3)
            : -0.1;
        }
        break;
      }
      case 'taunt': {
        // Dibu points at the player, Neuer stares steady
        body.position.x = 0;
        body.position.y = 1;
        body.position.z = -4.8;
        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = selectedGoalkeeper === 'DIBU'
            ? -Math.PI / 3 + Math.sin(t * 5) * 0.05  // Pointing forward
            : 0;
          rightArmRef.current.rotation.z = selectedGoalkeeper === 'DIBU' ? 0 : -0.1;
        }
        break;
      }
      case 'dive_left': {
        body.position.x = THREE.MathUtils.lerp(body.position.x, -2.5, 0.18);
        body.position.y = THREE.MathUtils.lerp(body.position.y, 0.5, 0.12);
        body.rotation.z = THREE.MathUtils.lerp(body.rotation.z, Math.PI / 2.2, 0.15);
        if (leftArmRef.current) leftArmRef.current.rotation.z = Math.PI / 2;
        if (rightArmRef.current) rightArmRef.current.rotation.z = Math.PI / 3;
        break;
      }
      case 'dive_right': {
        body.position.x = THREE.MathUtils.lerp(body.position.x, 2.5, 0.18);
        body.position.y = THREE.MathUtils.lerp(body.position.y, 0.5, 0.12);
        body.rotation.z = THREE.MathUtils.lerp(body.rotation.z, -Math.PI / 2.2, 0.15);
        if (leftArmRef.current) leftArmRef.current.rotation.z = -Math.PI / 3;
        if (rightArmRef.current) rightArmRef.current.rotation.z = -Math.PI / 2;
        break;
      }
      case 'dive_center': {
        // Jump straight up
        body.position.x = THREE.MathUtils.lerp(body.position.x, 0, 0.1);
        body.position.y = THREE.MathUtils.lerp(body.position.y, 2.2, 0.12);
        body.rotation.z = THREE.MathUtils.lerp(body.rotation.z, 0, 0.1);
        if (leftArmRef.current) leftArmRef.current.rotation.z = Math.PI / 3;
        if (rightArmRef.current) rightArmRef.current.rotation.z = -Math.PI / 3;
        break;
      }
      case 'celebrate': {
        body.position.y = 1 + Math.abs(Math.sin(t * 6)) * 0.3; // Jump celebrate
        body.rotation.z = Math.sin(t * 8) * 0.1;
        break;
      }
      case 'frustrated': {
        body.rotation.z = Math.sin(t * 10) * 0.05; // Slight shake
        break;
      }
    }
  });

  return (
    <group ref={bodyRef} position={[0, 1, -4.8]}>
      {/* Torso */}
      <mesh castShadow>
        <capsuleGeometry args={[0.35, 1.0, 8, 16]} />
        <meshStandardMaterial color={c.jersey} roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshStandardMaterial color={c.skin} roughness={0.8} />
      </mesh>

      {/* Hair (darkish cap) */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <sphereGeometry args={[0.29, 16, 8]} />
        <meshStandardMaterial color={selectedGoalkeeper === 'DIBU' ? '#1a0a00' : '#8B8000'} />
      </mesh>

      {/* Gloves */}
      <mesh position={[-0.55, 0.2, 0]} castShadow>
        <sphereGeometry args={[0.13, 8, 8]} />
        <meshStandardMaterial color="#f5a623" roughness={0.5} />
      </mesh>
      <mesh position={[0.55, 0.2, 0]} castShadow>
        <sphereGeometry args={[0.13, 8, 8]} />
        <meshStandardMaterial color="#f5a623" roughness={0.5} />
      </mesh>

      {/* Left Arm */}
      <mesh ref={leftArmRef} position={[-0.5, 0.3, 0]} rotation={[0, 0, 0.3]} castShadow>
        <capsuleGeometry args={[0.1, 0.5, 4, 8]} />
        <meshStandardMaterial color={c.jersey} />
      </mesh>

      {/* Right Arm */}
      <mesh ref={rightArmRef} position={[0.5, 0.3, 0]} rotation={[0, 0, -0.3]} castShadow>
        <capsuleGeometry args={[0.1, 0.5, 4, 8]} />
        <meshStandardMaterial color={c.jersey} />
      </mesh>

      {/* Shorts */}
      <mesh position={[0, -0.4, 0]} castShadow>
        <cylinderGeometry args={[0.32, 0.28, 0.4, 8]} />
        <meshStandardMaterial color={c.shorts} />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.15, -0.85, 0]} castShadow>
        <capsuleGeometry args={[0.1, 0.5, 4, 8]} />
        <meshStandardMaterial color={c.skin} />
      </mesh>
      <mesh position={[0.15, -0.85, 0]} castShadow>
        <capsuleGeometry args={[0.1, 0.5, 4, 8]} />
        <meshStandardMaterial color={c.skin} />
      </mesh>

      {/* Jersey Number */}
      {/* Dibu wears #7 (Dibu), Neuer #1 */}
    </group>
  );
}
