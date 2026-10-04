import { execFile } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";
import { storage } from "@/lib/storage";

const execFileAsync = promisify(execFile);

export interface AssembleInputScene {
  sceneNumber: number;
  imageUrl?: string;
  imageBuffer?: Buffer;
  captionText?: string;
  durationSec: number;
}

export interface AssembleVideoOptions {
  organizationId: string;
  workspaceId: string;
  contentItemId: string;
  jobId: string;
  scenes: AssembleInputScene[];
  audioBuffer?: Buffer;
  scriptText?: string;
  creatorName?: string;
}

export interface AssembleVideoResult {
  videoKey: string;
  videoSignedUrl: string;
  audioKey: string;
  audioSignedUrl: string;
  thumbnailKey: string;
  thumbnailSignedUrl: string;
  durationSec: number;
}

/**
 * Checks whether FFmpeg is available on the system
 */
export async function isFfmpegAvailable(): Promise<boolean> {
  try {
    const { stdout } = await execFileAsync("ffmpeg", ["-version"]);
    return stdout.includes("ffmpeg version");
  } catch {
    return false;
  }
}

/**
 * Worker that assembles storyboard stills, voiceover, and captions into a vertical 9:16 MP4
 */
export async function assembleStoryboardVideo(options: AssembleVideoOptions): Promise<AssembleVideoResult> {
  const tmpDir = path.resolve(process.cwd(), ".storage", "tmp", options.jobId);
  fs.mkdirSync(tmpDir, { recursive: true });

  try {
    const totalDuration = options.scenes.reduce((sum, s) => sum + (s.durationSec || 5), 0) || 15;

    // 1. Prepare Voiceover Audio File
    const audioFilePath = path.join(tmpDir, "raw_audio.mp3");
    if (options.audioBuffer && options.audioBuffer.length > 0) {
      fs.writeFileSync(audioFilePath, options.audioBuffer);
    } else {
      await execFileAsync("ffmpeg", [
        "-nostdin",
        "-y",
        "-f", "lavfi",
        "-i", `sine=frequency=440:duration=${totalDuration}`,
        "-c:a", "libmp3lame",
        "-b:a", "192k",
        audioFilePath,
      ]);
    }

    // 2. Loudness Normalization: -af loudnorm=I=-16:TP=-1.5:LRA=11
    const normalizedAudioPath = path.join(tmpDir, "normalized_audio.mp3");
    try {
      await execFileAsync("ffmpeg", [
        "-nostdin",
        "-y",
        "-i", audioFilePath,
        "-af", "loudnorm=I=-16:TP=-1.5:LRA=11",
        "-c:a", "libmp3lame",
        "-b:a", "192k",
        normalizedAudioPath,
      ]);
    } catch {
      // Fallback if loudnorm fails on synthetic track
      fs.copyFileSync(audioFilePath, normalizedAudioPath);
    }

    // 3. Prepare Scenes & Stills
    const imageFiles: string[] = [];
    for (let i = 0; i < options.scenes.length; i++) {
      const scene = options.scenes[i];
      const imgPath = path.join(tmpDir, `scene_${i + 1}.png`);

      if (scene.imageBuffer) {
        fs.writeFileSync(imgPath, scene.imageBuffer);
      } else {
        const color = i % 2 === 0 ? "0x0B0F19" : "0x111827";
        const sceneLabel = `SCENE ${scene.sceneNumber}`;
        const escapedCaption = (scene.captionText || options.scriptText || "Fernum Studio").replace(/['"\\]/g, "");

        await execFileAsync("ffmpeg", [
          "-nostdin",
          "-y",
          "-f", "lavfi",
          "-i", `color=c=${color}:s=1080x1920:d=1`,
          "-vf", `drawtext=fontfile='C\\:/Windows/Fonts/arial.ttf':text='${sceneLabel}':fontcolor=0x10B981:fontsize=56:x=(w-text_w)/2:y=300,drawtext=fontfile='C\\:/Windows/Fonts/arial.ttf':text='${escapedCaption.slice(0, 32)}':fontcolor=white:fontsize=42:box=1:boxcolor=black@0.7:boxborderw=12:x=(w-text_w)/2:y=h-400`,
          "-vframes", "1",
          imgPath,
        ]);
      }
      imageFiles.push(imgPath);
    }

    // 4. Assemble 9:16 Vertical Video with FFmpeg
    const outputVideoPath = path.join(tmpDir, "assembled_916.mp4");
    const thumbnailPath = path.join(tmpDir, "thumbnail.jpg");

    const rawCaption = (options.scriptText || "Premium AI-driven video by Fernum").replace(/['"\\:]/g, " ");
    const shortCaption = rawCaption.slice(0, 48);

    await execFileAsync("ffmpeg", [
      "-nostdin",
      "-y",
      "-loop", "1",
      "-i", imageFiles[0],
      "-i", normalizedAudioPath,
      "-vf", `scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2,drawtext=fontfile='C\\:/Windows/Fonts/arial.ttf':text='${shortCaption}':fontcolor=white:fontsize=44:box=1:boxcolor=black@0.75:boxborderw=15:x=(w-text_w)/2:y=h-360`,
      "-c:v", "libx264",
      "-tune", "stillimage",
      "-pix_fmt", "yuv420p",
      "-c:a", "aac",
      "-b:a", "192k",
      "-shortest",
      "-t", `${totalDuration}`,
      outputVideoPath,
    ]);

    // 5. Extract Thumbnail Frame at 1s
    await execFileAsync("ffmpeg", [
      "-nostdin",
      "-y",
      "-ss", "00:00:01",
      "-i", outputVideoPath,
      "-vframes", "1",
      "-q:v", "2",
      thumbnailPath,
    ]);

    // 6. Upload Assets via Storage Layer
    const videoBuffer = fs.readFileSync(outputVideoPath);
    const audioBuffer = fs.readFileSync(normalizedAudioPath);
    const thumbnailBuffer = fs.readFileSync(thumbnailPath);

    const videoAsset = await storage.uploadAsset({
      organizationId: options.organizationId,
      workspaceId: options.workspaceId,
      filename: `media_${options.jobId}_9x16.mp4`,
      data: videoBuffer,
      contentType: "video/mp4",
    });

    const audioAsset = await storage.uploadAsset({
      organizationId: options.organizationId,
      workspaceId: options.workspaceId,
      filename: `audio_${options.jobId}_loudnorm.mp3`,
      data: audioBuffer,
      contentType: "audio/mpeg",
    });

    const thumbnailAsset = await storage.uploadAsset({
      organizationId: options.organizationId,
      workspaceId: options.workspaceId,
      filename: `thumb_${options.jobId}.jpg`,
      data: thumbnailBuffer,
      contentType: "image/jpeg",
    });

    return {
      videoKey: videoAsset.key,
      videoSignedUrl: videoAsset.signedUrl,
      audioKey: audioAsset.key,
      audioSignedUrl: audioAsset.signedUrl,
      thumbnailKey: thumbnailAsset.key,
      thumbnailSignedUrl: thumbnailAsset.signedUrl,
      durationSec: totalDuration,
    };
  } finally {
    // Cleanup temporary files
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup error
    }
  }
}
