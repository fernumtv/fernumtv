import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";

const prisma = new PrismaClient();

const DEV_DEFAULT_SECRET = "fernum_development_secret_key_32_bytes_min!";
if (process.env.NODE_ENV === "production") {
  const secret = process.env.APP_SECRET;
  if (!secret || secret === DEV_DEFAULT_SECRET || secret.length < 32) {
    console.error(
      "❌ [Security/Fatal] Refusing to start in production: APP_SECRET must be set to a cryptographically secure random string (minimum 32 characters) and cannot use the development default."
    );
    process.exit(1);
  }
}

async function bootstrap() {
  console.log("==================================================");
  console.log("🚀 FERNUM STUDIO DEV BOOTSTRAPPER");
  console.log("==================================================");

  try {
    // 1. Check if database tables exist by querying Organization count
    console.log("📦 Checking database state...");
    let needsPush = false;
    try {
      await prisma.organization.count();
      console.log(" Database schema is active.");
    } catch (e) {
      console.log("⚡ Database schema missing or out of sync. Syncing schema...");
      needsPush = true;
    }

    if (needsPush) {
      execSync("npx prisma db push --skip-generate", { stdio: "inherit" });
      console.log(" Database schema created/synced successfully.");
    }

    // 2. Check if seed data exists
    const orgCount = await prisma.organization.count();
    const itemCount = await prisma.contentItem.count();

    if (orgCount === 0 || itemCount === 0) {
      console.log("🌱 Database empty. Executing seed script...");
      execSync("npx tsx scripts/seed.ts", { stdio: "inherit" });
      console.log(" Seed data populated successfully.");
    } else {
      console.log(` Database already seeded (${orgCount} orgs, ${itemCount} content items ready).`);
    }

    console.log("🎉 Fernum local database is 100% ready.");
    console.log("==================================================\n");
  } catch (err) {
    console.error("❌ Bootstrap error:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

bootstrap();
