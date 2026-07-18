import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface HeaderProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  currentView: 'home' | 'compliance-trust' | 'resources';
  onViewChange: (view: 'home' | 'compliance-trust' | 'resources') => void;
}

export default function Header({ activeSection, onSectionChange, currentView, onViewChange }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);

  const navItems = [
    { id: 'produces', label: 'Platform' },
    { id: 'exposure-review', label: 'Assessment' },
    { id: 'resources', label: 'Resources' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (id === 'resources') {
      onViewChange('resources');
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
      {/* Skip to Main Content Link (WCAG 2.1 AA) */}
      <a 
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2.5 focus:bg-[#8B6420] focus:text-white focus:font-sans focus:text-xs focus:font-bold focus:uppercase focus:tracking-wider focus:rounded-md focus:shadow-md focus:outline-none"
      >
        Skip to Main Content
      </a>
      <div className="max-w-[1160px] mx-auto px-6 h-[90px] flex items-center justify-between relative">
        {/* Brand Logo */}
        <a 
          href="#top" 
          onClick={(e) => handleNavClick(e, 'top')} 
          className="flex flex-col text-left group shrink-0 py-1.5 focus-visible:ring-2 focus-visible:ring-[#8B6420] focus-visible:ring-offset-2 focus-visible:rounded"
        >
          <div className="flex flex-col select-none text-left">
            <span className="font-sans font-bold text-[22px] text-[#0F172A] leading-none tracking-[-0.02em] whitespace-nowrap">
              CCX
            </span>
            <span className="font-sans font-medium text-[11px] text-[#64748B] leading-none mt-[2px] whitespace-nowrap">
              Community Claims Exchange
            </span>
          </div>
        </a>

        {/* Desktop Nav - Perfectly Centered with 40px-48px adaptive spacing */}
        <nav className="hidden lg:flex items-center gap-[40px] xl:gap-[48px] absolute left-1/2 -translate-x-1/2">
          {navItems.map((item) => {
            const isActive = item.id === 'resources' ? currentView === 'resources' : (activeSection === item.id && currentView === 'home');

            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(e, item.id)}
                className={`font-sans text-[14px] font-medium transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#8B6420] focus-visible:rounded px-1.5 py-0.5 ${
                  isActive ? 'text-[#8B6420] font-semibold underline underline-offset-4' : 'text-navy/65 hover:text-[#8B6420]'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Desktop CTA - Right Aligned with default Outline / navy hover */}
        <div className="hidden lg:block shrink-0">
          <a
            href="#exposure-review"
            onClick={(e) => handleNavClick(e, 'exposure-review')}
            className="inline-block px-5 py-2.5 bg-white border border-[#8B6420] text-[#0F172A] hover:bg-[#8B6420] hover:text-white hover:border-[#8B6420] font-sans text-[13px] font-semibold tracking-wide rounded-lg transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#8B6420] focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Run Exposure Assessment
          </a>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden flex flex-col gap-1.5 p-2 bg-none border-none cursor-pointer w-11 h-11 justify-center items-center rounded-md hover:bg-navy/5"
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
        >
          <span className={`block w-5 h-0.5 bg-navy rounded-sm transition-transform duration-150 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-navy rounded-sm transition-opacity duration-150 ${mobileMenuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-navy rounded-sm transition-transform duration-150 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`lg:hidden overflow-hidden transition-all duration-150 max-h-0 bg-white border-t border-navy/10 ${
          mobileMenuOpen ? 'max-h-[500px] py-4' : ''
        }`}
      >
        <div className="px-6 flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = item.id === 'resources' ? currentView === 'resources' : (activeSection === item.id && currentView === 'home');

            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(e, item.id)}
                className={`block py-2 text-[11px] font-semibold uppercase tracking-wider border-b border-navy/5 ${
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
            className="block mt-4 py-3 bg-white border border-[#8B6420] text-[#0F172A] hover:bg-[#8B6420] hover:text-white hover:border-[#8B6420] font-sans text-xs font-semibold rounded-md text-center transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#8B6420] focus-visible:outline-none"
          >
            Run Exposure Assessment
          </a>
        </div>
      </div>
    </header>
  );
}
