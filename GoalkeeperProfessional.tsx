/**
 * 🎬 COMPONENTE ARQUERO PROFESIONAL SKETCHFAB
 * 
 * Características:
 * - Usa modelo con rigging y animaciones reales
 * - Detección automática de animaciones
 * - Reacción inteligente a balón
 * - Sistema de dificultad
 * - Eventos y callbacks
 * - Compatible con Penalty Transelo
 * 
 * Uso:
 * <GoalkeeperProfessional 
 *   position={[0, 0, 5]}
 *   ballPosition={ballPos}
 *   difficulty="medium"
 * />
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

interface GoalkeeperProfessionalProps {
  // Posición en el mundo 3D
  position?: [number, number, number];
  
  // Escala del modelo
  scale?: number;
  
  // Dificultad (afecta probabilidad de atajada)
  difficulty?: 'easy' | 'medium' | 'hard';
  
  // Detección de balón
  ballPosition?: [number, number, number] | { x: number; y: number; z: number };
  
  // Reacción automática
  autoReact?: boolean;
  
  // Callbacks
  onSave?: () => void;
  onGoal?: () => void;
  onAnimationStart?: (name: string) => void;
  onAnimationEnd?: (name: string) => void;
}

type AnimationState = 'idle' | 'diving' | 'celebrating' | 'defeated';

export const GoalkeeperProfessional: React.FC<GoalkeeperProfessionalProps> = ({
  position = [0, 0, 5],
  scale = 1,
  difficulty = 'medium',
  ballPosition,
  autoReact = true,
  onSave,
  onGoal,
  onAnimationStart,
  onAnimationEnd,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [animationState, setAnimationState] = useState<AnimationState>('idle');
  const [isAnimating, setIsAnimating] = useState(false);
  const [availableAnimations, setAvailableAnimations] = useState<string[]>([]);
  const animationTimer = useRef<NodeJS.Timeout>();

  // Cargar modelo GLB con animaciones embebidas
  const { scene, animations } = useGLTF('/models/goalkeeper_stylized.glb');
  const clonedScene = scene.clone();

  // Sistema de animaciones de Three.js
  const { actions } = useAnimations(animations, clonedScene);

  /**
   * Detectar y listar animaciones disponibles
   */
  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      const animNames = Object.keys(actions);
      setAvailableAnimations(animNames);
      
      console.log('🎬 Animaciones disponibles en el modelo:');
      animNames.forEach((anim, i) => {
        console.log(`   [${i}] ${anim}`);
      });

      // Iniciar en idle
      if (actions['idle']) {
        actions['idle'].play();
      } else if (animNames.length > 0) {
        // Si no hay "idle", tocar la primera
        actions[animNames[0]]?.play();
      }
    }

    return () => {
      // Cleanup
      Object.values(actions || {}).forEach(action => action?.stop());
    };
  }, [actions]);

  /**
   * Reproducir animación específica
   */
  const playAnimation = useCallback(
    (animName: string, duration?: number) => {
      if (!actions || !actions[animName]) {
        console.warn(`⚠️ Animación no encontrada: ${animName}`);
        return;
      }

      // Detener todas las animaciones
      Object.values(actions).forEach(action => action?.stop());

      // Reproducir la nueva
      const action = actions[animName];
      action.clampWhenFinished = true;
      action.reset();
      action.play();

      onAnimationStart?.(animName);
      setIsAnimating(true);

      // Callback cuando termine (si especificamos duración)
      if (duration) {
        if (animationTimer.current) clearTimeout(animationTimer.current);
        animationTimer.current = setTimeout(() => {
          setIsAnimating(false);
          onAnimationEnd?.(animName);
          
          // Volver a idle
          if (actions['idle']) {
            actions['idle'].reset();
            actions['idle'].play();
          }
        }, duration);
      }
    },
    [actions, onAnimationStart, onAnimationEnd]
  );

  /**
   * Saltar en dirección específica
   */
  const dive = useCallback(
    (direction: 'left' | 'right') => {
      if (isAnimating) return;

      // Intentar encontrar animación de salto
      const possibleNames = [
        `dive_${direction}`,
        `jump_${direction}`,
        `save_${direction}`,
        `move_${direction}`,
        `jump`,
        `dive`,
      ];

      let foundAnimation: string | null = null;
      for (const name of possibleNames) {
        if (actions[name]) {
          foundAnimation = name;
          break;
        }
      }

      if (foundAnimation) {
        console.log(`⚽ Saltando ${direction} con animación: ${foundAnimation}`);
        setAnimationState('diving');
        playAnimation(foundAnimation, 800);
      } else {
        console.warn(`⚠️ No hay animación de salto disponible`);
      }
    },
    [isAnimating, actions, playAnimation]
  );

  /**
   * Celebración
   */
  const celebrate = useCallback(() => {
    if (isAnimating) return;

    const celebrateAnims = [
      'celebrate',
      'cheer',
      'win',
      'happy',
      'victory',
    ];

    let foundAnimation: string | null = null;
    for (const name of celebrateAnims) {
      if (actions[name]) {
        foundAnimation = name;
        break;
      }
    }

    if (foundAnimation) {
      console.log(`🎉 Celebrando con: ${foundAnimation}`);
      setAnimationState('celebrating');
      playAnimation(foundAnimation, 1000);
    } else {
      console.warn(`⚠️ No hay animación de celebración`);
    }
  }, [isAnimating, actions, playAnimation]);

  /**
   * Reacción a gol
   */
  const reactToGoal = useCallback(() => {
    if (isAnimating) return;

    const goalAnims = ['goal', 'sad', 'lose', 'miss', 'disappointed'];

    let foundAnimation: string | null = null;
    for (const name of goalAnims) {
      if (actions[name]) {
        foundAnimation = name;
        break;
      }
    }

    if (foundAnimation) {
      console.log(`😢 Reacción a gol: ${foundAnimation}`);
      setAnimationState('defeated');
      playAnimation(foundAnimation, 1200);
    } else {
      console.warn(`⚠️ No hay animación de gol`);
    }
  }, [isAnimating, actions, playAnimation]);

  /**
   * Detectar balón y reaccionar automáticamente
   */
  useEffect(() => {
    if (!autoReact || !ballPosition || isAnimating) return;

    // Extraer posición X del balón
    const ballX = Array.isArray(ballPosition) 
      ? ballPosition[0] 
      : ballPosition.x;

    // Configuración de dificultad
    const difficultyConfig = {
      easy: 0.7,    // 70% de probabilidad de atajar
      medium: 0.5,  // 50%
      hard: 0.3,    // 30%
    };

    const saveProbability = difficultyConfig[difficulty];
    const shouldSave = Math.random() < saveProbability;

    if (shouldSave) {
      // Decidir dirección de salto
      const direction = ballX < 0 ? 'left' : 'right';
      dive(direction);

      // Celebrar después del salto
      setTimeout(() => {
        celebrate();
        onSave?.();
      }, 850);
    } else {
      // Gol - reacción negativa
      reactToGoal();
      onGoal?.();
    }
  }, [ballPosition, autoReact, difficulty, isAnimating, dive, celebrate, reactToGoal, onSave, onGoal]);

  /**
   * Respiración sutil en idle
   */
  useFrame((state) => {
    if (groupRef.current && animationState === 'idle' && !isAnimating) {
      const time = state.clock.getElapsedTime();
      groupRef.current.position.y = position[1] + Math.sin(time * 1.5) * 0.03;
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      scale={scale}
      userData={{
        type: 'goalkeeper',
        state: animationState,
        isAnimating,
      }}
    >
      {/* Modelo 3D */}
      <primitive object={clonedScene} />

      {/* Debug: Mostrar información en desarrollo */}
      {process.env.NODE_ENV === 'development' && (
        <mesh position={[0, 2.2, 0]} visible={false}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshBasicMaterial color="#00ff00" wireframe />
        </mesh>
      )}
    </group>
  );
};

/**
 * Hook para control manual del arquero
 */
export const useGoalkeeperControl = (
  ref: React.RefObject<THREE.Group>
) => {
  const [isAnimating, setIsAnimating] = useState(false);

  return {
    isAnimating,
    reset: () => {
      if (ref.current) {
        ref.current.position.set(0, 0, 0);
        ref.current.rotation.set(0, 0, 0);
      }
    },
  };
};

// Precargar el modelo para mejor rendimiento
useGLTF.preload('/models/goalkeeper_stylized.glb');

export default GoalkeeperProfessional;
