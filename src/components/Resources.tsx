import React from 'react';
import { ChevronRight, ExternalLink, ArrowRight } from 'lucide-react';

interface ResourcesProps {
  onViewChange: (view: 'home' | 'compliance-trust' | 'resources') => void;
}

interface RegulatoryReference {
  title: string;
  org: string;
  purpose: string;
  note?: string;
  url: string;
}

const REGULATORY_REFERENCES: RegulatoryReference[] = [
  {
    title: 'Social Care Networks (SCN) Program',
    org: 'New York State Department of Health',
    purpose: 'Official program page for the New York Health Equity Reform (NYHER) 1115 Waiver Social Care Network structure, screening requirements, and regional lead entities.',
    url: 'https://www.health.ny.gov/health_care/medicaid/redesign/sdh/scn/'
  },
  {
    title: 'New York Medicaid 1115 Waiver',
    org: 'New York State Department of Health',
    purpose: 'Primary waiver page covering active and pending amendments, including the NYHER amendment approval.',
    url: 'https://www.health.ny.gov/health_care/medicaid/redesign/1115_waiver/'
  },
  {
    title: 'Self-Disclosure Program',
    org: 'NYS Office of the Medicaid Inspector General (OMIG)',
    purpose: 'Governs how Medicaid providers report, return, and explain overpayments, including contemporaneous recordkeeping expectations.',
    url: 'https://omig.ny.gov/provider-resources/self-disclosure'
  },
  {
    title: 'Health-Related Social Needs (HRSN) in Medicaid',
    org: 'Centers for Medicare & Medicaid Services',
    purpose: 'Current federal guidance on HRSN coverage authorities.',
    note: 'CMS rescinded its 2023-2024 HRSN framework bulletins in March 2025. New York’s approved SCN waiver continues operating under its existing terms; this page reflects CMS’s current guidance, not the rescinded bulletins.',
    url: 'https://www.medicaid.gov/medicaid/section-1115-demonstrations/health-related-social-needs'
  },
  {
    title: 'HIPAA Security Rule Guidance',
    org: 'HHS Office for Civil Rights',
    purpose: 'Federal guidance on administrative, physical, and technical safeguards for electronic protected health information.',
    url: 'https://www.hhs.gov/hipaa/for-professionals/security/index.html'
  }
];

const RESOURCES_FAQ = [
  {
    question: 'Is CCX affiliated with OMIG, NYSDOH, or CMS?',
    answer: 'No. CCX is an independent documentation infrastructure company. The references on this page link to official government sources so you can read the underlying requirements directly; they are not CCX materials and CCX does not speak on behalf of any regulator.'
  },
  {
    question: 'How current are these references?',
    answer: 'Regulatory guidance in this area changes; CMS itself rescinded prior HRSN framework guidance in March 2025. We link directly to the regulator’s own page rather than a cached copy so you always see their current version, and we note known status changes where relevant.'
  },
  {
    question: 'Where can I get more detail than what’s on this page?',
    answer: 'This page is intentionally high level. Security architecture, integration specifications, and documentation methodology are covered in more depth once we’re in a direct evaluation conversation; reach out and we’ll share what’s relevant to your review.'
  }
];

export default function Resources({ onViewChange }: ResourcesProps) {
  return (
    <div className="bg-[#FAF8F5] py-16 md:py-24">
      <div className="max-w-[1120px] mx-auto px-6 space-y-16">

        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">
          <button
            onClick={() => onViewChange('home')}
            className="hover:text-gold transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B6420] focus-visible:rounded px-1"
          >
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-navy font-bold">Resources</span>
        </div>

        {/* Section Header */}
        <div className="space-y-4 max-w-[800px] text-left">
          <span className="font-sans text-[12px] text-[#8B6420] uppercase font-bold tracking-[0.08em]">
            Reference Materials
          </span>
          <h1 className="font-sans font-bold text-[36px] md:text-[44px] text-navy tracking-tight leading-none">
            Resources
          </h1>
          <p className="text-[16px] md:text-[18px] font-normal text-slate-600 leading-[28px] max-w-[680px]">
            Background on the documentation problem, the regulatory environment it sits inside, and how CCX approaches it, sourced from official regulator materials wherever possible.
          </p>
        </div>

        {/* ============ REGULATORY REFERENCES ============ */}
        <section className="space-y-6 text-left">
          <div className="space-y-2 max-w-[680px]">
            <h2 className="font-sans font-bold text-[24px] text-navy tracking-tight">Regulatory References</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {REGULATORY_REFERENCES.map((ref) => (
              <a
                key={ref.title}
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white border border-[#0F172A]/[0.07] rounded-xl p-5 flex flex-col justify-between shadow-xs hover:border-gold/30 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B6420]"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-sans font-semibold text-[16px] text-navy leading-snug">{ref.title}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-gold transition-colors shrink-0 mt-1" />
                  </div>
                  <span className="block text-[11px] font-bold text-gold uppercase tracking-wide">{ref.org}</span>
                  <p className="text-[13.5px] text-slate-500 leading-[21px]">{ref.purpose}</p>
                  {ref.note && (
                    <p className="text-[12px] text-slate-400 leading-[19px] italic pt-1 border-t border-slate-100 mt-2">
                      {ref.note}
                    </p>
                  )}
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ============ PRODUCT OVERVIEW ============ */}
        <section className="space-y-6 text-left bg-white border border-[#0F172A]/[0.06] rounded-2xl p-6 md:p-10">
          <div className="space-y-2 max-w-[680px]">
            <h2 className="font-sans font-bold text-[24px] text-navy tracking-tight">Product Overview</h2>
          </div>
          <div className="space-y-5 max-w-[760px]">
            <div className="space-y-1.5">
              <h3 className="font-sans font-semibold text-[15px] text-navy">The problem</h3>
              <p className="text-[15px] text-slate-600 leading-[25px]">
                Social care encounter documentation is captured across fragmented systems and free-text notes, which makes it hard to reconstruct a standardized, contemporaneous record when it&apos;s needed later for retrospective review.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className="font-sans font-semibold text-[15px] text-navy">Current workflow</h3>
              <p className="text-[15px] text-slate-600 leading-[25px]">
                Frontline staff document encounters in whatever system they already use (including case management tools, intake forms, and paper notes) without a consistent structure or standardized coding applied at the point of care.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className="font-sans font-semibold text-[15px] text-navy">The documentation gap</h3>
              <p className="text-[15px] text-slate-600 leading-[25px]">
                Free-text notes rarely arrive with the standardized terminology codes, consent verification, and timing detail that retrospective review expects, meaning organizations spend significant effort reconstructing this after the fact.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className="font-sans font-semibold text-[15px] text-navy">The CCX approach</h3>
              <p className="text-[15px] text-slate-600 leading-[25px]">
                CCX is designed to structure existing documentation into standardized records without changing how frontline staff already work: no new intake tool, no workflow redesign.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className="font-sans font-semibold text-[15px] text-navy">Benefits</h3>
              <p className="text-[15px] text-slate-600 leading-[25px]">
                Structured, standardized documentation designed to reduce the manual effort of retrospective review preparation and to support clearer reporting to SCN leadership and funders.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className="font-sans font-semibold text-[15px] text-navy">How we work with an early partner</h3>
              <p className="text-[15px] text-slate-600 leading-[25px]">
                We haven’t run a production deployment yet. An early design partnership means working directly with your team to understand your actual documentation flow before anything is structured, rather than applying a fixed playbook.
              </p>
            </div>
          </div>
        </section>

        {/* ============ HIGH-LEVEL ARCHITECTURE ============ */}
        <section className="space-y-6 text-left">
          <div className="space-y-2 max-w-[680px]">
            <h2 className="font-sans font-bold text-[24px] text-navy tracking-tight">High-Level Architecture</h2>
            <p className="text-[15px] text-slate-600 leading-[24px]">
              A single-page view of how CCX sits relative to your existing systems. Implementation-level detail isn&apos;t covered here.
            </p>
          </div>
          <div className="bg-white border border-[#0F172A]/[0.06] rounded-2xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-stretch justify-center gap-6 md:gap-4">
              
              {/* Existing Systems Card */}
              <div className="flex-1 bg-[#FAF9F6] border border-[#0F172A]/[0.06] rounded-2xl p-6 text-center space-y-3 flex flex-col items-center justify-center shadow-xs">
                <div className="w-full max-w-[180px] h-12 rounded-xl bg-navy/[0.04] border border-navy/[0.06] flex items-center justify-center">
                  <span className="text-[11px] font-bold text-navy tracking-wider uppercase">Existing Systems</span>
                </div>
                <p className="text-[12px] text-slate-500 leading-relaxed max-w-[180px] mx-auto">Current intake tools, case management systems, frontline records</p>
              </div>

              {/* Arrow 1 */}
              <div className="flex items-center justify-center shrink-0">
                <ArrowRight className="w-5 h-5 text-gold rotate-90 md:rotate-0" />
              </div>

              {/* CCX Card */}
              <div className="flex-1 bg-navy text-white rounded-2xl p-6 text-center space-y-3 flex flex-col items-center justify-center shadow-md border border-navy">
                <div className="w-full max-w-[180px] h-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
                  <span className="text-[11px] font-bold text-white tracking-wider uppercase">CCX</span>
                </div>
                <p className="text-[12px] text-slate-300 leading-relaxed max-w-[180px] mx-auto">Structures existing documentation into standardized records</p>
              </div>

              {/* Arrow 2 */}
              <div className="flex items-center justify-center shrink-0">
                <ArrowRight className="w-5 h-5 text-gold rotate-90 md:rotate-0" />
              </div>

              {/* Downstream Outputs Card */}
              <div className="flex-1 bg-[#FAF9F6] border border-[#0F172A]/[0.06] rounded-2xl p-6 text-center space-y-3 flex flex-col items-center justify-center shadow-xs">
                <div className="w-full max-w-[180px] h-12 rounded-xl bg-navy/[0.04] border border-navy/[0.06] flex items-center justify-center">
                  <span className="text-[11px] font-bold text-navy tracking-wider uppercase">Downstream Outputs</span>
                </div>
                <p className="text-[12px] text-slate-500 leading-relaxed max-w-[180px] mx-auto">Standardized records for review, reporting, and recordkeeping</p>
              </div>

            </div>
          </div>
        </section>

        {/* ============ FAQ ============ */}
        <section className="space-y-6 text-left">
          <h2 className="font-sans font-bold text-[24px] text-navy tracking-tight">Frequently Asked Questions</h2>
          <div className="space-y-4 max-w-[760px]">
            {RESOURCES_FAQ.map((item) => (
              <div key={item.question} className="bg-white border border-[#0F172A]/[0.06] rounded-xl p-5">
                <h3 className="font-sans font-semibold text-[15px] text-navy mb-2">{item.question}</h3>
                <p className="text-[14px] text-slate-500 leading-[23px]">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ============ CONTACT ============ */}
        <section className="bg-gradient-to-br from-[#0F1E36] to-[#081529] border border-gold/15 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 text-left shadow-lg relative overflow-hidden">
          {/* Subtle radial ambient highlight for high-end look */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full filter blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="relative z-10 space-y-1">
            <h2 className="font-sans font-bold text-[22px] text-white tracking-tight">Have a specific question?</h2>
            <p className="text-[14px] text-white/70 max-w-lg leading-relaxed">We’re happy to talk through where CCX does and doesn’t fit.</p>
          </div>
          <button
            onClick={() => {
              onViewChange('home');
              setTimeout(() => {
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 100);
            }}
            className="relative z-10 px-6 py-3 bg-gold hover:bg-[#B5945F] active:translate-y-0.5 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-150 whitespace-nowrap cursor-pointer border border-gold/20"
          >
            Contact Us
          </button>
        </section>

      </div>
    </div>
  );
}
