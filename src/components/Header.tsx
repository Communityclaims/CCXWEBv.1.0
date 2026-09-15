import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface HeaderProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  currentView: 'home' | 'compliance-trust' | 'resources' | 'accessibility';
  onViewChange: (view: 'home' | 'compliance-trust' | 'resources' | 'accessibility') => void;
}

export default function Header({ activeSection, onSectionChange, currentView, onViewChange }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on Escape key press (WCAG 2.2 SC 2.1.1 & SC 1.4.13)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const navItems = [
    { id: 'produces', label: 'Platform' },
    { id: 'exposure-review', label: 'Assessment' },
    { id: 'compliance-guardrails', label: 'Security & BAA' },
    { id: 'about-ccx', label: 'About' },
    { id: 'resources', label: 'Resources' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleSkipToContent = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const main = document.getElementById('main-content');
    if (main) {
      main.tabIndex = -1;
      main.focus();
      main.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (id === 'resources') {
      window.location.hash = 'resources';
      onViewChange('resources');
      return;
    }

    if (id === 'accessibility') {
      window.location.hash = 'accessibility';
      onViewChange('accessibility');
      return;
    }

    if (currentView !== 'home') {
      onViewChange('home');
      onSectionChange(id);
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      onSectionChange(id);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#0F172A]/[0.08]">
      {/* Skip to Main Content Link (WCAG 2.2 AA SC 2.4.1) */}
      <a 
        href="#main-content"
        onClick={handleSkipToContent}
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-5 focus:py-3 focus:bg-[#0B1F3A] focus:text-white focus:border-2 focus:border-[#B8860B] focus:font-sans focus:text-xs focus:font-bold focus:uppercase focus:tracking-wider focus:rounded-lg focus:shadow-2xl focus:outline-none focus:ring-4 focus:ring-[#B8860B]/50 transition-all"
      >
        Skip to Main Content
      </a>
      <div className="max-w-[1160px] mx-auto px-6 h-[90px] flex items-center justify-between relative">
        {/* Brand Logo */}
        <a 
          href="#top" 
          onClick={(e) => handleNavClick(e, 'top')} 
          className="flex flex-col text-left group shrink-0 py-1.5 focus-visible:ring-2 focus-visible:ring-[#8B6420] focus-visible:ring-offset-2 focus-visible:rounded"
          aria-label="Community Claims Exchange (CCX) Home"
        >
          <div className="flex flex-col select-none text-left">
            <span className="font-sans font-bold text-[22px] text-[#0B1F3A] leading-none tracking-[-0.02em] whitespace-nowrap">
              CCX
            </span>
            <span className="font-sans font-medium text-[11px] text-[#475569] leading-none mt-[2px] whitespace-nowrap">
              Community Claims Exchange
            </span>
          </div>
        </a>

        {/* Desktop Nav - Perfectly Centered with adaptive spacing */}
        <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-[24px] xl:gap-[36px] absolute left-1/2 -translate-x-1/2">
          {navItems.map((item) => {
            const isActive = item.id === 'resources' ? currentView === 'resources' : (activeSection === item.id && currentView === 'home');

            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(e, item.id)}
                className={`font-sans text-[14px] font-medium transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#8B6420] focus-visible:rounded px-1.5 py-1 ${
                  isActive ? 'text-[#8B6420] font-semibold underline underline-offset-4' : 'text-slate-700 hover:text-[#8B6420]'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:block shrink-0">
          <a
            href="#exposure-review"
            onClick={(e) => handleNavClick(e, 'exposure-review')}
            className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 bg-white border border-[#8B6420] text-[#0B1F3A] hover:bg-[#8B6420] hover:text-white hover:border-[#8B6420] font-sans text-[13px] font-semibold tracking-wide rounded-lg transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#8B6420] focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Explore Review Scenarios
          </a>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden flex flex-col gap-1.5 p-2 bg-none border-none cursor-pointer w-11 h-11 justify-center items-center rounded-md hover:bg-navy/5 focus-visible:ring-2 focus-visible:ring-[#8B6420]"
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-controls="mobile-nav-panel"
        >
          <span className={`block w-5 h-0.5 bg-navy rounded-sm transition-transform duration-150 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-navy rounded-sm transition-opacity duration-150 ${mobileMenuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-navy rounded-sm transition-transform duration-150 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      <div 
        id="mobile-nav-panel"
        className={`lg:hidden overflow-hidden transition-all duration-150 max-h-0 bg-white border-t border-navy/10 ${
          mobileMenuOpen ? 'max-h-[500px] py-4' : ''
        }`}
      >
        <div className="px-6 flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = item.id === 'resources' ? currentView === 'resources' : (activeSection === item.id && currentView === 'home');

            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(e, item.id)}
                className={`min-h-[44px] flex items-center px-2 py-2 text-[12px] font-semibold uppercase tracking-wider border-b border-navy/5 ${
                  isActive ? 'text-[#8B6420]' : 'text-navy'
                }`}
              >
                {item.label}
              </a>
            );
          })}
          <a
            href="#exposure-review"
            onClick={(e) => handleNavClick(e, 'exposure-review')}
            className="block mt-4 py-3 bg-white border border-[#8B6420] text-[#0B1F3A] hover:bg-[#8B6420] hover:text-white hover:border-[#8B6420] font-sans text-xs font-semibold rounded-md text-center transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#8B6420] focus-visible:outline-none min-h-[44px] flex items-center justify-center"
          >
            Explore Review Scenarios
          </a>
        </div>
      </div>
    </header>
  );
}
