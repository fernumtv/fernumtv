export type QualityTier = "DRAFT" | "FINAL";

export type ModalityCapability = "TEXT" | "IMAGE" | "SPEECH" | "VIDEO" | "ASSEMBLY";

export interface ProviderModelConfig {
  provider: string;
  model: string;
  capability: ModalityCapability;
  costPerUnitUsd: number;
  unitType: "token" | "image" | "character" | "second";
  averageLatencyMs: number;
  qualityTier: QualityTier;
  isPaid: boolean;
  envKeyRequired?: string;
}

export interface OrchestrationConfig {
  defaultQualityTier: QualityTier;
  retryLimits: {
    maxRetries: number;
    backoffMs: number;
    backoffMultiplier: number;
  };
  budgets: {
    defaultWorkspaceMonthlyBudgetUsd: number;
    perJobCostCapUsd: number;
  };
  models: Record<string, ProviderModelConfig>;
  pipelineChaining: {
    stages: Array<{
      id: string;
      name: string;
      capability: ModalityCapability;
      weight: number; // progress weighting
    }>;
  };
  fallbacks: Record<string, string>; // providerKey -> fallbackProviderKey
}

export const ORCHESTRATION_CONFIG: OrchestrationConfig = {
  defaultQualityTier: "DRAFT",
  retryLimits: {
    maxRetries: 3,
    backoffMs: 1000,
    backoffMultiplier: 2,
  },
  budgets: {
    defaultWorkspaceMonthlyBudgetUsd: 100.0,
    perJobCostCapUsd: 5.0, // Per-job cap as specified
  },
  models: {
    // Text Models
    "gemini-flash": {
      provider: "google",
      model: "gemini-1.5-flash",
      capability: "TEXT",
      costPerUnitUsd: 0.0000003, // ~$0.30 per 1M tokens
      unitType: "token",
      averageLatencyMs: 1200,
      qualityTier: "FINAL",
      isPaid: true,
      envKeyRequired: "GEMINI_API_KEY",
    },
    "mock-text": {
      provider: "mock",
      model: "fernum-gpt4o-mock",
      capability: "TEXT",
      costPerUnitUsd: 0.00000015,
      unitType: "token",
      averageLatencyMs: 250,
      qualityTier: "DRAFT",
      isPaid: false,
    },

    // Image Models (Proposing Fal Flux Schnell: ~$0.003 / image)
    "fal-flux-schnell": {
      provider: "fal",
      model: "flux-1-schnell",
      capability: "IMAGE",
      costPerUnitUsd: 0.003, // 4-step ultra-fast image generation ($0.003/img)
      unitType: "image",
      averageLatencyMs: 900,
      qualityTier: "DRAFT",
      isPaid: true,
      envKeyRequired: "FAL_KEY",
    },
    "fal-flux-dev": {
      provider: "fal",
      model: "flux-1-dev",
      capability: "IMAGE",
      costPerUnitUsd: 0.025, // 28-step high-fidelity creator stills
      unitType: "image",
      averageLatencyMs: 3200,
      qualityTier: "FINAL",
      isPaid: true,
      envKeyRequired: "FAL_KEY",
    },
    "mock-image": {
      provider: "mock",
      model: "flux-1-schnell-mock",
      capability: "IMAGE",
      costPerUnitUsd: 0.04, // simulated baseline
      unitType: "image",
      averageLatencyMs: 350,
      qualityTier: "DRAFT",
      isPaid: false,
    },

    // Speech / TTS Models (Proposing ElevenLabs Flash v2.5: ~$0.015 / 1k chars)
    "elevenlabs-flash": {
      provider: "elevenlabs",
      model: "eleven_flash_v2_5",
      capability: "SPEECH",
      costPerUnitUsd: 0.000015, // $0.015 per 1,000 characters
      unitType: "character",
      averageLatencyMs: 650,
      qualityTier: "DRAFT",
      isPaid: true,
      envKeyRequired: "ELEVENLABS_API_KEY",
    },
    "elevenlabs-multilingual": {
      provider: "elevenlabs",
      model: "eleven_multilingual_v2",
      capability: "SPEECH",
      costPerUnitUsd: 0.00003, // $0.030 per 1,000 characters
      unitType: "character",
      averageLatencyMs: 1400,
      qualityTier: "FINAL",
      isPaid: true,
      envKeyRequired: "ELEVENLABS_API_KEY",
    },
    "mock-speech": {
      provider: "mock",
      model: "eleven-multilingual-mock",
      capability: "SPEECH",
      costPerUnitUsd: 0.000015,
      unitType: "character",
      averageLatencyMs: 300,
      qualityTier: "DRAFT",
      isPaid: false,
    },

    // Video Models (Mock video adapter for Phase 4)
    "mock-video-animatic": {
      provider: "mock",
      model: "fernum-animatic-v1",
      capability: "VIDEO",
      costPerUnitUsd: 0.01,
      unitType: "second",
      averageLatencyMs: 1500,
      qualityTier: "DRAFT",
      isPaid: false,
    },

    // FFmpeg Assembly Worker
    "ffmpeg-assembly": {
      provider: "local-ffmpeg",
      model: "ffmpeg-8.1.1-render",
      capability: "ASSEMBLY",
      costPerUnitUsd: 0.0, // Local compute
      unitType: "second",
      averageLatencyMs: 2500,
      qualityTier: "FINAL",
      isPaid: false,
    },
  },
  pipelineChaining: {
    stages: [
      { id: "GENERATING_STILLS", name: "Generating Storyboard Stills", capability: "IMAGE", weight: 30 },
      { id: "GENERATING_VOICE", name: "Synthesizing Voiceover", capability: "SPEECH", weight: 25 },
      { id: "ANIMATING_VIDEO", name: "Motion & Animatic Processing", capability: "VIDEO", weight: 20 },
      { id: "ASSEMBLING_FFMPEG", name: "FFmpeg Assembly & Caption Burning", capability: "ASSEMBLY", weight: 25 },
    ],
  },
  fallbacks: {
    "fal-flux-schnell": "mock-image",
    "fal-flux-dev": "mock-image",
    "elevenlabs-flash": "mock-speech",
    "elevenlabs-multilingual": "mock-speech",
    "gemini-flash": "mock-text",
  },
};
