// @ts-nocheck
'use client';

import { Canvas } from '@react-three/fiber';
import { Sky, ContactShadows, Environment, Stars, Html } from '@react-three/drei';
import { Suspense } from 'react';
import { Physics } from '@react-three/rapier';
import Ball from './Ball';
import Goal from './Goal';
import Stadium from './Stadium';
import Goalkeeper from './Goalkeeper';

function Loader() {
  return (
    <Html center>
      <div className="text-accent font-black tracking-widest uppercase text-sm animate-pulse">
        Cargando estadio...
      </div>
    </Html>
  );
}

export default function PenaltyArena() {
  return (
    <div className="w-full h-screen">
      <Canvas
        shadows
        camera={{ position: [0, 2, 10], fov: 45, near: 0.1, far: 500 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#050505']} />

        <Suspense fallback={<Loader />}>
          {/* Atmosphere */}
          <Stars radius={100} depth={60} count={3000} factor={4} saturation={0} fade speed={0.5} />
          <Environment preset="night" />

          {/* Lighting — stadium flood effect */}
          <ambientLight intensity={0.3} />
          <directionalLight
            position={[-15, 25, 5]}
            intensity={3}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-near={0.5}
            shadow-camera-far={80}
            shadow-camera-left={-20}
            shadow-camera-right={20}
            shadow-camera-top={20}
            shadow-camera-bottom={-20}
          />
          <directionalLight position={[15, 25, 5]} intensity={2} />
          <pointLight position={[0, 10, 0]} intensity={0.5} color="#00f2ff" />

          <Physics
            gravity={[0, -9.81, 0]}
            debug={false}
            timeStep="vary"
          >
            <Stadium />
            <Ball />
            <Goal />
            <Goalkeeper />
          </Physics>

          <ContactShadows
            opacity={0.5}
            scale={20}
            blur={2}
            far={10}
            resolution={256}
            color="#000000"
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
