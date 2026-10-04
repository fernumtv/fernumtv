import { prisma } from "../db";

export interface LogAuditOptions {
  organizationId: string;
  workspaceId?: string;
  userId?: string;
  action: string;
  targetEntity: string;
  targetId: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
}

export async function logAuditAction(options: LogAuditOptions) {
  try {
    return await prisma.auditLog.create({
      data: {
        organizationId: options.organizationId,
        workspaceId: options.workspaceId,
        userId: options.userId,
        action: options.action,
        targetEntity: options.targetEntity,
        targetId: options.targetId,
        metadata: options.metadata ? JSON.stringify(options.metadata) : null,
        ipAddress: options.ipAddress || "127.0.0.1",
      },
    });
  } catch (error) {
    console.error("[AuditLog] Failed to record audit event:", error);
    // Audit failure should not crash the business operation unless strict compliance mode is active
    return null;
  }
}
