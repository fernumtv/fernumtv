"use client";

import React, { useEffect, useState } from "react";
import { X, Activity, Clock, User, Shield, RefreshCw } from "lucide-react";

interface AuditDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
}

export function AuditDrawer({ isOpen, onClose, workspaceId }: AuditDrawerProps) {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/audit-logs?workspaceId=${workspaceId}`);
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.error("Failed to load audit logs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLogs();
    }
  }, [isOpen, workspaceId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-md bg-card border-l border-border h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-purple-400" />
            <div>
              <h2 className="text-sm font-bold text-white">Immutable Audit Log</h2>
              <p className="text-[11px] text-muted-foreground font-mono">
                Scoped to Workspace: {workspaceId}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchLogs}
              disabled={loading}
              className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-white transition-colors"
              title="Refresh logs"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="flex items-center justify-center h-48 text-muted-foreground text-xs">
              Loading audit logs...
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-xs">
              No audit logs recorded for this tenant yet.
            </div>
          ) : (
            logs.map((log) => {
              const meta = log.metadata ? JSON.parse(log.metadata) : null;
              return (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-secondary/30 border border-border/60 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-semibold text-purple-300">
                      {log.action}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(log.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground text-[11px]">
                    <span className="flex items-center gap-1">
                      <Shield className="h-3 w-3 text-emerald-400" />
                      {log.targetEntity}:{" "}
                      <span className="font-mono text-white">
                        {log.targetId.slice(0, 14)}...
                      </span>
                    </span>
                    {log.user && (
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3 text-indigo-400" />
                        {log.user.name}
                      </span>
                    )}
                  </div>

                  {meta && (
                    <div className="mt-1 p-2 rounded bg-black/40 font-mono text-[10px] text-muted-foreground overflow-x-auto">
                      {JSON.stringify(meta, null, 2)}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
