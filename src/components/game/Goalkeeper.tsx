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

type GKState = 'idle' | 'diving' | 'celebrate' | 'frustrated';

export default function Goalkeeper({ onSave, onGoal }: GoalkeeperProps) {
  const { gameState } = useGameStore();
  const bodyRef = useRef<THREE.Group>(null);
  const rigidbody = useRef<any>(null);
  const [gkState, setGkState] = useState<GKState>('idle');

  // Load realistic model
  const goalkeeperModel = useGLTF('/models/goalkeeper.glb');
  const { scene, animations } = goalkeeperModel || { scene: null, animations: [] };
  const clonedScene = useRef(scene?.clone());

  useEffect(() => {
    if (scene) clonedScene.current = scene.clone();
  }, [scene]);

  const { actions } = useAnimations(animations, bodyRef);

  // Apply Professional "Magic" to the model materials and rigging
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.traverse((obj) => {
        if (obj.isMesh) {
          obj.castShadow = true;
          obj.receiveShadow = true;
          if (obj.material) {
            obj.material.metalness = 0.5;
            obj.material.roughness = 0.4;
            // Add emissive glow to specific parts if names match
            if (obj.material.name.toLowerCase().includes('glow') || obj.material.name.toLowerCase().includes('neon')) {
              obj.material.emissive = new THREE.Color('#00f2ff');
              obj.material.emissiveIntensity = 1;
            }
          }
        }
      });
    }
  }, [clonedScene.current]);

  /**
   * Animation Control Logic
   */
  useEffect(() => {
    if (!actions) return;
    
    // Stop all first
    Object.values(actions).forEach(a => a?.fadeOut(0.2));

    if (gkState === 'idle') {
      const idleAnim = actions.idle || actions.waiting || actions.reposo || Object.values(actions)[0];
      idleAnim?.reset().fadeIn(0.5).play();
    } else if (gkState === 'diving') {
      // Try to find a dive animation
      const diveAnim = actions.dive || actions.jump || actions.salto || actions.save;
      if (diveAnim) {
        diveAnim.reset().setLoop(THREE.LoopOnce, 1).play();
        diveAnim.clampWhenFinished = true;
      }
    } else if (gkState === 'celebrate') {
      const winAnim = actions.celebrate || actions.win || actions.happy;
      winAnim?.reset().fadeIn(0.2).play();
    } else if (gkState === 'frustrated') {
      const loseAnim = actions.frustrated || actions.sad || actions.lose;
      loseAnim?.reset().fadeIn(0.2).play();
    }
  }, [gkState, actions]);

  /**
   * Listen for game events
   */
  useEffect(() => {
    const handleDive = (e: CustomEvent<{ direction: DiveDirection }>) => {
      setGkState('diving');
      
      // Physical movement logic
      const { direction } = e.detail;
      const targetX = direction === 'left' ? -2.5 : direction === 'right' ? 2.5 : 0;
      
      // Auto-return to idle
      setTimeout(() => setGkState('idle'), 2500);
    };

    const handleGKState = (e: CustomEvent<{ state: GKState }>) => {
      setGkState(e.detail.state);
      setTimeout(() => setGkState('idle'), 3000);
    };

    window.addEventListener('goalkeeper-dive', handleDive as EventListener);
    window.addEventListener('gk-state', handleGKState as EventListener);
    return () => {
      window.removeEventListener('goalkeeper-dive', handleDive as EventListener);
      window.removeEventListener('gk-state', handleGKState as EventListener);
    };
  }, []);

  useFrame((state) => {
    if (!bodyRef.current) return;
    const t = state.clock.getElapsedTime();
    const body = bodyRef.current;

    if (gkState === 'idle') {
      // Professional "Mimica" - Breathing and sway
      body.position.x = Math.sin(t * 1.2) * 0.2;
      body.position.y = Math.sin(t * 2.5) * 0.02;
      body.rotation.y = Math.sin(t * 0.5) * 0.05;
    }
  });

  return (
    <RigidBody
      ref={rigidbody}
      type="kinematicPosition"
      position={[0, 1, -4.8]}
      colliders={false}
      onIntersectionEnter={() => onSave?.()}
    >
      <group ref={bodyRef}>
        {clonedScene.current ? (
          <primitive object={clonedScene.current} scale={1.8} position={[0, -1, 0]} rotation={[0, 0, 0]} />
        ) : (
          <mesh castShadow>
            <capsuleGeometry args={[0.4, 1.2, 4, 16]} />
            <meshStandardMaterial color="#00f2ff" metalness={0.8} roughness={0.2} emissive="#00f2ff" emissiveIntensity={0.5} />
          </mesh>
        )}
      </group>
      <CuboidCollider args={[0.8, 1.2, 0.8]} />
    </RigidBody>
  );
}

try { useGLTF.preload('/models/goalkeeper.glb'); } catch (e) {}

