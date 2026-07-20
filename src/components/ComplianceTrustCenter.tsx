import React from 'react';
import { 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  ArrowRight, 
  Check, 
  X, 
  FileText, 
  Lock, 
  ChevronRight,
  ExternalLink,
  Layers,
  Database,
  Cpu
} from 'lucide-react';

interface ComplianceTrustCenterProps {
  onViewChange: (view: 'home' | 'compliance-trust') => void;
}

export default function ComplianceTrustCenter({ onViewChange }: ComplianceTrustCenterProps) {
  
  const frameworks = [
    {
      framework: 'New York Medicaid 1115 Waiver',
      relationship: 'Documentation workflows designed around social care program requirements.',
      status: 'Reference Documentation Pending'
    },
    {
      framework: 'NYS OMIG Documentation Expectations',
      relationship: 'Documentation integrity principles aligned with record review requirements.',
      status: 'Reference Documentation Pending'
    },
    {
      framework: 'HL7 / FHIR Standards',
      relationship: 'Interoperability-focused technical alignment.',
      status: 'Technical Documentation Pending'
    },
    {
      framework: 'LOINC Terminology Standards',
      relationship: 'Standard terminology mapping support.',
      status: 'Technical Documentation Pending'
    }
  ];

  const securityCards = [
    {
      title: 'Data Flow Architecture',
      description: 'Future technical documentation describing CCX data movement, integration boundaries, and processing architecture.',
      status: 'Documentation Pending'
    },
    {
      title: 'Data Processing Controls',
      description: 'Future documentation describing transformation methodology and processing safeguards.',
      status: 'Documentation Pending'
    },
    {
      title: 'Retention & Privacy Model',
      description: 'Future documentation describing retention practices and privacy controls.',
      status: 'Documentation Pending'
    },
    {
      title: 'Enterprise Security Overview',
      description: 'Future documentation describing security review materials and organizational controls.',
      status: 'Documentation Pending'
    }
  ];

  const techLibrary = [
    {
      title: 'CCX System Architecture Overview',
      description: 'Executive technical overview of CCX architecture, workflow integration, and system boundaries.'
    },
    {
      title: 'Documentation Integrity Framework',
      description: 'Detailed methodology describing evidence transformation, terminology mapping, and validation workflow.'
    },
    {
      title: 'Security & Data Handling Overview',
      description: 'Technical overview of data processing boundaries, privacy controls, and enterprise review considerations.'
    }
  ];

  const externalRefs = [
    {
      title: 'NYS Medicaid 1115 Waiver Materials',
      org: 'New York State Department of Health (DOH)',
      purpose: 'Official guidelines on capitated SDOH allocations, Social Care Network structures, and waiver amendments.',
      url: 'https://www.health.ny.gov/health_care/medicaid/redesign/1115/docs/ny_1115_waiver_amendment_app.pdf'
    },
    {
      title: 'NYS OMIG Guidance Resources',
      org: 'Office of the Medicaid Inspector General (OMIG)',
      purpose: 'Details contemporaneous record-keeping mandates, compliance standards, and Medicaid audit frameworks.',
      url: 'https://omig.ny.gov/compliance/compliance-guidance-0'
    },
    {
      title: 'HL7 FHIR Documentation',
      org: 'HL7 International',
      purpose: 'Standardized framework for healthcare data exchange, interoperability, and API integration specifications.',
      url: 'https://hl7.org/fhir/'
    },
    {
      title: 'LOINC Documentation',
      org: 'Regenstrief Institute',
      purpose: 'Universal system for identifying health measurements, observations, and clinical determinants.',
      url: 'https://loinc.org/'
    }
  ];

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
          <span className="text-navy font-bold">Compliance &amp; Integrity</span>
        </div>

        {/* Section Header */}
        <div className="space-y-4 max-w-[800px] text-left">
          <span className="font-sans text-[12px] text-[#8B6420] uppercase font-bold tracking-[0.08em]">
            Governance, Security &amp; Compliance Repository
          </span>
          <h1 className="font-sans font-bold text-[36px] md:text-[44px] text-navy tracking-tight leading-none">
            Compliance &amp; Integrity Hub
          </h1>
          <p className="text-[17px] font-normal text-slate-600 leading-[28px]">
            Regulatory alignment, documentation integrity, security architecture, and technical resources supporting enterprise evaluation.
          </p>
        </div>

        {/* SECTION 1: CCX Regulatory Position */}
        <section className="bg-white border border-[#E2E8F0] rounded-2xl p-8 md:p-10 text-left shadow-xs space-y-6">
          <div className="border-b border-[#E2E8F0] pb-4 flex items-center gap-3">
            <Shield className="w-5 h-5 text-gold" />
            <h2 className="font-sans font-bold text-xs text-navy uppercase tracking-wider">
              CCX Regulatory Position
            </h2>
          </div>
          
          <div className="space-y-6">
            <p className="text-navy text-[16px] leading-[26px] font-medium max-w-[840px]">
              CCX is a documentation infrastructure platform designed to support social care organizations in creating structured, review-ready encounter records.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
              {/* Provides Column */}
              <div className="bg-[#FAFAF8] border border-navy/[0.04] rounded-xl p-6 space-y-4">
                <span className="block font-sans font-bold text-xs text-navy uppercase tracking-wider border-b border-[#E2E8F0] pb-2">
                  CCX Provides
                </span>
                <ul className="space-y-3 text-[14px] text-slate-700 font-medium">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#8B6420] shrink-0 mt-0.5" />
                    <span>Documentation structuring</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#8B6420] shrink-0 mt-0.5" />
                    <span>Terminology mapping support</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#8B6420] shrink-0 mt-0.5" />
                    <span>Evidence organization</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#8B6420] shrink-0 mt-0.5" />
                    <span>Workflow integration support</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#8B6420] shrink-0 mt-0.5" />
                    <span>Review preparation resources</span>
                  </li>
                </ul>
              </div>

              {/* Does Not Column */}
              <div className="bg-[#FAFAF8] border border-navy/[0.04] rounded-xl p-6 space-y-4">
                <span className="block font-sans font-bold text-xs text-navy uppercase tracking-wider border-b border-[#E2E8F0] pb-2">
                  CCX Does Not
                </span>
                <ul className="space-y-3 text-[14px] text-slate-700 font-medium">
                  <li className="flex items-start gap-2.5">
                    <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>Perform Medicaid audits</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>Determine reimbursement eligibility</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>Submit claims</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>Replace clinical judgment</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>Act as a regulatory authority</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Documentation Integrity Model */}
        <section className="space-y-8 text-left">
          <div className="border-b border-[#E2E8F0] pb-3 flex items-center gap-3">
            <Layers className="w-5 h-5 text-gold" />
            <h2 className="font-sans font-bold text-xs text-navy uppercase tracking-wider">
              Documentation Integrity Model
            </h2>
          </div>

          {/* Horizontal Process Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {[
              { step: '1', title: 'Source Documentation', desc: 'Ingestion of raw, authorized narrative casework notes.' },
              { step: '2', title: 'Structured Transformation', desc: 'Algorithmic filtering and structural alignment of input fields.' },
              { step: '3', title: 'Terminology Mapping', desc: 'Standardized metadata mapping to LOINC / ICD-10 SDOH codes.' },
              { step: '4', title: 'Human Validation', desc: 'Contemporaneous review and verification by authorized personnel.' },
              { step: '5', title: 'Review-Ready Record', desc: 'Secure packaging and export of finalized encounter documentation.' }
            ].map((node, idx) => (
              <div key={idx} className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs relative flex flex-col justify-between hover:border-gold/30 transition-colors">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-full bg-navy/5 text-[#8B6420] text-xs font-bold flex items-center justify-center font-mono">
                      {node.step}
                    </span>
                    {idx < 4 && (
                      <ArrowRight className="hidden md:block w-4 h-4 text-slate-400 absolute -right-3 top-1/2 -translate-y-1/2 z-10" />
                    )}
                  </div>
                  <h3 className="font-sans font-bold text-[13px] text-navy uppercase tracking-tight leading-tight">
                    {node.title}
                  </h3>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {node.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Four Principles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
            <div className="space-y-1.5 p-5 bg-white border border-[#E2E8F0] rounded-xl">
              <span className="block font-sans font-bold text-xs text-navy uppercase tracking-wider">Reproducibility</span>
              <p className="text-slate-600 text-xs leading-relaxed">
                Retrospective documentation review structured around deterministic capture and validation of exported records.
              </p>
            </div>
            <div className="space-y-1.5 p-5 bg-white border border-[#E2E8F0] rounded-xl">
              <span className="block font-sans font-bold text-xs text-navy uppercase tracking-wider">Specificity</span>
              <p className="text-slate-600 text-xs leading-relaxed">
                Structured information mapped to standardized terminology frameworks.
              </p>
            </div>
            <div className="space-y-1.5 p-5 bg-white border border-[#E2E8F0] rounded-xl">
              <span className="block font-sans font-bold text-xs text-navy uppercase tracking-wider">Provenance</span>
              <p className="text-slate-600 text-xs leading-relaxed">
                Transformation processes maintain traceability between source information and resulting records.
              </p>
            </div>
            <div className="space-y-1.5 p-5 bg-white border border-[#E2E8F0] rounded-xl">
              <span className="block font-sans font-bold text-xs text-navy uppercase tracking-wider">Human Oversight</span>
              <p className="text-slate-600 text-xs leading-relaxed">
                Authorized personnel remain responsible for validation and final approval.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3: System Boundaries */}
        <section className="bg-white border border-[#E2E8F0] rounded-2xl p-8 md:p-10 text-left shadow-xs space-y-6">
          <div className="border-b border-[#E2E8F0] pb-4 flex items-center gap-3">
            <Cpu className="w-5 h-5 text-gold" />
            <h2 className="font-sans font-bold text-xs text-navy uppercase tracking-wider">
              System Boundaries &amp; Integrity Controls
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* CCX Does Not Column */}
            <div className="bg-slate-50/50 border border-slate-100 p-6 md:p-8 rounded-2xl space-y-6 shadow-[inset_0_1px_2px_rgba(15,23,42,0.01)]">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500 font-bold text-sm">
                  <X className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-sans font-bold text-[14px] text-navy tracking-tight uppercase">Out of Scope</h4>
                  <p className="text-[11px] text-slate-400 font-normal">Actions CCX is intentionally restricted from performing</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3.5 bg-white border border-[#E2E8F0]/80 rounded-xl hover:border-red-200 transition-colors duration-150 shadow-[0_1px_2px_rgba(15,23,42,0.02)]">
                  <div className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center text-red-500 shrink-0">
                    <X className="w-3 h-3" />
                  </div>
                  <span className="text-[13.5px] font-semibold text-slate-700">Replace existing EHR systems</span>
                </div>

                <div className="flex items-center gap-3 p-3.5 bg-white border border-[#E2E8F0]/80 rounded-xl hover:border-red-200 transition-colors duration-150 shadow-[0_1px_2px_rgba(15,23,42,0.02)]">
                  <div className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center text-red-500 shrink-0">
                    <X className="w-3 h-3" />
                  </div>
                  <span className="text-[13.5px] font-semibold text-slate-700">Replace referral platforms</span>
                </div>

                <div className="flex items-center gap-3 p-3.5 bg-white border border-[#E2E8F0]/80 rounded-xl hover:border-red-200 transition-colors duration-150 shadow-[0_1px_2px_rgba(15,23,42,0.02)]">
                  <div className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center text-red-500 shrink-0">
                    <X className="w-3 h-3" />
                  </div>
                  <span className="text-[13.5px] font-semibold text-slate-700">Make clinical decisions</span>
                </div>

                <div className="flex items-center gap-3 p-3.5 bg-white border border-[#E2E8F0]/80 rounded-xl hover:border-red-200 transition-colors duration-150 shadow-[0_1px_2px_rgba(15,23,42,0.02)]">
                  <div className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center text-red-500 shrink-0">
                    <X className="w-3 h-3" />
                  </div>
                  <span className="text-[13.5px] font-semibold text-slate-700">Automatically submit claims</span>
                </div>

                <div className="flex items-center gap-3 p-3.5 bg-white border border-[#E2E8F0]/80 rounded-xl hover:border-red-200 transition-colors duration-150 shadow-[0_1px_2px_rgba(15,23,42,0.02)]">
                  <div className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center text-red-500 shrink-0">
                    <X className="w-3 h-3" />
                  </div>
                  <span className="text-[13.5px] font-semibold text-slate-700">Override organizational policies</span>
                </div>
              </div>
            </div>

            {/* CCX Does Column */}
            <div className="bg-gold/[0.01] border border-gold/10 p-6 md:p-8 rounded-2xl space-y-6 shadow-[inset_0_1px_2px_rgba(139,100,32,0.01)]">
              <div className="flex items-center gap-3 border-b border-gold/10 pb-4">
                <div className="w-8 h-8 rounded-lg bg-gold/5 flex items-center justify-center text-gold font-bold text-sm">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-sans font-bold text-[14px] text-navy tracking-tight uppercase">Core System Scope</h4>
                  <p className="text-[11px] text-slate-400 font-normal">Active integrity controls and structural services</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3.5 bg-white border border-gold/10 rounded-xl hover:border-gold/30 transition-colors duration-150 shadow-[0_1px_2px_rgba(15,23,42,0.02)]">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-[13.5px] font-semibold text-navy">Structure documentation inputs</span>
                </div>

                <div className="flex items-center gap-3 p-3.5 bg-white border border-gold/10 rounded-xl hover:border-gold/30 transition-colors duration-150 shadow-[0_1px_2px_rgba(15,23,42,0.02)]">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-[13.5px] font-semibold text-navy">Support standardized evidence formats</span>
                </div>

                <div className="flex items-center gap-3 p-3.5 bg-white border border-gold/10 rounded-xl hover:border-gold/30 transition-colors duration-150 shadow-[0_1px_2px_rgba(15,23,42,0.02)]">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-[13.5px] font-semibold text-navy">Maintain workflow separation</span>
                </div>

                <div className="flex items-center gap-3 p-3.5 bg-white border border-gold/10 rounded-xl hover:border-gold/30 transition-colors duration-150 shadow-[0_1px_2px_rgba(15,23,42,0.02)]">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-[13.5px] font-semibold text-navy">Provide integration pathways</span>
                </div>

                <div className="flex items-center gap-3 p-3.5 bg-white border border-gold/10 rounded-xl hover:border-gold/30 transition-colors duration-150 shadow-[0_1px_2px_rgba(15,23,42,0.02)]">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-[13.5px] font-semibold text-navy">Support audit preparation activities</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: Security & Data Handling Architecture */}
        <section className="space-y-6 text-left">
          <div className="border-b border-[#E2E8F0] pb-3 flex items-center gap-3">
            <Lock className="w-5 h-5 text-gold" />
            <h2 className="font-sans font-bold text-xs text-navy uppercase tracking-wider">
              Security &amp; Data Handling Architecture
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {securityCards.map((card, idx) => (
              <div key={idx} className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs flex flex-col justify-between min-h-[160px]">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-sans font-bold text-[14px] text-navy uppercase tracking-tight">
                      {card.title}
                    </h3>
                    <span className="text-[9px] font-mono font-bold uppercase bg-slate-100 text-slate-500 px-2 py-0.5 rounded shrink-0">
                      {card.status}
                    </span>
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 5: Framework Alignment */}
        <section className="space-y-6 text-left">
          <div className="border-b border-[#E2E8F0] pb-3 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-gold" />
            <h2 className="font-sans font-bold text-xs text-navy uppercase tracking-wider">
              Framework Alignment Matrix
            </h2>
          </div>

          <div className="overflow-x-auto border border-[#E2E8F0] rounded-xl shadow-xs bg-white">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAFAF8] border-b border-[#E2E8F0] text-[11px] font-bold text-navy uppercase tracking-wider">
                  <th className="p-4.5 pl-6 font-sans w-1/3">Framework</th>
                  <th className="p-4.5 font-sans w-1/3">Relationship</th>
                  <th className="p-4.5 pr-6 font-sans">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] text-[13px] text-slate-700">
                {frameworks.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-5 pl-6 font-sans font-bold text-navy">{row.framework}</td>
                    <td className="p-5 font-sans text-slate-600 leading-relaxed">{row.relationship}</td>
                    <td className="p-5 pr-6 font-sans text-slate-500 font-mono text-[10px] uppercase font-bold">{row.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 6: Technical Documentation Library */}
        <section className="space-y-6 text-left">
          <div className="border-b border-[#E2E8F0] pb-3 flex items-center gap-3">
            <FileText className="w-5 h-5 text-gold" />
            <h2 className="font-sans font-bold text-xs text-navy uppercase tracking-wider">
              Technical Documentation Library
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {techLibrary.map((doc, idx) => (
              <div key={idx} className="bg-white border border-[#0F172A]/[0.06] rounded-xl p-6 shadow-xs flex flex-col justify-between min-h-[180px]">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-navy/5 flex items-center justify-center text-gold">
                      <FileText className="w-4.5 h-4.5" />
                    </div>
                    <span className="font-mono text-[9px] bg-[#8B6420]/10 text-[#8B6420] font-bold px-2.5 py-0.5 rounded uppercase">
                      Coming Soon
                    </span>
                  </div>
                  <h3 className="font-sans font-semibold text-[15px] text-navy tracking-tight leading-snug">
                    {doc.title}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    {doc.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 7: External Regulatory References */}
        <section className="space-y-6 text-left">
          <div className="border-b border-[#E2E8F0] pb-3 flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-gold" />
            <h2 className="font-sans font-bold text-xs text-navy uppercase tracking-wider">
              External Regulatory References
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {externalRefs.map((ref, idx) => (
              <div key={idx} className="bg-white border border-[#0F172A]/[0.06] rounded-xl p-6 shadow-xs flex flex-col justify-between min-h-[200px] hover:border-gold/30 transition-colors">
                <div className="space-y-2">
                  <span className="text-[8px] font-mono text-slate-400 uppercase tracking-wider font-semibold block">
                    Source: {ref.org}
                  </span>
                  <h4 className="font-sans font-semibold text-[15px] text-navy tracking-tight leading-snug">
                    {ref.title}
                  </h4>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    {ref.purpose}
                  </p>
                </div>
                <div className="pt-4 border-t border-[#FAFAF8] mt-4 flex items-center justify-between text-[10px] font-semibold">
                  <span className="text-slate-400 font-mono uppercase tracking-wider text-[9px]">External Reference</span>
                  <a 
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-gold hover:underline cursor-pointer focus-visible:ring-2 focus-visible:ring-[#8B6420] focus-visible:rounded px-1.5 py-0.5"
                    aria-label={`View documentation for ${ref.title}, opens in new tab`}
                  >
                    <span>View Reference</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
