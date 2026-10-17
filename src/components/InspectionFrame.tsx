import React from 'react';
import { Camera, ShieldAlert, AlertTriangle, CheckCircle2, Clock, Sparkles } from 'lucide-react';

interface InspectionFrameProps {
  imageSrc?: string;
  timestamp?: string;
  severity?: 'CRITICAL_STRIKE' | 'DEMONETIZATION_WARNING' | 'MILD_CAUTION' | 'CLEAN';
  confidencePct?: number;
  label?: string;
  aspectRatio?: 'video' | 'square' | 'auto';
  className?: string;
  showOverlayHud?: boolean;
  isLight?: boolean;
  alt?: string;
}

/**
 * InspectionFrame: Vintage Newspaper Collage & Tilted Photo Frame Snapshot
 * Exactly matches the user's uploaded style reference (tilted polaroid/vintage photo
 * surrounded by a newspaper/magazine clipping collage border).
 */
export const InspectionFrame: React.FC<InspectionFrameProps> = ({
  imageSrc,
  timestamp = '00:00',
  severity = 'CRITICAL_STRIKE',
  confidencePct,
  label,
  aspectRatio = 'video',
  className = '',
  showOverlayHud = true,
  isLight = false,
  alt = 'Audited Video Frame',
}) => {
  const isCritical = severity === 'CRITICAL_STRIKE';
  const isWarning = severity === 'DEMONETIZATION_WARNING' || severity === 'MILD_CAUTION';

  return (
    <div className={`relative p-2 sm:p-3 my-2 ${className}`}>
      {/* 1. Underlying Vintage Newspaper / Magazine Collage Border Effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-slate-800 via-zinc-900 to-black p-3 shadow-xl transform rotate-[-1.5deg] border border-white/10 overflow-hidden opacity-95">
        {/* Simulated newspaper text lines and torn edges background */}
        <div className="absolute inset-0 opacity-15 pointer-events-none select-none font-serif text-[8px] text-white leading-tight overflow-hidden p-2 grid grid-cols-3 gap-1">
          <div>
            <p>LE CINEMA · ECHOS DU THEATRE</p>
            <p>Aux Nouveautés - Scène dramatique et critique...</p>
            <p>Les Echos de la Scene artistique et cinematographique...</p>
            <p>Francois Saroye a inventé...</p>
          </div>
          <div>
            <p>GRIS A VEDETTE · SPARTACUS</p>
            <p>Un nouvel angle pour les critiques dramatiques...</p>
            <p>Rue de la Paix, Paris, chez elle, 90 ans...</p>
            <p>Le public applaudit longuement la performance...</p>
          </div>
          <div>
            <p>COMEDIA · MEDIA RAPPORT</p>
            <p>Devenu habitue du theatre et des grands ecrans...</p>
            <p>Secrétaire de rédaction et critique d'art...</p>
            <p>L'Assommoir, pièces de théâtre et grands romans...</p>
          </div>
        </div>
      </div>

      {/* 2. Tilted Vintage Photographic Print / Polaroid Frame on top */}
      <div className="relative transform rotate-[1deg] transition-transform duration-300 hover:rotate-0 hover:scale-[1.01]">
        <div
          className={`relative overflow-hidden rounded-xl bg-black border-4 shadow-2xl ${
            isCritical
              ? 'border-red-600 shadow-red-600/30 ring-2 ring-red-500/30'
              : isWarning
              ? 'border-amber-500 shadow-amber-500/30 ring-2 ring-amber-500/30'
              : 'border-emerald-500 shadow-emerald-500/30 ring-2 ring-emerald-500/30'
          } ${aspectRatio === 'video' ? 'aspect-video' : aspectRatio === 'square' ? 'aspect-square' : ''}`}
        >
          {/* Image or Fallback */}
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={alt}
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-102"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-slate-950 p-4 text-center">
              <Camera className="h-8 w-8 text-red-500 animate-pulse" />
              <span className="mt-2 font-mono text-xs font-bold text-slate-300">
                FRAME [{timestamp}]
              </span>
              <span className="text-[10px] font-sans text-slate-500">Video Ingest Snapshot</span>
            </div>
          )}

          {/* Vignette Shadow */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50" />

          {/* HUD Badges & Timestamp */}
          {showOverlayHud && (
            <div className="absolute inset-0 p-2 sm:p-2.5 flex flex-col justify-between pointer-events-none">
              {/* Top Row: REC Timestamp + Severity Badge */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 rounded-lg bg-black/85 backdrop-blur-md px-2 py-0.5 border border-white/10 shadow-xs">
                  <span className={`h-2 w-2 rounded-full ${isCritical ? 'bg-red-500 animate-ping' : 'bg-emerald-400'}`} />
                  <span className="font-mono text-[10px] sm:text-[11px] font-black text-white tracking-wide">
                    FRAME [{timestamp}]
                  </span>
                </div>

                <div
                  className={`flex items-center gap-1 rounded-lg px-2 py-0.5 font-mono text-[9px] sm:text-[10px] font-black uppercase tracking-wider backdrop-blur-md border ${
                    isCritical
                      ? 'bg-red-600/95 text-white border-red-400 shadow-xs shadow-red-500/40'
                      : isWarning
                      ? 'bg-amber-500/95 text-slate-950 border-amber-300'
                      : 'bg-emerald-600/95 text-white border-emerald-400'
                  }`}
                >
                  {isCritical ? (
                    <ShieldAlert className="h-3 w-3 shrink-0" />
                  ) : isWarning ? (
                    <AlertTriangle className="h-3 w-3 shrink-0" />
                  ) : (
                    <CheckCircle2 className="h-3 w-3 shrink-0" />
                  )}
                  <span>{label || (isCritical ? 'STRIKE HAZARD' : isWarning ? 'DEMONETIZATION' : 'SAFE FRAME')}</span>
                </div>
              </div>

              {/* Bottom Row: Confidence % */}
              <div className="flex items-center justify-end">
                {confidencePct !== undefined && (
                  <div
                    className={`rounded-md px-2 py-0.5 font-mono text-[10px] font-bold backdrop-blur-md border ${
                      confidencePct >= 90
                        ? 'bg-red-950/90 text-red-300 border-red-500/40'
                        : confidencePct >= 75
                        ? 'bg-amber-950/90 text-amber-300 border-amber-500/40'
                        : 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40'
                    }`}
                  >
                    Certainty: {confidencePct}%
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
