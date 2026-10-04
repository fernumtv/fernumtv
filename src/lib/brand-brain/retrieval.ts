import { prisma } from "@/lib/db";
import { wrapUntrustedDocumentText } from "./extractor";

export interface BrandBrainContextResult {
  brandName: string;
  tagline: string | null;
  toneOfVoice: string | null;
  positioning: string | null;
  prohibitedClaims: string | null;
  prohibitedTopics: string | null;
  approvedTerminology: string | null;
  ctaRules: string | null;
  matchedDocuments: Array<{
    title: string;
    snippet: string;
    score: number;
  }>;
}

/**
 * Searches and retrieves relevant Brand Brain guidelines, prohibited claims, and document context.
 */
export async function searchBrandBrainContext(
  workspaceId: string,
  query: string
): Promise<BrandBrainContextResult | null> {
  const brandBrain = await prisma.brandBrain.findUnique({
    where: { workspaceId },
    include: {
      documents: true,
    },
  });

  if (!brandBrain) return null;

  const queryTerms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 2);

  // Score documents based on keyword occurrence
  const matchedDocs = brandBrain.documents
    .map((doc) => {
      const lower = doc.extractedText.toLowerCase();
      let matchCount = 0;
      queryTerms.forEach((term) => {
        const regex = new RegExp(`\\b${term}\\b`, "g");
        const matches = lower.match(regex);
        if (matches) matchCount += matches.length;
      });

      // Find first occurrence snippet
      let snippet = doc.extractedText.slice(0, 200);
      if (queryTerms.length > 0) {
        const firstIdx = lower.indexOf(queryTerms[0]);
        if (firstIdx !== -1) {
          const start = Math.max(0, firstIdx - 50);
          const end = Math.min(doc.extractedText.length, firstIdx + 150);
          snippet = (start > 0 ? "..." : "") + doc.extractedText.slice(start, end) + "...";
        }
      }

      return {
        title: doc.title,
        snippet,
        safeText: wrapUntrustedDocumentText(doc.title, doc.extractedText.slice(0, 1000)),
        score: matchCount,
      };
    })
    .filter((d) => d.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return {
    brandName: brandBrain.brandName,
    tagline: brandBrain.tagline,
    toneOfVoice: brandBrain.toneOfVoice,
    positioning: brandBrain.positioning,
    prohibitedClaims: brandBrain.prohibitedClaims,
    prohibitedTopics: brandBrain.prohibitedTopics,
    approvedTerminology: brandBrain.approvedTerminology,
    ctaRules: brandBrain.ctaRules,
    matchedDocuments: matchedDocs,
  };
}
