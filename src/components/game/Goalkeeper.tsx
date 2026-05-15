// @ts-nocheck
'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useGameStore } from '@/lib/store';
import * as THREE from 'three';

export type DiveDirection = 'left' | 'right' | 'center';

interface GoalkeeperProps {
  onSave?: () => void;
  onGoal?: () => void;
}

type GKState = 'idle' | 'taunt' | 'dive_left' | 'dive_right' | 'dive_center' | 'celebrate' | 'frustrated';

export default function Goalkeeper({ onSave, onGoal }: GoalkeeperProps) {
  const { selectedGoalkeeper, gameState } = useGameStore();
  const bodyRef = useRef<THREE.Group>(null);
  const rigidbody = useRef<any>(null);
  const [gkState, setGkState] = useState<GKState>('idle');

  // Colors per goalkeeper (fallback)
  const colors = {
    DIBU: { jersey: '#4CAF50', shorts: '#fff', skin: '#d4a076' },
    NEUER: { jersey: '#dc2626', shorts: '#000', skin: '#f0c090' },
  };
  const c = colors[selectedGoalkeeper];

  // Try to load realistic model
  /* 
  let goalkeeperModel;
  try {
    goalkeeperModel = useGLTF('/models/goalkeeper.glb');
  } catch (e) {
    goalkeeperModel = null;
  }
  const { scene, animations } = goalkeeperModel || { scene: null, animations: [] };
  */
  const scene = null;
  const animations = [];

  const { actions } = useAnimations(animations, bodyRef);

  useEffect(() => {
    if (!actions) return;
    if (gkState === 'idle') {
      actions.idle?.reset().fadeIn(0.5).play();
    } else if (gkState.startsWith('dive_')) {
      actions.idle?.fadeOut(0.2);
      const actionName = gkState;
      if (actions[actionName]) {
        actions[actionName].reset().setLoop(THREE.LoopOnce, 1).play();
        actions[actionName].clampWhenFinished = true;
      }
    }
  }, [gkState, actions]);

  useEffect(() => {
    const handleDive = (e: CustomEvent<{ direction: DiveDirection }>) => {
      const { direction } = e.detail;
      const stateMap: Record<DiveDirection, GKState> = {
        left: 'dive_left',
        right: 'dive_right',
        center: 'dive_center',
      };
      setGkState(stateMap[direction]);
      setTimeout(() => setGkState('idle'), 2000);
    };
    window.addEventListener('goalkeeper-dive', handleDive as EventListener);
    return () => window.removeEventListener('goalkeeper-dive', handleDive as EventListener);
  }, []);

  useFrame((state) => {
    if (!bodyRef.current) return;
    const t = state.clock.getElapsedTime();
    const body = bodyRef.current;

    // Movement logic for fallback mannequin
    if (!scene) {
      if (gkState === 'idle') {
        body.position.x = Math.sin(t * 1.8) * 0.7;
        body.position.y = 1 + Math.abs(Math.sin(t * 3.6)) * 0.05;
      } else if (gkState === 'dive_left') {
        body.position.x = THREE.MathUtils.lerp(body.position.x, -2.5, 0.18);
        body.rotation.z = THREE.MathUtils.lerp(body.rotation.z, Math.PI / 2.2, 0.15);
      } else if (gkState === 'dive_right') {
        body.position.x = THREE.MathUtils.lerp(body.position.x, 2.5, 0.18);
        body.rotation.z = THREE.MathUtils.lerp(body.rotation.z, -Math.PI / 2.2, 0.15);
      }
    }
  });

  const onContact = () => {
    if (onSave) onSave();
  };

  return (
    <RigidBody
      ref={rigidbody}
      type="kinematicPosition"
      colliders={false}
      onIntersectionEnter={onContact}
    >
      <group ref={bodyRef}>
        {scene ? (
          <primitive object={scene} scale={1.8} position={[0, -1, 0]} rotation={[0, Math.PI, 0]} />
        ) : (
          <mesh castShadow>
            <capsuleGeometry args={[0.4, 1.2, 4, 16]} />
            <meshStandardMaterial color={c.jersey} metalness={0.8} roughness={0.2} />
          </mesh>
        )}
      </group>
      <CuboidCollider args={[0.6, 1.2, 0.6]} />
    </RigidBody>
  );
}

// try { useGLTF.preload('/models/goalkeeper.glb'); } catch (e) {}
