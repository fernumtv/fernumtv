import { getTenantDb, TenantAccessViolationError } from "../src/lib/db";
import { assertPermission, UnauthorizedError, hasPermission } from "../src/lib/auth/rbac";
import { storage } from "../src/lib/storage";
import { logAuditAction } from "../src/lib/audit";
import { prisma } from "../src/lib/db";

async function runTestSuite() {
  console.log("=================================================");
  console.log("🧪 RUNNING FERNUM PHASE 1 TENANT ISOLATION & RBAC TESTS");
  console.log("=================================================\n");

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, testName: string) {
    totalTests++;
    if (condition) {
      console.log(`  PASSED: ${testName}`);
      passedTests++;
    } else {
      console.error(`❌ FAILED: ${testName}`);
      throw new Error(`Test assertion failed: ${testName}`);
    }
  }

  // Create dedicated self-contained test items
  const auraDb = getTenantDb("org_fernum_studio", "ws_aura_health");
  const verveDb = getTenantDb("org_fernum_studio", "ws_verve_pay");

  const sampleAuraItem = await auraDb.contentItem.create({
    topic: `Tenant Isolation Test Aura - ${Date.now()}`,
    workspaceId: "ws_aura_health",
  });
  const sampleVerveItem = await verveDb.contentItem.create({
    topic: `Tenant Isolation Test Verve - ${Date.now()}`,
    workspaceId: "ws_verve_pay",
  });

  try {
    const auraItems = await auraDb.contentItem.findMany();
    const verveItems = await verveDb.contentItem.findMany();

    console.log("📋 1. TENANT READ ISOLATION");
    // Test 1: AuraHealth tenant query should return ONLY AuraHealth items
    assert(
      auraItems.length > 0 && auraItems.every((item) => item.workspaceId === "ws_aura_health"),
      "AuraHealth query only returns AuraHealth records (zero cross-tenant bleed)"
    );

    // Test 2: VervePay tenant query should return ONLY VervePay items
    assert(
      verveItems.length > 0 && verveItems.every((item) => item.workspaceId === "ws_verve_pay"),
      "VervePay query only returns VervePay records (zero cross-tenant bleed)"
    );

    // Test 3: Attempting to read a VervePay item using AuraHealth tenant DB throws TenantAccessViolationError
    let crossReadBlocked = false;
    try {
      await auraDb.contentItem.findUnique(sampleVerveItem.id);
    } catch (err) {
      if (err instanceof TenantAccessViolationError) {
        crossReadBlocked = true;
      }
    }
    assert(crossReadBlocked, "AuraHealth tenant attempting to read VervePay item throws TenantAccessViolationError");

    console.log("\n📋 2. TENANT WRITE ISOLATION (MUTATION & DELETION)");
    // Test 4: Attempting to update a VervePay item using AuraHealth tenant DB throws TenantAccessViolationError
    let crossUpdateBlocked = false;
    try {
      await auraDb.contentItem.update(sampleVerveItem.id, {
        topic: "HACKED: Cross-tenant topic overwrite",
      });
    } catch (err) {
      if (err instanceof TenantAccessViolationError) {
        crossUpdateBlocked = true;
      }
    }
    assert(crossUpdateBlocked, "AuraHealth tenant attempting to mutate VervePay item throws TenantAccessViolationError");

    // Test 5: Attempting to delete a VervePay item using AuraHealth tenant DB throws TenantAccessViolationError
    let crossDeleteBlocked = false;
    try {
      await auraDb.contentItem.delete(sampleVerveItem.id);
    } catch (err) {
      if (err instanceof TenantAccessViolationError) {
        crossDeleteBlocked = true;
      }
    }
    assert(crossDeleteBlocked, "AuraHealth tenant attempting to delete VervePay item throws TenantAccessViolationError");

  // Test 6: Attempting to create an item in a mismatched workspace throws error
  let mismatchedCreateBlocked = false;
  try {
    await auraDb.contentItem.create({
      topic: "Illegal workspace inject",
      workspaceId: "ws_verve_pay", // mismatch with auraDb
    });
  } catch (err) {
    if (err instanceof TenantAccessViolationError) {
      mismatchedCreateBlocked = true;
    }
  }
  assert(mismatchedCreateBlocked, "Creating record with mismatched workspaceId throws TenantAccessViolationError");

  console.log("\n📋 3. ROLE-BASED ACCESS CONTROL (RBAC) GATES");
  // Test 7: VIEWER cannot approve or edit content
  assert(!hasPermission("VIEWER", "APPROVE_CONTENT"), "Role VIEWER cannot approve content");
  assert(!hasPermission("VIEWER", "EDIT_CONTENT"), "Role VIEWER cannot edit content");

  // Test 8: CLIENT_APPROVER can approve/reject but cannot delete or manage team
  assert(hasPermission("CLIENT_APPROVER", "APPROVE_CONTENT"), "Role CLIENT_APPROVER can approve content");
  assert(hasPermission("CLIENT_APPROVER", "REJECT_CONTENT"), "Role CLIENT_APPROVER can reject content");
  assert(!hasPermission("CLIENT_APPROVER", "DELETE_CONTENT"), "Role CLIENT_APPROVER cannot delete content");
  assert(!hasPermission("CLIENT_APPROVER", "MANAGE_TEAM"), "Role CLIENT_APPROVER cannot manage team");

  // Test 9: EDITOR cannot approve content (must go to Creative Director or Client Approver)
  assert(hasPermission("EDITOR", "EDIT_CONTENT"), "Role EDITOR can edit content");
  assert(!hasPermission("EDITOR", "APPROVE_CONTENT"), "Role EDITOR cannot approve content (human approval gate enforced)");

  // Test 10: assertPermission throws UnauthorizedError when permission is missing
  let rbacBlocked = false;
  try {
    assertPermission("EDITOR", "APPROVE_CONTENT");
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      rbacBlocked = true;
    }
  }
  assert(rbacBlocked, "assertPermission('EDITOR', 'APPROVE_CONTENT') strictly throws UnauthorizedError");

  console.log("\n📋 4. STORAGE SIGNED URL TAMPER-PROOF SECURITY");
  // Test 11: Upload and verify signed URL
  const uploadResult = await storage.uploadAsset({
    organizationId: "org_fernum_studio",
    workspaceId: "ws_aura_health",
    filename: "test-identity-frame.png",
    data: Buffer.from("FERNUM_IDENTITY_LOCK_TEST_IMAGE_BUFFER"),
    contentType: "image/png",
  });

  const parsedUrl = new URL(uploadResult.signedUrl);
  const expiresAt = parseInt(parsedUrl.searchParams.get("expires") || "0", 10);
  const sig = parsedUrl.searchParams.get("sig") || "";

  const isValidSig = storage.verifySignature(uploadResult.key, expiresAt, sig);
  assert(isValidSig, "Valid signed asset URL passes HMAC signature verification");

  // Test 12: Tampered signature is rejected
  const isTamperedRejected = !storage.verifySignature(uploadResult.key, expiresAt, sig + "_tampered");
  assert(isTamperedRejected, "Tampered URL signature is strictly rejected by storage layer");

  console.log("\n📋 5. AUDIT LOG RECORDING & IMMUTABILITY");
  // Test 13: Audit log records properly with tenant context
  const testUser = await prisma.user.findFirst();
  const auditEntry = await logAuditAction({
    organizationId: "org_fernum_studio",
    workspaceId: "ws_aura_health",
    userId: testUser?.id,
    action: "CONTENT_STAGE_TRANSITION",
    targetEntity: "ContentItem",
    targetId: sampleAuraItem.id,
    metadata: { from: "IDEA", to: "SCRIPTED" },
  });

  assert(
    auditEntry !== null && auditEntry.organizationId === "org_fernum_studio" && auditEntry.action === "CONTENT_STAGE_TRANSITION",
    "Audit log records tenant-scoped event with actor and transition metadata"
  );

  } finally {
    // Clean up created test items
    await prisma.contentItem.deleteMany({
      where: { id: { in: [sampleAuraItem.id, sampleVerveItem.id] } },
    });
  }

  console.log("\n=================================================");
  console.log(`🎉 ALL ${passedTests}/${totalTests} TESTS PASSED CLEANLY!`);
  console.log("=================================================\n");
}

runTestSuite()
  .catch((err) => {
    console.error("❌ Test runner failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
