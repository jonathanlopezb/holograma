'use client';

import { useEffect, useRef, useState } from 'react';
import { useGameEngine, Direction } from '@/hooks/useGameEngine';
import { useGameStore } from '@/lib/store';

// Helper to calculate pixel difference
function getDifference(data1: Uint8ClampedArray, data2: Uint8ClampedArray) {
  let diffCount = 0;
  let sumX = 0;
  let sumY = 0;

  // We check every 4th pixel (step=16 bytes: 4 rgba pixels) for performance
  for (let i = 0; i < data1.length; i += 16) {
    const r1 = data1[i];
    const g1 = data1[i + 1];
    const b1 = data1[i + 2];

    const r2 = data2[i];
    const g2 = data2[i + 1];
    const b2 = data2[i + 2];

    const diff = Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2);

    // Threshold for considering a pixel "changed"
    if (diff > 100) {
      diffCount++;
      // Calculate coordinates based on index (assuming 640x480 resolution)
      const pixelIndex = i / 4;
      sumX += pixelIndex % 640;
      sumY += Math.floor(pixelIndex / 640);
    }
  }

  return {
    diffCount,
    centroidX: diffCount > 0 ? sumX / diffCount : 0,
    centroidY: diffCount > 0 ? sumY / diffCount : 0,
  };
}

export default function CameraTracker() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previousFrameRef = useRef<Uint8ClampedArray | null>(null);
  const requestRef = useRef<number>();

  const [isDebug, setIsDebug] = useState(false);
  const [camStatus, setCamStatus] = useState<'DISCONNECTED' | 'SEARCHING' | 'CONNECTED'>('SEARCHING');

  const { shoot } = useGameEngine();
  const { gameState } = useGameStore();
  const isPlayingRef = useRef(gameState === 'PLAYING');

  // Keep ref in sync for the animation loop
  useEffect(() => {
    isPlayingRef.current = gameState === 'PLAYING';
  }, [gameState]);

  // Setup Camera
  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: 'environment' }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setCamStatus('CONNECTED');
        }
      } catch (err) {
        console.error("Camera access denied or unavailable", err);
        setCamStatus('DISCONNECTED');
      }
    }
    setupCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  // Debug toggle
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'c') {
        setIsDebug(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Dispatch connection status to window so HUD can read it
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('camera-status', { detail: { status: camStatus } }));
  }, [camStatus]);

  // Main Tracking Loop
  useEffect(() => {
    if (camStatus !== 'CONNECTED') return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const processFrame = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        ctx.drawImage(video, 0, 0, 640, 480);
        const frameData = ctx.getImageData(0, 0, 640, 480);
        const currentPixels = frameData.data;

        if (previousFrameRef.current) {
          const { diffCount, centroidX, centroidY } = getDifference(currentPixels, previousFrameRef.current);

          // Render debug info
          if (isDebug) {
            ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
            ctx.fillRect(centroidX - 10, centroidY - 10, 20, 20);
            ctx.fillStyle = 'lime';
            ctx.font = '20px monospace';
            ctx.fillText(`Diff: ${diffCount}`, 10, 30);
            
            // Draw zone lines
            ctx.strokeStyle = 'rgba(0, 242, 255, 0.5)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(213, 0); ctx.lineTo(213, 480);
            ctx.moveTo(426, 0); ctx.lineTo(426, 480);
            ctx.stroke();
          }

          // Trigger logic
          // A sudden spike in diffCount means something fast (like a ball) crossed the view
          // Threshold depends on environment, ~1000 pixels is a good starting point for a fast ball
          if (diffCount > 1500 && isPlayingRef.current) {
            let dir: Direction = 'center';
            if (centroidX < 213) dir = 'right'; // Flipped horizontally
            else if (centroidX > 426) dir = 'left';
            else dir = 'center';

            const height = centroidY < 240 ? 'high' : 'low';

            // Fire shot visually and via engine
            const impulseMap: Record<Direction, { dx: number; dy: number; dz: number; spin: number }> = {
              left:   { dx: -1.2, dy: height === 'high' ? 1.2 : 0.8, dz: -6, spin: -0.5 },
              center: { dx: 0,    dy: height === 'high' ? 1.5 : 1.0, dz: -7, spin: 0 },
              right:  { dx: 1.2,  dy: height === 'high' ? 1.2 : 0.8, dz: -6, spin: 0.5 },
            };
            window.dispatchEvent(new CustomEvent('ball-shoot', { detail: impulseMap[dir] }));
            
            // Call engine
            shoot({ direction: dir, height });

            // Temporarily set isPlaying to false locally to avoid double-triggers
            isPlayingRef.current = false;
          }
        }

        // Store frame for next tick
        // Copying array to avoid reference mutation
        previousFrameRef.current = new Uint8ClampedArray(currentPixels);
      }

      requestRef.current = requestAnimationFrame(processFrame);
    };

    requestRef.current = requestAnimationFrame(processFrame);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [camStatus, isDebug, shoot]);

  return (
    <>
      <video
        ref={videoRef}
        width={640}
        height={480}
        playsInline
        muted
        style={{ display: 'none' }}
      />
      {isDebug && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 border-4 border-red-500 bg-black/50 p-2 rounded-xl">
          <p className="text-white text-center font-bold mb-2">MODO CALIBRACIÓN CÁMARA</p>
          <canvas
            ref={canvasRef}
            width={640}
            height={480}
            className="rounded-lg w-[320px] md:w-[640px]"
            style={{ transform: 'scaleX(-1)' }} // Mirror view for intuitive debugging
          />
        </div>
      )}
      {!isDebug && (
        <canvas ref={canvasRef} width={640} height={480} style={{ display: 'none' }} />
      )}
    </>
  );
}
