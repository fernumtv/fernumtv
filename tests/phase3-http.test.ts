import { prisma } from "../src/lib/db";

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

async function runPhase3TestSuite() {
  console.log("=================================================================");
  console.log("🧪 RUNNING FERNUM PHASE 3 CONTENT STUDIO HTTP ACCEPTANCE SUITE");
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

  // 1. Authenticate Demo Users
  console.log("🔑 Authenticating actors...");
  const bob = await loginUser("bob@aurahealth.com", "FernumBob2026!"); // Creative Director @ AuraHealth
  const charlie = await loginUser("charlie@aurahealth.com", "FernumCharlie2026!"); // Client Approver @ AuraHealth
  const evan = await loginUser("evan@aurahealth.com", "FernumEvan2026!"); // Viewer @ AuraHealth
  const dana = await loginUser("dana@vervepay.com", "FernumDana2026!"); // Editor @ VervePay

  // Self-contained tracking for cleanup
  const createdItemIds: string[] = [];

  try {
    // -------------------------------------------------------------
    // PART 1: REPEATABLE SELF-CONTAINED FIXTURE CREATION
    // -------------------------------------------------------------
    console.log("\n📦 1. CREATING SELF-CONTAINED PRODUCTION FIXTURE");

    const resCreate = await fetch(`${BASE_URL}/api/content-items`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: bob.cookie },
      body: JSON.stringify({
        workspaceId: "ws_aura_health",
        topic: `Phase 3 Test Production - ${Date.now()}`,
        creatorId: "creator_kora_vance",
        platform: "INSTAGRAM",
      }),
    });
    assert(resCreate.status === 200, "Created isolated test content item in AuraHealth");
    const testItem = (await resCreate.json()).item;
    createdItemIds.push(testItem.id);

    // -------------------------------------------------------------
    // PART 2: CROSS-TENANT ISOLATION GATES (HTTP 403)
    // -------------------------------------------------------------
    console.log("\n🛡️ 2. CROSS-TENANT ISOLATION GATES");

    // Dana (VervePay) cannot read AuraHealth test item
    const resCrossRead = await fetch(`${BASE_URL}/api/content-items/${testItem.id}?workspaceId=ws_verve_pay`, {
      headers: { Cookie: dana.cookie },
    });
    assert(resCrossRead.status === 403, "VervePay user reading AuraHealth item returns 403 Forbidden");

    // Dana cannot trigger step generation on AuraHealth item
    const resCrossGen = await fetch(`${BASE_URL}/api/content-items/${testItem.id}/generate-step`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: dana.cookie },
      body: JSON.stringify({
        workspaceId: "ws_verve_pay",
        step: "hook",
      }),
    });
    assert(resCrossGen.status === 403, "Cross-tenant step generation returns 403 Forbidden");

    // -------------------------------------------------------------
    // PART 3: ROLE-BASED ACCESS CONTROL (RBAC)
    // -------------------------------------------------------------
    console.log("\n👥 3. ROLE-BASED ACCESS CONTROL (RBAC)");

    // Viewer (Evan) CANNOT trigger generation
    const resViewerGen = await fetch(`${BASE_URL}/api/content-items/${testItem.id}/generate-step`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: evan.cookie },
      body: JSON.stringify({
        workspaceId: "ws_aura_health",
        step: "idea",
      }),
    });
    assert(resViewerGen.status === 403, "Viewer role cannot generate pipeline steps (403)");

    // Viewer CANNOT approve content
    const resViewerApprove = await fetch(`${BASE_URL}/api/content-items/${testItem.id}/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: evan.cookie },
      body: JSON.stringify({
        workspaceId: "ws_aura_health",
        decision: "APPROVED",
      }),
    });
    assert(resViewerApprove.status === 403, "Viewer role cannot approve content items (403)");

    // -------------------------------------------------------------
    // PART 4: 6-STEP PIPELINE GENERATION & CONTEXT GROUNDING
    // -------------------------------------------------------------
    console.log("\n⚙️ 4. PIPELINE GENERATION, GROUNDING & A/B VARIATIONS");

    // Step 1: Idea
    const resIdea = await fetch(`${BASE_URL}/api/content-items/${testItem.id}/generate-step`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: bob.cookie },
      body: JSON.stringify({
        workspaceId: "ws_aura_health",
        step: "idea",
      }),
    });
    assert(resIdea.status === 200, "Generated grounded Idea step (HTTP 200)");
    const ideaResult = (await resIdea.json()).stepResult;
    assert(ideaResult.version === 1, "Idea step saved as version 1");

    // Step 2: Hook (N Variations)
    const resHook = await fetch(`${BASE_URL}/api/content-items/${testItem.id}/generate-step`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: bob.cookie },
      body: JSON.stringify({
        workspaceId: "ws_aura_health",
        step: "hook",
      }),
    });
    assert(resHook.status === 200, "Generated Hook variations (HTTP 200)");
    const hookResult = (await resHook.json()).stepResult;
    assert(Array.isArray(hookResult.content) && hookResult.content.length >= 2, "Generated multiple hook variations for A/B testing");

    // Select Hook Variant 1
    const resSelectHook = await fetch(`${BASE_URL}/api/content-items/${testItem.id}/select-variant`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: bob.cookie },
      body: JSON.stringify({
        workspaceId: "ws_aura_health",
        step: "hook",
        variantIndex: 1,
      }),
    });
    assert(resSelectHook.status === 200, "Selected Hook Variant 2 as active chosen hook");
    const updatedHookItem = (await resSelectHook.json()).item;
    assert(updatedHookItem.selectedHookIndex === 1, "ContentItem active selectedHookIndex updated to 1");

    // Step 3: Script Generation
    const resScript1 = await fetch(`${BASE_URL}/api/content-items/${testItem.id}/generate-step`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: bob.cookie },
      body: JSON.stringify({
        workspaceId: "ws_aura_health",
        step: "script",
      }),
    });
    assert(resScript1.status === 200, "Generated Script v1 (HTTP 200)");
    const script1Result = (await resScript1.json()).stepResult;
    assert(script1Result.version === 1, "Script saved as version 1");

    // Step 3b: Script Re-generation (Version 2)
    const resScript2 = await fetch(`${BASE_URL}/api/content-items/${testItem.id}/generate-step`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: bob.cookie },
      body: JSON.stringify({
        workspaceId: "ws_aura_health",
        step: "script",
        userInstruction: "Focus heavily on cold water extraction mechanism and slow-wave sleep.",
      }),
    });
    assert(resScript2.status === 200, "Re-generated Script v2 with creative director notes");
    const script2Result = (await resScript2.json()).stepResult;
    assert(script2Result.version === 2, "Script version incremented to v2");

    // Revert Script to Version 1
    const resRevert = await fetch(`${BASE_URL}/api/content-items/${testItem.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Cookie: bob.cookie },
      body: JSON.stringify({
        workspaceId: "ws_aura_health",
        revertStep: { step: "script", version: 1 },
      }),
    });
    assert(resRevert.status === 200, "Successfully reverted script step to Version 1");

    // Step 4: Storyboard
    const resStoryboard = await fetch(`${BASE_URL}/api/content-items/${testItem.id}/generate-step`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: bob.cookie },
      body: JSON.stringify({
        workspaceId: "ws_aura_health",
        step: "storyboard",
      }),
    });
    assert(resStoryboard.status === 200, "Generated shot-by-shot Storyboard (HTTP 200)");

    // Step 5: Caption
    const resCaption = await fetch(`${BASE_URL}/api/content-items/${testItem.id}/generate-step`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: bob.cookie },
      body: JSON.stringify({
        workspaceId: "ws_aura_health",
        step: "caption",
      }),
    });
    assert(resCaption.status === 200, "Generated Caption & hashtags (HTTP 200)");

    // Step 6: Thumbnail
    const resThumbnail = await fetch(`${BASE_URL}/api/content-items/${testItem.id}/generate-step`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: bob.cookie },
      body: JSON.stringify({
        workspaceId: "ws_aura_health",
        step: "thumbnail",
      }),
    });
    assert(resThumbnail.status === 200, "Generated Thumbnail concept (HTTP 200)");

    // -------------------------------------------------------------
    // PART 5: COMPLIANCE PRE-CHECK & APPROVAL BLOCKING
    // -------------------------------------------------------------
    console.log("\n🛡️ 5. COMPLIANCE PRE-CHECK & APPROVAL GUARD");

    // Inject a prohibited claim directly to simulate a non-compliant generation
    await prisma.contentItem.update({
      where: { id: testItem.id },
      data: {
        complianceFlags: JSON.stringify([
          {
            ruleType: "PROHIBITED_CLAIM",
            severity: "BLOCKING",
            matchedRule: "Never claim to cure disease",
            explanation: "Content claims to cure arthritis directly.",
          },
        ]),
      },
    });

    // Client Approver attempts to approve non-compliant item -> BLOCKED WITH 400
    const resApproveBlocked = await fetch(`${BASE_URL}/api/content-items/${testItem.id}/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: charlie.cookie },
      body: JSON.stringify({
        workspaceId: "ws_aura_health",
        decision: "APPROVED",
      }),
    });
    assert(
      resApproveBlocked.status === 400,
      "Approval is strictly BLOCKED with HTTP 400 when blocking prohibited claims exist"
    );

    // Clear compliance violations (simulating compliant script)
    await prisma.contentItem.update({
      where: { id: testItem.id },
      data: { complianceFlags: null },
    });

    // Client Approver approves clean item -> SUCCEEDS WITH 200
    const resApproveSuccess = await fetch(`${BASE_URL}/api/content-items/${testItem.id}/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: charlie.cookie },
      body: JSON.stringify({
        workspaceId: "ws_aura_health",
        decision: "APPROVED",
        comments: "All claims verified against clinical documentation.",
      }),
    });
    assert(resApproveSuccess.status === 200, "Authorized Client Approver successfully approves compliant item (200)");
    const approvedItem = (await resApproveSuccess.json()).item;
    assert(approvedItem.status === "APPROVED", "ContentItem status officially transitioned to APPROVED");

    console.log("\n=================================================================");
    console.log(`🎉 ALL ${passedTests}/${totalTests} PHASE 3 ACCEPTANCE TESTS PASSED!`);
    console.log("=================================================================\n");
  } finally {
    // Clean up created test items
    for (const id of createdItemIds) {
      await prisma.contentPipelineStep.deleteMany({ where: { contentItemId: id } });
      await prisma.approval.deleteMany({ where: { contentItemId: id } });
      await prisma.contentItem.deleteMany({ where: { id } });
    }
    console.log("🧹 Test fixtures cleaned up successfully.");
  }
}

runPhase3TestSuite()
  .catch((err) => {
    console.error("❌ Phase 3 HTTP test runner failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
