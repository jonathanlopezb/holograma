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
    gameMode,
    currentPlayerIndex, setCurrentPlayerIndex,
    players, addGoal, addAttempt, addGoalkeeperSave,
    maxAttempts,
    strikerScore, goalkeeperScore
  } = useGameStore();

  const lastShotResult = useRef<'goal' | 'save' | null>(null);

  const shoot = useCallback(({ direction, height }: ShotParams) => {
    if (gameState !== 'PLAYING') return;

    // --- Goalkeeper random decision ---
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
      addGoalkeeperSave();
      setGameState('SAVE');
      window.dispatchEvent(new CustomEvent('gk-state', { detail: { state: 'celebrate' } }));
    }

    addAttempt(currentPlayerIndex);

    // Auto-advance after 2.5 seconds
    setTimeout(() => {
      const state = useGameStore.getState();
      
      if (state.gameMode === 'INDIVIDUAL') {
        const totalAttempts = state.strikerScore + state.goalkeeperScore;
        if (totalAttempts >= 3) {
          setGameState('TOURNAMENT_RESULTS');
        } else {
          setGameState('PLAYING');
        }
      } else {
        // Team mode logic: Each player has exactly 1 attempt
        const totalPlayers = state.players.length;
        const nextPlayerIndex = state.currentPlayerIndex + 1;
        
        // If the current player was the last one, end tournament
        if (nextPlayerIndex >= totalPlayers) {
          setGameState('TOURNAMENT_RESULTS');
        } else {
          setCurrentPlayerIndex(nextPlayerIndex);
          setGameState('PLAYING');
        }
      }

    }, 2500);
  }, [gameState, gameMode, currentPlayerIndex, addGoal, addAttempt, addGoalkeeperSave, setGameState, setCurrentPlayerIndex]);


  return { shoot };
}
