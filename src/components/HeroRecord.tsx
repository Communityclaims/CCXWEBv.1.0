import React from 'react';
import { ShieldCheck, Check, AlertCircle } from 'lucide-react';

export default function HeroRecord() {
  return (
    <div className="w-full lg:max-w-[560px] bg-white p-8 rounded-2xl border border-navy/10 shadow-lg text-left relative overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="space-y-6">
        
        {/* Stage 1: Messy Documentation */}
        <div className="space-y-2 text-left">
          <div className="flex items-center justify-between">
            <span className="font-sans text-[11px] text-slate-400 uppercase font-bold tracking-wider">
              Messy Documentation
            </span>
            <span className="text-[10px] font-mono text-red-600 font-bold uppercase bg-red-50 border border-red-100/50 px-2 py-0.5 rounded-md flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> High Risk Deficit
            </span>
          </div>
          <div className="bg-[#FAF8F5] border border-red-200/50 rounded-xl p-4 text-[13px] italic font-serif leading-relaxed text-[#1E293B]">
            "Visited Ms. Davis. Family of 3 has no food left in house, skipped dinner last night. Referred her to food pantry. Consent form signed on paper. 15 mins."
          </div>
        </div>

        {/* Dynamic Transition Indicator */}
        <div className="flex items-center justify-center gap-4 py-1">
          <div className="h-px bg-gradient-to-r from-transparent via-[#E2E8F0] to-transparent flex-1" />
          <div className="flex flex-col items-center gap-1 shrink-0">
            <span className="text-[9px] font-mono font-bold text-gold uppercase tracking-widest bg-gold/5 border border-gold/15 px-2.5 py-1 rounded-full">
              Standardized Process
            </span>
            <span className="text-xl text-gold font-bold animate-pulse">↓</span>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-[#E2E8F0] to-transparent flex-1" />
        </div>

        {/* Stage 2 & 3: Structured & Audit-Ready Record */}
        <div className="space-y-2 text-left">
          <div className="flex items-center justify-between">
            <span className="font-sans text-[11px] text-slate-400 uppercase font-bold tracking-wider">
              Audit-Ready Record
            </span>
            <span className="text-[10px] font-sans text-gold font-bold uppercase bg-gold/10 border border-gold/25 px-2 py-0.5 rounded-md flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-gold" /> Structured &amp; Traceable
            </span>
          </div>

          <div className="bg-[#0B1F3A] text-white rounded-xl p-5 border border-white/5 space-y-4 shadow-md">
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-[11px] font-sans">
              <div>
                <span className="text-white/45 block text-[9px] uppercase font-bold tracking-tight">Standardized Code</span>
                <span className="text-gold font-mono font-semibold block mt-0.5">LOINC 96777-8</span>
              </div>
              <div>
                <span className="text-white/45 block text-[9px] uppercase font-bold tracking-tight">Classification</span>
                <span className="text-white font-bold block mt-0.5">ICD-10 Z59.41 (Food Insecurity)</span>
              </div>
              <div>
                <span className="text-white/45 block text-[9px] uppercase font-bold tracking-tight">Encounter Check</span>
                <span className="text-white font-bold flex items-center gap-1 mt-0.5">
                  <Check className="w-3 h-3 text-gold stroke-[3px]" />
                  15 min Duration
                </span>
              </div>
              <div>
                <span className="text-white/45 block text-[9px] uppercase font-bold tracking-tight">Consent Status</span>
                <span className="text-gold font-bold flex items-center gap-1 mt-0.5">
                  <Check className="w-3 h-3 text-gold stroke-[3px]" />
                  Verified (Q0)
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 text-xs">
              <span className="text-white/45 block text-[9px] uppercase font-bold tracking-tight mb-1">Standardized Narrative Output</span>
              <p className="font-sans text-[11.5px] text-white/90 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/10">
                LOINC 96777-8 Screening completed. Patient has food insecurity (Z59.41) with expired assistance. HIE consent verified. Referred to emergency food pantry. Duration: 15 minutes.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
