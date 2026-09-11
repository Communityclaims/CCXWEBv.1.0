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
  FileCheck2,
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

import HeroRecord from './components/HeroRecord';
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
    name: 'Unstructured Frontline Scribble',
    badge: 'High Risk Deficit',
    badgeColor: 'bg-red-50 text-red-700 border-red-200/50',
    description: 'A typical raw caseworker text entry describing a food security crisis, lacking explicit coding, screening questions, or timestamps.',
    rawNote: 'Visited Ms. Davis. Family of 3 has no food left in house, skipped dinner last night. Referred her to food pantry. Consent form signed on paper. 15 mins.',
    riskLevel: 'HIGH',
    score: 20,
    gaps: [
      'Missing explicit ICD-10 SDOH classification codes (e.g., Z59.41 Food Insecurity).',
      'Missing contemporaneous digital member consent verification.',
      'Lacks structured screening questionnaire references (e.g., LOINC 96777-8).',
      'Lacks secure proof of contemporaneous signature and entry-day lock.'
    ],
    correctiveAction: 'During retrospective review, CCX structures the verified food insecurity diagnosis (ICD-10 Z59.41) and 15-minute duration directly from the frontline entry, while explicitly flagging the unverified paper consent and missing screening tool before state audit review.'
  },
  {
    id: 'partial_referral',
    name: 'Partially Structured Checkpoint',
    badge: 'Moderate Risk Deficit',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200/50',
    description: 'An encounter record containing basic screening answers and referrals but missing service duration tracking and explicit consent logs.',
    rawNote: 'Completed housing instability screen. mold issues in bedrooms. asthma issues. Referred to legal aid. Checked SHIN-NY database. 8 mins.',
    riskLevel: 'MODERATE',
    score: 55,
    gaps: [
      'Missing documented encounter duration exceeding the clinical billing threshold.',
      'Missing explicit contemporaneous member consent verification.',
      'Checklist entries lack corroborating clinical-narrative description required for retrospective audit defense.'
    ],
    correctiveAction: 'During retrospective review, CCX flags the missing duration and consent documentation, structures the housing-asthma correlation from the available narrative, and produces a reviewed, evidence-referenced finding the organization\'s compliance team can act on before their next OMIG review.'
  },
  {
    id: 'fully_standardized',
    name: 'Fully Standardized CCX Record',
    badge: 'Low Risk Compliant',
    badgeColor: 'bg-gold/10 text-gold border-gold/20',
    description: 'A complete, standards-compliant record identified during retrospective review, validated, and securely sealed with a reproducible audit trail.',
    rawNote: 'LOINC 96780-2 Screening completed. Patient has specialized transport barriers. ICD-10 Z59.48. Checked HIE. Consent verified. Duration: 15 mins.',
    riskLevel: 'LOW',
    score: 98,
    gaps: [
      'None. Record is structured to align with current OMIG Audit Handbook guidance, billing compliance requirements, and applicable 6-to-10-year record retention mandates.'
    ],
    correctiveAction: 'CCX verifies this record, outputs a standard diagnostic record, and commits the comprehensive audit bundle to isolated, secure WORM storage.'
  }
];

// Example templates for Section 4 (WHAT WE PRODUCE / PROOF)
export interface ProofField {
  id: string;
  label: string;
  value: string;
  status: 'confirmed' | 'gap';
  statusText: string;
  sourceSpan: string | null;
  complianceNote: string;
}

export interface ProofSpan {
  text: string;
  fieldId?: string;
  type: 'confirmed' | 'gap-source' | 'plain';
  label?: string;
}

export interface ProofScenario {
  id: string;
  name: string;
  raw: string;
  highlightedSpans: ProofSpan[];
  fields: ProofField[];
  narrative: {
    restatedText: string;
    flaggedGaps: string[];
  };
  confirmedCount: number;
  gapCount: number;
}

const PROOF_SCENARIOS: ProofScenario[] = [
  {
    id: 'food',
    name: 'Example 1: Food Insecurity',
    raw: 'Visited Ms. Davis. Family of 3 has no food left in house, skipped dinner last night. Referred her to food pantry. Consent form signed on paper. 15 mins.',
    highlightedSpans: [
      { text: 'Visited Ms. Davis. ', type: 'plain' },
      { text: 'Family of 3 has no food left in house, skipped dinner last night.', fieldId: 'diagnosis', type: 'confirmed', label: 'ICD-10 Z59.41' },
      { text: ' ', type: 'plain' },
      { text: 'Referred her to food pantry.', fieldId: 'referral', type: 'confirmed', label: 'Intervention' },
      { text: ' ', type: 'plain' },
      { text: 'Consent form signed on paper.', fieldId: 'consent', type: 'gap-source', label: 'Paper consent (No HIE flag)' },
      { text: ' ', type: 'plain' },
      { text: '15 mins.', fieldId: 'duration', type: 'confirmed', label: 'Duration (15m)' }
    ],
    fields: [
      {
        id: 'diagnosis',
        label: 'Classification (ICD-10)',
        value: 'ICD-10 Z59.41 (Food Insecurity)',
        status: 'confirmed',
        statusText: 'CONFIRMED',
        sourceSpan: 'Family of 3 has no food left in house, skipped dinner last night.',
        complianceNote: 'Grounded directly in documented lack of food in household and skipped meals.'
      },
      {
        id: 'duration',
        label: 'Encounter Duration',
        value: '15 Minutes (Meets clinical billing threshold)',
        status: 'confirmed',
        statusText: 'CONFIRMED',
        sourceSpan: '15 mins.',
        complianceNote: 'Contemporaneous encounter duration documented verbatim; satisfies minimum billing duration.'
      },
      {
        id: 'referral',
        label: 'Documented Intervention',
        value: 'Food Pantry Referral Dispatched',
        status: 'confirmed',
        statusText: 'CONFIRMED',
        sourceSpan: 'Referred her to food pantry.',
        complianceNote: 'Community referral action documented verbatim in frontline casework note.'
      },
      {
        id: 'screening',
        label: 'Screening Instrument',
        value: 'Screening Instrument: NOT DOCUMENTED — flag for compliance review',
        status: 'gap',
        statusText: 'FLAGGED GAP',
        sourceSpan: null,
        complianceNote: 'Source note is a caseworker narrative, not a screening record. No screening tool mentioned; LOINC 96777-8 AHC HRSN code withheld.'
      },
      {
        id: 'consent',
        label: 'Consent Status',
        value: 'Consent Status: NOT VERIFIED — source shows paper signature, no HIE consent flag',
        status: 'gap',
        statusText: 'FLAGGED GAP',
        sourceSpan: 'Consent form signed on paper.',
        complianceNote: 'Source shows paper signature; paper consent is not an electronic HIE consent flag. Flagged for compliance review before state review.'
      }
    ],
    narrative: {
      restatedText: 'Casework encounter with Ms. Davis. Family of 3 has no food left in house, skipped dinner last night (mapped to ICD-10 Z59.41 Food Insecurity). Dispatched referral to food pantry. Contemporaneous duration documented: 15 minutes.',
      flaggedGaps: [
        'Screening Instrument: NOT DOCUMENTED — source note is a caseworker narrative without screening tool administration; LOINC 96777-8 withheld for review.',
        'Consent Status: NOT VERIFIED — source shows paper signature ("Consent form signed on paper"); no verified electronic HIE consent flag present.'
      ]
    },
    confirmedCount: 3,
    gapCount: 2
  },
  {
    id: 'housing',
    name: 'Example 2: Housing Instability',
    raw: 'Found water damage and visible mold in bedrooms. Landlord has ignored requests for repair. Member\'s child has active asthma. Referral to legal aid. Verbal consent obtained. 18 mins.',
    highlightedSpans: [
      { text: 'Found water damage and visible mold in bedrooms.', fieldId: 'diagnosis', type: 'confirmed', label: 'ICD-10 Z59.1' },
      { text: ' Landlord has ignored requests for repair. Member\'s child has active asthma. ', type: 'plain' },
      { text: 'Referral to legal aid.', fieldId: 'referral', type: 'confirmed', label: 'Intervention' },
      { text: ' ', type: 'plain' },
      { text: 'Verbal consent obtained.', fieldId: 'consent', type: 'gap-source', label: 'Verbal only (No HIE flag)' },
      { text: ' ', type: 'plain' },
      { text: '18 mins.', fieldId: 'duration', type: 'confirmed', label: 'Duration (18m)' }
    ],
    fields: [
      {
        id: 'diagnosis',
        label: 'Classification (ICD-10)',
        value: 'ICD-10 Z59.1 (Inadequate Housing)',
        status: 'confirmed',
        statusText: 'CONFIRMED',
        sourceSpan: 'Found water damage and visible mold in bedrooms.',
        complianceNote: 'Grounded directly in documented structural water damage and mold exposure.'
      },
      {
        id: 'duration',
        label: 'Encounter Duration',
        value: '18 Minutes (Meets clinical billing threshold)',
        status: 'confirmed',
        statusText: 'CONFIRMED',
        sourceSpan: '18 mins.',
        complianceNote: 'Contemporaneous encounter duration documented verbatim; satisfies minimum billing duration.'
      },
      {
        id: 'referral',
        label: 'Documented Intervention',
        value: 'Legal Aid Referral Hand-off',
        status: 'confirmed',
        statusText: 'CONFIRMED',
        sourceSpan: 'Referral to legal aid.',
        complianceNote: 'Legal advocacy referral logged verbatim in frontline casework note.'
      },
      {
        id: 'screening',
        label: 'Screening Instrument',
        value: 'Screening Instrument: NOT DOCUMENTED — flag for compliance review',
        status: 'gap',
        statusText: 'FLAGGED GAP',
        sourceSpan: null,
        complianceNote: 'No screening instrument mentioned in source note. CCX withholds LOINC 97023-6 housing screening code without documented administration.'
      },
      {
        id: 'consent',
        label: 'Consent Status',
        value: 'Consent Status: NOT VERIFIED — verbal consent only, no HIE consent flag',
        status: 'gap',
        statusText: 'FLAGGED GAP',
        sourceSpan: 'Verbal consent obtained.',
        complianceNote: 'Source notes verbal consent only; verbal consent is not an electronic HIE consent flag. Flagged for compliance review.'
      }
    ],
    narrative: {
      restatedText: 'Casework observation: Inadequate housing documented from source entry ("Found water damage and visible mold in bedrooms"; member\'s child with active asthma; mapped to ICD-10 Z59.1 Inadequate Housing). Dispatched intervention ("Referral to legal aid"). Contemporaneous duration documented: 18 minutes.',
      flaggedGaps: [
        'Screening Instrument: NOT DOCUMENTED — no screening tool administered in source note; LOINC 97023-6 code withheld for review.',
        'Consent Status: NOT VERIFIED — verbal consent only ("Verbal consent obtained"); contemporaneous electronic HIE consent flag missing.'
      ]
    },
    confirmedCount: 3,
    gapCount: 2
  }
];

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "Does CCX replace our current Electronic Health Record (EHR) or referral platforms?",
    answer: "No. CCX is a retrospective documentation-structuring and review-package platform. It ingests an export of existing records — not a live connection to your EHR or referral platform — and produces a structured, reproducible evidence package with LOINC and ICD-10 SDOH mapping. Your existing EHRs and SCN referral systems remain the authoritative, unmodified sources of record."
  },
  {
    question: "How long does implementation take?",
    answer: "Because CCX operates retrospectively on exported casework records without requiring 'rip-and-replace' deployments or frontline retraining, onboarding typically takes days rather than months. Initial retrospective sample analyses can be conducted as soon as de-identified sample exports are provided."
  },
  {
    question: "Does this require frontline staff or CBO caseworkers to learn a new tool?",
    answer: "No. Caseworkers continue using their existing, familiar intake forms and case tools exactly as they do today. CCX reviews the resulting records retrospectively, on a schedule your compliance team controls, and requires no new login, tool, or workflow change for frontline staff."
  },
  {
    question: "Who validates the accuracy of the compiled narratives?",
    answer: "CCX maintains strict human-in-the-loop controls. Every finding is presented as a recommendation for your compliance team to confirm; CCX surfaces evidence and flags gaps, but does not make final compliance or billing determinations on its own."
  },
  {
    question: "How are CCX implementation fees funded?",
    answer: "Flat-fee, always — never a percentage of claims billed or collected, which New York regulation (18 NYCRR 504.9(a)(1)) prohibits for services like this."
  },
  {
    question: "Will CCX sign our organization's Business Associate Agreement (BAA)?",
    answer: "Yes, without exception. CCX operates as a HIPAA Business Associate for all SCN Lead Entities, Care Management Agencies (CMAs), and health system partners. We sign standard BAAs prior to ingesting any retrospective data exports, and can execute our pre-approved NY Medicaid 1115 BAA or sign your institution's custom enterprise agreement."
  },
  {
    question: "Where is client documentation hosted, and is it encrypted at rest and in transit?",
    answer: "All client data resides exclusively in 100% US-based, HIPAA-compliant cloud regions (AWS US-East / GovCloud isolated VPCs). Data is encrypted at rest using AES-256 with tenant-isolated customer keys and encrypted in transit via enforced TLS 1.3. There is zero offshore hosting, foreign processing, or non-US personnel access."
  },
  {
    question: "Does CCX have a SOC 2 report or equivalent security certification?",
    answer: "Our SOC 2 Type II audit window is currently in progress with an independent AICPA-accredited CPA auditing firm, with target report delivery in Q2 2027. We do not claim completed certifications before formal attestation. In the interim, healthcare procurement and InfoSec teams can review our completed HIPAA Security Risk Assessment, third-party network penetration test summary, and Standardized Information Gathering (SIG) package under NDA."
  }
];

// Helper to initialize view from URL hash if present
const getInitialView = (): 'home' | 'compliance-trust' | 'resources' => {
  if (typeof window !== 'undefined') {
    const hash = window.location.hash.replace(/^#/, '');
    if (hash === 'resources') return 'resources';
    if (hash === 'compliance-trust') return 'compliance-trust';
  }
  return 'home';
};

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('top');
  const [currentView, setCurrentView] = useState<'home' | 'compliance-trust' | 'resources'>(getInitialView);
  
  // Section 4 (PROOF) state
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('food');
  const [activeProofField, setActiveProofField] = useState<string | null>(null);
  
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

  // FAQ Accordion state
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  // Contact state
  const [contactName, setContactName] = useState('');
  const [contactOrg, setContactOrg] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactSubmitting, setContactSubmitting] = useState(false);

  // Scroll spy to update active navigation item
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;
      const sections = [
        'top',
        'problem',
        'produces',
        'transformation-example',
        'how-it-works',
        'system-boundaries',
        'regional-context',
        'who-benefits',
        'exposure-review',
        'resources',
        'faq',
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

  const handleViewChange = (view: 'home' | 'compliance-trust' | 'resources') => {
    setCurrentView(view);
    if (view === 'resources') {
      if (window.location.hash !== '#resources') {
        window.location.hash = 'resources';
      }
    } else if (view === 'compliance-trust') {
      if (window.location.hash !== '#compliance-trust') {
        window.location.hash = 'compliance-trust';
      }
    } else {
      if (window.location.hash === '#resources' || window.location.hash === '#compliance-trust') {
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
          focus: 'SCN Regional Lead',
          message: contactMessage || 'Requested a custom regional risk modeling briefing.'
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

  const currentScenario = PROOF_SCENARIOS.find(s => s.id === selectedScenarioId) || PROOF_SCENARIOS[0];
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
        <main id="resources" className="focus:outline-none" tabIndex={-1}>
          <Resources onViewChange={handleViewChange} />
        </main>
      ) : (
        <main id="main-content" className="focus:outline-none" tabIndex={-1}>
        {/* ==================== 1. HERO SECTION ==================== */}
      <section id="top" className="bg-[#FAF8F5] pt-20 pb-24 md:pt-28 md:pb-36 border-b border-[#0F172A]/[0.05] relative overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        
        <div className="max-w-[1120px] mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* LEFT COLUMN - EXECUTIVE COPING SUMMARY */}
            <div className="lg:col-span-7 text-left">
              <div className="flex flex-wrap items-center gap-2.5 mb-3">
                <span className="text-[11.5px] font-sans font-semibold text-[#8B6420] tracking-[0.08em] uppercase">
                  What Ships Today: Retrospective Structuring &amp; Review Packages
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Active In Production
                </span>
              </div>
              
              <h1 className="text-[34px] md:text-[42px] lg:text-[48px] font-sans font-bold text-[#0B1F3A] leading-[1.08] tracking-[-0.03em] mt-2">
                Documentation that stands up to review.
              </h1>

              <div className="text-[17px] sm:text-[18px] font-normal text-slate-600 leading-[29px] sm:leading-[30px] max-w-[640px] mt-5">
                <CitationPopover
                  id="hero-omig-workplan"
                  citationNumber={1}
                  badge="NYS REGULATORY SOURCE"
                  title="NYS OMIG Annual Work Plan — Bureau of Compliance"
                  subtitle="Title 18 NYCRR Part 521 (§ 521-1.3 & § 521-1.4: Mandatory Compliance Program Requirements)"
                  sourceName="New York State Office of the Medicaid Inspector General (OMIG)"
                  details={[
                    "Review Lookback Window: Under OMIG's updated Compliance Program Review (CPR) protocol, effective for reviews initiated on or after July 1, 2025 and active through 2026, OMIG expanded the mandatory review lookback period from the historical 3 months to 12 consecutive months.",
                    "Review Targets: In its Annual Work Plan, OMIG's Bureau of Compliance established an annual target of approximately 200 comprehensive compliance program effectiveness reviews (doubling the prior annual baseline of ~100 reviews).",
                    "Statutory Payment Condition: Under NY Social Services Law § 363-d and Title 18 NYCRR § 521-1.1(c), maintenance of an effective compliance program satisfying all statutory elements is an explicit statutory condition of Medicaid payment, not mere paperwork."
                  ]}
                  links={[
                    {
                      label: "OMIG Compliance Program Review Protocols & Module (12-Mo. Window)",
                      url: "https://omig.ny.gov/compliance/compliance-program-review"
                    },
                    {
                      label: "OMIG Annual Work Plans & Priority Areas",
                      url: "https://omig.ny.gov/information-resources/work-plan"
                    },
                    {
                      label: "Title 18 NYCRR Part 521 Mandatory Compliance Regulations",
                      url: "https://omig.ny.gov/compliance/compliance-regulations"
                    }
                  ]}
                >
                  OMIG's 2026 Work Plan doubles Compliance Program Reviews and extends the review window from three months to twelve.
                </CitationPopover>{' '}
                Under OMIG's current regulations, having an effective compliance program is a condition of payment, not paperwork. Community Claims Exchange (CCX) ships retrospective documentation structuring today: it ingests exported casework notes, standardizes narrative entries into audit-ready review packages with LOINC and ICD-10 SDOH mapping, and flags missing documentation before state review—without requiring any changes to frontline workflows. Self-service exposure modeling, denial pattern analytics, and network-wide risk visibility are planned capabilities in active design on our roadmap.
              </div>

              {/* Source Verification Footnote Indicator */}
              <div className="mt-3.5 p-3 bg-white/90 border border-slate-200/90 rounded-xl flex flex-wrap items-center justify-between gap-3 text-[11.5px] font-mono shadow-2xs">
                <div className="flex flex-wrap items-center gap-2 text-slate-600">
                  <button
                    type="button"
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent('open-citation', { detail: { id: 'hero-omig-workplan' } }));
                    }}
                    className="font-bold text-[#8B6420] hover:text-navy px-1.5 py-0.5 bg-gold/15 hover:bg-gold/25 border border-gold/40 rounded text-[10px] cursor-pointer transition-colors"
                    title="Click or hover claim above to open full primary citation details"
                  >
                    [1]
                  </button>
                  <span className="font-sans font-semibold text-navy">Regulatory Source:</span>
                  <span className="font-sans text-slate-600">
                    NYS OMIG Annual Work Plan (Bureau of Compliance) &amp; 18 NYCRR Part 521.
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <a
                    href="https://omig.ny.gov/compliance/compliance-program-review"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#8B6420] hover:text-navy underline underline-offset-2 decoration-gold/40 hover:decoration-navy font-sans font-medium transition-colors"
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
                    className="inline-flex items-center gap-1 text-[#8B6420] hover:text-navy underline underline-offset-2 decoration-gold/40 hover:decoration-navy font-sans font-medium transition-colors"
                    title="Official NYS OMIG Annual Work Plan Portal"
                  >
                    <span>OMIG Work Plan Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* THREE CLINICAL BULLET STATEMENTS - WHAT SHIPS TODAY */}
              <div className="space-y-2.5 py-2 text-slate-700 font-sans text-[15.5px] font-normal leading-[26px] mt-4">
                <div className="flex items-start gap-2.5">
                  <span className="text-gold font-bold shrink-0 mt-0.5">✓</span>
                  <span><strong>Retrospective structuring:</strong> Ingests exported casework notes and narrative logs without requiring frontline workflow changes.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-gold font-bold shrink-0 mt-0.5">✓</span>
                  <span><strong>Standardized clinical mapping:</strong> Maps narrative entries to LOINC screening and ICD-10 SDOH codes with bidirectional source text traceability.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-gold font-bold shrink-0 mt-0.5">✓</span>
                  <span><strong>Audit-ready review packages:</strong> Compiles evidence binders with explicit compliance gap flagging for your compliance team's review.</span>
                </div>
              </div>

              {/* ROADMAP CLARITY CALLOUT */}
              <div className="mt-3.5 p-3 bg-slate-50 border border-slate-200/90 rounded-xl text-[12.5px] text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9.5px] font-bold uppercase tracking-wider text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded shrink-0">
                    Roadmap Notice
                  </span>
                  <span>Automated exposure modeling, denial analytics, and network risk visibility are planned capabilities in active design.</span>
                </div>
                <a
                  href="#roadmap"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('roadmap')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="text-[#8B6420] hover:text-navy font-semibold text-[12px] underline underline-offset-2 shrink-0 self-start sm:self-auto"
                >
                  View Roadmap →
                </a>
              </div>

              {/* ACTIONS */}
              <div className="flex flex-col sm:flex-row gap-3.5 items-start mt-6">
                <a 
                  href="#exposure-review" 
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('exposure-review')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="bg-gold hover:bg-[#B5945F] text-white px-6 py-3.5 rounded-lg font-sans text-[15.5px] font-semibold transition-colors duration-150 inline-block text-center cursor-pointer shadow-sm border border-transparent"
                >
                  Explore Documentation Scenarios
                </a>
                <a 
                  href="#transformation-example" 
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('transformation-example')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="bg-transparent border border-gold text-gold hover:bg-gold/5 px-6 py-3.5 rounded-lg font-sans text-[15.5px] font-semibold transition-colors duration-150 inline-block text-center cursor-pointer shadow-xs"
                >
                  View Example Note Mapping
                </a>
              </div>
              
              {/* TWO TRUST STATEMENTS */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-x-6 gap-y-2 pt-5 border-t border-slate-200/50 mt-5">
                <div className="flex items-center gap-2 text-xs font-semibold text-navy/80">
                  <Check className="w-4 h-4 text-gold shrink-0 stroke-[3px]" />
                  <span>Zero frontline workflow replacement</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-navy/80">
                  <Check className="w-4 h-4 text-gold shrink-0 stroke-[3px]" />
                  <span>Human validation for compliance-flagged findings</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN - VISUAL ANCHOR */}
            <div className="lg:col-span-5 flex flex-col items-center lg:items-end gap-2">
              <span className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-widest self-end pr-1">Illustrative Example</span>
              <HeroRecord />
            </div>

          </div>
        </div>
      </section>

      {/* ==================== 2. PROBLEM ==================== */}
      <section id="problem" className="py-28 md:py-36 bg-off-white border-b border-[#0F172A]/[0.05]">
        <div className="max-w-[1120px] mx-auto px-6 text-left space-y-12">
          
          <div className="space-y-3 max-w-[680px]">
            <span className="font-sans text-[12px] text-[#8B6420] uppercase font-semibold tracking-[0.08em]">
              Strategic Exposure
            </span>
            <h2 className="font-sans font-bold text-[36px] text-navy tracking-tight leading-tight">
              The Problem
            </h2>
            <p className="text-[16px] font-normal text-slate-600 leading-[28px]">
              Frontline social care operations face distinct compliance vulnerabilities under retrospective waiver reviews.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-6 rounded-xl border border-[#0F172A]/[0.06] shadow-xs space-y-3">
              <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold text-xs">!</div>
              <h3 className="font-sans font-semibold text-[20px] text-navy tracking-tight leading-snug">Documentation Inconsistency</h3>
              <p className="text-[16px] font-normal text-slate-500 leading-[26px]">
                Casework data is captured across fragmented screens and forms, leaving records without the standardized narratives needed to defend retrospective audits.
              </p>
            </div>
            {/* Card 2 */}
            <div className="bg-white p-6 rounded-xl border border-[#0F172A]/[0.06] shadow-xs space-y-3">
              <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold text-xs">!</div>
              <h3 className="font-sans font-semibold text-[20px] text-navy tracking-tight leading-snug">Manual Audit Preparation</h3>
              <p className="text-[16px] font-normal text-slate-500 leading-[26px]">
                Compliance teams spend hundreds of hours manually retrieving, organizing, and compiling unstructured logs to respond to state reviews.
              </p>
            </div>
            {/* Card 3 */}
            <div className="bg-white p-6 rounded-xl border border-[#0F172A]/[0.06] shadow-xs space-y-3">
              <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold text-xs">!</div>
              <h3 className="font-sans font-semibold text-[20px] text-navy tracking-tight leading-snug">Reporting Fragmentation</h3>
              <p className="text-[16px] font-normal text-slate-500 leading-[26px]">
                Fragmented workflows prevent organizations from proving compliance or demonstrating service completion levels to external stakeholders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 3. SOLUTION / CAPABILITIES ==================== */}
      <section id="produces" className="py-28 md:py-36 bg-white border-b border-[#0F172A]/[0.05]">
        <div className="max-w-[1120px] mx-auto px-6 text-left space-y-12">
          
          <div className="space-y-3 max-w-[680px]">
            <span className="font-sans text-[12px] text-[#8B6420] uppercase font-semibold tracking-[0.08em]">
              Platform Capabilities
            </span>
            <h2 className="font-sans font-bold text-[36px] text-navy tracking-tight leading-tight">
              Capabilities
            </h2>
            <p className="text-[16px] font-normal text-slate-600 leading-[28px]">
              A single standardized contemporaneous record designed to support multiple downstream uses within the NY Medicaid and SCN reporting context.
            </p>
          </div>

          {/* 3-Column Enterprise Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-[#FAF9F6] p-6 rounded-xl border border-[#0F172A]/[0.06] shadow-xs space-y-3 flex flex-col justify-between hover:border-gold/30 transition-colors">
              <div className="space-y-3">
                <FileCheck2 className="w-6 h-6 text-gold" />
                <h3 className="font-sans font-semibold text-[20px] text-navy tracking-tight leading-snug">Retrospective Review Packages</h3>
                <p className="text-[16px] font-normal text-slate-500 leading-[26px]">
                  Compiled narrative files support compliance with statutory Medicaid recordkeeping rules (6–10 years depending on entity type).
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#FAF9F6] p-6 rounded-xl border border-[#0F172A]/[0.06] shadow-xs space-y-3 flex flex-col justify-between hover:border-gold/30 transition-colors">
              <div className="space-y-3">
                <ShieldCheck className="w-6 h-6 text-gold" />
                <h3 className="font-sans font-semibold text-[20px] text-navy tracking-tight leading-snug">Clinical Quality Indicators</h3>
                <p className="text-[16px] font-normal text-slate-500 leading-[26px]">
                  Structured LOINC screening metrics demonstrate SCN service completion levels.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-[#FAF9F6] p-6 rounded-xl border border-[#0F172A]/[0.06] shadow-xs space-y-3 flex flex-col justify-between hover:border-gold/30 transition-colors">
              <div className="space-y-3">
                <Send className="w-6 h-6 text-gold" />
                <h3 className="font-sans font-semibold text-[20px] text-navy tracking-tight leading-snug">Billing Team Reference Material</h3>
                <p className="text-[16px] font-normal text-slate-500 leading-[26px]">
                  Structured documentation your own billing staff can use to support a claim they are already filing. CCX never files, submits, or transmits anything on your behalf.
                </p>
              </div>
            </div>
          </div>

          <div id="roadmap" className="pt-16 border-t border-[#0F172A]/[0.05] space-y-12">
            <div className="space-y-3 max-w-[680px]">
              <h3 className="font-sans font-bold text-[28px] text-navy tracking-tight leading-tight">
                ON THE ROADMAP
              </h3>
              <p className="text-[16px] font-normal text-slate-600 leading-[28px]">
                Capabilities in active design, not yet in production.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-[#FAF9F6] p-6 rounded-xl border border-[#0F172A]/[0.06] shadow-xs space-y-3 flex flex-col">
                <h4 className="font-sans font-semibold text-[18px] text-navy tracking-tight leading-snug">Pre-Submission Completeness Checks</h4>
                <p className="text-[15px] font-normal text-slate-500 leading-[24px]">
                  Flagging a documentation gap — a screening that would fall under the reimbursable duration threshold, a missing consent record — before submission, not only during retrospective review.
                </p>
              </div>
              <div className="bg-[#FAF9F6] p-6 rounded-xl border border-[#0F172A]/[0.06] shadow-xs space-y-3 flex flex-col">
                <h4 className="font-sans font-semibold text-[18px] text-navy tracking-tight leading-snug">Denial Pattern Analytics</h4>
                <p className="text-[15px] font-normal text-slate-500 leading-[24px]">
                  Network-wide visibility into which documentation gaps are driving denials most often, and where in the network they’re concentrated.
                </p>
              </div>
              <div className="bg-[#FAF9F6] p-6 rounded-xl border border-[#0F172A]/[0.06] shadow-xs space-y-3 flex flex-col">
                <h4 className="font-sans font-semibold text-[18px] text-navy tracking-tight leading-snug">Self-Service Exposure Modeling</h4>
                <p className="text-[15px] font-normal text-slate-500 leading-[24px]">
                  Applying the same sample-extrapolation approach OMIG uses in its own reviews to your own data, so you can see your own exposure estimate before OMIG calculates one for you.
                </p>
              </div>
              <div className="bg-[#FAF9F6] p-6 rounded-xl border border-[#0F172A]/[0.06] shadow-xs space-y-3 flex flex-col">
                <h4 className="font-sans font-semibold text-[18px] text-navy tracking-tight leading-snug">Structured Reporting Export</h4>
                <p className="text-[15px] font-normal text-slate-500 leading-[24px]">
                  Screening data exported in a format built for DOH and funder reporting, not only audit defense.
                </p>
              </div>
              <div className="bg-[#FAF9F6] p-6 rounded-xl border border-[#0F172A]/[0.06] shadow-xs space-y-3 flex flex-col">
                <h4 className="font-sans font-semibold text-[18px] text-navy tracking-tight leading-snug">Network Risk Visibility</h4>
                <p className="text-[15px] font-normal text-slate-500 leading-[24px]">
                  Per-CBO visibility for lead entities managing documentation risk across a subcontracted network.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 4. EVIDENCE ==================== */}
      <section id="transformation-example" className="py-28 md:py-36 bg-off-white border-b border-[#0F172A]/[0.05]">
        <div className="max-w-[1120px] mx-auto px-6 text-left space-y-12">
          
          <div className="space-y-3 max-w-[680px]">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-sans text-[12px] text-[#8B6420] uppercase font-semibold tracking-[0.08em]">
                Evidence Standards
              </span>
              <span className="font-mono text-[9px] text-[#8B6420] bg-gold/10 px-2 py-0.5 rounded font-bold uppercase tracking-widest">
                Illustrative Example
              </span>
            </div>
            <h2 className="font-sans font-bold text-[36px] text-navy tracking-tight leading-tight">
              Casework Entry Standardization
            </h2>
            <p className="text-[16px] font-normal text-slate-600 leading-[28px]">
              Evaluate how CCX parses raw, unformatted casework checklist scribbles from a retrospective export and structures them into fully formatted, reproducible evidence records ready for audit review.
            </p>
          </div>

          <div className="space-y-8">
            {/* Scenario selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
              {PROOF_SCENARIOS.map((scenario, index) => {
                const isActive = selectedScenarioId === scenario.id;
                return (
                  <button
                    key={scenario.id}
                    type="button"
                    onClick={() => setSelectedScenarioId(scenario.id)}
                    aria-pressed={isActive}
                    className={`w-full text-left py-3.5 px-5 rounded-xl font-sans text-xs font-bold flex items-center justify-between border transition-all duration-150 cursor-pointer ${
                      isActive 
                        ? 'bg-[#0F223D] text-white shadow-md border-gold ring-1 ring-gold' 
                        : 'bg-white border-[#E2E8F0] text-navy/70 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <span className={`block text-[10px] uppercase font-bold tracking-wider mb-0.5 ${isActive ? 'text-gold' : 'text-slate-400'}`}>
                        Before / After Example {index + 1}
                      </span>
                      <span className="text-sm font-semibold">{scenario.name}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform duration-150 ${isActive ? 'text-gold translate-x-1' : 'text-slate-400'}`} />
                  </button>
                );
              })}
            </div>

            {/* Before / After side-by-side view */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Unstructured Raw Left */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-xs">
                <div className="space-y-5">
                  <div className="flex items-center justify-between border-b border-navy/[0.06] pb-3.5">
                    <div>
                      <span className="font-sans font-bold text-[10px] text-slate-400 tracking-wider uppercase block">
                        Source Record
                      </span>
                      <span className="font-sans text-xs font-semibold text-navy">
                        Unstructured Casework Note
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-amber-700 font-bold uppercase bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/60 flex items-center gap-1.5">
                      <AlertCircle className="w-3 h-3 text-amber-600" />
                      Frontline Deficit Risk
                    </span>
                  </div>

                  <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/70">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block mb-2">
                      Frontline Entry (Click or Hover to Trace Spans)
                    </span>
                    <div className="font-serif italic text-slate-800 text-[14px] leading-relaxed">
                      &ldquo;
                      {currentScenario.highlightedSpans.map((span, idx) => {
                        if (span.type === 'plain') {
                          return <span key={idx}>{span.text}</span>;
                        }
                        const isHovered = activeProofField === span.fieldId;
                        const isConfirmed = span.type === 'confirmed';
                        return (
                          <mark
                            key={idx}
                            onClick={() => {
                              if (span.fieldId) {
                                setActiveProofField(activeProofField === span.fieldId ? null : span.fieldId);
                              }
                            }}
                            onMouseEnter={() => span.fieldId && setActiveProofField(span.fieldId)}
                            onMouseLeave={() => setActiveProofField(null)}
                            tabIndex={0}
                            role="button"
                            aria-label={`Source span: ${span.text}`}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                if (span.fieldId) {
                                  setActiveProofField(activeProofField === span.fieldId ? null : span.fieldId);
                                }
                              }
                            }}
                            className={`cursor-pointer px-1 py-0.5 rounded transition-all duration-150 not-italic font-sans text-xs font-semibold ${
                              isConfirmed
                                ? isHovered
                                  ? 'bg-emerald-200 text-emerald-950 ring-2 ring-emerald-500 font-bold shadow-xs'
                                  : 'bg-emerald-100 text-emerald-900 border-b-2 border-emerald-500'
                                : isHovered
                                  ? 'bg-amber-200 text-amber-950 ring-2 ring-amber-500 font-bold shadow-xs'
                                  : 'bg-amber-100 text-amber-900 border-b-2 border-amber-500'
                            }`}
                            title={span.label || 'Traceable source span'}
                          >
                            {span.text}
                          </mark>
                        );
                      })}
                      &rdquo;
                    </div>
                  </div>

                  {/* Traceability Span Legend */}
                  <div className="bg-white border border-slate-100 rounded-lg p-3 space-y-2">
                    <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-slate-400 block">
                      Traceability Span Index
                    </span>
                    <div className="flex flex-wrap gap-2 text-[10.5px]">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        Confirmed Spans Mapped to Fields
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        Source Mention Flagged for Missing Proof
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-6 border-t border-navy/[0.06] flex items-center justify-between text-[11px] text-slate-500">
                  <span>Extracted from retrospective casework / SCN EHR export</span>
                  <span className="font-mono text-[10px] text-slate-400">Read-only source entry</span>
                </div>
              </div>

              {/* Structured Right */}
              <div className="bg-[#0B1F3A] text-white rounded-2xl p-6 sm:p-7 border border-white/10 space-y-5 shadow-xl">
                <div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-3.5 mb-4">
                    <div>
                      <span className="font-sans font-bold text-[10px] text-gold tracking-wider uppercase block">
                        Audit-Ready Record Output
                      </span>
                      <span className="text-xs text-white/70">
                        Never introduces new facts · Surfaces gaps explicitly
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9.5px] font-sans text-emerald-300 font-bold uppercase bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                        <Check className="w-3 h-3 stroke-[3px]" /> {currentScenario.confirmedCount} Confirmed
                      </span>
                      <span className="text-[9.5px] font-sans text-amber-300 font-bold uppercase bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/30 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 stroke-[2.5px]" /> {currentScenario.gapCount} Flagged
                      </span>
                    </div>
                  </div>

                  {/* Individual Structured Fields */}
                  <div className="space-y-3">
                    {currentScenario.fields.map((field) => {
                      const isHovered = activeProofField === field.id;
                      const isConfirmed = field.status === 'confirmed';

                      return (
                        <div
                          key={field.id}
                          onClick={() => setActiveProofField(activeProofField === field.id ? null : field.id)}
                          onMouseEnter={() => setActiveProofField(field.id)}
                          onMouseLeave={() => setActiveProofField(null)}
                          tabIndex={0}
                          role="button"
                          aria-label={`Structured field: ${field.label}, status ${field.statusText}`}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setActiveProofField(activeProofField === field.id ? null : field.id);
                            }
                          }}
                          className={`p-3 rounded-xl border transition-all duration-150 cursor-pointer ${
                            isConfirmed
                              ? isHovered
                                ? 'bg-emerald-950/50 border-emerald-400 ring-1 ring-emerald-400'
                                : 'bg-white/[0.04] border-white/10 hover:border-emerald-500/40'
                              : isHovered
                                ? 'bg-amber-950/60 border-amber-400 ring-1 ring-amber-400'
                                : 'bg-amber-950/25 border-amber-500/30 hover:border-amber-400/60'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="font-sans text-[10.5px] font-bold text-white/60 uppercase tracking-wide">
                              {field.label}
                            </span>
                            <span
                              className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded flex items-center gap-1 border ${
                                isConfirmed
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              }`}
                            >
                              {isConfirmed ? (
                                <>
                                  <Check className="w-2.5 h-2.5 stroke-[3px]" />
                                  {field.statusText}
                                </>
                              ) : (
                                <>
                                  <AlertTriangle className="w-2.5 h-2.5 stroke-[2.5px]" />
                                  {field.statusText}
                                </>
                              )}
                            </span>
                          </div>

                          <p
                            className={`font-mono text-[12px] font-semibold ${
                              isConfirmed ? 'text-white' : 'text-amber-200'
                            }`}
                          >
                            {field.value}
                          </p>

                          <p className="text-[11px] text-white/65 mt-1 leading-snug">
                            {field.complianceNote}
                          </p>

                          {/* Source Span Indicator */}
                          {field.sourceSpan ? (
                            <div
                              className={`flex items-start gap-1.5 mt-2.5 text-[10.5px] font-mono px-2.5 py-1.5 rounded-lg border ${
                                isConfirmed
                                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
                                  : 'bg-amber-950/50 text-amber-300 border-amber-500/40'
                              }`}
                            >
                              <CornerDownRight
                                className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                                  isConfirmed ? 'text-emerald-400' : 'text-amber-400'
                                }`}
                              />
                              <div>
                                <span className={`font-semibold block text-[9.5px] uppercase tracking-wider ${
                                  isConfirmed ? 'text-emerald-400' : 'text-amber-400'
                                }`}>
                                  {isConfirmed ? 'Traceable Source Phrase' : 'Source Mention Flagged as Gap'}
                                </span>
                                <span>
                                  &ldquo;{field.sourceSpan}&rdquo;
                                  {!isConfirmed && ' — paper/verbal note is not an electronic HIE consent flag'}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start gap-1.5 mt-2.5 text-[10.5px] font-mono px-2.5 py-1.5 rounded-lg border bg-amber-950/50 text-amber-300 border-amber-500/40">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
                              <div>
                                <span className="font-semibold block text-[9.5px] uppercase tracking-wider text-amber-400">
                                  No Screening Tool Documented
                                </span>
                                <span>
                                  Source note is a caseworker narrative; LOINC code withheld to prevent fabrication
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Standardized Clinical Narrative Restatement */}
                  <div className="space-y-2 pt-4 mt-4 border-t border-white/10">
                    <span className="block text-[10px] font-sans font-bold text-white/50 uppercase tracking-wider">
                      Standardized Clinical Narrative Restatement
                    </span>
                    <div className="bg-white/[0.04] p-3.5 rounded-xl border border-white/10 space-y-3">
                      <p className="font-sans text-white/90 text-xs leading-relaxed">
                        {currentScenario.narrative.restatedText}
                      </p>
                      {currentScenario.narrative.flaggedGaps.length > 0 && (
                        <div className="space-y-1.5 pt-2 border-t border-white/10">
                          {currentScenario.narrative.flaggedGaps.map((gap, gIdx) => (
                            <div
                              key={gIdx}
                              className="text-[11px] font-sans bg-amber-950/40 text-amber-200 border border-amber-500/30 px-2.5 py-1 rounded-md flex items-start gap-2"
                            >
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                              <span>{gap}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 5. WORKFLOW ==================== */}
      <section id="how-it-works" className="py-28 md:py-36 bg-white border-b border-[#0F172A]/[0.05]">
        <div className="max-w-[1120px] mx-auto px-6 text-left space-y-16">
          
          <div className="space-y-3 max-w-[680px]">
            <span className="font-sans text-[12px] text-[#8B6420] uppercase font-semibold tracking-[0.08em]">
              Operational Integration
            </span>
            <h2 className="font-sans font-bold text-[36px] text-navy tracking-tight leading-tight">
              How It Works
            </h2>
            <p className="text-[16px] font-normal text-slate-600 leading-[28px]">
              CCX structures social care encounter data without frontline workflow disruption.
            </p>
          </div>

          {/* Desktop connecting line timeline / mobile stacked */}
          <div className="relative">
            {/* Horizontal Line on Desktop */}
            <div className="hidden md:block absolute top-[28px] left-[10%] right-[10%] h-[1px] bg-slate-200" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
              {/* Step 1 */}
              <div className="space-y-3 text-left">
                <div className="w-14 h-14 bg-gold rounded-full flex items-center justify-center text-white text-base font-bold shadow-md">
                  1
                </div>
                <h3 className="font-sans font-semibold text-[20px] text-navy tracking-tight leading-snug">Frontline Documentation</h3>
                <p className="text-[16px] font-normal text-slate-500 leading-[26px]">
                  Staff continue using their existing systems normally without any new software or interface training.
                </p>
              </div>

              {/* Step 2 */}
              <div className="space-y-3 text-left">
                <div className="w-14 h-14 bg-navy text-white rounded-full flex items-center justify-center text-base font-bold shadow-md">
                  2
                </div>
                <h3 className="font-sans font-semibold text-[20px] text-navy tracking-tight leading-snug">Asynchronous Structuring</h3>
                <p className="text-[16px] font-normal text-slate-500 leading-[26px]">
                  CCX structures raw entries into standardized LOINC and ICD-10 narratives.
                </p>
              </div>

              {/* Step 3 */}
              <div className="space-y-3 text-left">
                <div className="w-14 h-14 bg-[#FAF9F6] border border-navy/20 text-navy rounded-full flex items-center justify-center text-base font-bold shadow-md">
                  3
                </div>
                <h3 className="font-sans font-semibold text-[20px] text-navy tracking-tight leading-snug">Contemporaneous Confirmation</h3>
                <p className="text-[16px] font-normal text-slate-500 leading-[26px]">
                  Findings involving a safety indicator route to a licensed-provider queue for review before any related code is generated.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ==================== 6. BOUNDARIES ==================== */}
      <section id="system-boundaries" className="py-28 md:py-36 bg-off-white border-b border-[#0F172A]/[0.05]">
        <div className="max-w-[1120px] mx-auto px-6 text-left space-y-12">
          
          <div className="space-y-3 max-w-[680px]">
            <span className="font-sans text-[12px] text-[#8B6420] uppercase font-semibold tracking-[0.08em]">
              Logical Separation
            </span>
            <h2 className="font-sans font-bold text-[36px] text-navy tracking-tight leading-tight">
              System Boundaries
            </h2>
            <p className="text-[16px] font-normal text-slate-600 leading-[28px]">
              Clear architectural limits to protect provider authority, member privacy, and technical integrity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch text-left">
            {/* DOES NOT Column */}
            <div className="bg-white border border-red-100 rounded-2xl p-6 md:p-8 space-y-6 flex flex-col shadow-xs">
              <div className="flex items-center gap-2.5 pb-3 border-b border-red-100/60">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 shrink-0" />
                <h3 className="font-sans font-bold text-xs text-[#0B1F3A] uppercase tracking-wider">
                  CCX DOES NOT
                </h3>
              </div>
              
              <div className="space-y-6 flex-1">
                <div className="space-y-1">
                  <h4 className="text-[16px] font-semibold text-navy">Interfere with clinical judgment</h4>
                  <p className="text-[16px] font-normal text-slate-500 leading-[26px]">
                    CCX never prescribes clinical care pathways, alters clinical assessments, or overrides provider authority.
                  </p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-[16px] font-semibold text-navy">Bypass member consent</h4>
                  <p className="text-[16px] font-normal text-slate-500 leading-[26px]">
                    Data processing is strictly blocked unless an explicit, verified HIE consent flag is registered.
                  </p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-[16px] font-semibold text-navy">Automate billing submissions</h4>
                  <p className="text-[16px] font-normal text-slate-500 leading-[26px]">
                    CCX never submits claims directly; files must be reviewed and signed before export.
                  </p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-[16px] font-semibold text-navy">Force software replacement</h4>
                  <p className="text-[16px] font-normal text-slate-500 leading-[26px]">
                    CCX is not an EHR and never replaces or alters existing caseworker intake interfaces.
                  </p>
                </div>
              </div>
            </div>

            {/* DOES Column */}
            <div className="bg-white border border-gold/25 rounded-2xl p-6 md:p-8 space-y-6 flex flex-col shadow-xs">
              <div className="flex items-center gap-2.5 pb-3 border-b border-gold/25">
                <span className="w-2.5 h-2.5 rounded-full bg-gold shrink-0" />
                <h3 className="font-sans font-bold text-xs text-[#0B1F3A] uppercase tracking-wider">
                  CCX DOES
                </h3>
              </div>
              
              <div className="space-y-6 flex-1">
                <div className="space-y-1">
                  <h4 className="text-[16px] font-semibold text-navy">Structure raw narrative text</h4>
                  <p className="text-[16px] font-normal text-slate-500 leading-[26px]">
                    CCX converts free-text casework notes into standard LOINC codes and structured, reproducible evidence records during retrospective review.
                  </p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-[16px] font-semibold text-navy">Never introduce new facts</h4>
                  <p className="text-[16px] font-normal text-slate-500 leading-[26px]">
                    Every generated code, duration flag, or narrative maps back to a specific span of the original entry. CCX restates and structures what the source record already contains; it does not infer, assume, or add anything the frontline worker didn’t write.
                  </p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-[16px] font-semibold text-navy">Verify duration compliance</h4>
                  <p className="text-[16px] font-normal text-slate-500 leading-[26px]">
                    During retrospective review, CCX flags records that fall short of the minimum encounter-duration thresholds required to validate claim eligibility.
                  </p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-[16px] font-semibold text-navy">Route safety-relevant findings for review</h4>
                  <p className="text-[16px] font-normal text-slate-500 leading-[26px]">
                    Every finding CCX surfaces is routed to your compliance team for confirmation before it is treated as final; findings involving a safety indicator are additionally escalated to a licensed-provider queue.
                  </p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-[16px] font-semibold text-navy">Integrate asynchronously</h4>
                  <p className="text-[16px] font-normal text-slate-500 leading-[26px]">
                    Data is ingested from scheduled exports your organization controls, with zero footprint in CBO or SCN platform software — no live connection or API access to any third-party system is required.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 7. TECHNICAL (REGIONAL CONTEXT) ==================== */}
      <section id="regional-context" className="py-24 md:py-32 bg-white border-b border-[#E5E7EB]">
        <div className="max-w-[1120px] mx-auto px-6 space-y-12 text-left">
          
          <div className="space-y-3 max-w-[680px]">
            <span className="font-sans text-[12px] text-[#8B6420] uppercase font-semibold tracking-[0.08em]">
              Jurisdictional Awareness
            </span>
            <h2 className="font-sans font-bold text-[36px] text-navy tracking-tight leading-tight">
              New York coverage
            </h2>
            <p className="text-[16px] font-normal text-slate-600 leading-[28px]">
              Under regional SCN waiver rules, social care delivery is organized across nine distinct footprints. Click on county sectors below to evaluate regional demographic estimates and complexity indicators.
            </p>
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

      {/* ==================== 8. COMPLIANCE (ALIGNMENT) ==================== */}
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
                <span className="text-[10px] font-sans font-bold text-gold uppercase tracking-wider block">CFO &amp; Executive Board</span>
                <h3 className="font-sans font-semibold text-[20px] text-navy tracking-tight leading-snug">Protect SCN Capital Allocations</h3>
                <p className="text-[16px] font-normal text-slate-500 leading-[26px]">
                  Reduce retrospective clawback exposure across your entire capitated panel by correcting narrative deficits.
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
                <span className="text-[10px] font-sans font-bold text-gold uppercase tracking-wider block">Medicaid Compliance</span>
                <h3 className="font-sans font-semibold text-[20px] text-navy tracking-tight leading-snug">Ensure Audit Defensibility</h3>
                <p className="text-[16px] font-normal text-slate-500 leading-[26px]">
                  Secure, reproducible evidence packages compiled through retrospective network review, structured to align with OMIG's own audit format.
                </p>
              </div>
              <div className="pt-3 border-t border-navy/[0.04] mt-3 flex items-center gap-2 text-[10px] font-semibold text-gold">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>Contemporaneous Compliance</span>
              </div>
            </div>

            {/* Card 3: CMO */}
            <div className="bg-[#FAF9F6] border border-[#0F172A]/[0.06] rounded-xl p-5 flex flex-col justify-between shadow-xs hover:border-gold/30 transition-colors">
              <div className="space-y-3">
                <span className="text-[10px] font-sans font-bold text-gold uppercase tracking-wider block">CLINICAL & QUALITY LEADERSHIP</span>
                <h3 className="font-sans font-semibold text-[20px] text-navy tracking-tight leading-snug">Standardize Documentation Terminology</h3>
                <p className="text-[16px] font-normal text-slate-500 leading-[26px]">
                  Map frontline encounter documentation directly to LOINC and ICD-10 SDOH taxonomies automatically.
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
                <span className="text-[10px] font-sans font-bold text-gold uppercase tracking-wider block">CIO &amp; IT Director</span>
                <h3 className="font-sans font-semibold text-[20px] text-navy tracking-tight leading-snug">Minimal Integration Footprint</h3>
                <p className="text-[16px] font-normal text-slate-500 leading-[26px]">
                  Designed to integrate asynchronously without changing your existing EHR setups.
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

      {/* ==================== 9. EXPOSURE ASSESSMENT ==================== */}
      <section id="exposure-review" className="py-28 md:py-36 bg-white border-b border-[#0F172A]/[0.05]">
        <div className="max-w-[1120px] mx-auto px-6 space-y-12">
          
          <div className="space-y-3 max-w-[680px] text-left">
            <span className="font-sans text-[12px] text-[#8B6420] uppercase font-semibold tracking-[0.08em]">
              Compliance Diagnostics
            </span>
            <h2 className="font-sans font-bold text-[36px] text-navy tracking-tight leading-tight">
              Exposure Assessment
            </h2>
            <p className="text-[16px] font-normal text-slate-600 leading-[28px]">
              Evaluate documentation readiness across synthetic encounter scenarios. Select any preset below to instantly review narrative deficit scoring, missing evidence flags, and audit defense recommendations — with zero form fields or sign-in required.
            </p>
          </div>

          {/* Pilot Estimator Form Block */}
          <div className="space-y-8 text-left pt-8 border-t border-slate-200/60">
            <div className="space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="font-sans font-semibold text-lg text-navy">
                  Documentation Compliance Estimator
                </h3>
                <span className="font-mono text-[9px] text-[#8B6420] bg-gold/10 px-2 py-0.5 rounded font-bold uppercase tracking-widest">
                  Illustrative Example
                </span>
              </div>
              
              <div className="p-4 bg-gold/5 border border-gold/30 rounded-xl flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="block font-sans font-bold text-xs text-navy uppercase tracking-wider">
                    Zero-PHI Web Policy: Public Estimator Operates Strictly on Synthetic Presets
                  </span>
                  <p className="text-[11.5px] text-slate-600 leading-relaxed">
                    Browser-based CSV file uploads and open free-text fields are strictly disabled on this public site to eliminate accidental PHI transmission risks. Client caseload spreadsheets contain sensitive caseworker narratives that should never be uploaded over public web forms. You can explore the preset scenarios below freely with zero form fields. Live retrospective assessments on actual network caseloads are performed strictly under an executed Business Associate Agreement (BAA) via enterprise SFTP or secure batch channels.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Interactive Scenario Exploration & Diagnostic Output HUD */}
              <div className="lg:col-span-8 space-y-6">
                <div className="bg-white border border-slate-200/60 rounded-2xl p-6 md:p-8 space-y-6 shadow-xs">
                  
                  {/* Preset Exploration (Zero forms required) */}
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className="block text-[11px] font-bold text-navy uppercase tracking-wider">
                        Select an Encounter Scenario Preset (Zero Form Fields Required)
                      </span>
                      <span className="text-[10px] font-mono text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block w-fit">
                        Instant Preview · No Sign-in · No Email Required to Explore
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
                        Synthetic EHR / Caselog
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
                        Recommended SCN Corrective Strategy:
                      </span>
                      <p className="text-xs text-navy/85 leading-relaxed bg-white p-3.5 rounded-lg border border-[#E2E8F0]/40">
                        {activePreset.correctiveAction}
                      </p>
                    </div>

                    {/* Gated Value Actions */}
                    <div className="pt-5 border-t border-navy/10 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="space-y-0.5">
                          <span className="block text-[11px] font-bold text-navy uppercase tracking-wider">
                            Next Steps for SCN Compliance &amp; Operations Leadership
                          </span>
                          <p className="text-[11px] text-slate-500">
                            Preset scenario exploration above is completely ungated. Work email is only requested when you take an action that has real value to you (downloading the full audit defense blueprint or requesting a live assessment under BAA).
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setGatedAction('report');
                            setGateSubmitted(false);
                          }}
                          className={`p-3.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 border ${
                            gatedAction === 'report'
                              ? 'bg-gold text-white border-gold shadow-xs'
                              : 'bg-white text-navy border-slate-300 hover:border-gold hover:text-gold-text'
                          }`}
                        >
                          <Download className="w-4 h-4 shrink-0" />
                          <span>Download Diagnostic Blueprint (.txt)</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setGatedAction('assessment');
                            setGateSubmitted(false);
                          }}
                          className={`p-3.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 border ${
                            gatedAction === 'assessment'
                              ? 'bg-navy text-white border-navy shadow-xs'
                              : 'bg-white text-navy border-slate-300 hover:border-navy hover:bg-navy/5'
                          }`}
                        >
                          <ArrowRight className="w-4 h-4 shrink-0" />
                          <span>Request Live Assessment on Real Data</span>
                        </button>
                      </div>

                      {/* Gated Form Container */}
                      {gatedAction && (
                        <div className="mt-4 p-5 bg-white border border-gold/40 rounded-xl shadow-xs space-y-4 animate-fade-in">
                          <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                            <div className="space-y-1">
                              <h5 className="font-sans font-bold text-xs text-navy uppercase tracking-wider">
                                {gatedAction === 'assessment'
                                  ? 'Request Live Caseload Retrospective Assessment (Under BAA)'
                                  : 'Dispatch Audit Defense Blueprint (PDF)'}
                              </h5>
                              <p className="text-[11px] text-slate-600 leading-relaxed">
                                {gatedAction === 'assessment'
                                  ? 'Provide your organization credentials below. A CCX compliance director will execute a mutual BAA and configure a secure, de-identified intake directory for your caseload cohort.'
                                  : 'Enter your institutional email to receive the complete deficit analysis, billing threshold crosswalk, and OMIG audit defense protocol for this scenario.'}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setGatedAction(null)}
                              className="text-slate-400 hover:text-navy text-xs font-mono px-2 py-1 rounded cursor-pointer"
                              aria-label="Close form"
                            >
                              ✕
                            </button>
                          </div>

                          {gateSubmitted ? (
                            <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs space-y-2 font-normal">
                              <p className="font-bold flex items-center gap-1.5 text-emerald-900">
                                <Check className="w-4 h-4 stroke-[3px]" />
                                Request Confirmed
                              </p>
                              <p>
                                {gatedAction === 'report'
                                  ? <>Your diagnostic blueprint file has been generated and downloaded. Verification has been logged for <strong>{gateEmail}</strong>.</>
                                  : <>We have logged your live assessment and BAA request for <strong>{gateEmail}</strong>. Our compliance team will follow up within 24 business hours.</>
                                }
                              </p>
                              {gatedAction === 'report' && (
                                <div className="pt-1 flex items-center gap-3">
                                  <button
                                    type="button"
                                    onClick={handleDownloadBlueprint}
                                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                    <span>Download Blueprint File Again (.txt)</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          ) : (
                            <form onSubmit={handleGateSubmit} className="space-y-3.5">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label htmlFor="gate-email" className="block text-[10px] font-bold text-navy uppercase mb-1">
                                    Work Email *
                                  </label>
                                  <input
                                    id="gate-email"
                                    type="email"
                                    required
                                    placeholder="name@institution.org"
                                    value={gateEmail}
                                    onChange={(e) => setGateEmail(e.target.value)}
                                    aria-invalid={gateEmailError ? "true" : "false"}
                                    aria-describedby={gateEmailError ? "gate-email-error" : undefined}
                                    className={`w-full px-3 py-2.5 bg-white border ${
                                      gateEmailError ? 'border-red-500 focus:border-red-500' : 'border-slate-300 focus:border-gold'
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
                                    type="text"
                                    placeholder="e.g., Finger Lakes SCN / CMA Partner"
                                    value={gateOrg}
                                    onChange={(e) => setGateOrg(e.target.value)}
                                    className="w-full px-3 py-2.5 bg-white border border-slate-300 focus:border-gold rounded-lg text-xs outline-none transition-all text-navy"
                                  />
                                </div>
                              </div>

                              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                                <p className="text-[10px] text-slate-400">
                                  No spam. Used strictly to transmit compliance documentation under NDA/BAA.
                                </p>
                                <button
                                  type="submit"
                                  disabled={gateSubmitting}
                                  className="w-full sm:w-auto px-6 py-2.5 bg-navy hover:bg-navy/95 active:translate-y-0.5 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                                >
                                  {gateSubmitting ? (
                                    <>
                                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                      <span>Transmitting...</span>
                                    </>
                                  ) : (
                                    <>
                                      <span>{gatedAction === 'assessment' ? 'Submit Assessment & BAA Request' : 'Send Blueprint to My Inbox'}</span>
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

                  {/* Explicit De-identification Guidance & Downloadable Template */}
                  <div className="border border-[#E2E8F0] rounded-xl p-6 bg-[#FAF8F5] text-left space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
                      <div className="flex items-center gap-2">
                        <FileSpreadsheet className="w-4 h-4 text-gold" />
                        <h5 className="font-sans font-bold text-xs text-navy uppercase tracking-wider">
                          Zero-PHI Web Policy &amp; Safe Harbor Ingestion Protocol
                        </h5>
                      </div>
                      <span className="font-mono text-[9px] font-bold text-[#8B6420] bg-gold/10 px-2 py-0.5 rounded uppercase">
                        HIPAA Safe Harbor Standard (45 CFR § 164.514(b))
                      </span>
                    </div>

                    <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
                      <p>
                        <strong className="text-navy">Why browser uploads are disabled on this site:</strong> Caseload spreadsheets contain unstructured caseworker narratives that represent a severe accidental PHI transmission vector when uploaded through public web forms. To ensure zero exposure, CCX never ingests real-world operational casework through public browser inputs. Live retrospective evaluations are performed strictly under an executed Business Associate Agreement (BAA) via enterprise SFTP or secure batch pipelines.
                      </p>
                      <p>
                        <strong className="text-navy">Mandatory de-identification requirement:</strong> Prior to any offline evaluation or test ingestion, your IT or compliance team must strip all 18 HIPAA Safe Harbor identifiers:
                      </p>
                    </div>

                    {/* All 18 Safe Harbor Identifiers in 3 structured categories */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-[11px]">
                      <div className="bg-white border border-slate-200/80 rounded-lg p-3 space-y-1.5">
                        <span className="font-mono text-[9px] font-bold text-navy uppercase tracking-wider block border-b border-slate-100 pb-1">
                          Direct Personal &amp; Locational (1–6)
                        </span>
                        <ul className="space-y-1 text-slate-600">
                          <li className="flex items-start gap-1.5"><span className="text-red-500 font-bold">✕</span> 1. Patient &amp; relative names</li>
                          <li className="flex items-start gap-1.5"><span className="text-red-500 font-bold">✕</span> 2. Geographic units &lt; State (no street/ZIP)</li>
                          <li className="flex items-start gap-1.5"><span className="text-red-500 font-bold">✕</span> 3. Dates &gt; Year (birth, admit, discharge)</li>
                          <li className="flex items-start gap-1.5"><span className="text-red-500 font-bold">✕</span> 4. Telephone numbers</li>
                          <li className="flex items-start gap-1.5"><span className="text-red-500 font-bold">✕</span> 5. Fax numbers</li>
                          <li className="flex items-start gap-1.5"><span className="text-red-500 font-bold">✕</span> 6. Email addresses &amp; web URLs</li>
                        </ul>
                      </div>

                      <div className="bg-white border border-slate-200/80 rounded-lg p-3 space-y-1.5">
                        <span className="font-mono text-[9px] font-bold text-navy uppercase tracking-wider block border-b border-slate-100 pb-1">
                          Government, Clinical &amp; Plan IDs (7–12)
                        </span>
                        <ul className="space-y-1 text-slate-600">
                          <li className="flex items-start gap-1.5"><span className="text-red-500 font-bold">✕</span> 7. Social Security numbers (SSNs)</li>
                          <li className="flex items-start gap-1.5"><span className="text-red-500 font-bold">✕</span> 8. Medical Record Numbers (MRNs)</li>
                          <li className="flex items-start gap-1.5"><span className="text-red-500 font-bold">✕</span> 9. Health plan beneficiary / CIN numbers</li>
                          <li className="flex items-start gap-1.5"><span className="text-red-500 font-bold">✕</span> 10. Account numbers</li>
                          <li className="flex items-start gap-1.5"><span className="text-red-500 font-bold">✕</span> 11. Certificate / license numbers</li>
                          <li className="flex items-start gap-1.5"><span className="text-red-500 font-bold">✕</span> 12. Vehicle identifiers / license plates</li>
                        </ul>
                      </div>

                      <div className="bg-white border border-slate-200/80 rounded-lg p-3 space-y-1.5">
                        <span className="font-mono text-[9px] font-bold text-navy uppercase tracking-wider block border-b border-slate-100 pb-1">
                          Technical &amp; Biometric Signals (13–18)
                        </span>
                        <ul className="space-y-1 text-slate-600">
                          <li className="flex items-start gap-1.5"><span className="text-red-500 font-bold">✕</span> 13. Device identifiers &amp; serial numbers</li>
                          <li className="flex items-start gap-1.5"><span className="text-red-500 font-bold">✕</span> 14. IP addresses</li>
                          <li className="flex items-start gap-1.5"><span className="text-red-500 font-bold">✕</span> 15. Biometric IDs (finger/voice prints)</li>
                          <li className="flex items-start gap-1.5"><span className="text-red-500 font-bold">✕</span> 16. Full-face photographic images</li>
                          <li className="flex items-start gap-1.5"><span className="text-red-500 font-bold">✕</span> 17. Free-text names in caseworker notes</li>
                          <li className="flex items-start gap-1.5"><span className="text-red-500 font-bold">✕</span> 18. Any other unique identifying code</li>
                        </ul>
                      </div>
                    </div>

                    {/* Expected De-Identified Format Specification Table */}
                    <div className="space-y-2 pt-1">
                      <span className="block font-sans font-bold text-xs text-navy uppercase tracking-wider">
                        Expected Ingestion Schema Specification
                      </span>
                      <div className="overflow-x-auto border border-slate-200 rounded-lg bg-white">
                        <table className="w-full text-left text-[11px] text-slate-600">
                          <thead className="bg-[#FAF8F5] border-b border-slate-200 font-mono text-[9.5px] text-navy uppercase">
                            <tr>
                              <th className="px-3 py-2 font-bold">Field Name</th>
                              <th className="px-3 py-2 font-bold">Type</th>
                              <th className="px-3 py-2 font-bold">Sample Value</th>
                              <th className="px-3 py-2 font-bold">Sanitization Requirement</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-mono text-[10px]">
                            <tr>
                              <td className="px-3 py-1.5 text-navy font-semibold">encounter_id</td>
                              <td className="px-3 py-1.5 text-slate-500">String</td>
                              <td className="px-3 py-1.5 text-gold-text">ENC-00101</td>
                              <td className="px-3 py-1.5 text-slate-500 font-sans">Synthetic pseudo-ID; strip real EHR/CIN numbers.</td>
                            </tr>
                            <tr>
                              <td className="px-3 py-1.5 text-navy font-semibold">service_month_year</td>
                              <td className="px-3 py-1.5 text-slate-500">YYYY-MM</td>
                              <td className="px-3 py-1.5 text-gold-text">2025-03</td>
                              <td className="px-3 py-1.5 text-slate-500 font-sans">Month/year only; exact day stripped per Safe Harbor.</td>
                            </tr>
                            <tr>
                              <td className="px-3 py-1.5 text-navy font-semibold">duration_minutes</td>
                              <td className="px-3 py-1.5 text-slate-500">Integer</td>
                              <td className="px-3 py-1.5 text-gold-text">15</td>
                              <td className="px-3 py-1.5 text-slate-500 font-sans">Contemporaneously documented encounter minutes.</td>
                            </tr>
                            <tr>
                              <td className="px-3 py-1.5 text-navy font-semibold">staff_credential</td>
                              <td className="px-3 py-1.5 text-slate-500">String</td>
                              <td className="px-3 py-1.5 text-gold-text">CHW</td>
                              <td className="px-3 py-1.5 text-slate-500 font-sans">Role title only; strip staff names and individual NPIs.</td>
                            </tr>
                            <tr>
                              <td className="px-3 py-1.5 text-navy font-semibold">service_category</td>
                              <td className="px-3 py-1.5 text-slate-500">String</td>
                              <td className="px-3 py-1.5 text-gold-text">Food Insecurity</td>
                              <td className="px-3 py-1.5 text-slate-500 font-sans">Primary SCN domain (Food, Housing, Transportation).</td>
                            </tr>
                            <tr>
                              <td className="px-3 py-1.5 text-navy font-semibold">raw_casework_narrative</td>
                              <td className="px-3 py-1.5 text-slate-500">Text</td>
                              <td className="px-3 py-1.5 text-gold-text">&ldquo;Visited member. Family ran out of food...&rdquo;</td>
                              <td className="px-3 py-1.5 text-slate-500 font-sans">Sanitized narrative; all names and addresses replaced.</td>
                            </tr>
                            <tr>
                              <td className="px-3 py-1.5 text-navy font-semibold">referral_destination</td>
                              <td className="px-3 py-1.5 text-slate-500">String</td>
                              <td className="px-3 py-1.5 text-gold-text">Valley Harvest Food Bank</td>
                              <td className="px-3 py-1.5 text-slate-500 font-sans">Name of receiving CBO, legal aid, or food pantry.</td>
                            </tr>
                            <tr>
                              <td className="px-3 py-1.5 text-navy font-semibold">consent_documentation_type</td>
                              <td className="px-3 py-1.5 text-slate-500">Enum</td>
                              <td className="px-3 py-1.5 text-gold-text">verbal_unverified</td>
                              <td className="px-3 py-1.5 text-slate-500 font-sans">Documentation flag: verbal, paper, or electronic HIE.</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Download Template Action */}
                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
                      <div className="space-y-0.5">
                        <span className="block font-sans font-bold text-xs text-navy">
                          Download Caseload Ingestion Specification Template
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Pre-formatted CSV schema with synthetic rows, data dictionary comments, and sanitization guidelines.
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleDownloadTemplate}
                        className="px-4 py-2 bg-gold hover:bg-[#B5945F] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Template (.CSV)</span>
                      </button>
                    </div>
                  </div>

                </div>
              </div>

              {/* Right Column: Form-Adjacent Trust Badge Card */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-[#FAF8F5] border border-[#E2E8F0] rounded-2xl p-6 space-y-5 shadow-sm">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-[#E2E8F0]">
                    <ShieldCheck className="w-5 h-5 text-gold" />
                    <h4 className="font-sans font-bold text-xs text-[#0B1F3A] uppercase tracking-wider">
                      Compliance &amp; Data Security Guardrails
                    </h4>
                  </div>

                  {/* Core Procurement Prerequisite Q&A */}
                  <div className="space-y-3.5 text-left border-b border-[#E2E8F0] pb-5">
                    <span className="block font-mono text-[9px] font-bold text-[#8B6420] uppercase tracking-wider">
                      Procurement &amp; Security Quick Clearance
                    </span>

                    {/* Q1: BAA */}
                    <div className="p-3 bg-white rounded-xl border border-emerald-200/80 space-y-1.5 shadow-xs">
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="font-sans text-[11px] font-bold text-navy">
                          (1) Will you sign our BAA?
                        </span>
                        <span className="font-mono text-[8.5px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-300 shrink-0 flex items-center gap-1">
                          <Check className="w-2.5 h-2.5 stroke-[3px]" />
                          YES — Standard BAA
                        </span>
                      </div>
                      <p className="text-[11.5px] text-slate-600 leading-relaxed">
                        <strong className="text-navy">Yes, without exception.</strong> CCX executes standard HIPAA Business Associate Agreements before receiving any data. We sign our pre-approved NY Medicaid BAA or execute your institution&apos;s enterprise BAA.
                      </p>
                    </div>

                    {/* Q2: Hosting & Encryption */}
                    <div className="p-3 bg-white rounded-xl border border-blue-200/80 space-y-1.5 shadow-xs">
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="font-sans text-[11px] font-bold text-navy">
                          (2) Where does data live &amp; encryption?
                        </span>
                        <span className="font-mono text-[8.5px] font-bold uppercase px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-300 shrink-0">
                          US-East · AES-256
                        </span>
                      </div>
                      <p className="text-[11.5px] text-slate-600 leading-relaxed">
                        <strong className="text-navy">100% US-based HIPAA hosting (AWS US-East / GovCloud).</strong> Encrypted at rest using <strong className="text-navy">AES-256</strong> with tenant-isolated KMS keys; encrypted in transit via enforced <strong className="text-navy">TLS 1.3</strong>. Zero foreign hosting or offshore access.
                      </p>
                    </div>

                    {/* Q3: SOC 2 Report */}
                    <div className="p-3 bg-white rounded-xl border border-amber-200/90 space-y-1.5 shadow-xs">
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="font-sans text-[11px] font-bold text-navy">
                          (3) Do you have a SOC 2 report?
                        </span>
                        <span className="font-mono text-[8.5px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-300 shrink-0 flex items-center gap-1">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          IN PROGRESS · Q2 2027
                        </span>
                      </div>
                      <p className="text-[11.5px] text-slate-600 leading-relaxed">
                        <strong className="text-navy">In progress — Type II audit period underway</strong> (target report: Q2 2027 with independent AICPA CPA firm). Under NDA, InfoSec teams can review our completed HIPAA Risk Assessment, Third-Party Penetration Test, and SIG questionnaire.
                      </p>
                    </div>
                  </div>

                  {/* Architecture & Ingestion Guardrails */}
                  <div className="space-y-4 text-left pt-1">
                    <span className="block font-mono text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                      Architecture &amp; Ingestion Guardrails
                    </span>

                    <div className="space-y-1">
                      <span className="block font-sans text-[10px] font-bold text-gold-text uppercase tracking-wider">
                        Retrospective Ingestion Cadence
                      </span>
                      <p className="text-xs text-slate-600 leading-relaxed font-normal">
                        Ingestion runs on a scheduled, batch basis against exported records your organization controls — not a live or continuous connection to any production system.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="block font-sans text-[10px] font-bold text-gold-text uppercase tracking-wider">
                        Documentation Retention Policy
                      </span>
                      <p className="text-xs text-slate-600 leading-relaxed font-normal">
                        CCX adheres to a structured Documentation Retention Policy designed to support statutory recordkeeping mandates (6–10 years depending on entity type) for retrospective audit defense, ensuring that compiled clinical notes are securely archived and indexed.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="block font-sans text-[10px] font-bold text-gold-text uppercase tracking-wider">
                        Audit-Defensible Sign-Off
                      </span>
                      <p className="text-xs text-slate-600 leading-relaxed font-normal">
                        Compilation of human-authorized supervisor signatures identified during retrospective review, supporting audit-ready documentation aligned with OMIG's own review format.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 10. COMPLIANCE & DATA SECURITY GUARDRAILS ==================== */}
      <section id="compliance-guardrails" className="py-28 md:py-36 bg-[#FAF8F5] border-b border-[#0F172A]/[0.05] relative">
        <div id="security-guardrails" className="absolute -top-24" />
        <div className="max-w-[1120px] mx-auto px-6 text-left space-y-16">
          
          <div className="space-y-4 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="font-sans text-[12px] text-[#8B6420] uppercase font-semibold tracking-[0.08em]">
                Healthcare Procurement &amp; InfoSec Clearance
              </span>
              <span className="font-mono text-[9px] text-[#8B6420] bg-gold/10 px-2 py-0.5 rounded font-bold uppercase tracking-widest">
                Direct Reviewer Answers
              </span>
            </div>
            <h2 className="font-sans font-bold text-[36px] text-navy tracking-tight leading-tight">
              Compliance &amp; Data Security Guardrails
            </h2>
            <p className="text-[16px] font-normal text-slate-600 leading-[28px]">
              Direct, unequivocal answers to the three questions healthcare compliance, legal, and security procurement teams ask first — backed by contractual commitments, transparent hosting architecture, and verified audit timelines rather than unexplained marketing badges.
            </p>
          </div>

          {/* Core 3 Procurement Prerequisite Cards */}
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-2">
              <span className="font-mono text-[11px] font-bold text-navy uppercase tracking-wider">
                Part I: Healthcare Compliance &amp; Security Procurement Prerequisites
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-1">
              {/* Tile 1: BAA */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-xs hover:border-emerald-300 transition-colors">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider">Prerequisite 01</span>
                    <span className="font-mono text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                      <Check className="w-3 h-3 stroke-[3px]" />
                      Yes — Standard BAA
                    </span>
                  </div>
                  <h3 className="font-sans font-bold text-base text-navy">
                    (1) Will you sign our Business Associate Agreement (BAA)?
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong className="text-navy font-semibold">Yes, unconditionally.</strong> CCX operates as a HIPAA Business Associate for all SCN Lead Entities, Care Management Agencies (CMAs), and health system partners. We execute standard BAAs prior to ingesting any retrospective data exports.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-200/70 space-y-2 text-[11.5px] text-slate-600">
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Pre-approved NY Medicaid 1115 BAA available for immediate execution</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Willing to sign customer-provided health system enterprise BAAs</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Strict HIPAA Omnibus Rule breach notification commitment (&le;24h)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Zero data ingested without an active, executed BAA in place</span>
                  </div>
                </div>
              </div>

              {/* Tile 2: Hosting & Encryption */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-xs hover:border-blue-300 transition-colors">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider">Prerequisite 02</span>
                    <span className="font-mono text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-300 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      US-Based · AES-256 / TLS 1.3
                    </span>
                  </div>
                  <h3 className="font-sans font-bold text-base text-navy">
                    (2) Where is data hosted, and is it encrypted at rest and in transit?
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong className="text-navy font-semibold">100% US-based HIPAA-compliant infrastructure.</strong> Exclusively hosted in dedicated, tenant-isolated AWS US-East / GovCloud VPCs. Data is encrypted at rest via <strong className="text-navy">AES-256</strong> (with isolated tenant KMS keys) and in transit via enforced <strong className="text-navy">TLS 1.3</strong>.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-200/70 space-y-2 text-[11.5px] text-slate-600">
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span>Dedicated tenant VPC isolation; zero cross-tenant data co-mingling</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span>Strictly zero foreign hosting, offshore engineering, or non-US access</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span>Customer-controlled batch exports; no persistent EHR production hooks</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span>Legacy protocols (TLS 1.0/1.1) disabled at all ingress firewalls</span>
                  </div>
                </div>
              </div>

              {/* Tile 3: SOC 2 */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-xs hover:border-amber-300 transition-colors">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider">Prerequisite 03</span>
                    <span className="font-mono text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-300 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                      In Progress · Q2 2027 Target
                    </span>
                  </div>
                  <h3 className="font-sans font-bold text-base text-navy">
                    (3) Do you have a SOC 2 report or equivalent certification?
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong className="text-navy font-semibold">In progress — not yet completed.</strong> Rather than overstating certification status or hiding behind an ambiguous badge, we state plainly that our SOC 2 Type II audit observation window is currently active with an independent AICPA CPA firm, targeting report issuance in <strong className="text-navy">Q2 2027</strong>.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-200/70 space-y-2 text-[11.5px] text-slate-600">
                  <div className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>Completed HIPAA Security &amp; Privacy Risk Assessment (available under NDA)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>Independent third-party network penetration test summary report</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>Standardized Information Gathering (SIG) questionnaire / CAIQ completed</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>Written Information Security Program (WISP) &amp; Incident Response Plan</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Part II: Architecture & Ingestion Guardrails (Cadence, Retention, Sign-Off) */}
          <div className="space-y-6 pt-4">
            <div className="border-b border-slate-200 pb-2">
              <span className="font-mono text-[11px] font-bold text-navy uppercase tracking-wider">
                Part II: Operational Architecture &amp; Ingestion Guardrails
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-1">
              {/* Tile 4: Ingestion Cadence */}
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
                  Ingestion runs on a scheduled, batch basis against exported records your organization controls — not a live or continuous connection to any production system. CCX does not install agents or open persistent read/write sockets into your EHR.
                </p>
              </div>

              {/* Tile 5: Retention Policy */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider">Guardrail 02</span>
                  <span className="font-mono text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    6–10 Year Statutory Archival
                  </span>
                </div>
                <h4 className="font-sans font-bold text-base text-navy">
                  Documentation Retention Policy
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  CCX adheres to a structured Documentation Retention Policy designed to support statutory recordkeeping mandates (6–10 years depending on entity type) for retrospective audit defense, ensuring that compiled clinical notes are securely archived and indexed in immutable WORM storage.
                </p>
              </div>

              {/* Tile 6: Audit-Defensible Sign-Off */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider">Guardrail 03</span>
                  <span className="font-mono text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    Human Supervisor Verification
                  </span>
                </div>
                <h4 className="font-sans font-bold text-base text-navy">
                  Audit-Defensible Sign-Off
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Compilation of human-authorized supervisor signatures identified during retrospective review, supporting audit-ready documentation aligned with OMIG's own review format. Every finding requires human clinical sign-off.
                </p>
              </div>
            </div>
          </div>

          {/* Action CTA Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
            <div className="space-y-1 max-w-xl">
              <h4 className="font-sans font-bold text-base text-navy">
                Need Our Full Vendor Security Packet &amp; Standard BAA?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                We provide our pre-approved NY Medicaid 1115 BAA, SIG questionnaire, and third-party penetration test summary directly to healthcare compliance and procurement teams under mutual NDA.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-navy text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Ingestion Template (.CSV)</span>
              </button>
              <a
                href="#contact"
                className="w-full sm:w-auto px-5 py-2.5 bg-gold hover:bg-[#B5945F] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Request BAA &amp; Security Packet</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* ==================== 11. FAQS SECTION ==================== */}
      <section id="faq" className="py-24 md:py-32 bg-off-white border-b border-[#E5E7EB]">
        <div className="max-w-[760px] mx-auto px-6 text-left space-y-12">
          
          <div className="space-y-3 max-w-[680px]">
            <span className="font-sans text-[12px] text-[#8B6420] uppercase font-semibold tracking-[0.08em]">
              Procurement Help
            </span>
            <h2 className="font-sans font-bold text-[36px] text-navy tracking-tight leading-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-[16px] font-normal text-slate-600 leading-[28px]">
              Factual, direct answers to common questions raised by SCN Executives, Compliance Directors, and operations leads during system evaluation.
            </p>
          </div>

          {/* Accordion list */}
          <div className="space-y-3 pt-4">
            {FAQ_ITEMS.map((faq, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div 
                  key={idx} 
                  className={`border rounded-xl overflow-hidden transition-all duration-300 ${
                    isOpen 
                      ? 'border-gold bg-gold/[0.02] shadow-md shadow-gold/[0.02] ring-1 ring-gold/15' 
                      : 'border-[#E2E8F0] bg-white hover:border-[#CBD5E1] hover:bg-[#FAFAF8]/50 hover:shadow-xs'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${idx}`}
                    className="w-full p-4.5 text-left font-sans text-xs md:text-sm font-bold text-navy flex justify-between items-center gap-4 cursor-pointer transition-colors"
                  >
                    <span className="leading-snug">{faq.question}</span>
                    <ChevronDown className={`w-4.5 h-4.5 text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? 'transform rotate-180 text-gold stroke-[2.5px]' : ''}`} />
                  </button>
                  
                  {isOpen && (
                    <div 
                      id={`faq-answer-${idx}`}
                      className="p-4.5 border-t border-[#E2E8F0] bg-white text-xs md:text-sm text-navy/80 leading-relaxed font-normal"
                    >
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ==================== 11. ABOUT CCX & CORPORATE SUBSTANCE ==================== */}
      <AboutCcx 
        onNavigateToSection={(id) => {
          setActiveSection(id);
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }}
      />

      {/* ==================== 12. REQUEST EXPOSURE ASSESSMENT BRIEFING ==================== */}
      <section id="contact" className="py-24 md:py-32 bg-off-white">
        <div className="max-w-[640px] mx-auto px-6 text-left space-y-8">
          
          <div className="space-y-3 text-center sm:text-left max-w-[680px]">
            <span className="font-sans text-[12px] text-[#8B6420] uppercase font-semibold tracking-[0.08em] block">
              Secure Alignment
            </span>
            <h2 className="font-sans font-bold text-[36px] text-navy tracking-tight leading-tight">
              Request an Exposure Assessment
            </h2>
            <div className="text-[16px] font-normal text-slate-600 leading-[28px]">
              Request a no-cost sample exposure analysis on de-identified data from your own network — no commitment required. OMIG’s extrapolation methodology can turn a small sample into a large recovery: in{' '}
              <CitationPopover
                id="contact-fast-help-citation"
                citationNumber={2}
                badge="JUDICIAL PRECEDENT"
                title="Matter of Fast Help Ambulette, Inc. v. NYS Dept. of Health"
                subtitle="199 A.D.3d 1152, 157 N.Y.S.3d 575 (N.Y. App. Div. 3d Dept. 2021)"
                sourceName="New York Supreme Court, Appellate Division, Third Department"
                details={[
                  "Sample Disallowance: OMIG audited a 150-claim random sample from 15,420 total Medicaid claims and identified $3,355 in disallowed billing errors (missing contemporaneous logs and signature timing gaps).",
                  "Statistical Extrapolation: Using ratio estimation across the full 15,420-claim population, OMIG extrapolated the $3,355 sample disallowance into an enforceable $1,130,865 repayment demand.",
                  "Appellate Holding: The court affirmed OMIG's statutory authority under 18 NYCRR § 519.18 to extrapolate overpayments across the entire claim universe, even when the underlying sample errors appear minor."
                ]}
                links={[
                  {
                    label: "View Appellate Division Decision (199 A.D.3d 1152)",
                    url: "https://casetext.com/case/matter-of-fast-help-ambulette-inc-v-new-york-state-dept-of-health"
                  }
                ]}
              >
                Matter of Fast Help Ambulette, Inc. v. NYS DOH (2021)
              </CitationPopover>
              , a 150-claim sample that found $3,355 in actual overpayments was extrapolated into a $1.1M recovery demand against the full claim population. That case involved a transportation vendor, not an HRSN network — the relevance here is the extrapolation math, not the provider type.
            </div>

            {/* Source Footnote Indicator for Case Precedent */}
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 font-mono">
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('open-citation', { detail: { id: 'contact-fast-help-citation' } }));
                }}
                className="font-bold text-[#8B6420] hover:text-navy px-1.5 py-0.5 bg-gold/15 hover:bg-gold/25 border border-gold/40 rounded text-[10px] cursor-pointer transition-colors"
                title="Click or hover case above to open judicial precedent details"
              >
                [2]
              </button>
              <span>Case Citation: 199 A.D.3d 1152 (3d Dept. 2021); 18 NYCRR § 519.18 (Extrapolation).</span>
              <a
                href="https://casetext.com/case/matter-of-fast-help-ambulette-inc-v-new-york-state-dept-of-health"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#8B6420] hover:text-navy underline underline-offset-2 decoration-gold/40 hover:decoration-navy font-sans font-medium transition-colors"
              >
                <span>Read Court Opinion</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="bg-white border border-[#0F172A]/[0.06] rounded-2xl p-6 md:p-8 shadow-xs">
            {contactSubmitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-12 h-12 bg-gold/5 rounded-full flex items-center justify-center mx-auto text-gold border border-gold/20 shadow-xs">
                  <Check className="w-6 h-6 stroke-[3px]" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-sans font-bold text-lg text-navy">Assessment Request Registered</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Thank you. Our compliance team will compile a custom de-identified SCN footprint modeling and contact you at <strong>{contactEmail}</strong> within 24 hours to coordinate.
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
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-[10px] font-bold text-navy uppercase tracking-wider mb-1">
                      Name
                    </label>
                    <input
                      id="contact-name"
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
                    Briefing Requirements
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    placeholder="Specify county profiles or integration priorities (EPIC, Salesforce, Oracle, etc.). Ensure no member PHI is submitted."
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-[#0F172A]/[0.08] focus:border-gold focus:ring-1 focus:ring-gold/20 rounded-lg text-xs outline-none transition-all text-navy resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={contactSubmitting || !contactEmail}
                  className="w-full py-3.5 bg-gold hover:bg-[#B5945F] active:translate-y-0.5 transition-all text-white text-[16px] font-semibold rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-gold/5 disabled:opacity-50"
                >
                  {contactSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Scheduling Assessment...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 text-white" />
                      <span>Request Exposure Assessment</span>
                    </>
                  )}
                </button>
              </form>
            )}
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
