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
  Clock,
  Layers,
  FileVideo,
  CheckCircle2,
  Activity,
  Trash2,
  ListOrdered,
  CheckCheck,
  Loader2,
  ArrowUpRight,
  Plus,
  FolderOpen,
  Sparkles,
  Info,
} from 'lucide-react';
import { SampleVideoOption, PolicyViolation, QueuedVideoTask } from '../types/audit';
import { SAMPLE_VIDEOS } from '../services/sampleData';
import { formatTime, ExtractedFrame } from '../services/frameExtractor';
import { FrameAnalysisProgress } from './FrameAnalysisProgress';

interface VideoScannerProps {
  currentVideoUrl: string | null;
  videoTitle: string;
  originalFileName?: string;
  aiGeneratedTitle?: string;
  videoExpiresAt?: number;
  isVideoDeleted?: boolean;
  onDeleteVideoMedia?: () => void;
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
  originalFileName,
  aiGeneratedTitle,
  videoExpiresAt,
  isVideoDeleted,
  onDeleteVideoMedia,
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
  const [activeTab, setActiveTab] = useState<'upload' | 'presets'>('upload');

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
    <div className="flex flex-col gap-6">
      {/* 1. Header Segmented Navigation: Add Video vs Presets */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-red-600/10 text-red-600 dark:bg-red-500/15 dark:text-red-400">
            <Film className="h-5 w-5" />
          </div>
          <div>
            <h2 className={`font-display text-base sm:text-lg font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Video Guidelines Scanner
            </h2>
            <p className="font-sans text-xs text-slate-500">
              Audit your video before publishing to prevent strikes and demonetization
            </p>
          </div>
        </div>

        {/* Segmented Switch */}
        <div className={`inline-flex rounded-2xl p-1 border ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 font-sans text-xs font-bold transition cursor-pointer ${
              activeTab === 'upload'
                ? isLight
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FolderOpen className="h-3.5 w-3.5 text-red-600" />
            <span>Add from Browser</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 font-sans text-xs font-bold transition cursor-pointer ${
              activeTab === 'presets'
                ? isLight
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="h-3.5 w-3.5 text-amber-500" />
            <span>Sample Cases ({SAMPLE_VIDEOS.length})</span>
          </button>
        </div>
      </div>

      {/* 2. Sample Scenarios Drawer / View (shown when presets tab is chosen) */}
      {activeTab === 'presets' && (
        <div
          className={`rounded-3xl border p-5 sm:p-6 transition shadow-2xs ${
            isLight
              ? 'border-slate-100 bg-white text-slate-900 shadow-slate-200/50'
              : 'border-slate-800 bg-slate-900 text-slate-100'
          }`}
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-display text-sm font-bold">Select a Real Creator Incident Case</span>
              <span className="text-xs text-slate-400">Click to load and preview</span>
            </div>
            <button
              onClick={() => setActiveTab('upload')}
              className="text-xs font-semibold text-red-600 hover:underline cursor-pointer"
            >
              Back to Upload →
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {SAMPLE_VIDEOS.map((sample) => {
              const isCritical = sample.expectedResult === 'CRITICAL_STRIKE';
              const isCaution = sample.expectedResult === 'DEMONETIZATION_WARNING';
              const isClean = sample.expectedResult === 'CLEAN';
              const isCurrent = videoTitle === sample.title;

              return (
                <div
                  key={sample.id}
                  onClick={() => {
                    onSelectSample(sample);
                    setActiveTab('upload');
                  }}
                  className={`group relative flex flex-col justify-between rounded-2xl border p-4 text-left transition cursor-pointer shadow-2xs ${
                    isCurrent
                      ? isLight
                        ? 'border-red-500 bg-red-50/70 ring-2 ring-red-500/20'
                        : 'border-red-500/80 bg-red-950/30 ring-2 ring-red-500/20'
                      : isLight
                      ? 'border-slate-200 bg-slate-50/70 hover:border-slate-300 hover:bg-slate-100/80'
                      : 'border-slate-800 bg-slate-900/80 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-mono text-[10px] font-semibold text-slate-500">
                        {sample.category}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-sans text-[10px] font-bold ${
                          isCritical
                            ? 'bg-red-500/10 text-red-600'
                            : isCaution
                            ? 'bg-amber-500/10 text-amber-600'
                            : 'bg-emerald-500/10 text-emerald-600'
                        }`}
                      >
                        {isCritical && <ShieldAlert className="h-3 w-3" />}
                        {isCaution && <AlertTriangle className="h-3 w-3" />}
                        {isClean && <CheckCircle2 className="h-3 w-3" />}
                        <span>
                          {isCritical ? 'Strike Risk' : isCaution ? 'Ad Caution' : 'Clean'}
                        </span>
                      </span>
                    </div>

                    <h4
                      className={`line-clamp-1 font-display text-xs sm:text-sm font-bold ${
                        isLight ? 'text-slate-900 group-hover:text-red-600' : 'text-slate-200 group-hover:text-white'
                      }`}
                    >
                      {sample.title}
                    </h4>
                    <p
                      className={`mt-1.5 line-clamp-2 font-sans text-xs leading-relaxed ${
                        isLight ? 'text-slate-600' : 'text-slate-400'
                      }`}
                    >
                      {sample.shortDesc}
                    </p>
                  </div>

                  <div
                    className={`mt-3.5 flex items-center justify-between border-t pt-2.5 font-sans text-xs ${
                      isLight ? 'border-slate-200/80 text-slate-500' : 'border-slate-800/60 text-slate-500'
                    }`}
                  >
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="h-3 w-3 text-slate-400" />
                      {sample.durationFormatted}
                    </span>
                    <span className="font-bold text-red-600 group-hover:underline">
                      Load Video →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Main Workspace: Video Player (Left) + Upload & Queue Controls (Right) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Video Player & Timeline Scrubber (7 cols) */}
        <div
          className={`flex flex-col gap-4 rounded-3xl border p-5 sm:p-6 lg:col-span-7 transition shadow-2xs ${
            isLight
              ? 'border-slate-100 bg-white text-slate-900 shadow-slate-200/50'
              : 'border-slate-800 bg-slate-900 text-slate-100'
          }`}
        >
          {/* PlayScreen Header: AI Title, Real Filename, & Auto-Delete Policy */}
          <div className="flex flex-col gap-2 border-b pb-3.5 border-slate-100 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0">
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-600/10 text-red-600 mt-0.5">
                  <FileVideo className="h-4.5 w-4.5" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="inline-flex items-center gap-1 rounded-md bg-red-600/10 dark:bg-red-500/15 px-2 py-0.5 font-mono text-[10px] font-bold text-red-600 dark:text-red-400 uppercase">
                      <Sparkles className="h-3 w-3" />
                      PlayScreen Active
                    </span>
                    {originalFileName && (
                      <span className="font-mono text-[11px] text-slate-500 truncate" title={`Original file: ${originalFileName}`}>
                        📁 File: {originalFileName}
                      </span>
                    )}
                  </div>
                  <h3
                    className={`truncate font-display text-base sm:text-lg font-black tracking-tight ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}
                    title={aiGeneratedTitle || videoTitle || 'Ready to audit'}
                  >
                    {aiGeneratedTitle || videoTitle || 'Ready to Play & Audit'}
                  </h3>
                </div>
              </div>

              {/* Status Badges: Duration & Auto-Delete Timer */}
              <div className="flex items-center gap-2 shrink-0">
                {videoDurationSec > 0 && (
                  <span
                    className={`rounded-xl px-2.5 py-1 font-mono text-xs font-bold ${
                      isLight ? 'bg-slate-100 text-slate-800 border border-slate-200' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {formatTime(currentTime)} / {formatTime(videoDurationSec)}
                  </span>
                )}

                {/* Auto-delete 24h retention badge */}
                <div
                  className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-amber-600 dark:text-amber-400 font-mono text-[11px] font-bold"
                  title="Video media automatically purges in 24 hours to protect privacy and storage. Full audit results and keyframe snapshots remain saved permanently."
                >
                  <Clock className="h-3 w-3" />
                  <span>Auto-Delete: 24h</span>
                </div>

                {onDeleteVideoMedia && currentVideoUrl && (
                  <button
                    type="button"
                    onClick={onDeleteVideoMedia}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition cursor-pointer"
                    title="Free video storage now (audit results stay saved forever)"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Video Preview Canvas / Video Tag (User plays directly with zero blocking buttons) */}
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black ring-1 ring-slate-800/80 shadow-inner group">
            {currentVideoUrl ? (
              <video
                ref={videoRef}
                src={currentVideoUrl}
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
                className="h-full w-full object-contain cursor-pointer"
                playsInline
                controls
              />
            ) : isVideoDeleted ? (
              <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center bg-slate-950 text-slate-300">
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 ring-1 ring-amber-500/30">
                  <Clock className="h-7 w-7" />
                </div>
                <p className="font-display text-sm font-bold text-white">
                  Video File Auto-Removed (Retention Expired)
                </p>
                <p className="mt-1 max-w-sm font-sans text-xs text-slate-400 leading-relaxed">
                  The heavy video file was automatically cleaned to protect creator privacy and save local storage. All audit results, timestamps, AI title, and keyframe snapshots remain permanently preserved.
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-4 flex items-center gap-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white px-4 py-2 font-sans text-xs font-bold transition cursor-pointer"
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>Upload Video to PlayScreen</span>
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`flex h-full w-full flex-col items-center justify-center p-6 text-center cursor-pointer transition hover:bg-slate-900 ${
                  isLight ? 'bg-slate-900 text-slate-300' : 'bg-slate-950 text-slate-400'
                }`}
              >
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-red-500 ring-1 ring-slate-700 shadow-sm">
                  <Film className="h-7 w-7" />
                </div>
                <p className="font-display text-base font-bold text-white">
                  PlayScreen: Upload Video Here
                </p>
                <p className="mt-1 max-w-xs font-sans text-xs text-slate-400">
                  Click or drag video directly to play yourself, scrub frames, and audit
                </p>
                <button
                  type="button"
                  className="mt-4 flex items-center gap-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white px-4 py-2 font-sans text-xs font-bold transition"
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>Choose Video File</span>
                </button>
              </div>
            )}

            {/* Professional, Clean Scanning Overlay (No cheap AI slop or lasers) */}
            {isScanning && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-md z-20 p-6 text-center"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 text-white shadow-lg shadow-red-600/30">
                  <Loader2 className="h-7 w-7 animate-spin" />
                </div>

                <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-sans font-semibold text-slate-200 mb-2">
                  <Activity className="h-3.5 w-3.5 text-red-500 animate-pulse" />
                  <span>
                    {scanProgress.percent < 35
                      ? 'Pass 1/3: 4s Temporal Slicing & Logo Detection'
                      : scanProgress.percent < 70
                      ? 'Pass 2/3: Fine Cutaways & Motion Inspection'
                      : 'Pass 3/3: Multi-Agent Policy Consensus Engine'}
                  </span>
                </div>

                <h4 className="font-display text-base font-bold text-white">
                  Auditing Video & Audio Compliance
                </h4>
                <p className="mt-1 max-w-sm font-sans text-xs text-slate-300 leading-relaxed min-h-[32px] flex items-center justify-center">
                  {scanProgress.status || 'Extracting keyframes and testing against policy rules...'}
                </p>

                {/* Clean Progress Bar */}
                <div className="mt-3 w-72 max-w-full overflow-hidden rounded-full bg-slate-800 p-0.5 ring-1 ring-white/10">
                  <motion.div
                    className="h-2 rounded-full bg-red-600"
                    initial={{ width: '0%' }}
                    animate={{ width: `${Math.max(6, scanProgress.percent)}%` }}
                    transition={{ type: 'spring', stiffness: 60, damping: 15 }}
                  />
                </div>

                <div className="mt-2 flex items-center justify-between w-72 max-w-full text-[11px] font-mono text-slate-400">
                  <span className="font-bold text-red-400">{scanProgress.percent}% Complete</span>
                  <span>Unified 3-Stage Pipeline</span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Interactive Heatmap Scrubber Timeline */}
          <div className="flex flex-col gap-2 pt-1">
            {/* Active Flagged Zone Indicator */}
            {(() => {
              const activeViolation = violations.find(
                (v) => currentTime >= v.secondsStart && currentTime <= v.secondsEnd
              );
              if (!activeViolation) return null;
              const isCrit = activeViolation.severity === 'CRITICAL_STRIKE';
              return (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className={`flex items-center justify-between rounded-xl px-3 py-2 border shadow-xs ${
                    isCrit
                      ? 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400'
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span className="font-mono text-xs font-bold shrink-0">
                      [{activeViolation.timestampStart} - {activeViolation.timestampEnd}]
                    </span>
                    <span className="font-sans text-xs font-semibold truncate">
                      {activeViolation.title}
                    </span>
                  </div>
                  <span className="shrink-0 rounded-md bg-black/10 dark:bg-white/10 px-2 py-0.5 font-sans text-[10px] font-bold uppercase">
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
              <span className="flex items-center gap-1.5 font-sans font-semibold">
                <Clock className="h-3.5 w-3.5 text-slate-500" />
                Timeline Policy Markers
              </span>
              <span className="font-sans text-[11px] text-slate-500">
                Click any colored marker to jump
              </span>
            </div>

            {/* Scrubber Bar */}
            <div
              onClick={handleScrubberClick}
              className={`group relative h-6 w-full cursor-pointer rounded-xl p-0.5 transition ${
                isLight ? 'bg-slate-200 hover:bg-slate-300/80' : 'bg-slate-800/90 hover:bg-slate-800'
              }`}
            >
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
                      3,
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
            <div className="flex items-center justify-between font-sans text-xs text-slate-500 pt-0.5">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-600" />
                  Strike Hazard
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  Monetization Alert
                </span>
                <span className="flex items-center gap-1.5">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isLight ? 'bg-slate-300' : 'bg-slate-700'
                    }`}
                  />
                  Safe Zone
                </span>
              </div>
              <span className="font-mono text-xs font-semibold">
                {videoDurationSec > 0 ? `${videoDurationSec}s total` : '0s'}
              </span>
            </div>

            {/* 1-2 Short Lines Main Issues Summary Callout in Public Sans / Satoshi */}
            {!isScanning && (videoDurationSec > 0 || currentVideoUrl) && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-2xl border p-3.5 sm:p-4 transition shadow-2xs font-public-sans mt-2 ${
                  violations.some((v) => v.severity === 'CRITICAL_STRIKE')
                    ? isLight
                      ? 'border-red-300 bg-red-50/80 text-slate-900 shadow-red-500/5'
                      : 'border-rose-500/40 bg-rose-950/25 text-slate-100'
                    : violations.length > 0
                    ? isLight
                      ? 'border-amber-300 bg-amber-50/80 text-slate-900 shadow-amber-500/5'
                      : 'border-amber-500/40 bg-amber-950/25 text-slate-100'
                    : isLight
                    ? 'border-emerald-300 bg-emerald-50/80 text-slate-900 shadow-emerald-500/5'
                    : 'border-emerald-500/40 bg-emerald-950/25 text-slate-100'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-public-sans font-bold uppercase tracking-wider ${
                        violations.some((v) => v.severity === 'CRITICAL_STRIKE')
                          ? 'bg-red-500/15 text-red-700 dark:text-red-400 border border-red-500/30'
                          : violations.length > 0
                          ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {violations.some((v) => v.severity === 'CRITICAL_STRIKE') ? (
                        <>
                          <ShieldAlert className="h-3 w-3" />
                          <span>Major YouTube Strike Hazard</span>
                        </>
                      ) : violations.length > 0 ? (
                        <>
                          <AlertTriangle className="h-3 w-3" />
                          <span>Choti Si Warning (Channel Safe)</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-3 w-3" />
                          <span>100% Clean Video (Zero Strikes)</span>
                        </>
                      )}
                    </span>
                    <span className="text-[11px] font-public-sans text-slate-500 font-semibold hidden sm:inline">
                      Main Issue Summary
                    </span>
                  </div>

                  <span className="text-[11px] font-mono text-slate-500 font-semibold">
                    {violations.length === 0 ? '0 Strikes / Clean' : `${violations.length} Flagged`}
                  </span>
                </div>

                {/* 1-2 Short Lines Headline & Detail */}
                <h4
                  className={`font-satoshi text-xs sm:text-sm font-bold tracking-tight leading-snug ${
                    violations.some((v) => v.severity === 'CRITICAL_STRIKE')
                      ? 'text-red-700 dark:text-red-400'
                      : violations.length > 0
                      ? 'text-amber-800 dark:text-amber-300'
                      : 'text-emerald-800 dark:text-emerald-300'
                  }`}
                >
                  {violations.some((v) => v.severity === 'CRITICAL_STRIKE')
                    ? `Critical Strike Hazard: ${violations.find((v) => v.severity === 'CRITICAL_STRIKE')?.title || 'Policy Infraction'}`
                    : violations.length > 0
                    ? `Minor Caution: ${violations[0]?.title || 'Presentation Cue'} (Channel Safe - Not a Strike)`
                    : 'No Strike Issues Detected (100% Clean & Safe)'}
                </h4>

                <p className="mt-0.5 font-public-sans text-xs font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                  {violations.some((v) => v.severity === 'CRITICAL_STRIKE')
                    ? 'Severe YouTube Community Guidelines violation detected. Trim or cut this segment before publishing.'
                    : violations.length > 0
                    ? 'Choti si warning: Minor ad-suitability notice. Your channel has 0 strikes and is completely safe.'
                    : 'Video complies with all YouTube Community Guidelines. Safe to monetize and publish without strikes.'}
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Right: Upload from Browser & Batch Queue (5 cols) */}
        <div
          className={`flex flex-col justify-between gap-5 rounded-3xl border p-5 sm:p-6 lg:col-span-5 transition shadow-2xs ${
            isLight
              ? 'border-slate-100 bg-white text-slate-900 shadow-slate-200/50'
              : 'border-slate-800 bg-slate-900 text-slate-100'
          }`}
        >
          <div className="flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3
                  className={`font-display text-base font-bold ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  Add Video from Browser
                </h3>
                <p className="font-sans text-xs text-slate-500 mt-0.5">
                  Select video files from your device to audit
                </p>
              </div>
              <span className="rounded-full bg-red-500/10 px-2.5 py-0.5 font-sans text-[11px] font-bold text-red-600">
                Local Ingest
              </span>
            </div>

            {/* Clean Dropzone - Matches Modern Screenshot Design */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed p-6 text-center transition-all duration-200 ${
                isDragging
                  ? isLight
                    ? 'border-red-500 bg-red-50/80 ring-4 ring-red-500/15 scale-[1.01]'
                    : 'border-red-500 bg-red-950/40 ring-4 ring-red-500/15 scale-[1.01]'
                  : isLight
                  ? 'border-slate-200 bg-slate-50/70 hover:border-red-400 hover:bg-slate-100/70'
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

              <div
                className={`mb-3 flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm transition group-hover:scale-105 ${
                  isDragging
                    ? 'bg-red-600 text-white'
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
                    ? `Drop ${draggedFilesCount > 1 ? draggedFilesCount + ' Videos' : 'Video'} to Audit`
                    : 'Drag & Drop Video Files Here'}
                </p>
                <p className="mt-1 font-sans text-xs text-slate-500">
                  or <span className="font-semibold text-red-600 underline">browse files</span> from your computer
                </p>

                {/* Formats Pills */}
                <div className="mt-3.5 flex flex-wrap items-center justify-center gap-1.5 font-sans text-[10px]">
                  <span
                    className={`rounded-md px-2 py-0.5 font-semibold ${
                      isLight ? 'bg-slate-200/80 text-slate-700' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    MP4
                  </span>
                  <span
                    className={`rounded-md px-2 py-0.5 font-semibold ${
                      isLight ? 'bg-slate-200/80 text-slate-700' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    MOV
                  </span>
                  <span
                    className={`rounded-md px-2 py-0.5 font-semibold ${
                      isLight ? 'bg-slate-200/80 text-slate-700' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    WEBM
                  </span>
                  <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-emerald-600 font-bold">
                    Batch Support
                  </span>
                </div>
              </div>
            </div>

            {/* Audit Task Queue Section */}
            <div
              className={`flex flex-col rounded-2xl border p-3.5 ${
                isLight
                  ? 'border-slate-200 bg-slate-50/70 text-slate-900'
                  : 'border-slate-800/90 bg-slate-950/50 text-slate-200'
              }`}
            >
              <div className="mb-2.5 flex items-center justify-between border-b pb-2.5 border-slate-200/80 dark:border-slate-800/80">
                <div className="flex items-center gap-2">
                  <ListOrdered className="h-4 w-4 text-red-600" />
                  <span className="font-display text-xs font-bold">
                    Video Queue ({effectiveQueueTasks.length})
                  </span>
                  {processingCount > 0 && (
                    <span className="flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 font-sans text-[10px] font-bold text-red-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                      {processingCount} Active
                    </span>
                  )}
                  {queuedCount > 0 && (
                    <span className="rounded-full bg-amber-500/10 px-2 py-0.5 font-sans text-[10px] font-bold text-amber-600">
                      {queuedCount} Queued
                    </span>
                  )}
                </div>

                {completedCount > 0 && onClearCompletedTasks && (
                  <button
                    onClick={onClearCompletedTasks}
                    className="flex items-center gap-1 font-sans text-[11px] font-semibold text-slate-500 hover:text-red-600 transition cursor-pointer"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                    <span>Clear Done</span>
                  </button>
                )}
              </div>

              {/* Task Items List */}
              <div className="flex max-h-48 flex-col gap-2 overflow-y-auto pr-0.5">
                {effectiveQueueTasks.length === 0 ? (
                  <div className="py-4 text-center">
                    <p className="font-sans text-xs text-slate-500">
                      Queue is currently empty. Drop a video above to begin!
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
                          className={`group flex flex-col gap-1.5 rounded-xl border p-2.5 text-xs transition ${
                            isActive
                              ? isLight
                                ? 'border-red-500 bg-white ring-2 ring-red-400/20 shadow-xs'
                                : 'border-red-500/80 bg-slate-900 ring-2 ring-red-500/20'
                              : isLight
                              ? 'border-slate-200 bg-white/80 hover:bg-white'
                              : 'border-slate-800 bg-slate-900/60 hover:bg-slate-900'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div
                              onClick={() => handleSelectQueued(task)}
                              className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
                            >
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
                                  <p className="truncate font-sans font-bold text-xs leading-tight">
                                    {task.title}
                                  </p>
                                  {isActive && (
                                    <span className="shrink-0 rounded-md bg-red-500/10 px-1.5 py-0.2 font-sans text-[9px] font-bold text-red-600">
                                      VIEWING
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 font-public-sans text-[10px] text-slate-500 mt-0.5">
                                  {task.fileSizeFormatted && <span>{task.fileSizeFormatted}</span>}
                                  {task.durationFormatted && task.durationFormatted !== '--:--' && (
                                    <span>• {task.durationFormatted}</span>
                                  )}
                                  <span>• {task.progressStatus}</span>
                                </div>
                                {task.report?.mainIssueHeadline && (
                                  <p className="font-public-sans text-[10.5px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-medium">
                                    {task.report.mainIssueHeadline}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Status Badge & Actions */}
                            <div className="flex items-center gap-1.5 shrink-0">
                              {isCompleted && task.report && (
                                <span
                                  className={`rounded-md px-2 py-0.5 font-sans text-[10px] font-bold ${
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
                                <span className="font-mono text-xs font-bold text-red-500">
                                  {task.progressPercent}%
                                </span>
                              )}

                              {isQueued && (
                                <span className="rounded-md bg-slate-500/10 px-2 py-0.5 font-sans text-[10px] text-slate-500">
                                  Queued
                                </span>
                              )}

                              {handleSelectQueued && !isActive && (
                                <button
                                  onClick={() => handleSelectQueued(task)}
                                  className="rounded-lg p-1 text-slate-400 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                                  title="Inspect video"
                                >
                                  <ArrowUpRight className="h-4 w-4" />
                                </button>
                              )}

                              {handleRemoveQueued && (
                                <button
                                  onClick={() => handleRemoveQueued(task.id)}
                                  className="rounded-lg p-1 text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                                  title="Remove from queue"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Individual Task Progress Bar */}
                          <div className="mt-1 flex items-center gap-2">
                            <div className="h-1.5 flex-1 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${
                                  isCompleted
                                    ? 'bg-emerald-500 w-full'
                                    : isError
                                    ? 'bg-red-500 w-full'
                                    : 'bg-red-600 animate-pulse'
                                }`}
                                style={{ width: `${isCompleted || isError ? 100 : task.progressPercent || 5}%` }}
                              />
                            </div>
                            <span className="font-mono text-[9px] font-bold text-slate-400 shrink-0">
                              {isCompleted ? '100%' : `${task.progressPercent || 0}%`}
                            </span>
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

            {/* Note */}
            <div
              className={`rounded-2xl border p-3 text-xs ${
                isLight
                  ? 'border-slate-200 bg-slate-50/80 text-slate-600'
                  : 'border-slate-800/80 bg-slate-950/40 text-slate-400'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                <p className="font-sans leading-relaxed">
                  Checks your upload against copyright, physical safety, COPPA minor safety, and YouTube advertiser suitability.
                </p>
              </div>
            </div>
          </div>

          {/* Action Trigger Button */}
          <div className="pt-2">
            <button
              onClick={onTriggerAudit}
              disabled={isScanning}
              className={`flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 font-display text-sm font-bold tracking-tight text-white shadow-md transition cursor-pointer ${
                isScanning
                  ? 'cursor-not-allowed bg-slate-400 text-white'
                  : 'bg-red-600 hover:bg-red-700 shadow-red-600/20 active:scale-[0.99]'
              }`}
            >
              <Sparkles className="h-4 w-4" />
              <span>
                {isScanning ? 'Auditing Video Guidelines...' : 'Run Guidelines Audit on Video'}
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
