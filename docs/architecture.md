# Fernum Studio Architecture Document

## 1. System Overview
Fernum is an AI-native B2B media company platform. It provides an automated, human-in-the-loop creative pipeline that continuously produces, verifies, distributes, and optimizes brand content using persistent virtual influencers.

```
+-----------------------------------------------------------------------------------+
|                                 Fernum Studio                                     |
+-----------------------------------------------------------------------------------+
|  [Internal Ops Board]  [Brand Brain]  [Creator Studio]  [Content Studio]          |
|  [Campaign Center]     [Social Center] [Analytics]      [Team & RBAC]             |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                           Multi-Tenant Security Gate                              |
|           getTenantDb(orgId, wsId)  |  RBAC Permission Assertion                  |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                           Production Flywheel Engine                              |
|   Idea -> Script -> AI Gen -> QC Verification -> Human Gate -> Publish            |
+-----------------------------------------------------------------------------------+
        |                           |                          |
        v                           v                          v
 [PostgreSQL / SQLite]      [Universal Queue]          [Object Storage]
  Multi-tenant schema        BullMQ + In-Memory         Signed URLs (HMAC/S3)
```

## 2. Multi-Tenancy Hierarchy
1. `Organization`: Top-level agency or white-label entity (`Fernum Media Studio`).
2. `Workspace`: Client brand account (`AuraHealth`, `VervePay`).
3. `User & Membership`: Global users mapped to organization and assigned roles per workspace.

## 3. Human-in-the-Loop (HITL) Gate
In accordance with Core Operating Principle #4:
- Automated publishing without human approval is strictly prevented by software and database constraints.
- Content must pass through `AWAITING_APPROVAL` and receive explicit sign-off by a designated `CLIENT_APPROVER`, `CREATIVE_DIRECTOR`, `ADMIN`, or `OWNER`.
- All decisions record an immutable entry into `AuditLog`.

## 4. Cost-Per-Asset Tracking
In accordance with Core Operating Principle #3:
- Every asset record stores `costEstimate` and logs compute units to `UsageLedger`.
- Aggregated pipeline spend is metered in real time and displayed against monthly brand budgets.
