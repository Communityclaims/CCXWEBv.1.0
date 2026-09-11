import React from 'react';
import { 
  Building2, 
  GitBranch, 
  ShieldCheck, 
  Scale, 
  Search, 
  ArrowRight, 
  FileCode2,
  Check,
  AlertCircle
} from 'lucide-react';

interface AboutCcxProps {
  onNavigateToSection?: (sectionId: string) => void;
}

export default function AboutCcx({ onNavigateToSection }: AboutCcxProps) {
  const handleScrollToTransformation = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigateToSection) {
      onNavigateToSection('transformation-example');
    } else {
      const element = document.getElementById('transformation-example');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <section id="about-ccx" className="py-24 md:py-32 bg-white border-b border-[#0F172A]/[0.05]">
      <div className="max-w-[1120px] mx-auto px-6 text-left space-y-16">
        
        {/* Section Header */}
        <div className="space-y-4 max-w-[820px]">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#8B6420]" />
            <span className="font-sans text-[12px] text-[#8B6420] uppercase font-semibold tracking-[0.08em]">
              Company &amp; Operating Substance
            </span>
          </div>
          <h2 className="font-sans font-bold text-[34px] md:text-[40px] text-navy tracking-tight leading-tight">
            About Community Claims Exchange
          </h2>
          <p className="text-[17px] font-normal text-slate-600 leading-[28px]">
            For healthcare compliance officers and Lead Entity reviewers evaluating whether to trust CCX with network casework documentation, credibility must come from verifiable entity facts, private technical evaluation access, and deterministic clinical methodology — not marketing claims, phantom scale, or personal resumes.
          </p>
        </div>

        {/* 3 Core Operating Reality Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          
          {/* Card 1: Legal Entity & Active Development */}
          <div className="bg-[#FAF8F5] border border-[#E2E8F0] rounded-2xl p-7 flex flex-col justify-between shadow-xs">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center text-navy shadow-xs">
                <Building2 className="w-5 h-5 text-gold" />
              </div>
              <h3 className="font-sans font-bold text-[18px] text-navy">
                Legal Entity &amp; Active Development
              </h3>
              <ul className="space-y-3 text-xs text-slate-600 leading-relaxed font-sans">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-navy font-semibold">Corporate Status:</strong> Incorporated as a Delaware C-Corporation (Community Claims Exchange, Inc.).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-navy font-semibold">Operating History:</strong> Operating since 2024, focused exclusively on Medicaid 1115 social care documentation integrity.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-navy font-semibold">Active Development:</strong> The platform is actively developed. Full architecture specifications, data schemas, and technical repository access are provided on request during due-diligence or evaluation conversations under mutual NDA (no public code repository).
                  </span>
                </li>
              </ul>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-200/80">
              <div className="flex items-center gap-2 text-xs font-bold text-navy">
                <GitBranch className="w-4 h-4 text-gold" />
                <span>Private Technical Diligence</span>
              </div>
              <p className="text-[11px] text-slate-500 font-sans mt-1 leading-relaxed">
                Codebase structure, data pipeline architectures, and transformation schemas are open to technical reviewers during evaluation conversations under standard confidentiality terms.
              </p>
            </div>
          </div>

          {/* Card 2: Collective Domain Background */}
          <div className="bg-[#FAF8F5] border border-[#E2E8F0] rounded-2xl p-7 flex flex-col justify-between shadow-xs">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center text-navy shadow-xs">
                <Scale className="w-5 h-5 text-gold" />
              </div>
              <h3 className="font-sans font-bold text-[18px] text-navy">
                Collective Domain Background
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                CCX was built by a team with revenue cycle management and healthcare compliance backgrounds, bringing direct operational experience in hospital revenue cycle management (RCM), Medicaid audit defense, and clinical terminologies.
              </p>
              <div className="space-y-2 pt-1 text-xs text-slate-600 leading-relaxed">
                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <span className="font-semibold text-navy block text-[11px] uppercase tracking-wider mb-1">
                    Focused Technical Scope
                  </span>
                  Our engineering specifically solves the structural mismatch between non-clinical frontline social casework narratives and strict Medicaid fee-for-service audit rules (OMIG Part 521).
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <span className="font-semibold text-navy block text-[11px] uppercase tracking-wider mb-1">
                    No Phantom Scale
                  </span>
                  We do not imply a larger team than exists or present artificial corporate tiers. We are a compact, disciplined engineering and domain team focused purely on documentation integrity.
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-200/80">
              <span className="text-[11px] text-slate-500 font-mono">
                Team discipline: RCM + Regulatory Informatics
              </span>
            </div>
          </div>

          {/* Card 3: Honest Stage & Security Readiness */}
          <div className="bg-[#FAF8F5] border border-[#E2E8F0] rounded-2xl p-7 flex flex-col justify-between shadow-xs">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center text-navy shadow-xs">
                <ShieldCheck className="w-5 h-5 text-gold" />
              </div>
              <h3 className="font-sans font-bold text-[18px] text-navy">
                Honest Stage &amp; Security Readiness
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                CCX is an early-stage, founder-led company. Rather than claiming enterprise scale we don't yet have or hiding behind ambiguous badges, we state our exact operational posture plainly:
              </p>
              <ul className="space-y-2.5 text-xs text-slate-600 leading-relaxed font-sans pt-1">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-gold shrink-0 mt-1.5" />
                  <span>
                    <strong className="text-navy font-semibold">Early-Stage, Founder-Led:</strong> Lean by design, working directly with Lead Entity compliance leads and CMAs without sales friction.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-gold shrink-0 mt-1.5" />
                  <span>
                    <strong className="text-navy font-semibold">BAA-Readiness:</strong> Standard HIPAA Business Associate Agreement (BAA) execution supported unconditionally before ingesting any data.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-gold shrink-0 mt-1.5" />
                  <span>
                    <strong className="text-navy font-semibold">SOC 2 in Progress:</strong> Audit observation window active with an independent AICPA CPA firm, targeting report delivery in Q2 2027.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-gold shrink-0 mt-1.5" />
                  <span>
                    <strong className="text-navy font-semibold">Isolated US-East Hosting:</strong> Dedicated AWS GovCloud / US-East VPCs, AES-256 KMS encryption, and zero model training on PHI.
                  </span>
                </li>
              </ul>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-200/80">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Early-stage &amp; transparent by design</span>
              </span>
            </div>
          </div>

        </div>

        {/* Verifiable Methodology Over Identity Section */}
        <div className="bg-[#0B1F3A] text-white rounded-2xl p-8 md:p-10 border border-white/10 shadow-xl space-y-8">
          <div className="max-w-[820px] space-y-3">
            <div className="flex items-center gap-2">
              <FileCode2 className="w-4 h-4 text-gold" />
              <span className="font-sans text-[11px] text-gold uppercase font-bold tracking-wider">
                Verifiable Methodology Over Identity
              </span>
            </div>
            <h3 className="font-sans font-bold text-[26px] md:text-[30px] text-white tracking-tight leading-snug">
              Evaluate the Evidence Engine Directly
            </h3>
            <p className="text-sm md:text-[15px] text-slate-300 leading-relaxed font-normal">
              In a high-stakes Medicaid regulatory review, you cannot audit an executive’s resume or a founder’s bio. You audit the deterministic evidence trail. CCX relies on auditable, deterministic terminology rules that map raw casework narratives into standard LOINC and ICD-10 codes, explicitly flagging missing facts rather than hallucinating compliance.
            </p>
          </div>

          {/* 4 Steps of the Methodology */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-2">
            
            <div className="bg-white/[0.04] border border-white/10 rounded-xl p-5 space-y-3">
              <div className="font-mono text-xs font-bold text-gold uppercase tracking-wider">
                01. Export Ingestion
              </div>
              <h4 className="font-sans font-bold text-sm text-white">
                Read-Only Casework Intake
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Ingests existing caseworker text exports from local case management systems without requiring frontline workflow changes or staff retraining.
              </p>
            </div>

            <div className="bg-white/[0.04] border border-white/10 rounded-xl p-5 space-y-3">
              <div className="font-mono text-xs font-bold text-gold uppercase tracking-wider">
                02. Terminology Mapping
              </div>
              <h4 className="font-sans font-bold text-sm text-white">
                LOINC &amp; ICD-10 Taxonomy
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Extracts screening observations and maps narrative findings to standard LOINC instruments (e.g., 96778-6, 96779-4) and ICD-10 SDOH Z-codes (Z59.41, Z59.01) only when supported by source text.
              </p>
            </div>

            <div className="bg-white/[0.04] border border-white/10 rounded-xl p-5 space-y-3">
              <div className="font-mono text-xs font-bold text-gold uppercase tracking-wider">
                03. Strict Gap Flagging
              </div>
              <h4 className="font-sans font-bold text-sm text-white">
                Surfacing Missing Proof
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Never invents or hallucinates facts. If duration, screening instruments, or electronic HIE consent are missing, the system flags the deficit explicitly as an unverified gap.
              </p>
            </div>

            <div className="bg-white/[0.04] border border-white/10 rounded-xl p-5 space-y-3">
              <div className="font-mono text-xs font-bold text-gold uppercase tracking-wider">
                04. Audit Dossier
              </div>
              <h4 className="font-sans font-bold text-sm text-white">
                Source Span Traceability
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Every structured field links back to its exact highlighted text span in the original casework note, giving compliance reviewers immediate, verifiable provenance.
              </p>
            </div>

          </div>

          {/* Interactive Inspection CTA */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Search className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Test this methodology live using real-world retrospective casework scenarios with interactive span highlights.
              </span>
            </div>
            <a
              href="#transformation-example"
              onClick={handleScrollToTransformation}
              className="inline-flex items-center gap-2 bg-gold hover:bg-[#B5945F] text-white px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors duration-150 shrink-0 cursor-pointer shadow-sm"
            >
              <span>Inspect Standardization Example</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
