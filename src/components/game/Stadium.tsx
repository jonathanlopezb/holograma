// @ts-nocheck
'use client';

import { useGLTF } from '@react-three/drei';

export default function Stadium() {
  /* 
  let stadiumModel;
  try {
    stadiumModel = useGLTF('/models/stadium.glb');
  } catch (e) {
    stadiumModel = null;
  }
  const scene = stadiumModel?.scene;
  */
  const scene = null;


  return (
    <group>
      {scene ? (
        <primitive object={scene} scale={1} position={[0, -0.5, 0]} />
      ) : (
        /* Fallback Stadium */
        <>
          {/* Main Floor */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial 
              color="#020202" 
              roughness={0.1} 
              metalness={0.9} 
            />
          </mesh>

          {/* Neon Grid / Lines */}
          <gridHelper args={[100, 20, "#00f2ff", "#002222"]} position={[0, -0.49, 0]} rotation={[0, 0, 0]} />
          
          {/* Penalty Area Lines */}
          <mesh position={[0, -0.48, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[20, 10]} />
            <meshStandardMaterial color="#00f2ff" transparent opacity={0.1} />
          </mesh>

          {/* Stands / Walls */}
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

// try { useGLTF.preload('/models/stadium.glb'); } catch (e) {}
