import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Layers, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ShieldCheck, 
  ArrowDownToLine, 
  ChevronRight,
  Database,
  Calendar,
  Building2,
  TrendingDown,
  Info,
  ExternalLink
} from 'lucide-react';
import { downloadCaseloadTemplate } from '../ExportUtils';

export interface BatchSampleEncounter {
  id: string;
  encounterId: string;
  dos: string; // Date of service
  providerAgency: string;
  staffCredential: 'CHW' | 'Peer Specialist' | 'Care Navigator' | 'Case Manager';
  rawExcerpt: string;
  durationMinutes: number;
  durationThresholdMet: boolean;
  domain: 'Food & Nutrition' | 'Housing & Shelter' | 'Utilities & Heat' | 'Medical Transportation' | 'Interpersonal Safety';
  mappedCode: string; // ICD-10 SDOH
  screeningInstrument: string | null;
  consentVerification: 'HIE Electronic' | 'Signed Paper Only' | 'Verbal Only' | 'Missing';
  consentCompliant: boolean;
  auditStatus: 'DEFENSIBLE' | 'CORRECTIVE_REVIEW_REQUIRED' | 'HIGH_DEFICIT_RISK';
  estimatedExposure: number; // Potential clawback / penalty if audited
  flaggedGaps: string[];
}

const BATCH_SAMPLE_RECORDS: BatchSampleEncounter[] = [
  {
    id: 'rec-102',
    encounterId: 'ENC-2025-0842',
    dos: '2025-04-04',
    providerAgency: 'Upstate Family Care Alliance',
    staffCredential: 'Peer Specialist',
    rawExcerpt: 'Follow-up for Mrs. Martinez. Gas heating shutoff notice with disconnect scheduled. Space heaters in unheated rooms. Submitted HEAP application.',
    durationMinutes: 10,
    durationThresholdMet: false,
    domain: 'Utilities & Heat',
    mappedCode: 'Z59.12 (Inadequate Utilities)',
    screeningInstrument: null,
    consentVerification: 'Verbal Only',
    consentCompliant: false,
    auditStatus: 'HIGH_DEFICIT_RISK',
    estimatedExposure: 260,
    flaggedGaps: [
      'Duration (10 mins) fails the 15-minute billing unit threshold.',
      'Verbal consent does not satisfy contemporaneous HIE verification requirement.',
      'Lacks structured utility security assessment instrument.'
    ]
  },
  {
    id: 'rec-103',
    encounterId: 'ENC-2025-0843',
    dos: '2025-04-05',
    providerAgency: 'Metropolitan Housing Support',
    staffCredential: 'Care Navigator',
    rawExcerpt: 'Administered standardized AHC HRSN screen for Mr. Chen. Verified transit barrier to oncology infusion and substandard mold in bedroom. Dispatched rideshare & tenant legal aid.',
    durationMinutes: 25,
    durationThresholdMet: true,
    domain: 'Medical Transportation',
    mappedCode: 'Z59.82 (Transit Barrier) + Z59.1',
    screeningInstrument: 'AHC HRSN (LOINC 96780-2)',
    consentVerification: 'HIE Electronic',
    consentCompliant: true,
    auditStatus: 'DEFENSIBLE',
    estimatedExposure: 0,
    flaggedGaps: []
  },
  {
    id: 'rec-105',
    encounterId: 'ENC-2025-0845',
    dos: '2025-04-09',
    providerAgency: 'Harbor Community Outreach',
    staffCredential: 'CHW',
    rawExcerpt: 'Client check-in. Provided bus tokens for job interview. No screening completed. Form signed on clipboard.',
    durationMinutes: 8,
    durationThresholdMet: false,
    domain: 'Medical Transportation',
    mappedCode: 'Unmapped (Non-Medical Transit)',
    screeningInstrument: null,
    consentVerification: 'Signed Paper Only',
    consentCompliant: false,
    auditStatus: 'HIGH_DEFICIT_RISK',
    estimatedExposure: 310,
    flaggedGaps: [
      'Encounter below duration threshold (8 mins).',
      'Purpose of transportation was non-medical and non-HRSN qualifying under 1115 waiver.',
      'Paper clipboard form lacks HIE network lock.'
    ]
  },
  {
    id: 'rec-106',
    encounterId: 'ENC-2025-0846',
    dos: '2025-04-11',
    providerAgency: 'Upstate Family Care Alliance',
    staffCredential: 'Care Navigator',
    rawExcerpt: 'Comprehensive PRAPARE assessment with Ms. Jackson. Food insecurity verified (Z59.41). Dispatched medically tailored meal delivery enrollment. Verified digital consent.',
    durationMinutes: 30,
    durationThresholdMet: true,
    domain: 'Food & Nutrition',
    mappedCode: 'Z59.41 (Food Insecurity)',
    screeningInstrument: 'PRAPARE (LOINC 93025-5)',
    consentVerification: 'HIE Electronic',
    consentCompliant: true,
    auditStatus: 'DEFENSIBLE',
    estimatedExposure: 0,
    flaggedGaps: []
  }
];

export default function BatchAuditSampling() {
  const [filterDomain, setFilterDomain] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedRecordId, setSelectedRecordId] = useState<string>('rec-102');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredRecords = BATCH_SAMPLE_RECORDS.filter(rec => {
    if (filterDomain !== 'ALL' && rec.domain !== filterDomain) return false;
    if (filterStatus !== 'ALL' && rec.auditStatus !== filterStatus) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        rec.encounterId.toLowerCase().includes(q) ||
        rec.providerAgency.toLowerCase().includes(q) ||
        rec.rawExcerpt.toLowerCase().includes(q) ||
        rec.mappedCode.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const selectedRecord = BATCH_SAMPLE_RECORDS.find(r => r.id === selectedRecordId) || BATCH_SAMPLE_RECORDS[0];

  // Summary Metrics (dynamically computed from BATCH_SAMPLE_RECORDS data source)
  const totalEncounters = BATCH_SAMPLE_RECORDS.length;
  const defensibleCount = BATCH_SAMPLE_RECORDS.filter(r => r.auditStatus === 'DEFENSIBLE').length;
  const reviewRequiredCount = BATCH_SAMPLE_RECORDS.filter(r => r.auditStatus === 'CORRECTIVE_REVIEW_REQUIRED').length;
  const highRiskCount = BATCH_SAMPLE_RECORDS.filter(r => r.auditStatus === 'HIGH_DEFICIT_RISK').length;
  const totalSampleExposure = BATCH_SAMPLE_RECORDS.reduce((acc, curr) => acc + curr.estimatedExposure, 0);
  const defensibilityRate = totalEncounters > 0 ? Math.round((defensibleCount / totalEncounters) * 100) : 0;

  return (
    <div className="space-y-8 text-left">
      {/* Overview Card: Batch Ingestion & 12-Month Lookback Sampling */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase font-bold text-gold bg-gold/10 px-2 py-0.5 rounded tracking-wider">
                BATCH EXPORT AUDIT SAMPLING
              </span>
              <span className="text-[11px] font-mono text-slate-500 inline-flex items-center gap-1">
                <span>12-Month Lookback Protocol (</span>
                <a
                  href="https://omig.ny.gov/compliance/compliance-regulations"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-0.5 text-gold hover:text-navy underline underline-offset-2 decoration-gold/40 hover:decoration-navy font-medium transition-colors"
                  title="Official NYS OMIG 18 NYCRR Part 521 Mandatory Compliance Regulations"
                >
                  <span>18 NYCRR Part 521</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
                <span>)</span>
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-sans font-bold text-navy">
              Cohort-Level Documentation Audit &amp; Gap Distribution
            </h3>
            <p className="text-sm text-slate-600 max-w-2xl">
              While the single-record viewer shows line-by-line span traceability, CCX executes <strong>batch sampling across thousands of retrospective encounters</strong> to triage audit defense priorities, quantify compliance exposure, and generate remediation queues.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => downloadCaseloadTemplate()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-navy font-sans text-xs font-semibold border border-slate-200 transition-colors cursor-pointer shadow-2xs"
              title="Download de-identified CSV batch ingestion specification"
            >
              <ArrowDownToLine className="w-3.5 h-3.5 text-gold" />
              <span>Download Ingestion Spec (.csv)</span>
            </button>
            <div className="px-3 py-2 rounded-lg bg-navy/5 border border-navy/10 text-xs font-mono text-navy font-semibold flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-navy/70" />
              <span>Synthetic Cohort: {totalEncounters} Encounters Sampled</span>
            </div>
          </div>
        </div>

        {/* Aggregate KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="bg-[#FAF8F5] border border-slate-200/80 rounded-xl p-3.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block mb-1">
              Sample Defensibility Rate
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-sans text-navy">
                {defensibilityRate}%
              </span>
              <span className="text-[11px] font-medium text-slate-500">
                ({defensibleCount}/{totalEncounters} sealed)
              </span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${defensibilityRate}%` }} />
            </div>
          </div>

          <div className="bg-[#FAF8F5] border border-slate-200/80 rounded-xl p-3.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-800 font-bold block mb-1">
              Corrective Review Queue
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-sans text-amber-800">
                {reviewRequiredCount}
              </span>
              <span className="text-[11px] font-medium text-slate-500">
                Recoverable gaps
              </span>
            </div>
            <span className="text-[10.5px] text-slate-600 block mt-1">
              E.g., Paper consent held at agency
            </span>
          </div>

          <div className="bg-[#FAF8F5] border border-slate-200/80 rounded-xl p-3.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-red-700 font-bold block mb-1">
              High Deficit Risk
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-sans text-red-700">
                {highRiskCount}
              </span>
              <span className="text-[11px] font-medium text-slate-500">
                Non-billable units
              </span>
            </div>
            <span className="text-[10.5px] text-slate-600 block mt-1">
              Duration / Eligibility failures
            </span>
          </div>

          <div className="bg-[#FAF8F5] border border-slate-200/80 rounded-xl p-3.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#8B6420] font-bold block mb-1">
              Estimated Audit Exposure
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-sans text-navy">
                ${totalSampleExposure.toLocaleString()}
              </span>
              <span className="text-[11px] font-medium text-red-600 font-mono">
                Sample total
              </span>
            </div>
            <span className="text-[10.5px] text-slate-600 block mt-1">
              Potential OMIG clawback basis
            </span>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mr-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Filter by:</span>
            </div>
            {/* Domain Filter */}
            <select
              value={filterDomain}
              onChange={(e) => setFilterDomain(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-sans font-medium text-navy focus:outline-none focus:ring-1 focus:ring-gold"
            >
              <option value="ALL">All Social Care Domains</option>
              <option value="Food & Nutrition">Food &amp; Nutrition</option>
              <option value="Housing & Shelter">Housing &amp; Shelter</option>
              <option value="Utilities & Heat">Utilities &amp; Heat</option>
              <option value="Medical Transportation">Medical Transportation</option>
            </select>

            {/* Audit Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-sans font-medium text-navy focus:outline-none focus:ring-1 focus:ring-gold"
            >
              <option value="ALL">All Audit Statuses</option>
              <option value="DEFENSIBLE">Defensible (Low Risk)</option>
              <option value="CORRECTIVE_REVIEW_REQUIRED">Corrective Review Required</option>
              <option value="HIGH_DEFICIT_RISK">High Deficit Risk</option>
            </select>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search encounter ID, agency, text..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64 pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gold placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Master-Detail Interactive Table */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-2">
          {/* Table List Column */}
          <div className="lg:col-span-7 border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="max-h-[460px] overflow-y-auto divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  No encounters match your active filters. Try resetting the domain or status filter.
                </div>
              ) : (
                filteredRecords.map((rec) => {
                  const isSelected = rec.id === selectedRecordId;
                  return (
                    <div
                      key={rec.id}
                      onClick={() => setSelectedRecordId(rec.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedRecordId(rec.id);
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      aria-label={`Select encounter ${rec.encounterId}`}
                      className={`p-3.5 transition-all text-left cursor-pointer flex flex-col gap-2 ${
                        isSelected 
                          ? 'bg-gold/5 border-l-4 border-l-gold border-y border-gold/20' 
                          : 'hover:bg-slate-50/80 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] font-bold text-navy">
                            {rec.encounterId}
                          </span>
                          <span className="text-[10px] text-slate-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {rec.dos}
                          </span>
                        </div>
                        <span className={`text-[9.5px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                          rec.auditStatus === 'DEFENSIBLE'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : rec.auditStatus === 'CORRECTIVE_REVIEW_REQUIRED'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-red-100 text-red-800 border border-red-300'
                        }`}>
                          {rec.auditStatus === 'DEFENSIBLE' ? 'Defensible' : rec.auditStatus === 'CORRECTIVE_REVIEW_REQUIRED' ? 'Review Needed' : 'High Deficit'}
                        </span>
                      </div>

                      <div className="text-[12px] text-slate-700 line-clamp-1 italic font-serif">
                        &ldquo;{rec.rawExcerpt}&rdquo;
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 text-[10.5px] text-slate-500 font-mono pt-1">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          {rec.providerAgency} ({rec.staffCredential})
                        </span>
                        <div className="flex items-center gap-3">
                          <span className={rec.durationThresholdMet ? 'text-emerald-700' : 'text-red-600 font-bold'}>
                            {rec.durationMinutes}m {rec.durationThresholdMet ? '✓' : '⚠️ <15m'}
                          </span>
                          <span className="font-semibold text-navy">
                            {rec.mappedCode.split(' ')[0]}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Showing {filteredRecords.length} of {BATCH_SAMPLE_RECORDS.length} records in review batch</span>
              <span className="font-mono text-[10px]">Click any row to view diagnostic audit package</span>
            </div>
          </div>

          {/* Record Audit Package Detail Column */}
          <div className="lg:col-span-5 bg-[#0B1F3A] text-white rounded-xl p-5 border border-white/10 space-y-4 shadow-md">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-wider text-gold font-bold block">
                  AUDIT REMEDIATION PACKAGE
                </span>
                <h4 className="font-mono text-sm font-bold text-white flex items-center gap-2">
                  <span>{selectedRecord.encounterId}</span>
                  <span className="text-[10px] font-sans font-normal text-white/70">
                    ({selectedRecord.domain})
                  </span>
                </h4>
              </div>
              <span className={`text-[9.5px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                selectedRecord.auditStatus === 'DEFENSIBLE'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : selectedRecord.auditStatus === 'CORRECTIVE_REVIEW_REQUIRED'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-red-500/20 text-red-300 border border-red-500/40'
              }`}>
                {selectedRecord.auditStatus}
              </span>
            </div>

            {/* Extracted Raw Excerpt */}
            <div className="space-y-1.5">
              <span className="text-[9.5px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                Raw Frontline EHR Narrative
              </span>
              <p className="text-xs text-slate-200 italic font-serif bg-white/[0.04] p-2.5 rounded-lg border border-white/10 leading-relaxed">
                &ldquo;{selectedRecord.rawExcerpt}&rdquo;
              </p>
            </div>

            {/* Structured Criteria Cross-Walk */}
            <div className="space-y-2 text-xs">
              <span className="text-[9.5px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1">
                <span>Audit Defense Checklist (</span>
                <a
                  href="https://omig.ny.gov/compliance/compliance-regulations"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-0.5 text-gold hover:text-white underline underline-offset-2 decoration-gold/40 hover:decoration-white font-medium transition-colors normal-case"
                  title="Official NYS OMIG 18 NYCRR Part 521 Mandatory Compliance Regulations"
                >
                  <span className="uppercase">18 NYCRR Part 521</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
                <span>)</span>
              </span>

              <div className="bg-white/[0.04] p-3 rounded-lg border border-white/10 space-y-2 font-mono text-[11px]">
                <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                  <span className="text-slate-400">Diagnosis Cross-Walk:</span>
                  <span className="text-emerald-300 font-semibold">{selectedRecord.mappedCode}</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                  <span className="text-slate-400">Contemporaneous Duration:</span>
                  <span className={selectedRecord.durationThresholdMet ? 'text-emerald-300 font-semibold' : 'text-red-400 font-bold'}>
                    {selectedRecord.durationMinutes} Minutes ({selectedRecord.durationThresholdMet ? 'Standard Met' : 'Under 15m Threshold'})
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                  <span className="text-slate-400">Screening Tool Administered:</span>
                  <span className={selectedRecord.screeningInstrument ? 'text-emerald-300' : 'text-amber-300 font-semibold'}>
                    {selectedRecord.screeningInstrument || 'None Logged (LOINC Withheld)'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Member Consent Evidence:</span>
                  <span className={selectedRecord.consentCompliant ? 'text-emerald-300 font-semibold' : 'text-amber-300 font-semibold'}>
                    {selectedRecord.consentVerification} {selectedRecord.consentCompliant ? '✓' : '⚠️ Non-HIE'}
                  </span>
                </div>
              </div>
            </div>

            {/* Flagged Deficits & Corrective Action */}
            <div className="space-y-2 text-xs">
              <span className="text-[9.5px] font-mono uppercase tracking-wider text-gold font-bold block">
                Deficits &amp; Recommended Action
              </span>

              {selectedRecord.flaggedGaps.length === 0 ? (
                <div className="bg-emerald-950/30 border border-emerald-500/30 p-3 rounded-lg text-emerald-200 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Encounter fully substantiated by source notes. Ready for sealed audit defense package.</span>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {selectedRecord.flaggedGaps.map((gap, idx) => (
                    <div key={idx} className="bg-amber-950/40 border border-amber-500/30 p-2 rounded text-[11px] text-amber-200 flex items-start gap-1.5 font-sans">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{gap}</span>
                    </div>
                  ))}
                  <div className="pt-2 text-[11px] text-slate-300 font-sans border-t border-white/10 mt-2">
                    <strong className="text-gold font-semibold">Remediation:</strong> Request corroborating digital attestation from {selectedRecord.providerAgency} before sealing next quarterly OMIG review file.
                  </div>
                </div>
              )}
            </div>

            {/* Estimated Financial Clawback Exposure */}
            <div className="p-3 bg-white/[0.04] rounded-lg border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 block">
                  Per-Claim Audit Exposure
                </span>
                <span className="text-xs text-white/80">
                  {selectedRecord.estimatedExposure === 0 ? 'Fully Defensible' : 'Unremediated Clawback Risk'}
                </span>
              </div>
              <span className={`text-base font-bold font-mono ${
                selectedRecord.estimatedExposure === 0 ? 'text-emerald-400' : 'text-red-400'
              }`}>
                ${selectedRecord.estimatedExposure}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
