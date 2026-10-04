import { execSync } from "child_process";

async function runPostgresTests() {
  const dbUrl = process.env.DATABASE_URL;

  console.log("=================================================================");
  console.log("🐘 FERNUM POSTGRESQL TEST RUNNER (ALL SUITES)");
  console.log("=================================================================\n");

  if (!dbUrl || (!dbUrl.startsWith("postgresql://") && !dbUrl.startsWith("postgres://"))) {
    console.error("❌ ERROR: DATABASE_URL is not set to a PostgreSQL connection string.");
    console.error("   Current DATABASE_URL:", dbUrl || "(not set)");
    console.error("   Example: $env:DATABASE_URL=\"postgresql://user:pass@ep-xyz.neon.tech/neondb?sslmode=require\"");
    process.exit(1);
  }

  console.log("🔗 Target Database:", dbUrl.replace(/:[^:@]+@/, ":****@"));

  try {
    // 1. Sync PostgreSQL schema
    console.log("\n📦 1. Pushing canonical schema to PostgreSQL database...");
    execSync("npx prisma db push --schema prisma/schema.postgres.prisma", {
      stdio: "inherit",
      env: process.env,
    });

    // 2. Generate Prisma Client for PostgreSQL
    console.log("\n⚙️ 2. Generating Prisma client...");
    execSync("npx prisma generate --schema prisma/schema.postgres.prisma", {
      stdio: "inherit",
      env: process.env,
    });

    // 3. Seed database
    console.log("\n🌱 3. Seeding PostgreSQL database...");
    execSync("npx tsx scripts/seed.ts", {
      stdio: "inherit",
      env: process.env,
    });

    // 4. Run all suites sequentially
    const suites = [
      { name: "Suite 1: Tenant Read/Write Isolation & RBAC", cmd: "npx tsx tests/tenant-isolation.test.ts" },
      { name: "Suite 2: HTTP Auth & Tenant Isolation", cmd: "npx tsx tests/http-tenant-isolation.test.ts" },
      { name: "Suite 3: Brand Brain & Creator Studio HTTP", cmd: "npx tsx tests/phase2-http.test.ts" },
      { name: "Suite 4: Content Studio Flywheel HTTP", cmd: "npx tsx tests/phase3-http.test.ts" },
      { name: "Suite 5: Orchestration & Media Workers HTTP", cmd: "npx tsx tests/phase4-http.test.ts" },
      { name: "Suite 6: Creator Consistency & Quality Gate v1 HTTP", cmd: "npx tsx tests/phase5-http.test.ts" },
    ];

    console.log("\n🚀 4. Executing all test suites against PostgreSQL...\n");
    for (const s of suites) {
      console.log(`\n-----------------------------------------------------------------`);
      console.log(`▶ Running ${s.name}`);
      console.log(`-----------------------------------------------------------------`);
      execSync(s.cmd, { stdio: "inherit", env: process.env });
    }

    console.log("\n=================================================================");
    console.log("🎉 ALL SUITES PASSED CLEANLY ON POSTGRESQL!");
    console.log("=================================================================\n");
  } catch (err: any) {
    console.error("\n💥 PostgreSQL test run failed:", err.message);
    process.exit(1);
  }
}

runPostgresTests();
