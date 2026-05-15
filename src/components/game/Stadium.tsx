// @ts-nocheck
'use client';

import { useGLTF } from '@react-three/drei';

export default function Stadium() {
  let stadiumModel;
  try {
    stadiumModel = useGLTF('/models/stadium.glb');
  } catch (e) {
    stadiumModel = null;
  }
  const scene = stadiumModel?.scene;

  return (
    <group>
      {scene ? (
        <primitive object={scene} scale={1} position={[0, -0.5, 0]} />
      ) : (
        /* Fallback Stadium */
        <>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial color="#1a3c1a" roughness={0.8} />
          </mesh>
          <mesh position={[0, 10, -50]}>
            <boxGeometry args={[200, 40, 10]} />
            <meshStandardMaterial color="#050505" />
          </mesh>
          <mesh position={[-50, 10, 0]} rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[200, 40, 10]} />
            <meshStandardMaterial color="#050505" />
          </mesh>
          <mesh position={[50, 10, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <boxGeometry args={[200, 40, 10]} />
            <meshStandardMaterial color="#050505" />
          </mesh>
        </>
      )}
    </group>
  );
}

try { useGLTF.preload('/models/stadium.glb'); } catch (e) {}
