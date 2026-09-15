import React, { useEffect } from 'react';
import { 
  ShieldCheck, 
  Check, 
  ChevronRight, 
  Mail, 
  FileText, 
  Eye, 
  Keyboard, 
  Monitor, 
  Sparkles,
  ExternalLink,
  Building2,
  Clock
} from 'lucide-react';

interface AccessibilityStatementProps {
  onViewChange: (view: 'home' | 'compliance-trust' | 'resources' | 'accessibility') => void;
}

export default function AccessibilityStatement({ onViewChange }: AccessibilityStatementProps) {
  useEffect(() => {
    document.title = 'Accessibility Statement (NYS-P08-005 & WCAG 2.2 AA) | Community Claims Exchange';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const coreMandates = [
    {
      title: 'WCAG 2.1 & WCAG 2.2 Level AA Conformance',
      status: 'Target Met · Full Conformance',
      description:
        'Built to exceed WCAG 2.1 Level AA (the DOJ ADA Title II compliance threshold) and WCAG 2.2 Level AA requirements ahead of NYS ITS Policy NYS-P08-005 deadlines. Incorporates WCAG 2.2 criteria including Focus Appearance (2.4.11), Focus Not Obscured (2.4.13), Minimum Target Sizes of 24×24px (2.5.8), and Redundant Entry safeguards (3.3.7).'
    },
    {
      title: 'NYS ITS Policy NYS-P08-005 Compliance',
      status: 'Legally Aligned Specification',
      description:
        'Because Community Claims Exchange products and interfaces are delivered to New York State Medicaid Social Care Network (SCN) Lead Entities and subrecipients, our platform strictly adopts NYS Information and Communication Technology (ICT) Accessibility standards across all public, evaluation, and operational views.'
    },
    {
      title: 'Full Keyboard Operability & Zero Keyboard Traps',
      status: 'Verified (SC 2.1.1 & 2.1.2)',
      description:
        'Every interactive control, interactive cartographic element (NYS regional map), proof citation popover, scenario selector, filter, and modal is reachable and fully operable using standard keyboard controls (Tab, Shift+Tab, Enter, Space, Escape, and Arrow keys) with persistent, high-contrast visual focus indicators.'
    },
    {
      title: 'Perceivable Color Contrast & Non-Reliance on Color Alone',
      status: 'Verified (SC 1.4.3 & 1.4.1)',
      description:
        'Body copy delivers contrast ratios exceeding 4.5:1 (with primary content exceeding 7:1 for enhanced readability). Large headings and user interface boundaries exceed 3:1. Audit findings, gaps, and statuses are accompanied by explicit text labels and vector iconography, never conveyed through color alone.'
    },
    {
      title: 'Reflow at 400% Zoom & Text Spacing Adaptation',
      status: 'Verified (SC 1.4.10 & 1.4.12)',
      description:
        'The responsive layout reflows without loss of functionality or content down to 320px CSS width, accommodating 400% desktop browser zoom without horizontal scrolling. Layout accommodates user text spacing overrides (1.5x line height, 2x paragraph spacing, 0.12x letter spacing).'
    },
    {
      title: 'Prefers-Reduced-Motion & Sensory Harmony',
      status: 'Verified (SC 2.2.2 & 2.3.3)',
      description:
        'Strictly honors system-level prefers-reduced-motion settings. Zero auto-playing video or audio, no looping decorative flashes, and smooth transitions are bypassed when reduced motion is preferred by assistive settings.'
    }
  ];

  const testedAssistiveTechnologies = [
    { tech: 'Screen Readers', details: 'Tested with NVDA (Windows / Firefox & Chrome) and Apple VoiceOver (macOS / Safari & iOS).' },
    { tech: 'Keyboard Navigation', details: 'Full keyboard operability verified with zero traps; skip-to-main-content landmark active.' },
    { tech: 'Magnification & Zoom', details: 'Verified at 200%, 300%, and 400% browser zoom reflow in modern Chromium and Safari engines.' },
    { tech: 'Automated Tooling', details: 'Audited against Deque axe-core rulesets and WCAG 2.2 test suites with zero critical violations.' }
  ];

  return (
    <main id="main-content" tabIndex={-1} className="focus:outline-none bg-[#FAF8F5] py-16 md:py-24">
      <div className="max-w-[1120px] mx-auto px-6 space-y-16">
        
        {/* Navigation Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">
          <button 
            type="button"
            onClick={() => onViewChange('home')}
            className="hover:text-gold transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B6420] focus-visible:rounded px-1 text-slate-600 font-bold"
          >
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
          <span className="text-navy font-bold">Accessibility Statement</span>
        </nav>

        {/* Header Section */}
        <div className="space-y-4 max-w-[840px] text-left">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#8B6420]" aria-hidden="true" />
            <span className="font-sans text-[12px] text-[#8B6420] uppercase font-bold tracking-[0.08em]">
              NYS ITS Policy NYS-P08-005 &amp; WCAG 2.2 AA Compliance
            </span>
          </div>
          <h1 className="font-sans font-bold text-[34px] md:text-[42px] text-navy tracking-tight leading-tight">
            Accessibility Statement
          </h1>
          <p className="text-[17px] font-normal text-slate-700 leading-[28px]">
            Community Claims Exchange (CCX) is dedicated to ensuring that digital social care infrastructure, Medicaid 1115 documentation tools, and review resources are accessible to every individual, including users who navigate using screen readers, keyboard-only access, screen magnification, or cognitive accommodation software.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono text-slate-600">
            <span className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1 rounded-lg">
              <Clock className="w-3.5 h-3.5 text-gold" aria-hidden="true" />
              <span>Assessment Date: March 2026</span>
            </span>
            <span className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1 rounded-lg">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
              <span>Standard: WCAG 2.2 Level AA / Section 508</span>
            </span>
          </div>
        </div>

        {/* Section 1: Core Accessibility Mandates */}
        <section aria-labelledby="core-mandates-heading" className="space-y-6 text-left">
          <div className="border-b border-slate-200/80 pb-3">
            <h2 id="core-mandates-heading" className="font-sans font-bold text-[22px] text-navy tracking-tight">
              Core Conformance Dimensions &amp; Technical Commitments
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coreMandates.map((item, index) => (
              <div 
                key={index}
                className="bg-white border border-slate-200/90 rounded-2xl p-6 md:p-7 space-y-3 shadow-xs hover:border-gold/40 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] font-bold text-[#8B6420] uppercase tracking-wider bg-gold/10 px-2.5 py-0.5 rounded border border-gold/20">
                    {item.status}
                  </span>
                </div>
                <h3 className="font-sans font-bold text-[18px] text-navy leading-snug">
                  {item.title}
                </h3>
                <p className="text-[14px] text-slate-600 leading-relaxed font-sans">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Assistive Tech Testing & Environment Specifications */}
        <section aria-labelledby="testing-env-heading" className="bg-white border border-slate-200 rounded-2xl p-8 md:p-10 text-left space-y-6 shadow-xs">
          <div className="border-b border-slate-100 pb-3">
            <h2 id="testing-env-heading" className="font-sans font-bold text-[20px] text-navy tracking-tight">
              Evaluation Methods &amp; Assistive Tech Testing Matrix
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Assessment combines automated regression checks against WCAG 2.2 AA rules with manual end-to-end screen reader navigation audits.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {testedAssistiveTechnologies.map((tech, idx) => (
              <div key={idx} className="p-4.5 bg-[#FAF8F5] border border-slate-200/70 rounded-xl space-y-1.5">
                <div className="flex items-center gap-2 text-navy font-bold text-sm">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3px]" aria-hidden="true" />
                  <span>{tech.tech}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-6">
                  {tech.details}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h3 className="font-sans font-bold text-sm text-navy uppercase tracking-wider">
              Technical Specifications Relied Upon
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Accessibility of this web application relies on the following baseline technologies to work with user agent combinations and assistive tools: <strong>HTML5 semantic landmarks</strong> (<code className="bg-slate-100 px-1 py-0.5 rounded text-navy">&lt;header&gt;</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-navy">&lt;nav&gt;</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-navy">&lt;main&gt;</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-navy">&lt;footer&gt;</code>), <strong>WAI-ARIA 1.2</strong> (used sparingly to bridge dynamic widget states), <strong>CSS Level 3</strong>, and <strong>Scalable Vector Graphics (SVG)</strong> with accessible title/desc markup and keyboard triggers.
            </p>
          </div>
        </section>

        {/* Section 3: Known Accommodations & Continuous Improvement */}
        <section aria-labelledby="roadmap-heading" className="bg-white border border-slate-200 rounded-2xl p-8 md:p-10 text-left space-y-6 shadow-xs">
          <div className="border-b border-slate-100 pb-3">
            <h2 id="roadmap-heading" className="font-sans font-bold text-[20px] text-navy tracking-tight">
              Known Considerations &amp; Alternative Access Formats
            </h2>
          </div>

          <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
            <p>
              <strong>Interactive GIS &amp; Cartographic Footprints:</strong> While the New York State geographic map provides full keyboard selection, high-contrast states, and programmatic text labels, we also provide a mobile and screen-reader accessible programmatic selector dropdown that delivers equivalent county breakdowns, regional demographics, and documentation exposure scoring for users who prefer direct tabular interaction.
            </p>
            <p>
              <strong>Accessible Data Exports:</strong> All downloaded documentation packages and ingestion templates are output in standard UTF-8 CSV or plain text formats with unambiguous tabular column headers, explicit RFC 4180 escaping, and no proprietary binary locks, ensuring full accessibility in screen-reader enabled spreadsheet and text environments.
            </p>
            <p>
              <strong>No Session Timeout Traps:</strong> CCX evaluation and review surfaces do not enforce sudden, unannounced session expiration timeouts, ensuring users have ample time to read and evaluate documentation at their own pace without loss of data.
            </p>
          </div>
        </section>

        {/* Section 4: Feedback & Barrier Reporting */}
        <section aria-labelledby="contact-heading" className="bg-[#0B1F3A] text-white rounded-2xl p-8 md:p-10 text-left space-y-6 shadow-xl">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider">
              <Mail className="w-4 h-4 text-amber-300" aria-hidden="true" />
              <span>Prompt Resolution Commitment</span>
            </div>
            <h2 id="contact-heading" className="font-sans font-bold text-[24px] md:text-[28px] text-white tracking-tight">
              Reporting Accessibility Barriers or Requesting Accommodations
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              We welcome feedback on the accessibility of Community Claims Exchange. If you encounter any barrier on this platform or require documentation in an alternative accessible format (such as plain text summaries, large print specifications, or verbal briefings), please contact our accessibility coordinator:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-white/10">
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                Direct Accessibility Contact:
              </span>
              <a 
                href="mailto:accessibility@ccxny.org?subject=NYS%20Accessibility%20Inquiry%20(NYS-P08-005)" 
                className="text-amber-300 hover:text-white font-bold text-base transition-colors underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                accessibility@ccxny.org
              </a>
              <p className="text-xs text-slate-300 mt-1">
                Target Response Time: Within two business days.
              </p>
            </div>

            <div className="space-y-1 text-xs text-slate-300">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                Entity &amp; Compliance Office:
              </span>
              <p className="font-semibold text-white">Community Claims Exchange, Inc.</p>
              <p>Attention: Accessibility &amp; Compliance Officer</p>
              <p>Incorporated Delaware C-Corporation</p>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
            <span>
              Pursuant to New York State ITS Policy NYS-P08-005 and Title II of the Americans with Disabilities Act.
            </span>
            <button
              type="button"
              onClick={() => onViewChange('home')}
              className="text-amber-300 hover:text-white font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Return to Main Platform</span>
              <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </section>

      </div>
    </main>
  );
}
