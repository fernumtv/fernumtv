# Fernum Media Studio Engine

> **AI-Native B2B Virtual Creator Studio**: Continuous brand distribution platform managing persistent virtual influencers for brands on YouTube and Instagram using AI orchestration plus a human creative operations team.

---

## 🚀 Start Command & URL

### 1. Boot the Entire Application (Single Command)
```powershell
npm run dev
```

* **Live URL**: **`http://localhost:3100`** *(or `http://127.0.0.1:3100`)*
* Automatically runs the dev bootstrapper: checks the local database, creates/syncs schema, and seeds demo data if empty.
* Zero external cloud services, zero Redis, zero Docker required for local development.

---

## 👥 Seeded Demo Logins by Role

Each demo user is provisioned with a cryptographic `scrypt` password hash and strict workspace membership:

| Name | Role | Email | Password | Scope / Authority |
|---|---|---|---|---|
| **Alice Vance** | `OWNER` | `alice@fernum.studio` | `FernumAlice2026!` | Agency Admin (Global Access across all Brands) |
| **Bob Chen** | `CREATIVE_DIRECTOR` | `bob@aurahealth.com` | `FernumBob2026!` | AuraHealth (Creative Director & Approver) |
| **Charlie Ross** | `CLIENT_APPROVER` | `charlie@aurahealth.com` | `FernumCharlie2026!` | AuraHealth (Client Approver Gate) |
| **Dana Kapoor** | `EDITOR` | `dana@vervepay.com` | `FernumDana2026!` | VervePay (Content Creator & Script Editor) |
| **Evan Wright** | `VIEWER` | `evan@aurahealth.com` | `FernumEvan2026!` | AuraHealth (Read-Only Viewer) |

> [!TIP]
> In local development (`NODE_ENV=development`), the `/login` page includes a **Dev Quick Fill** panel with single-click credential loading for rapid role switching. This panel is automatically disabled in production.

---

## 🧪 How to Run Automated Tests

### A. HTTP-Level Integration & Security Test Suite
Tests real HTTP requests over the network (`http://127.0.0.1:3100`), verifying that unauthenticated requests return 401, cross-tenant requests return 403, forged request bodies are ignored, and RBAC gates reject unauthorized approvals:

```powershell
npm run test:http
```

### B. Database & Access-Layer Tenant Isolation Suite
Directly tests Prisma access-layer queries and assertions, verifying zero cross-tenant bleed, HMAC signed storage URL verification, and immutable audit logging:

### C. Brand Brain & Creator Studio Acceptance Suite (Phase 2)
Tests document upload, content validation, dual-custody consent verification, and locked creator immutability:
```powershell
npm run test:phase2
```

### D. Content Studio Pipeline & Grounding Suite (Phase 3)
Tests 6-stage pipeline generation, A/B variant selection, version reverting, compliance pre-check blocking, and human approval gating:
```powershell
npm run test:phase3
```

---

## 🛡️ Compliance Pre-Check Engine: Operation & Known Limitations

The Content Studio incorporates an automated pre-check (`src/lib/compliance/precheck.ts`) that screens generated text before human review:

1. **How It Works**:
   - **Prohibited Claims Inspection**: Scans hooks, scripts, and captions against zero-tolerance brand claims (e.g. disease cure claims, guaranteed weight loss numbers, unverified FDA certifications).
   - **Prohibited Topics**: Matches text against brand-prohibited topics and sensitive keywords.
   - **Mandatory Legal Disclaimers**: Checks whether required disclosures (e.g., `#Ad #SupplementDisclosure`, FDA evaluation notices) are present.
   - **Gate Enforcement**: If any violation is marked `BLOCKING`, human approval (`POST /api/content-items/[id]/approve`) is strictly rejected with `HTTP 400 Bad Request` until the text is regenerated or edited to comply.

2. **Known Limits & Non-Semantic Behavior**:
   - **Syntactic Keyword & Regex Matching**: The current implementation operates via token extraction and regex patterns (`\b(cure|cures|guarantee)\b`). It evaluates exact word occurrences and multi-word token overlap.
   - **Not Deeply Semantic**: Subtle or implied non-compliant claims (e.g. *"Our peptides reverse biological aging at the mitochondrial level without medicine"*) may not match literal keyword triggers if they avoid explicit words like "cure".
   - **Phase 5 Upgrade**: The comprehensive 13-check automated quality system in Phase 5 will introduce deep semantic LLM-based policy checking, hallucination scoring, and cross-reference verification against clinical documentation.

---

## 🛡️ Security & Multi-Tenancy Architecture

1. **Real Authentication**:
   - Cryptographic password hashing (`crypto.scryptSync` with random salt).
   - Tamper-proof HMAC-SHA256 session tokens stored in secure, `httpOnly`, `sameSite: "lax"` cookies.
   - Server-side redirect of unauthenticated users to `/login`.
   - Production guard refusing startup if `APP_SECRET` is missing or default.
2. **Server-Derived Identity & Authorization**:
   - The server **never** trusts client-provided `userKey`, `role`, or `workspaceId` authority from request bodies or query params.
   - On every API route, the server derives the caller's identity strictly from the verified session cookie.
   - Explicit workspace membership checks enforce that callers can only access and manipulate data within their assigned brands. Cross-tenant access strictly returns **403 Forbidden**.
3. **RBAC Gated Human Approval Workflow**:
   - Only `OWNER`, `ADMIN`, `CREATIVE_DIRECTOR`, and `CLIENT_APPROVER` roles can approve content items.
   - `EDITOR` and `VIEWER` roles attempting to trigger approvals are rejected with **403 Forbidden**.
4. **Offline Zero-Key Dev Mode**:
   - Local database runs with zero servers.
   - Offline background jobs run via an in-memory queue driver.
   - Asset storage serves local HMAC-signed URLs with automatic expiration.

---

## 🔍 Quality Gate v1 & Honest Labeling

The Quality Gate evaluates generated assets against quality and compliance policies:
1. **Implemented Real Checks**:
   - **Brand Compliance Guardrail**: Validates captions and script text against prohibited brand claims.
   - **AI Disclosure Tagging**: Verifies presence of mandatory tags (`#Ad`, `#AI`, etc.).
   - **Audio Loudness**: Normalizes and checks audio using FFmpeg (`-16 LUFS` target).
   - **Caption to Script Keyword Overlap**: Deterministic Jaccard token overlap between caption and approved script (**labeled "keyword overlap", not semantic**).
   - **Video Format & Duration**: Validates 9:16 vertical aspect ratio and duration against limits.
2. **Honest Labeling of Simulated Checks**:
   - Any check backed by an offline mock (e.g. facial identity concordance when no live vision API is configured) displays as **`"SIMULATED (mock provider)"`** in both the UI and the `QualityReport` JSON.
   - **Simulated and unbuilt checks are strictly excluded from the overall score** (`overallScore` is computed solely across verified, real checks).
   - Unbuilt future checks are marked `NOT_IMPLEMENTED` with `score: null`.

---

## 📸 Creator Identity Consistency Experiment (Manual Visual Test)

A manual verification script is provided in `scripts/identity-experiment.ts` to generate N conditioned variations of a creator's locked reference face:

```powershell
# 1. Dry Run / Cost Estimate Check (Prints estimate and halts safely without spending)
npx tsx scripts/identity-experiment.ts --count 4

# 2. Confirmed Execution in Mock Mode (Free, offline)
npx tsx scripts/identity-experiment.ts --count 4 --confirm

* **Safety Gating**: The script prints the target creator, reference image URL, provider mode, per-unit price, and total dollar estimate. It halts immediately unless `--confirm` is provided.
* **Visual Contact Sheet**: On completion, it creates a standalone HTML contact sheet at `.storage/experiments/identity-[timestamp]/index.html` featuring the locked reference image alongside the generated variations for side-by-side visual inspection.

> [!IMPORTANT]
> **PuLID Requires Photographic References**: Fal PuLID (`fal-ai/flux-pulid`) uses facial feature embedding extraction (InsightFace) which requires a photorealistic image (JPEG/PNG) with clear facial landmarks. The `.svg` placeholders in `public/synthetic-assets/` are lightweight vectors intended for offline UI display only. To generate a real photorealistic synthetic character reference, run:
> ```powershell
> # Dry run (prints verified $0.04/MP estimate and halts safely):
> npx tsx scripts/generate-synthetic-reference.ts --creator "Kora Vance"
>
> # Confirmed run (downloads high-fidelity synthetic JPEG and locks creator):
> $env:FAL_KEY="your_fal_key"
> npx tsx scripts/generate-synthetic-reference.ts --creator "Kora Vance" --confirm
> ```

---

## 🐘 Running Tests Against PostgreSQL (Self-Service)

To run all six test suites against your own hosted PostgreSQL database (e.g. Neon, Supabase, or AWS RDS), execute the runner directly in your own terminal without sharing credentials:

```powershell
# In your local terminal:
$env:DATABASE_URL="postgresql://user:password@ep-xyz.neon.tech/neondb?sslmode=require"
npm run test:postgres
```

The runner automatically:
1. Pushes the canonical PostgreSQL schema (`prisma/schema.postgres.prisma`).
2. Generates the PostgreSQL Prisma client.
3. Seeds the demo organization, brands, users, and virtual creators.
4. Executes all six test suites sequentially and reports any dialect/behavior differences.


