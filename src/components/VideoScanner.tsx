import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Cpu,
  Scan,
  Activity,
  Trash2,
  ListOrdered,
  CheckCheck,
  Loader2,
  ArrowUpRight,
  Plus,
  FileCheck
} from 'lucide-react';
import { SampleVideoOption, PolicyViolation, QueuedVideoTask } from '../types/audit';
import { SAMPLE_VIDEOS } from '../services/sampleData';
import { formatTime, ExtractedFrame } from '../services/frameExtractor';
import { FrameAnalysisProgress } from './FrameAnalysisProgress';

interface VideoScannerProps {
  currentVideoUrl: string | null;
  videoTitle: string;
  videoDurationSec: number;
  isScanning: boolean;
  scanProgress: { percent: number; status: string };
  violations: PolicyViolation[];
  extractedFrames?: ExtractedFrame[];
  onUploadFile: (file: File) => void;
  onUploadMultipleFiles?: (files: File[]) => void;
  onUploadFiles?: (files: File[]) => void;
  queueTasks?: QueuedVideoTask[];
  queuedTasks?: QueuedVideoTask[];
  activeTaskId?: string | null;
  onSelectQueuedTask?: (task: QueuedVideoTask) => void;
  onSelectTask?: (taskId: string) => void;
  onRemoveQueuedTask?: (taskId: string) => void;
  onRemoveTask?: (taskId: string) => void;
  onClearCompletedTasks?: () => void;
  onQueuePreset?: (sample: SampleVideoOption) => void;
  onQueueSample?: (sample: SampleVideoOption) => void;
  onStartQueueAudit?: () => void;
  isQueueRunning?: boolean;
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
  extractedFrames = [],
  onUploadFile,
  onUploadMultipleFiles,
  onUploadFiles,
  queueTasks,
  queuedTasks,
  activeTaskId = null,
  onSelectQueuedTask,
  onSelectTask,
  onRemoveQueuedTask,
  onRemoveTask,
  onClearCompletedTasks,
  onQueuePreset,
  onQueueSample,
  onStartQueueAudit,
  isQueueRunning,
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
  const [draggedFilesCount, setDraggedFilesCount] = useState<number>(0);

  const effectiveQueueTasks = queuedTasks || queueTasks || [];
  const handleUploadBatch = onUploadFiles || onUploadMultipleFiles;
  const handleSelectQueued = (task: QueuedVideoTask) => {
    if (onSelectTask) onSelectTask(task.id);
    else if (onSelectQueuedTask) onSelectQueuedTask(task);
  };
  const handleRemoveQueued = (taskId: string) => {
    if (onRemoveTask) onRemoveTask(taskId);
    else if (onRemoveQueuedTask) onRemoveQueuedTask(taskId);
  };
  const handleQueuePresetCase = onQueueSample || onQueuePreset;


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
    setDraggedFilesCount(0);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const validFiles: File[] = [];
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        const file = e.dataTransfer.files[i];
        if (
          file.type.startsWith('video/') ||
          /\.(mp4|webm|mov|mkv|avi|m4v|3gp|flv)$/i.test(file.name)
        ) {
          validFiles.push(file);
        }
      }

      if (validFiles.length > 0) {
        if (handleUploadBatch) {
          handleUploadBatch(validFiles);
        } else {
          onUploadFile(validFiles[0]);
        }
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    if (e.dataTransfer.items) {
      setDraggedFilesCount(e.dataTransfer.items.length);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    // Only turn off if leaving the drop container itself
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
      setDraggedFilesCount(0);
    }
  };

  const completedCount = effectiveQueueTasks.filter((t) => t.status === 'COMPLETED').length;
  const processingCount = effectiveQueueTasks.filter(
    (t) => t.status === 'EXTRACTING' || t.status === 'AUDITING'
  ).length;
  const queuedCount = effectiveQueueTasks.filter((t) => t.status === 'QUEUED').length;

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
              <div
                key={sample.id}
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
                <div onClick={() => onSelectSample(sample)} className="cursor-pointer">
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
                  <div className="flex items-center gap-2">
                    {handleQueuePresetCase && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQueuePresetCase(sample);
                        }}
                        title="Add preset to batch queue"
                        className="flex items-center gap-0.5 rounded px-1.5 py-0.5 font-sans text-[10px] font-medium text-slate-500 hover:text-red-600 hover:bg-red-500/10 transition cursor-pointer"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Queue</span>
                      </button>
                    )}
                    <button
                      onClick={() => onSelectSample(sample)}
                      className="font-body font-bold text-red-600 group-hover:underline cursor-pointer"
                    >
                      Load →
                    </button>
                  </div>
                </div>
              </div>
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
            <div className="flex items-center gap-2 min-w-0">
              <FileVideo className="h-4 w-4 shrink-0 text-red-600" />
              <h3
                className={`truncate font-display text-sm sm:text-base font-bold ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
                title={videoTitle || 'Select or upload a video'}
              >
                {videoTitle || 'Select or upload a video'}
              </h3>
            </div>
            {videoDurationSec > 0 && (
              <span
                className={`shrink-0 rounded-xl px-2.5 py-1 font-mono text-xs font-bold ${
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
                controls
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
                  Select a test scenario preset or drag & drop multiple videos to queue
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

            {/* Scanning Overlay Animation - Ultra UX */}
            {isScanning && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/92 backdrop-blur-xl z-20 p-6 text-center overflow-hidden"
              >
                {/* Laser Scanning Beam Sweep */}
                <motion.div
                  animate={{ y: ['0%', '100%', '0%'] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_20px_rgba(239,68,68,0.9)] z-10 opacity-80"
                />

                {/* Cyber Grid Background Effect */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

                <div className="relative z-20 mb-3 flex h-20 w-20 items-center justify-center">
                  <div className="absolute inset-0 animate-ping rounded-full bg-red-500/25" />
                  <div className="absolute inset-2 animate-spin rounded-full border-2 border-dashed border-red-500/80" />
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 text-white shadow-[0_0_25px_rgba(239,68,68,0.6)]">
                    <Scan className="h-7 w-7 animate-pulse" />
                  </div>
                </div>

                <div className="relative z-20 flex items-center gap-2 rounded-full bg-red-950/80 px-3 py-1 border border-red-500/30 text-xs font-mono text-red-300 mb-2">
                  <Cpu className="h-3.5 w-3.5 animate-spin text-red-400" />
                  <span>GEMINI VISION 1.5 PRO • NEURAL SCAN ACTIVE</span>
                </div>

                <h4 className="relative z-20 font-display text-lg font-black tracking-wide text-white">
                  Deep Temporal Video Audit
                </h4>
                <p className="relative z-20 mt-1 max-w-sm font-body text-xs text-slate-300 leading-relaxed font-medium">
                  {scanProgress.status}
                </p>

                {/* Progress Bar with Glow */}
                <div className="relative z-20 mt-5 w-72 max-w-full overflow-hidden rounded-full bg-slate-900/90 p-1 ring-1 ring-slate-700/80 shadow-inner">
                  <motion.div
                    className="h-2.5 rounded-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 shadow-[0_0_16px_rgba(239,68,68,0.8)]"
                    initial={{ width: '0%' }}
                    animate={{ width: `${Math.max(6, scanProgress.percent)}%` }}
                    transition={{ type: 'spring', stiffness: 60, damping: 15 }}
                  />
                </div>

                <div className="relative z-20 mt-3 flex items-center gap-4 font-mono text-xs font-bold">
                  <span className="text-red-400 text-sm tracking-wide">{scanProgress.percent}%</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Activity className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
                    2-5s Chunking & Audio Scan
                  </span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Interactive Heatmap Scrubber Timeline */}
          <div className="flex flex-col gap-2 pt-1">
            {/* Real-time Playback Head Violation Tracker Badge */}
            {(() => {
              const activeViolation = violations.find(
                (v) => currentTime >= v.secondsStart && currentTime <= v.secondsEnd
              );
              if (!activeViolation) return null;
              const isCrit = activeViolation.severity === 'CRITICAL_STRIKE';
              return (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`flex items-center justify-between rounded-xl px-3 py-2 border shadow-sm ${
                    isCrit
                      ? 'bg-red-500/10 border-red-500/40 text-red-500 dark:text-red-400'
                      : 'bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 animate-bounce shrink-0" />
                    <span className="font-mono text-xs font-bold">
                      Flagged Zone ({activeViolation.timestampStart} - {activeViolation.timestampEnd}):
                    </span>
                    <span className="font-body text-xs font-medium truncate">{activeViolation.title}</span>
                  </div>
                  <span className="shrink-0 rounded-md bg-black/10 dark:bg-white/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase">
                    {activeViolation.actionableFix.actionType}
                  </span>
                </motion.div>
              );
            })()}

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

        {/* Right: Drag & Drop Ingest & Simultaneous Queued Tasks (5 cols) */}
        <div
          className={`flex flex-col justify-between gap-4 rounded-2xl border p-4 sm:p-5 lg:col-span-5 transition shadow-xs ${
            isLight
              ? 'border-slate-200/90 bg-white text-slate-900'
              : 'border-slate-800/90 bg-slate-900/60 text-slate-100'
          }`}
        >
          <div className="flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <div>
                <h3
                  className={`font-display text-sm sm:text-base font-bold ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  Multi-Video Ingest & Batch Queue
                </h3>
                <p className="font-body text-[11px] text-slate-500">
                  Simultaneous drag & drop queuing for automated audits
                </p>
              </div>
              <span className="rounded-full bg-red-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-red-600">
                Multi-File Ingest
              </span>
            </div>

            {/* Drag & Drop Area - Ultra Modern & Responsive */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed p-6 text-center transition-all duration-200 ${
                isDragging
                  ? isLight
                    ? 'border-red-500 bg-red-50 ring-4 ring-red-500/20 scale-[1.01]'
                    : 'border-red-500 bg-red-950/40 ring-4 ring-red-500/20 scale-[1.01]'
                  : isLight
                  ? 'border-slate-300 bg-slate-50/70 hover:border-red-400 hover:bg-slate-100/60'
                  : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/80'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="video/mp4,video/webm,video/quicktime,video/x-matroska,video/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    const files = Array.from(e.target.files);
                    if (handleUploadBatch) {
                      handleUploadBatch(files);
                    } else {
                      onUploadFile(files[0]);
                    }
                  }
                }}
              />

              {/* Background ambient radial glow on drag */}
              {isDragging && (
                <div className="pointer-events-none absolute inset-0 bg-radial-gradient from-red-500/10 via-transparent to-transparent animate-pulse" />
              )}

              <div
                className={`mb-3 flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm transition group-hover:scale-105 ${
                  isDragging
                    ? 'bg-red-600 text-white animate-bounce'
                    : isLight
                    ? 'bg-red-50 text-red-600 ring-1 ring-red-200'
                    : 'bg-slate-800 text-rose-400 ring-1 ring-slate-700'
                }`}
              >
                <Upload className="h-6 w-6" />
              </div>

              <div className="relative z-10">
                <p
                  className={`font-display text-sm font-bold ${
                    isDragging
                      ? 'text-red-600'
                      : isLight
                      ? 'text-slate-900'
                      : 'text-white'
                  }`}
                >
                  {isDragging
                    ? `Drop ${draggedFilesCount > 1 ? draggedFilesCount + ' Videos' : 'Video'} to Queue Instantly!`
                    : 'Drop Multiple Video Files Here'}
                </p>
                <p className="mt-1 font-body text-xs text-slate-500">
                  or <span className="font-semibold text-red-600 underline">browse files</span> from your computer
                </p>

                {/* Formats and batch tag */}
                <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 font-mono text-[10px]">
                  <span
                    className={`rounded px-1.5 py-0.5 ${
                      isLight ? 'bg-slate-200/80 text-slate-700' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    MP4
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.5 ${
                      isLight ? 'bg-slate-200/80 text-slate-700' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    MOV
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.5 ${
                      isLight ? 'bg-slate-200/80 text-slate-700' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    WEBM
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.5 ${
                      isLight ? 'bg-slate-200/80 text-slate-700' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    MKV
                  </span>
                  <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-emerald-600 font-bold">
                    Batch Support
                  </span>
                </div>
              </div>
            </div>

            {/* Audit Task Queue Section */}
            <div
              className={`flex flex-col rounded-xl border p-3 ${
                isLight
                  ? 'border-slate-200 bg-slate-50/70 text-slate-900'
                  : 'border-slate-800/90 bg-slate-950/50 text-slate-200'
              }`}
            >
              <div className="mb-2 flex items-center justify-between border-b pb-2 border-slate-200/80 dark:border-slate-800/80">
                <div className="flex items-center gap-2">
                  <ListOrdered className="h-3.5 w-3.5 text-red-600" />
                  <span className="font-mono text-xs font-bold">
                    Audit Queue ({effectiveQueueTasks.length})
                  </span>
                  {processingCount > 0 && (
                    <span className="flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.2 font-mono text-[9px] font-bold text-red-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                      {processingCount} Active
                    </span>
                  )}
                  {queuedCount > 0 && (
                    <span className="rounded-full bg-amber-500/10 px-1.5 py-0.2 font-mono text-[9px] font-bold text-amber-600">
                      {queuedCount} Queued
                    </span>
                  )}
                </div>

                {completedCount > 0 && onClearCompletedTasks && (
                  <button
                    onClick={onClearCompletedTasks}
                    className="flex items-center gap-1 font-mono text-[10px] text-slate-500 hover:text-red-600 transition"
                  >
                    <CheckCheck className="h-3 w-3" />
                    <span>Clear Done</span>
                  </button>
                )}
              </div>

              {/* Task Items List */}
              <div className="flex max-h-48 flex-col gap-1.5 overflow-y-auto pr-0.5">
                {effectiveQueueTasks.length === 0 ? (
                  <div className="py-4 text-center">
                    <p className="font-body text-xs text-slate-500">
                      Queue is currently empty. Drop videos above to begin!
                    </p>
                  </div>
                ) : (
                  <AnimatePresence initial={false}>
                    {effectiveQueueTasks.map((task) => {
                      const isActive = activeTaskId === task.id || videoTitle === task.title;
                      const isCompleted = task.status === 'COMPLETED';
                      const isProcessing =
                        task.status === 'EXTRACTING' || task.status === 'AUDITING';
                      const isQueued = task.status === 'QUEUED';
                      const isError = task.status === 'ERROR';

                      const riskScore = task.report?.overallRiskScore ?? 0;
                      const isClean = isCompleted && riskScore < 20;
                      const isAtRisk = isCompleted && riskScore >= 20 && riskScore < 60;
                      const isHighRisk = isCompleted && riskScore >= 60;

                      return (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className={`group flex flex-col gap-1.5 rounded-lg border p-2 text-xs transition ${
                            isActive
                              ? isLight
                                ? 'border-red-500 bg-white ring-1 ring-red-400/40 shadow-xs'
                                : 'border-red-500/80 bg-slate-900 ring-1 ring-red-500/30'
                              : isLight
                              ? 'border-slate-200 bg-white/80 hover:bg-white'
                              : 'border-slate-800 bg-slate-900/60 hover:bg-slate-900'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div
                              onClick={() => handleSelectQueued(task)}
                              className="flex items-center gap-2 min-w-0 flex-1 cursor-pointer"
                            >
                              {/* Task Icon / Status Icon */}
                              <div className="shrink-0">
                                {isProcessing ? (
                                  <Loader2 className="h-4 w-4 animate-spin text-red-600" />
                                ) : isCompleted ? (
                                  <CheckCircle2
                                    className={`h-4 w-4 ${
                                      isHighRisk
                                        ? 'text-red-500'
                                        : isAtRisk
                                        ? 'text-amber-500'
                                        : 'text-emerald-500'
                                    }`}
                                  />
                                ) : isError ? (
                                  <AlertTriangle className="h-4 w-4 text-red-500" />
                                ) : (
                                  <Clock className="h-4 w-4 text-slate-400" />
                                )}
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5">
                                  <p className="truncate font-sans font-semibold text-[11px] leading-tight">
                                    {task.title}
                                  </p>
                                  {isActive && (
                                    <span className="shrink-0 rounded bg-red-500/10 px-1 py-0.2 font-mono text-[8px] font-bold text-red-600">
                                      VIEWING
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 font-mono text-[9px] text-slate-500 mt-0.5">
                                  {task.fileSizeFormatted && <span>{task.fileSizeFormatted}</span>}
                                  {task.durationFormatted && task.durationFormatted !== '--:--' && (
                                    <span>• {task.durationFormatted}</span>
                                  )}
                                  <span>• {task.progressStatus}</span>
                                </div>
                              </div>
                            </div>

                            {/* Status Badge & Actions */}
                            <div className="flex items-center gap-1.5 shrink-0">
                              {isCompleted && task.report && (
                                <span
                                  className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-bold ${
                                    isClean
                                      ? 'bg-emerald-500/10 text-emerald-600'
                                      : isAtRisk
                                      ? 'bg-amber-500/10 text-amber-600'
                                      : 'bg-red-500/10 text-red-600'
                                  }`}
                                >
                                  {Math.max(0, 100 - riskScore)}% Safe
                                </span>
                              )}

                              {isProcessing && (
                                <span className="font-mono text-[10px] font-bold text-red-500">
                                  {task.progressPercent}%
                                </span>
                              )}

                              {isQueued && (
                                <span className="rounded bg-slate-500/10 px-1.5 py-0.5 font-mono text-[9px] text-slate-500">
                                  Waiting
                                </span>
                              )}

                              {handleSelectQueued && !isActive && (
                                <button
                                  onClick={() => handleSelectQueued(task)}
                                  className="rounded p-1 text-slate-400 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                                  title="Inspect report and video"
                                >
                                  <ArrowUpRight className="h-3.5 w-3.5" />
                                </button>
                              )}

                              {handleRemoveQueued && (
                                <button
                                  onClick={() => handleRemoveQueued(task.id)}
                                  className="rounded p-1 text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                                  title="Remove from queue"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Progress bar during processing */}
                          {isProcessing && (
                            <div className="h-1 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                              <motion.div
                                className="h-full rounded-full bg-red-600"
                                initial={{ width: '0%' }}
                                animate={{ width: `${Math.max(5, task.progressPercent)}%` }}
                              />
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                )}
              </div>
            </div>

            {/* Quick Safety Summary Note */}
            <div
              className={`rounded-xl border p-2.5 text-[11px] ${
                isLight
                  ? 'border-slate-200 bg-slate-50/80 text-slate-600'
                  : 'border-slate-800/80 bg-slate-950/40 text-slate-400'
              }`}
            >
              <div className="flex items-start gap-2">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-600" />
                <p className="font-body leading-relaxed">
                  Batch audit processes videos automatically. Evaluates frame temporal movement, children presence, weapons, and advertiser guidelines.
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
                {isScanning ? 'Auditing Video Ingest...' : 'Run Guidelines Audit on Active Video'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Frame & 4s Snippet Analysis Stream Progress Component */}
      <FrameAnalysisProgress
        frames={extractedFrames}
        violations={violations}
        isScanning={isScanning}
        scanProgress={scanProgress}
        isLight={isLight}
      />
    </div>
  );
};
