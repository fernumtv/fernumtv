import { prisma } from "@/lib/db";
import { searchBrandBrainContext } from "../brand-brain/retrieval";

export class ConsentVerificationError extends Error {
  constructor(message: string) {
    super(`[Legal/Consent] ${message}`);
    this.name = "ConsentVerificationError";
  }
}

export class CreatorLockError extends Error {
  constructor(message: string) {
    super(`[CreatorStudio/Lock] ${message}`);
    this.name = "CreatorLockError";
  }
}

/**
 * Real-Person Likeness Safeguard (Section 8)
 * Real-person face or voice likeness strictly requires an active, verified ConsentRecord.
 */
export async function validateCreatorConsent(creatorId: string): Promise<boolean> {
  const creator = await prisma.creator.findUnique({
    where: { id: creatorId },
    include: { consentRecord: true },
  });

  if (!creator) throw new Error(`Creator ${creatorId} not found.`);

  // Fully synthetic characters are exempt from real-person likeness checks
  if (creator.isSynthetic) {
    return true;
  }

  // Non-synthetic (real person likeness/voice) requires a verified consent record
  if (!creator.consentRecordId || !creator.consentRecord) {
    throw new ConsentVerificationError(
      `Creator '${creator.name}' is marked as real-person likeness but lacks a verified ConsentRecord. Approval or locking is strictly prohibited under Fernum safety policies.`
    );
  }

  if (creator.consentRecord.status !== "VERIFIED") {
    throw new ConsentVerificationError(
      `ConsentRecord for '${creator.name}' has status '${creator.consentRecord.status}' (must be 'VERIFIED').`
    );
  }

  if (creator.consentRecord.expiresAt && creator.consentRecord.expiresAt < new Date()) {
    throw new ConsentVerificationError(
      `ConsentRecord for '${creator.name}' expired on ${creator.consentRecord.expiresAt.toISOString()}.`
    );
  }

  return true;
}

/**
 * Assembles unified Creator Context (Identity + Memory + Brand Brain)
 * Used to ground all future AI generation runs and prevent persona drift.
 */
export async function assembleCreatorContext(creatorId: string) {
  const creator = await prisma.creator.findUnique({
    where: { id: creatorId },
    include: {
      memories: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!creator) throw new Error(`Creator ${creatorId} not found.`);

  const brandContext = await searchBrandBrainContext(creator.workspaceId, creator.niche);

  return {
    identity: {
      id: creator.id,
      name: creator.name,
      type: creator.type,
      status: creator.status,
      version: creator.version,
      niche: creator.niche,
      personality: creator.personality,
      tone: creator.tone,
      vocabulary: creator.vocabulary,
      values: creator.values,
      behaviorRules: creator.behaviorRules,
      contentPillars: creator.contentPillars,
      preferredTopics: creator.preferredTopics,
      prohibitedTopics: creator.prohibitedTopics,
      voice: {
        provider: creator.voiceProvider,
        modelId: creator.voiceModelId,
        speed: creator.voiceSpeed,
        pitch: creator.voicePitch,
      },
      visualStyle: {
        wardrobe: creator.wardrobeNotes,
        styleGuide: creator.visualStyleGuide,
        avatarUrl: creator.avatarUrl,
      },
      isSynthetic: creator.isSynthetic,
    },
    memories: creator.memories.map((m) => ({
      category: m.category,
      fact: m.fact,
      context: m.context,
    })),
    brandContext,
  };
}
