import React, { useState } from 'react';
import { ShieldCheck, Check, AlertTriangle, AlertCircle, CornerDownRight, ArrowDown } from 'lucide-react';

type FieldKey = 'diagnosis' | 'duration' | 'referral' | 'screening' | 'consent' | null;

export default function HeroRecord() {
  const [activeField, setActiveField] = useState<FieldKey>(null);

  return (
    <div className="w-full lg:max-w-[560px] bg-white p-6 sm:p-8 rounded-2xl border border-navy/10 shadow-lg text-left relative overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="space-y-6">
        
        {/* Stage 1: Messy Documentation */}
        <div className="space-y-2 text-left">
          <div className="flex items-center justify-between">
            <span className="font-sans text-[11px] text-slate-400 uppercase font-bold tracking-wider">
              Messy Documentation (Source Note)
            </span>
            <span className="text-[10px] font-mono text-red-600 font-bold uppercase bg-red-50 border border-red-100/50 px-2 py-0.5 rounded-md flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Unstructured Intake
            </span>
          </div>

          <div className="bg-[#FAF8F5] border border-slate-200 rounded-xl p-4 text-[13px] leading-relaxed text-slate-800 font-sans relative">
            <p className="font-serif italic text-[13.5px] leading-relaxed text-slate-700 mb-3">
              "Visited Ms. Davis.{' '}
              <mark
                onClick={() => setActiveField(activeField === 'diagnosis' ? null : 'diagnosis')}
                onMouseEnter={() => setActiveField('diagnosis')}
                onMouseLeave={() => setActiveField(null)}
                tabIndex={0}
                role="button"
                aria-label="Maps to ICD-10 Z59.41"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveField(activeField === 'diagnosis' ? null : 'diagnosis');
                  }
                }}
                className={`transition-all duration-150 rounded px-1 py-0.5 font-sans not-italic cursor-pointer ${
                  activeField === 'diagnosis'
                    ? 'bg-emerald-200 text-emerald-950 ring-2 ring-emerald-500 font-semibold'
                    : 'bg-emerald-50 text-emerald-900 border border-emerald-300/80'
                }`}
                title="Maps to ICD-10 Z59.41"
              >
                Family of 3 has no food left in house, skipped dinner last night
              </mark>
              .{' '}
              <mark
                onClick={() => setActiveField(activeField === 'referral' ? null : 'referral')}
                onMouseEnter={() => setActiveField('referral')}
                onMouseLeave={() => setActiveField(null)}
                tabIndex={0}
                role="button"
                aria-label="Maps to Food Pantry Referral"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveField(activeField === 'referral' ? null : 'referral');
                  }
                }}
                className={`transition-all duration-150 rounded px-1 py-0.5 font-sans not-italic cursor-pointer ${
                  activeField === 'referral'
                    ? 'bg-emerald-200 text-emerald-950 ring-2 ring-emerald-500 font-semibold'
                    : 'bg-emerald-50 text-emerald-900 border border-emerald-300/80'
                }`}
                title="Maps to Food Pantry Referral"
              >
                Referred her to food pantry
              </mark>
              .{' '}
              <mark
                onClick={() => setActiveField(activeField === 'consent' ? null : 'consent')}
                onMouseEnter={() => setActiveField('consent')}
                onMouseLeave={() => setActiveField(null)}
                tabIndex={0}
                role="button"
                aria-label="Flagged Gap: Paper consent is not an HIE electronic consent flag"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveField(activeField === 'consent' ? null : 'consent');
                  }
                }}
                className={`transition-all duration-150 rounded px-1 py-0.5 font-sans not-italic cursor-pointer ${
                  activeField === 'consent'
                    ? 'bg-amber-200 text-amber-950 ring-2 ring-amber-500 font-semibold'
                    : 'bg-amber-50 text-amber-900 border border-amber-300/80'
                }`}
                title="Flagged Gap: Paper consent is not an HIE electronic consent flag"
              >
                Consent form signed on paper
              </mark>
              .{' '}
              <mark
                onClick={() => setActiveField(activeField === 'duration' ? null : 'duration')}
                onMouseEnter={() => setActiveField('duration')}
                onMouseLeave={() => setActiveField(null)}
                tabIndex={0}
                role="button"
                aria-label="Maps to 15 min duration"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveField(activeField === 'duration' ? null : 'duration');
                  }
                }}
                className={`transition-all duration-150 rounded px-1 py-0.5 font-sans not-italic cursor-pointer ${
                  activeField === 'duration'
                    ? 'bg-emerald-200 text-emerald-950 ring-2 ring-emerald-500 font-semibold'
                    : 'bg-emerald-50 text-emerald-900 border border-emerald-300/80'
                }`}
                title="Maps to 15 min duration"
              >
                15 mins
              </mark>
              ."
            </p>

            {/* Note legend / gap callout */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/70 text-[10.5px]">
              <span className="flex items-center gap-1 text-emerald-800 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> 3 Confirmed Spans
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1 text-amber-800 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> 2 Flagged Compliance Gaps
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Transition Indicator */}
        <div className="flex items-center justify-center gap-4 py-0.5">
          <div className="h-px bg-gradient-to-r from-transparent via-[#E2E8F0] to-transparent flex-1" />
          <div className="flex flex-col items-center gap-0.5 shrink-0">
            <span className="text-[9px] font-mono font-bold text-gold uppercase tracking-wider bg-gold/5 border border-gold/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              CCX Strict Traceability Engine
            </span>
            <ArrowDown className="w-3.5 h-3.5 text-gold animate-bounce mt-0.5" />
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-[#E2E8F0] to-transparent flex-1" />
        </div>

        {/* Stage 2 & 3: Structured & Audit-Ready Record */}
        <div className="space-y-2 text-left">
          <div className="flex items-center justify-between">
            <span className="font-sans text-[11px] text-slate-400 uppercase font-bold tracking-wider">
              Audit-Ready Record Output
            </span>
            <span className="text-[10px] font-sans text-gold font-bold uppercase bg-gold/10 border border-gold/25 px-2 py-0.5 rounded-md flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-gold" /> Zero Hallucinations Policy
            </span>
          </div>

          <div className="bg-[#0B1F3A] text-white rounded-xl p-4 sm:p-5 border border-white/10 space-y-3 shadow-md">
            
            {/* Field: Classification (ICD-10) */}
            <div 
              onClick={() => setActiveField(activeField === 'diagnosis' ? null : 'diagnosis')}
              onMouseEnter={() => setActiveField('diagnosis')}
              onMouseLeave={() => setActiveField(null)}
              tabIndex={0}
              role="button"
              aria-label="Classification ICD-10 Z59.41 Food Insecurity, status Confirmed"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveField(activeField === 'diagnosis' ? null : 'diagnosis');
                }
              }}
              className={`p-2.5 rounded-lg transition-all duration-150 border cursor-pointer ${
                activeField === 'diagnosis' 
                  ? 'bg-emerald-950/40 border-emerald-400 ring-1 ring-emerald-400' 
                  : 'bg-white/[0.03] border-white/10 hover:border-emerald-500/40'
              }`}
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-white/60 font-medium">Classification (ICD-10)</span>
                <span className="text-[9.5px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <Check className="w-3 h-3 stroke-[3px]" /> Confirmed
                </span>
              </div>
              <div className="text-white font-bold text-xs mt-1">
                ICD-10 Z59.41 (Food Insecurity)
              </div>
              <div className="flex items-start gap-1.5 mt-1.5 text-[10.5px] text-emerald-300/90 font-mono bg-emerald-950/30 px-2 py-1 rounded border border-emerald-500/20">
                <CornerDownRight className="w-3 h-3 shrink-0 mt-0.5 text-emerald-400" />
                <span>Source span: "Family of 3 has no food left in house, skipped dinner last night"</span>
              </div>
            </div>

            {/* Field: Encounter Duration */}
            <div 
              onClick={() => setActiveField(activeField === 'duration' ? null : 'duration')}
              onMouseEnter={() => setActiveField('duration')}
              onMouseLeave={() => setActiveField(null)}
              tabIndex={0}
              role="button"
              aria-label="Encounter Duration 15 Minutes, status Confirmed"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveField(activeField === 'duration' ? null : 'duration');
                }
              }}
              className={`p-2.5 rounded-lg transition-all duration-150 border cursor-pointer ${
                activeField === 'duration' 
                  ? 'bg-emerald-950/40 border-emerald-400 ring-1 ring-emerald-400' 
                  : 'bg-white/[0.03] border-white/10 hover:border-emerald-500/40'
              }`}
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-white/60 font-medium">Encounter Duration</span>
                <span className="text-[9.5px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <Check className="w-3 h-3 stroke-[3px]" /> Confirmed
                </span>
              </div>
              <div className="text-white font-bold text-xs mt-1">
                15 Minutes <span className="text-white/60 font-normal text-[11px]">(Exceeds clinical billing threshold)</span>
              </div>
              <div className="flex items-start gap-1.5 mt-1.5 text-[10.5px] text-emerald-300/90 font-mono bg-emerald-950/30 px-2 py-1 rounded border border-emerald-500/20">
                <CornerDownRight className="w-3 h-3 shrink-0 mt-0.5 text-emerald-400" />
                <span>Source span: "15 mins."</span>
              </div>
            </div>

            {/* Field: Referral / Intervention */}
            <div 
              onClick={() => setActiveField(activeField === 'referral' ? null : 'referral')}
              onMouseEnter={() => setActiveField('referral')}
              onMouseLeave={() => setActiveField(null)}
              tabIndex={0}
              role="button"
              aria-label="Documented Intervention Food Pantry Referral, status Confirmed"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveField(activeField === 'referral' ? null : 'referral');
                }
              }}
              className={`p-2.5 rounded-lg transition-all duration-150 border cursor-pointer ${
                activeField === 'referral' 
                  ? 'bg-emerald-950/40 border-emerald-400 ring-1 ring-emerald-400' 
                  : 'bg-white/[0.03] border-white/10 hover:border-emerald-500/40'
              }`}
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-white/60 font-medium">Documented Intervention</span>
                <span className="text-[9.5px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <Check className="w-3 h-3 stroke-[3px]" /> Confirmed
                </span>
              </div>
              <div className="text-white font-bold text-xs mt-1">
                Emergency Food Pantry Referral Dispatched
              </div>
              <div className="flex items-start gap-1.5 mt-1.5 text-[10.5px] text-emerald-300/90 font-mono bg-emerald-950/30 px-2 py-1 rounded border border-emerald-500/20">
                <CornerDownRight className="w-3 h-3 shrink-0 mt-0.5 text-emerald-400" />
                <span>Source span: "Referred her to food pantry"</span>
              </div>
            </div>

            {/* Field: Screening Instrument (FLAGGED GAP) */}
            <div 
              onClick={() => setActiveField(activeField === 'screening' ? null : 'screening')}
              onMouseEnter={() => setActiveField('screening')}
              onMouseLeave={() => setActiveField(null)}
              tabIndex={0}
              role="button"
              aria-label="Screening Instrument, status Flagged Gap"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveField(activeField === 'screening' ? null : 'screening');
                }
              }}
              className={`p-2.5 rounded-lg transition-all duration-150 border cursor-pointer ${
                activeField === 'screening' 
                  ? 'bg-amber-950/60 border-amber-400 ring-2 ring-amber-400/80 shadow-sm' 
                  : 'bg-amber-950/30 border-amber-500/40 hover:border-amber-400/70'
              }`}
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-amber-200 font-medium">Screening Instrument</span>
                <span className="text-[9.5px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 stroke-[2.5px]" /> FLAGGED GAP
                </span>
              </div>
              <div className="text-amber-200 font-mono font-bold text-xs mt-1">
                Screening Instrument: NOT DOCUMENTED — flag for compliance review
              </div>
              <p className="text-[11px] text-amber-300/80 mt-1 leading-snug">
                Source note is a caseworker narrative; no screening tool (e.g. LOINC 96777-8 AHC HRSN) was administered. Code withheld from record.
              </p>
              <div className="flex items-start gap-1.5 mt-1.5 text-[10.5px] text-amber-300/90 font-mono bg-amber-950/40 px-2 py-1 rounded border border-amber-500/30">
                <AlertCircle className="w-3 h-3 shrink-0 mt-0.5 text-amber-400" />
                <span>Source phrase: [None in source note] — withheld to prevent fabrication</span>
              </div>
            </div>

            {/* Field: Consent Status (FLAGGED GAP) */}
            <div 
              onClick={() => setActiveField(activeField === 'consent' ? null : 'consent')}
              onMouseEnter={() => setActiveField('consent')}
              onMouseLeave={() => setActiveField(null)}
              tabIndex={0}
              role="button"
              aria-label="Consent Status, status Flagged Gap"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveField(activeField === 'consent' ? null : 'consent');
                }
              }}
              className={`p-2.5 rounded-lg transition-all duration-150 border cursor-pointer ${
                activeField === 'consent' 
                  ? 'bg-amber-950/60 border-amber-400 ring-2 ring-amber-400/80 shadow-sm' 
                  : 'bg-amber-950/30 border-amber-500/40 hover:border-amber-400/70'
              }`}
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-amber-200 font-medium">Consent Status</span>
                <span className="text-[9.5px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 stroke-[2.5px]" /> FLAGGED GAP
                </span>
              </div>
              <div className="text-amber-200 font-mono font-bold text-xs mt-1">
                Consent Status: NOT VERIFIED — source shows paper signature, no HIE consent flag
              </div>
              <p className="text-[11px] text-amber-300/80 mt-1 leading-snug">
                Source shows paper signature; paper consent is not an electronic HIE consent flag. Flagged for compliance review.
              </p>
              <div className="flex items-start gap-1.5 mt-1.5 text-[10.5px] text-amber-300/90 font-mono bg-amber-950/40 px-2 py-1 rounded border border-amber-500/30">
                <CornerDownRight className="w-3 h-3 shrink-0 mt-0.5 text-amber-400" />
                <span>Source phrase: &ldquo;Consent form signed on paper&rdquo; (no electronic HIE consent flag)</span>
              </div>
            </div>

            {/* Standardized Narrative Restatement */}
            <div className="pt-3 border-t border-white/10 text-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-white/60 block text-[9.5px] uppercase font-bold tracking-tight">
                  Standardized Narrative Restatement
                </span>
                <span className="text-[9px] font-mono text-gold bg-gold/10 px-2 py-0.5 rounded border border-gold/20">
                  Strictly Grounded
                </span>
              </div>
              <div className="font-sans text-[11.5px] text-white/90 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/10 space-y-2">
                <p>
                  Frontline encounter with Ms. Davis. Household (family of 3) has no food left in house, skipped dinner last night (ICD-10 Z59.41 Food Insecurity). Referred to food pantry. Documented encounter duration: 15 minutes.
                </p>
                <div className="pt-2 border-t border-white/10 space-y-1 text-[11px]">
                  <div className="text-amber-300 flex items-start gap-1.5">
                    <span className="font-bold shrink-0">⚠️ [COMPLIANCE GAP]:</span>
                    <span>Screening Instrument: NOT DOCUMENTED — no screening tool administered in source note; LOINC code withheld.</span>
                  </div>
                  <div className="text-amber-300 flex items-start gap-1.5">
                    <span className="font-bold shrink-0">⚠️ [COMPLIANCE GAP]:</span>
                    <span>Consent Status: NOT VERIFIED — paper consent noted; no contemporaneous HIE consent flag found.</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

