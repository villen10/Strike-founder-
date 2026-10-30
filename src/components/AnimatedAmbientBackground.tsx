import React from 'react';

interface AnimatedAmbientBackgroundProps {
  isLight?: boolean;
}

/**
 * AnimatedAmbientBackground
 * Dynamically illuminates and animates the soft light-blue ("halka blue")
 * and glowing white tones of the wallpaper background image.
 * Uses GPU-accelerated translate3d and blur filters with zero scroll jank.
 */
export const AnimatedAmbientBackground: React.FC<AnimatedAmbientBackgroundProps> = ({ isLight = true }) => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none"
    >
      {/* 1. Luminous Soft-White Breathing Glow (Upper & Center highlights) */}
      <div
        className="absolute -top-[10%] left-[15%] w-[45vw] h-[45vw] max-w-[650px] max-h-[650px] rounded-full animate-ambient-white"
        style={{
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.65) 0%, rgba(240, 249, 255, 0.45) 45%, rgba(255, 255, 255, 0) 75%)',
          filter: 'blur(70px)',
          mixBlendMode: 'soft-light',
          willChange: 'transform, opacity',
        }}
      />

      {/* 2. Soft Light-Blue / Sky-Blue Floating Ambient Orb (Bottom & Right) */}
      <div
        className="absolute bottom-[5%] right-[5%] w-[55vw] h-[55vw] max-w-[750px] max-h-[750px] rounded-full animate-ambient-blue"
        style={{
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.42) 0%, rgba(96, 165, 250, 0.28) 40%, rgba(147, 197, 253, 0.15) 60%, rgba(56, 189, 248, 0) 80%)',
          filter: 'blur(80px)',
          mixBlendMode: 'normal',
          willChange: 'transform, opacity',
        }}
      />

      {/* 3. Ice-Blue / Cyan Floating Sweep Orb (Left-Center to Middle) */}
      <div
        className="absolute top-[35%] -left-[10%] w-[40vw] h-[40vw] max-w-[550px] max-h-[550px] rounded-full animate-ambient-cyan"
        style={{
          background: 'radial-gradient(circle, rgba(125, 211, 252, 0.38) 0%, rgba(186, 230, 253, 0.25) 50%, rgba(224, 242, 254, 0) 75%)',
          filter: 'blur(75px)',
          mixBlendMode: 'normal',
          willChange: 'transform, opacity',
        }}
      />

      {/* 4. Second Gentle White & Azure Shimmer (Center-Bottom) */}
      <div
        className="absolute top-[60%] left-[30%] w-[50vw] h-[35vw] max-w-[600px] max-h-[450px] rounded-full animate-ambient-white"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.5) 0%, rgba(191, 219, 254, 0.3) 45%, rgba(255, 255, 255, 0) 75%)',
          filter: 'blur(65px)',
          animationDelay: '-6s',
          mixBlendMode: 'soft-light',
          willChange: 'transform, opacity',
        }}
      />

      {/* 5. Smooth Iridescent Aurora Flow Layer (Subtle moving sheen across the entire grid) */}
      <div
        className="absolute inset-0 animate-iridescent-flow opacity-40"
        style={{
          backgroundImage: 'linear-gradient(125deg, transparent 20%, rgba(255, 255, 255, 0.35) 45%, rgba(186, 230, 253, 0.35) 55%, transparent 80%)',
          backgroundSize: '250% 250%',
          mixBlendMode: 'soft-light',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};
