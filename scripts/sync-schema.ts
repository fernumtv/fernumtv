import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const POSTGRES_SCHEMA = path.resolve(process.cwd(), "prisma/schema.postgres.prisma");
const SQLITE_SCHEMA = path.resolve(process.cwd(), "prisma/schema.prisma");

export function generateSqliteFromPostgres(): void {
  console.log("🔄 Generating SQLite schema from canonical PostgreSQL schema...");
  
  if (!fs.existsSync(POSTGRES_SCHEMA)) {
    throw new Error(`Canonical schema not found at: ${POSTGRES_SCHEMA}`);
  }

  let content = fs.readFileSync(POSTGRES_SCHEMA, "utf-8");

  // 1. Change datasource provider from postgresql to sqlite
  content = content.replace(/provider\s*=\s*"postgresql"/, 'provider = "sqlite"');

  // 2. Extract enum names
  const enumNames: string[] = [];
  const enumRegex = /enum\s+(\w+)\s*\{[^}]*\}/g;
  let match;
  while ((match = enumRegex.exec(content)) !== null) {
    enumNames.push(match[1]);
  }

  // 3. Comment out enum declarations for SQLite
  content = content.replace(/enum\s+(\w+)\s*\{([^}]*)\}/g, (fullMatch, enumName, body) => {
    const commentedLines = body
      .trim()
      .split("\n")
      .map((l: string) => `//   ${l.trim()}`)
      .join("\n");
    return `// Enum ${enumName} mapped to String in SQLite\n// enum ${enumName} {\n${commentedLines}\n// }`;
  });

  // 4. Replace enum type references in model fields with String
  for (const enumName of enumNames) {
    // Matches e.g. "role Role @default(VIEWER)" -> "role String @default("VIEWER")"
    const fieldWithDefaultRegex = new RegExp(`(\\b\\w+\\s+)${enumName}(\\??\\s+@default\\()(\\w+)(\\))`, "g");
    content = content.replace(fieldWithDefaultRegex, '$1String$2"$3"$4');

    // Matches e.g. "role Role" or "role Role?"
    const fieldSimpleRegex = new RegExp(`(\\b\\w+\\s+)${enumName}(\\??)(\\s+)`, "g");
    content = content.replace(fieldSimpleRegex, "$1String$2$3");
  }

  // 5. Remove Postgres-specific native type annotations
  content = content.replace(/@db\.Text/g, "");
  content = content.replace(/@db\.Decimal\([^)]*\)/g, "");

  // 6. Convert Decimal type to Float for SQLite
  content = content.replace(/\bDecimal\b/g, "Float");

  // 7. Convert Json? to String? for SQLite compatibility
  content = content.replace(/\bJson\b/g, "String");

  // 8. Clean up multiple spaces or empty annotations
  content = content.replace(/\s+;/g, ";");

  fs.writeFileSync(SQLITE_SCHEMA, content, "utf-8");
  console.log(`✅ SQLite schema generated cleanly at ${SQLITE_SCHEMA}`);

  // Validate both schemas with prisma CLI
  try {
    execSync("npx prisma validate --schema=prisma/schema.postgres.prisma", {
      stdio: "pipe",
      env: { ...process.env, DATABASE_URL: "postgresql://dummy:dummy@localhost:5432/fernum?sslmode=disable" },
    });
    execSync("npx prisma validate --schema=prisma/schema.prisma", {
      stdio: "pipe",
      env: { ...process.env, DATABASE_URL: "file:./dev.db" },
    });
    console.log("✅ Both PostgreSQL and SQLite schemas validated successfully with Prisma.");
  } catch (err: any) {
    console.error("❌ Prisma validation warning:", err.message);
  }
}

if (require.main === module) {
  generateSqliteFromPostgres();
}
