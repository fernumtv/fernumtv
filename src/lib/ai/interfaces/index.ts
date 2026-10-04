import { prisma } from "@/lib/db";

export interface ProviderCallTelemetry {
  provider: string;
  model: string;
  latencyMs: number;
  unitsConsumed: number;
  costUsd: number;
}

export interface ModelResult<T> {
  data: T;
  telemetry: ProviderCallTelemetry;
}

// -------------------------------------------------------------
// 1. Text Model Interface & Adapters (Phase 3)
// -------------------------------------------------------------

export interface TextGenOptions {
  prompt: string;
  systemInstruction?: string;
  temperature?: number;
  maxTokens?: number;
  organizationId: string;
  workspaceId: string;
  stepContext?: string;
}

export interface ITextModel {
  generateText(options: TextGenOptions): Promise<ModelResult<{ text: string; tokensUsed: number }>>;
}

/**
 * Real Gemini API Adapter using GEMINI_API_KEY from environment
 */
export class RealGeminiAdapter implements ITextModel {
  private apiKey: string;
  private modelName: string;

  constructor(apiKey: string, modelName = "gemini-1.5-flash") {
    this.apiKey = apiKey;
    this.modelName = modelName;
  }

  async generateText(options: TextGenOptions): Promise<ModelResult<{ text: string; tokensUsed: number }>> {
    const start = Date.now();
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.modelName}:generateContent?key=${this.apiKey}`;

    const body: any = {
      contents: [{ role: "user", parts: [{ text: options.prompt }] }],
      generationConfig: {
        temperature: options.temperature ?? 0.7,
        maxOutputTokens: options.maxTokens ?? 1024,
      },
    };

    if (options.systemInstruction) {
      body.systemInstruction = {
        parts: [{ text: options.systemInstruction }],
      };
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const latencyMs = Date.now() - start;

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API returned error (${response.status}): ${errorText}`);
    }

    const json = await response.json();
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const promptTokens = json.usageMetadata?.promptTokenCount ?? Math.round(options.prompt.length / 4);
    const candidateTokens = json.usageMetadata?.candidatesTokenCount ?? Math.round(text.length / 4);
    const totalTokens = promptTokens + candidateTokens;

    // Rate: ~$0.075 / 1M prompt tokens, $0.30 / 1M output tokens (gemini-1.5-flash)
    const costUsd = parseFloat(
      ((promptTokens / 1_000_000) * 0.075 + (candidateTokens / 1_000_000) * 0.3).toFixed(6)
    );

    await prisma.usageLedger.create({
      data: {
        organizationId: options.organizationId,
        workspaceId: options.workspaceId,
        provider: "google-gemini",
        model: this.modelName,
        modality: "text",
        unitsConsumed: totalTokens,
        costUsd,
        latencyMs,
        status: "SUCCESS",
      },
    });

    return {
      data: { text, tokensUsed: totalTokens },
      telemetry: {
        provider: "google-gemini",
        model: this.modelName,
        latencyMs,
        unitsConsumed: totalTokens,
        costUsd,
      },
    };
  }
}

/**
 * Mock Text Adapter with realistic generation for Idea, Hook, Script, Storyboard, Caption, Thumbnail
 */
export class MockTextAdapter implements ITextModel {
  async generateText(options: TextGenOptions): Promise<ModelResult<{ text: string; tokensUsed: number }>> {
    const start = Date.now();
    const latencyMs = 120 + Math.floor(Math.random() * 80);
    const step = options.stepContext || "general";

    let text = "";

    if (step === "hook") {
      text = JSON.stringify([
        {
          angle: "Contrarian Biological Mechanism",
          hook: "Stop taking collagen on an empty stomach—here is the peer-reviewed biochemical reason why.",
          reasoning: "Challenges common supplement habits immediately in the first 2 seconds.",
        },
        {
          angle: "Curiosity / Personal Lab Test",
          hook: "I tracked my skin elasticity biomarkers for 30 days on marine peptides. The continuous monitor data surprised me.",
          reasoning: "Leverages creator's analytical persona and data-first credibility.",
        },
        {
          angle: "High Stakes Warning",
          hook: "If your collagen tastes like nothing, you might just be drinking chalk. Here's how to spot cold-water extraction.",
          reasoning: "Creates high discernment among premium wellness buyers.",
        },
      ]);
    } else if (step === "script") {
      text = JSON.stringify([
        {
          versionName: "Fast-Paced Clinical Breakdown",
          durationSec: 45,
          script: `[0:00 - 0:03] Stop taking collagen on an empty stomach.
[0:03 - 0:15] Most commercial peptides are denatured at high heat during extraction. If your digestive enzymes hit them without an acid co-factor, absorption plummets by 40%.
[0:15 - 0:30] For the past 30 days, I've used cold-extracted Nordic marine peptides mixed directly into lukewarm matcha tea at 7:30 AM.
[0:30 - 0:42] The result? Measurable cellular resilience without digestive distress.
[0:42 - 0:45] Check the link in bio to read our third-party clinical absorption study.`,
        },
        {
          versionName: "Story-Driven Routine",
          durationSec: 55,
          script: `[0:00 - 0:04] I used to think all collagen supplements were essentially the same marketing gimmick.
[0:04 - 0:20] Then I looked at the molecular weight profiles. Hydrolyzed low-Dalton peptides actually cross the intestinal barrier into cellular circulation.
[0:20 - 0:35] Here's my morning protocol: 10 grams of sustainably harvested marine peptides, paired with bioavailable adaptogens.
[0:35 - 0:50] No artificial fillers, zero heavy metals, and verified batch certificates.
[0:50 - 0:55] Protocol link in bio for the full clinical whitepaper.`,
        },
      ]);
    } else if (step === "storyboard") {
      text = JSON.stringify({
        scenes: [
          {
            sceneNumber: 1,
            timecode: "0:00 - 0:03",
            shotType: "Extreme Close-Up",
            visualPrompt: "Creator looking directly into lens with intense, calm expression, modern biochemical laboratory background.",
            audioNotes: "Sharp cut, voiceover starts immediately without background music.",
          },
          {
            sceneNumber: 2,
            timecode: "0:03 - 0:15",
            shotType: "Macro B-Roll with Graphic Overlay",
            visualPrompt: "3D molecular visualization of collagen triple-helix peptide chain breaking down, clean green neon callouts.",
            audioNotes: "Subtle low-frequency synth pulse.",
          },
          {
            sceneNumber: 3,
            timecode: "0:15 - 0:30",
            shotType: "Medium Profile Shot",
            visualPrompt: "Creator stirring pure white peptide powder into a glass of organic emerald matcha tea, natural morning sunlight.",
            audioNotes: "Satisfying ambient ASMR stirring sounds.",
          },
          {
            sceneNumber: 4,
            timecode: "0:30 - 0:45",
            shotType: "Direct to Camera Talking Head",
            visualPrompt: "Creator holding unbranded glass jar with minimal label, smiling warmly, text overlay with CTA.",
            audioNotes: "Crescendo in background audio, crisp final cadence.",
          },
        ],
      });
    } else if (step === "caption") {
      text = JSON.stringify({
        caption: `Are you actually absorbing your daily collagen? 🧬\n\nMost wellness supplements skip the bioavailability step. When peptides are extracted using high-heat industrial processes, the molecular weight often exceeds what intestinal microvilli can transport.\n\nOur morning longevity routine: 10g cold-extracted marine peptides in lukewarm matcha.\n\nMandatory disclaimer: #Ad #SupplementDisclosure. These statements have not been evaluated by the FDA. Link in bio for our 30-day absorption trial kit.`,
        hashtags: ["#CellularHealth", "#Biohacking", "#LongevityProtocol", "#MarineCollagen", "#ScienceBacked"],
      });
    } else if (step === "thumbnail") {
      text = JSON.stringify({
        conceptTitle: "The Collagen Bioavailability Lie",
        visualPrompt: "Split screen: left side cloudy degraded supplement bottle in red hue, right side ultra-clear cellular peptide structure in emerald green, bold yellow typography 'STOP TAKING THIS'.",
        overlayText: "STOP TAKING THIS ⚠️",
        recommendedColorPalette: ["#10B981", "#EF4444", "#0F172A"],
      });
    } else {
      text = `Grounded idea: Cellular longevity protocol targeting entrepreneurs looking to optimize slow-wave sleep and morning cognitive resilience using clean marine peptides.`;
    }

    const promptTokens = Math.round(options.prompt.length / 4);
    const completionTokens = Math.round(text.length / 4);
    const totalTokens = promptTokens + completionTokens;
    const costUsd = parseFloat(((totalTokens / 1_000_000) * 0.15).toFixed(6)) || 0.0002;

    await prisma.usageLedger.create({
      data: {
        organizationId: options.organizationId,
        workspaceId: options.workspaceId,
        provider: "mock-llm",
        model: "fernum-gpt4o-mock",
        modality: "text",
        unitsConsumed: totalTokens,
        costUsd,
        latencyMs,
        status: "SUCCESS",
      },
    });

    return {
      data: { text, tokensUsed: totalTokens },
      telemetry: {
        provider: "mock-llm",
        model: "fernum-gpt4o-mock",
        latencyMs,
        unitsConsumed: totalTokens,
        costUsd,
      },
    };
  }
}

/**
 * Returns either the real Gemini adapter (if GEMINI_API_KEY is configured) or the high-fidelity mock adapter
 */
export function getTextModel(): ITextModel {
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey && geminiKey.trim().length > 5) {
    return new RealGeminiAdapter(geminiKey);
  }
  return new MockTextAdapter();
}

// -------------------------------------------------------------
// 2. Image Model Interface & Mock Adapter
// -------------------------------------------------------------

export interface ImageGenOptions {
  prompt: string;
  aspectRatio?: "9:16" | "16:9" | "1:1";
  faceRefUrls?: string[];
  identityToken?: string;
  organizationId: string;
  workspaceId: string;
}

export interface IImageModel {
  generateImage(options: ImageGenOptions): Promise<ModelResult<{ imageUrl: string; seed: number }>>;
}

export class MockImageAdapter implements IImageModel {
  async generateImage(options: ImageGenOptions): Promise<ModelResult<{ imageUrl: string; seed: number }>> {
    const start = Date.now();
    const seed = Math.floor(Math.random() * 1000000);
    const latencyMs = 250 + Math.floor(Math.random() * 150);
    const costUsd = 0.04;

    // Condition generation on creator's locked reference image if provided
    let imageUrl = "/synthetic-assets/creators/kora-vance-ref.svg";
    const hasLockedRef = Boolean(options.faceRefUrls && options.faceRefUrls.length > 0 && options.faceRefUrls[0]?.trim());
    if (hasLockedRef) {
      imageUrl = options.faceRefUrls![0];
    }

    const modelName = hasLockedRef ? "flux-pulid-face-lock-mock" : "flux-1-schnell-mock";

    await prisma.usageLedger.create({
      data: {
        organizationId: options.organizationId,
        workspaceId: options.workspaceId,
        provider: "mock-fal",
        model: modelName,
        modality: "image",
        unitsConsumed: 1,
        costUsd,
        latencyMs,
        status: "SUCCESS",
      },
    });

    return {
      data: { imageUrl, seed },
      telemetry: {
        provider: "mock-fal",
        model: modelName,
        latencyMs: Date.now() - start,
        unitsConsumed: 1,
        costUsd,
      },
    };
  }
}

// -------------------------------------------------------------
// 3. Speech Model Interface & Mock Adapter
// -------------------------------------------------------------

export interface SpeechGenOptions {
  text: string;
  voiceId?: string;
  speed?: number;
  pitch?: number;
  organizationId: string;
  workspaceId: string;
}

export interface ISpeechModel {
  synthesizeSpeech(options: SpeechGenOptions): Promise<ModelResult<{ audioUrl: string; durationSec: number }>>;
}

export class MockSpeechAdapter implements ISpeechModel {
  async synthesizeSpeech(options: SpeechGenOptions): Promise<ModelResult<{ audioUrl: string; durationSec: number }>> {
    const start = Date.now();
    const charCount = options.text.length;
    const durationSec = Math.max(2, Math.round(charCount / 15));
    const costUsd = parseFloat(((charCount / 1000) * 0.015).toFixed(4));
    const latencyMs = 180 + Math.floor(Math.random() * 120);

    const audioUrl = `/mock-assets/audio-sample-preview.mp3`;

    await prisma.usageLedger.create({
      data: {
        organizationId: options.organizationId,
        workspaceId: options.workspaceId,
        provider: "mock-elevenlabs",
        model: "eleven-multilingual-v2-mock",
        modality: "speech",
        unitsConsumed: charCount,
        costUsd,
        latencyMs,
        status: "SUCCESS",
      },
    });

    return {
      data: { audioUrl, durationSec },
      telemetry: {
        provider: "mock-elevenlabs",
        model: "eleven-multilingual-v2-mock",
        latencyMs: Date.now() - start,
        unitsConsumed: charCount,
        costUsd,
      },
    };
  }
}

export const mockImageModel = new MockImageAdapter();
export const mockSpeechModel = new MockSpeechAdapter();
