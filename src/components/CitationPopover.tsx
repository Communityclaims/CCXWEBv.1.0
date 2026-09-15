import React, { useState, useRef, useEffect } from 'react';
import { ExternalLink, BookOpen, X, CheckCircle2 } from 'lucide-react';

export interface CitationLink {
  label: string;
  url: string;
}

export interface CitationPopoverProps {
  id: string;
  citationNumber: number;
  badge: string;
  title: string;
  subtitle?: string;
  sourceName: string;
  details: string[];
  links: CitationLink[];
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'right' | 'center';
}

export default function CitationPopover({
  id,
  citationNumber,
  badge,
  title,
  subtitle,
  sourceName,
  details,
  links,
  children,
  className = '',
  align = 'left'
}: CitationPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const handleMouseEnter = () => {
    clearCloseTimer();
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    if (!isPinned) {
      closeTimerRef.current = setTimeout(() => {
        setIsOpen(false);
      }, 450);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearCloseTimer();
    if (isOpen && isPinned) {
      setIsPinned(false);
      setIsOpen(false);
    } else {
      setIsPinned(true);
      setIsOpen(true);
    }
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearCloseTimer();
    setIsPinned(false);
    setIsOpen(false);
  };

  // Listen for global open-citation and toggle-citation custom events
  useEffect(() => {
    const handleOpenCustom = (e: Event) => {
      const customEvent = e as CustomEvent<{ id: string }>;
      if (customEvent.detail?.id === id) {
        clearCloseTimer();
        setIsPinned(true);
        setIsOpen(true);
      }
    };

    const handleToggleCustom = (e: Event) => {
      const customEvent = e as CustomEvent<{ id: string }>;
      if (customEvent.detail?.id === id) {
        clearCloseTimer();
        setIsOpen((prev) => {
          const next = !prev;
          setIsPinned(next);
          return next;
        });
      }
    };

    window.addEventListener('open-citation', handleOpenCustom);
    window.addEventListener('toggle-citation', handleToggleCustom);
    return () => {
      window.removeEventListener('open-citation', handleOpenCustom);
      window.removeEventListener('toggle-citation', handleToggleCustom);
    };
  }, [id]);

  // Broadcast state changes for external synchronized citation buttons
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('citation-state-changed', { detail: { id, isOpen } }));
  }, [id, isOpen]);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsPinned(false);
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsPinned(false);
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
      clearCloseTimer();
    };
  }, [isOpen]);

  // Alignment classes for popover
  const alignmentClass = 
    align === 'right' 
      ? 'right-0 sm:right-0' 
      : align === 'center'
      ? 'left-1/2 -translate-x-1/2'
      : 'left-0 sm:left-0';

  return (
    <span
      ref={containerRef}
      className={`relative inline ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger: Claim text + Footnote badge */}
      <span
        id={`trigger-${id}`}
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick(e as unknown as React.MouseEvent);
          }
        }}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-controls={`popover-${id}`}
        aria-describedby={`popover-${id}`}
        className="cursor-pointer group select-text inline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 rounded"
        title="Click or tap to inspect verified primary source citation"
      >
        <span className="decoration-gold underline decoration-dotted decoration-2 underline-offset-4 group-hover:decoration-navy group-hover:text-navy group-hover:bg-gold/10 rounded-sm px-0.5 transition-all">
          {children}
        </span>
        <sup
          className="ml-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-mono font-bold text-gold bg-gold/15 hover:bg-gold/25 border border-gold/40 rounded-md transition-colors cursor-pointer select-none align-super shadow-2xs group-hover:border-gold"
          aria-label={`Citation [${citationNumber}]: ${title}`}
          aria-describedby={`popover-${id}`}
        >
          [{citationNumber}]
        </sup>
      </span>

      {/* Popover / Tooltip Flyout */}
      {isOpen && (
        <div
          id={`popover-${id}`}
          role="dialog"
          aria-labelledby={`title-${id}`}
          aria-describedby={`facts-${id}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={`absolute z-[100] top-full mt-2 w-[340px] sm:w-[440px] max-w-[calc(100vw-32px)] bg-white border border-slate-300 rounded-xl shadow-2xl p-4.5 text-left text-navy font-sans animate-fade-in ${alignmentClass}`}
          style={{
            boxShadow: '0 16px 36px -4px rgba(11, 31, 58, 0.2), 0 6px 16px -2px rgba(11, 31, 58, 0.1)'
          }}
        >
          {/* Invisible hover bridge to prevent mouseleave during transit across top margin */}
          <div className="absolute -top-3 left-0 right-0 h-3 bg-transparent pointer-events-auto" />

          {/* Header row with badge and close button */}
          <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5 mb-3">
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-gold shrink-0" />
              <span className="font-mono text-[9px] font-bold text-gold uppercase tracking-wider bg-gold/10 px-2 py-0.5 rounded border border-gold/20">
                {badge} · [{citationNumber}]
              </span>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="text-slate-400 hover:text-navy p-1 -mr-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close citation"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Title & Source Institution */}
          <div className="space-y-1 mb-3">
            <h4 id={`title-${id}`} className="font-sans font-bold text-[13px] text-navy leading-snug">
              {title}
            </h4>
            {subtitle && (
              <p className="font-mono text-[10px] text-slate-500 leading-tight font-medium">
                {subtitle}
              </p>
            )}
            <p className="text-[11px] text-slate-600 font-medium pt-0.5">
              Source: <span className="text-navy font-semibold">{sourceName}</span>
            </p>
          </div>

          {/* Key Facts / Verified details */}
          <div id={`facts-${id}`} className="space-y-2 mb-3.5 bg-[#FAF8F5] p-2.5 rounded-lg border border-slate-200/80">
            <span className="font-mono text-[8.5px] font-bold text-slate-500 uppercase tracking-wider block">
              Verified Primary Document Findings:
            </span>
            <ul className="space-y-1.5">
              {details.map((detail, idx) => (
                <li key={idx} className="text-[11px] text-slate-700 leading-relaxed flex items-start gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-gold shrink-0 mt-0.5" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Primary Source Links */}
          {links && links.length > 0 && (
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-1.5">
              <span className="font-mono text-[8.5px] font-bold text-slate-400 uppercase tracking-wider block">
                Primary Documentation &amp; Regulatory Links:
              </span>
              <div className="flex flex-col gap-1.5">
                {links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-between text-[11px] font-semibold text-navy hover:text-gold bg-slate-50 hover:bg-gold/5 px-2.5 py-1.5 rounded border border-slate-200 hover:border-gold/40 transition-colors group/link"
                  >
                    <span className="truncate pr-2">{link.label}</span>
                    <ExternalLink className="w-3 h-3 text-slate-400 group-hover/link:text-gold shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Footer note indicating pin status */}
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[9.5px] text-slate-400 font-mono">
            <span>{isPinned ? 'Pinned (click anywhere outside to dismiss)' : 'Hover or click to keep open'}</span>
            <span className="text-slate-400">Esc to close</span>
          </div>
        </div>
      )}
    </span>
  );
}
