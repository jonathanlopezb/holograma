'use client';

/**
 * useGameEngine — Core gameplay hook.
 * Handles: shoot trigger, random goalkeeper dive, goal/save detection, score update.
 */

import { useCallback, useRef } from 'react';
import { useGameStore } from '@/lib/store';

export type Direction = 'left' | 'right' | 'center';
export type Height = 'low' | 'mid' | 'high';

interface ShotParams {
  direction: Direction;
  height: Height;
}

export function useGameEngine() {
  const {
    gameState, setGameState,
    currentPlayerIndex,
    players, addGoal, addAttempt,
    maxAttempts,
  } = useGameStore();

  const lastShotResult = useRef<'goal' | 'save' | null>(null);

  const shoot = useCallback(({ direction, height }: ShotParams) => {
    if (gameState !== 'PLAYING') return;

    // --- Goalkeeper random decision ---
    // 65% chance he dives the wrong way or stays center (goal), 35% correct save
    const directions: Direction[] = ['left', 'right', 'center'];
    const gkChoice = directions[Math.floor(Math.random() * directions.length)];

    // Dispatch dive event to Goalkeeper component
    window.dispatchEvent(new CustomEvent('goalkeeper-dive', {
      detail: { direction: gkChoice }
    }));

    // Goal if GK goes the wrong way; save if same direction
    const isGoal = gkChoice !== direction;
    lastShotResult.current = isGoal ? 'goal' : 'save';

    if (isGoal) {
      addGoal(currentPlayerIndex);
      setGameState('GOAL');
      window.dispatchEvent(new CustomEvent('gk-state', { detail: { state: 'frustrated' } }));
    } else {
      setGameState('SAVE');
      window.dispatchEvent(new CustomEvent('gk-state', { detail: { state: 'celebrate' } }));
    }

    addAttempt(currentPlayerIndex);

    // Auto-advance after 2.5 seconds
    setTimeout(() => {
      const p = useGameStore.getState().players[currentPlayerIndex];
      if (p && p.attempts >= useGameStore.getState().maxAttempts) {
        setGameState('TOURNAMENT_RESULTS');
      } else {
        setGameState('PLAYING');
      }
    }, 2500);
  }, [gameState, currentPlayerIndex, addGoal, addAttempt, setGameState]);

  return { shoot };
}
