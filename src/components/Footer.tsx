import React, { useState } from 'react';
import { X, Shield, ShieldAlert } from 'lucide-react';

interface FooterProps {
  currentView: 'home' | 'compliance-trust' | 'resources';
  onViewChange: (view: 'home' | 'compliance-trust' | 'resources') => void;
}

export default function Footer({ currentView, onViewChange }: FooterProps) {
  const [activeLegalModal, setActiveLegalModal] = useState<'privacy' | 'terms' | 'cookie' | null>(null);

  const handleScrollToTop = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeModal = () => setActiveLegalModal(null);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    if (id === 'compliance') {
      onViewChange('compliance-trust');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (id === 'resources') {
      onViewChange('resources');
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
    <footer className="bg-[#0B1F3A] text-off-white pt-24 pb-16 font-sans relative border-t border-white/10">
      <div className="max-w-[1120px] mx-auto px-6">
        
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16 items-start">
          
          {/* Brand Info - Left 5 cols */}
          <div className="md:col-span-5 text-left select-none">
            <div className="flex flex-col text-left">
              <span className="font-sans font-bold text-[20px] text-white leading-none tracking-tight whitespace-nowrap">
                CCX
              </span>
              <span className="font-sans font-normal text-[11px] text-slate-300 leading-none mt-[2px] whitespace-nowrap">
                Community Claims Exchange
              </span>
              <span className="font-sans font-normal text-[11px] text-slate-400 leading-normal mt-[6px]">
                Supporting documentation accuracy and record integrity for Medicaid social care.
              </span>
            </div>
            <p className="font-sans text-[11px] text-white/40 mt-4">
              © 2026 Community Claims Exchange, Inc.
            </p>
          </div>

          {/* Quick Links - Middle 3 cols */}
          <div className="md:col-span-3 space-y-4 text-left">
            <div className="font-sans text-[11px] text-gold tracking-wider uppercase font-bold">
              Site Navigation
            </div>
            <div className="flex flex-col gap-3">
              <a 
                href="#top" 
                onClick={(e) => handleLinkClick(e, 'top')}
                className="text-white/50 hover:text-white text-xs transition-colors duration-150"
              >
                Home / Executive Summary
              </a>
              <a 
                href="#produces" 
                onClick={(e) => handleLinkClick(e, 'produces')}
                className="text-white/50 hover:text-white text-xs transition-colors duration-150"
              >
                Platform (Capabilities)
              </a>
              <a 
                href="#exposure-review" 
                onClick={(e) => handleLinkClick(e, 'exposure-review')}
                className="text-white/50 hover:text-white text-xs transition-colors duration-150"
              >
                Exposure Assessment
              </a>
              <a 
                href="#resources" 
                onClick={(e) => handleLinkClick(e, 'resources')}
                className={`text-xs transition-colors duration-150 ${
                  currentView === 'resources' ? 'text-gold font-semibold' : 'text-white/50 hover:text-white'
                }`}
              >
                Resources
              </a>
              <a 
                href="#contact" 
                onClick={(e) => handleLinkClick(e, 'contact')}
                className="text-white/50 hover:text-white text-xs transition-colors duration-150"
              >
                Request Assessment
              </a>
            </div>
          </div>

          {/* Legal Notices & System Info - Right 4 cols */}
          <div className="md:col-span-4 space-y-4 text-left">
            <div className="font-sans text-[11px] text-gold tracking-wider uppercase font-bold">
              Legal &amp; Architecture
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4">
              <button
                onClick={() => setActiveLegalModal('privacy')}
                className="text-white/50 hover:text-white text-xs text-left transition-colors duration-150 cursor-pointer bg-transparent border-none p-0 outline-none"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => setActiveLegalModal('terms')}
                className="text-white/50 hover:text-white text-xs text-left transition-colors duration-150 cursor-pointer bg-transparent border-none p-0 outline-none"
              >
                Terms of Use
              </button>
              <button
                onClick={() => setActiveLegalModal('cookie')}
                className="text-white/50 hover:text-white text-xs text-left transition-colors duration-150 cursor-pointer bg-transparent border-none p-0 outline-none"
              >
                Cookie Policy
              </button>
            </div>
            <p className="font-mono text-[10px] text-white/35 leading-relaxed">
              OMIG Disclaimer Applies
              <br />
              HIPAA BAA Standard
              <br />
              Read-Only Data Handling
            </p>
          </div>
        </div>

        {/* Back to top button */}
        <div className="flex justify-end items-center pt-8 border-t border-white/5">
          <button
            onClick={handleScrollToTop}
            className="font-sans text-xs text-gold hover:text-gold-light font-bold cursor-pointer transition-colors duration-150"
          >
            Back to Top ↑
          </button>
        </div>
      </div>

      {/* REGULATORY LEGAL MODALS OVERLAY */}
      {activeLegalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-fade-in text-navy">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl w-full max-w-[580px] max-h-[85vh] overflow-y-auto flex flex-col shadow-2xl relative">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-[#E2E8F0] bg-[#FAFAF8]">
              <div className="flex items-center gap-2.5">
                <Shield className="w-5 h-5 text-gold shrink-0" />
                <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-navy">
                  {activeLegalModal === 'privacy' && 'Privacy Policy'}
                  {activeLegalModal === 'terms' && 'Terms of Use'}
                  {activeLegalModal === 'cookie' && 'Cookie Policy'}
                </h3>
              </div>
              <button 
                onClick={closeModal}
                className="text-slate-400 hover:text-navy cursor-pointer transition-colors p-1"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
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
                    Community Claims Exchange (CCX) is committed to protecting member privacy in strict compliance with federal and state regulations, including the Health Insurance Portability and Accountability Act (HIPAA) and New York State confidentiality guidelines.
                  </p>
                  <div className="p-3.5 bg-gold/5 border border-gold/15 rounded-xl space-y-1.5">
                    <span className="font-sans font-bold text-xs text-navy uppercase block">Documentation Retention Policy</span>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      CCX retains structured documentation records for the period required by applicable Medicaid recordkeeping rules (6–10 years depending on entity type), stored in an append-only format designed to prevent alteration after creation. Raw intake text is processed to produce this structured record; PHI values are omitted from system logs by default.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-navy text-xs uppercase font-sans">1. Information We Do Not Collect</h4>
                    <p>
                      We do not collect, store, or sell name, Social Security Number, date of birth, or individual address records. Our regional coverage modeling utilizes aggregated, de-identified county-level estimates of Medicaid eligibility from official public tables.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-navy text-xs uppercase font-sans">2. Security and HIPAA Alignment</h4>
                    <p>
                      CCX operates in secure hosting environments designed for HIPAA-aligned data handling with standard Corporate Business Associate Agreement (BAA) coverage.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-navy text-xs uppercase font-sans">3. Contact Privacy Officer</h4>
                    <p>
                      For privacy-related inquiries, data usage questions, or to verify BAA configurations, contact us at <span className="underline text-gold">privacy@communityclaims.org</span>.
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
                      <ShieldAlert className="w-4 h-4 text-red-600" />
                      <span className="font-sans font-bold text-xs text-navy uppercase block">System Boundaries & Disclaimers</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      CCX is a retrospective documentation-integrity and audit-exposure analysis engine. <strong>CCX does not perform certified audits, does not issue official Office of the Medicaid Inspector General (OMIG) certifications, and is not approved or certified by the FDA.</strong>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-navy text-xs uppercase font-sans">1. No Reimbursement Guarantees</h4>
                    <p>
                      Use of CCX, including the Documentation Exposure Assessment, does not guarantee Medicaid reimbursement, 100% compliance, or protection against retrospective OMIG audits or clawbacks. Reimbursement eligibility is subject to official guidelines, individual provider procedures, and regulatory determination.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-navy text-xs uppercase font-sans">2. Simulated and Fictional Data</h4>
                    <p>
                      All preset caseworker records and upload samples are mock examples compiled for simulation and training. Any resemblance to actual patient encounters or real-world records is coincidental.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-navy text-xs uppercase font-sans">3. Funding &amp; Procurement</h4>
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
                    The Community Claims Exchange (CCX) platform utilizes cookies in a strictly limited capacity to support essential site operation.
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-bold text-navy text-xs uppercase font-sans">1. Essential Session Cookies Only</h4>
                    <p>
                      We use only strictly necessary session cookies. These cookies persist your selected NYS map county sector and active form inputs during a single browser session so you do not lose progress.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-navy text-xs uppercase font-sans">2. No Ad or behavioral Tracking</h4>
                    <p>
                      CCX never uses tracking pixels, behavioral cookies, advertising trackers, or marketing widgets. We maintain a professional, zero-telemetry boundary.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-navy text-xs uppercase font-sans">3. Management</h4>
                    <p>
                      Because our cookies are strictly operational and required to render the application, they cannot be individual disabled. If you disable cookies in your browser settings, the interactive map and self-assessment documentation will fail to function.
                    </p>
                  </div>
                </>
              )}

            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#FAFAF8] flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-navy text-white hover:bg-navy/95 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer transition-all"
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
