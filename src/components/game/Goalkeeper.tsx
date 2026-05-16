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
  const [targetX, setTargetX] = useState(0);

  // Load realistic model
  const { scene, animations } = useGLTF('/models/goalkeeper.glb');
  const { actions } = useAnimations(animations, bodyRef);

  useEffect(() => {
    if (actions) {
      console.log('⚽ Animaciones del Dibu:', Object.keys(actions));
    }
  }, [actions]);

  // Apply Professional "Magic"
  useEffect(() => {
    if (scene) {
      scene.traverse((obj) => {
        if (obj.isMesh) {
          obj.castShadow = true;
          obj.receiveShadow = true;
          if (obj.material) {
            obj.material.metalness = 0.5;
            obj.material.roughness = 0.4;
          }
        }
      });
    }
  }, [scene]);

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
      const { direction } = e.detail;
      const x = direction === 'left' ? -2.8 : direction === 'right' ? 2.8 : 0;
      setTargetX(x);
      setGkState('diving');
      setTimeout(() => {
        setGkState('idle');
        setTargetX(0);
      }, 2500);
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
    if (!rigidbody.current || !bodyRef.current) return;
    const t = state.clock.getElapsedTime();
    const body = bodyRef.current;

    // Current world position
    const currentPos = rigidbody.current.translation();
    
    // Calculate next position
    let nextX = currentPos.x;
    
    if (gkState === 'diving') {
      nextX = THREE.MathUtils.lerp(currentPos.x, targetX, 0.15);
    } else {
      nextX = THREE.MathUtils.lerp(currentPos.x, 0, 0.1);
      
      // Idle sway
      body.position.x = Math.sin(t * 1.5) * 0.2;
      body.position.y = Math.sin(t * 2) * 0.05;
    }

    rigidbody.current.setNextKinematicTranslation({
      x: nextX,
      y: 1, // Fixed height
      z: -4.8 // Goal line
    });
  });

  return (
    <RigidBody
      ref={rigidbody}
      type="kinematicPosition"
      colliders={false}
      onIntersectionEnter={() => onSave?.()}
    >
      <group ref={bodyRef}>
        {scene ? (
          <primitive object={scene} scale={1.8} position={[0, -1, 0]} />
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

