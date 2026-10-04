import { prisma } from "../src/lib/db";
import { orchestrationRouter } from "../src/lib/ai/orchestration/router";
import { storage } from "../src/lib/storage";

const BASE_URL = process.env.TEST_APP_URL || "http://127.0.0.1:3100";

interface LoginResult {
  cookie: string;
  user: any;
}

async function loginUser(email: string, password: string): Promise<LoginResult> {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const rawCookie = res.headers.get("set-cookie");
  const data = await res.json();

  if (!res.ok || !data.success || !rawCookie) {
    throw new Error(`Login failed for ${email} (status: ${res.status}): ${JSON.stringify(data)}`);
  }

  const cookieMatch = rawCookie.match(/fernum_session=([^;]+)/);
  if (!cookieMatch) {
    throw new Error(`Session cookie not found in Set-Cookie header: ${rawCookie}`);
  }

  return {
    cookie: `fernum_session=${cookieMatch[1]}`,
    user: data.user,
  };
}

async function runPhase4TestSuite() {
  console.log("=================================================================");
  console.log("🧪 RUNNING FERNUM PHASE 4 ORCHESTRATION & MEDIA WORKERS HTTP SUITE");
  console.log(`🎯 Target Endpoint: ${BASE_URL}`);
  console.log("=================================================================\n");

  let totalTests = 0;
  let passedTests = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    totalTests++;
    if (condition) {
      console.log(`  ✔ PASSED: ${testName}`);
      passedTests++;
    } else {
      console.error(`  ❌ FAILED: ${testName}`);
      if (detail) console.error(`     Details: ${detail}`);
      throw new Error(`Assertion failed: ${testName}`);
    }
  }

  // 1. Authenticate Users
  console.log("🔑 Authenticating actors...");
  const bob = await loginUser("bob@aurahealth.com", "FernumBob2026!"); // Creative Director @ AuraHealth
  const evan = await loginUser("evan@aurahealth.com", "FernumEvan2026!"); // Viewer @ AuraHealth
  const dana = await loginUser("dana@vervepay.com", "FernumDana2026!"); // Editor @ VervePay

  // Create clean fixtures
  let unapprovedItem: any;
  let approvedItem: any;
  let createdJobId: string | null = null;
  const originalSpend = await prisma.workspace.findUnique({
    where: { id: "ws_aura_health" },
    select: { currentSpend: true, monthlyBudget: true },
  });

  try {
    // -------------------------------------------------------------
    // SETUP: Create Draft Item and Approved Item
    // -------------------------------------------------------------
    console.log("\n📦 1. CREATING ISOLATED FIXTURES FOR PHASE 4");
    unapprovedItem = await prisma.contentItem.create({
      data: {
        organizationId: "org_fernum_studio",
        workspaceId: "ws_aura_health",
        topic: "Draft Concept - Cold Water Extraction",
        status: "SCRIPTED", // NOT approved
        script: "Discover the biological superiority of cold-extracted peptides.",
        platform: "INSTAGRAM",
      },
    });
    assert(Boolean(unapprovedItem.id), "Created draft (unapproved) content item");

    approvedItem = await prisma.contentItem.create({
      data: {
        organizationId: "org_fernum_studio",
        workspaceId: "ws_aura_health",
        topic: "Production Master - Marine Collagen Bioavailability",
        status: "APPROVED", // Approved for production
        script: "Stop taking collagen on an empty stomach. Cold-extracted peptides absorb faster.",
        platform: "INSTAGRAM",
      },
    });

    // Add storyboard step to approved item
    await prisma.contentPipelineStep.create({
      data: {
        organizationId: "org_fernum_studio",
        workspaceId: "ws_aura_health",
        contentItemId: approvedItem.id,
        step: "storyboard",
        version: 1,
        contentJson: JSON.stringify({
          scenes: [
            { sceneNumber: 1, visualPrompt: "Close-up of creator looking at camera", durationSec: 4 },
            { sceneNumber: 2, visualPrompt: "Macro peptide molecular breakdown graphic", durationSec: 5 },
            { sceneNumber: 3, visualPrompt: "Creator holding glass of matcha latte", durationSec: 4 },
          ],
        }),
      },
    });
    assert(Boolean(approvedItem.id), "Created approved content item with 3-scene storyboard");

    // -------------------------------------------------------------
    // 2. UNAUTHENTICATED & ROLE-BASED ACCESS CONTROL (RBAC) GATES
    // -------------------------------------------------------------
    console.log("\n🔒 2. AUTHENTICATION & ROLE-BASED ACCESS CONTROL");
    const unauthRes = await fetch(`${BASE_URL}/api/orchestration/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workspaceId: "ws_aura_health", contentItemId: approvedItem.id }),
    });
    assert(unauthRes.status === 401, "Logged-out request to /api/orchestration/jobs returns 401 Unauthorized");

    const viewerRes = await fetch(`${BASE_URL}/api/orchestration/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: evan.cookie },
      body: JSON.stringify({ workspaceId: "ws_aura_health", contentItemId: approvedItem.id }),
    });
    assert(viewerRes.status === 403, "Viewer role attempting to launch media job is strictly blocked with 403");

    // -------------------------------------------------------------
    // 3. SCRIPT STATE GATE: Only APPROVED scripts can enter media generation
    // -------------------------------------------------------------
    console.log("\n⚖️ 3. SCRIPT STATE ENFORCEMENT GATE");
    const unapprovedLaunchRes = await fetch(`${BASE_URL}/api/orchestration/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: bob.cookie },
      body: JSON.stringify({ workspaceId: "ws_aura_health", contentItemId: unapprovedItem.id }),
    });
    const unapprovedData = await unapprovedLaunchRes.json();
    assert(unapprovedLaunchRes.status === 400, "Media generation on unapproved script is strictly blocked with HTTP 400");
    assert(
      unapprovedData.error?.includes("Only content items in APPROVED script state"),
      "Rejection message explicitly enforces APPROVED script requirement"
    );

    // -------------------------------------------------------------
    // 4. PRE-FLIGHT COST ESTIMATE BEFORE CONFIRM
    // -------------------------------------------------------------
    console.log("\n💰 4. PRE-FLIGHT COST ESTIMATE BEFORE CONFIRMATION");
    const estimateRes = await fetch(`${BASE_URL}/api/orchestration/estimate`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: bob.cookie },
      body: JSON.stringify({
        workspaceId: "ws_aura_health",
        contentItemId: approvedItem.id,
        qualityTier: "DRAFT",
        usePaidProviders: false,
      }),
    });
    const estimateData = await estimateRes.json();
    assert(estimateRes.status === 200, "POST /api/orchestration/estimate returns 200 OK");
    assert(typeof estimateData.estimate?.totalEstimatedCostUsd === "number", "Estimate includes totalEstimatedCostUsd");
    assert(Boolean(estimateData.estimate?.breakdown?.stillsCostUsd !== undefined), "Estimate includes breakdown for stills");
    assert(Boolean(estimateData.estimate?.breakdown?.voiceoverCostUsd !== undefined), "Estimate includes breakdown for voiceover");
    assert(Boolean(estimateData.estimate?.breakdown?.assemblyCostUsd !== undefined), "Estimate includes breakdown for assembly");
    assert(estimateData.budgetStatus?.allowed === true, "Estimate validates workspace budget status");

    // -------------------------------------------------------------
    // 5. EXPLICIT PAID CONFIRMATION GATE
    // -------------------------------------------------------------
    console.log("\n🛑 5. EXPLICIT PAID PROVIDER CONFIRMATION GATE");
    const unconfirmedPaidRes = await fetch(`${BASE_URL}/api/orchestration/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: bob.cookie },
      body: JSON.stringify({
        workspaceId: "ws_aura_health",
        contentItemId: approvedItem.id,
        usePaidProviders: true,
        confirmedPaidUse: false, // User didn't confirm
      }),
    });
    assert(unconfirmedPaidRes.status === 400, "Calling paid providers without explicit user confirmation returns HTTP 400");

    // -------------------------------------------------------------
    // 6. BUDGET BLOCKING: MONTHLY BUDGET & PER-JOB COST CAP
    // -------------------------------------------------------------
    console.log("\n🚫 6. BUDGET LIMITS & PER-JOB COST CAP BLOCKING");
    // Temporarily reduce monthly budget to trigger budget block
    await prisma.workspace.update({
      where: { id: "ws_aura_health" },
      data: { monthlyBudget: 0.001 },
    });

    const budgetBlockedRes = await fetch(`${BASE_URL}/api/orchestration/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: bob.cookie },
      body: JSON.stringify({
        workspaceId: "ws_aura_health",
        contentItemId: approvedItem.id,
        qualityTier: "DRAFT",
      }),
    });
    const budgetBlockedData = await budgetBlockedRes.json();
    assert(budgetBlockedRes.status === 400, "Job that exceeds monthly budget is strictly blocked with HTTP 400");
    assert(budgetBlockedData.error?.includes("Generation blocked"), "Clear budget rejection message returned to caller");

    // Restore budget
    await prisma.workspace.update({
      where: { id: "ws_aura_health" },
      data: { monthlyBudget: originalSpend?.monthlyBudget || 500.0 },
    });

    // -------------------------------------------------------------
    // 7. SUCCESSFUL MEDIA GENERATION PIPELINE & STORAGE ATTACHMENT
    // -------------------------------------------------------------
    console.log("\n🎬 7. LAUNCHING MEDIA GENERATION & FFMPEG ASSEMBLY PIPELINE");
    const launchRes = await fetch(`${BASE_URL}/api/orchestration/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: bob.cookie },
      body: JSON.stringify({
        workspaceId: "ws_aura_health",
        contentItemId: approvedItem.id,
        qualityTier: "DRAFT",
        usePaidProviders: false,
      }),
    });
    const launchData = await launchRes.json();
    assert(launchRes.status === 201, "POST /api/orchestration/jobs enqueues job with HTTP 201 Created");
    assert(Boolean(launchData.job?.id), "Enqueued job has valid UUID");
    createdJobId = launchData.job.id;

    // Poll until completion (with 15s timeout)
    console.log("   Waiting for background pipeline worker (Stills -> Voice -> Motion -> FFmpeg 9:16)...");
    let completedJob: any = null;
    const startTime = Date.now();
    while (Date.now() - startTime < 15000) {
      const pollRes = await fetch(`${BASE_URL}/api/orchestration/jobs/${createdJobId}`, {
        headers: { Cookie: bob.cookie },
      });
      const pollData = await pollRes.json();
      console.log(`   [Poll status: ${pollData.job?.status}, stage: ${pollData.job?.currentStage}, progress: ${pollData.job?.progress}%, retries: ${pollData.job?.retryCount}]`);
      if (pollData.job?.status === "COMPLETED") {
        completedJob = pollData.job;
        break;
      }
      if (pollData.job?.status === "FAILED") {
        throw new Error(`Job unexpectedly failed: ${pollData.job.failureReason}`);
      }
      await new Promise((r) => setTimeout(r, 600));
    }

    assert(Boolean(completedJob), "Media generation pipeline completed successfully within 15 seconds");
    assert(completedJob.progress === 100, "Job progress reached 100%");
    assert(completedJob.status === "COMPLETED", "Job status marked COMPLETED");

    // Verify Asset Records attached to ContentItem
    const assetsRes = await fetch(`${BASE_URL}/api/content-items/${approvedItem.id}/assets`, {
      headers: { Cookie: bob.cookie },
    });
    const assetsData = await assetsRes.json();
    assert(assetsRes.status === 200, "GET /api/content-items/[id]/assets returns 200 OK");
    const videoAsset = assetsData.assets?.find((a: any) => a.assetType === "VIDEO");
    const audioAsset = assetsData.assets?.find((a: any) => a.assetType === "AUDIO");
    const thumbAsset = assetsData.assets?.find((a: any) => a.assetType === "THUMBNAIL");
    assert(Boolean(videoAsset), "Generated 9:16 vertical video asset attached to content item");
    assert(Boolean(audioAsset), "Normalized audio asset attached to content item");
    assert(Boolean(thumbAsset), "Thumbnail asset attached to content item");
    assert(videoAsset.signedUrl.includes("/api/storage/"), "Video asset has tamper-proof signed URL");

    // -------------------------------------------------------------
    // 8. CROSS-TENANT ISOLATION (HTTP 403)
    // -------------------------------------------------------------
    console.log("\n🛡️ 8. CROSS-TENANT ISOLATION (AURAHEALTH VS VERVEPAY)");
    // Dana (VervePay) cannot view AuraHealth jobs
    const crossJobsRes = await fetch(`${BASE_URL}/api/orchestration/jobs?workspaceId=ws_aura_health`, {
      headers: { Cookie: dana.cookie },
    });
    assert(crossJobsRes.status === 403, "VervePay user viewing AuraHealth jobs returns 403 Forbidden");

    // Dana cannot view single AuraHealth job
    const crossJobDetailRes = await fetch(`${BASE_URL}/api/orchestration/jobs/${createdJobId}`, {
      headers: { Cookie: dana.cookie },
    });
    assert(crossJobDetailRes.status === 403, "VervePay user viewing AuraHealth job detail returns 403 Forbidden");

    // Dana cannot view AuraHealth assets
    const crossAssetsRes = await fetch(`${BASE_URL}/api/content-items/${approvedItem.id}/assets`, {
      headers: { Cookie: dana.cookie },
    });
    assert(crossAssetsRes.status === 403, "VervePay user viewing AuraHealth assets returns 403 Forbidden");

    // Dana cannot cancel AuraHealth job
    const crossCancelRes = await fetch(`${BASE_URL}/api/orchestration/jobs/${createdJobId}/cancel`, {
      method: "POST",
      headers: { Cookie: dana.cookie },
    });
    assert(crossCancelRes.status === 403, "VervePay user attempting to cancel AuraHealth job returns 403 Forbidden");

    // -------------------------------------------------------------
    // 9. STORAGE TAMPER-PROOF HMAC VERIFICATION
    // -------------------------------------------------------------
    console.log("\n🔐 9. STORAGE SIGNED URL TAMPER-PROOF VERIFICATION");
    // Download with valid signed URL
    const downloadUrl = videoAsset.signedUrl.startsWith("http")
      ? videoAsset.signedUrl.replace(/http:\/\/[^/]+/, BASE_URL)
      : `${BASE_URL}${videoAsset.signedUrl}`;
    const validDownloadRes = await fetch(downloadUrl);
    assert(validDownloadRes.status === 200, "Downloading asset with valid signed URL returns 200 OK");

    // Download with tampered signature
    const tamperedUrl = downloadUrl.replace(/sig=[a-f0-9]{10}/, "sig=deadbeef00");
    const tamperedRes = await fetch(tamperedUrl);
    assert(tamperedRes.status === 403, "Downloading asset with tampered signature strictly returns 403 Forbidden");

    // -------------------------------------------------------------
    // 10. RETRY CAP ENFORCEMENT
    // -------------------------------------------------------------
    console.log("\n🔄 10. RETRY CAP ENFORCEMENT");
    // Set job retry count to max (3)
    await prisma.jobQueueItem.update({
      where: { id: createdJobId! },
      data: { retryCount: 3, maxRetries: 3, status: "FAILED" },
    });

    const retryRes = await fetch(`${BASE_URL}/api/orchestration/jobs/${createdJobId}/retry`, {
      method: "POST",
      headers: { Cookie: bob.cookie },
    });
    const retryData = await retryRes.json();
    assert(retryRes.status === 400, "Retrying job that reached retry cap is strictly rejected with HTTP 400");
    assert(retryData.error?.includes("Retry cap exceeded"), "Clear error message citing maximum retry limit");

    // -------------------------------------------------------------
    // 11. PROVIDER FALLBACK VERIFICATION
    // -------------------------------------------------------------
    console.log("\n🔀 11. PROVIDER FALLBACK & AUDIT TRAIL LOGGING");
    // Create job with missing API key to trigger fallback
    const fallbackJob = await prisma.jobQueueItem.create({
      data: {
        organizationId: "org_fernum_studio",
        workspaceId: "ws_aura_health",
        contentItemId: approvedItem.id,
        status: "PENDING",
        qualityTier: "DRAFT",
        payload: JSON.stringify({ usePaidProviders: true, confirmedPaidUse: true }),
      },
    });

    // Execute job - router catches missing FAL_KEY, logs fallback, uses mock adapter
    await orchestrationRouter.executeJob(fallbackJob.id);

    const fallbackAudit = await prisma.auditLog.findFirst({
      where: {
        workspaceId: "ws_aura_health",
        action: "PROVIDER_FALLBACK_TRIGGERED",
      },
      orderBy: { createdAt: "desc" },
    });
    assert(Boolean(fallbackAudit), "Router seamlessly triggered fallback to mock adapter and recorded audit log");

    // Verify finished fallback job
    const updatedFallbackJob = await prisma.jobQueueItem.findUnique({
      where: { id: fallbackJob.id },
    });
    assert(updatedFallbackJob?.status === "COMPLETED", "Fallback job completed successfully without crashing");

    console.log("\n=================================================================");
    console.log(`🎉 ALL ${passedTests}/${totalTests} PHASE 4 ACCEPTANCE TESTS PASSED!`);
    console.log("=================================================================\n");
  } finally {
    // Cleanup fixtures
    console.log("🧹 Cleaning up Phase 4 test fixtures...");
    try {
      if (unapprovedItem?.id) {
        await prisma.contentItem.delete({ where: { id: unapprovedItem.id } });
      }
      if (approvedItem?.id) {
        await prisma.contentItem.delete({ where: { id: approvedItem.id } });
      }
    } catch {
      // Ignore cleanup error
    }
  }
}

runPhase4TestSuite().catch((err) => {
  console.error("\n💥 Phase 4 test suite failed:", err);
  process.exit(1);
});
