"use client";

import React from "react";
import Link from "next/link";
import { Mail, ShieldCheck } from "lucide-react";
import { PolicyType } from "./InhousePolicyModal";

interface InhouseFooterProps {
  onOpenPolicy: (type: PolicyType) => void;
  onOpenBookCall: () => void;
}

export function InhouseFooter({ onOpenPolicy, onOpenBookCall }: InhouseFooterProps) {
  return (
    <footer className="bg-white border-t border-neutral-200 py-16 sm:py-24 text-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-neutral-200">
          {/* Brand & Mission */}
          <div className="md:col-span-6 space-y-4">
            <span className="text-2xl font-black tracking-tighter text-neutral-950 block">
              Fernum
            </span>
            <p className="text-sm text-neutral-600 max-w-sm leading-relaxed">
              We make video ads that sell for D2C brands. Delivered fresh every month with 3 alternate hooks and 100% human creative director review.
            </p>
            <div className="pt-2">
              <a
                href="mailto:hello@fernum.online"
                className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-950 hover:text-neutral-600 transition-colors"
              >
                <Mail className="w-4 h-4 text-neutral-700" />
                <span>hello@fernum.online</span>
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-400">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm font-medium text-neutral-600">
              <li>
                <a href="#work" className="hover:text-neutral-950 transition-colors">
                  Some of our work
                </a>
              </li>
              <li>
                <a href="#process" className="hover:text-neutral-950 transition-colors">
                  Process
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-neutral-950 transition-colors">
                  Pricing Chart
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenBookCall}
                  className="hover:text-neutral-950 transition-colors text-left"
                >
                  Book a Call
                </button>
              </li>
              <li>
                <Link href="/login" className="hover:text-neutral-950 transition-colors block">
                  Client Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Policies */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-400">
              Policies & Legal
            </h4>
            <ul className="space-y-2.5 text-sm font-medium text-neutral-600">
              <li>
                <button
                  onClick={() => onOpenPolicy("terms")}
                  className="hover:text-neutral-950 transition-colors text-left"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy("refund")}
                  className="hover:text-neutral-950 transition-colors text-left"
                >
                  Refund Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy("privacy")}
                  className="hover:text-neutral-950 transition-colors text-left"
                >
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono text-neutral-500">
          <div>
            © {new Date().getFullYear()} Fernum (fernum.online). All rights reserved.
          </div>

        </div>
      </div>
    </footer>
  );
}
