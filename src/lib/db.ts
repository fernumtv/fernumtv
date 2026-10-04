import { PrismaClient } from "@prisma/client";

// Global singleton to prevent multiple PrismaClient instances during hot-reload
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export class TenantAccessViolationError extends Error {
  constructor(message: string) {
    super(`[Security/TenantIsolation] ${message}`);
    this.name = "TenantAccessViolationError";
  }
}

/**
 * Tenant-scoped database access layer.
 * Enforces organizationId and optional workspaceId on every operation.
 */
export function getTenantDb(organizationId: string, workspaceId?: string) {
  if (!organizationId) {
    throw new TenantAccessViolationError("organizationId is mandatory for all database operations.");
  }

  return {
    contentItem: {
      async findMany(args: { where?: any; include?: any; orderBy?: any; take?: number; skip?: number } = {}) {
        const scopedWhere = {
          ...args.where,
          organizationId,
          ...(workspaceId ? { workspaceId } : {}),
        };
        return prisma.contentItem.findMany({
          ...args,
          where: scopedWhere,
        });
      },

      async findUnique(id: string) {
        const item = await prisma.contentItem.findUnique({
          where: { id },
          include: { creator: true, assets: true, approvals: true },
        });
        if (!item) return null;
        if (item.organizationId !== organizationId || (workspaceId && item.workspaceId !== workspaceId)) {
          throw new TenantAccessViolationError(
            `Cross-tenant read blocked: item ${id} does not belong to tenant ${organizationId}/${workspaceId}`
          );
        }
        return item;
      },

      async create(data: {
        topic: string;
        hookText?: string;
        script?: string;
        status?: string;
        platform?: string;
        creatorId?: string;
        estimatedCost?: number;
        targetPostDate?: Date;
        workspaceId: string;
      }) {
        if (workspaceId && data.workspaceId !== workspaceId) {
          throw new TenantAccessViolationError("Cannot create contentItem in a workspace outside current context.");
        }
        return prisma.contentItem.create({
          data: {
            ...data,
            organizationId,
          },
        });
      },

      async update(id: string, data: any) {
        // Enforce existing item belongs to this tenant
        const existing = await prisma.contentItem.findUnique({ where: { id } });
        if (!existing) {
          throw new Error(`ContentItem with id ${id} not found.`);
        }
        if (existing.organizationId !== organizationId || (workspaceId && existing.workspaceId !== workspaceId)) {
          throw new TenantAccessViolationError(
            `Cross-tenant write blocked: cannot update item ${id} belonging to another tenant.`
          );
        }
        return prisma.contentItem.update({
          where: { id },
          data,
        });
      },

      async delete(id: string) {
        const existing = await prisma.contentItem.findUnique({ where: { id } });
        if (!existing) {
          throw new Error(`ContentItem with id ${id} not found.`);
        }
        if (existing.organizationId !== organizationId || (workspaceId && existing.workspaceId !== workspaceId)) {
          throw new TenantAccessViolationError(
            `Cross-tenant delete blocked: cannot delete item ${id} belonging to another tenant.`
          );
        }
        return prisma.contentItem.delete({
          where: { id },
        });
      },
    },

    creator: {
      async findMany(args: { where?: any; include?: any } = {}) {
        return prisma.creator.findMany({
          ...args,
          where: {
            ...args.where,
            organizationId,
            ...(workspaceId ? { workspaceId } : {}),
          },
        });
      },

      async findUnique(id: string) {
        const creator = await prisma.creator.findUnique({ where: { id } });
        if (!creator) return null;
        if (creator.organizationId !== organizationId || (workspaceId && creator.workspaceId !== workspaceId)) {
          throw new TenantAccessViolationError(`Cross-tenant read blocked on creator ${id}.`);
        }
        return creator;
      },
    },

    auditLog: {
      async findMany(args: { take?: number; orderBy?: any } = {}) {
        return prisma.auditLog.findMany({
          where: {
            organizationId,
            ...(workspaceId ? { workspaceId } : {}),
          },
          include: { user: true },
          take: args.take ?? 50,
          orderBy: args.orderBy ?? { createdAt: "desc" },
        });
      },
    },
  };
}
