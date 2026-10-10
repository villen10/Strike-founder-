export interface ExtractedFrame {
  timestamp: string; // "00:04"
  seconds: number;
  dataUrl: string;
}

export interface VideoMetadata {
  duration: number; // in seconds
  durationFormatted: string;
  width: number;
  height: number;
  fileName: string;
  fileSizeMb: number;
  objectUrl: string;
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export async function extractVideoMetadataAndFrames(
  file: File,
  frameCount: number = 8,
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

        const metadata: VideoMetadata = {
          duration,
          durationFormatted: formatTime(duration),
          width,
          height,
          fileName: file.name,
          fileSizeMb: Number((file.size / (1024 * 1024)).toFixed(2)),
          objectUrl,
        };

        const canvas = document.createElement('canvas');
        // scale down canvas to 480px width for fast AI processing and low bandwidth
        const targetWidth = Math.min(width, 480);
        const targetHeight = Math.round((targetWidth / width) * height);
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          throw new Error('Canvas 2D context could not be created');
        }

        const frames: ExtractedFrame[] = [];
        const interval = duration / (frameCount + 1);

        for (let i = 1; i <= frameCount; i++) {
          const targetTime = Math.min(duration - 0.2, interval * i);
          onProgress?.(
            Math.round((i / frameCount) * 40),
            `Scanning video motion frame ${i}/${frameCount} at ${formatTime(targetTime)}...`
          );

          await seekVideo(video, targetTime);
          ctx.drawImage(video, 0, 0, targetWidth, targetHeight);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);

          frames.push({
            timestamp: formatTime(targetTime),
            seconds: Math.round(targetTime),
            dataUrl,
          });
        }

        resolve({ metadata, frames });
      } catch (err) {
        reject(err);
      }
    };

    video.onerror = (e) => {
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
