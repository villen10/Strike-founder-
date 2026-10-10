import React, { useRef, useState } from 'react';
import {
  Upload,
  Film,
  Play,
  Pause,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Info,
  Clock,
  Layers,
  FileVideo,
  CheckCircle2,
} from 'lucide-react';
import { SampleVideoOption, PolicyViolation } from '../types/audit';
import { SAMPLE_VIDEOS } from '../services/sampleData';
import { formatTime } from '../services/frameExtractor';

interface VideoScannerProps {
  currentVideoUrl: string | null;
  videoTitle: string;
  videoDurationSec: number;
  isScanning: boolean;
  scanProgress: { percent: number; status: string };
  violations: PolicyViolation[];
  onUploadFile: (file: File) => void;
  onSelectSample: (sample: SampleVideoOption) => void;
  onTriggerAudit: () => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  currentTime: number;
  onSeek: (seconds: number) => void;
  isLight?: boolean;
}

export const VideoScanner: React.FC<VideoScannerProps> = ({
  currentVideoUrl,
  videoTitle,
  videoDurationSec,
  isScanning,
  scanProgress,
  violations,
  onUploadFile,
  onSelectSample,
  onTriggerAudit,
  videoRef,
  currentTime,
  onSeek,
  isLight = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Sync play/pause state
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    onSeek(videoRef.current.currentTime);
  };

  const handleScrubberClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoDurationSec) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const targetSeconds = ratio * videoDurationSec;
    if (videoRef.current) {
      videoRef.current.currentTime = targetSeconds;
    }
    onSeek(targetSeconds);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('video/')) {
        onUploadFile(file);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Test Presets Banner */}
      <div
        className={`rounded-2xl border p-4 sm:p-5 transition shadow-xs ${
          isLight
            ? 'border-slate-200/90 bg-white text-slate-900'
            : 'border-slate-800/80 bg-slate-900/50 backdrop-blur-sm text-slate-100'
        }`}
      >
        <div className="mb-3 flex items-center justify-between">
          <div
            className={`flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-wider ${
              isLight ? 'text-slate-500' : 'text-slate-400'
            }`}
          >
            <Layers className="h-3.5 w-3.5 text-red-600" />
            <span>Instant Test Presets (1-Click Test Scenarios)</span>
          </div>
          <span className="font-body text-[11px] text-slate-400">
            Real Creator Incident Cases
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {SAMPLE_VIDEOS.map((sample) => {
            const isCritical = sample.expectedResult === 'CRITICAL_STRIKE';
            const isCaution = sample.expectedResult === 'DEMONETIZATION_WARNING';
            const isClean = sample.expectedResult === 'CLEAN';

            return (
              <button
                key={sample.id}
                onClick={() => onSelectSample(sample)}
                className={`group relative flex flex-col justify-between rounded-xl border p-3 text-left transition shadow-2xs ${
                  videoTitle === sample.title
                    ? isLight
                      ? 'border-red-500 bg-red-50/60 ring-1 ring-red-500/30'
                      : 'border-red-500/80 bg-red-950/30 ring-1 ring-red-500/30'
                    : isLight
                    ? 'border-slate-200 bg-slate-50/70 hover:border-slate-300 hover:bg-slate-100/80'
                    : 'border-slate-800 bg-slate-900/80 hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="font-mono text-[10px] font-medium text-slate-500">{sample.category}</span>
                    <span
                      className={`flex items-center gap-1 font-mono text-[10px] font-bold ${
                        isCritical
                          ? 'text-red-600'
                          : isCaution
                          ? 'text-amber-600'
                          : 'text-emerald-600'
                      }`}
                    >
                      {isCritical && <ShieldAlert className="h-3 w-3" />}
                      {isCaution && <AlertTriangle className="h-3 w-3" />}
                      {isClean && <CheckCircle2 className="h-3 w-3" />}
                      <span>
                        {isCritical ? 'Strike Risk' : isCaution ? 'Ad Caution' : 'Safe'}
                      </span>
                    </span>
                  </div>
                  <h4
                    className={`line-clamp-1 font-display text-xs font-bold ${
                      isLight ? 'text-slate-900 group-hover:text-red-600' : 'text-slate-200 group-hover:text-white'
                    }`}
                  >
                    {sample.title}
                  </h4>
                  <p
                    className={`mt-1 line-clamp-2 font-body text-[11px] leading-relaxed ${
                      isLight ? 'text-slate-600' : 'text-slate-400'
                    }`}
                  >
                    {sample.shortDesc}
                  </p>
                </div>
                <div
                  className={`mt-3 flex items-center justify-between border-t pt-2 font-mono text-[10px] ${
                    isLight ? 'border-slate-200/80 text-slate-500' : 'border-slate-800/60 text-slate-500'
                  }`}
                >
                  <span className="flex items-center gap-1 font-bold">
                    <Clock className="h-3 w-3 text-slate-400" />
                    {sample.durationFormatted}
                  </span>
                  <span className="font-body font-bold text-red-600 group-hover:underline">
                    Load Preset →
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Video & Upload Container */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Left: Video Player & Timeline Scrubber (7 cols) */}
        <div
          className={`flex flex-col gap-3.5 rounded-2xl border p-4 sm:p-5 lg:col-span-7 transition shadow-xs ${
            isLight
              ? 'border-slate-200/90 bg-white text-slate-900'
              : 'border-slate-800/90 bg-slate-900/60 text-slate-100'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileVideo className="h-4 w-4 text-red-600" />
              <h3
                className={`line-clamp-1 font-display text-sm sm:text-base font-bold ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                {videoTitle || 'Select or upload a video'}
              </h3>
            </div>
            {videoDurationSec > 0 && (
              <span
                className={`rounded-xl px-2.5 py-1 font-mono text-xs font-bold ${
                  isLight ? 'bg-slate-100 text-slate-800 border border-slate-200' : 'bg-slate-800 text-slate-300'
                }`}
              >
                {formatTime(currentTime)} / {formatTime(videoDurationSec)}
              </span>
            )}
          </div>

          {/* Video Preview Canvas / Video Tag */}
          <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black ring-1 ring-slate-800 shadow-inner">
            {currentVideoUrl ? (
              <video
                ref={videoRef}
                src={currentVideoUrl}
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
                className="h-full w-full object-contain"
                playsInline
              />
            ) : (
              <div
                className={`flex h-full w-full flex-col items-center justify-center p-6 text-center ${
                  isLight ? 'bg-slate-900 text-slate-300' : 'bg-gradient-to-b from-slate-900 to-slate-950 text-slate-400'
                }`}
              >
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-red-500 ring-1 ring-slate-700 shadow-sm">
                  <Film className="h-7 w-7" />
                </div>
                <p className="font-display text-sm font-bold text-white">
                  Video Screen Ready
                </p>
                <p className="mt-1 max-w-xs font-body text-xs text-slate-400">
                  Select a test scenario preset from above or drag & drop your video file
                </p>
              </div>
            )}

            {/* Video Overlay Play Button */}
            {currentVideoUrl && (
              <button
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition hover:opacity-100 focus:opacity-100"
                aria-label="Toggle playback"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900/90 text-white shadow-xl backdrop-blur-sm transition hover:scale-105">
                  {isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="ml-0.5 h-5 w-5 fill-current" />
                  )}
                </div>
              </button>
            )}

            {/* Scanning Overlay Animation */}
            {isScanning && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/85 backdrop-blur-sm z-20">
                <div className="relative mb-4 flex h-16 w-16 items-center justify-center">
                  <div className="absolute inset-0 animate-ping rounded-full bg-red-500/20" />
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white shadow-xl">
                    <ShieldAlert className="h-6 w-6 animate-pulse" />
                  </div>
                </div>
                <p className="font-display text-sm font-bold text-white">
                  Auditing Video Compliance...
                </p>
                <p className="mt-1 font-body text-xs text-slate-400">{scanProgress.status}</p>
                <div className="mt-3.5 h-1.5 w-48 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-red-600 to-indigo-500 transition-all duration-300"
                    style={{ width: `${scanProgress.percent}%` }}
                  />
                </div>
                <span className="mt-1 font-mono text-[11px] font-bold text-slate-400">
                  {scanProgress.percent}%
                </span>
              </div>
            )}
          </div>

          {/* Interactive Heatmap Scrubber Timeline */}
          <div className="flex flex-col gap-1.5 pt-1">
            <div
              className={`flex items-center justify-between text-xs ${
                isLight ? 'text-slate-600' : 'text-slate-400'
              }`}
            >
              <span className="flex items-center gap-1 font-body font-semibold">
                <Clock className="h-3 w-3 text-slate-500" />
                Timeline Risk Heatmap
              </span>
              <span className="font-mono text-[10px] text-slate-500">
                Click marker to jump video
              </span>
            </div>

            {/* Scrubber Bar */}
            <div
              onClick={handleScrubberClick}
              className={`group relative h-6 w-full cursor-pointer rounded-xl p-0.5 transition ${
                isLight ? 'bg-slate-200 hover:bg-slate-300/80' : 'bg-slate-800/90 hover:bg-slate-800'
              }`}
            >
              {/* Clean background track */}
              <div
                className={`relative h-full w-full overflow-hidden rounded-lg ${
                  isLight ? 'bg-slate-100' : 'bg-slate-950'
                }`}
              >
                {/* Flagged issue heat segments */}
                {videoDurationSec > 0 &&
                  violations.map((v) => {
                    const leftPct = (v.secondsStart / videoDurationSec) * 100;
                    const widthPct = Math.max(
                      2.5,
                      ((v.secondsEnd - v.secondsStart) / videoDurationSec) * 100
                    );
                    const isCrit = v.severity === 'CRITICAL_STRIKE';
                    const isCaution = v.severity === 'DEMONETIZATION_WARNING';

                    return (
                      <div
                        key={v.id}
                        style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                        className={`absolute top-0 bottom-0 transition-opacity hover:opacity-100 ${
                          isCrit
                            ? 'bg-red-600 ring-1 ring-red-400'
                            : isCaution
                            ? 'bg-amber-500 ring-1 ring-amber-400'
                            : 'bg-indigo-500'
                        }`}
                        title={`${v.title} (${v.timestampStart} - ${v.timestampEnd})`}
                      />
                    );
                  })}

                {/* Progress playhead */}
                {videoDurationSec > 0 && (
                  <div
                    style={{
                      left: `${(currentTime / videoDurationSec) * 100}%`,
                    }}
                    className={`absolute top-0 bottom-0 w-1 -translate-x-1/2 ${
                      isLight ? 'bg-slate-900 shadow-sm' : 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]'
                    }`}
                  />
                )}
              </div>
            </div>

            {/* Heatmap Legend */}
            <div className="flex items-center justify-between font-mono text-[10px] text-slate-500">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-red-600" />
                  Strike Hazard
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  Demonetization
                </span>
                <span className="flex items-center gap-1">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isLight ? 'bg-slate-300' : 'bg-slate-700'
                    }`}
                  />
                  Compliant
                </span>
              </div>
              <span className="font-mono text-slate-500 font-bold">
                {videoDurationSec > 0 ? `${videoDurationSec}s total` : '0s'}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Upload Box & Scan Trigger (5 cols) */}
        <div
          className={`flex flex-col justify-between gap-4 rounded-2xl border p-4 sm:p-5 lg:col-span-5 transition shadow-xs ${
            isLight
              ? 'border-slate-200/90 bg-white text-slate-900'
              : 'border-slate-800/90 bg-slate-900/60 text-slate-100'
          }`}
        >
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3
                className={`font-display text-sm sm:text-base font-bold ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                Upload Video for Multi-Frame Audit
              </h3>
              <span className="font-mono text-[10px] text-slate-500">MP4, MOV, WebM</span>
            </div>

            {/* Drag & Drop Area */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition ${
                isDragging
                  ? 'border-red-500 bg-red-50/50'
                  : isLight
                  ? 'border-slate-300 bg-slate-50/70 hover:border-slate-400 hover:bg-slate-100/50'
                  : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/80'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime,video/mkv"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    onUploadFile(e.target.files[0]);
                  }
                }}
              />
              <div
                className={`mb-2.5 flex h-12 w-12 items-center justify-center rounded-2xl shadow-xs ${
                  isLight
                    ? 'bg-red-50 text-red-600 ring-1 ring-red-200'
                    : 'bg-slate-800 text-rose-400 ring-1 ring-slate-700'
                }`}
              >
                <Upload className="h-6 w-6" />
              </div>
              <p
                className={`font-body text-xs font-bold ${
                  isLight ? 'text-slate-800' : 'text-slate-200'
                }`}
              >
                Click to browse or drag & drop video file
              </p>
              <p className="mt-1 font-body text-[11px] text-slate-500">
                Shorts, Reels, or Long-form (Secure client-side frame extraction)
              </p>
            </div>

            {/* Notice explaining how it replicates YouTube automated bot */}
            <div
              className={`mt-3.5 rounded-xl border p-3 text-[11px] ${
                isLight
                  ? 'border-slate-200 bg-slate-50/80 text-slate-600'
                  : 'border-slate-800/80 bg-slate-950/40 text-slate-400'
              }`}
            >
              <div className="flex items-start gap-2">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-600" />
                <p className="font-body leading-relaxed">
                  Evaluates frame-by-frame temporal movement, child presence, weapons, explicit content, and the first 7-second ad suitability rule.
                </p>
              </div>
            </div>
          </div>

          {/* Action Trigger Button */}
          <div className="pt-2">
            <button
              onClick={onTriggerAudit}
              disabled={isScanning}
              className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 font-display text-sm font-black tracking-wide text-white shadow-md transition ${
                isScanning
                  ? 'cursor-not-allowed bg-slate-400 text-white'
                  : 'bg-red-600 hover:bg-red-700 shadow-red-600/20 active:scale-[0.99]'
              }`}
            >
              <Sparkles className="h-4 w-4" />
              <span>
                {isScanning ? 'Auditing Video Ingest...' : 'Run Community Guidelines Audit'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
