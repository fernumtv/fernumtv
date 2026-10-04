# ADR 001: Multi-Tenant Scoping and Row-Level Isolation Strategy

## Status
Accepted

## Context
Fernum operates as a B2B media company managing multiple client brands under agency umbrellas. In Stage 1, internal creative teams operate across brands; in Stage 2 and Stage 3, clients and third parties access the system directly. A data leak between competing brands (e.g. AuraHealth and VervePay, or future rival supplement brands) would be catastrophic for client trust, confidentiality, and legal compliance.

We needed a multi-tenant strategy that:
1. Guarantees that no query or mutation can accidentally omit tenant boundaries.
2. Supports both Agency-level operators (`OWNER`, `ADMIN`) and brand-scoped operators (`CREATIVE_DIRECTOR`, `CLIENT_APPROVER`, `EDITOR`).
3. Runs with zero friction in local development while matching PostgreSQL production semantics.

## Decision
We implemented a **Layered Multi-Tenancy Architecture**:
1. **Schema-Level Scoping**: Every database entity includes a mandatory `organizationId: String` and optional `workspaceId: String`. Composite unique indexes (e.g. `[organizationId, slug]`) ensure naming isolation per tenant.
2. **Access-Layer Enforcer (`getTenantDb`)**: Application services do not query raw `prisma` directly. Instead, they interact via `getTenantDb(organizationId, workspaceId)`:
   - Queries automatically inject tenant filters into the `where` clause.
   - Mutations verify that existing records belong to the caller's tenant before executing updates or deletes.
   - Any cross-tenant attempt throws a strict `TenantAccessViolationError`.
3. **Automated Verification**: An 18-assertion test suite (`tests/tenant-isolation.test.ts`) runs on every build, explicitly verifying that Brand A cannot read, mutate, or delete Brand B records.

## Consequences
- **Pros**:
  - Zero risk of forgotten `where: { tenantId }` in queries.
  - Defense-in-depth: Even if an API route receives an arbitrary item ID, the tenant layer rejects cross-tenant manipulation.
  - Seamless migration path to Stage 2 and Stage 3 without database re-architecture.
- **Cons**:
  - Developers must use `getTenantDb()` rather than unadorned `prisma` instances for business logic.
