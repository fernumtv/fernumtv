"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Clock,
  Sparkles,
  Bot,
  Video,
  DollarSign,
  ShieldCheck,
  ChevronRight,
  Eye,
  Check,
  X,
} from "lucide-react";

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
    <polygon points="10 15 15 12 10 9 10 15" fill="currentColor"/>
  </svg>
);

interface ContentItem {
  id: string;
  topic: string;
  hookText?: string | null;
  script?: string | null;
  status: string;
  platform: string;
  estimatedCost: number;
  workspaceId: string;
  creator?: {
    id: string;
    name: string;
    type: string;
    avatarUrl?: string;
  } | null;
  assets?: Array<{
    id: string;
    assetType: string;
    url: string;
    provider: string;
    costEstimate: number;
  }>;
}

interface OpsBoardProps {
  workspaceId: string;
  currentUser: {
    key?: string;
    name: string;
    role: string;
  };
}

const STAGES = [
  { key: "IDEA", label: "Brief & Ideation", color: "from-blue-500/20 to-blue-500/5", border: "border-blue-500/30" },
  { key: "SCRIPTED", label: "Hook & Script", color: "from-indigo-500/20 to-indigo-500/5", border: "border-indigo-500/30" },
  { key: "GENERATING", label: "AI Generation", color: "from-purple-500/20 to-purple-500/5", border: "border-purple-500/30" },
  { key: "QC_PENDING", label: "QC & Verification", color: "from-amber-500/20 to-amber-500/5", border: "border-amber-500/30" },
  { key: "AWAITING_APPROVAL", label: "Human Gate", color: "from-pink-500/20 to-pink-500/5", border: "border-pink-500/40" },
  { key: "APPROVED", label: "Approved", color: "from-emerald-500/20 to-emerald-500/5", border: "border-emerald-500/30" },
  { key: "SCHEDULED", label: "Scheduled", color: "from-teal-500/20 to-teal-500/5", border: "border-teal-500/30" },
  { key: "PUBLISHED", label: "Live & Published", color: "from-green-500/20 to-green-500/5", border: "border-green-500/30" },
];

export function OpsBoard({ workspaceId, currentUser }: OpsBoardProps) {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [bannerMessage, setBannerMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // New item form state
  const [newTopic, setNewTopic] = useState("");
  const [newHook, setNewHook] = useState("");
  const [newPlatform, setNewPlatform] = useState("INSTAGRAM");

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/content-items?workspaceId=${workspaceId}`);
      const data = await res.json();
      if (data.success) {
        setItems(data.items || []);
      }
    } catch (err) {
      console.error("Failed to load content items", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [workspaceId]);

  const showBanner = (text: string, type: "success" | "error") => {
    setBannerMessage({ text, type });
    setTimeout(() => setBannerMessage(null), 4000);
  };

  const handleStageTransition = async (item: ContentItem, nextStatus: string) => {
    try {
      const res = await fetch("/api/content-items", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: item.id,
          status: nextStatus,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showBanner(`Moved "${item.topic.slice(0, 24)}..." to ${nextStatus}`, "success");
        fetchItems();
        if (selectedItem?.id === item.id) {
          setSelectedItem(data.item);
        }
      } else {
        showBanner(data.error || "Action failed due to RBAC policy.", "error");
      }
    } catch (err: any) {
      showBanner(err.message, "error");
    }
  };

  const handleCreateIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic.trim()) return;

    try {
      const res = await fetch("/api/content-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: newTopic,
          hookText: newHook,
          platform: newPlatform,
          workspaceId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showBanner("New Content Idea added to pipeline!", "success");
        setIsNewModalOpen(false);
        setNewTopic("");
        setNewHook("");
        fetchItems();
      } else {
        showBanner(data.error || "Failed to create idea.", "error");
      }
    } catch (err: any) {
      showBanner(err.message, "error");
    }
  };

  const filteredItems = items.filter(
    (item) =>
      item.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.hookText && item.hookText.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.creator && item.creator.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalPipelineCost = items.reduce((acc, curr) => acc + (curr.estimatedCost || 0), 0);

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-61px)] overflow-hidden">
      {/* Ops Board Subheader */}
      <div className="px-6 py-4 border-b border-border/70 bg-card/20 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-extrabold tracking-tight text-white">
              Internal Ops Board
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono">
              Stage 1 Human-in-the-Loop
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Continuous virtual creator production pipeline with mandatory quality and approval gates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search topics, hooks, creators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-card border border-border/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/60 w-64 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          {/* Pipeline Cost Metric */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/30 border border-purple-500/30 text-xs">
            <DollarSign className="h-3.5 w-3.5 text-purple-400" />
            <span className="text-muted-foreground">Pipeline Est:</span>
            <span className="font-mono font-bold text-white">${totalPipelineCost.toFixed(2)}</span>
          </div>

          {/* New Brief Button */}
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-purple-600/20"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Brief</span>
          </button>
        </div>
      </div>

      {/* Dynamic Feedback Banner */}
      {bannerMessage && (
        <div
          className={`px-6 py-2 text-xs font-medium flex items-center justify-between transition-all ${
            bannerMessage.type === "success"
              ? "bg-emerald-950/80 text-emerald-200 border-b border-emerald-500/30"
              : "bg-red-950/80 text-red-200 border-b border-red-500/30"
          }`}
        >
          <div className="flex items-center gap-2">
            {bannerMessage.type === "success" ? (
              <Check className="h-4 w-4 text-emerald-400" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-red-400" />
            )}
            <span>{bannerMessage.text}</span>
          </div>
          <button onClick={() => setBannerMessage(null)} className="opacity-70 hover:opacity-100">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Horizontal Kanban Columns */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
        <div className="flex gap-4 h-full min-w-max pb-2">
          {STAGES.map((stage) => {
            const stageItems = filteredItems.filter((item) => item.status === stage.key);
            return (
              <div
                key={stage.key}
                className="w-80 flex flex-col rounded-2xl bg-card/40 border border-border/70 backdrop-blur-sm overflow-hidden"
              >
                {/* Column Header */}
                <div
                  className={`p-3.5 border-b border-border/70 bg-gradient-to-b ${stage.color} flex items-center justify-between`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-white tracking-wide">
                      {stage.label}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/40 text-muted-foreground border border-border/40">
                      {stageItems.length}
                    </span>
                  </div>
                  {stage.key === "AWAITING_APPROVAL" && (
                    <span className="text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-500/30 animate-pulse">
                      Gate
                    </span>
                  )}
                </div>

                {/* Column Card Stream */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {stageItems.map((item) => {
                    const isTalkingHead = item.creator?.type === "TALKING_HEAD";
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className="group p-3.5 rounded-xl bg-card/80 hover:bg-card border border-border/80 hover:border-purple-500/50 shadow-sm hover:shadow-md hover:shadow-purple-500/5 transition-all cursor-pointer space-y-2.5 relative"
                      >
                        {/* Tags: Platform & Creator */}
                        <div className="flex items-center justify-between text-[10px]">
                          <div className="flex items-center gap-1.5">
                            {item.platform === "INSTAGRAM" ? (
                              <span className="flex items-center gap-1 text-pink-400 font-semibold">
                                <InstagramIcon className="h-3 w-3" /> Instagram
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-red-400 font-semibold">
                                <YoutubeIcon className="h-3 w-3" /> YouTube
                              </span>
                            )}
                          </div>
                          {item.creator && (
                            <span className="flex items-center gap-1 text-purple-300 font-medium px-1.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
                              <Bot className="h-2.5 w-2.5 text-purple-400" />
                              {item.creator.name}
                            </span>
                          )}
                        </div>

                        {/* Title / Topic */}
                        <h3 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors leading-snug line-clamp-2">
                          {item.topic}
                        </h3>

                        {/* Hook snippet */}
                        {item.hookText && (
                          <p className="text-[11px] text-muted-foreground/90 italic line-clamp-2 border-l-2 border-purple-500/40 pl-2">
                            "{item.hookText}"
                          </p>
                        )}

                        {/* Cost & Stage Progress Action */}
                        <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[11px]">
                          <span className="font-mono text-purple-300 flex items-center gap-0.5">
                            <DollarSign className="h-3 w-3 text-muted-foreground" />
                            {item.estimatedCost.toFixed(2)}
                          </span>

                          {/* Quick Workflow Action Button */}
                          {stage.key === "IDEA" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStageTransition(item, "SCRIPTED");
                              }}
                              className="px-2 py-0.5 rounded bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-[10px] font-medium flex items-center gap-1"
                            >
                              <span>Script</span> <ChevronRight className="h-2.5 w-2.5" />
                            </button>
                          )}

                          {stage.key === "SCRIPTED" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStageTransition(item, "GENERATING");
                              }}
                              className="px-2 py-0.5 rounded bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-[10px] font-medium flex items-center gap-1"
                            >
                              <span>Generate</span> <Sparkles className="h-2.5 w-2.5" />
                            </button>
                          )}

                          {stage.key === "GENERATING" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStageTransition(item, "QC_PENDING");
                              }}
                              className="px-2 py-0.5 rounded bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 text-[10px] font-medium flex items-center gap-1"
                            >
                              <span>Send QC</span> <ChevronRight className="h-2.5 w-2.5" />
                            </button>
                          )}

                          {stage.key === "QC_PENDING" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStageTransition(item, "AWAITING_APPROVAL");
                              }}
                              className="px-2 py-0.5 rounded bg-pink-600/20 hover:bg-pink-600/30 text-pink-300 border border-pink-500/30 text-[10px] font-medium flex items-center gap-1"
                            >
                              <span>Human Gate</span> <ChevronRight className="h-2.5 w-2.5" />
                            </button>
                          )}

                          {stage.key === "AWAITING_APPROVAL" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStageTransition(item, "APPROVED");
                              }}
                              className="px-2 py-0.5 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-[10px] font-medium flex items-center gap-1"
                            >
                              <Check className="h-2.5 w-2.5" /> <span>Approve</span>
                            </button>
                          )}

                          {stage.key === "APPROVED" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStageTransition(item, "SCHEDULED");
                              }}
                              className="px-2 py-0.5 rounded bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 border border-teal-500/30 text-[10px] font-medium flex items-center gap-1"
                            >
                              <span>Schedule</span> <ChevronRight className="h-2.5 w-2.5" />
                            </button>
                          )}

                          {stage.key === "SCHEDULED" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStageTransition(item, "PUBLISHED");
                              }}
                              className="px-2 py-0.5 rounded bg-green-600/20 hover:bg-green-600/30 text-green-300 border border-green-500/30 text-[10px] font-medium flex items-center gap-1"
                            >
                              <span>Publish</span> <CheckCircle className="h-2.5 w-2.5" />
                            </button>
                          )}

                          {stage.key === "PUBLISHED" && (
                            <span className="text-[10px] text-green-400 font-semibold flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" /> Live
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Item Inspection Slide-over Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-card border-l border-border h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  {selectedItem.status}
                </span>
                <h2 className="text-base font-bold text-white mt-1.5">{selectedItem.topic}</h2>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
              {/* Creator & Platform Info */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-secondary/30 border border-border">
                <div>
                  <span className="text-muted-foreground text-[11px]">Virtual Creator</span>
                  <p className="font-semibold text-white mt-0.5">
                    {selectedItem.creator?.name || "Unassigned"}
                  </p>
                  <span className="text-[10px] text-purple-300 font-mono">
                    Type: {selectedItem.creator?.type}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground text-[11px]">Cost-Per-Asset (First-Class)</span>
                  <p className="font-semibold font-mono text-emerald-400 mt-0.5">
                    ${selectedItem.estimatedCost.toFixed(4)} USD
                  </p>
                  <span className="text-[10px] text-muted-foreground">Logged to UsageLedger</span>
                </div>
              </div>

              {/* Hook text */}
              <div className="space-y-1.5">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-purple-400" /> Primary Hook
                </span>
                <div className="p-3 rounded-xl bg-black/40 border border-border font-serif italic text-muted-foreground leading-relaxed">
                  "{selectedItem.hookText || "No hook generated yet."}"
                </div>
              </div>

              {/* Script / Storyboard */}
              <div className="space-y-1.5">
                <span className="font-semibold text-white">Script & Narrative Flow</span>
                <div className="p-3 rounded-xl bg-black/40 border border-border font-mono text-[11px] text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {selectedItem.script || "Script will be generated by the Script Agent in Phase 3."}
                </div>
              </div>

              {/* Quality & Human Approval Gate Note */}
              <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-1.5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-purple-400" />
                  <span className="font-semibold text-white">Human Approval Gate Enforced</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Per Fernum Working Rules, automated publishing without explicit human sign-off is
                  strictly prohibited.
                </p>
              </div>

              {/* Move Stage Selector */}
              <div className="space-y-2 pt-2 border-t border-border">
                <span className="font-semibold text-white">Update Stage (RBAC Gated)</span>
                <div className="grid grid-cols-2 gap-2">
                  {STAGES.map((s) => (
                    <button
                      key={s.key}
                      onClick={() => handleStageTransition(selectedItem, s.key)}
                      disabled={selectedItem.status === s.key}
                      className={`px-3 py-2 rounded-xl text-left font-medium transition-all ${
                        selectedItem.status === s.key
                          ? "bg-purple-600/30 text-purple-300 border border-purple-500/50 cursor-default"
                          : "bg-secondary/40 hover:bg-secondary border border-border/80 text-muted-foreground hover:text-white"
                      }`}
                    >
                      <div className="text-[10px] text-muted-foreground font-mono">{s.key}</div>
                      <div className="text-xs">{s.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Content Brief Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">Create Content Brief</h2>
                <p className="text-xs text-muted-foreground">
                  Initialize a new item into the production flywheel.
                </p>
              </div>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateIdea} className="p-5 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-white">Topic / Core Angle</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 3 Proven Adaptogens for Focus Under Stress"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-2 text-white placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-white">Initial Hook Concept (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="e.g. What if your 3 PM brain fog isn't dehydration, but cortisol spike?"
                  value={newHook}
                  onChange={(e) => setNewHook(e.target.value)}
                  className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-2 text-white placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-white">Target Platform</label>
                <select
                  value={newPlatform}
                  onChange={(e) => setNewPlatform(e.target.value)}
                  className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                >
                  <option value="INSTAGRAM">Instagram (Reels 9:16)</option>
                  <option value="YOUTUBE">YouTube (Shorts 9:16)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border hover:bg-secondary text-muted-foreground hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-colors shadow-lg shadow-purple-600/20"
                >
                  Create Brief
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
