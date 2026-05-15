'use client';

// @ts-nocheck
import { useEffect, useRef, useState, useCallback } from 'react';
import { X } from 'lucide-react';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import { useGameEngine, Direction } from '@/hooks/useGameEngine';
import { useGameStore } from '@/lib/store';

interface Point { x: number; y: number; time: number; width: number }

export default function CameraTracker() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  
  const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);
  const [isDebug, setIsDebug] = useState(false);
  const [camStatus, setCamStatus] = useState<'DISCONNECTED' | 'SEARCHING' | 'LOADING_AI' | 'CONNECTED'>('SEARCHING');

  const { shoot } = useGameEngine();
  const { gameState } = useGameStore();
  const isPlayingRef = useRef(gameState === 'PLAYING');

  // Track ball history for velocity/trajectory calculation
  const ballHistory = useRef<Point[]>([]);
  const cooldownRef = useRef(false);

  useEffect(() => {
    isPlayingRef.current = gameState === 'PLAYING';
    if (gameState === 'PLAYING') cooldownRef.current = false;
  }, [gameState]);

  // Load Model
  useEffect(() => {
    async function loadModel() {
      setCamStatus('LOADING_AI');
      await tf.ready();
      const loadedModel = await cocoSsd.load({ base: 'lite_mobilenet_v2' });
      setModel(loadedModel);
      console.log('COCO-SSD Model loaded');
    }
    loadModel();
  }, []);

  // Setup Camera
  useEffect(() => {
    async function setupCamera() {
      if (!model) return;
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
  }, [model]);

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
  const processFrame = useCallback(async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !model || camStatus !== 'CONNECTED') {
      requestRef.current = requestAnimationFrame(processFrame);
      return;
    }

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, 640, 480);

        // Detect objects
        const predictions = await model.detect(video);
        
        // Allow sports ball or common misclassifications for colorful beach balls (like frisbee) with low confidence
        const validClasses = ['sports ball', 'frisbee', 'apple', 'orange', 'backpack'];
        const ball = predictions.find(p => validClasses.includes(p.class) && p.score > 0.15);

        if (isDebug) {
          // Draw zones
          ctx.strokeStyle = 'rgba(0, 242, 255, 0.5)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(213, 0); ctx.lineTo(213, 480);
          ctx.moveTo(426, 0); ctx.lineTo(426, 480);
          ctx.stroke();

          // Draw predictions
          predictions.forEach(p => {
            const isBall = validClasses.includes(p.class);
            ctx.strokeStyle = isBall ? '#00ff00' : '#ff0000';
            ctx.lineWidth = 4;
            ctx.strokeRect(p.bbox[0], p.bbox[1], p.bbox[2], p.bbox[3]);
            ctx.fillStyle = isBall ? '#00ff00' : '#ff0000';
            ctx.font = '16px monospace';
            ctx.fillText(`${p.class} (${Math.round(p.score * 100)}%)`, p.bbox[0], p.bbox[1] > 20 ? p.bbox[1] - 5 : 20);
          });
        }

        const now = performance.now();

        if (ball) {
          const centerX = ball.bbox[0] + ball.bbox[2] / 2;
          const centerY = ball.bbox[1] + ball.bbox[3] / 2;
          
          ballHistory.current.push({ x: centerX, y: centerY, time: now, width: ball.bbox[2] });
          if (ballHistory.current.length > 10) ballHistory.current.shift();

          // Calculate velocity and trajectory if we have history
          if (ballHistory.current.length > 2 && isPlayingRef.current && !cooldownRef.current) {
            const oldest = ballHistory.current[0];
            const newest = ballHistory.current[ballHistory.current.length - 1];
            
            const timeDiff = newest.time - oldest.time;
            const sizeDiff = oldest.width - newest.width; // Positive means ball is getting smaller (moving away)
            const speedY = (newest.y - oldest.y) / timeDiff;

            // Trigger condition: Ball is moving away fast AND moving upwards (in camera view) or significantly shrinking
            if (sizeDiff > 10 || Math.abs(speedY) > 0.5) {
              
              let dir: Direction = 'center';
              if (newest.x < 213) dir = 'right'; // Camera is usually mirrored
              else if (newest.x > 426) dir = 'left';
              else dir = 'center';

              const height = newest.y < 240 ? 'high' : 'low';

              // Fire shot
              const impulseMap: Record<Direction, { dx: number; dy: number; dz: number; spin: number }> = {
                left:   { dx: -1.2, dy: height === 'high' ? 1.2 : 0.8, dz: -6, spin: -0.5 },
                center: { dx: 0,    dy: height === 'high' ? 1.5 : 1.0, dz: -7, spin: 0 },
                right:  { dx: 1.2,  dy: height === 'high' ? 1.2 : 0.8, dz: -6, spin: 0.5 },
              };
              
              window.dispatchEvent(new CustomEvent('ball-shoot', { detail: impulseMap[dir] }));
              shoot({ direction: dir, height });

              cooldownRef.current = true;
              ballHistory.current = [];
            }
          }
        } else {
          // Clear history if ball is lost for too long
          if (ballHistory.current.length > 0 && now - ballHistory.current[ballHistory.current.length-1].time > 500) {
            ballHistory.current = [];
          }
        }
      }
    }

    // Use requestAnimationFrame for smooth loop, but tf.detect is async so it limits FPS naturally
    requestRef.current = requestAnimationFrame(processFrame);
  }, [model, camStatus, isDebug, shoot]);

  useEffect(() => {
    if (camStatus === 'CONNECTED') {
      requestRef.current = requestAnimationFrame(processFrame);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [processFrame, camStatus]);

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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 border-4 border-[#00f2ff] bg-black/80 p-2 rounded-xl backdrop-blur-md">
          <div className="flex justify-between items-center mb-2 px-2">
            <p className="text-white font-bold tracking-widest text-sm uppercase">MODO IA: CALIBRACIÓN</p>
            <button 
              onClick={() => setIsDebug(false)}
              className="p-1 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
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
