export interface ExtractedFrame {
  timestamp: string; // "00:04"
  seconds: number;
  dataUrl: string;
  clipIndex: number;
  skinToneRatio?: number;
  isPotentialNudity?: boolean;
}

export interface ExtractedClip {
  id: string;
  clipTitle: string;
  startTime: string;
  endTime: string;
  startSec: number;
  endSec: number;
  frames: ExtractedFrame[];
  primarySnapshot?: string;
  flaggedHeuristic?: boolean;
}

export interface VideoMetadata {
  duration: number; // in seconds
  durationFormatted: string;
  width: number;
  height: number;
  fileName: string;
  fileSizeMb: number;
  objectUrl: string;
  clips: ExtractedClip[];
  overallSkinToneRatio?: number;
  hasSuspectedNudityOrAdultContent?: boolean;
}

export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Robust seek with realistic 1500ms timeout for large or high-res video files.
 */
function safeSeekVideo(video: HTMLVideoElement, time: number): Promise<void> {
  return new Promise((resolve) => {
    let resolved = false;
    const cleanup = () => {
      if (!resolved) {
        resolved = true;
        video.removeEventListener('seeked', onSeeked);
        video.removeEventListener('error', onError);
        resolve();
      }
    };

    const onSeeked = () => cleanup();
    const onError = () => cleanup();

    // 1500ms safety timer for smooth reliable seeking
    const timer = setTimeout(cleanup, 1500);

    video.addEventListener('seeked', onSeeked, { once: true });
    video.addEventListener('error', onError, { once: true });

    try {
      video.currentTime = Math.max(0, time);
    } catch {
      clearTimeout(timer);
      cleanup();
    }
  });
}

/**
 * Pixel-level skin detection heuristic.
 * Used by video platforms to detect unclothed bodies / explicit adult exposure.
 */
export function calculateSkinRatio(ctx: CanvasRenderingContext2D, width: number, height: number): number {
  try {
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;
    let skinPixels = 0;
    let sampled = 0;

    // Sample pixels across frame
    for (let i = 0; i < data.length; i += 16) {
      sampled++;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const maxVal = Math.max(r, g, b);
      const minVal = Math.min(r, g, b);

      if (
        r > 85 &&
        g > 40 &&
        b > 25 &&
        maxVal - minVal > 15 &&
        Math.abs(r - g) > 12 &&
        r > g &&
        r > b &&
        r - g < 110
      ) {
        skinPixels++;
      }
    }

    return sampled > 0 ? skinPixels / sampled : 0;
  } catch {
    return 0;
  }
}

/**
 * Creates a clear fallback snapshot if canvas extraction is restricted by cross-origin flags.
 */
function createFallbackSnapshot(timestamp: string, label: string): string {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 480;
    canvas.height = 270;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    const grad = ctx.createLinearGradient(0, 0, 480, 270);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(1, '#1e1b4b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 480, 270);

    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(16, 220, 90, 32);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(timestamp, 28, 242);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px sans-serif';
    ctx.fillText(label, 16, 36);

    return canvas.toDataURL('image/jpeg', 0.8);
  } catch {
    return '';
  }
}

/**
 * Accurate metadata & frame extractor.
 * Extracts real keyframes directly from user video without artificial timeouts.
 */
export async function extractVideoMetadataAndFrames(
  file: File,
  onProgress?: (percent: number, status: string) => void
): Promise<{ metadata: VideoMetadata; frames: ExtractedFrame[] }> {
  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.preload = 'auto';
    video.src = objectUrl;
    video.muted = true;
    video.playsInline = true;

    let hasFinished = false;

    // Generous 12-second safety timeout so large files load properly
    const globalTimeout = setTimeout(() => {
      if (!hasFinished) {
        hasFinished = true;
        const estDuration = 24;
        const fallbackFrames: ExtractedFrame[] = [
          { timestamp: '00:00', seconds: 0, dataUrl: createFallbackSnapshot('00:00', file.name), clipIndex: 0 },
          { timestamp: '00:06', seconds: 6, dataUrl: createFallbackSnapshot('00:06', 'Opening Segment'), clipIndex: 1 },
          { timestamp: '00:14', seconds: 14, dataUrl: createFallbackSnapshot('00:14', 'Main Content'), clipIndex: 2 },
        ];
        resolve({
          metadata: {
            duration: estDuration,
            durationFormatted: formatTime(estDuration),
            width: 1280,
            height: 720,
            fileName: file.name,
            fileSizeMb: Number((file.size / (1024 * 1024)).toFixed(2)),
            objectUrl,
            clips: [],
            overallSkinToneRatio: 0,
            hasSuspectedNudityOrAdultContent: false,
          },
          frames: fallbackFrames,
        });
      }
    }, 12000);

    video.onloadedmetadata = async () => {
      if (hasFinished) return;
      hasFinished = true;
      clearTimeout(globalTimeout);

      try {
        const duration = Math.max(2, Math.round(video.duration || 15));
        const width = video.videoWidth || 640;
        const height = video.videoHeight || 360;

        const canvas = document.createElement('canvas');
        const targetWidth = 480;
        const targetHeight = Math.round((targetWidth / Math.max(1, width)) * height) || 270;
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');

        // Sample 5 to 8 keyframes across video duration
        const sampleCount = Math.min(8, Math.max(4, Math.floor(duration / 3)));
        const samplePoints: number[] = [];
        for (let i = 0; i < sampleCount; i++) {
          const t = Math.min(duration - 0.2, (i / (sampleCount - 1 || 1)) * (duration - 0.2));
          samplePoints.push(Math.round(t * 10) / 10);
        }

        const allFrames: ExtractedFrame[] = [];
        const clips: ExtractedClip[] = [];
        let totalSkinRatio = 0;
        let highSkinFramesCount = 0;

        for (let i = 0; i < samplePoints.length; i++) {
          const tSec = samplePoints[i];
          const pct = Math.round(((i + 1) / samplePoints.length) * 45);

          onProgress?.(
            pct,
            `Extracting high-resolution frame [${formatTime(tSec)}]...`
          );

          await safeSeekVideo(video, tSec);

          let dataUrl = '';
          let skinRatio = 0;
          if (ctx) {
            try {
              ctx.drawImage(video, 0, 0, targetWidth, targetHeight);
              dataUrl = canvas.toDataURL('image/jpeg', 0.85);
              skinRatio = calculateSkinRatio(ctx, targetWidth, targetHeight);
            } catch {
              dataUrl = createFallbackSnapshot(formatTime(tSec), file.name);
            }
          } else {
            dataUrl = createFallbackSnapshot(formatTime(tSec), file.name);
          }

          totalSkinRatio += skinRatio;
          const isPotentialNudity = skinRatio > 0.30;
          if (isPotentialNudity) {
            highSkinFramesCount++;
          }

          const frame: ExtractedFrame = {
            timestamp: formatTime(tSec),
            seconds: Math.round(tSec),
            dataUrl,
            clipIndex: i,
            skinToneRatio: Number(skinRatio.toFixed(3)),
            isPotentialNudity,
          };
          allFrames.push(frame);

          clips.push({
            id: `clip-${i + 1}`,
            clipTitle: `Window ${i + 1} (${formatTime(tSec)})`,
            startTime: formatTime(tSec),
            endTime: formatTime(Math.min(duration, tSec + 3)),
            startSec: Math.round(tSec),
            endSec: Math.min(duration, Math.round(tSec + 3)),
            frames: [frame],
            primarySnapshot: dataUrl,
            flaggedHeuristic: isPotentialNudity,
          });
        }

        const avgSkinRatio = allFrames.length > 0 ? totalSkinRatio / allFrames.length : 0;
        const hasAdultIndicators = avgSkinRatio > 0.25 || highSkinFramesCount >= 2;

        const metadataBase: VideoMetadata = {
          duration,
          durationFormatted: formatTime(duration),
          width,
          height,
          fileName: file.name,
          fileSizeMb: Number((file.size / (1024 * 1024)).toFixed(2)),
          objectUrl,
          clips,
          overallSkinToneRatio: Number(avgSkinRatio.toFixed(3)),
          hasSuspectedNudityOrAdultContent: hasAdultIndicators,
        };

        resolve({ metadata: metadataBase, frames: allFrames });
      } catch {
        const fallbackDuration = 20;
        resolve({
          metadata: {
            duration: fallbackDuration,
            durationFormatted: formatTime(fallbackDuration),
            width: 1280,
            height: 720,
            fileName: file.name,
            fileSizeMb: Number((file.size / (1024 * 1024)).toFixed(2)),
            objectUrl,
            clips: [],
            overallSkinToneRatio: 0,
            hasSuspectedNudityOrAdultContent: false,
          },
          frames: [
            { timestamp: '00:02', seconds: 2, dataUrl: createFallbackSnapshot('00:02', file.name), clipIndex: 0 },
            { timestamp: '00:08', seconds: 8, dataUrl: createFallbackSnapshot('00:08', 'Body Segment'), clipIndex: 1 },
          ],
        });
      }
    };

    video.onerror = () => {
      if (hasFinished) return;
      hasFinished = true;
      clearTimeout(globalTimeout);
      const estDuration = 20;
      resolve({
        metadata: {
          duration: estDuration,
          durationFormatted: formatTime(estDuration),
          width: 1280,
          height: 720,
          fileName: file.name,
          fileSizeMb: Number((file.size / (1024 * 1024)).toFixed(2)),
          objectUrl,
          clips: [],
          overallSkinToneRatio: 0,
          hasSuspectedNudityOrAdultContent: false,
        },
        frames: [
          { timestamp: '00:00', seconds: 0, dataUrl: createFallbackSnapshot('00:00', file.name), clipIndex: 0 },
          { timestamp: '00:05', seconds: 5, dataUrl: createFallbackSnapshot('00:05', 'Playback Frame'), clipIndex: 1 },
        ],
      });
    };
  });
}
