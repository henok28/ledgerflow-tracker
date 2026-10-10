import React from 'react';
import { Database, ShieldCheck, Zap } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-12 py-8 border-t border-app-border/80 text-app-muted text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-app-text">LedgerFlow System</span>
          <span>•</span>
          <span>Single-Tenant Business Edition</span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-forest" /> Vercel Serverless
          </span>
          <span className="flex items-center gap-1">
            <Database className="w-3.5 h-3.5 text-forest" /> Neon PostgreSQL
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-forest" /> Direct Ledger
          </span>
        </div>
      </div>
    </footer>
  );
};
