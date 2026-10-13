export interface ExtractedFrame {
  timestamp: string; // "00:04"
  seconds: number;
  dataUrl: string;
  clipIndex: number;
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
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export async function extractVideoMetadataAndFrames(
  file: File,
  onProgress?: (percent: number, status: string) => void
): Promise<{ metadata: VideoMetadata; frames: ExtractedFrame[] }> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = objectUrl;
    video.muted = true;
    video.playsInline = true;

    video.onloadedmetadata = async () => {
      try {
        const duration = video.duration || 10;
        const width = video.videoWidth || 640;
        const height = video.videoHeight || 360;

        const metadataBase: VideoMetadata = {
          duration,
          durationFormatted: formatTime(duration),
          width,
          height,
          fileName: file.name,
          fileSizeMb: Number((file.size / (1024 * 1024)).toFixed(2)),
          objectUrl,
          clips: [],
        };

        const canvas = document.createElement('canvas');
        const targetWidth = Math.min(width, 480);
        const targetHeight = Math.round((targetWidth / width) * height);
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          throw new Error('Canvas 2D context could not be created');
        }

        const allFrames: ExtractedFrame[] = [];
        const clips: ExtractedClip[] = [];

        // 2-5 second overlapping chunk strategy:
        // Create overlapping windows of 3 seconds (e.g. 0-3s, 2-5s, 4-7s, etc., spaced every 2 seconds)
        const step = 2; // sample every 2 seconds
        const clipWindow = 3; // 3-second temporal clips
        
        const totalDuration = Math.max(duration, 3);
        const timestamps: number[] = [];
        for (let t = 0; t < totalDuration; t += step) {
          timestamps.push(t);
        }
        if (timestamps[timestamps.length - 1] < totalDuration - 0.5) {
          timestamps.push(totalDuration - 0.5);
        }

        const totalSteps = timestamps.length;
        for (let i = 0; i < totalSteps; i++) {
          const tStart = timestamps[i];
          const tEnd = Math.min(duration, tStart + clipWindow);
          const percent = Math.round(((i + 1) / totalSteps) * 60);

          onProgress?.(
            percent,
            `[Stage 2/4] Analyzing 2-5s clip window [${formatTime(tStart)} - ${formatTime(tEnd)}] for nudity, sexual content & safety...`
          );

          // Extract 2 frames inside this clip window for deep temporal analysis
          const clipFrames: ExtractedFrame[] = [];
          const midTime = (tStart + tEnd) / 2;

          await seekVideo(video, tStart);
          ctx.drawImage(video, 0, 0, targetWidth, targetHeight);
          const startDataUrl = canvas.toDataURL('image/jpeg', 0.75);

          const startFrame: ExtractedFrame = {
            timestamp: formatTime(tStart),
            seconds: Math.round(tStart),
            dataUrl: startDataUrl,
            clipIndex: i,
          };
          clipFrames.push(startFrame);
          allFrames.push(startFrame);

          if (tEnd - tStart >= 2) {
            await seekVideo(video, midTime);
            ctx.drawImage(video, 0, 0, targetWidth, targetHeight);
            const midDataUrl = canvas.toDataURL('image/jpeg', 0.75);

            const midFrame: ExtractedFrame = {
              timestamp: formatTime(midTime),
              seconds: Math.round(midTime),
              dataUrl: midDataUrl,
              clipIndex: i,
            };
            clipFrames.push(midFrame);
            allFrames.push(midFrame);
          }

          clips.push({
            id: `clip-${i + 1}`,
            clipTitle: `Clip Sector ${i + 1} (${formatTime(tStart)} - ${formatTime(tEnd)})`,
            startTime: formatTime(tStart),
            endTime: formatTime(tEnd),
            startSec: Math.round(tStart),
            endSec: Math.round(tEnd),
            frames: clipFrames,
            primarySnapshot: startDataUrl,
          });
        }

        metadataBase.clips = clips;
        resolve({ metadata: metadataBase, frames: allFrames });
      } catch (err) {
        reject(err);
      }
    };

    video.onerror = () => {
      reject(new Error('Failed to load video file: ' + (video.error?.message || 'Unsupported format')));
    };
  });
}

function seekVideo(video: HTMLVideoElement, time: number): Promise<void> {
  return new Promise((resolve) => {
    const onSeeked = () => {
      video.removeEventListener('seeked', onSeeked);
      resolve();
    };
    video.addEventListener('seeked', onSeeked);
    video.currentTime = time;
  });
}
