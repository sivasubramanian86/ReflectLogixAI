import React, { useEffect, useRef } from 'react';

interface VoiceVisualizer3DProps {
  isSpeaking: boolean;
  isListening: boolean;
  audioLevel?: number; // 0.0 to 1.0
  avatarSrc?: string;
  assistantName?: string;
}

interface Particle {
  x: number;
  y: number;
  z: number;
  size: number;
  color: string;
  speed: number;
  angle: number;
  orbitRadius: number;
}

export const VoiceVisualizer3D: React.FC<VoiceVisualizer3DProps> = ({
  isSpeaking,
  isListening,
  audioLevel = 0,
  avatarSrc = '/assets/avatar.jpg',
  assistantName = 'Nova'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth * window.devicePixelRatio || 400);
    let height = (canvas.height = canvas.offsetHeight * window.devicePixelRatio || 400);

    const particles: Particle[] = [];
    const numParticles = 65;
    const colors = ['#06b6d4', '#a855f7', '#ec4899', '#38bdf8', '#818cf8', '#f472b6'];

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: 0,
        y: 0,
        z: (Math.random() - 0.5) * 200,
        size: Math.random() * 2.8 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: (Math.random() * 0.015 + 0.008) * (Math.random() > 0.5 ? 1 : -1),
        angle: Math.random() * Math.PI * 2,
        orbitRadius: Math.random() * 85 + 115
      });
    }

    let globalRotation = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const dynamicBoost = isSpeaking ? (audioLevel * 30 + 12) : isListening ? 8 : 2;

      globalRotation += isSpeaking ? 0.02 : 0.006;

      // Draw Orbiting 3D Particle Field
      particles.forEach((p, idx) => {
        p.angle += p.speed;
        const currentRadius = p.orbitRadius + Math.sin(globalRotation * 2 + idx) * dynamicBoost;
        const x3d = Math.cos(p.angle) * currentRadius;
        const z3d = Math.sin(p.angle) * currentRadius + p.z;
        const y3d = Math.sin(p.angle * 2 + globalRotation) * 25;

        // 3D perspective projection
        const fov = 300;
        const scale = fov / (fov + z3d);
        const projX = centerX + x3d * scale;
        const projY = centerY + y3d * scale;
        const projSize = Math.max(0.5, p.size * scale);

        ctx.beginPath();
        ctx.arc(projX, projY, projSize, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = isSpeaking ? 14 : isListening ? 8 : 4;
        ctx.globalAlpha = Math.max(0.25, Math.min(0.95, scale));
        ctx.fill();

        // Connect nearby particles with luminous data lines
        if (idx % 4 === 0) {
          ctx.beginPath();
          ctx.moveTo(projX, projY);
          ctx.lineTo(centerX + (Math.random() - 0.5) * 60, centerY + (Math.random() - 0.5) * 60);
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 0.4;
          ctx.globalAlpha = isSpeaking ? 0.25 : 0.08;
          ctx.stroke();
        }
      });

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth * window.devicePixelRatio || 400;
      height = canvas.height = canvas.offsetHeight * window.devicePixelRatio || 400;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isSpeaking, isListening, audioLevel]);

  return (
    <div className="relative flex flex-col items-center justify-center w-full select-none py-2">
      {/* 3D Hologram Stage & Aura */}
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
        {/* Luminous Pulsing Glow Rings */}
        <div
          className={`absolute inset-0 rounded-full transition-all duration-700 pointer-events-none ${
            isSpeaking
              ? 'bg-gradient-to-tr from-cyan-500/30 via-purple-500/30 to-pink-500/30 blur-2xl scale-110 animate-pulse'
              : isListening
              ? 'bg-gradient-to-tr from-emerald-500/25 via-cyan-500/25 to-blue-500/25 blur-xl scale-105'
              : 'bg-gradient-to-tr from-purple-500/15 via-indigo-500/15 to-cyan-500/15 blur-lg scale-95'
          }`}
        />

        {/* 3D Particle Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
        />

        {/* Central 3D Holographic Avatar Frame */}
        <div
          className={`relative z-20 w-40 h-40 sm:w-44 sm:h-44 rounded-full p-[3px] transition-all duration-500 shadow-2xl ${
            isSpeaking
              ? 'ring-4 ring-cyan-400/80 shadow-[0_0_40px_rgba(6,182,212,0.6)] scale-105'
              : isListening
              ? 'ring-4 ring-emerald-400/80 shadow-[0_0_35px_rgba(16,185,129,0.5)] scale-102'
              : 'ring-2 ring-purple-400/40 shadow-[0_0_25px_rgba(168,85,247,0.3)]'
          } bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500`}
        >
          <img
            src={avatarSrc}
            alt={`${assistantName} Virtual Assistant`}
            className="w-full h-full object-cover rounded-full filter contrast-105 brightness-105"
          />

          {/* Holographic Scanline Overlay */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent pointer-events-none animate-pulse" />

          {/* Active Voice Wave Pill Badge */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-semibold tracking-wider flex items-center gap-1.5 shadow-lg backdrop-blur-md border border-white/20 z-30 bg-slate-900/90 text-white">
            <span
              className={`w-2 h-2 rounded-full ${
                isSpeaking
                  ? 'bg-cyan-400 animate-ping'
                  : isListening
                  ? 'bg-emerald-400 animate-pulse'
                  : 'bg-purple-400'
              }`}
            />
            <span>{isSpeaking ? 'Speaking' : isListening ? 'Listening...' : 'Ready'}</span>
          </div>
        </div>
      </div>

      {/* Assistant Identity & Subtitle */}
      <div className="mt-3 text-center z-20">
        <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-300 via-purple-200 to-pink-300 bg-clip-text text-transparent">
          {assistantName}
        </h3>
        <p className="text-xs text-slate-300 font-medium flex items-center justify-center gap-1.5 mt-0.5">
          <span>ReflectLogixAI Live Companion</span>
          <span className="w-1 h-1 rounded-full bg-cyan-400" />
          <span className="text-cyan-400 font-semibold">Gemini 3.7 Voice Mesh</span>
        </p>
      </div>
    </div>
  );
};
