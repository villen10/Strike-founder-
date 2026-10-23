import React, { useEffect, useState } from 'react';

export const ReadingProgressBar: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) {
        setProgress(0);
        return;
      }
      const currentScroll = window.scrollY;
      const currentProgress = (currentScroll / totalHeight) * 100;
      setProgress(Math.min(100, Math.max(0, currentProgress)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Color shifting gradient from red -> rose -> amber -> emerald as progress increases
  const getGradientColor = (p: number) => {
    if (p < 30) return 'from-red-600 to-rose-500';
    if (p < 70) return 'from-rose-500 to-amber-500';
    return 'from-amber-500 to-emerald-500';
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-transparent pointer-events-none">
      <div
        className={`h-full bg-gradient-to-r ${getGradientColor(
          progress
        )} transition-all duration-150 shadow-[0_0_10px_rgba(239,68,68,0.5)]`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
