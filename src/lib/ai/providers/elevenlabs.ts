import { ISpeechModel, SpeechGenOptions, ModelResult } from "../interfaces";
import { prisma } from "@/lib/db";

/**
 * Real ElevenLabs Speech Generation Adapter (Eleven Flash v2.5 / Multilingual v2)
 * Cost: ~$0.015 / 1,000 characters
 */
export class ElevenLabsAdapter implements ISpeechModel {
  private apiKey: string;
  private modelId: string;

  constructor(apiKey?: string, modelId: string = "eleven_flash_v2_5") {
    this.apiKey = apiKey || process.env.ELEVENLABS_API_KEY || "";
    this.modelId = modelId;
  }

  async synthesizeSpeech(options: SpeechGenOptions): Promise<ModelResult<{ audioUrl: string; durationSec: number }>> {
    if (!this.apiKey) {
      throw new Error("ELEVENLABS_API_KEY environment variable is not configured for paid speech synthesis.");
    }

    const start = Date.now();
    const voiceId = options.voiceId || "21m00Tcm4TlvDq8ikWAM"; // Default Rachel voice
    const charCount = options.text.length;

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "xi-api-key": this.apiKey,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg",
      },
      body: JSON.stringify({
        text: options.text,
        model_id: this.modelId,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          speed: options.speed ?? 1.0,
        },
      }),
    });

    const latencyMs = Date.now() - start;

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`ElevenLabs API error (${response.status}): ${err}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Audio = `data:audio/mpeg;base64,${buffer.toString("base64")}`;
    const durationSec = Math.max(2, Math.round(charCount / 15));
    const costUsd = parseFloat(((charCount / 1000) * 0.015).toFixed(4));

    // Record in UsageLedger
    await prisma.usageLedger.create({
      data: {
        organizationId: options.organizationId,
        workspaceId: options.workspaceId,
        provider: "elevenlabs",
        model: this.modelId,
        modality: "speech",
        unitsConsumed: charCount,
        costUsd,
        latencyMs,
        status: "SUCCESS",
      },
    });

    return {
      data: { audioUrl: base64Audio, durationSec },
      telemetry: {
        provider: "elevenlabs",
        model: this.modelId,
        latencyMs,
        unitsConsumed: charCount,
        costUsd,
      },
    };
  }
}
