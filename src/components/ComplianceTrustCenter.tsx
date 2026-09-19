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
  Download,
  FileSpreadsheet,
  AlertTriangle,
  FileCode
} from 'lucide-react';
import { downloadCaseloadTemplate } from '../ExportUtils';

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
            type="button"
            onClick={() => {
              onViewChange('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hover:text-gold transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B6420] focus-visible:rounded px-1"
          >
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-navy font-bold">Data Handling &amp; Security</span>
        </div>

        {/* Section Header */}
        <div className="space-y-4 max-w-[840px] text-left">
          <span className="font-sans text-[12px] text-[#8B6420] uppercase font-bold tracking-[0.08em] block">
            Governance, Data Handling &amp; Security Repository
          </span>
          <h1 className="font-sans font-bold text-[36px] md:text-[44px] text-navy tracking-tight leading-none">
            Data Handling &amp; Security Hub
          </h1>
          <p className="text-[17px] font-normal text-slate-600 leading-[28px]">
            Enterprise data handling standards, HIPAA Safe Harbor de-identification protocols, Business Associate Agreement (BAA) execution framework, and infrastructure security supporting organizational evaluation.
          </p>
        </div>

        {/* SECTION 1: CCX Regulatory Position */}
        <section className="bg-white border border-[#E2E8F0] rounded-2xl p-8 md:p-10 text-left shadow-xs space-y-6">
          <div className="border-b border-[#E2E8F0] pb-4 flex items-center gap-3">
            <Shield className="w-5 h-5 text-gold" />
            <h2 className="font-sans font-bold text-xs text-navy uppercase tracking-wider">
              CCX Regulatory Position &amp; Operating Model
            </h2>
          </div>
          
          <div className="space-y-4">
            <p className="text-navy text-[16px] leading-[26px] font-medium max-w-[840px]">
              CCX is a documentation infrastructure platform designed to support social care organizations in creating structured, review-ready encounter records.
            </p>
            <p className="text-slate-600 text-[14px] leading-[24px] max-w-[840px]">
              CCX operates as an auxiliary documentation-structuring tool. The platform does not perform certified audits, determine reimbursement eligibility, submit claims, or replace professional clinical judgment. Official determinations remain with licensed providers and regulatory authorities.
            </p>
          </div>
        </section>

        {/* SECTION 2: Enterprise Security & Procurement Prerequisites */}
        <section className="space-y-8 text-left">
          <div className="border-b border-[#E2E8F0] pb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-gold" />
              <h2 className="font-sans font-bold text-xs text-navy uppercase tracking-wider">
                Security &amp; Procurement Prerequisites
              </h2>
            </div>
            <span className="text-[11px] font-semibold text-slate-500 hidden sm:inline-block">
              BAA · Hosting &amp; Encryption · SOC 2
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tile 1: BAA */}
            <div className="bg-white border-2 border-emerald-100/80 hover:border-emerald-300 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-xs transition-colors">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider">Procurement Question 01</span>
                  <span className="font-mono text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                    <Check className="w-3 h-3 stroke-[3px]" />
                    Supported BAA
                  </span>
                </div>
                <h3 className="font-sans font-bold text-base text-navy">
                  (1) Can CCX execute a BAA?
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  CCX executes a BAA before ingesting customer data. CCX supports customer-provided enterprise BAAs as well as standard NY Medicaid 1115 BAA templates prior to processing exported records.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-200/70 space-y-2 text-[11.5px] text-slate-600">
                <div className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Customer BAA Accepted:</strong> Execution of customer-provided enterprise BAAs is supported</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Standard Template:</strong> NY Medicaid 1115 BAA template available for review</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Breach Notification:</strong> Defined breach notification commitments aligned with HIPAA Omnibus rules</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Pre-Processing Gate:</strong> BAA execution occurs before customer data is processed</span>
                </div>
              </div>
            </div>

            {/* Tile 2: Hosting & Encryption */}
            <div className="bg-white border-2 border-blue-100/80 hover:border-blue-300 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-xs transition-colors">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider">Procurement Question 02</span>
                  <span className="font-mono text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-300 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    AWS US Hosting · AES-256 / TLS 1.3
                  </span>
                </div>
                <h3 className="font-sans font-bold text-base text-navy">
                  (2) Where is data hosted?
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Customer data is hosted in dedicated, tenant-isolated AWS US-East environments. Data is encrypted at rest via <strong className="text-navy">AES-256</strong> (with isolated tenant KMS keys) and in transit via <strong className="text-navy">TLS 1.3</strong>.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-200/70 space-y-2 text-[11.5px] text-slate-600">
                <div className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>US Hosting:</strong> Hosted within dedicated AWS US-East infrastructure</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>Tenant Isolation:</strong> Logical separation with dedicated tenant schemas and KMS keys</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>Encryption at Rest:</strong> AES-256 encryption using AWS KMS keys</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>Encryption in Transit:</strong> TLS 1.3 encryption enforced for all data transmission</span>
                </div>
              </div>
            </div>

            {/* Tile 3: SOC 2 */}
            <div className="bg-white border-2 border-amber-100/80 hover:border-amber-300 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-xs transition-colors">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider">Procurement Question 03</span>
                  <span className="font-mono text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-300 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                    In Progress · Target Q2 2027
                  </span>
                </div>
                <h3 className="font-sans font-bold text-base text-navy">
                  (3) What is CCX’s SOC 2 status?
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  SOC 2 Type II is in progress. The audit observation window is active with an independent AICPA CPA firm, with report issuance targeted for Q2 2027.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-200/70 space-y-2 text-[11.5px] text-slate-600">
                <div className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold text-xs shrink-0 mt-0.5">✓</span>
                  <span><strong>HIPAA Risk Assessment:</strong> Completed HIPAA Security &amp; Privacy Rule assessment available under mutual NDA</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold text-xs shrink-0 mt-0.5">✓</span>
                  <span><strong>Third-Party Pen Test:</strong> Independent network &amp; application penetration test executive summary report</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold text-xs shrink-0 mt-0.5">✓</span>
                  <span><strong>SIG / CAIQ Questionnaire:</strong> Standardized Information Gathering security questionnaire available</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold text-xs shrink-0 mt-0.5">✓</span>
                  <span><strong>Formal Policies:</strong> Written Information Security Program (WISP) &amp; Incident Response Plan</span>
                </div>
              </div>
            </div>
          </div>

          {/* Operational Architecture & Ingestion Guardrails */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider">Guardrail 01</span>
                <span className="font-mono text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  Scheduled Batch Only
                </span>
              </div>
              <h4 className="font-sans font-bold text-base text-navy">
                Retrospective Ingestion Cadence
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ingestion operates on a scheduled batch basis using exported records provided by your organization, without requiring live connections or agent software on your systems.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider">Guardrail 02</span>
                <span className="font-mono text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  6-10 Year Statutory Archival
                </span>
              </div>
              <h4 className="font-sans font-bold text-base text-navy">
                Documentation Retention Policy
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                CCX adheres to a structured Documentation Retention Policy designed to support statutory recordkeeping mandates (6-10 years depending on entity type) for retrospective audit defense, ensuring that compiled clinical notes are securely archived and indexed in immutable WORM storage.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider">Guardrail 03</span>
                <span className="font-mono text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  Human Supervisor Verification
                </span>
              </div>
              <h4 className="font-sans font-bold text-base text-navy">
                Supervisor Authorization Sign-Off
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Compilation of human-authorized supervisor signatures identified during retrospective review, supporting standardized documentation review packages aligned with OMIG review formats. Every finding requires human clinical sign-off.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3: Enterprise Data Handling, BAA & HIPAA Safe Harbor Standard */}
        <section className="space-y-8 text-left">
          <div className="border-b border-[#E2E8F0] pb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="w-5 h-5 text-gold" />
              <h2 className="font-sans font-bold text-xs text-navy uppercase tracking-wider">
                Data Handling Protocols &amp; HIPAA Safe Harbor Standard
              </h2>
            </div>
            <span className="font-mono text-[9px] font-bold text-[#8B6420] bg-gold/10 px-2.5 py-0.5 rounded uppercase">
              HIPAA Safe Harbor Standard (45 CFR § 164.514(b))
            </span>
          </div>

          {/* Operational vs. Safe Harbor Dual-Track Protocol Banner */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 md:p-8 space-y-4 shadow-xs">
            <h3 className="font-sans font-bold text-base text-navy">
              Enterprise Data Handling Architecture &amp; Intake Pathways
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1 text-xs text-slate-600 leading-relaxed">
              <div className="p-4.5 bg-[#FAF9F6] border border-slate-200 rounded-xl space-y-2">
                <span className="font-sans font-bold text-xs text-navy uppercase tracking-wider block flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  Operational Assessment Track (Under Executed BAA)
                </span>
                <p>
                  When conducting operational retrospective assessments on caseload data, records containing Protected Health Information (PHI) are handled through controlled enterprise ingestion channels under an executed Business Associate Agreement (BAA). Real operational workflows use enterprise SFTP or secure encrypted batch transfer, permitting necessary clinical identifiers under HIPAA Privacy Rule provisions.
                </p>
              </div>

              <div className="p-4.5 bg-[#FAF9F6] border border-slate-200 rounded-xl space-y-2">
                <span className="font-sans font-bold text-xs text-navy uppercase tracking-wider block flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#8B6420] shrink-0" />
                  Offline Evaluation &amp; De-Identification Track (Safe Harbor)
                </span>
                <p>
                  For evaluations conducted prior to mutual BAA execution, or for offline test ingestion cohorts, partner IT and compliance teams must sanitize records by removing all 18 HIPAA Safe Harbor identifiers defined under 45 CFR § 164.514(b). Public web demonstrator tools use synthetic scenarios only.
                </p>
              </div>
            </div>
          </div>

          {/* All 18 Safe Harbor Identifiers in 3 structured categories */}
          <div className="space-y-3">
            <div className="space-y-1">
              <h4 className="font-sans font-bold text-sm text-navy uppercase tracking-wider">
                The 18 HIPAA Safe Harbor Direct &amp; Indirect Identifiers
              </h4>
              <p className="text-xs text-slate-500">
                Mandatory sanitization checklist for de-identified dataset submission and offline assessment cohorts:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1 text-[11.5px]">
              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
                <span className="font-mono text-[9.5px] font-bold text-navy uppercase tracking-wider block border-b border-slate-100 pb-2">
                  Direct Personal &amp; Locational (1-6)
                </span>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2"><span className="text-red-500 font-bold">✕</span> <span><strong>1.</strong> Patient &amp; relative names</span></li>
                  <li className="flex items-start gap-2"><span className="text-red-500 font-bold">✕</span> <span><strong>2.</strong> Geographic units &lt; State (no street, city, ZIP)</span></li>
                  <li className="flex items-start gap-2"><span className="text-red-500 font-bold">✕</span> <span><strong>3.</strong> Dates &gt; Year (birth, admit, discharge)</span></li>
                  <li className="flex items-start gap-2"><span className="text-red-500 font-bold">✕</span> <span><strong>4.</strong> Telephone numbers</span></li>
                  <li className="flex items-start gap-2"><span className="text-red-500 font-bold">✕</span> <span><strong>5.</strong> Fax numbers</span></li>
                  <li className="flex items-start gap-2"><span className="text-red-500 font-bold">✕</span> <span><strong>6.</strong> Email addresses &amp; web URLs</span></li>
                </ul>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
                <span className="font-mono text-[9.5px] font-bold text-navy uppercase tracking-wider block border-b border-slate-100 pb-2">
                  Government, Clinical &amp; Plan IDs (7-12)
                </span>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2"><span className="text-red-500 font-bold">✕</span> <span><strong>7.</strong> Social Security numbers (SSNs)</span></li>
                  <li className="flex items-start gap-2"><span className="text-red-500 font-bold">✕</span> <span><strong>8.</strong> Medical Record Numbers (MRNs)</span></li>
                  <li className="flex items-start gap-2"><span className="text-red-500 font-bold">✕</span> <span><strong>9.</strong> Health plan beneficiary / CIN numbers</span></li>
                  <li className="flex items-start gap-2"><span className="text-red-500 font-bold">✕</span> <span><strong>10.</strong> Account numbers</span></li>
                  <li className="flex items-start gap-2"><span className="text-red-500 font-bold">✕</span> <span><strong>11.</strong> Certificate / license numbers</span></li>
                  <li className="flex items-start gap-2"><span className="text-red-500 font-bold">✕</span> <span><strong>12.</strong> Vehicle identifiers / license plates</span></li>
                </ul>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
                <span className="font-mono text-[9.5px] font-bold text-navy uppercase tracking-wider block border-b border-slate-100 pb-2">
                  Technical &amp; Biometric Signals (13-18)
                </span>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2"><span className="text-red-500 font-bold">✕</span> <span><strong>13.</strong> Device identifiers &amp; serial numbers</span></li>
                  <li className="flex items-start gap-2"><span className="text-red-500 font-bold">✕</span> <span><strong>14.</strong> IP addresses</span></li>
                  <li className="flex items-start gap-2"><span className="text-red-500 font-bold">✕</span> <span><strong>15.</strong> Biometric IDs (finger/voice prints)</span></li>
                  <li className="flex items-start gap-2"><span className="text-red-500 font-bold">✕</span> <span><strong>16.</strong> Full-face photographic images</span></li>
                  <li className="flex items-start gap-2"><span className="text-red-500 font-bold">✕</span> <span><strong>17.</strong> Free-text names in caseworker notes</span></li>
                  <li className="flex items-start gap-2"><span className="text-red-500 font-bold">✕</span> <span><strong>18.</strong> Any other unique identifying code</span></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Expected De-Identified Format Specification Table */}
          <div className="space-y-3 pt-2">
            <div className="space-y-1">
              <h4 className="font-sans font-bold text-sm text-navy uppercase tracking-wider">
                Expected Ingestion Schema Specification
              </h4>
              <p className="text-xs text-slate-500">
                Standard batch format definition for retrospective casework records:
              </p>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white shadow-xs">
              <table className="w-full text-left text-[11.5px] text-slate-600">
                <thead className="bg-[#FAF8F5] border-b border-slate-200 font-mono text-[9.5px] text-navy uppercase">
                  <tr>
                    <th className="px-4 py-3 font-bold">Field Name</th>
                    <th className="px-3 py-3 font-bold">Type</th>
                    <th className="px-4 py-3 font-bold">Sample Value</th>
                    <th className="px-4 py-3 font-bold">Sanitization Requirement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[10.5px]">
                  <tr>
                    <td className="px-4 py-2.5 text-navy font-semibold">encounter_id</td>
                    <td className="px-3 py-2.5 text-slate-500">String</td>
                    <td className="px-4 py-2.5 text-[#8B6420]">ENC-00101</td>
                    <td className="px-4 py-2.5 text-slate-500 font-sans">Synthetic pseudo-ID; strip real EHR/CIN numbers.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 text-navy font-semibold">service_month_year</td>
                    <td className="px-3 py-2.5 text-slate-500">YYYY-MM</td>
                    <td className="px-4 py-2.5 text-[#8B6420]">2025-03</td>
                    <td className="px-4 py-2.5 text-slate-500 font-sans">Month/year only; exact day stripped per Safe Harbor.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 text-navy font-semibold">duration_minutes</td>
                    <td className="px-3 py-2.5 text-slate-500">Integer</td>
                    <td className="px-4 py-2.5 text-[#8B6420]">15</td>
                    <td className="px-4 py-2.5 text-slate-500 font-sans">Contemporaneously documented encounter minutes.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 text-navy font-semibold">staff_credential</td>
                    <td className="px-3 py-2.5 text-slate-500">String</td>
                    <td className="px-4 py-2.5 text-[#8B6420]">CHW</td>
                    <td className="px-4 py-2.5 text-slate-500 font-sans">Role title only; strip staff names and individual NPIs.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 text-navy font-semibold">service_category</td>
                    <td className="px-3 py-2.5 text-slate-500">String</td>
                    <td className="px-4 py-2.5 text-[#8B6420]">Food Insecurity</td>
                    <td className="px-4 py-2.5 text-slate-500 font-sans">Primary SCN domain (Food, Housing, Transportation).</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 text-navy font-semibold">raw_casework_narrative</td>
                    <td className="px-3 py-2.5 text-slate-500">Text</td>
                    <td className="px-4 py-2.5 text-[#8B6420]">&ldquo;Visited member. Family ran out of food...&rdquo;</td>
                    <td className="px-4 py-2.5 text-slate-500 font-sans">Sanitized narrative; all names and addresses replaced.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 text-navy font-semibold">referral_destination</td>
                    <td className="px-3 py-2.5 text-slate-500">String</td>
                    <td className="px-4 py-2.5 text-[#8B6420]">Valley Harvest Food Bank</td>
                    <td className="px-4 py-2.5 text-slate-500 font-sans">Name of receiving CBO, legal aid, or food pantry.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 text-navy font-semibold">consent_documentation_type</td>
                    <td className="px-3 py-2.5 text-slate-500">Enum</td>
                    <td className="px-4 py-2.5 text-[#8B6420]">verbal_unverified</td>
                    <td className="px-4 py-2.5 text-slate-500 font-sans">Documentation flag: verbal, paper, or electronic HIE.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Download Template Action */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="space-y-0.5">
              <h5 className="font-sans font-bold text-xs text-navy uppercase tracking-wider">
                Download Caseload Ingestion Specification Template
              </h5>
              <p className="text-xs text-slate-500">
                Pre-formatted CSV schema with synthetic rows, data dictionary comments, and sanitization guidelines.
              </p>
            </div>
            <button
              type="button"
              onClick={downloadCaseloadTemplate}
              className="px-5 py-2.5 bg-gold hover:bg-[#5E3E08] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Template (.CSV)</span>
            </button>
          </div>
        </section>

        {/* SECTION 4: Documentation Integrity Architecture */}
        <section className="space-y-8 text-left">
          <div className="border-b border-[#E2E8F0] pb-3 flex items-center gap-3">
            <Layers className="w-5 h-5 text-gold" />
            <h2 className="font-sans font-bold text-xs text-navy uppercase tracking-wider">
              Documentation Integrity Architecture
            </h2>
          </div>

          {/* Horizontal Process Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {[
              { step: '01', title: 'Ingest', desc: 'Receive exported casework documentation.' },
              { step: '02', title: 'Structure', desc: 'Map documented facts to supported terminology.' },
              { step: '03', title: 'Flag', desc: 'Identify missing or unsupported documentation.' },
              { step: '04', title: 'Trace', desc: 'Link structured outputs to their source text.' },
              { step: '05', title: 'Review', desc: 'Compile the results into a retrospective review package.' }
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
                  <span className="text-[10px] font-mono text-slate-600 uppercase tracking-wider font-bold block">
                    Source: {ref.org}
                  </span>
                  <h3 className="font-sans font-semibold text-[15px] text-navy tracking-tight leading-snug">
                    {ref.title}
                  </h3>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    {ref.purpose}
                  </p>
                </div>
                <div className="pt-4 border-t border-[#FAFAF8] mt-4 flex items-center justify-between text-[10px] font-semibold">
                  <span className="text-slate-600 font-mono uppercase tracking-wider text-[9px] font-bold">External Reference</span>
                  <a 
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#8B6420] font-bold hover:underline cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B6420] focus-visible:rounded px-1.5 py-0.5"
                    aria-label={`View documentation for ${ref.title}, opens in new tab`}
                  >
                    <span>View Reference</span>
                    <ExternalLink className="w-3 h-3" aria-hidden="true" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============ CONTACT / DUE DILIGENCE CTA ============ */}
        <section className="bg-gradient-to-br from-[#0F1E36] to-[#081529] border border-gold/15 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 text-left shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full filter blur-3xl pointer-events-none -mr-20 -mt-20" aria-hidden="true" />
          <div className="relative z-10 space-y-1">
            <h2 className="font-sans font-bold text-[22px] text-white tracking-tight">Need technical due-diligence documentation?</h2>
            <p className="text-[14px] text-slate-200 max-w-lg leading-relaxed">We provide complete architectural specifications, SOC 2 compliance roadmaps, and mutual BAA execution on request.</p>
          </div>
          <button
            type="button"
            onClick={() => {
              onViewChange('home');
              setTimeout(() => {
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 100);
            }}
            className="relative z-10 px-6 py-3 bg-[#8B6420] hover:bg-[#73531A] active:translate-y-0.5 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-150 whitespace-nowrap cursor-pointer border border-gold/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F1E36]"
          >
            Request Due Diligence Package
          </button>
        </section>

      </div>
    </div>
  );
}
