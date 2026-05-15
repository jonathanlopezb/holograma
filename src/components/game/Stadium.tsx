// @ts-nocheck
'use client';

export default function Stadium() {
  return (
    <group>
      {/* Pitch Markings (Simple lines) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      
      {/* Penalty Spot */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 5]}>
        <circleGeometry args={[0.1, 32]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {/* Stands (Stylized boxes) */}
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

      {/* Floodlights (Glowing boxes) */}
      <mesh position={[-20, 20, -15]}>
        <boxGeometry args={[2, 2, 0.5]} />
        <meshStandardMaterial color="#00f2ff" emissive="#00f2ff" emissiveIntensity={5} />
      </mesh>
      <mesh position={[20, 20, -15]}>
        <boxGeometry args={[2, 2, 0.5]} />
        <meshStandardMaterial color="#00f2ff" emissive="#00f2ff" emissiveIntensity={5} />
      </mesh>
    </group>
  );
}
