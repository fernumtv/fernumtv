import { prisma } from "@/lib/db";

export interface ComplianceFinding {
  ruleType: "PROHIBITED_CLAIM" | "PROHIBITED_TOPIC" | "LEGAL_RESTRICTION";
  severity: "BLOCKING" | "WARNING";
  matchedRule: string;
  matchedSnippet: string;
  explanation: string;
}

export interface CompliancePrecheckResult {
  passed: boolean;
  hasBlockingViolations: boolean;
  findings: ComplianceFinding[];
  scannedAt: string;
}

/**
 * Basic compliance pre-check scanning generated hooks, scripts, and captions against Brand Brain guardrails.
 */
export async function runCompliancePrecheck(
  workspaceId: string,
  textToScan: string
): Promise<CompliancePrecheckResult> {
  const brandBrain = await prisma.brandBrain.findUnique({
    where: { workspaceId },
  });

  const findings: ComplianceFinding[] = [];
  const lowerText = textToScan.toLowerCase();

  if (!brandBrain) {
    return {
      passed: true,
      hasBlockingViolations: false,
      findings: [],
      scannedAt: new Date().toISOString(),
    };
  }

  // 1. Prohibited Claims Check (Zero Tolerance / BLOCKING)
  if (brandBrain.prohibitedClaims) {
    const claims = brandBrain.prohibitedClaims
      .split(/[.;\n]/)
      .map((c) => c.trim())
      .filter((c) => c.length > 5);

    // Common medical/financial prohibited terms
    const forbiddenKeywords = [
      { pattern: /\b(cure|cures|curing|heal chronic)\b/i, rule: "Never claim to cure disease" },
      { pattern: /\b(guarantee|guaranteed)\b/i, rule: "Never guarantee medical or financial outcomes" },
      { pattern: /\b(fda approved)\b/i, rule: "Never claim FDA approval for dietary supplements" },
      { pattern: /\b(treat cancer|treat diabetes|treat arthritis)\b/i, rule: "Prohibited medical treatment claims" },
    ];

    for (const kw of forbiddenKeywords) {
      const match = textToScan.match(kw.pattern);
      if (match) {
        findings.push({
          ruleType: "PROHIBITED_CLAIM",
          severity: "BLOCKING",
          matchedRule: kw.rule,
          matchedSnippet: match[0],
          explanation: `Generated content violates Brand Brain zero-tolerance policy: '${kw.rule}'. Term '${match[0]}' is strictly forbidden.`,
        });
      }
    }

    // Check specific phrases from Brand Brain prohibited claims
    for (const claim of claims) {
      const claimKeywords = claim
        .toLowerCase()
        .replace(/never|cannot|claim to|guarantee/g, "")
        .split(/\s+/)
        .filter((w) => w.length > 4);

      if (claimKeywords.length > 0) {
        const matchesAll = claimKeywords.every((kw) => lowerText.includes(kw));
        if (matchesAll) {
          findings.push({
            ruleType: "PROHIBITED_CLAIM",
            severity: "BLOCKING",
            matchedRule: claim,
            matchedSnippet: claimKeywords.join(" "),
            explanation: `Found direct match for Brand Brain prohibited claim: "${claim}"`,
          });
        }
      }
    }
  }

  // 2. Prohibited Topics Check (WARNING or BLOCKING depending on context)
  if (brandBrain.prohibitedTopics) {
    const topics = brandBrain.prohibitedTopics
      .split(/[,;\n]/)
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 3);

    for (const topic of topics) {
      if (lowerText.includes(topic)) {
        findings.push({
          ruleType: "PROHIBITED_TOPIC",
          severity: "BLOCKING",
          matchedRule: `Prohibited Topic: ${topic}`,
          matchedSnippet: topic,
          explanation: `Content mentions prohibited brand topic '${topic}'.`,
        });
      }
    }
  }

  // 3. Legal Disclaimers Check (WARNING if missing required disclaimer)
  if (brandBrain.legalRestrictions) {
    const lowerRestrictions = brandBrain.legalRestrictions.toLowerCase();
    if (lowerRestrictions.includes("disclaimer") || lowerRestrictions.includes("#ad")) {
      const hasAdTag = lowerText.includes("#ad") || lowerText.includes("ad") || lowerText.includes("sponsored");
      const hasFdaDisclaimer = lowerText.includes("fda") || lowerText.includes("not evaluated");

      if (!hasAdTag && !hasFdaDisclaimer) {
        findings.push({
          ruleType: "LEGAL_RESTRICTION",
          severity: "WARNING",
          matchedRule: brandBrain.legalRestrictions,
          matchedSnippet: "Missing #Ad or mandatory FDA disclaimer",
          explanation: `Brand Brain specifies mandatory legal disclosures: '${brandBrain.legalRestrictions}'. Ensure description or caption includes required tags.`,
        });
      }
    }
  }

  const hasBlockingViolations = findings.some((f) => f.severity === "BLOCKING");

  return {
    passed: findings.length === 0,
    hasBlockingViolations,
    findings,
    scannedAt: new Date().toISOString(),
  };
}
