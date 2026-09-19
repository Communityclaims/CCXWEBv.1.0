import React from 'react';
import { 
  Building2, 
  Search, 
  ArrowRight, 
  FileCode2,
  Calendar,
  Layers,
  Award
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
    <section id="about-ccx" className="py-24 md:py-32 bg-white border-b border-[#0F172A]/[0.05] scroll-mt-16">
      <div className="max-w-[1120px] mx-auto px-6 text-left space-y-16">
        
        {/* Section Header */}
        <div className="space-y-4 max-w-[820px]">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#8B6420]" aria-hidden="true" />
            <span className="font-sans text-[12px] text-[#8B6420] uppercase font-semibold tracking-[0.08em]">
              ABOUT COMMUNITY CLAIMS EXCHANGE
            </span>
          </div>
          <h2 className="font-sans font-bold text-[34px] md:text-[40px] text-navy tracking-tight leading-tight">
            About Community Claims Exchange
          </h2>
          <div className="space-y-4 text-[16px] md:text-[17px] font-normal text-slate-600 leading-[28px] pt-1">
            <p>
              Community Claims Exchange develops documentation infrastructure to support Medicaid social care networks during retrospective compliance reviews.
            </p>
            <p>
              Technical architecture, schemas, security materials, and evaluation access are available during qualified diligence conversations.
            </p>
          </div>
        </div>

        {/* Factual Company Information Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* 1. Legal Entity */}
          <div className="bg-[#FAF8F5] border border-[#E2E8F0] rounded-xl p-6 flex flex-col justify-between space-y-3 shadow-xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Entity Structure
                </span>
                <Building2 className="w-4 h-4 text-[#8B6420]" />
              </div>
              <h3 className="font-sans font-bold text-[17px] text-navy">
                Delaware C-Corporation
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Incorporated Delaware C-Corporation developing documentation infrastructure for Medicaid social care networks.
              </p>
            </div>
          </div>

          {/* 2. Operating History */}
          <div className="bg-[#FAF8F5] border border-[#E2E8F0] rounded-xl p-6 flex flex-col justify-between space-y-3 shadow-xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Operating History
                </span>
                <Calendar className="w-4 h-4 text-[#8B6420]" />
              </div>
              <h3 className="font-sans font-bold text-[17px] text-navy">
                Operating Since 2024
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Formed in 2024 with dedicated focus on Medicaid documentation integrity and retrospective review standards.
              </p>
            </div>
          </div>

          {/* 3. Development Status */}
          <div className="bg-[#FAF8F5] border border-[#E2E8F0] rounded-xl p-6 flex flex-col justify-between space-y-3 shadow-xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Development Status
                </span>
                <Layers className="w-4 h-4 text-[#8B6420]" />
              </div>
              <h3 className="font-sans font-bold text-[17px] text-navy">
                Product Focus
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Development focused on retrospective documentation structuring, source traceability, and compliance review workflows.
              </p>
            </div>
          </div>

          {/* 4. Domain Background */}
          <div className="bg-[#FAF8F5] border border-[#E2E8F0] rounded-xl p-6 flex flex-col justify-between space-y-3 shadow-xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Domain Background
                </span>
                <Award className="w-4 h-4 text-[#8B6420]" />
              </div>
              <h3 className="font-sans font-bold text-[17px] text-navy">
                Founder-Led
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Relevant domain background in Medicaid documentation compliance, revenue cycle management, and health informatics.
              </p>
            </div>
          </div>

        </div>

        {/* Methodology: Evaluate the Methodology */}
        <div className="bg-[#0B1F3A] text-white rounded-2xl p-8 md:p-10 border border-white/10 shadow-xl space-y-8">
          <div className="max-w-[820px] space-y-3">
            <div className="flex items-center gap-2">
              <FileCode2 className="w-4 h-4 text-gold" />
              <span className="font-sans text-[11px] text-gold uppercase font-bold tracking-wider">
                EVALUATE THE METHODOLOGY
              </span>
            </div>
            <h3 className="font-sans font-bold text-[26px] md:text-[30px] text-white tracking-tight leading-snug">
              Evaluate the methodology
            </h3>
            <div className="space-y-2 text-sm md:text-[15px] text-slate-300 leading-relaxed font-normal">
              <p>
                CCX structures source documentation using rules-based terminology mapping and source-text traceability.
              </p>
            </div>
          </div>

          {/* 5-Step Methodology Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-2">
            
            <div className="bg-white/[0.04] border border-white/10 rounded-xl p-5 space-y-3 flex flex-col justify-between hover:border-gold/30 transition-colors">
              <div className="font-mono text-xs font-bold text-gold uppercase tracking-wider">
                01 — INGEST
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Receive exported casework documentation.
              </p>
            </div>

            <div className="bg-white/[0.04] border border-white/10 rounded-xl p-5 space-y-3 flex flex-col justify-between hover:border-gold/30 transition-colors">
              <div className="font-mono text-xs font-bold text-gold uppercase tracking-wider">
                02 — STRUCTURE
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Map documented facts to supported terminology.
              </p>
            </div>

            <div className="bg-white/[0.04] border border-white/10 rounded-xl p-5 space-y-3 flex flex-col justify-between hover:border-gold/30 transition-colors">
              <div className="font-mono text-xs font-bold text-gold uppercase tracking-wider">
                03 — FLAG
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Identify missing or unsupported documentation.
              </p>
            </div>

            <div className="bg-white/[0.04] border border-white/10 rounded-xl p-5 space-y-3 flex flex-col justify-between hover:border-gold/30 transition-colors">
              <div className="font-mono text-xs font-bold text-gold uppercase tracking-wider">
                04 — TRACE
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Link structured outputs to their source text.
              </p>
            </div>

            <div className="bg-white/[0.04] border border-white/10 rounded-xl p-5 space-y-3 flex flex-col justify-between hover:border-gold/30 transition-colors">
              <div className="font-mono text-xs font-bold text-gold uppercase tracking-wider">
                05 — REVIEW
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Compile the results into a retrospective review package.
              </p>
            </div>

          </div>

          {/* Interactive Inspection CTA */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Search className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
              <span>
                Test this methodology live using real-world retrospective casework scenarios with interactive span highlights.
              </span>
            </div>
            <a
              href="#transformation-example"
              onClick={handleScrollToTransformation}
              className="inline-flex items-center justify-center gap-2 bg-[#8B6420] hover:bg-[#73531A] text-white min-h-[44px] px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors duration-150 shrink-0 cursor-pointer shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1F3A]"
            >
              <span>Inspect Standardization Example</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
