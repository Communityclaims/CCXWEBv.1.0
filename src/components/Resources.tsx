import React from 'react';
import { ChevronRight, ExternalLink, ArrowRight, ArrowDown } from 'lucide-react';

interface ResourcesProps {
  onViewChange: (view: 'home' | 'compliance-trust' | 'resources' | 'accessibility') => void;
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
    purpose: 'Official program information covering the New York Health Equity Reform (NYHER) 1115 Waiver Social Care Network structure, screening requirements, and regional Lead Entities.',
    url: 'https://www.health.ny.gov/health_care/medicaid/redesign/sdh/scn/'
  },
  {
    title: 'New York Medicaid 1115 Waiver',
    org: 'New York State Department of Health',
    purpose: 'Primary waiver information, including the NYHER amendment and related program materials.',
    url: 'https://www.health.ny.gov/health_care/medicaid/redesign/1115_waiver/'
  },
  {
    title: 'Self-Disclosure Program',
    org: 'NYS Office of the Medicaid Inspector General (OMIG)',
    purpose: 'Information on reporting and returning Medicaid overpayments, including requirements related to records and documentation.',
    url: 'https://omig.ny.gov/provider-resources/self-disclosure'
  },
  {
    title: 'Compliance Program Review Protocols & Annual Work Plan',
    org: 'NYS Office of the Medicaid Inspector General (OMIG)',
    purpose: 'Information on Compliance Program Reviews, annual review activity, and the requirements under 18 NYCRR Part 521.',
    url: 'https://omig.ny.gov/compliance/compliance-library'
  },
  {
    title: 'Health-Related Social Needs (HRSN) in Medicaid',
    org: 'Centers for Medicare & Medicaid Services (CMS)',
    purpose: 'Federal guidance on Medicaid authorities for coverage of health-related social needs.',
    note: 'CMS rescinded its 2023 and 2024 HRSN framework bulletins in March 2025. New York’s approved SCN waiver continues under its approved terms. This page links to current CMS materials and notes material changes where relevant.',
    url: 'https://www.medicaid.gov/medicaid/section-1115-demonstrations/health-related-social-needs'
  },
  {
    title: 'HIPAA Security Rule Guidance',
    org: 'HHS Office for Civil Rights',
    purpose: 'Federal guidance on administrative, physical, and technical safeguards for electronic protected health information.',
    url: 'https://www.hhs.gov/hipaa/for-professionals/security/index.html'
  }
];

const FREQUENTLY_ASKED_QUESTIONS = [
  {
    question: 'Is CCX affiliated with OMIG, NYSDOH, or CMS?',
    answer: 'No. CCX is an independent company. The regulatory references on this page link to official government sources. CCX does not represent or speak on behalf of any regulator.'
  },
  {
    question: 'How current are these references?',
    answer: 'Regulatory guidance changes over time. We link directly to government sources so the underlying materials can be reviewed in their current form and note material changes when relevant.'
  },
  {
    question: 'Where can I find more detail?',
    answer: 'This page is intentionally high level. More detailed information about security, integrations, and the review methodology is provided during a direct evaluation.'
  },
  {
    question: 'What does CCX review?',
    answer: 'CCX reviews claims and the documentation supporting them. The specific records and requirements depend on the matter being assessed.'
  },
  {
    question: 'Does CCX replace our existing documentation system?',
    answer: 'No. CCX works from exported records and is designed to fit alongside existing systems and workflows.'
  },
  {
    question: 'Have you worked with an organization in production?',
    answer: 'CCX is currently available for prospective customer evaluation, pilots, and retrospective assessment reviews.'
  }
];

export default function Resources({ onViewChange }: ResourcesProps) {
  const handleContactClick = () => {
    onViewChange('home');
    setTimeout(() => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <div id="resources" className="bg-[#FAF8F5] py-16 md:py-24">
      <div className="max-w-[1120px] mx-auto px-6 space-y-16">

        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">
          <button
            type="button"
            onClick={() => onViewChange('home')}
            className="hover:text-gold transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B6420] focus-visible:rounded px-1"
          >
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-navy font-bold">Resources</span>
        </div>

        {/* Header */}
        <div className="space-y-4 max-w-[840px] text-left">
          <h1 className="font-sans font-bold text-[36px] md:text-[44px] text-navy tracking-tight leading-tight">
            Reference Materials
          </h1>
          <p className="text-[17px] sm:text-[18px] font-normal text-slate-600 leading-[29px] sm:leading-[30px]">
            Background on the documentation and compliance issues relevant to CCX, with links to official regulatory sources wherever possible.
          </p>
        </div>

        {/* ============ REGULATORY REFERENCES ============ */}
        <section className="space-y-6 text-left">
          <div className="space-y-2 max-w-[680px]">
            <h2 className="font-sans font-bold text-[26px] text-navy tracking-tight">
              Regulatory References
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {REGULATORY_REFERENCES.map((ref) => (
              <a
                key={ref.title}
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white border border-[#0F172A]/[0.07] rounded-xl p-6 flex flex-col justify-between shadow-xs hover:border-gold/30 hover:shadow-sm transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B6420]"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-sans font-semibold text-[17px] text-navy leading-snug group-hover:text-[#8B6420] transition-colors">
                      {ref.title}
                    </span>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-gold transition-colors shrink-0 mt-0.5" />
                  </div>
                  <span className="block text-[11px] font-bold text-gold uppercase tracking-wider">
                    {ref.org}
                  </span>
                  <p className="text-[14px] text-slate-600 leading-[22px]">
                    {ref.purpose}
                  </p>
                  {ref.note && (
                    <div className="pt-3 border-t border-slate-100 mt-2">
                      <p className="text-[13px] text-slate-600 leading-[20px] bg-slate-50 p-3 rounded-lg border border-slate-200/60">
                        {ref.note}
                      </p>
                    </div>
                  )}
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Divider */}
        <hr className="border-t border-slate-200/80" />

        {/* ============ HOW THE DOCUMENTATION PROBLEM SHOWS UP ============ */}
        <section className="space-y-8 text-left">
          <div className="space-y-4 max-w-[800px]">
            <h2 className="font-sans font-bold text-[28px] text-navy tracking-tight leading-tight">
              How the Documentation Problem Shows Up
            </h2>
            <div className="space-y-3 text-[16px] font-normal text-slate-600 leading-[28px]">
              <p>
                Social care encounters are often documented across case management systems, intake tools, forms, and free-text notes. When records need to be reviewed later, organizations may need to reconstruct information that was captured in different places and formats.
              </p>
              <p className="font-medium text-navy">
                CCX focuses on that retrospective review problem.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-[#0F172A]/[0.06] shadow-xs space-y-3">
              <h3 className="font-sans font-semibold text-[18px] text-navy tracking-tight leading-snug">
                Existing Documentation
              </h3>
              <p className="text-[15px] font-normal text-slate-600 leading-[25px]">
                Frontline teams continue using the systems and documentation methods already in place.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#0F172A]/[0.06] shadow-xs space-y-3">
              <h3 className="font-sans font-semibold text-[18px] text-navy tracking-tight leading-snug">
                Retrospective Review
              </h3>
              <p className="text-[15px] font-normal text-slate-600 leading-[25px]">
                Records are brought together and reviewed against the requirements relevant to the matter being assessed.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#0F172A]/[0.06] shadow-xs space-y-3">
              <h3 className="font-sans font-semibold text-[18px] text-navy tracking-tight leading-snug">
                Review Findings
              </h3>
              <p className="text-[15px] font-normal text-slate-600 leading-[25px]">
                CCX identifies supported information, missing or incomplete documentation, and the source material behind each finding.
              </p>
            </div>
          </div>
        </section>

        {/* Divider */}
        <hr className="border-t border-slate-200/80" />

        {/* ============ WHERE CCX FITS & HIGH-LEVEL ARCHITECTURE ============ */}
        <section className="space-y-8 text-left">
          <div className="space-y-3 max-w-[800px]">
            <h2 className="font-sans font-bold text-[28px] text-navy tracking-tight leading-tight">
              Where CCX Fits
            </h2>
            <p className="text-[16px] sm:text-[17px] font-normal text-slate-600 leading-[28px]">
              CCX works from exported records and sits alongside existing documentation and billing systems without requiring organizations to alter frontline casework workflows.
            </p>
          </div>

          <div className="bg-white border border-[#0F172A]/[0.06] rounded-2xl p-6 sm:p-10 shadow-xs">
            <div className="flex flex-col md:flex-row items-stretch justify-center gap-4 md:gap-6">
              
              {/* Box 1 */}
              <div className="flex-1 bg-[#FAF9F6] border border-[#0F172A]/[0.08] rounded-xl p-6 text-center space-y-2.5 flex flex-col items-center justify-center">
                <span className="font-sans font-bold text-[16px] text-navy uppercase tracking-tight">
                  Existing Systems
                </span>
                <p className="text-[14px] text-slate-600 leading-relaxed max-w-[240px]">
                  Documentation, claims, remittance, and supporting records
                </p>
              </div>

              {/* Transition Indicator */}
              <div className="flex items-center justify-center shrink-0">
                <ArrowDown className="w-5 h-5 text-gold md:hidden" />
                <ArrowRight className="w-5 h-5 text-gold hidden md:block" />
              </div>

              {/* Box 2 */}
              <div className="flex-1 bg-[#0B1F3A] text-white rounded-xl p-6 text-center space-y-2.5 flex flex-col items-center justify-center shadow-md border border-[#0B1F3A]">
                <span className="font-sans font-bold text-[16px] text-amber-300 uppercase tracking-tight">
                  CCX
                </span>
                <p className="text-[14px] text-slate-200 leading-relaxed max-w-[240px]">
                  Ingestion, terminology mapping, validation, and claim-level review
                </p>
              </div>

              {/* Transition Indicator */}
              <div className="flex items-center justify-center shrink-0">
                <ArrowDown className="w-5 h-5 text-gold md:hidden" />
                <ArrowRight className="w-5 h-5 text-gold hidden md:block" />
              </div>

              {/* Box 3 */}
              <div className="flex-1 bg-[#FAF9F6] border border-[#0F172A]/[0.08] rounded-xl p-6 text-center space-y-2.5 flex flex-col items-center justify-center">
                <span className="font-sans font-bold text-[16px] text-navy uppercase tracking-tight">
                  Review Outputs
                </span>
                <p className="text-[14px] text-slate-600 leading-relaxed max-w-[240px]">
                  Findings, supporting source material, and review package
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Divider */}
        <hr className="border-t border-slate-200/80" />

        {/* ============ FREQUENTLY ASKED QUESTIONS ============ */}
        <section className="space-y-8 text-left">
          <h2 className="font-sans font-bold text-[28px] text-navy tracking-tight leading-tight">
            Frequently Asked Questions
          </h2>
          <div className="space-y-5 max-w-[820px]">
            {FREQUENTLY_ASKED_QUESTIONS.map((item) => (
              <div key={item.question} className="bg-white border border-[#0F172A]/[0.06] rounded-xl p-6 shadow-xs space-y-2.5">
                <h3 className="font-sans font-semibold text-[17px] text-navy leading-snug">
                  {item.question}
                </h3>
                <p className="text-[15px] font-normal text-slate-600 leading-[25px]">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Divider */}
        <hr className="border-t border-slate-200/80" />

        {/* ============ CONTACT ============ */}
        <section className="bg-white border border-gold/30 rounded-2xl p-8 sm:p-10 text-left shadow-xs space-y-6">
          <div className="space-y-2">
            <span className="font-sans text-[12px] text-[#8B6420] uppercase font-semibold tracking-[0.08em] block">
              Contact
            </span>
            <h2 className="font-sans font-bold text-[26px] sm:text-[30px] text-navy tracking-tight leading-tight">
              Community Claims Exchange
            </h2>
            <p className="text-[16px] font-normal text-slate-600 leading-[27px] max-w-xl">
              For questions about the reference materials or to discuss a documentation review, contact CCX.
            </p>
          </div>

          <div>
            <button
              type="button"
              onClick={handleContactClick}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#8B6420] hover:bg-[#73531A] active:translate-y-0.5 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-150 cursor-pointer border border-gold/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B6420] focus-visible:ring-offset-2"
            >
              <span>Contact CCX</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
