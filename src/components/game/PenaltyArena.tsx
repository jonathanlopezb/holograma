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
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <Environment preset="night" />

          {/* Cinematic Lighting */}
          <ambientLight intensity={0.2} />
          
          {/* Main Stadium Lights */}
          <spotLight
            position={[-20, 20, 10]}
            angle={0.15}
            penumbra={1}
            intensity={2}
            castShadow
            shadow-mapSize={[2048, 2048]}
            color="#fff"
          />
          <spotLight
            position={[20, 20, 10]}
            angle={0.15}
            penumbra={1}
            intensity={2}
            castShadow
            shadow-mapSize={[2048, 2048]}
            color="#fff"
          />
          
          {/* Accent Neon Lights */}
          <pointLight position={[0, 5, -5]} intensity={1.5} color="#00f2ff" distance={15} />
          <pointLight position={[-5, 2, 8]} intensity={0.8} color="#ff00f2" distance={10} />
          <pointLight position={[5, 2, 8]} intensity={0.8} color="#00f2ff" distance={10} />

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
            opacity={0.6}
            scale={30}
            blur={2.5}
            far={10}
            resolution={512}
            color="#000000"
          />

          {/* Post-Processing Effects for 'Gamer' Look */}
          <EffectComposer disableNormalPass>
            <Bloom 
              intensity={1.2} 
              luminanceThreshold={0.2} 
              luminanceSmoothing={0.9} 
              height={300} 
              mipmapBlur
            />
            <DepthOfField 
              focusDistance={0.012} 
              focalLength={0.02} 
              bokehScale={3} 
            />
            <ChromaticAberration 
              offset={[0.0005, 0.0005]} 
              blendFunction={BlendFunction.NORMAL} 
            />
            <Noise opacity={0.02} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
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

