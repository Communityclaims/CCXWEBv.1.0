import React, { useState, useEffect } from 'react';
import { 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle, 
  AlertTriangle,
  CornerDownRight,
  RefreshCw, 
  Download,
  FileSpreadsheet,
  FileText,
  ChevronRight, 
  Lock,
  Building,
  HeartHandshake,
  ShieldAlert,
  MapPin,
  ChevronDown,
  Send,
  Cpu,
  ExternalLink
} from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import ComplianceTrustCenter from './components/ComplianceTrustCenter';
import Resources from './components/Resources';
import CitationPopover from './components/CitationPopover';
import AboutCcx from './components/AboutCcx';
import AccessibilityStatement from './components/AccessibilityStatement';
import DocumentationGap from './components/DocumentationGap';

import HeroRecord from './components/HeroRecord';
import BatchAuditSampling from './components/BatchAuditSampling';
import NysMap from './components/NysMap';
import { SCN_REGIONS } from './data/regions';
import { downloadCaseloadTemplate, downloadDiagnosticBlueprint } from './ExportUtils';


// Predefined Scenario Presets for the Compliance Estimator
interface PilotScenarioPreset {
  id: string;
  name: string;
  badge: string;
  badgeColor: string;
  description: string;
  rawNote: string;
  riskLevel: 'HIGH' | 'MODERATE' | 'LOW';
  score: number;
  gaps: string[];
  correctiveAction: string;
}

const PILOT_SCENARIO_PRESETS: PilotScenarioPreset[] = [
  {
    id: 'unstructured_scribble',
    name: 'Unstructured Crisis Entry (Housing & Shelter)',
    badge: 'High Risk Deficit',
    badgeColor: 'bg-red-50 text-red-700 border-red-200/50',
    description: 'A raw casework text entry describing an acute housing crisis, containing factual basis for coding but lacking structured screening tools, formal eviction verification, and electronic consent.',
    rawNote: 'Intake interview with Mr. Henderson. Received 14-day notice of eviction for rental arrears; facing imminent displacement with two school-aged children. Initiated emergency shelter referral and submitted housing advocacy intake. Paper intake form signed in reception area. 15 mins.',
    riskLevel: 'HIGH',
    score: 20,
    gaps: [
      'Missing explicit ICD-10 SDOH classification codes in source export (e.g., Z59.811 Housing Instability, housed with risk of homelessness).',
      'Missing contemporaneous digital member consent verification on HIE network.',
      'Lacks structured housing screening questionnaire references (e.g., LOINC 71802-3).',
      'Lacks verifiable documentation of housing court notice or proof of entry-day signature lock.'
    ],
    correctiveAction: 'During retrospective review, CCX structures the verified housing instability diagnosis (ICD-10 Z59.811) and 15-minute duration directly from the frontline entry, while explicitly flagging the unverified paper consent and missing housing screening instrument before state audit review.'
  },
  {
    id: 'partial_referral',
    name: 'Partially Documented Referral (Interpersonal Safety & Crisis Support)',
    badge: 'Moderate Risk Deficit',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200/50',
    description: 'An encounter record documenting intimate partner safety concerns and an emergency protective shelter referral, but falling short on minimum duration thresholds and authenticated consent.',
    rawNote: 'Follow-up check-in with Ms. Lawson. Client reported escalating intimate partner safety crisis and requested confidential relocation support. Initiated referral to designated community domestic violence advocacy program and emergency safety planning. Consent flag checked in local tracker. Encounter duration: 10 mins.',
    riskLevel: 'MODERATE',
    score: 55,
    gaps: [
      'Documented encounter duration (10 mins) falls short of the required clinical billing threshold.',
      'Missing explicit contemporaneous member consent verification on HIE network (local tracker check only).',
      'Checklist entries lack corroborating clinical-narrative description required for retrospective audit defense.'
    ],
    correctiveAction: 'During retrospective review, CCX flags the duration and consent documentation gaps, structures the interpersonal safety finding from the available narrative, and produces an evidence-referenced finding for compliance review.'
  },
  {
    id: 'fully_standardized',
    name: 'Standardized Multi-Domain Record (Transportation & Housing)',
    badge: 'Low Risk Compliant',
    badgeColor: 'bg-gold/10 text-gold border-gold/20',
    description: 'A complete, standards-compliant record identified during retrospective review, validated, and securely sealed with source traceability.',
    rawNote: 'Administered standardized AHC HRSN screening for Mr. Chen. Verified ICD-10 Z59.82 (Transportation barrier to oncology clinic) and Z59.1 (Substandard living conditions). Dispatched medical rideshare voucher and tenant advocacy referral. Electronic HIE consent authenticated. Duration: 25 mins.',
    riskLevel: 'LOW',
    score: 98,
    gaps: [
      'None. Record is structured to align with current OMIG Audit Handbook guidance, billing compliance requirements, and applicable 6-to-10-year record retention mandates.'
    ],
    correctiveAction: 'CCX verifies this record, outputs a standard diagnostic record, and commits the comprehensive audit bundle to isolated, secure WORM storage.'
  }
];

export type AppView = 'home' | 'compliance-trust' | 'resources' | 'accessibility';

// Helper to initialize view from URL hash if present
const getInitialView = (): AppView => {
  if (typeof window !== 'undefined') {
    const hash = window.location.hash.replace(/^#/, '');
    if (hash === 'resources') return 'resources';
    if (hash === 'compliance-trust') return 'compliance-trust';
    if (hash === 'accessibility') return 'accessibility';
  }
  return 'home';
};

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('top');
  const [currentView, setCurrentView] = useState<AppView>(getInitialView);
  
  // SCN Map state
  const [selectedRegionKey, setSelectedRegionKey] = useState<string | null>(null);

  // Exposure Assessment & Gated Action state
  const [selectedPresetId, setSelectedPresetId] = useState<string>('unstructured_scribble');
  const [gatedAction, setGatedAction] = useState<'report' | 'assessment' | null>(null);
  const [gateEmail, setGateEmail] = useState('');
  const [gateOrg, setGateOrg] = useState('');
  const [gateEmailError, setGateEmailError] = useState<string | null>(null);
  const [gateSubmitted, setGateSubmitted] = useState(false);
  const [gateSubmitting, setGateSubmitting] = useState(false);

  // Form validation states
  const [contactEmailError, setContactEmailError] = useState<string | null>(null);

  // Contact state
  const [contactName, setContactName] = useState('');
  const [contactOrg, setContactOrg] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactSubmitting, setContactSubmitting] = useState(false);

  // Synchronized state for citation popovers and footnotes
  const [isCitation1Open, setIsCitation1Open] = useState(false);
  const [isCitation2Open, setIsCitation2Open] = useState(false);

  useEffect(() => {
    const handleStateChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ id: string; isOpen: boolean }>;
      if (customEvent.detail?.id === 'hero-omig-workplan') {
        setIsCitation1Open(customEvent.detail.isOpen);
      } else if (customEvent.detail?.id === 'contact-fast-help-citation') {
        setIsCitation2Open(customEvent.detail.isOpen);
      }
    };

    window.addEventListener('citation-state-changed', handleStateChange);
    return () => {
      window.removeEventListener('citation-state-changed', handleStateChange);
    };
  }, []);

  // Scroll spy to update active navigation item
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;
      const sections = [
        'top',
        'review-scenario',
        'assessment',
        'problem',
        'produces',
        'system-boundaries',
        'regional-context',
        'who-benefits',
        'exposure-review',
        'compliance-guardrails',
        'about-ccx',
        'contact'
      ];
      
      let currentSection = 'top';
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            currentSection = section;
            break;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Listen for hash changes to support direct URL fragment routing (e.g., #resources)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#/, '');
      if (hash === 'resources') {
        setCurrentView('resources');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (hash === 'compliance-trust') {
        setCurrentView('compliance-trust');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (hash === 'accessibility') {
        setCurrentView('accessibility');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else {
        setCurrentView('home');
        if (hash) {
          setTimeout(() => {
            const element = document.getElementById(hash);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 100);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleViewChange = (view: AppView) => {
    setCurrentView(view);
    if (view === 'resources' || view === 'compliance-trust' || view === 'accessibility') {
      if (window.location.hash !== '#' + view) {
        window.location.hash = view;
      }
    } else {
      if (window.location.hash === '#resources' || window.location.hash === '#compliance-trust' || window.location.hash === '#accessibility') {
        history.pushState(null, '', window.location.pathname + window.location.search);
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Handle Preset Selection (instant switch with zero form fields)
  const handlePresetSelect = (id: string) => {
    setSelectedPresetId(id);
    setGateSubmitted(false);
  };

  // Download de-identified caseload template (.csv)
  const handleDownloadTemplate = () => {
    downloadCaseloadTemplate();
  };

  // Download Diagnostic Blueprint Report (.txt)
  const handleDownloadBlueprint = () => {
    const activePreset = PILOT_SCENARIO_PRESETS.find(p => p.id === selectedPresetId) || PILOT_SCENARIO_PRESETS[0];
    downloadDiagnosticBlueprint(activePreset);
  };

  // Helper to dynamically resolve target recipient email from environment variables
  const getRecipientEmail = () => import.meta.env.VITE_INQUIRY_RECIPIENT_EMAIL || 'alison@ccxny.org';

  // Handle Gated Value Action Submission (Report download or Live Assessment request)
  const handleGateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGateEmailError(null);

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!gateEmail) {
      setGateEmailError('Work email is required.');
      return;
    }
    if (!emailPattern.test(gateEmail)) {
      setGateEmailError('Please enter a valid work email address (e.g., name@institution.org).');
      return;
    }

    setGateSubmitting(true);
    const activePreset = PILOT_SCENARIO_PRESETS.find(p => p.id === selectedPresetId) || PILOT_SCENARIO_PRESETS[0];

    // If downloading blueprint report, trigger direct download immediately
    if (gatedAction === 'report') {
      handleDownloadBlueprint();
    }

    try {
      // Dynamically resolve recipient email from environment variable before POST
      const envRecipient = import.meta.env.VITE_INQUIRY_RECIPIENT_EMAIL;
      const recipientEmail = getRecipientEmail();
      console.log('[handleGateSubmit] Environment variable VITE_INQUIRY_RECIPIENT_EMAIL loaded:', envRecipient);
      console.log('[handleGateSubmit] Resolved recipient email for POST request:', recipientEmail);
      console.log('[handleGateSubmit] Initiating fetch POST /api/inquiry with payload recipient:', recipientEmail);

      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipient: recipientEmail,
          name: gateOrg ? `SCN Lead / Compliance Team (${gateOrg})` : 'SCN Compliance Reviewer',
          email: gateEmail,
          org: gateOrg || 'Independent SCN / CMA Partner',
          focus: gatedAction === 'assessment' ? 'Live Caseload Assessment & BAA Request' : 'Audit Defense Blueprint Download',
          message: `Action requested: ${gatedAction === 'assessment' ? 'Live Caseload Retrospective Assessment under BAA' : 'Audit Defense Blueprint PDF Dispatch'}.\nScenario explored: ${activePreset.name} (${activePreset.riskLevel} risk).\nIdentified Gaps:\n${activePreset.gaps.join('\n')}\n\nCorrective Action Recommendation:\n${activePreset.correctiveAction}`
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        console.error('[CCX Gated Submission Error]', errData);
      }
      setGateSubmitted(true);
    } catch (err) {
      console.error('[CCX Gated Submission Network Error]', err);
      setGateSubmitted(true);
    } finally {
      setGateSubmitting(false);
    }
  };

  // Handle Contact / Inquiry Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous error state
    setContactEmailError(null);

    // Email pattern validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!contactEmail) {
      setContactEmailError('Work email is required.');
      return;
    }
    if (!emailPattern.test(contactEmail)) {
      setContactEmailError('Please enter a valid work email address (e.g., jdoe@institution.org).');
      return;
    }

    setContactSubmitting(true);
    try {
      // Dynamically resolve recipient email from environment variable before POST
      const envRecipient = import.meta.env.VITE_INQUIRY_RECIPIENT_EMAIL;
      const recipientEmail = getRecipientEmail();
      console.log('[handleSubmit] Environment variable VITE_INQUIRY_RECIPIENT_EMAIL loaded:', envRecipient);
      console.log('[handleSubmit] Resolved recipient email for POST request:', recipientEmail);
      console.log('[handleSubmit] Initiating fetch POST /api/inquiry with payload recipient:', recipientEmail);

      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipient: recipientEmail,
          name: contactName || 'De-identified Contact Request',
          email: contactEmail,
          org: contactOrg || 'Independent SCN Partner',
          organization: contactOrg || 'Independent SCN Partner',
          focus: 'SCN Regional Lead',
          message: contactMessage || 'Requested a custom regional risk modeling briefing.',
          briefingRequirements: contactMessage || 'Requested a custom regional risk modeling briefing.'
        }),
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        console.error('[CCX Contact Error]', errData);
      }
    } catch (err) {
      console.error('[CCX Contact Network Error]', err);
    } finally {
      setContactSubmitting(false);
      setContactSubmitted(true);
    }
  };

  // Backwards-compatible alias for contact form submission
  const handleContactSubmit = handleSubmit;

  const activePreset = PILOT_SCENARIO_PRESETS.find(p => p.id === selectedPresetId) || PILOT_SCENARIO_PRESETS[0];

  return (
    <div className="min-h-screen bg-off-white text-navy selection:bg-gold/30 selection:text-navy font-sans antialiased">
      {/* Sticky Header */}
      <Header 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
        currentView={currentView}
        onViewChange={handleViewChange}
      />

      {currentView === 'compliance-trust' ? (
        <main id="main-content" className="focus:outline-none" tabIndex={-1}>
          <ComplianceTrustCenter onViewChange={handleViewChange} />
        </main>
      ) : currentView === 'resources' ? (
        <main id="main-content" className="focus:outline-none" tabIndex={-1}>
          <Resources onViewChange={handleViewChange} />
        </main>
      ) : currentView === 'accessibility' ? (
        <AccessibilityStatement onViewChange={handleViewChange} />
      ) : (
        <main id="main-content" className="focus:outline-none" tabIndex={-1}>
        {/* ==================== 1. HERO SECTION ==================== */}
      <section id="top" className="bg-[#FAF8F5] pt-20 pb-24 md:pt-28 md:pb-36 border-b border-[#0F172A]/[0.05] relative overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        
        <div className="max-w-[1120px] mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* LEFT COLUMN - EXECUTIVE SUMMARY */}
            <div className="lg:col-span-7 text-left">
              <div className="flex flex-wrap items-center gap-2.5 mb-3">
                <span className="text-[11.5px] font-sans font-bold text-gold tracking-[0.08em] uppercase">
                  AVAILABLE TODAY
                </span>
              </div>
              
              <h1 className="text-[34px] md:text-[42px] lg:text-[48px] font-sans font-bold text-[#0B1F3A] leading-[1.08] tracking-[-0.03em] mt-2">
                Documentation for Medicaid review.
              </h1>

              <p className="text-[17px] sm:text-[18px] font-normal text-slate-600 leading-[29px] sm:leading-[30px] max-w-[640px] mt-5">
                CCX provides retrospective documentation structuring, terminology and code cross-walking, source traceability, documentation gap flagging, and retrospective review-package compilation for Medicaid social care records. Working from exported encounter notes and claims data, CCX reviews documentation claim by claim to identify supported findings and documentation gaps for compliance teams.
              </p>

              <p className="text-[15.5px] font-normal text-slate-600 leading-[26px] max-w-[640px] mt-3">
                CCX works from exported records and fits into existing documentation workflows without changing frontline casework intake.
              </p>

              {/* Source Verification Footnote Indicator */}
              <div className="mt-4 p-3 bg-white/90 border border-slate-200/90 rounded-xl flex flex-wrap items-center justify-between gap-3 text-[11.5px] font-mono shadow-2xs">
                <div className="flex flex-wrap items-center gap-2 text-slate-600">
                  <CitationPopover
                    id="hero-omig-workplan"
                    citationNumber={1}
                    badge="NYS REGULATORY SOURCE"
                    title="NYS OMIG Annual Work Plan: Bureau of Compliance"
                    subtitle="18 NYCRR Part 521 (§ 521-1.3 & § 521-1.4: Mandatory Compliance Program Requirements)"
                    sourceName="New York State Office of the Medicaid Inspector General (OMIG)"
                    details={[
                      "Review Lookback Window: Under OMIG's updated Compliance Program Review (CPR) protocol, effective for reviews initiated on or after July 1, 2025 and active through 2026, OMIG expanded the mandatory review lookback period from the historical 3 months to 12 consecutive months.",
                      "Review Targets: In its Annual Work Plan, OMIG's Bureau of Compliance established an annual target of approximately 200 comprehensive compliance program effectiveness reviews.",
                      "Statutory Payment Condition: Under NY Social Services Law § 363-d and 18 NYCRR § 521-1.1(c), maintenance of an effective compliance program satisfying all statutory elements is an explicit statutory condition of Medicaid payment, not mere paperwork."
                    ]}
                    links={[
                      {
                        label: "OMIG Compliance Program Review Protocols & Module (12-Mo. Window)",
                        url: "https://omig.ny.gov/compliance/compliance-library"
                      },
                      {
                        label: "OMIG Annual Work Plans & Priority Areas",
                        url: "https://omig.ny.gov/information-resources/work-plan"
                      },
                      {
                        label: "18 NYCRR Part 521 Mandatory Compliance Regulations",
                        url: "https://omig.ny.gov/compliance/compliance-regulations"
                      }
                    ]}
                  >
                    <span
                      id="button-hero-omig-citation"
                      className="font-bold text-gold hover:text-navy px-1.5 py-0.5 bg-gold/15 hover:bg-gold/25 border border-gold/40 rounded text-[10px] cursor-pointer transition-colors inline-block"
                      title="Click or tap to inspect verified primary source citation"
                      aria-label="Citation [1]: NYS OMIG Annual Work Plan · 18 NYCRR Part 521"
                    >
                      [1]
                    </span>
                  </CitationPopover>
                  <span className="font-sans font-semibold text-navy">Regulatory Source:</span>
                  <span className="font-sans text-slate-600 inline-flex items-center gap-1 flex-wrap">
                    <span>NYS OMIG Annual Work Plan ·</span>
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
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <a
                    href="https://omig.ny.gov/compliance/compliance-library"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-gold hover:text-navy underline underline-offset-2 decoration-gold/40 hover:decoration-navy font-sans font-medium transition-colors"
                    title="Primary OMIG Compliance Program Review Protocols & 12-Month Review Scope"
                  >
                    <span>Read OMIG Review Protocols</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <span className="text-slate-300">·</span>
                  <a
                    href="https://omig.ny.gov/information-resources/work-plan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-gold hover:text-navy underline underline-offset-2 decoration-gold/40 hover:decoration-navy font-sans font-medium transition-colors"
                    title="Official NYS OMIG Annual Work Plan Portal"
                  >
                    <span>OMIG Work Plan Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex flex-col sm:flex-row gap-3.5 items-start mt-6">
                <a 
                  href="#review-scenario" 
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('review-scenario')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="bg-gold hover:bg-[#5E3E08] text-white px-6 py-3.5 rounded-lg font-sans text-[15.5px] font-semibold transition-colors duration-150 inline-block text-center cursor-pointer shadow-sm border border-transparent"
                >
                  Explore Batch Audit Sampling
                </a>
                <a 
                  href="#assessment" 
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('assessment')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="bg-transparent border border-gold text-gold hover:bg-gold/5 px-6 py-3.5 rounded-lg font-sans text-[15.5px] font-semibold transition-colors duration-150 inline-block text-center cursor-pointer shadow-xs"
                >
                  View Assessment Overview
                </a>
              </div>
            </div>

            {/* RIGHT COLUMN - VISUAL ANCHOR */}
            <div className="lg:col-span-5 flex flex-col items-center lg:items-end gap-2">
              <HeroRecord />
            </div>

          </div>
        </div>
      </section>

      {/* ==================== 2. BATCH AUDIT SAMPLING & LOOKBACK COHORT ==================== */}
      <section id="review-scenario" className="py-24 md:py-32 bg-off-white border-b border-[#0F172A]/[0.05]">
        <div id="transformation-example" className="relative -top-24" />
        <div className="max-w-[1120px] mx-auto px-6 text-left space-y-10">
          
          <div className="space-y-3 max-w-[780px]">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-sans text-[12px] text-[#8B6420] uppercase font-semibold tracking-[0.08em]">
                COHORT AUDIT DEFENSE
              </span>
              <span className="font-mono text-[9px] text-[#8B6420] bg-gold/10 px-2 py-0.5 rounded font-bold uppercase tracking-widest">
                Batch Export Sampling
              </span>
            </div>
            <h2 className="font-sans font-bold text-[36px] text-navy tracking-tight leading-tight">
              Cohort-level audit sampling &amp; remediation
            </h2>
            <p className="text-[16px] font-normal text-slate-600 leading-[28px]">
              Beyond individual casework notes, CCX evaluates batch encounter exports across 12-month lookback cohorts. It automatically identifies defensible claims, surfaces recoverable documentation gaps, and estimates potential OMIG clawback exposure before state submission.
            </p>
          </div>

          {/* Interactive Batch Audit Sampling & Remediated Records HUD */}
          <BatchAuditSampling />

        </div>
      </section>

      {/* ==================== 3. ASSESSMENT ==================== */}
      <section id="assessment" className="py-24 md:py-32 bg-white border-b border-[#0F172A]/[0.05]">
        <div id="what-we-deliver" className="relative -top-24" />
        <div className="max-w-[1120px] mx-auto px-6 text-left space-y-12">
          
          <div className="space-y-3 max-w-[720px]">
            <span className="font-sans text-[12px] text-[#8B6420] uppercase font-semibold tracking-[0.08em]">
              ASSESSMENT
            </span>
            <h2 className="font-sans font-bold text-[36px] text-navy tracking-tight leading-tight">
              Assessment overview
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Customer Provides */}
            <div className="bg-[#FAF9F6] p-6 rounded-xl border border-[#0F172A]/[0.06] shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2.5">
                <h3 className="font-sans font-semibold text-[19px] text-navy tracking-tight leading-snug">
                  What the customer provides
                </h3>
                <p className="text-[15px] font-normal text-slate-600 leading-[25px]">
                  Claims, remittance data, and supporting documentation.
                </p>
              </div>
            </div>

            {/* CCX Reviews */}
            <div className="bg-[#FAF9F6] p-6 rounded-xl border border-[#0F172A]/[0.06] shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2.5">
                <h3 className="font-sans font-semibold text-[19px] text-navy tracking-tight leading-snug">
                  What CCX reviews
                </h3>
                <p className="text-[15px] font-normal text-slate-600 leading-[25px]">
                  Building on that review process, submitted records are evaluated claim by claim against defined documentation and terminology rules.
                </p>
              </div>
            </div>

            {/* Customer Receives */}
            <div className="bg-[#FAF9F6] p-6 rounded-xl border border-[#0F172A]/[0.06] shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2.5">
                <h3 className="font-sans font-semibold text-[19px] text-navy tracking-tight leading-snug">
                  What the customer receives
                </h3>
                <p className="text-[15px] font-normal text-slate-600 leading-[25px]">
                  A reproducible review package showing supported claims, documentation gaps, and items requiring further review.
                </p>
              </div>
            </div>

            {/* Commercial Model */}
            <div className="bg-[#FAF9F6] p-6 rounded-xl border border-[#0F172A]/[0.06] shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2.5">
                <h3 className="font-sans font-semibold text-[19px] text-navy tracking-tight leading-snug">
                  Commercial model
                </h3>
                <p className="text-[15px] font-normal text-slate-600 leading-[25px]">
                  Fixed fee based on the defined assessment or review matter.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ==================== 3. THE DOCUMENTATION GAP ==================== */}
      <DocumentationGap 
        onNavigateToSection={(id) => {
          setActiveSection(id);
          const el = document.getElementById(id);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }}
      />

      {/* ==================== 4. WHAT CCX PRODUCES & PLANNED CAPABILITIES ==================== */}
      <section id="produces" className="py-24 md:py-32 bg-off-white border-b border-[#0F172A]/[0.05] scroll-mt-20">
        <div className="max-w-[1120px] mx-auto px-6 text-left space-y-16">
          
          {/* Sub-section A: WHAT CCX PRODUCES */}
          <div className="space-y-8">
            <div className="space-y-4 max-w-[760px]">
              <span className="font-sans text-[12px] text-[#8B6420] uppercase font-semibold tracking-[0.08em] block">
                WHAT CCX PRODUCES
              </span>
              <h2 className="font-sans font-bold text-[36px] text-navy tracking-tight leading-tight">
                What CCX produces
              </h2>
              <p className="text-[18px] font-semibold text-navy leading-[28px]">
                Turn existing casework documentation into structured review packages.
              </p>
              <p className="text-[16px] font-normal text-slate-600 leading-[28px]">
                Building on that structuring process, this section covers the core deliverables generated for compliance review.
              </p>
              <p className="text-[16px] font-semibold text-navy leading-[26px]">
                No frontline workflow changes. No rewriting of the source record.
              </p>
            </div>

            {/* Production Capabilities Grid: 5 items */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Card 1: RETROSPECTIVE DOCUMENTATION STRUCTURING */}
              <div id="capability-doc-structuring" className="bg-white p-6 sm:p-7 rounded-xl border border-[#0F172A]/[0.08] shadow-xs space-y-3 flex flex-col justify-between hover:border-gold/40 transition-colors">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-gold font-bold text-xs tracking-wider">01:</span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200/60">Ships Today</span>
                  </div>
                  <h3 className="font-sans font-bold text-[16px] text-navy tracking-tight leading-snug">
                    RETROSPECTIVE DOCUMENTATION STRUCTURING
                  </h3>
                  <p className="text-[14px] font-normal text-slate-600 leading-[24px]">
                    Parses exported casework encounter notes into standard discrete fields without altering source documentation records.
                  </p>
                </div>
              </div>

              {/* Card 2: TERMINOLOGY & CODE CROSS-WALKING */}
              <div id="capability-terminology-crosswalk" className="bg-white p-6 sm:p-7 rounded-xl border border-[#0F172A]/[0.08] shadow-xs space-y-3 flex flex-col justify-between hover:border-gold/40 transition-colors">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-gold font-bold text-xs tracking-wider">02:</span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200/60">Ships Today</span>
                  </div>
                  <h3 className="font-sans font-bold text-[16px] text-navy tracking-tight leading-snug">
                    TERMINOLOGY &amp; CODE CROSS-WALKING
                  </h3>
                  <p className="text-[14px] font-normal text-slate-600 leading-[24px]">
                    Cross-references documented social care needs to standardized ICD-10 SDOH codes and LOINC screening identifiers.
                  </p>
                </div>
              </div>

              {/* Card 3: SOURCE TRACEABILITY */}
              <div id="capability-source-traceability" className="bg-white p-6 sm:p-7 rounded-xl border border-[#0F172A]/[0.08] shadow-xs space-y-3 flex flex-col justify-between hover:border-gold/40 transition-colors">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-gold font-bold text-xs tracking-wider">03:</span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200/60">Ships Today</span>
                  </div>
                  <h3 className="font-sans font-bold text-[16px] text-navy tracking-tight leading-snug">
                    SOURCE TRACEABILITY
                  </h3>
                  <p className="text-[14px] font-normal text-slate-600 leading-[24px]">
                    Anchors structured findings directly to exact supporting text in source casework notes to verify provenance.
                  </p>
                </div>
              </div>

              {/* Card 4: DOCUMENTATION GAP FLAGGING */}
              <div id="capability-gap-flagging" className="bg-white p-6 sm:p-7 rounded-xl border border-[#0F172A]/[0.08] shadow-xs space-y-3 flex flex-col justify-between hover:border-gold/40 transition-colors">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-gold font-bold text-xs tracking-wider">04:</span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200/60">Ships Today</span>
                  </div>
                  <h3 className="font-sans font-bold text-[16px] text-navy tracking-tight leading-snug">
                    DOCUMENTATION GAP FLAGGING
                  </h3>
                  <p className="text-[14px] font-normal text-slate-600 leading-[24px]">
                    Identifies missing, incomplete, or unsupported documentation elements required for compliance review, including duration and consent.
                  </p>
                </div>
              </div>

              {/* Card 5: RETROSPECTIVE REVIEW PACKAGES */}
              <div id="capability-retrospective-review" className="bg-white p-6 sm:p-7 rounded-xl border border-[#0F172A]/[0.08] shadow-xs space-y-3 flex flex-col justify-between hover:border-gold/40 transition-colors">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-gold font-bold text-xs tracking-wider">05:</span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200/60">Ships Today</span>
                  </div>
                  <h3 className="font-sans font-bold text-[16px] text-navy tracking-tight leading-snug">
                    RETROSPECTIVE REVIEW-PACKAGE COMPILATION
                  </h3>
                  <p className="text-[14px] font-normal text-slate-600 leading-[24px]">
                    Generates indexed, exportable structured documentation packages prepared for internal compliance audits and review defense.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sub-section B: PLANNED CAPABILITIES */}
          <div id="planned-capabilities" className="pt-10 border-t border-slate-200/80 space-y-8">
            <div className="space-y-3 max-w-[760px]">
              <div className="flex items-center gap-2">
                <span className="font-sans text-[12px] text-slate-500 uppercase font-semibold tracking-[0.08em] block">
                  PLANNED CAPABILITIES
                </span>
                <span className="text-[10.5px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold border border-slate-300/70">
                  In Design
                </span>
              </div>
              <h3 className="font-sans font-bold text-[28px] text-navy tracking-tight leading-snug">
                Planned capabilities
              </h3>
              <p className="text-[15px] font-normal text-slate-600 leading-[25px]">
                The following capabilities are planned for future releases and are not currently available in production. CCX does not provide release dates or timeline commitments.
              </p>
            </div>

            {/* Planned Capabilities Grid: 4 concise items */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Item 1: PRE-SUBMISSION COMPLETENESS */}
              <div id="planned-pre-submission" className="bg-slate-50/70 p-6 sm:p-7 rounded-xl border border-dashed border-slate-300 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-slate-400 font-bold text-xs uppercase tracking-wider">Planned</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200/70 text-slate-600 font-medium">Under Design</span>
                  </div>
                  <h4 className="font-sans font-bold text-[15px] text-navy tracking-tight leading-snug">
                    PRE-SUBMISSION COMPLETENESS
                  </h4>
                  <p className="text-[14px] font-normal text-slate-600 leading-[22px]">
                    Identify documentation gaps before submission.
                  </p>
                </div>
              </div>

              {/* Item 2: DENIAL ANALYTICS */}
              <div id="planned-denial-analytics" className="bg-slate-50/70 p-6 sm:p-7 rounded-xl border border-dashed border-slate-300 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-slate-400 font-bold text-xs uppercase tracking-wider">Planned</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200/70 text-slate-600 font-medium">Under Design</span>
                  </div>
                  <h4 className="font-sans font-bold text-[15px] text-navy tracking-tight leading-snug">
                    DENIAL ANALYTICS
                  </h4>
                  <p className="text-[14px] font-normal text-slate-600 leading-[22px]">
                    Identify recurring documentation patterns associated with denials.
                  </p>
                </div>
              </div>

              {/* Item 3: EXPOSURE MODELING */}
              <div id="planned-exposure-modeling" className="bg-slate-50/70 p-6 sm:p-7 rounded-xl border border-dashed border-slate-300 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-slate-400 font-bold text-xs uppercase tracking-wider">Planned</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200/70 text-slate-600 font-medium">Under Design</span>
                  </div>
                  <h4 className="font-sans font-bold text-[15px] text-navy tracking-tight leading-snug">
                    EXPOSURE MODELING
                  </h4>
                  <p className="text-[14px] font-normal text-slate-600 leading-[22px]">
                    Estimate potential financial exposure from sampled documentation.
                  </p>
                </div>
              </div>

              {/* Item 4: NETWORK REPORTING */}
              <div id="planned-network-reporting" className="bg-slate-50/70 p-6 sm:p-7 rounded-xl border border-dashed border-slate-300 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-slate-400 font-bold text-xs uppercase tracking-wider">Planned</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200/70 text-slate-600 font-medium">Under Design</span>
                  </div>
                  <h4 className="font-sans font-bold text-[15px] text-navy tracking-tight leading-snug">
                    NETWORK REPORTING
                  </h4>
                  <p className="text-[14px] font-normal text-slate-600 leading-[22px]">
                    Surface documentation patterns across participating organizations.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA: Request Documentation Exposure Assessment */}
          <div className="pt-2">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-navy hover:bg-[#1E293B] text-white text-sm font-semibold rounded-xl transition-colors shadow-xs cursor-pointer"
            >
              <span>Request a Documentation Exposure Assessment</span>
              <ArrowRight className="w-4 h-4 text-gold" />
            </a>
          </div>

        </div>
      </section>

      {/* ==================== 7. SYSTEM BOUNDARIES ==================== */}
      <section id="system-boundaries" className="py-24 md:py-32 bg-off-white border-b border-[#0F172A]/[0.05]">
        <div className="max-w-[1120px] mx-auto px-6 text-left space-y-10">
          
          <div className="space-y-3 max-w-[800px]">
            <span className="font-sans text-[12px] text-[#8B6420] uppercase font-semibold tracking-[0.08em] block">
              SYSTEM BOUNDARIES
            </span>
            <h2 className="font-sans font-bold text-[32px] sm:text-[38px] text-navy tracking-tight leading-tight">
              System Boundaries &amp; Governance
            </h2>
            <p className="text-[17px] sm:text-[18px] font-normal text-slate-700 leading-[28px] sm:leading-[30px]">
              A clear operational boundary separates automated documentation structuring from human-governed decision authority. CCX prepares verifiable evidence; clinical, billing, and compliance decisions remain with authorized professionals.
            </p>
          </div>

          {/* Balanced Two-Column Responsibility Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch text-left">
            {/* Column 1: What CCX Structuring Does */}
            <div id="boundaries-ccx-structuring" className="bg-white border border-[#E2E8F0] rounded-2xl p-7 md:p-8 space-y-6 flex flex-col justify-between shadow-xs">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
                    <h3 className="font-sans font-bold text-sm text-navy uppercase tracking-wider">
                      What CCX Structuring Does
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-200/80">
                    Automated Traceability
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 pt-1">
                  <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/60 space-y-1">
                    <h4 className="font-sans font-bold text-sm text-navy">
                      Retrospective Documentation Structuring
                    </h4>
                    <p className="text-[14px] text-slate-600 leading-relaxed font-normal">
                      Parses exported casework encounter notes into standard discrete fields without altering source documentation records.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/60 space-y-1">
                    <h4 className="font-sans font-bold text-sm text-navy">
                      Terminology &amp; Code Cross-Walking
                    </h4>
                    <p className="text-[14px] text-slate-600 leading-relaxed font-normal">
                      Cross-references documented social care needs to standardized ICD-10 SDOH codes and LOINC screening identifiers.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/60 space-y-1">
                    <h4 className="font-sans font-bold text-sm text-navy">
                      Source Traceability
                    </h4>
                    <p className="text-[14px] text-slate-600 leading-relaxed font-normal">
                      Anchors structured findings directly to exact supporting text in source casework notes to verify provenance.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/60 space-y-1">
                    <h4 className="font-sans font-bold text-sm text-navy">
                      Documentation Gap Flagging
                    </h4>
                    <p className="text-[14px] text-slate-600 leading-relaxed font-normal">
                      Identifies missing, incomplete, or unsupported documentation elements required for compliance review, including duration and consent.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/60 space-y-1">
                    <h4 className="font-sans font-bold text-sm text-navy">
                      Retrospective Review-Package Compilation
                    </h4>
                    <p className="text-[14px] text-slate-600 leading-relaxed font-normal">
                      Generates indexed, exportable structured documentation packages prepared for internal compliance audits and review defense.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 text-[12px] font-mono text-slate-500">
                Scope: Automated execution of the structuring process referenced above.
              </div>
            </div>

            {/* Column 2: Human Review Requirements */}
            <div id="boundaries-human-review" className="bg-white border border-[#E2E8F0] rounded-2xl p-7 md:p-8 space-y-6 flex flex-col justify-between shadow-xs">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#8B6420] shrink-0" />
                    <h3 className="font-sans font-bold text-sm text-navy uppercase tracking-wider">
                      Human Review Requirements
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-gold/10 text-[#8B6420] font-bold border border-gold/20">
                    Professional Oversight
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 pt-1">
                  <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-slate-200/70 space-y-1">
                    <h4 className="font-sans font-bold text-sm text-navy">
                      Clinical Judgment &amp; Care Validation
                    </h4>
                    <p className="text-[14px] text-slate-600 leading-relaxed font-normal">
                      Licensed clinicians evaluate medical necessity, appropriateness of interventions, and clinical continuity across provider handoffs.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-slate-200/70 space-y-1">
                    <h4 className="font-sans font-bold text-sm text-navy">
                      Frontline Practice &amp; EHR Workflow
                    </h4>
                    <p className="text-[14px] text-slate-600 leading-relaxed font-normal">
                      Care coordinators and agency staff maintain direct member relationships and record contemporaneous notes in their primary EHRs.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-slate-200/70 space-y-1">
                    <h4 className="font-sans font-bold text-sm text-navy">
                      Billing Submission &amp; Attestation
                    </h4>
                    <p className="text-[14px] text-slate-600 leading-relaxed font-normal">
                      Revenue cycle and compliance officers decide whether each encounter meets submission criteria and authorize final claim releases.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-slate-200/70 space-y-1">
                    <h4 className="font-sans font-bold text-sm text-navy">
                      Documentation Gap Remediation
                    </h4>
                    <p className="text-[14px] text-slate-600 leading-relaxed font-normal">
                      Agency supervisors address flagged deficits by obtaining contemporaneous addenda or gathering missing attestation records.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-slate-200/70 space-y-1">
                    <h4 className="font-sans font-bold text-sm text-navy">
                      Consent Governance &amp; HIE Attestation
                    </h4>
                    <p className="text-[14px] text-slate-600 leading-relaxed font-normal">
                      Privacy officers verify that member consent forms conform to regional SHIN-NY policies and state privacy standards.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 text-[12px] font-mono text-slate-500">
                Scope: Professional evaluation, compliance authorization, and regulatory accountability.
              </div>
            </div>
          </div>

          {/* Collaborative Governance Statement */}
          <div className="p-5 md:p-6 bg-white border border-[#E2E8F0] rounded-xl text-left shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1 max-w-3xl">
              <span className="font-mono text-[10px] font-bold text-[#8B6420] uppercase tracking-wider block">
                COMPLIANCE ARCHITECTURE
              </span>
              <p className="text-[15px] sm:text-[15.5px] text-slate-700 leading-relaxed font-normal">
                By combining reproducible algorithmic verification with licensed human decision-making, CCX delivers audit-defensible documentation while ensuring all clinical, billing, and regulatory decisions remain with authorized personnel.
              </p>
            </div>
            <div className="shrink-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-mono font-semibold text-navy">
                Human-in-the-Loop Governance
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* ==================== 9. REGIONAL CONTEXT ==================== */}
      <section id="regional-context" className="py-24 md:py-32 bg-white border-b border-[#E5E7EB]">
        <div className="max-w-[1120px] mx-auto px-6 space-y-12 text-left">
          
          <div className="space-y-4 max-w-[780px]">
            <span className="font-sans text-[12px] text-[#8B6420] uppercase font-semibold tracking-[0.08em]">
              REGIONAL CONTEXT
            </span>
            <h2 className="font-sans font-bold text-[36px] text-navy tracking-tight leading-tight">
              New York coverage
            </h2>
            <div className="space-y-3 text-[16px] font-normal text-slate-600 leading-[28px]">
              <p>
                CCX is designed for New York’s Social Care Networks operating under the 1115 Medicaid demonstration waiver.
              </p>
              <p>
                The platform aligns with New York Medicaid documentation requirements, including:
              </p>
              <ul className="space-y-1.5 pl-1">
                <li className="flex items-center gap-2">
                  <span className="text-gold font-bold">•</span>
                  <span>18 NYCRR Part 521 compliance program requirements</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gold font-bold">•</span>
                  <span>OMIG compliance review protocols</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gold font-bold">•</span>
                  <span>Standardized SDOH terminology frameworks</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gold font-bold">•</span>
                  <span>Designated SCN regional boundaries</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Map layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Map Frame */}
            <div className="lg:col-span-7 bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-navy/5 pb-2 mb-4">
                <span className="font-sans text-[11px] font-bold text-navy uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gold" />
                  Interactive NYS SCN Region Map
                </span>
                <span className="font-mono text-[9px] text-[#8B6420] bg-gold/10 px-2 py-0.5 rounded font-bold uppercase tracking-widest">
                  Select County
                </span>
              </div>
              
              <NysMap selectedRegion={selectedRegionKey} onSelectRegion={setSelectedRegionKey} />
              
              <p className="font-sans text-[10px] text-slate-400 mt-3 text-center leading-normal">
                Colors represent the nine regional SCN boundaries defined under NYS 1115 waiver guidelines.
              </p>
            </div>

            {/* Regional Details Column */}
            <div className="lg:col-span-5 bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm min-h-[400px] flex flex-col justify-between">
              {selectedRegionKey && SCN_REGIONS[selectedRegionKey] ? (
                (() => {
                  const reg = SCN_REGIONS[selectedRegionKey];
                  const getMetricProvenance = (label: string, dataProvenance?: string, dataConfidence?: string) => {
                    const normLabel = label.toLowerCase();
                    if (normLabel.includes("eligible medicaid lives")) {
                      return {
                        status: "Estimated",
                        source: "Public NYS Medicaid enrollment data",
                        method: "CCX regional modeling"
                      };
                    } else if (normLabel.includes("counties covered")) {
                      return {
                        status: "Official",
                        source: "NYS Department of Health"
                      };
                    } else if (normLabel.includes("scn regional infrastructure allocation")) {
                      return {
                        status: "Illustrative Estimate",
                        source: "NYS 1115 Waiver Documentation",
                        method: "CCX funding model"
                      };
                    } else if (normLabel.includes("network scale")) {
                      return {
                        status: "Estimated",
                        source: "Public regional network information",
                        method: "CCX regional modeling"
                      };
                    } else {
                      // Fail closed: any label not explicitly matched above defaults to
                      // unverified, not Official. Prefer the data's own provenance/confidence
                      // fields when present rather than guessing.
                      return {
                        status: dataConfidence ? `${dataProvenance || "Unverified"}` : "Unverified",
                        source: dataProvenance || "Source not yet confirmed",
                        method: "Pending verification"
                      };
                    }
                  };

                  const getInsightProvenance = (type: string) => {
                    if (type === 'Observation') {
                      return {
                        label: 'Evidence',
                        text: 'Regional demographic and utilization characteristics.'
                      };
                    } else if (type === 'Implication') {
                      return {
                        label: 'Interpretation',
                        text: 'Operational assessment based on documentation workflow patterns.'
                      };
                    } else {
                      return {
                        label: 'Basis',
                        text: 'Maps identified documentation risks to existing CCX functionality.'
                      };
                    }
                  };

                  return (
                    <div className="space-y-6 animate-fade-in text-left">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[9px] text-[#8B6420] bg-gold/10 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                              SCN FOOTPRINT
                            </span>
                            <span className="font-mono text-[9px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                              {reg.operating_environment}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelectedRegionKey(null)}
                            className="text-[11px] font-sans font-semibold text-slate-500 hover:text-navy cursor-pointer transition-colors px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200"
                            aria-label="Deselect region"
                          >
                            Deselect Region ✕
                          </button>
                        </div>
                        <h3 className="font-sans font-semibold text-xl text-navy">
                          {reg.name}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                          <strong>Lead Entity:</strong> {reg.lead_entity}
                        </p>
                      </div>

                      <div className="border-t border-navy/5 pt-4">
                        <span className="block text-[10px] font-bold text-navy uppercase tracking-wider mb-2">
                          Participating Counties
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {reg.counties.map((c, i) => (
                            <span key={i} className="text-[10px] bg-slate-50 border border-slate-200/60 rounded px-2 py-1 text-slate-600 font-medium">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Metrics List */}
                      <div className="border-t border-navy/5 pt-4 space-y-3">
                        <span className="block text-[10px] font-bold text-navy uppercase tracking-wider">
                          Demographics & Estimates
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          {reg.metrics.map((m, i) => {
                            const cleanLabel = m.label.replace(/\s*\(CCX Derived\)/gi, "");
                            const prov = getMetricProvenance(m.label, m.provenance, m.confidence);
                            return (
                              <div key={i} className="bg-[#FAFAF8] border border-navy/5 p-3 rounded-lg flex flex-col justify-between min-h-[145px]">
                                <div className="space-y-1">
                                  <span className="block text-[10px] text-slate-500 font-semibold leading-tight">
                                    {cleanLabel}
                                  </span>
                                  <span className="block text-[15px] font-bold text-navy font-sans tracking-tight">
                                    {m.value}
                                  </span>
                                </div>
                                <div className="pt-2 border-t border-navy/5 mt-auto space-y-1 text-[10px]">
                                  <div className="flex items-center justify-between">
                                    <span className="text-slate-400 font-mono text-[8px] uppercase tracking-wider font-semibold">Status</span>
                                    <span className="text-slate-700 font-mono text-[8px] uppercase font-bold">{prov.status}</span>
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-slate-400 text-[8px] font-mono uppercase tracking-wider font-semibold">Source</span>
                                    <span className="text-slate-600 text-[9.5px] leading-tight font-medium">{prov.source}</span>
                                  </div>
                                  {prov.method && (
                                    <div className="flex flex-col">
                                      <span className="text-slate-400 text-[8px] font-mono uppercase tracking-wider font-semibold">Method</span>
                                      <span className="text-slate-600 text-[9.5px] leading-tight font-medium">{prov.method}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Insights List */}
                      <div className="border-t border-navy/5 pt-4 space-y-2.5">
                        <span className="block text-[10px] font-bold text-navy uppercase tracking-wider">
                          Analysis & Insights
                        </span>
                        <div className="space-y-2.5">
                          {reg.insights.slice(0, 3).map((ins, i) => {
                            const prov = getInsightProvenance(ins.type);
                            return (
                              <div key={i} className="p-3 rounded-lg text-xs bg-slate-50 border border-slate-200/40 space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className={`font-mono text-[8.5px] font-bold uppercase px-1.5 py-0.5 rounded ${
                                    ins.type === 'CCX Capability Mapping' 
                                      ? 'bg-gold/10 text-[#8B6420]' 
                                      : ins.type === 'Observation'
                                      ? 'bg-blue-50 text-blue-700'
                                      : 'bg-indigo-50 text-indigo-700'
                                  }`}>
                                    {ins.type}
                                  </span>
                                </div>
                                <p className="text-slate-700 text-[11px] leading-relaxed font-medium">
                                  {ins.text}
                                </p>
                                <div className="pt-2 border-t border-slate-200/50 flex flex-col">
                                  <span className="text-slate-400 font-mono text-[8px] uppercase tracking-wider font-semibold">{prov.label}</span>
                                  <span className="text-slate-500 text-[10px] font-sans leading-normal font-medium">{prov.text}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Evidence Sources & Disclaimers */}
                      <div className="border-t border-[#E2E8F0] pt-4 text-[9px] text-slate-400 leading-relaxed space-y-1.5">
                        <p>
                          <strong>Data Provenance:</strong> Values labeled <strong>CCX Derived</strong> or <strong>Estimated</strong> are planning estimates generated using publicly available New York State information and CCX modeling assumptions. They are provided for planning and evaluation purposes only and are not official allocations, determinations, or forecasts issued by the New York State Department of Health, OMIG, or any Social Care Network.
                        </p>
                        {reg.evidence && reg.evidence.length > 0 && (
                          <div className="flex items-start gap-1">
                            <span className="font-semibold shrink-0">Sources:</span>
                            <span className="italic">{reg.evidence.map(e => e.source).join('; ')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="my-auto py-12 text-center space-y-3 px-4">
                  <div className="w-10 h-10 bg-gold/5 rounded-full border border-gold/15 flex items-center justify-center mx-auto text-gold mb-2">
                    <MapPin className="w-5 h-5 stroke-[2px]" />
                  </div>
                  <h3 className="font-sans font-semibold text-sm text-navy">
                    Select a Region on the Map
                  </h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Select any county or region on the NYS map to evaluate specific regional demographic projections, local lead SCN entities, and audit exposure complexity.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ==================== 10. DECISION-MAKERS ==================== */}
      <section id="who-benefits" className="py-28 md:py-36 bg-white border-b border-[#0F172A]/[0.05]">
        <div className="max-w-[1120px] mx-auto px-6 text-left space-y-12">
          
          <div className="space-y-3 max-w-[680px]">
            <span className="font-sans text-[12px] text-[#8B6420] uppercase font-semibold tracking-[0.08em]">
              Compliance Alignment
            </span>
            <h2 className="font-sans font-bold text-[36px] text-navy tracking-tight leading-tight">
              Built for Every Decision-Maker
            </h2>
            <p className="text-[16px] font-normal text-slate-600 leading-[28px]">
              Clear, specific outcomes designed to meet the precise requirements of regional leadership.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: CFO */}
            <div className="bg-[#FAF9F6] border border-[#0F172A]/[0.06] rounded-xl p-5 flex flex-col justify-between shadow-xs hover:border-gold/30 transition-colors">
              <div className="space-y-3">
                <span className="text-[10px] font-sans font-bold text-gold uppercase tracking-wider block">
                  CFO / EXECUTIVE LEADERSHIP
                </span>
                <h3 className="font-sans font-semibold text-[20px] text-navy tracking-tight leading-snug">
                  Identify Documentation Gaps
                </h3>
                <p className="text-[16px] font-normal text-slate-500 leading-[26px]">
                  Identify documentation gaps that can affect Medicaid reimbursement and audit exposure.
                </p>
              </div>
              <div className="pt-3 border-t border-navy/[0.04] mt-3 flex items-center gap-2 text-[10px] font-semibold text-gold">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>Financial Risk Mitigation</span>
              </div>
            </div>

            {/* Card 2: Compliance Director */}
            <div className="bg-[#FAF9F6] border border-[#0F172A]/[0.06] rounded-xl p-5 flex flex-col justify-between shadow-xs hover:border-gold/30 transition-colors">
              <div className="space-y-3">
                <span className="text-[10px] font-sans font-bold text-gold uppercase tracking-wider block">
                  REVENUE CYCLE / COMPLIANCE
                </span>
                <h3 className="font-sans font-semibold text-[20px] text-navy tracking-tight leading-snug">
                  Review Claim-Level Findings
                </h3>
                <p className="text-[16px] font-normal text-slate-500 leading-[26px]">
                  Review claim-level documentation findings and determine where additional action is warranted.
                </p>
              </div>
              <div className="pt-3 border-t border-navy/[0.04] mt-3 flex items-center gap-2 text-[10px] font-semibold text-gold">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>Documentation Review</span>
              </div>
            </div>

            {/* Card 3: CMO */}
            <div className="bg-[#FAF9F6] border border-[#0F172A]/[0.06] rounded-xl p-5 flex flex-col justify-between shadow-xs hover:border-gold/30 transition-colors">
              <div className="space-y-3">
                <span className="text-[10px] font-sans font-bold text-gold uppercase tracking-wider block">
                  CLINICAL / QUALITY LEADERSHIP
                </span>
                <h3 className="font-sans font-semibold text-[20px] text-navy tracking-tight leading-snug">
                  Standardized Findings
                </h3>
                <p className="text-[16px] font-normal text-slate-500 leading-[26px]">
                  Review standardized documentation and source-traceable findings.
                </p>
              </div>
              <div className="pt-3 border-t border-navy/[0.04] mt-3 flex items-center gap-2 text-[10px] font-semibold text-gold">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>Clinical Quality Metrics</span>
              </div>
            </div>

            {/* Card 4: CIO */}
            <div className="bg-[#FAF9F6] border border-[#0F172A]/[0.06] rounded-xl p-5 flex flex-col justify-between shadow-xs hover:border-gold/30 transition-colors">
              <div className="space-y-3">
                <span className="text-[10px] font-sans font-bold text-gold uppercase tracking-wider block">
                  CIO / IT
                </span>
                <h3 className="font-sans font-semibold text-[20px] text-navy tracking-tight leading-snug">
                  Limited Integration Workflow
                </h3>
                <p className="text-[16px] font-normal text-slate-500 leading-[26px]">
                  Process exported records through a limited-integration workflow.
                </p>
              </div>
              <div className="pt-3 border-t border-navy/[0.04] mt-3 flex items-center gap-2 text-[10px] font-semibold text-gold">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>Read-Only Data Handling</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 11. EXPOSURE ASSESSMENT ==================== */}
      <section id="exposure-review" className="py-28 md:py-36 bg-white border-b border-[#0F172A]/[0.05]">
        <div className="max-w-[1120px] mx-auto px-6 space-y-12">
          
          <div className="space-y-3 max-w-[780px] text-left">
            <span className="font-sans text-[12px] text-[#8B6420] uppercase font-semibold tracking-[0.08em] block">
              DOCUMENTATION EXPOSURE ESTIMATOR
            </span>
            <h2 className="font-sans font-bold text-[32px] sm:text-[38px] text-navy tracking-tight leading-tight">
              Explore synthetic encounter scenarios.
            </h2>
            <p className="text-[17px] sm:text-[18px] font-normal text-slate-700 leading-[28px] sm:leading-[30px]">
              Select a scenario to see how CCX identifies documented facts, missing evidence, and documentation gaps.
            </p>
            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-mono text-xs font-semibold border border-slate-200">
                No upload. No PHI. No sign-in.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6 border-t border-slate-200/60 text-left">
            {/* Left Column: Interactive Scenario Exploration & Diagnostic Output HUD */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white border border-slate-200/60 rounded-2xl p-6 md:p-8 space-y-6 shadow-xs">
                
                {/* Preset Exploration */}
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="block text-[11px] font-bold text-navy uppercase tracking-wider">
                      Select an Encounter Scenario Preset
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {PILOT_SCENARIO_PRESETS.map((preset) => {
                      const isSelected = preset.id === selectedPresetId;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => handlePresetSelect(preset.id)}
                          className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                            isSelected
                              ? 'bg-navy text-white border-navy shadow-sm'
                              : 'bg-[#FAFAF8] text-navy border-slate-200 hover:border-gold/60 hover:bg-white'
                          }`}
                        >
                          <div className="space-y-1">
                            <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded inline-block ${
                              preset.riskLevel === 'HIGH'
                                ? isSelected ? 'bg-red-500/20 text-red-200 border border-red-400/30' : 'bg-red-50 text-red-700 border border-red-200'
                                : preset.riskLevel === 'MODERATE'
                                ? isSelected ? 'bg-amber-500/20 text-amber-200 border border-amber-400/30' : 'bg-amber-50 text-amber-700 border border-amber-200'
                                : isSelected ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/30' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}>
                              {preset.riskLevel} Risk Profile
                            </span>
                            <h5 className={`font-sans font-bold text-xs ${isSelected ? 'text-white' : 'text-navy'}`}>
                              {preset.name}
                            </h5>
                          </div>
                          <span className={`text-[10px] ${isSelected ? 'text-slate-300' : 'text-slate-500'} line-clamp-2`}>
                            {preset.description}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Synthetic Casework Entry Display */}
                <div className="space-y-2 bg-[#FAF8F5] border border-[#E2E8F0] rounded-xl p-4 text-left">
                  <div className="flex items-center justify-between gap-2 border-b border-navy/10 pb-2">
                    <span className="font-mono text-[9.5px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-gold" />
                      Simulated Casework Entry Evaluated
                    </span>
                    <span className="font-mono text-[9px] text-[#8B6420] bg-gold/10 px-2 py-0.5 rounded font-bold uppercase">
                      Synthetic Note
                    </span>
                  </div>
                  <blockquote className="text-xs text-navy font-mono bg-white p-3 rounded-lg border border-slate-200/80 leading-relaxed italic">
                    &ldquo;{activePreset.rawNote}&rdquo;
                  </blockquote>
                </div>

                {/* Diagnostic Report HUD */}
                <div className="p-6 bg-[#FAFAF8] border border-[#E5E7EB] rounded-xl space-y-5 animate-fade-in text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-navy/10 pb-3 gap-3">
                    <div className="space-y-1">
                      <span className="font-mono text-[9px] text-slate-400 tracking-wider font-bold">
                        CCX DEFICIT DIAGNOSTIC REPORT
                      </span>
                      <h4 className="font-sans font-bold text-sm text-navy uppercase">
                        Encounter Gap Analysis Output
                      </h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-sans font-bold px-2.5 py-1 rounded-full border ${
                        activePreset.riskLevel === 'HIGH' ? 'bg-red-50 text-red-700 border-red-200' :
                        activePreset.riskLevel === 'MODERATE' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {activePreset.riskLevel} RISK PROFILE
                      </span>
                      <div className="text-right">
                        <span className="block font-mono text-[8px] text-slate-400 font-bold uppercase leading-none">Score</span>
                        <span className={`font-mono text-sm font-bold ${
                          activePreset.riskLevel === 'HIGH' ? 'text-red-600' :
                          activePreset.riskLevel === 'MODERATE' ? 'text-amber-600' :
                          'text-emerald-600'
                        }`}>
                          {activePreset.score}/100
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Identified Deficits */}
                  <div className="space-y-3">
                    <span className="block font-sans text-xs font-bold text-navy uppercase tracking-wider flex items-center gap-1.5">
                      <AlertCircle className="w-4.5 h-4.5 text-red-500 shrink-0" />
                      Identified Narrative Deficits:
                    </span>
                    <ul className="space-y-2">
                      {activePreset.gaps.map((gap, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-navy/80 leading-relaxed bg-white p-2.5 border border-[#E2E8F0]/50 rounded-lg">
                          <span className="text-red-500 font-bold select-none">•</span>
                          <span>{gap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommendations */}
                  <div className="pt-4 border-t border-navy/10 space-y-2">
                    <span className="block font-sans text-xs font-bold text-navy uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-4.5 h-4.5 text-gold shrink-0" />
                      Recommended Corrective Strategy:
                    </span>
                    <p className="text-xs text-navy/85 leading-relaxed bg-white p-3.5 rounded-lg border border-[#E2E8F0]/40">
                      {activePreset.correctiveAction}
                    </p>
                  </div>
                </div>

                {/* Real-Data CTA & Request Form */}
                <div className="p-6 bg-[#FAF9F6] border border-[#E2E8F0] rounded-xl space-y-4 text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="font-sans font-bold text-sm text-navy uppercase tracking-wider">
                        REQUEST A LIVE ASSESSMENT
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Actual network assessments use controlled enterprise data-transfer channels under the applicable agreement.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setGatedAction(gatedAction === 'assessment' ? null : 'assessment');
                          setGateSubmitted(false);
                        }}
                        className="px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 bg-navy hover:bg-navy/90 text-white shadow-xs"
                      >
                        <span>REQUEST A LIVE ASSESSMENT</span>
                        <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                      </button>
                    </div>
                  </div>

                  {/* Request Form Container */}
                  {gatedAction === 'assessment' && (
                    <div className="mt-4 pt-4 border-t border-slate-200 space-y-4 animate-fade-in">
                      {gateSubmitted ? (
                        <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs space-y-2 font-normal">
                          <p className="font-bold flex items-center gap-1.5 text-emerald-900">
                            <Check className="w-4 h-4 stroke-[3px]" />
                            Request Confirmed
                          </p>
                          <p>
                            We have logged your live assessment request for <strong>{gateEmail}</strong>. Actual network assessments use controlled enterprise data-transfer channels under the applicable agreement.
                          </p>
                        </div>
                      ) : (
                        <form method="post" action="/api/inquiry" onSubmit={handleGateSubmit} className="space-y-3.5">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label htmlFor="gate-email" className="block text-[10px] font-bold text-navy uppercase mb-1">
                                Work Email *
                              </label>
                              <input
                                id="gate-email"
                                name="email"
                                type="email"
                                required
                                placeholder="name@institution.org"
                                value={gateEmail}
                                onChange={(e) => setGateEmail(e.target.value)}
                                aria-invalid={gateEmailError ? "true" : "false"}
                                aria-describedby={gateEmailError ? "gate-email-error" : undefined}
                                className={`w-full px-3 py-2.5 bg-white border ${
                                  gateEmailError ? 'border-red-500 focus:border-red-500' : 'border-slate-300 focus:border-navy'
                                } rounded-lg text-xs outline-none transition-all text-navy`}
                              />
                              {gateEmailError && (
                                <p className="mt-1 text-[11px] text-red-600 font-medium flex items-center gap-1" id="gate-email-error">
                                  <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                                  <span>{gateEmailError}</span>
                                </p>
                              )}
                            </div>

                            <div>
                              <label htmlFor="gate-org" className="block text-[10px] font-bold text-navy uppercase mb-1">
                                SCN Network / Organization Name
                              </label>
                              <input
                                id="gate-org"
                                name="organization"
                                type="text"
                                placeholder="e.g., Lead SCN Entity / CMA Partner"
                                value={gateOrg}
                                onChange={(e) => setGateOrg(e.target.value)}
                                className="w-full px-3 py-2.5 bg-white border border-slate-300 focus:border-navy rounded-lg text-xs outline-none transition-all text-navy"
                              />
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                            <p className="text-[11px] text-slate-500">
                              Actual network assessments use controlled enterprise data-transfer channels under the applicable agreement.
                            </p>
                            <button
                              type="submit"
                              disabled={gateSubmitting}
                              className="w-full sm:w-auto px-6 py-2.5 bg-navy hover:bg-navy/95 active:translate-y-0.5 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                              {gateSubmitting ? (
                                <>
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                  <span>Submitting...</span>
                                </>
                              ) : (
                                <>
                                  <span>Submit Assessment Request</span>
                                  <Send className="w-3.5 h-3.5" />
                                </>
                              )}
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Right Column: Assessment Guidance */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#FAF8F5] border border-[#E2E8F0] rounded-2xl p-6 space-y-5 shadow-xs text-left">
                <div className="flex items-center gap-2.5 pb-3 border-b border-[#E2E8F0]">
                  <ShieldCheck className="w-5 h-5 text-gold" />
                  <h4 className="font-sans font-bold text-xs text-[#0B1F3A] uppercase tracking-wider">
                    Assessment Framework
                  </h4>
                </div>

                <div className="space-y-3 text-xs text-slate-600 leading-relaxed font-sans">
                  <p>
                    Assessments analyze exported records claim by claim against defined documentation and terminology rules.
                  </p>
                  <p>
                    Findings isolate documentation deficits, such as missing encounter duration, unverified consent, or absent screening instruments, with exact text traceability to the original casework record.
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E2E8F0] space-y-2">
                  <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Security &amp; Procurement
                  </span>
                  <p className="text-[11.5px] text-slate-600 leading-relaxed">
                    For HIPAA Business Associate Agreements, dedicated AWS hosting, SOC 2 status, and retention policies:
                  </p>
                  <a
                    href="#compliance-guardrails"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('compliance-guardrails')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-1 text-[12px] font-bold text-navy hover:text-gold transition-colors pt-1"
                  >
                    <span>Review Security &amp; BAA Terms &rarr;</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== DATA HANDLING ==================== */}
      <section id="compliance-guardrails" className="py-20 md:py-28 bg-[#FAF8F5] border-b border-[#0F172A]/[0.05] relative scroll-mt-16">
        <div id="security-guardrails" className="absolute -top-24" />
        <div id="data-handling" className="absolute -top-24" />
        <div className="max-w-[1120px] mx-auto px-6 text-left">
          <div className="max-w-2xl space-y-4">
            <span className="font-sans text-[12px] text-[#8B6420] uppercase font-semibold tracking-[0.08em] block">
              DATA HANDLING
            </span>
            <p className="text-[17px] sm:text-[18px] font-normal text-slate-700 leading-[28px] sm:leading-[30px]">
              Public exploration uses synthetic scenarios only. Real operational data is handled through controlled enterprise ingestion under the applicable agreement.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  window.location.hash = 'compliance-trust';
                  handleViewChange('compliance-trust');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-navy hover:bg-navy/90 text-white shadow-xs transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B6420] focus-visible:ring-offset-2"
              >
                <span>View Data Handling &amp; Security</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 11. ABOUT COMMUNITY CLAIMS EXCHANGE ==================== */}
      <AboutCcx 
        onNavigateToSection={(id) => {
          setActiveSection(id);
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }}
      />

      {/* ==================== 15. ASSESSMENT REQUEST & AUDIT METHODOLOGY ==================== */}
      <section id="contact" className="py-24 md:py-32 bg-off-white">
        <div className="max-w-[820px] mx-auto px-6 text-left space-y-12">
          
          {/* SECTION 25. CTA */}
          <div className="space-y-4 text-left">
            <span className="font-sans text-[12px] text-[#8B6420] uppercase font-semibold tracking-[0.08em] block">
              REQUEST A DOCUMENTATION EXPOSURE ASSESSMENT
            </span>
            <h2 className="font-sans font-bold text-[36px] text-navy tracking-tight leading-tight">
              Request a Documentation Exposure Assessment
            </h2>
            <p className="text-[16px] font-normal text-slate-600 leading-[28px]">
              A retrospective sample can reveal documentation patterns across a larger claim population. CCX applies structured documentation review to sampled records so organizations can identify recurring gaps and potential exposure.
            </p>
          </div>

          {/* Form */}
          <div className="bg-white border border-[#0F172A]/[0.06] rounded-2xl p-6 md:p-8 shadow-xs">
            {contactSubmitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-12 h-12 bg-gold/5 rounded-full flex items-center justify-center mx-auto text-gold border border-gold/20 shadow-xs">
                  <Check className="w-6 h-6 stroke-[3px]" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-sans font-bold text-lg text-navy">Assessment Request Registered</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Thank you. Our compliance team will review your request and contact you at <strong>{contactEmail}</strong> to coordinate next steps.
                  </p>
                </div>
                <button 
                  type="button"
                  onClick={() => {
                    setContactSubmitted(false);
                    setContactName('');
                    setContactEmail('');
                    setContactOrg('');
                    setContactMessage('');
                  }}
                  className="mt-4 font-sans text-xs font-bold text-gold hover:underline cursor-pointer"
                >
                  Submit another request
                </button>
              </div>
            ) : (
              <form 
                method="post" 
                action="/api/inquiry" 
                onSubmit={handleSubmit} 
                className="space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-[10px] font-bold text-navy uppercase tracking-wider mb-1">
                      Name
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      placeholder="e.g., Jane Doe"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-[#0F172A]/[0.08] focus:border-gold focus:ring-1 focus:ring-gold/20 rounded-lg text-xs outline-none transition-all text-navy"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-org" className="block text-[10px] font-bold text-navy uppercase tracking-wider mb-1">
                      Organization
                    </label>
                    <input
                      id="contact-org"
                      name="organization"
                      type="text"
                      required
                      placeholder="e.g., Finger Lakes SCN"
                      value={contactOrg}
                      onChange={(e) => setContactOrg(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-[#0F172A]/[0.08] focus:border-gold focus:ring-1 focus:ring-gold/20 rounded-lg text-xs outline-none transition-all text-navy"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-[10px] font-bold text-navy uppercase tracking-wider mb-1">
                    Work Email *
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    placeholder="jdoe@institution.org"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    aria-invalid={contactEmailError ? "true" : "false"}
                    aria-describedby={contactEmailError ? "contact-email-error" : undefined}
                    className={`w-full px-3 py-2.5 bg-white border ${contactEmailError ? 'border-red-500 focus:border-red-500 focus:ring-red-200/50' : 'border-[#0F172A]/[0.08] focus:border-gold focus:ring-gold/20'} rounded-lg text-xs outline-none transition-all text-navy`}
                  />
                  {contactEmailError && (
                    <p className="mt-1.5 text-[11px] text-red-600 font-medium flex items-center gap-1 animate-fade-in" id="contact-email-error">
                      <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span>{contactEmailError}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-[10px] font-bold text-navy uppercase tracking-wider mb-1">
                    Assessment Requirements
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={3}
                    placeholder="Specify review priorities or claim sample details. Ensure no patient or member PHI is submitted."
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-[#0F172A]/[0.08] focus:border-gold focus:ring-1 focus:ring-gold/20 rounded-lg text-xs outline-none transition-all text-navy resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={contactSubmitting || !contactEmail}
                  className="w-full py-3.5 bg-gold hover:bg-[#5E3E08] active:translate-y-0.5 transition-all text-white text-[16px] font-semibold rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-gold/5 disabled:opacity-50"
                >
                  {contactSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Submitting Request...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 text-white" />
                      <span>Request a Documentation Exposure Assessment</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Secondary Reference: Audit Case Precedent */}
          <div className="bg-white border border-[#0F172A]/[0.08] rounded-2xl p-6 md:p-8 space-y-4 shadow-xs">
            <div className="space-y-1">
              <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Regulatory Reference
              </span>
              <h3 className="font-sans font-bold text-[18px] text-navy tracking-tight leading-snug">
                Sampling and audit methodology precedent
              </h3>
            </div>

            <p className="text-[14px] text-slate-600 leading-relaxed font-normal">
              New York Medicaid audit regulations (18 NYCRR § 519.18) permit retrospective statistical sampling. The citation below provides judicial review of statistical sampling standards in New York Medicaid administrative audits.
            </p>

            {/* Case Citation & Details */}
            <div className="pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 font-mono">
              <div className="flex items-center gap-2 flex-wrap">
                <CitationPopover
                  id="contact-fast-help-citation"
                  citationNumber={2}
                  badge="JUDICIAL PRECEDENT"
                  title="Matter of Fast Help Ambulette, Inc. v. NYS Dept. of Health"
                  subtitle="198 AD3d 756, 2021 NY Slip Op 05560 (N.Y. App. Div. 2d Dept. 2021)"
                  sourceName="New York Supreme Court, Appellate Division, Second Department"
                  details={[
                    "Sample Disallowance: OMIG audited a 150-claim random sample from 15,420 total Medicaid claims and identified $3,355 in disallowed billing errors (missing contemporaneous logs and signature timing gaps).",
                    "Statistical Extrapolation: Using ratio estimation across the full 15,420-claim population, OMIG extrapolated the $3,355 sample disallowance into an enforceable $1,102,553 repayment demand.",
                    "Appellate Holding: The court affirmed OMIG's statutory authority under 18 NYCRR § 519.18 to extrapolate overpayments across the entire claim universe, even when the underlying sample errors appear minor."
                  ]}
                  links={[
                    {
                      label: "View Appellate Division Decision (198 AD3d 756)",
                      url: "https://nycourts.gov/reporter/3dseries/2021/2021_05560.htm"
                    }
                  ]}
                >
                  Matter of Fast Help Ambulette, Inc. v. NYS DOH (2021)
                </CitationPopover>
                <span>· 198 AD3d 756 (2d Dept. 2021) · 18 NYCRR § 519.18</span>
              </div>

              <a
                href="https://nycourts.gov/reporter/3dseries/2021/2021_05560.htm"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-gold hover:text-navy underline underline-offset-2 decoration-gold/40 hover:decoration-navy font-sans font-medium transition-colors"
              >
                <span>Read Court Opinion</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

        </div>
      </section>

      </main>
      )}

      {/* FOOTER */}
      <Footer 
        currentView={currentView}
        onViewChange={handleViewChange}
      />
    </div>
  );
}
