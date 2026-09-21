import React, { useState, useEffect, useRef } from 'react';
import { X, Shield, ShieldAlert } from 'lucide-react';

interface FooterProps {
  currentView: 'home' | 'compliance-trust' | 'resources' | 'accessibility';
  onViewChange: (view: 'home' | 'compliance-trust' | 'resources' | 'accessibility') => void;
}

export default function Footer({ currentView, onViewChange }: FooterProps) {
  const [activeLegalModal, setActiveLegalModal] = useState<'privacy' | 'terms' | 'cookie' | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);

  // Focus trap and keyboard handling for legal dialog
  useEffect(() => {
    if (!activeLegalModal) return;

    // Focus the first interactive element (close button) when modal opens
    const timer = setTimeout(() => {
      if (modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length > 0) {
          focusable[0].focus();
        }
      }
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeModal();
        return;
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeLegalModal]);

  const handleScrollToTop = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openModal = (modal: 'privacy' | 'terms' | 'cookie', event?: React.MouseEvent) => {
    triggerElementRef.current = (event?.currentTarget as HTMLElement) || (document.activeElement as HTMLElement);
    setActiveLegalModal(modal);
  };

  const closeModal = () => {
    setActiveLegalModal(null);
    setTimeout(() => {
      if (triggerElementRef.current) {
        triggerElementRef.current.focus();
      }
    }, 50);
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    if (id === 'compliance') {
      onViewChange('compliance-trust');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (id === 'resources') {
      window.location.hash = 'resources';
      onViewChange('resources');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (id === 'accessibility') {
      window.location.hash = 'accessibility';
      onViewChange('accessibility');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (id === 'top') {
      onViewChange('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (currentView !== 'home') {
        onViewChange('home');
        setTimeout(() => {
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      } else {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  };

  return (
    <footer aria-label="Site Footer" className="bg-[#0B1F3A] text-off-white pt-20 pb-16 font-sans relative border-t border-white/10">
      <div className="max-w-[1120px] mx-auto px-6">
        
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16 items-start">
          
          {/* Brand Info - Left 5 cols */}
          <div className="md:col-span-5 text-left">
            <div className="flex flex-col text-left">
              <span className="font-sans font-bold text-[20px] text-white leading-none tracking-tight whitespace-nowrap">
                Community Claims Exchange
              </span>
            </div>

            {/* Corporate & Operating Reality Signals */}
            <div className="mt-5 pt-4 border-t border-white/10 space-y-2 text-xs text-slate-300">
              <p className="leading-relaxed">
                Product actively developed and available for customer evaluation.
              </p>
              <p className="leading-relaxed">
                SOC 2 Type II in progress (Target Q2 2027).
              </p>
            </div>

            <p className="font-sans text-[11px] text-slate-400 mt-4">
              © 2026 Community Claims Exchange, Inc.
            </p>
          </div>

          {/* Quick Links - Middle 3 cols */}
          <div className="md:col-span-3 space-y-4 text-left">
            <div className="font-sans text-[11px] text-amber-300 tracking-wider uppercase font-bold">
              Site Navigation
            </div>
            <div className="flex flex-col gap-3">
              <a 
                href="#produces" 
                onClick={(e) => handleLinkClick(e, 'produces')}
                className="text-slate-300 hover:text-white text-xs transition-colors duration-150 focus-visible:outline-none focus-visible:underline"
              >
                Platform
              </a>
              <a 
                href="#exposure-review" 
                onClick={(e) => handleLinkClick(e, 'exposure-review')}
                className="text-slate-300 hover:text-white text-xs transition-colors duration-150 focus-visible:outline-none focus-visible:underline"
              >
                Assessment
              </a>
              <a 
                href="#compliance-guardrails" 
                onClick={(e) => handleLinkClick(e, 'compliance-guardrails')}
                className="text-slate-300 hover:text-white text-xs transition-colors duration-150 focus-visible:outline-none focus-visible:underline"
              >
                Security &amp; BAA
              </a>
              <a 
                href="#about-ccx" 
                onClick={(e) => handleLinkClick(e, 'about-ccx')}
                className="text-slate-300 hover:text-white text-xs transition-colors duration-150 focus-visible:outline-none focus-visible:underline"
              >
                About
              </a>
              <a 
                href="#resources" 
                onClick={(e) => handleLinkClick(e, 'resources')}
                className={`text-xs transition-colors duration-150 focus-visible:outline-none focus-visible:underline ${
                  currentView === 'resources' ? 'text-amber-300 font-semibold' : 'text-slate-300 hover:text-white'
                }`}
              >
                Resources
              </a>
              <a 
                href="#contact" 
                onClick={(e) => handleLinkClick(e, 'contact')}
                className="text-slate-300 hover:text-white text-xs transition-colors duration-150 focus-visible:outline-none focus-visible:underline"
              >
                Request a Documentation Exposure Assessment
              </a>
            </div>
          </div>

          {/* Legal Notices & System Info - Right 4 cols */}
          <div className="md:col-span-4 space-y-4 text-left">
            <div className="font-sans text-[11px] text-amber-300 tracking-wider uppercase font-bold">
              Legal, Trust &amp; Accessibility
            </div>
            <div className="flex flex-col gap-2 mb-4">
              <button
                type="button"
                onClick={(e) => handleLinkClick(e as unknown as React.MouseEvent<HTMLAnchorElement>, 'compliance')}
                className={`text-xs text-left transition-colors duration-150 cursor-pointer bg-transparent border-none p-0 outline-none focus-visible:underline ${
                  currentView === 'compliance-trust' ? 'text-amber-300 font-semibold' : 'text-slate-300 hover:text-white'
                }`}
              >
                Compliance &amp; Integrity Trust Hub →
              </button>
              
              <button
                type="button"
                onClick={(e) => handleLinkClick(e as unknown as React.MouseEvent<HTMLAnchorElement>, 'accessibility')}
                className={`text-xs text-left transition-colors duration-150 cursor-pointer bg-transparent border-none p-0 outline-none focus-visible:underline font-medium ${
                  currentView === 'accessibility' ? 'text-amber-300 font-bold' : 'text-slate-200 hover:text-white'
                }`}
              >
                Accessibility Statement (NYS-P08-005 &amp; WCAG 2.2 AA) →
              </button>

              <div className="flex flex-wrap gap-x-4 gap-y-2 pt-1">
                <button
                  type="button"
                  onClick={(e) => openModal('privacy', e)}
                  className="text-slate-300 hover:text-white text-xs text-left transition-colors duration-150 cursor-pointer bg-transparent border-none p-0 outline-none focus-visible:underline min-h-[44px] inline-flex items-center"
                >
                  Privacy Policy
                </button>
                <button
                  type="button"
                  onClick={(e) => openModal('terms', e)}
                  className="text-slate-300 hover:text-white text-xs text-left transition-colors duration-150 cursor-pointer bg-transparent border-none p-0 outline-none focus-visible:underline min-h-[44px] inline-flex items-center"
                >
                  Terms of Use
                </button>
                <button
                  type="button"
                  onClick={(e) => openModal('cookie', e)}
                  className="text-slate-300 hover:text-white text-xs text-left transition-colors duration-150 cursor-pointer bg-transparent border-none p-0 outline-none focus-visible:underline min-h-[44px] inline-flex items-center"
                >
                  Cookie Policy
                </button>
              </div>
            </div>
            <div className="space-y-2 text-left">
              <span className="font-mono text-[10px] text-slate-300 uppercase tracking-wider block font-bold">
                Security &amp; Legal Verification
              </span>
              <div className="flex flex-col gap-1.5 text-[11px] font-mono">
                <a
                  href="#compliance-guardrails"
                  className="text-slate-300 hover:text-amber-300 transition-colors flex items-center gap-1.5 group focus-visible:underline"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" aria-hidden="true" />
                  <span>HIPAA BAA: Executed Prior to Ingestion</span>
                </a>
                <a
                  href="#compliance-guardrails"
                  className="text-slate-300 hover:text-amber-300 transition-colors flex items-center gap-1.5 group focus-visible:underline"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" aria-hidden="true" />
                  <span>Hosting: Dedicated AWS US-East</span>
                </a>
                <a
                  href="#compliance-guardrails"
                  className="text-slate-300 hover:text-amber-300 transition-colors flex items-center gap-1.5 group focus-visible:underline"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" aria-hidden="true" />
                  <span>SOC 2 Type II: In Progress, Target Q2 2027</span>
                </a>
                <span className="text-slate-400 text-[10px] pt-1">
                  OMIG Statutory Retention Standard (6-10 Yrs)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Back to top button */}
        <div className="flex justify-end items-center pt-8 border-t border-white/10">
          <button
            onClick={handleScrollToTop}
            className="font-sans text-xs text-amber-300 hover:text-white font-bold cursor-pointer transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 px-2 py-1 rounded"
          >
            Back to Top ↑
          </button>
        </div>
      </div>

      {/* REGULATORY LEGAL MODALS OVERLAY */}
      {activeLegalModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in text-navy"
          role="dialog"
          aria-modal="true"
          aria-labelledby="legal-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div ref={modalRef} className="bg-white border border-[#E2E8F0] rounded-2xl w-full max-w-[580px] max-h-[85vh] overflow-y-auto flex flex-col shadow-2xl relative">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-[#E2E8F0] bg-[#FAFAF8] sticky top-0 z-10">
              <div className="flex items-center gap-2.5">
                <Shield className="w-5 h-5 text-gold shrink-0" aria-hidden="true" />
                <h2 id="legal-modal-title" className="font-sans font-bold text-sm uppercase tracking-wider text-navy">
                  {activeLegalModal === 'privacy' && 'Privacy Policy'}
                  {activeLegalModal === 'terms' && 'Terms of Use'}
                  {activeLegalModal === 'cookie' && 'Cookie Policy'}
                </h2>
              </div>
              <button 
                type="button"
                onClick={closeModal}
                className="text-slate-500 hover:text-navy cursor-pointer transition-colors p-2 rounded-md hover:bg-slate-200 min-w-[44px] min-h-[44px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none"
                aria-label="Close legal dialog"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto text-xs md:text-sm text-navy/85 leading-relaxed space-y-4">
              
              {activeLegalModal === 'privacy' && (
                <>
                  <p className="font-semibold text-xs text-slate-400 uppercase tracking-wider font-mono">
                    Last Updated: July 2026
                  </p>
                  <p>
                    This policy explains how CCX handles member information under HIPAA and New York State confidentiality requirements. See the Documentation Retention Policy below for specific retention and handling practices.
                  </p>
                  <div className="p-3.5 bg-gold/5 border border-gold/15 rounded-xl space-y-1.5">
                    <span className="font-sans font-bold text-xs text-navy uppercase block">Documentation Retention Policy</span>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      CCX retains structured documentation records for the period required by applicable Medicaid recordkeeping rules (6-10 years depending on entity type), stored in an append-only format designed to prevent alteration after creation. Raw intake text is processed to produce this structured record; PHI values are omitted from system logs by default.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-navy text-xs uppercase font-sans">1. Information We Do Not Collect</h3>
                    <p>
                      We do not collect, store, or sell name, Social Security Number, date of birth, or individual address records. Our regional coverage modeling utilizes aggregated, de-identified county-level estimates of Medicaid eligibility from official public tables.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-navy text-xs uppercase font-sans">2. Security and HIPAA Alignment</h3>
                    <p>
                      CCX operates in secure hosting environments designed for HIPAA-aligned data handling with standard Corporate Business Associate Agreement (BAA) coverage.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-navy text-xs uppercase font-sans">3. Contact Privacy Officer</h3>
                    <p>
                      For privacy-related inquiries, data usage questions, or to verify BAA configurations, submit an inquiry through our secure contact portal or contact <span className="underline text-gold font-mono">privacy@ccxny.org</span>.
                    </p>
                  </div>
                </>
              )}

              {activeLegalModal === 'terms' && (
                <>
                  <p className="font-semibold text-xs text-slate-400 uppercase tracking-wider font-mono">
                    Last Updated: July 2026
                  </p>
                  <p>
                    These terms govern the use of the Community Claims Exchange (CCX) web platform and documentation tools. By using our platform, you agree to these terms.
                  </p>
                  
                  <div className="p-3.5 bg-red-50/50 border border-red-200 rounded-xl space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-red-600" aria-hidden="true" />
                      <span className="font-sans font-bold text-xs text-navy uppercase block">System Boundaries &amp; Disclaimers</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      CCX is a retrospective documentation-structuring and review-package platform. <strong>CCX does not perform certified audits, does not issue official Office of the Medicaid Inspector General (OMIG) certifications, and is not approved or certified by the FDA.</strong>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-bold text-navy text-xs uppercase font-sans">1. No Reimbursement Guarantees</h3>
                    <p>
                      Use of CCX, including the Documentation Exposure Assessment, does not guarantee Medicaid reimbursement, statutory compliance, or protection against retrospective OMIG audits or clawbacks. Reimbursement eligibility is subject to official guidelines, individual provider procedures, and regulatory determination.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-bold text-navy text-xs uppercase font-sans">2. Simulated and Fictional Data</h3>
                    <p>
                      All preset caseworker records and synthetic scenario samples are mock examples compiled for simulation and compliance training. Any resemblance to actual patient encounters or real-world records is coincidental.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-bold text-navy text-xs uppercase font-sans">3. Funding &amp; Procurement</h3>
                    <p>
                      CBO capacity-building funds under the NYHER 1115 Waiver are restricted to not-for-profit organizations and are not available to CCX. Engagement funding, where applicable, is typically drawn from an SCN Lead Entity's own administrative and operations budget, subject to that organization's internal budget approval, and is not guaranteed by CCX.
                    </p>
                  </div>
                </>
              )}

              {activeLegalModal === 'cookie' && (
                <>
                  <p className="font-semibold text-xs text-slate-400 uppercase tracking-wider font-mono">
                    Last Updated: July 2026
                  </p>
                  <p>
                    The Community Claims Exchange (CCX) platform utilizes cookies to support essential site operation.
                  </p>
                  <div className="space-y-2">
                    <h3 className="font-bold text-navy text-xs uppercase font-sans">1. Essential Session Cookies Only</h3>
                    <p>
                      We use essential session cookies. These cookies persist your selected NYS map county sector and active form inputs during a single browser session so you do not lose progress.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-navy text-xs uppercase font-sans">2. No Ad or Behavioral Tracking</h3>
                    <p>
                      This site does not use advertising trackers, behavioral cookies, or marketing pixels.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-navy text-xs uppercase font-sans">3. Management</h3>
                    <p>
                      Because these cookies are essential to site operation, they cannot be disabled within the application. If you disable cookies in your browser settings, interactive features such as the map and scenario views may not function as expected.
                    </p>
                  </div>
                </>
              )}

            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#FAFAF8] flex justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="min-h-[44px] px-6 py-2.5 bg-navy text-white hover:bg-navy/90 focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer transition-all flex items-center justify-center"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </footer>
  );
}
