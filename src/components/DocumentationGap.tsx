import React from 'react';
import { 
  FileText, 
  ClipboardList, 
  SearchX, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';

interface DocumentationGapProps {
  onNavigateToSection?: (sectionId: string) => void;
}

export default function DocumentationGap({ onNavigateToSection }: DocumentationGapProps) {
  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    if (onNavigateToSection) {
      onNavigateToSection(id);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <section 
      id="problem" 
      className="py-24 md:py-32 bg-off-white border-b border-[#0F172A]/[0.05] relative scroll-mt-20"
      aria-labelledby="documentation-gap-heading"
    >
      {/* Dual anchor for backwards-compatibility */}
      <div id="documentation-gap" className="sr-only" aria-hidden="true" />

      <div className="max-w-[1120px] mx-auto px-6 text-left space-y-12">
        
        {/* Header Block */}
        <div className="space-y-4 max-w-[840px]">
          <span 
            id="documentation-gap-eyebrow"
            className="font-sans text-[12px] text-[#8B6420] uppercase font-semibold tracking-[0.08em] block"
          >
            THE DOCUMENTATION GAP
          </span>
          <h2 
            id="documentation-gap-heading"
            className="font-sans font-bold text-[32px] sm:text-[38px] md:text-[42px] text-[#0B1F3A] tracking-[-0.02em] leading-[1.15]"
          >
            Social care work can be completed without producing documentation that is complete, structured, and easy to verify later.
          </h2>
        </div>

        {/* 3 Core Documentation Gap Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          
          {/* CARD 1: Source documentation is inconsistent */}
          <div 
            id="gap-card-inconsistent-sources"
            className="bg-white p-7 md:p-8 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between space-y-6 hover:border-[#CBD5E1] transition-colors"
          >
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div 
                  className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 border border-amber-200/60 flex items-center justify-center shadow-2xs"
                  aria-hidden="true"
                >
                  <FileText className="w-5 h-5 text-[#8B6420]" />
                </div>
                <span className="font-mono text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  01 / SOURCES
                </span>
              </div>

              <div className="space-y-3">
                <h3 className="font-sans font-bold text-[20px] text-[#0B1F3A] tracking-tight leading-snug">
                  Source documentation is inconsistent
                </h3>
                <p className="text-[15px] font-normal text-slate-600 leading-[26px] font-sans">
                  Casework notes may contain the underlying facts needed for review, but those facts can remain buried in narrative text.
                </p>
              </div>

              {/* Casework Narrative Callout Example */}
              <div className="p-4 bg-[#FAF8F5] rounded-xl border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                  <span>Casework Note Excerpt</span>
                  <span className="text-amber-800 font-semibold">Narrative text</span>
                </div>
                <p className="text-[13px] text-slate-700 font-mono leading-relaxed italic bg-white/70 p-2.5 rounded border border-slate-200/50">
                  &ldquo;Met Mr. Kowalski at drop-in center. Client lost tenancy following building closure; currently couch-surfing temporarily with no permanent address. Provided emergency shelter navigation referral. Verbal consent noted. 35 mins.&rdquo;
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1 text-[11px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-amber-100/70 text-amber-900 border border-amber-200/70">
                    Duration in text: 35m
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-100/70 text-amber-900 border border-amber-200/70">
                    Need: Unhoused / Couch-surfing
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-100/70 text-amber-900 border border-amber-200/70">
                    Verbal consent note
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 text-[12.5px] text-slate-500 leading-normal">
              Facts exist within casework notes, but they lack standardized discrete fields required for structured verification.
            </div>
          </div>

          {/* CARD 2: Review preparation is manual */}
          <div 
            id="gap-card-manual-preparation"
            className="bg-white p-7 md:p-8 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between space-y-6 hover:border-[#CBD5E1] transition-colors"
          >
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div 
                  className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 border border-amber-200/60 flex items-center justify-center shadow-2xs"
                  aria-hidden="true"
                >
                  <ClipboardList className="w-5 h-5 text-[#8B6420]" />
                </div>
                <span className="font-mono text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  02 / WORKFLOW
                </span>
              </div>

              <div className="space-y-3">
                <h3 className="font-sans font-bold text-[20px] text-[#0B1F3A] tracking-tight leading-snug">
                  Review preparation is manual
                </h3>
                <p className="text-[15px] font-normal text-slate-600 leading-[26px] font-sans">
                  Compliance teams must retrieve, interpret, organize, and validate records before responding to a retrospective review.
                </p>
              </div>

              {/* 4-Step Manual Audit Preparation Chain */}
              <div className="p-4 bg-[#FAF8F5] rounded-xl border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                  <span>Review Preparation Workflow</span>
                  <span className="text-amber-800 font-semibold">Manual steps</span>
                </div>
                
                <div className="space-y-2 text-[12px] text-slate-700">
                  <div className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                    <span><strong>Retrieve:</strong> Locate records across disparate community partner systems</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                    <span><strong>Interpret:</strong> Read and extract details from narrative casework notes</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                    <span><strong>Organize:</strong> Align encounter details with billed claims data</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">4</span>
                    <span><strong>Validate:</strong> Verify that documentation meets required standards</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 text-[12.5px] text-slate-500 leading-normal">
              Preparing for retrospective review requires reviewing individual narrative notes and assembling supporting records by hand.
            </div>
          </div>

          {/* CARD 3: Missing evidence is hard to see at scale */}
          <div 
            id="gap-card-hidden-evidence"
            className="bg-white p-7 md:p-8 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between space-y-6 hover:border-[#CBD5E1] transition-colors"
          >
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div 
                  className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 border border-amber-200/60 flex items-center justify-center shadow-2xs"
                  aria-hidden="true"
                >
                  <SearchX className="w-5 h-5 text-[#8B6420]" />
                </div>
                <span className="font-mono text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  03 / VISIBILITY
                </span>
              </div>

              <div className="space-y-3">
                <h3 className="font-sans font-bold text-[20px] text-[#0B1F3A] tracking-tight leading-snug">
                  Missing evidence is hard to see at scale
                </h3>
                <p className="text-[15px] font-normal text-slate-600 leading-[26px] font-sans">
                  A missing duration, screening reference, consent record, or other required element may only become visible when someone reviews the underlying note.
                </p>
              </div>

              {/* Undocumented Elements Checklist */}
              <div className="p-4 bg-[#FAF8F5] rounded-xl border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                  <span>Undocumented Elements</span>
                  <span className="text-amber-800 font-semibold">Identified upon review</span>
                </div>
                
                <div className="space-y-2 text-[12px] text-slate-700">
                  <div className="flex items-start gap-2 bg-white/70 p-1.5 rounded border border-slate-200/40">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                    <span><strong>Duration omitted:</strong> Note describes casework activity but lacks recorded encounter minutes</span>
                  </div>
                  <div className="flex items-start gap-2 bg-white/70 p-1.5 rounded border border-slate-200/40">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                    <span><strong>Screening reference absent:</strong> Screening activity noted without documented assessment instrument</span>
                  </div>
                  <div className="flex items-start gap-2 bg-white/70 p-1.5 rounded border border-slate-200/40">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                    <span><strong>Consent unverified:</strong> Note mentions consent without electronic verification record</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 text-[12.5px] text-slate-500 leading-normal">
              Standard claims data does not indicate whether the underlying casework note contains all required documentation elements.
            </div>
          </div>

        </div>

        {/* Bottom Bridge Banner - Linking to Solution */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xs">
          <div className="space-y-1.5 max-w-[700px]">
            <span className="font-mono text-[10.5px] font-bold text-[#8B6420] uppercase tracking-wider block">
              How CCX Addresses the Gap
            </span>
            <p className="text-[15.5px] text-slate-700 leading-relaxed font-sans">
              CCX structures documented information from casework notes, identifies missing evidence, and prepares organized records for retrospective review.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="#review-scenario"
              onClick={(e) => handleNav(e, 'review-scenario')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FAF8F5] hover:bg-slate-100 text-[#0B1F3A] border border-slate-300 font-sans text-[13px] font-semibold rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-[#8B6420]"
            >
              <span>Explore Review Scenarios</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#8B6420]" />
            </a>
            <a
              href="#contact"
              onClick={(e) => handleNav(e, 'contact')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#8B6420] hover:bg-[#6D4E18] text-white font-sans text-[13px] font-semibold rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-[#8B6420] shadow-xs"
            >
              <span>Request a Documentation Exposure Assessment</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
