"use client";

import React from "react";
import { Users, Shield, Check, X, Lock, Key } from "lucide-react";
import { ROLE_PERMISSIONS, Role, Permission } from "@/lib/auth/rbac";

export function TeamView() {
  const roles: Role[] = [
    "OWNER",
    "ADMIN",
    "CREATIVE_DIRECTOR",
    "STRATEGIST",
    "EDITOR",
    "CLIENT_APPROVER",
    "VIEWER",
  ];

  const permissions: Array<{ key: Permission; label: string }> = [
    { key: "VIEW_OPS_BOARD", label: "View Ops Board" },
    { key: "CREATE_CONTENT", label: "Create Brief & Content" },
    { key: "EDIT_CONTENT", label: "Edit Hook & Script" },
    { key: "CHANGE_STAGE", label: "Move Pipeline Stages" },
    { key: "SUBMIT_FOR_QC", label: "Submit Assets to QC" },
    { key: "APPROVE_CONTENT", label: "Approve Content (Human Gate)" },
    { key: "REJECT_CONTENT", label: "Reject / Request Revision" },
    { key: "DELETE_CONTENT", label: "Delete Assets & Items" },
    { key: "VIEW_AUDIT_LOGS", label: "Inspect Tenant Audit Log" },
    { key: "MANAGE_TEAM", label: "Manage Organization & Roles" },
  ];

  const seedMembers = [
    {
      name: "Alice Vance",
      email: "alice@fernum.studio",
      role: "OWNER",
      scope: "Fernum Media Studio (Global)",
      avatar: "/avatars/alice.svg",
    },
    {
      name: "Bob Chen",
      email: "bob@aurahealth.com",
      role: "CREATIVE_DIRECTOR",
      scope: "AuraHealth Workspace",
      avatar: "/avatars/bob.svg",
    },
    {
      name: "Charlie Ross",
      email: "charlie@aurahealth.com",
      role: "CLIENT_APPROVER",
      scope: "AuraHealth (Client Sign-Off)",
      avatar: "/avatars/charlie.svg",
    },
    {
      name: "Dana Kapoor",
      email: "dana@vervepay.com",
      role: "EDITOR",
      scope: "VervePay Workspace",
      avatar: "/avatars/dana.svg",
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-extrabold tracking-tight text-white">
            Team & Role-Based Access Control (RBAC)
          </h1>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
            Phase 1 Foundation
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Strict organizational security and tenant isolation governing creative workflows and approval gates.
        </p>
      </div>

      {/* Seed Members Grid */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Users className="h-4 w-4 text-purple-400" />
          Configured Demo Members
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {seedMembers.map((member) => (
            <div
              key={member.email}
              className="p-4 rounded-2xl bg-card/60 border border-border space-y-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="h-10 w-10 rounded-full object-cover border border-purple-500/30"
                />
                <div>
                  <h3 className="text-xs font-bold text-white">{member.name}</h3>
                  <p className="text-[11px] text-muted-foreground">{member.email}</p>
                </div>
              </div>
              <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px]">
                <span className="font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 font-semibold border border-purple-500/20">
                  {member.role}
                </span>
                <span className="text-[10px] text-muted-foreground">{member.scope}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Permission Matrix Table */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Shield className="h-4 w-4 text-emerald-400" />
          Enterprise Permission Matrix
        </h2>
        <div className="rounded-2xl border border-border bg-card/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-secondary/40 border-b border-border text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-3.5 font-semibold">Permission Action</th>
                  {roles.map((r) => (
                    <th key={r} className="p-3.5 font-semibold text-center font-mono">
                      {r.replace("_", " ")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {permissions.map((perm) => (
                  <tr key={perm.key} className="hover:bg-secondary/20 transition-colors">
                    <td className="p-3.5 font-medium text-white">{perm.label}</td>
                    {roles.map((role) => {
                      const granted = ROLE_PERMISSIONS[role].includes(perm.key);
                      return (
                        <td key={role} className="p-3.5 text-center">
                          {granted ? (
                            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                              <Check className="h-3 w-3" />
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-muted text-muted-foreground/40">
                              <X className="h-3 w-3" />
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
