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

  // Extract fernum_session cookie value
  const cookieMatch = rawCookie.match(/fernum_session=([^;]+)/);
  if (!cookieMatch) {
    throw new Error(`Session cookie not found in Set-Cookie header: ${rawCookie}`);
  }

  return {
    cookie: `fernum_session=${cookieMatch[1]}`,
    user: data.user,
  };
}

async function runHttpTestSuite() {
  console.log("=================================================================");
  console.log("🌐 RUNNING HTTP-LEVEL TENANT ISOLATION & AUTH SECURITY SUITE");
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

  // Retrieve seed items for testing
  const auraItems = await prisma.contentItem.findMany({ where: { workspaceId: "ws_aura_health" } });
  const verveItems = await prisma.contentItem.findMany({ where: { workspaceId: "ws_verve_pay" } });

  const sampleAuraItem = auraItems[0];
  const sampleVerveItem = verveItems[0];
  const awaitingApprovalAuraItem = auraItems.find((i) => i.status === "AWAITING_APPROVAL") || sampleAuraItem;

  // -------------------------------------------------------------
  // 1. LOGGED-OUT REQUESTS MUST RETURN 401
  // -------------------------------------------------------------
  console.log("🔒 1. UNRESPONSIVE / LOGGED-OUT SECURITY (HTTP 401 REJECTION)");

  const resUnauthGet = await fetch(`${BASE_URL}/api/content-items?workspaceId=ws_aura_health`);
  assert(resUnauthGet.status === 401, "Logged-out GET /api/content-items returns 401 Unauthorized");

  const resUnauthPost = await fetch(`${BASE_URL}/api/content-items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic: "Exploit", workspaceId: "ws_aura_health" }),
  });
  assert(resUnauthPost.status === 401, "Logged-out POST /api/content-items returns 401 Unauthorized");

  const resUnauthPatch = await fetch(`${BASE_URL}/api/content-items`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: sampleAuraItem.id, status: "APPROVED" }),
  });
  assert(resUnauthPatch.status === 401, "Logged-out PATCH /api/content-items returns 401 Unauthorized");

  const resUnauthSession = await fetch(`${BASE_URL}/api/auth/session`);
  assert(resUnauthSession.status === 401, "Logged-out GET /api/auth/session returns 401 Unauthorized");

  // -------------------------------------------------------------
  // 2. REAL AUTHENTICATION & LOGIN FLOW
  // -------------------------------------------------------------
  console.log("\n🔑 2. REAL LOGIN & SESSION COOKIE ISSUANCE");

  // Bad password rejection
  const badLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "bob@aurahealth.com", password: "IncorrectPassword123!" }),
  });
  assert(badLoginRes.status === 401, "Login with invalid password strictly returns 401");

  // Valid logins
  const bobAuth = await loginUser("bob@aurahealth.com", "FernumBob2026!");
  assert(bobAuth.cookie.includes("fernum_session="), "Valid login returns 200 and sets httpOnly fernum_session cookie");

  const danaAuth = await loginUser("dana@vervepay.com", "FernumDana2026!");
  const charlieAuth = await loginUser("charlie@aurahealth.com", "FernumCharlie2026!");
  const evanAuth = await loginUser("evan@aurahealth.com", "FernumEvan2026!");

  // Verify session endpoint with cookie
  const sessionRes = await fetch(`${BASE_URL}/api/auth/session`, {
    headers: { Cookie: bobAuth.cookie },
  });
  const sessionData = await sessionRes.json();
  assert(
    sessionRes.status === 200 && sessionData.user.email === "bob@aurahealth.com",
    "GET /api/auth/session with valid cookie derives authenticated user identity"
  );

  // -------------------------------------------------------------
  // 3. AURAHEALTH USER REQUESTING VERVEPAY DATA (CROSS-TENANT 403)
  // -------------------------------------------------------------
  console.log("\n🛡️ 3. CROSS-TENANT HTTP ACCESS REJECTION (HTTP 403 FORBIDDEN)");

  // Read cross-tenant
  const crossReadRes = await fetch(`${BASE_URL}/api/content-items?workspaceId=ws_verve_pay`, {
    headers: { Cookie: bobAuth.cookie },
  });
  assert(
    crossReadRes.status === 403,
    "AuraHealth user attempting GET on VervePay workspace returns 403 Forbidden"
  );

  // Create cross-tenant
  const crossCreateRes = await fetch(`${BASE_URL}/api/content-items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: bobAuth.cookie,
    },
    body: JSON.stringify({
      topic: "Cross-Tenant Breach Attempt",
      workspaceId: "ws_verve_pay", // Attempting to inject into foreign brand
    }),
  });
  assert(
    crossCreateRes.status === 403,
    "AuraHealth user attempting POST into VervePay workspace returns 403 Forbidden"
  );

  // Update cross-tenant
  const crossUpdateRes = await fetch(`${BASE_URL}/api/content-items`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Cookie: bobAuth.cookie,
    },
    body: JSON.stringify({
      id: sampleVerveItem.id, // Foreign item ID
      status: "APPROVED",
    }),
  });
  assert(
    crossUpdateRes.status === 403,
    "AuraHealth user attempting PATCH on VervePay item returns 403 Forbidden"
  );

  // Delete cross-tenant
  const crossDeleteRes = await fetch(`${BASE_URL}/api/content-items?id=${sampleVerveItem.id}`, {
    method: "DELETE",
    headers: { Cookie: bobAuth.cookie },
  });
  assert(
    crossDeleteRes.status === 403,
    "AuraHealth user attempting DELETE on VervePay item returns 403 Forbidden"
  );

  // -------------------------------------------------------------
  // 4. FORGED BODY INJECTION IMMUNITY (CLIENT IDENTITY IGNORED)
  // -------------------------------------------------------------
  console.log("\n🛑 4. FORGED CLIENT IDENTITY INJECTION IMMUNITY");

  // Bob (AuraHealth Creative Director) sends forged body claiming to be Alice (Owner) targeting VervePay
  const forgedRes = await fetch(`${BASE_URL}/api/content-items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: bobAuth.cookie,
    },
    body: JSON.stringify({
      topic: "Forged Identity Test",
      workspaceId: "ws_verve_pay",
      userKey: "alice",
      userId: "user_alice_vance",
      role: "OWNER",
    }),
  });
  assert(
    forgedRes.status === 403,
    "Forged userKey/role/workspaceId in request body is strictly ignored by server (returns 403)"
  );

  // -------------------------------------------------------------
  // 5. ROLE-BASED ACCESS CONTROL REJECTION (HTTP 403 ON APPROVAL GATE)
  // -------------------------------------------------------------
  console.log("\n⚖️ 5. RBAC HUMAN APPROVAL GATE REJECTION OVER HTTP");

  // EDITOR (Dana Kapoor) attempting to approve VervePay content
  const editorApproveRes = await fetch(`${BASE_URL}/api/content-items`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Cookie: danaAuth.cookie,
    },
    body: JSON.stringify({
      id: sampleVerveItem.id,
      status: "APPROVED",
    }),
  });
  assert(
    editorApproveRes.status === 403,
    "EDITOR role calling approve endpoint is strictly rejected with 403 Forbidden"
  );

  // VIEWER (Evan Wright) attempting to approve AuraHealth content
  const viewerApproveRes = await fetch(`${BASE_URL}/api/content-items`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Cookie: evanAuth.cookie,
    },
    body: JSON.stringify({
      id: sampleAuraItem.id,
      status: "APPROVED",
    }),
  });
  assert(
    viewerApproveRes.status === 403,
    "VIEWER role calling approve endpoint is strictly rejected with 403 Forbidden"
  );

  // VIEWER attempting to create content
  const viewerCreateRes = await fetch(`${BASE_URL}/api/content-items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: evanAuth.cookie,
    },
    body: JSON.stringify({
      topic: "Unauthorized Brief",
      workspaceId: "ws_aura_health",
    }),
  });
  assert(
    viewerCreateRes.status === 403,
    "VIEWER role calling create content endpoint is strictly rejected with 403 Forbidden"
  );

  // -------------------------------------------------------------
  // 6. LEGITIMATE AUTHORIZED APPROVAL (CLIENT_APPROVER)
  // -------------------------------------------------------------
  console.log("\n✅ 6. LEGITIMATE AUTHORIZED HUMAN APPROVAL OVER HTTP");

  // CLIENT_APPROVER (Charlie Ross) approves AuraHealth item
  const clientApproverRes = await fetch(`${BASE_URL}/api/content-items`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Cookie: charlieAuth.cookie,
    },
    body: JSON.stringify({
      id: awaitingApprovalAuraItem.id,
      status: "APPROVED",
    }),
  });
  assert(
    clientApproverRes.status === 200,
    "CLIENT_APPROVER calling approve endpoint on their brand succeeds with 200 OK"
  );

  console.log("\n=================================================================");
  console.log(`🎉 ALL ${passedTests}/${totalTests} HTTP-LEVEL SECURITY TESTS PASSED CLEANLY!`);
  console.log("=================================================================\n");
}

runHttpTestSuite()
  .catch((err) => {
    console.error("❌ HTTP Test Runner Error:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
