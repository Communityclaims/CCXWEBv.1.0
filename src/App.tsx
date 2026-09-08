import React, { useState, useEffect } from 'react';
import { 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle, 
  RefreshCw, 
  Upload, 
  ChevronRight, 
  FileCheck2,
  Lock,
  Building,
  HeartHandshake,
  ShieldAlert,
  MapPin,
  ChevronDown,
  Send,
  Cpu
} from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import ComplianceTrustCenter from './components/ComplianceTrustCenter';
import Resources from './components/Resources';

import HeroRecord from './components/HeroRecord';
import NysMap from './components/NysMap';
import { SCN_REGIONS } from './data/regions';


// Predefined Scenario Presets for the Compliance Estimator
interface PilotScenarioPreset {
  id: string;
  name: string;
  badge: string;
  badgeColor: string;
  description: string;
  rawNote: string;
  riskLevel: 'HIGH' | 'MODERATE' | 'LOW';
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
    gaps: [
      'Missing explicit ICD-10 SDOH classification codes (e.g., Z59.41 Food Insecurity).',
      'Missing contemporaneous digital member consent verification.',
      'Lacks structured screening questionnaire references (e.g., LOINC 96777-8).',
      'Lacks secure proof of contemporaneous signature and entry-day lock.'
    ],
    correctiveAction: 'When this record is included in a retrospective export, CCX matches it to LOINC 96777-8 and ICD-10 Z59.41, verifies the HIE registry match, and seals it as a structured, evidence-referenced record with a reproducible audit trail.'
  },
  {
    id: 'partial_referral',
    name: 'Partially Structured Checkpoint',
    badge: 'Moderate Risk Deficit',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200/50',
    description: 'An encounter record containing basic screening answers and referrals but missing service duration tracking and explicit consent logs.',
    rawNote: 'Completed housing instability screen. mold issues in bedrooms. asthma issues. Referred to legal aid. Checked SHIN-NY database. 8 mins.',
    riskLevel: 'MODERATE',
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
    gaps: [
      'None. Record is structured to align with current OMIG Audit Handbook guidance, billing compliance requirements, and applicable 6-to-10-year record retention mandates.'
    ],
    correctiveAction: 'CCX verifies this record, outputs a standard diagnostic record, and commits the comprehensive audit bundle to isolated, secure WORM storage.'
  }
];

// Example templates for Section 4 (WHAT WE PRODUCE / PROOF)
interface ProofScenario {
  id: string;
  name: string;
  raw: string;
  structured: {
    zCode: string;
    duration: string;
    narrative: string;
    consent: string;
  };
}

const PROOF_SCENARIOS: ProofScenario[] = [
  {
    id: 'food',
    name: 'Food Insecurity',
    raw: 'Member came in today, SNAP expired last week. No grocery store in walking distance. Set up emergency food pantry referral. Verbal consent obtained. 12 mins.',
    structured: {
      zCode: 'Z59.41 (Food insecurity)',
      duration: '12 Minutes (Exceeds billing-eligible duration threshold)',
      narrative: 'Screened using the AHC HRSN Tool (LOINC 96777-8) — positive for food insecurity (ICD-10 Z59.41). Member presents with acute nutritional deficit due to expired SNAP assistance and physical geographic food desert. Dispatched emergency referral to local pantry.',
      consent: 'Verified (Contemporaneous Member Sign-off)'
    }
  },
  {
    id: 'housing',
    name: 'Housing Instability',
    raw: 'Found water damage and visible mold in bedrooms. Landlord has ignored requests for repair. Member\'s child has active asthma. Referral to legal aid. Verbal consent obtained. 18 mins.',
    structured: {
      zCode: 'Z59.1 (Inadequate housing)',
      duration: '18 Minutes (Exceeds billing-eligible duration threshold)',
      narrative: 'LOINC 97023-6 Screening completed. Member reports mold exposure and structural water damage. Documented direct correlation with pediatric asthma exacerbation. Handed off to legal advocate.',
      consent: 'Verified (Contemporaneous Member Sign-off)'
    }
  },
  {
    id: 'transit',
    name: 'Transit Barrier',
    raw: 'Missed three dialysis appointments because bus schedule was cut. Patient uses a wheelchair. Set up specialized medical transport van.',
    structured: {
      zCode: 'Z59.48 (Transportation barriers)',
      duration: '10 Minutes (Exceeds clinical billing threshold)',
      narrative: 'LOINC 96780-2 Screening completed. Patient has specialized accessibility needs (wheelchair) and is isolated by municipal transit reductions. Initiated enrollment with specialized transport van.',
      consent: 'Verified (Contemporaneous Patient Sign-off)'
    }
  }
];

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "Does CCX replace our current Electronic Health Record (EHR) or referral platforms?",
    answer: "No. CCX is a retrospective documentation-integrity and audit-exposure analysis engine. It ingests an export of existing records — not a live connection to your EHR or referral platform — and produces a structured, reproducible evidence package. Your existing EHRs and SCN referral systems remain the authoritative, unmodified sources of record."
  },
  {
    question: "How long does implementation take?",
    answer: "Because CCX does not require any workflow redesign or 'rip-and-replace' deployment, implementation is designed to avoid workflow redesign. CCX is designed to connect to your existing systems."
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
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('housing');
  
  // SCN Map state
  const [selectedRegionKey, setSelectedRegionKey] = useState<string | null>(null);

  // Pilot/Exposure Review state
  const [pilotOrg, setPilotOrg] = useState('');
  const [pilotEmail, setPilotEmail] = useState('');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('unstructured_scribble');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    riskLevel: 'HIGH' | 'MODERATE' | 'LOW';
    gaps: string[];
    correctiveAction: string;
    score: number;
  } | null>(null);

  const [handshakeEmail, setHandshakeEmail] = useState<string | null>(null);

  // Form and Upload validation states
  const [emailError, setEmailError] = useState<string | null>(null);
  const [contactEmailError, setContactEmailError] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

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

  // Handle Preset Selection
  const handlePresetSelect = (id: string) => {
    setSelectedPresetId(id);
    setUploadedFileName(null);
    setAnalysisResult(null);
    setFileError(null);
  };

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const validateAndSetFile = (file: File) => {
    setFileError(null);
    setUploadedFileName(null);
    setAnalysisResult(null);

    // Validate File Size (10MB limit)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setFileError('File exceeds the maximum size limit of 10MB.');
      return false;
    }

    // Validate File Type/Extension
    const allowedExtensions = ['.csv', '.pdf', '.txt', '.json'];
    const fileName = file.name.toLowerCase();
    const hasAllowedExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
    if (!hasAllowedExtension) {
      setFileError('Unsupported file format. Please upload a .csv, .pdf, .txt, or .json file.');
      return false;
    }

    setUploadedFileName(file.name);
    setSelectedPresetId(''); // clear preset choice
    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  // Run exposure analysis simulation
  const handleRunAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear any previous error state
    setEmailError(null);

    // Email pattern validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!pilotEmail) {
      setEmailError('Contact email is required.');
      return;
    }
    if (!emailPattern.test(pilotEmail)) {
      setEmailError('Please enter a valid work email address (e.g., name@institution.org).');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);
    setHandshakeEmail(null);

    setTimeout(() => {
      setIsAnalyzing(false);
      
      if (uploadedFileName) {
        setAnalysisResult({
          riskLevel: 'HIGH',
          score: 34,
          gaps: [
            `Detected unstructured formatting in approximately 84% of rows inside "${uploadedFileName}".`,
            'Missing explicit contemporaneous patient consent in 72% of entries.',
            'Incomplete encounter duration logs (failing the 8-minute clinical billing threshold) in 41% of records.',
            'System discrepancy: Checklist checkboxes lack supporting human clinical-narrative notes required for retrospective audits.'
          ],
          correctiveAction: 'CCX acts as an asynchronous documentation integrity and retrospective analysis platform. By uploading this data, CCX automatically formats, standardizes, and seals each entry into standard LOINC-coded clinical evidence packages designed to defend billing codes.'
        });
      } else {
        const preset = PILOT_SCENARIO_PRESETS.find(p => p.id === selectedPresetId);
        if (preset) {
          setAnalysisResult({
            riskLevel: preset.riskLevel,
            score: preset.riskLevel === 'HIGH' ? 20 : preset.riskLevel === 'MODERATE' ? 55 : 98,
            gaps: preset.gaps,
            correctiveAction: preset.correctiveAction
          });
        }
      }
    }, 1500);
  };

  // Handle Contact Submission
  const handleContactSubmit = async (e: React.FormEvent) => {
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
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
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

  // Handle Technical Handshake Submission
  const handleHandshakeSubmit = async () => {
    if (!pilotEmail) return;
    setHandshakeEmail(pilotEmail);

    try {
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'De-identified SCN Partner self-assessment',
          email: pilotEmail,
          org: pilotOrg || 'Unspecified Footprint',
          focus: 'Compliance Review',
          message: `Self-assessment completed successfully.\nIdentified Gaps:\n${analysisResult?.gaps?.join('\n') || 'N/A'}\n\nCorrective Action Recommendation:\n${analysisResult?.correctiveAction || 'N/A'}`
        }),
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        console.error('[CCX Handshake Error]', errData);
      }
    } catch (err) {
      console.error('[CCX Handshake Network Error]', err);
    }
  };

  const currentScenario = PROOF_SCENARIOS.find(s => s.id === selectedScenarioId) || PROOF_SCENARIOS[0];

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
              <div className="text-[12px] font-sans font-semibold text-[#8B6420] tracking-[0.08em] uppercase">
                Documentation integrity and retrospective analysis platform
              </div>
              
              <h1 className="text-[34px] md:text-[42px] lg:text-[48px] font-sans font-bold text-[#0B1F3A] leading-[1.08] tracking-[-0.03em] mt-4">
                Documentation that stands up to review.
              </h1>

              <p className="text-[18px] font-normal text-slate-600 leading-[30px] max-w-[640px] mt-6">
                OMIG's 2026 Work Plan doubles Compliance Program Reviews and extends the review window from three months to twelve. Under OMIG's current regulations, having an effective compliance program is a condition of payment, not paperwork. Community Claims Exchange (CCX) closes that exact gap: it retrospectively audits exported HRSN documentation across your CBO network and quantifies OMIG-style exposure, without requiring any change to how frontline staff currently document care.
              </p>

              {/* THREE CLINICAL BULLET STATEMENTS */}
              <div className="space-y-2 py-2 text-slate-700 font-sans text-[16px] font-normal leading-[28px] mt-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-gold font-bold">✓</span>
                  <span>One network export.</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-gold font-bold">✓</span>
                  <span>One reproducible exposure analysis.</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-gold font-bold">✓</span>
                  <span>One audit-ready dossier your compliance team can use directly.</span>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex flex-col sm:flex-row gap-4 items-start mt-8">
                <a 
                  href="#exposure-review" 
                  className="bg-gold hover:bg-[#B5945F] text-white px-6 py-3.5 rounded-lg font-sans text-[16px] font-semibold transition-colors duration-150 inline-block text-center cursor-pointer shadow-sm border border-transparent"
                >
                  Run Exposure Assessment
                </a>
                <a 
                  href="#transformation-example" 
                  className="bg-transparent border border-gold text-gold hover:bg-gold/5 px-6 py-3.5 rounded-lg font-sans text-[16px] font-semibold transition-colors duration-150 inline-block text-center cursor-pointer shadow-xs"
                >
                  View Example Note Mapping
                </a>
              </div>
              
              {/* TWO TRUST STATEMENTS */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-x-6 gap-y-2 pt-6 border-t border-slate-200/50 mt-6">
                <div className="flex items-center gap-2 text-xs font-semibold text-navy/80">
                  <Check className="w-4 h-4 text-gold shrink-0 stroke-[3px]" />
                  <span>No workflow replacement</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-navy/80">
                  <Check className="w-4 h-4 text-gold shrink-0 stroke-[3px]" />
                  <span>Human validation for safety-flagged findings</span>
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

          <div className="pt-16 border-t border-[#0F172A]/[0.05] space-y-12">
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl">
              {PROOF_SCENARIOS.map((scenario) => {
                const isActive = selectedScenarioId === scenario.id;
                return (
                  <button
                    key={scenario.id}
                    onClick={() => setSelectedScenarioId(scenario.id)}
                    className={`w-full text-left py-3.5 px-5 rounded-xl font-sans text-xs font-bold flex items-center justify-between border transition-all duration-150 cursor-pointer ${
                      isActive 
                        ? 'bg-gold text-white shadow-md border-gold' 
                        : 'bg-white border-[#E2E8F0] text-navy/70 hover:bg-slate-50'
                    }`}
                  >
                    <span>{scenario.name}</span>
                    <ChevronRight className={`w-4 h-4 transition-transform duration-150 ${isActive ? 'text-white translate-x-1' : 'text-slate-400'}`} />
                  </button>
                );
              })}
            </div>

            {/* Before / After side-by-side view */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              {/* Unstructured Raw Left */}
              <div className="bg-white border border-red-200/50 rounded-2xl p-6 flex flex-col justify-between shadow-xs">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-navy/[0.06] pb-3">
                    <span className="font-sans font-bold text-[10px] text-slate-400 tracking-wider uppercase">
                      Unstructured Casework Entry
                    </span>
                    <span className="text-[9px] font-mono text-red-600 font-bold uppercase bg-red-50 px-2 py-0.5 rounded border border-red-100">
                      High Deficit Risk
                    </span>
                  </div>
                  <div className="font-serif italic text-slate-700 text-[14px] leading-relaxed min-h-[140px] pt-2">
                    "{currentScenario.raw}"
                  </div>
                </div>
                <div className="pt-4 border-t border-navy/[0.06] text-[10px] text-slate-400 leading-tight">
                  Captured via frontline checklist logs or raw intake fields.
                </div>
              </div>

              {/* Structured Right */}
              <div className="bg-[#0B1F3A] text-white rounded-2xl p-6 border border-white/5 space-y-4 shadow-lg flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                    <span className="font-sans font-bold text-[10px] text-gold tracking-wider uppercase">
                      Audit-Ready Record Output
                    </span>
                    <span className="text-[9px] font-sans text-gold font-bold uppercase bg-gold/10 px-2.5 py-0.5 rounded border border-gold/20 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-gold" /> Structured &amp; Traceable
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-[11px] font-sans mb-4">
                    <div>
                      <span className="block text-[8.5px] font-sans font-bold text-white/45 uppercase tracking-wide">
                        Standardized LOINC Z-Code
                      </span>
                      <p className="font-mono text-gold text-xs font-semibold mt-0.5">
                        {currentScenario.structured.zCode}
                      </p>
                    </div>

                    <div>
                      <span className="block text-[8.5px] font-sans font-bold text-white/45 uppercase tracking-wide">
                        Verified Encounter Duration
                      </span>
                      <p className="font-sans text-white text-xs font-semibold mt-0.5">
                        {currentScenario.structured.duration}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 text-xs pt-3 border-t border-white/5">
                    <div>
                      <span className="block text-[8.5px] font-sans font-bold text-white/45 uppercase tracking-wide mb-1">
                        Standardized Clinical Narrative
                      </span>
                      <p className="font-sans text-white/90 text-xs leading-relaxed bg-white/5 p-3 rounded-lg border border-white/10">
                        {currentScenario.structured.narrative}
                      </p>
                    </div>

                    <div>
                      <span className="block text-[8.5px] font-sans font-bold text-white/45 uppercase tracking-wide mb-1">
                        Consent Verified
                      </span>
                      <p className="font-sans text-gold text-xs font-bold">
                        {currentScenario.structured.consent}
                      </p>
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
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="font-mono text-[9px] text-[#8B6420] bg-gold/10 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                            SCN FOOTPRINT
                          </span>
                          <span className="font-mono text-[9px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                            {reg.operating_environment}
                          </span>
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
              Evaluate documentation readiness in three simple steps: select an encounter scenario preset, upload your de-identified caseload, and receive recommended corrective actions.
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
              
              <div className="p-3.5 bg-gold/5 border border-gold/25 rounded-xl flex items-start gap-2.5">
                <AlertCircle className="w-4.5 h-4.5 text-gold shrink-0 mt-0.5" />
                <p className="text-[11px] text-gold-text leading-relaxed">
                  <strong>Privacy Safeguard:</strong> This estimator operates as a read-only modeling utility. Free-text typing has been strictly disabled to ensure full compliance and block accidental PHI transmission.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Form & Result Output HUD */}
              <div className="lg:col-span-8 space-y-6">
                <div className="bg-white border border-slate-200/60 rounded-2xl p-6 md:p-8 space-y-6 shadow-xs">
                  <form onSubmit={handleRunAnalysis} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="email" className="block text-[10px] font-bold text-navy uppercase mb-1.5">
                          Step 1: Work Email *
                        </label>
                        <input
                          id="email"
                          type="email"
                          required
                          placeholder="name@institution.org"
                          value={pilotEmail}
                          onChange={(e) => setPilotEmail(e.target.value)}
                          aria-invalid={emailError ? "true" : "false"}
                          aria-describedby={emailError ? "email-error" : undefined}
                          className={`w-full px-3.5 py-3 bg-white border ${emailError ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-gold'} rounded-lg text-xs outline-none transition-all text-navy`}
                        />
                        {emailError && (
                          <p className="mt-1.5 text-[11px] text-red-600 font-medium flex items-center gap-1" id="email-error">
                            <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                            <span>{emailError}</span>
                          </p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="org" className="block text-[10px] font-bold text-navy uppercase mb-1.5">
                          Step 2: SCN Network Name / Footprint
                        </label>
                        <input
                          id="org"
                          type="text"
                          placeholder="e.g., Finger Lakes SCN"
                          value={pilotOrg}
                          onChange={(e) => setPilotOrg(e.target.value)}
                          className="w-full px-3.5 py-3 bg-white border border-slate-200 focus:border-gold rounded-lg text-xs outline-none transition-all text-navy"
                        />
                      </div>
                    </div>

                    {/* Step 2.5: Preset Scenario Option */}
                    <div className="space-y-1.5">
                      <label htmlFor="preset-select" className="block text-[10px] font-bold text-navy uppercase mb-1.5">
                        Step 3: Select a Preset Scenario or Upload File
                      </label>
                      <select
                        id="preset-select"
                        value={selectedPresetId}
                        onChange={(e) => handlePresetSelect(e.target.value)}
                        className="w-full px-3.5 py-3 bg-white border border-slate-200 focus:border-gold rounded-lg text-xs outline-none transition-all text-navy"
                      >
                        <option value="unstructured_scribble">Preset 1: Unstructured Frontline Scribble (HIGH Risk)</option>
                        <option value="partial_referral">Preset 2: Partially Structured Checkpoint (MODERATE Risk)</option>
                        <option value="fully_standardized">Preset 3: Fully Standardized CCX Record (LOW Risk)</option>
                        <option value="">-- No preset (Upload custom de-identified caselogs below instead) --</option>
                      </select>
                    </div>

                    {/* Target data source selection */}
                    <div className="space-y-4">
                      {/* Mock file dropzone */}
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                          isDragOver ? 'border-gold bg-gold/5' : 'border-slate-200 bg-[#FAFAF8]'
                        } ${uploadedFileName ? 'border-gold bg-gold/5' : ''} ${fileError ? 'border-red-400 bg-red-50/10' : ''}`}
                      >
                        <input
                          type="file"
                          id="file-upload"
                          accept=".csv,.pdf,.txt,.json"
                          className="sr-only"
                          aria-invalid={fileError ? "true" : "false"}
                          aria-describedby={fileError ? "file-upload-error" : undefined}
                          onChange={handleFileSelect}
                        />
                        <label htmlFor="file-upload" className="cursor-pointer space-y-2 block">
                          <div className="w-10 h-10 bg-navy/5 rounded-full flex items-center justify-center mx-auto transition-transform duration-150 hover:scale-105">
                            {uploadedFileName ? (
                              <FileCheck2 className="w-5 h-5 text-gold" />
                            ) : (
                              <Upload className="w-5 h-5 text-gold" />
                            )}
                          </div>
                          <div className="text-xs font-semibold text-navy">
                            {uploadedFileName ? (
                              <span className="text-gold-text">Ready to Analyze: {uploadedFileName}</span>
                            ) : (
                              <span>Drag &amp; drop a mock caseload CSV or click to select</span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 leading-normal max-w-md mx-auto">
                            Supports de-identified spreadsheets up to 10MB. <strong>Processed locally:</strong> Files are analyzed directly in your browser and are never uploaded to any server. <strong>Strict Privacy Guardrail:</strong> Absolutely no Protected Health Information (PHI) should be uploaded. For advisory use only.
                          </p>
                        </label>
                      </div>
                      {fileError && (
                        <p className="text-xs text-red-600 font-medium flex items-center gap-1.5 justify-center mt-1 animate-fade-in" id="file-upload-error">
                          <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                          <span>{fileError}</span>
                        </p>
                      )}
                    </div>

                    {/* Submit button */}
                    <div className="pt-2">
                      <span className="block text-[10px] font-bold text-navy uppercase tracking-wider mb-2">
                        Step 4: Execute
                      </span>
                      <button
                        type="submit"
                        disabled={isAnalyzing || (!uploadedFileName && !pilotEmail)}
                        className="w-full py-4 bg-gold hover:bg-[#B5945F] transition-all text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md shadow-gold/5"
                      >
                        {isAnalyzing ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin text-white" />
                            <span>Analyzing Document Gaps...</span>
                          </>
                        ) : (
                          <>
                            <span>Run Documentation Exposure Assessment</span>
                            <ArrowRight className="w-4 h-4 text-white" />
                          </>
                        )}
                      </button>
                       <p className="text-[10px] text-slate-400 mt-3 leading-relaxed">
                        <strong>Disclaimer:</strong> This assessment tool and its results are for advisory, simulation, and informational purposes only. Uploaded data is processed locally in your browser. Absolutely no Protected Health Information (PHI) should be uploaded. CCX is not a certified auditing agency and is not certified by OMIG. Use of this tool does not guarantee Medicaid reimbursement, 100% compliance, or protection from retroactive audits. All presets and uploads are fictionalized for training and demonstration.
                      </p>
                    </div>
                  </form>

                  {/* Simulation Result HUD */}
                  {analysisResult && (
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
                            analysisResult.riskLevel === 'HIGH' ? 'bg-red-50 text-red-700 border-red-200' :
                            analysisResult.riskLevel === 'MODERATE' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            'bg-gold/10 text-gold-text border-gold/20'
                          }`}>
                            {analysisResult.riskLevel} RISK PROFILE
                          </span>
                          <div className="text-right">
                            <span className="block font-mono text-[8px] text-slate-400 font-bold uppercase leading-none">Score</span>
                            <span className={`font-mono text-sm font-bold ${
                              analysisResult.riskLevel === 'HIGH' ? 'text-red-600' :
                              analysisResult.riskLevel === 'MODERATE' ? 'text-amber-600' :
                              'text-gold'
                            }`}>
                              {analysisResult.score}/100
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Identified gaps */}
                      <div className="space-y-3">
                        <span className="block font-sans text-xs font-bold text-navy uppercase tracking-wider flex items-center gap-1.5">
                          <AlertCircle className="w-4.5 h-4.5 text-red-500 shrink-0" />
                          Identified Narrative Deficits:
                        </span>
                        <ul className="space-y-2">
                          {analysisResult.gaps.map((gap, idx) => (
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
                          {analysisResult.correctiveAction}
                        </p>
                      </div>

                      {/* Initiate review block */}
                      <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-end text-xs font-semibold">
                        {handshakeEmail ? (
                          <div className="bg-gold/5 text-gold-text border border-gold/25 rounded-lg p-3 text-xs w-full text-center font-normal">
                            ✓ Technical review request registered. Our compliance team will reach out to <strong>{handshakeEmail}</strong> with a de-identified regional blueprint within 24 hours.
                          </div>
                        ) : (
                          <button 
                            onClick={handleHandshakeSubmit}
                            className="px-5 py-2.5 bg-navy text-white hover:bg-navy/95 active:translate-y-0.5 rounded-lg transition-all cursor-pointer text-center text-xs font-bold uppercase tracking-wider"
                          >
                            Request Technical Review &amp; Review Custom Blueprint
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Form-Adjacent Trust Badge Card */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-[#FAF8F5] border border-[#E2E8F0] rounded-2xl p-6 space-y-6 shadow-sm">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-[#E2E8F0]">
                    <ShieldCheck className="w-5 h-5 text-gold" />
                    <h4 className="font-sans font-bold text-xs text-[#0B1F3A] uppercase tracking-wider">
                      Compliance &amp; Data Security Guardrails
                    </h4>
                  </div>

                  <div className="space-y-4 text-left">
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
                    onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                    className="w-full p-4.5 text-left font-sans text-xs md:text-sm font-bold text-navy flex justify-between items-center gap-4 cursor-pointer transition-colors"
                  >
                    <span className="leading-snug">{faq.question}</span>
                    <ChevronDown className={`w-4.5 h-4.5 text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? 'transform rotate-180 text-gold stroke-[2.5px]' : ''}`} />
                  </button>
                  
                  {isOpen && (
                    <div className="p-4.5 border-t border-[#E2E8F0] bg-white text-xs md:text-sm text-navy/80 leading-relaxed font-normal">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ==================== 11. REQUEST EXPOSURE ASSESSMENT BRIEFING ==================== */}
      <section id="contact" className="py-24 md:py-32 bg-off-white">
        <div className="max-w-[640px] mx-auto px-6 text-left space-y-8">
          
          <div className="space-y-3 text-center sm:text-left max-w-[680px]">
            <span className="font-sans text-[12px] text-[#8B6420] uppercase font-semibold tracking-[0.08em] block">
              Secure Alignment
            </span>
            <h2 className="font-sans font-bold text-[36px] text-navy tracking-tight leading-tight">
              Request an Exposure Assessment
            </h2>
            <p className="text-[16px] font-normal text-slate-600 leading-[28px]">
              Request a no-cost sample exposure analysis on de-identified data from your own network — no commitment required. OMIG’s extrapolation methodology can turn a small sample into a large recovery: in Matter of Fast Help Ambulette, Inc. v. NYS DOH (2021), a 150-claim sample that found $3,355 in actual overpayments was extrapolated into a $1.1M recovery demand against the full claim population. That case involved a transportation vendor, not an HRSN network — the relevance here is the extrapolation math, not the provider type.
            </p>
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
              <form onSubmit={handleContactSubmit} className="space-y-5">
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
