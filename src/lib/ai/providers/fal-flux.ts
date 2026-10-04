import { IImageModel, ImageGenOptions, ModelResult } from "../interfaces";
import { prisma } from "@/lib/db";

/**
 * Real Fal.ai Flux PuLID Face-Conditioned Image Generation Adapter
 * Uses `fal-ai/flux-pulid` conditioned on creator locked reference image.
 * Verified pricing: $0.0333 / megapixel (~$0.0333 per image).
 */
export class FalPuLIDAdapter implements IImageModel {
  private apiKey: string;
  private model: string;

  constructor(apiKey?: string, model: string = "fal-ai/flux-pulid") {
    this.apiKey = apiKey || process.env.FAL_KEY || "";
    this.model = model;
  }

  async generateImage(options: ImageGenOptions): Promise<ModelResult<{ imageUrl: string; seed: number }>> {
    if (!this.apiKey) {
      throw new Error("FAL_KEY environment variable is not configured for paid Fal.ai image generation.");
    }

    const start = Date.now();
    const lockedRefUrl = options.faceRefUrls?.[0];

    // Determine payload based on whether reference image is present
    const isConditioned = Boolean(lockedRefUrl && lockedRefUrl.trim().length > 0);
    const targetModel = isConditioned ? "fal-ai/flux-pulid" : "fal-ai/flux/schnell";
    const costUsd = isConditioned ? 0.0333 : 0.003;

    const requestBody: Record<string, any> = {
      prompt: options.prompt,
      image_size: options.aspectRatio === "9:16" ? "portrait_16_9" : "square_hd",
    };

    if (isConditioned) {
      requestBody.reference_image_url = lockedRefUrl;
      requestBody.num_inference_steps = 20;
      requestBody.guidance_scale = 4;
    } else {
      requestBody.num_inference_steps = 4;
      requestBody.enable_safety_checker = true;
    }

    // Call Fal.ai REST API
    const response = await fetch(`https://queue.fal.run/${targetModel}`, {
      method: "POST",
      headers: {
        Authorization: `Key ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const latencyMs = Date.now() - start;

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Fal.ai API error (${response.status}): ${err}`);
    }

    const data = await response.json();
    const imageUrl = data.images?.[0]?.url || data.image?.url;
    const seed = data.seed || Math.floor(Math.random() * 1000000);

    if (!imageUrl) {
      throw new Error("Fal.ai response did not contain an image URL.");
    }

    // Record in UsageLedger
    await prisma.usageLedger.create({
      data: {
        organizationId: options.organizationId,
        workspaceId: options.workspaceId,
        provider: "fal-ai",
        model: targetModel,
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
        provider: "fal-ai",
        model: targetModel,
        latencyMs,
        unitsConsumed: 1,
        costUsd,
      },
    };
  }
}

// Alias for backward compatibility with router
export class FalFluxAdapter extends FalPuLIDAdapter {}
