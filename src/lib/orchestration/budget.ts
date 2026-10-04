import { prisma } from "@/lib/db";
import { ORCHESTRATION_CONFIG, QualityTier } from "@/config/orchestration.config";

export interface JobEstimateInput {
  scenesCount: number;
  scriptWordCount: number;
  qualityTier: QualityTier;
  usePaidProviders?: boolean;
}

export interface JobCostEstimate {
  qualityTier: QualityTier;
  scenesCount: number;
  scriptCharCount: number;
  durationSecEstimate: number;
  breakdown: {
    stillsCostUsd: number;
    voiceoverCostUsd: number;
    animaticCostUsd: number;
    assemblyCostUsd: number;
  };
  totalEstimatedCostUsd: number;
  isPaidExecution: boolean;
}

export interface BudgetCheckResult {
  allowed: boolean;
  reason?: string;
  monthlyBudgetUsd: number;
  currentSpendUsd: number;
  projectedSpendUsd: number;
  perJobCapUsd: number;
  estimatedCostUsd: number;
}

/**
 * Calculates pre-generation cost estimate based on storyboard scenes, script length, and quality tier
 */
export function calculateJobEstimate(input: JobEstimateInput): JobCostEstimate {
  const { scenesCount, scriptWordCount, qualityTier, usePaidProviders } = input;
  const scriptCharCount = scriptWordCount * 5.5; // Average 5.5 chars per word
  const durationSecEstimate = Math.max(10, Math.round(scriptWordCount / 2.5)); // ~150 words per minute = 2.5 words/sec

  let stillsCostUsd = 0;
  let voiceoverCostUsd = 0;
  let animaticCostUsd = 0;
  const assemblyCostUsd = 0.0; // Local FFmpeg is zero cloud cost

  if (usePaidProviders) {
    if (qualityTier === "FINAL") {
      // Fal Flux Dev ($0.025 per scene)
      stillsCostUsd = scenesCount * ORCHESTRATION_CONFIG.models["fal-flux-dev"].costPerUnitUsd;
      // ElevenLabs Multilingual ($0.030 per 1k chars)
      voiceoverCostUsd = (scriptCharCount / 1000) * 0.03;
    } else {
      // Fal Flux Schnell ($0.003 per scene)
      stillsCostUsd = scenesCount * ORCHESTRATION_CONFIG.models["fal-flux-schnell"].costPerUnitUsd;
      // ElevenLabs Flash ($0.015 per 1k chars)
      voiceoverCostUsd = (scriptCharCount / 1000) * 0.015;
    }
    // Animatic cost
    animaticCostUsd = 0.005 * scenesCount;
  } else {
    // Mock simulation rates
    stillsCostUsd = scenesCount * (qualityTier === "FINAL" ? 0.02 : 0.005);
    voiceoverCostUsd = (scriptCharCount / 1000) * 0.01;
    animaticCostUsd = 0.002 * scenesCount;
  }

  const total = stillsCostUsd + voiceoverCostUsd + animaticCostUsd + assemblyCostUsd;
  const totalEstimatedCostUsd = parseFloat(total.toFixed(4));

  return {
    qualityTier,
    scenesCount,
    scriptCharCount: Math.round(scriptCharCount),
    durationSecEstimate,
    breakdown: {
      stillsCostUsd: parseFloat(stillsCostUsd.toFixed(4)),
      voiceoverCostUsd: parseFloat(voiceoverCostUsd.toFixed(4)),
      animaticCostUsd: parseFloat(animaticCostUsd.toFixed(4)),
      assemblyCostUsd: parseFloat(assemblyCostUsd.toFixed(4)),
    },
    totalEstimatedCostUsd,
    isPaidExecution: Boolean(usePaidProviders),
  };
}

/**
 * Checks both workspace monthly budget and per-job cost cap
 */
export async function checkBudgetLimits(
  workspaceId: string,
  estimatedCostUsd: number
): Promise<BudgetCheckResult> {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    select: {
      id: true,
      name: true,
      monthlyBudget: true,
      currentSpend: true,
    },
  });

  if (!workspace) {
    throw new Error(`Workspace not found: ${workspaceId}`);
  }

  const monthlyBudgetUsd = Number(workspace.monthlyBudget || ORCHESTRATION_CONFIG.budgets.defaultWorkspaceMonthlyBudgetUsd);
  const currentSpendUsd = Number(workspace.currentSpend || 0);
  const projectedSpendUsd = parseFloat((currentSpendUsd + estimatedCostUsd).toFixed(4));
  const perJobCapUsd = ORCHESTRATION_CONFIG.budgets.perJobCostCapUsd;

  // 1. Check per-job cost cap
  if (estimatedCostUsd > perJobCapUsd) {
    return {
      allowed: false,
      reason: `Job estimated cost ($${estimatedCostUsd.toFixed(2)}) exceeds the per-job cost cap of $${perJobCapUsd.toFixed(2)}. Adjust scene count or quality tier.`,
      monthlyBudgetUsd,
      currentSpendUsd,
      projectedSpendUsd,
      perJobCapUsd,
      estimatedCostUsd,
    };
  }

  // 2. Check workspace monthly generation budget
  if (projectedSpendUsd > monthlyBudgetUsd) {
    return {
      allowed: false,
      reason: `Generation blocked: Job cost ($${estimatedCostUsd.toFixed(2)}) would cause workspace monthly spend ($${projectedSpendUsd.toFixed(2)}) to exceed the allocated budget ($${monthlyBudgetUsd.toFixed(2)}).`,
      monthlyBudgetUsd,
      currentSpendUsd,
      projectedSpendUsd,
      perJobCapUsd,
      estimatedCostUsd,
    };
  }

  return {
    allowed: true,
    monthlyBudgetUsd,
    currentSpendUsd,
    projectedSpendUsd,
    perJobCapUsd,
    estimatedCostUsd,
  };
}
