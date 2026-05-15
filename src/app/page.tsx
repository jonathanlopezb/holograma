'use client';

import dynamic from 'next/dynamic';
import { useGameStore } from '@/lib/store';
import Registration from '@/components/ui/Registration';
import HUD from '@/components/ui/HUD';
import GoalOverlay from '@/components/ui/GoalOverlay';
import TournamentResults from '@/components/ui/TournamentResults';

// 3D canvas must be client-only — no SSR
const PenaltyArena = dynamic(() => import('@/components/game/PenaltyArena'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen bg-[#050505] flex flex-col items-center justify-center gap-4">
      <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      <p className="text-accent font-black tracking-[0.3em] uppercase text-sm">
        Iniciando estadio...
      </p>
    </div>
  ),
});

const CameraTracker = dynamic(() => import('@/components/tracking/CameraTracker'), {
  ssr: false,
});

export default function Home() {
  const { gameState } = useGameStore();

  return (
    <main className="relative w-full h-screen overflow-hidden bg-[#050505]">
      {/* 3D Scene — always mounted */}
      <PenaltyArena />

      {/* Hidden Client-Side Camera Tracker */}
      <CameraTracker />

      {/* HUD overlay — score, branding, status */}
      <HUD />

      {/* Cinematic goal / save overlay */}
      <GoalOverlay />

      {/* Registration modal (shown on START state) */}
      {(gameState === 'START' || gameState === 'REGISTRATION') && <Registration />}

      {/* Tournament results */}
      <TournamentResults />
    </main>
  );
}
