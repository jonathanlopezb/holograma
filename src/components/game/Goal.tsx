'use client';

import { RigidBody, CuboidCollider, IntersectionEnterPayload } from '@react-three/rapier';
import { useGameStore } from '@/lib/store';
import * as THREE from 'three';

export default function Goal() {
  const { gameState, setGameState, addGoal, addAttempt, currentPlayerIndex, players, maxAttempts } = useGameStore();

  const handleGoalSensor = (payload: IntersectionEnterPayload) => {
    const name = payload.other.rigidBodyObject?.name;
    if (name === 'ball' && gameState === 'PLAYING') {
      // Detected by game engine via ShootControls, goal sensor here is a backup
    }
  };

  const postMaterial = <meshStandardMaterial color="white" roughness={0.3} metalness={0.6} />;

  return (
    <group position={[0, 0, -5]}>
      {/* ── Goal Structure (static rigid body) ── */}
      <RigidBody type="fixed" colliders={false}>
        {/* Left Post */}
        <mesh position={[-3.66, 1.22, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 2.44, 12]} />
          {postMaterial}
        </mesh>
        <CuboidCollider args={[0.06, 1.22, 0.06]} position={[-3.66, 1.22, 0]} />

        {/* Right Post */}
        <mesh position={[3.66, 1.22, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 2.44, 12]} />
          {postMaterial}
        </mesh>
        <CuboidCollider args={[0.06, 1.22, 0.06]} position={[3.66, 1.22, 0]} />

        {/* Crossbar */}
        <mesh position={[0, 2.44, 0]} castShadow rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.06, 0.06, 7.42, 12]} />
          {postMaterial}
        </mesh>
        <CuboidCollider args={[3.71, 0.06, 0.06]} position={[0, 2.44, 0]} />

        {/* Back Net Visual */}
        <mesh position={[0, 1.22, -0.6]}>
          <boxGeometry args={[7.32, 2.44, 1.2]} />
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={0.08}
            wireframe
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Back wall collider */}
        <CuboidCollider args={[3.66, 1.22, 0.05]} position={[0, 1.22, -1.2]} />
      </RigidBody>

      {/* ── Goal area sensor ── */}
      <CuboidCollider
        args={[3.6, 1.2, 0.4]}
        position={[0, 1.2, -0.1]}
        sensor
        onIntersectionEnter={handleGoalSensor}
      />
    </group>
  );
}
