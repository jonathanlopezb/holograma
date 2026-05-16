// @ts-nocheck
'use client';

import { Canvas } from '@react-three/fiber';
import { Sky, ContactShadows, Environment, Stars, Html, Float, PerspectiveCamera } from '@react-three/drei';
import { Suspense, useMemo } from 'react';
import { Physics } from '@react-three/rapier';
import { EffectComposer, Bloom, Vignette, Noise, ChromaticAberration, DepthOfField } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import Ball from './Ball';
import Goal from './Goal';
import Stadium from './Stadium';
import Goalkeeper from './Goalkeeper';
import ManualControls from './ManualControls';


function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(0,242,255,0.5)]" />
        <div className="text-accent font-black tracking-[0.5em] uppercase text-xs animate-pulse">
          Sincronizando Arena...
        </div>
      </div>
    </Html>
  );
}

export default function PenaltyArena() {
  return (
    <div className="w-full h-screen bg-[#050505]">
      <Canvas
        shadows
        camera={{ position: [0, 2.5, 12], fov: 40 }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#050505']} />
        <fog attach="fog" args={['#050505', 10, 40]} />

        <Suspense fallback={<Loader />}>
          {/* Atmosphere & Space */}
          <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
          <Environment preset="night" />

          {/* Stadium Lighting */}
          <ambientLight intensity={0.5} />
          
          <spotLight
            position={[-20, 25, 10]}
            angle={0.2}
            penumbra={1}
            intensity={1}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <spotLight
            position={[20, 25, 10]}
            angle={0.2}
            penumbra={1}
            intensity={1}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          
          <pointLight position={[0, 5, -5]} intensity={0.5} color="#00f2ff" />

          <Physics gravity={[0, -9.81, 0]}>
            <Stadium />
            <Ball />
            <Goal />
            <Goalkeeper />
          </Physics>

          <ContactShadows
            opacity={0.4}
            scale={30}
            blur={2}
            far={10}
            resolution={256}
            color="#000000"
          />

          <ManualControls />
        </Suspense>

      </Canvas>
    </div>
  );
}


