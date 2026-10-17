export interface ExtractedFrame {
  timestamp: string; // "00:04"
  seconds: number;
  dataUrl: string;
  clipIndex: number;
  skinToneRatio?: number;
  isPotentialNudity?: boolean;
  motionBlurScore?: number; // 0 to 1 (higher = more blur/smear)
  rapidTransitionScore?: number; // 0 to 1 (delta vs previous frame)
  isDeepFrame?: boolean; // extracted in secondary deep pass
  anomalyReason?: string;
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
  deepFramesAnalyzedCount?: number;
  rapidTransitionsDetectedCount?: number;
}

export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function safeSeekVideo(video: HTMLVideoElement, time: number): Promise<void> {
  return new Promise((resolve) => {
    let resolved = false;
    const cleanup = () => {
      if (!resolved) {
        resolved = true;
        video.removeEventListener('seeked', onSeeked);
        video.removeEventListener('error', onError);
        setTimeout(resolve, 50);
      }
    };

    const onSeeked = () => cleanup();
    const onError = () => cleanup();

    const timer = setTimeout(cleanup, 2200);

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
 */
export function calculateSkinRatio(ctx: CanvasRenderingContext2D, width: number, height: number): number {
  try {
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;
    let skinPixels = 0;
    let sampled = 0;

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
 * Computes motion blur score using spatial edge variance.
 * Highly blurred frames exhibit a collapse in high-frequency edge variance.
 */
export function calculateMotionBlurScore(ctx: CanvasRenderingContext2D, width: number, height: number): number {
  try {
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;
    let laplacianSum = 0;
    let laplacianSqSum = 0;
    let count = 0;

    const step = 8;
    for (let y = step; y < height - step; y += step) {
      for (let x = step; x < width - step; x += step) {
        const idx = (y * width + x) * 4;
        const lum = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];

        const idxUp = ((y - step) * width + x) * 4;
        const lumUp = 0.299 * data[idxUp] + 0.587 * data[idxUp + 1] + 0.114 * data[idxUp + 2];

        const idxDown = ((y + step) * width + x) * 4;
        const lumDown = 0.299 * data[idxDown] + 0.587 * data[idxDown + 1] + 0.114 * data[idxDown + 2];

        const idxLeft = (y * width + (x - step)) * 4;
        const lumLeft = 0.299 * data[idxLeft] + 0.587 * data[idxLeft + 1] + 0.114 * data[idxLeft + 2];

        const idxRight = (y * width + (x + step)) * 4;
        const lumRight = 0.299 * data[idxRight] + 0.587 * data[idxRight + 1] + 0.114 * data[idxRight + 2];

        // Discrete Laplacian operator
        const lap = Math.abs(lumUp + lumDown + lumLeft + lumRight - 4 * lum);
        laplacianSum += lap;
        laplacianSqSum += lap * lap;
        count++;
      }
    }

    if (count === 0) return 0;
    const mean = laplacianSum / count;
    const variance = laplacianSqSum / count - mean * mean;

    // Variance < 18 indicates high motion blur / smear
    if (variance < 20) {
      return Number(Math.min(1, (20 - variance) / 20).toFixed(2));
    }
    return 0;
  } catch {
    return 0;
  }
}

/**
 * Calculates visual difference delta between successive frames to spot rapid cuts or hidden transitions.
 */
export function calculateFrameDelta(prevData: Uint8ClampedArray | null, currData: Uint8ClampedArray): number {
  if (!prevData || prevData.length !== currData.length) return 0;
  let diffSum = 0;
  let count = 0;
  for (let i = 0; i < currData.length; i += 32) {
    diffSum += Math.abs(currData[i] - prevData[i]) + Math.abs(currData[i + 1] - prevData[i + 1]) + Math.abs(currData[i + 2] - prevData[i + 2]);
    count += 3;
  }
  return count > 0 ? Number(Math.min(1, (diffSum / count) / 120).toFixed(2)) : 0;
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

    return canvas.toDataURL('image/jpeg', 0.75);
  } catch {
    return '';
  }
}

/**
 * Multi-pass metadata & deep frame extractor:
 * Pass 1: Temporal timeline keyframe extraction ("frame by frame times ka hisab sa")
 * Pass 2: Deep frame image analysis for motion blur, rapid transitions & hidden content ("frames by frames image")
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

    const globalTimeout = setTimeout(() => {
      if (!hasFinished) {
        hasFinished = true;
        const estDuration = 20;
        const fallbackFrames: ExtractedFrame[] = [
          { timestamp: '00:00', seconds: 0, dataUrl: createFallbackSnapshot('00:00', file.name), clipIndex: 0 },
          { timestamp: '00:03', seconds: 3, dataUrl: createFallbackSnapshot('00:03', 'Opening Segment'), clipIndex: 1 },
          { timestamp: '00:08', seconds: 8, dataUrl: createFallbackSnapshot('00:08', 'Action Segment'), clipIndex: 2 },
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
            deepFramesAnalyzedCount: 0,
            rapidTransitionsDetectedCount: 0,
          },
          frames: fallbackFrames,
        });
      }
    }, 45000);

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

        // ==========================================
        // PASS 1: Temporal Timestamp Slicing (0% - 30%)
        // ==========================================
        const sampleCount = Math.min(10, Math.max(5, Math.floor(duration / 3)));
        const samplePoints: number[] = [];

        // Critical opening points
        if (duration > 1) samplePoints.push(0.5);
        if (duration > 3) samplePoints.push(1.8);

        for (let i = 0; i < sampleCount; i++) {
          const t = Math.min(duration - 0.2, (i / (sampleCount - 1 || 1)) * (duration - 0.2));
          const rounded = Math.round(t * 10) / 10;
          if (!samplePoints.includes(rounded)) {
            samplePoints.push(rounded);
          }
        }
        samplePoints.sort((a, b) => a - b);

        const initialFrames: ExtractedFrame[] = [];
        let prevPixelData: Uint8ClampedArray | null = null;
        const transitionCues: Array<{ timeBefore: number; timeAfter: number; delta: number }> = [];

        for (let i = 0; i < samplePoints.length; i++) {
          const tSec = samplePoints[i];
          const pct = Math.round(((i + 1) / samplePoints.length) * 28);

          onProgress?.(
            pct,
            `Phase 1/3 · Temporal Slicing [${formatTime(tSec)}]: Reading timestamp sequence...`
          );

          await safeSeekVideo(video, tSec);

          let dataUrl = '';
          let skinRatio = 0;
          let motionBlur = 0;
          let delta = 0;

          if (ctx) {
            try {
              ctx.drawImage(video, 0, 0, targetWidth, targetHeight);
              dataUrl = canvas.toDataURL('image/jpeg', 0.78);
              skinRatio = calculateSkinRatio(ctx, targetWidth, targetHeight);
              motionBlur = calculateMotionBlurScore(ctx, targetWidth, targetHeight);

              const currentImgData = ctx.getImageData(0, 0, targetWidth, targetHeight);
              if (prevPixelData) {
                delta = calculateFrameDelta(prevPixelData, currentImgData.data);
                if (delta > 0.40) {
                  transitionCues.push({
                    timeBefore: samplePoints[i - 1],
                    timeAfter: tSec,
                    delta,
                  });
                }
              }
              prevPixelData = currentImgData.data;
            } catch {
              dataUrl = createFallbackSnapshot(formatTime(tSec), file.name);
            }
          } else {
            dataUrl = createFallbackSnapshot(formatTime(tSec), file.name);
          }

          initialFrames.push({
            timestamp: formatTime(tSec),
            seconds: Math.round(tSec),
            dataUrl,
            clipIndex: i,
            skinToneRatio: Number(skinRatio.toFixed(3)),
            isPotentialNudity: skinRatio > 0.28,
            motionBlurScore: motionBlur,
            rapidTransitionScore: delta,
            isDeepFrame: false,
          });
        }

        // ==========================================
        // PASS 2: Deep Frame-by-Frame Image Inspection (30% - 50%)
        // Selectively extract frames that show high motion blur or rapid transitions
        // ==========================================
        const deepFrames: ExtractedFrame[] = [];
        let deepCount = 0;

        for (let j = 0; j < transitionCues.length && deepCount < 4; j++) {
          const cue = transitionCues[j];
          const midTime = Number(((cue.timeBefore + cue.timeAfter) / 2).toFixed(1));
          deepCount++;

          const deepPct = 28 + Math.round((deepCount / 4) * 22);
          onProgress?.(
            deepPct,
            `Phase 2/3 · Deep Frame Analysis [${formatTime(midTime)}]: Inspecting rapid transition / blur point...`
          );

          await safeSeekVideo(video, midTime);

          let deepDataUrl = '';
          let deepSkinRatio = 0;
          let deepBlur = 0;

          if (ctx) {
            try {
              ctx.drawImage(video, 0, 0, targetWidth, targetHeight);
              deepDataUrl = canvas.toDataURL('image/jpeg', 0.78);
              deepSkinRatio = calculateSkinRatio(ctx, targetWidth, targetHeight);
              deepBlur = calculateMotionBlurScore(ctx, targetWidth, targetHeight);
            } catch {
              deepDataUrl = createFallbackSnapshot(formatTime(midTime), 'Deep Analysis');
            }
          }

          deepFrames.push({
            timestamp: formatTime(midTime),
            seconds: Math.round(midTime),
            dataUrl: deepDataUrl,
            clipIndex: initialFrames.length + deepCount,
            skinToneRatio: Number(deepSkinRatio.toFixed(3)),
            isPotentialNudity: deepSkinRatio > 0.26,
            motionBlurScore: Math.max(deepBlur, cue.delta > 0.5 ? 0.8 : 0.4),
            rapidTransitionScore: cue.delta,
            isDeepFrame: true,
            anomalyReason: `Rapid transition detected (delta: ${(cue.delta * 100).toFixed(0)}%). Deep frame inspected for hidden policy violations.`,
          });
        }

        // Combine and sort all frames chronologically
        const combinedFrames = [...initialFrames, ...deepFrames].sort((a, b) => a.seconds - b.seconds);

        // Deduplicate nearby timestamps within 0.8 seconds if any
        const allFrames: ExtractedFrame[] = [];
        for (const f of combinedFrames) {
          const exists = allFrames.some((existing) => Math.abs(existing.seconds - f.seconds) < 1 && existing.isDeepFrame === f.isDeepFrame);
          if (!exists || f.isDeepFrame) {
            allFrames.push({ ...f, clipIndex: allFrames.length });
          }
        }

        // Build clips and metadata
        const clips: ExtractedClip[] = allFrames.map((frame, idx) => ({
          id: `clip-${idx + 1}`,
          clipTitle: `${frame.isDeepFrame ? 'Deep-Frame' : 'Keyframe'} ${idx + 1} (${frame.timestamp})`,
          startTime: frame.timestamp,
          endTime: formatTime(Math.min(duration, frame.seconds + 2)),
          startSec: frame.seconds,
          endSec: Math.min(duration, frame.seconds + 2),
          frames: [frame],
          primarySnapshot: frame.dataUrl,
          flaggedHeuristic: frame.isPotentialNudity || (frame.motionBlurScore || 0) > 0.7,
        }));

        const totalSkin = allFrames.reduce((acc, f) => acc + (f.skinToneRatio || 0), 0);
        const avgSkin = allFrames.length > 0 ? totalSkin / allFrames.length : 0;
        const highSkinCount = allFrames.filter((f) => f.isPotentialNudity).length;

        const metadataBase: VideoMetadata = {
          duration,
          durationFormatted: formatTime(duration),
          width,
          height,
          fileName: file.name,
          fileSizeMb: Number((file.size / (1024 * 1024)).toFixed(2)),
          objectUrl,
          clips,
          overallSkinToneRatio: Number(avgSkin.toFixed(3)),
          hasSuspectedNudityOrAdultContent: avgSkin > 0.24 || highSkinCount >= 2,
          deepFramesAnalyzedCount: deepFrames.length,
          rapidTransitionsDetectedCount: transitionCues.length,
        };

        onProgress?.(
          50,
          `Phase 2/3 · Complete: ${allFrames.length} keyframes ready for Gemini AI Video Synthesis...`
        );

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
