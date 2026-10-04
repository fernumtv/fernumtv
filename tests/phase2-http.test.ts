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

async function runPhase2TestSuite() {
  console.log("=================================================================");
  console.log("🧪 RUNNING FERNUM PHASE 2 HTTP ACCEPTANCE & SECURITY TEST SUITE");
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

  // -------------------------------------------------------------
  // PART 1: UNRESPONSIVE / LOGGED-OUT REJECTION (401)
  // -------------------------------------------------------------
  console.log("\n🔒 1. UNAUTHENTICATED GATES (HTTP 401)");

  const resLoggedOutBrandBrain = await fetch(`${BASE_URL}/api/brand-brain?workspaceId=ws_aura_health`);
  assert(resLoggedOutBrandBrain.status === 401, "Logged-out GET /api/brand-brain returns 401");

  const resLoggedOutCreators = await fetch(`${BASE_URL}/api/creators?workspaceId=ws_aura_health`);
  assert(resLoggedOutCreators.status === 401, "Logged-out GET /api/creators returns 401");

  const resLoggedOutConsent = await fetch(`${BASE_URL}/api/consent?workspaceId=ws_aura_health`);
  assert(resLoggedOutConsent.status === 401, "Logged-out GET /api/consent returns 401");

  // -------------------------------------------------------------
  // PART 2: CROSS-TENANT ISOLATION (HTTP 403)
  // -------------------------------------------------------------
  console.log("\n🛡️ 2. CROSS-TENANT ISOLATION GATES (HTTP 403)");

  // AuraHealth user (Bob) attempting to read VervePay Brand Brain
  const resCrossBrandBrainGet = await fetch(`${BASE_URL}/api/brand-brain?workspaceId=ws_verve_pay`, {
    headers: { Cookie: bob.cookie },
  });
  assert(resCrossBrandBrainGet.status === 403, "AuraHealth user reading VervePay BrandBrain returns 403");

  // AuraHealth user attempting to mutate VervePay Brand Brain
  const resCrossBrandBrainPut = await fetch(`${BASE_URL}/api/brand-brain`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Cookie: bob.cookie },
    body: JSON.stringify({
      workspaceId: "ws_verve_pay",
      brandName: "HACKED_BRAND",
    }),
  });
  assert(resCrossBrandBrainPut.status === 403, "AuraHealth user mutating VervePay BrandBrain returns 403");

  // AuraHealth user attempting to read VervePay Creators
  const resCrossCreatorGet = await fetch(`${BASE_URL}/api/creators?workspaceId=ws_verve_pay`, {
    headers: { Cookie: bob.cookie },
  });
  assert(resCrossCreatorGet.status === 403, "AuraHealth user reading VervePay creators returns 403");

  // AuraHealth user attempting to create a creator in VervePay
  const resCrossCreatorPost = await fetch(`${BASE_URL}/api/creators`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: bob.cookie },
    body: JSON.stringify({
      workspaceId: "ws_verve_pay",
      name: "Malicious Creator",
      niche: "Exploit",
    }),
  });
  assert(resCrossCreatorPost.status === 403, "AuraHealth user creating creator in VervePay returns 403");

  // AuraHealth user attempting to mutate Devon Miles (VervePay creator)
  const resCrossCreatorPatch = await fetch(`${BASE_URL}/api/creators`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Cookie: bob.cookie },
    body: JSON.stringify({
      workspaceId: "ws_verve_pay",
      id: "creator_devon_miles",
      personality: "Hacked personality",
    }),
  });
  assert(
    resCrossCreatorPatch.status === 403 || resCrossCreatorPatch.status === 404,
    "AuraHealth user mutating VervePay creator returns 403 Forbidden"
  );

  // AuraHealth user attempting to delete Devon Miles (VervePay creator)
  const resCrossCreatorDelete = await fetch(
    `${BASE_URL}/api/creators?workspaceId=ws_verve_pay&id=creator_devon_miles`,
    {
      method: "DELETE",
      headers: { Cookie: bob.cookie },
    }
  );
  assert(
    resCrossCreatorDelete.status === 403 || resCrossCreatorDelete.status === 404,
    "AuraHealth user deleting VervePay creator returns 403 Forbidden"
  );

  // -------------------------------------------------------------
  // PART 3: ROLE-BASED ACCESS CONTROL (RBAC) GATES
  // -------------------------------------------------------------
  console.log("\n👥 3. ROLE-BASED ACCESS CONTROL (RBAC) GATES");

  // Viewer (Evan) CAN read Brand Brain
  const resViewerRead = await fetch(`${BASE_URL}/api/brand-brain?workspaceId=ws_aura_health`, {
    headers: { Cookie: evan.cookie },
  });
  assert(resViewerRead.status === 200, "Viewer CAN read BrandBrain (HTTP 200)");

  // Viewer CANNOT edit Brand Brain
  const resViewerEdit = await fetch(`${BASE_URL}/api/brand-brain`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Cookie: evan.cookie },
    body: JSON.stringify({
      workspaceId: "ws_aura_health",
      tagline: "Illegal Edit by Viewer",
    }),
  });
  assert(resViewerEdit.status === 403, "Viewer CANNOT edit BrandBrain (HTTP 403)");

  // Viewer CANNOT create creators
  const resViewerCreateCreator = await fetch(`${BASE_URL}/api/creators`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: evan.cookie },
    body: JSON.stringify({
      workspaceId: "ws_aura_health",
      name: "Viewer Injected Creator",
      niche: "Testing",
    }),
  });
  assert(resViewerCreateCreator.status === 403, "Viewer CANNOT create creators (HTTP 403)");

  // Client Approver (Charlie) CANNOT author Brand Brain edits (only approve)
  const resApproverEditBrand = await fetch(`${BASE_URL}/api/brand-brain`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Cookie: charlie.cookie },
    body: JSON.stringify({
      workspaceId: "ws_aura_health",
      tagline: "Approver Trying to Author Guidelines",
    }),
  });
  assert(resApproverEditBrand.status === 403, "Client Approver CANNOT edit BrandBrain fields (HTTP 403)");

  // -------------------------------------------------------------
  // PART 4: REAL-PERSON SAFEGUARD & CONSENT RECORDS
  // -------------------------------------------------------------
  console.log("\n⚖️ 4. REAL-PERSON SAFEGUARD & CONSENT RECORDS");

  // Creating a real-person creator WITHOUT ConsentRecord fails with 400
  const resNoConsent = await fetch(`${BASE_URL}/api/creators`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: bob.cookie },
    body: JSON.stringify({
      workspaceId: "ws_aura_health",
      name: "Real Celebrity Lookalike",
      niche: "Fitness",
      isSynthetic: false, // Marked as real person!
    }),
  });
  assert(
    resNoConsent.status === 400,
    "Real-person creator without ConsentRecord is blocked with HTTP 400"
  );

  // Authenticate agency owner Alice for dual-custody consent verification
  const alice = await loginUser("alice@fernum.studio", "FernumAlice2026!");

  // Upload valid ConsentRecord (Starts as PENDING)
  const resUploadConsent = await fetch(`${BASE_URL}/api/consent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: bob.cookie },
    body: JSON.stringify({
      workspaceId: "ws_aura_health",
      personName: "Dr. Andrew Huberman",
      legalDocumentUrl: "/storage/consent-agreements/huberman-likeness-v1.pdf",
      notes: "Executed talent likeness agreement for research podcast series",
    }),
  });
  assert(resUploadConsent.status === 201, "Uploading verified ConsentRecord returns HTTP 201 Created");
  const consentData = await resUploadConsent.json();
  const consentRecordId = consentData.consentRecord.id;

  // Segregation of duties: Bob (uploader) CANNOT self-verify his own uploaded record
  const resSelfVerifyFail = await fetch(`${BASE_URL}/api/consent`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Cookie: bob.cookie },
    body: JSON.stringify({
      workspaceId: "ws_aura_health",
      id: consentRecordId,
      status: "VERIFIED",
    }),
  });
  assert(
    resSelfVerifyFail.status === 403,
    "Self-verification of uploaded consent evidence is strictly blocked with HTTP 403 (Segregation of Duties)"
  );

  // Different user with OWNER role (Alice) verifies the record
  const resOwnerVerify = await fetch(`${BASE_URL}/api/consent`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Cookie: alice.cookie },
    body: JSON.stringify({
      workspaceId: "ws_aura_health",
      id: consentRecordId,
      status: "VERIFIED",
    }),
  });
  assert(resOwnerVerify.status === 200, "Authorized OWNER (different actor) verifies consent record (HTTP 200)");

  // Creating a real-person creator WITH verified ConsentRecord succeeds
  const resRealPersonSuccess = await fetch(`${BASE_URL}/api/creators`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: bob.cookie },
    body: JSON.stringify({
      workspaceId: "ws_aura_health",
      name: "Dr. Andrew Huberman Clone",
      niche: "Neurobiology & Human Optimization",
      isSynthetic: false,
      consentRecordId,
    }),
  });
  assert(
    resRealPersonSuccess.status === 201,
    "Real-person creator WITH verified ConsentRecord succeeds (HTTP 201)"
  );
  const realPersonCreator = (await resRealPersonSuccess.json()).creator;

  // Client Approver approves the real-person creator (allowed since consent is verified)
  const resApproveRealPerson = await fetch(`${BASE_URL}/api/creators`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Cookie: charlie.cookie },
    body: JSON.stringify({
      workspaceId: "ws_aura_health",
      id: realPersonCreator.id,
      status: "APPROVED",
    }),
  });
  assert(
    resApproveRealPerson.status === 200,
    "Client Approver successfully approves real-person creator with verified consent"
  );

  // -------------------------------------------------------------
  // PART 5: IDENTITY LOCK IMMUTABILITY (Dedicated Test Fixture)
  // -------------------------------------------------------------
  console.log("\n🔒 5. IDENTITY LOCK IMMUTABILITY");

  // Create an isolated test creator and lock it
  const resCreateLockTest = await fetch(`${BASE_URL}/api/creators`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: bob.cookie },
    body: JSON.stringify({
      workspaceId: "ws_aura_health",
      name: `Lock Test Creator - ${Date.now()}`,
      niche: "Biometrics",
    }),
  });
  const lockTestCreator = (await resCreateLockTest.json()).creator;

  // Lock the test creator
  await fetch(`${BASE_URL}/api/creators`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Cookie: charlie.cookie },
    body: JSON.stringify({
      workspaceId: "ws_aura_health",
      id: lockTestCreator.id,
      status: "LOCKED",
    }),
  });

  // Modifying locked identity WITHOUT bumpVersion fails with 403
  const resLockedMutateFail = await fetch(`${BASE_URL}/api/creators`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Cookie: bob.cookie },
    body: JSON.stringify({
      workspaceId: "ws_aura_health",
      id: lockTestCreator.id,
      personality: "Reckless, wild, promotes fad diets",
    }),
  });
  assert(
    resLockedMutateFail.status === 403,
    "Modifying locked creator identity without bumpVersion returns HTTP 403 Forbidden"
  );

  // Modifying locked identity WITH bumpVersion succeeds and bumps version
  const resLockedMutateSuccess = await fetch(`${BASE_URL}/api/creators`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Cookie: bob.cookie },
    body: JSON.stringify({
      workspaceId: "ws_aura_health",
      id: lockTestCreator.id,
      bumpVersion: true,
      personality: "Updated scientific perspective with focus on longevity biomarkers",
    }),
  });
  assert(
    resLockedMutateSuccess.status === 200,
    "Modifying locked creator WITH bumpVersion returns HTTP 200"
  );
  const lockTestAfter = (await resLockedMutateSuccess.json()).creator;
  assert(
    lockTestAfter.version === lockTestCreator.version + 1,
    `Creator version incremented from v${lockTestCreator.version} to v${lockTestAfter.version}`
  );

  // Clean up lock test creator
  await prisma.creator.delete({ where: { id: lockTestCreator.id } });

  // -------------------------------------------------------------
  // PART 6: BRAND BRAIN DOCUMENT UPLOAD & CONTEXT RETRIEVAL
  // -------------------------------------------------------------
  console.log("\n📄 6. BRAND BRAIN DOCUMENT UPLOAD & CONTEXT RETRIEVAL");

  const sampleDocText = `
    AuraHealth Clinical Protocol 2026:
    Our marine collagen peptides utilize low-molecular-weight hydrolyzed fish scales harvested sustainably from Norwegian waters.
    Dosage: 10g daily in lukewarm water or matcha.
    Contraindications: Shellfish allergy.
    Prohibited Claim: Never guarantee cure for arthritis.
  `;

  const resDocUpload = await fetch(`${BASE_URL}/api/brand-brain/upload`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: bob.cookie },
    body: JSON.stringify({
      workspaceId: "ws_aura_health",
      filename: "clinical-collagen-protocol.txt",
      text: sampleDocText,
      mimeType: "text/plain",
    }),
  });
  assert(resDocUpload.status === 201, "Brand Brain document upload returns HTTP 201 Created");
  const docResult = await resDocUpload.json();
  assert(
    docResult.document && docResult.document.tokenCount > 0,
    `Document extracted and tokenized (${docResult.document.tokenCount} tokens)`
  );

  // Contextual retrieval search
  const resRetrieval = await fetch(
    `${BASE_URL}/api/brand-brain?workspaceId=ws_aura_health&query=collagen+norwegian`,
    {
      headers: { Cookie: bob.cookie },
    }
  );
  assert(resRetrieval.status === 200, "Context retrieval search returns HTTP 200");
  const retrievalData = await resRetrieval.json();
  assert(
    retrievalData.searchResult && retrievalData.searchResult.matchedDocuments.length > 0,
    "Context retrieval successfully matched uploaded document snippets"
  );

  // -------------------------------------------------------------
  // PART 7: MOCK MULTIMODAL PROVIDERS & USAGE LEDGER DEBIT
  // -------------------------------------------------------------
  console.log("\n🎨 7. MOCK PROVIDERS & USAGE LEDGER LOGGING");

  const initialLedgerCount = await prisma.usageLedger.count();

  // Test Mock Image Generation
  const resGenImage = await fetch(`${BASE_URL}/api/creators/creator_kora_vance/generate-preview`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: bob.cookie },
    body: JSON.stringify({
      workspaceId: "ws_aura_health",
      modality: "image",
    }),
  });
  assert(resGenImage.status === 200, "Mock image generator returns HTTP 200");
  const imageData = await resGenImage.json();
  assert(imageData.telemetry.costUsd > 0, `Image telemetry recorded cost: $${imageData.telemetry.costUsd}`);

  // Test Mock Speech Generation
  const resGenSpeech = await fetch(`${BASE_URL}/api/creators/creator_kora_vance/generate-preview`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: bob.cookie },
    body: JSON.stringify({
      workspaceId: "ws_aura_health",
      modality: "speech",
      text: "Welcome to AuraHealth longevity protocols.",
    }),
  });
  assert(resGenSpeech.status === 200, "Mock speech generator returns HTTP 200");
  const speechData = await resGenSpeech.json();
  assert(speechData.telemetry.costUsd > 0, `Speech telemetry recorded cost: $${speechData.telemetry.costUsd}`);

  const finalLedgerCount = await prisma.usageLedger.count();
  assert(
    finalLedgerCount === initialLedgerCount + 2,
    `UsageLedger accurately recorded 2 multimodal transactions (total: ${finalLedgerCount})`
  );

  console.log("\n=================================================================");
  console.log(`🎉 ALL ${passedTests}/${totalTests} PHASE 2 HTTP ACCEPTANCE TESTS PASSED!`);
  console.log("=================================================================\n");

  // Clean up created real-person fixtures
  try {
    await prisma.creator.deleteMany({ where: { id: realPersonCreator.id } });
    await prisma.consentRecord.deleteMany({ where: { id: consentRecordId } });
  } catch {}
}

runPhase2TestSuite()
  .catch((err) => {
    console.error("❌ Phase 2 HTTP test runner failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
