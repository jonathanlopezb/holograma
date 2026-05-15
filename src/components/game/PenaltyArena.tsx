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
    <div className="w-full h-screen bg-[#020202]">
      <Canvas
        shadows
        gl={{ antialias: false, alpha: false, stencil: false, depth: true }}
        dpr={[1, 1.5]}
      >
        <color attach="background" args={['#020202']} />
        <fog attach="fog" args={['#020202', 15, 35]} />

        <Suspense fallback={<Loader />}>
          {/* Atmosphere & Space */}
          <Stars radius={100} depth={50} count={1500} factor={4} saturation={0} fade speed={1} />
          <Environment preset="night" />

          {/* Cinematic Lighting */}
          <ambientLight intensity={0.4} />
          
          {/* Main Stadium Lights */}
          <spotLight
            position={[-20, 20, 10]}
            angle={0.15}
            penumbra={1}
            intensity={1.5}
            castShadow
            shadow-mapSize={[1024, 1024]}
            color="#fff"
          />
          <spotLight
            position={[20, 20, 10]}
            angle={0.15}
            penumbra={1}
            intensity={1.5}
            castShadow
            shadow-mapSize={[1024, 1024]}
            color="#fff"
          />
          
          {/* Accent Neon Lights */}
          <pointLight position={[0, 5, -5]} intensity={1} color="#00f2ff" distance={15} />
          <pointLight position={[-5, 2, 8]} intensity={0.5} color="#ff00f2" distance={10} />
          <pointLight position={[5, 2, 8]} intensity={0.5} color="#00f2ff" distance={10} />

          <Physics
            gravity={[0, -9.81, 0]}
            debug={false}
          >
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

          {/* Minimal Post-Processing for stability */}
          <EffectComposer multisampling={0}>
            <Bloom 
              intensity={0.5} 
              luminanceThreshold={0.8} 
              mipmapBlur
            />
            <Vignette offset={0.3} darkness={0.8} />
          </EffectComposer>

          {/* Dynamic Camera */}
          <PerspectiveCamera 
            makeDefault 
            position={[0, 2.5, 12]} 
            fov={40} 
          />
        </Suspense>

      </Canvas>
    </div>
  );
}

