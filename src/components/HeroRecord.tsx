import React, { useState } from 'react';
import { ShieldCheck, Check, AlertTriangle, AlertCircle, CornerDownRight, ArrowDown } from 'lucide-react';

interface ScenarioField {
  id: string;
  label: string;
  value: string;
  status: 'confirmed' | 'gap';
  statusText: 'CONFIRMED' | 'FLAGGED';
  sourceSpan: string | null;
  complianceNote: string;
  subValue?: string;
}

interface HeroScenarioData {
  id: 'food' | 'housing';
  name: string;
  badge: string;
  confirmedCount: number;
  gapCount: number;
  renderSourceNote: (
    activeField: string | null,
    setActiveField: (f: string | null) => void
  ) => React.ReactNode;
  fields: ScenarioField[];
  narrativeText: string;
  flaggedGaps: string[];
}

export default function HeroRecord() {
  const [activeScenario, setActiveScenario] = useState<'food' | 'housing'>('food');
  const [activeField, setActiveField] = useState<string | null>(null);

  const scenarios: Record<'food' | 'housing', HeroScenarioData> = {
    food: {
      id: 'food',
      name: 'Example 1: Food',
      badge: '3 Confirmed · 2 Flagged',
      confirmedCount: 3,
      gapCount: 2,
      renderSourceNote: (active, setActive) => (
        <p className="font-serif italic text-[13.5px] leading-relaxed text-slate-700 mb-2">
          &ldquo;Visited Ms. Davis.{' '}
          <mark
            onClick={() => setActive(active === 'diagnosis' ? null : 'diagnosis')}
            onMouseEnter={() => setActive('diagnosis')}
            onMouseLeave={() => setActive(null)}
            tabIndex={0}
            role="button"
            aria-label="Maps to ICD-10 Z59.41"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setActive(active === 'diagnosis' ? null : 'diagnosis');
              }
            }}
            className={`transition-all duration-150 rounded px-1 py-0.5 font-sans not-italic cursor-pointer ${
              active === 'diagnosis'
                ? 'bg-emerald-200 text-emerald-950 ring-2 ring-emerald-500 font-semibold'
                : 'bg-emerald-50 text-emerald-900 border border-emerald-300/80'
            }`}
            title="Maps to ICD-10 Z59.41"
          >
            Family of 3 has no food left in house, skipped dinner last night
          </mark>
          .{' '}
          <mark
            onClick={() => setActive(active === 'referral' ? null : 'referral')}
            onMouseEnter={() => setActive('referral')}
            onMouseLeave={() => setActive(null)}
            tabIndex={0}
            role="button"
            aria-label="Maps to Food Pantry Referral"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setActive(active === 'referral' ? null : 'referral');
              }
            }}
            className={`transition-all duration-150 rounded px-1 py-0.5 font-sans not-italic cursor-pointer ${
              active === 'referral'
                ? 'bg-emerald-200 text-emerald-950 ring-2 ring-emerald-500 font-semibold'
                : 'bg-emerald-50 text-emerald-900 border border-emerald-300/80'
            }`}
            title="Maps to Food Pantry Referral"
          >
            Referred her to food pantry
          </mark>
          .{' '}
          <mark
            onClick={() => setActive(active === 'consent' ? null : 'consent')}
            onMouseEnter={() => setActive('consent')}
            onMouseLeave={() => setActive(null)}
            tabIndex={0}
            role="button"
            aria-label="Flagged Gap: Paper consent is not an electronic HIE consent flag"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setActive(active === 'consent' ? null : 'consent');
              }
            }}
            className={`transition-all duration-150 rounded px-1 py-0.5 font-sans not-italic cursor-pointer ${
              active === 'consent'
                ? 'bg-amber-200 text-amber-950 ring-2 ring-amber-500 font-semibold'
                : 'bg-amber-50 text-amber-900 border border-amber-300/80'
            }`}
            title="Flagged Gap: Paper consent is not an electronic HIE consent flag"
          >
            Consent form signed on paper
          </mark>
          .{' '}
          <mark
            onClick={() => setActive(active === 'duration' ? null : 'duration')}
            onMouseEnter={() => setActive('duration')}
            onMouseLeave={() => setActive(null)}
            tabIndex={0}
            role="button"
            aria-label="Maps to 15 min duration"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setActive(active === 'duration' ? null : 'duration');
              }
            }}
            className={`transition-all duration-150 rounded px-1 py-0.5 font-sans not-italic cursor-pointer ${
              active === 'duration'
                ? 'bg-emerald-200 text-emerald-950 ring-2 ring-emerald-500 font-semibold'
                : 'bg-emerald-50 text-emerald-900 border border-emerald-300/80'
            }`}
            title="Maps to 15 min duration"
          >
            15 mins
          </mark>
          .&rdquo;
        </p>
      ),
      fields: [
        {
          id: 'diagnosis',
          label: 'Classification',
          value: 'ICD-10 Z59.41 · Food Insecurity',
          status: 'confirmed',
          statusText: 'CONFIRMED',
          sourceSpan: 'Family of 3 has no food left in house, skipped dinner last night.',
          complianceNote: 'Supported by the documented lack of food in the household and skipped meals.'
        },
        {
          id: 'duration',
          label: 'Encounter Duration',
          value: '15 minutes',
          status: 'confirmed',
          statusText: 'CONFIRMED',
          sourceSpan: '15 mins.',
          complianceNote: 'Documented directly in the source note.'
        },
        {
          id: 'referral',
          label: 'Documented Intervention',
          value: 'Food pantry referral',
          status: 'confirmed',
          statusText: 'CONFIRMED',
          sourceSpan: 'Referred her to food pantry.',
          complianceNote: 'Documented directly in the source note.'
        },
        {
          id: 'screening',
          label: 'Screening Instrument',
          value: 'Not documented',
          status: 'gap',
          statusText: 'FLAGGED',
          sourceSpan: null,
          complianceNote: 'No screening instrument is identified in the source note. LOINC 96777-8 is withheld because administration is not documented.'
        },
        {
          id: 'consent',
          label: 'Consent Status',
          value: 'Not verified',
          status: 'gap',
          statusText: 'FLAGGED',
          sourceSpan: 'Consent form signed on paper.',
          complianceNote: 'The source documents a paper signature. No electronic HIE consent flag is present in the supplied record.'
        }
      ],
      narrativeText:
        'Frontline encounter with Ms. Davis. Family of 3 has no food left in the house and skipped meals, mapped to ICD-10 Z59.41 Food Insecurity. Food pantry referral documented. Encounter duration documented as 15 minutes.',
      flaggedGaps: [
        'Screening instrument not documented.',
        'Electronic HIE consent not verified.'
      ]
    },
    housing: {
      id: 'housing',
      name: 'Example 2: Housing Instability',
      badge: '2 Confirmed · 3 Flagged',
      confirmedCount: 2,
      gapCount: 3,
      renderSourceNote: (active, setActive) => (
        <p className="font-serif italic text-[13.5px] leading-relaxed text-slate-700 mb-2">
          &ldquo;
          <mark
            onClick={() => setActive(active === 'diagnosis' ? null : 'diagnosis')}
            onMouseEnter={() => setActive('diagnosis')}
            onMouseLeave={() => setActive(null)}
            tabIndex={0}
            role="button"
            aria-label="Maps to ICD-10 Z59.1 Inadequate Housing"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setActive(active === 'diagnosis' ? null : 'diagnosis');
              }
            }}
            className={`transition-all duration-150 rounded px-1 py-0.5 font-sans not-italic cursor-pointer ${
              active === 'diagnosis'
                ? 'bg-emerald-200 text-emerald-950 ring-2 ring-emerald-500 font-semibold'
                : 'bg-emerald-50 text-emerald-900 border border-emerald-300/80'
            }`}
            title="Maps to ICD-10 Z59.1 Inadequate Housing"
          >
            Found water damage and visible mold in bedrooms.
          </mark>{' '}
          Landlord has ignored requests for repair. Member&apos;s child has active asthma.{' '}
          <mark
            onClick={() => setActive(active === 'referral' ? null : 'referral')}
            onMouseEnter={() => setActive('referral')}
            onMouseLeave={() => setActive(null)}
            tabIndex={0}
            role="button"
            aria-label="Maps to Legal Aid Referral"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setActive(active === 'referral' ? null : 'referral');
              }
            }}
            className={`transition-all duration-150 rounded px-1 py-0.5 font-sans not-italic cursor-pointer ${
              active === 'referral'
                ? 'bg-emerald-200 text-emerald-950 ring-2 ring-emerald-500 font-semibold'
                : 'bg-emerald-50 text-emerald-900 border border-emerald-300/80'
            }`}
            title="Maps to Legal Aid Referral"
          >
            Referral to legal aid.
          </mark>{' '}
          <mark
            onClick={() => setActive(active === 'consent' ? null : 'consent')}
            onMouseEnter={() => setActive('consent')}
            onMouseLeave={() => setActive(null)}
            tabIndex={0}
            role="button"
            aria-label="Flagged Gap: Verbal consent is not an electronic HIE consent flag"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setActive(active === 'consent' ? null : 'consent');
              }
            }}
            className={`transition-all duration-150 rounded px-1 py-0.5 font-sans not-italic cursor-pointer ${
              active === 'consent'
                ? 'bg-amber-200 text-amber-950 ring-2 ring-amber-500 font-semibold'
                : 'bg-amber-50 text-amber-900 border border-amber-300/80'
            }`}
            title="Flagged Gap: Verbal consent is not an electronic HIE consent flag"
          >
            Verbal consent obtained.
          </mark>
          &rdquo;
        </p>
      ),
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
          id: 'referral',
          label: 'Documented Intervention',
          value: 'Legal Aid Referral Dispatched',
          status: 'confirmed',
          statusText: 'CONFIRMED',
          sourceSpan: 'Referral to legal aid.',
          complianceNote: 'Legal advocacy referral logged verbatim in frontline casework note.'
        },
        {
          id: 'duration',
          label: 'Encounter Duration',
          value: 'Not documented',
          status: 'gap',
          statusText: 'FLAGGED',
          sourceSpan: null,
          complianceNote: 'Source note contains no duration or timestamps. Minimum clinical billing threshold cannot be verified.'
        },
        {
          id: 'screening',
          label: 'Screening Instrument',
          value: 'Not documented',
          status: 'gap',
          statusText: 'FLAGGED',
          sourceSpan: null,
          complianceNote: 'No screening instrument is identified in the source note. LOINC codes are withheld without documented administration.'
        },
        {
          id: 'consent',
          label: 'Consent Status',
          value: 'Not verified',
          status: 'gap',
          statusText: 'FLAGGED',
          sourceSpan: 'Verbal consent obtained.',
          complianceNote: 'The source notes verbal consent only. No electronic HIE consent flag is present in the supplied record.'
        }
      ],
      narrativeText:
        'Casework observation: Inadequate housing documented from source entry ("Found water damage and visible mold in bedrooms"; member\'s child with active asthma; mapped to ICD-10 Z59.1 Inadequate Housing). Dispatched intervention ("Referral to legal aid").',
      flaggedGaps: [
        'Encounter duration not documented.',
        'Screening instrument not documented.',
        'Electronic HIE consent not verified.'
      ]
    }
  };

  const current = scenarios[activeScenario];

  return (
    <div className="w-full lg:max-w-[560px] bg-white p-5 sm:p-7 rounded-2xl border border-navy/10 shadow-lg text-left relative overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="space-y-5">
        {/* SINGLE-RECORD SPAN-TRACING HEADER */}
        <div className="space-y-1">
          <span className="font-sans text-[11px] text-[#8B6420] uppercase font-semibold tracking-[0.08em] block">
            SINGLE-RECORD SPAN TRACEABILITY
          </span>
          <h3 className="font-sans font-bold text-[20px] text-navy tracking-tight">
            Casework Span-to-Field Verification
          </h3>
        </div>

        {/* Scenario Switcher Tabs */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
          <div role="tablist" aria-label="Example Scenarios" className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-lg border border-slate-200/70 text-xs">
            <button
              type="button"
              role="tab"
              id="hero-tab-food"
              aria-selected={activeScenario === 'food'}
              aria-controls="hero-scenario-panel"
              tabIndex={activeScenario === 'food' ? 0 : -1}
              onClick={() => {
                setActiveScenario('food');
                setActiveField(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                  e.preventDefault();
                  setActiveScenario('housing');
                  setActiveField(null);
                  document.getElementById('hero-tab-housing')?.focus();
                }
              }}
              className={`min-h-[38px] px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B6420] ${
                activeScenario === 'food'
                  ? 'bg-white text-navy shadow-xs border border-slate-200 font-bold'
                  : 'text-slate-700 hover:text-navy'
              }`}
            >
              Example 1: Food
            </button>
            <button
              type="button"
              role="tab"
              id="hero-tab-housing"
              aria-selected={activeScenario === 'housing'}
              aria-controls="hero-scenario-panel"
              tabIndex={activeScenario === 'housing' ? 0 : -1}
              onClick={() => {
                setActiveScenario('housing');
                setActiveField(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                  e.preventDefault();
                  setActiveScenario('food');
                  setActiveField(null);
                  document.getElementById('hero-tab-food')?.focus();
                }
              }}
              className={`min-h-[38px] px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B6420] ${
                activeScenario === 'housing'
                  ? 'bg-white text-navy shadow-xs border border-slate-200 font-bold'
                  : 'text-slate-700 hover:text-navy'
              }`}
            >
              Example 2: Housing
            </button>
          </div>
          <span className="text-[10.5px] font-mono font-bold text-slate-600 uppercase tracking-wide">
            {current.badge}
          </span>
        </div>

        {/* Tabpanel Content */}
        <div id="hero-scenario-panel" role="tabpanel" aria-labelledby={activeScenario === 'food' ? 'hero-tab-food' : 'hero-tab-housing'} className="space-y-5">
        {/* Stage 1: Source Note */}
        <div className="space-y-2 text-left">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-sans text-[11px] text-slate-700 uppercase font-bold tracking-wider block">
                SOURCE DOCUMENTATION
              </span>
              <span className="text-xs text-slate-500">
                Existing casework note
              </span>
            </div>
          </div>

          <div className="bg-[#FAF8F5] border border-slate-200 rounded-xl p-4 text-[13px] leading-relaxed text-slate-800 font-sans relative">
            {current.renderSourceNote(activeField, setActiveField)}

            {/* Note legend / Source Span Index */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 pt-2 border-t border-slate-200/70 text-[10.5px]">
              <span className="flex items-center gap-1 text-emerald-800 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-600" aria-hidden="true" />
                CONFIRMED: Supported directly by source documentation.
              </span>
              <span className="flex items-center gap-1 text-amber-900 font-semibold">
                <span className="w-2 h-2 rounded-full bg-amber-600" aria-hidden="true" />
                FLAGGED: Required or relevant information is not sufficiently documented in the source.
              </span>
            </div>

            {/* Grounding feedback when active field is selected */}
            {activeField && (() => {
              const activeFieldObj = current.fields.find((f) => f.id === activeField);
              if (!activeFieldObj) return null;
              const isConfirmed = activeFieldObj.status === 'confirmed';
              return (
                <div
                  className={`mt-2.5 p-2.5 rounded-lg border text-xs flex items-start gap-2 animate-fadeIn ${
                    isConfirmed
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : 'bg-amber-50 border-amber-300 text-amber-950'
                  }`}
                >
                  {isConfirmed ? (
                    <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5 stroke-[3px]" aria-hidden="true" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
                  )}
                  <div>
                    <span className="font-bold block text-[11px] uppercase tracking-wide">
                      {isConfirmed ? `CONFIRMED: ${activeFieldObj.label}` : `FLAGGED: ${activeFieldObj.label}`}
                    </span>
                    <span className="text-[11.5px] leading-snug block mt-0.5 font-sans">
                      {isConfirmed ? (
                        <>
                          Directly supported by source text: &ldquo;{activeFieldObj.sourceSpan}&rdquo;
                        </>
                      ) : activeFieldObj.sourceSpan ? (
                        <>
                          Source text states &ldquo;{activeFieldObj.sourceSpan}&rdquo;. {activeFieldObj.complianceNote}
                        </>
                      ) : (
                        <>
                          {activeFieldObj.complianceNote}
                        </>
                      )}
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Dynamic Transition Divider */}
        <div className="flex items-center justify-center gap-4 py-0.5">
          <div className="h-px bg-gradient-to-r from-transparent via-[#E2E8F0] to-transparent flex-1" />
          <div className="flex flex-col items-center gap-0.5 shrink-0">
            <span className="text-[9.5px] font-mono font-semibold text-slate-500 uppercase tracking-wider bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full flex items-center gap-1">
              Structured Review Compilation
            </span>
            <ArrowDown className="w-3 h-3 text-slate-400 mt-0.5" aria-hidden="true" />
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-[#E2E8F0] to-transparent flex-1" />
        </div>

        {/* Stage 2 & 3: Structured Review Output */}
        <div className="space-y-2 text-left">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-sans text-[11px] text-slate-700 uppercase font-bold tracking-wider block">
                STRUCTURED REVIEW OUTPUT
              </span>
              <span className="text-xs text-slate-500">
                CCX structures documented information and identifies missing evidence.
              </span>
            </div>
          </div>

          <div className="bg-[#0B1F3A] text-white rounded-xl p-4 sm:p-5 border border-white/10 space-y-3 shadow-md">
            {/* Explanatory statement used once */}
            <div className="bg-white/[0.04] border border-white/10 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-300">
              Every structured field is linked to supporting source text. Unsupported information remains unresolved for review.
            </div>

            {current.fields.map((field) => {
              const isConfirmed = field.status === 'confirmed';
              const isActive = activeField === field.id;

              return (
                <div
                  key={field.id}
                  onClick={() => setActiveField(activeField === field.id ? null : field.id)}
                  onMouseEnter={() => setActiveField(field.id)}
                  onMouseLeave={() => setActiveField(null)}
                  tabIndex={0}
                  role="button"
                  aria-label={`${field.label}, status ${field.statusText}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActiveField(activeField === field.id ? null : field.id);
                    }
                  }}
                  className={`p-2.5 rounded-lg transition-all duration-150 border cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B6420] ${
                    isConfirmed
                      ? isActive
                        ? 'bg-emerald-950/50 border-emerald-400 ring-1 ring-emerald-400'
                        : 'bg-white/[0.03] border-white/10 hover:border-emerald-500/40'
                      : isActive
                        ? 'bg-amber-950/60 border-amber-400 ring-2 ring-amber-400/80 shadow-sm'
                        : 'bg-amber-950/30 border-amber-500/40 hover:border-amber-400/70'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className={isConfirmed ? 'text-slate-200 font-medium' : 'text-amber-200 font-medium'}>
                      {field.label}
                    </span>
                    <span
                      className={`text-[9.5px] font-mono font-bold uppercase px-1.5 py-0.5 rounded flex items-center gap-1 border ${
                        isConfirmed
                          ? 'bg-emerald-500/20 text-emerald-200 border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-200 border-amber-500/40'
                      }`}
                    >
                      {isConfirmed ? (
                        <>
                          <Check className="w-3 h-3 stroke-[3px]" aria-hidden="true" /> CONFIRMED
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-3 h-3 stroke-[2.5px]" aria-hidden="true" /> FLAGGED
                        </>
                      )}
                    </span>
                  </div>

                  <div
                    className={`font-bold text-xs mt-1 ${
                      isConfirmed ? 'text-white' : 'text-amber-200 font-mono'
                    }`}
                  >
                    {field.value}{' '}
                    {field.subValue && (
                      <span className="text-slate-200 font-normal text-[11px]">{field.subValue}</span>
                    )}
                  </div>

                  {/* Traceable Source Span or Flag Notice */}
                  {field.sourceSpan ? (
                    <div
                      className={`flex items-start gap-1.5 mt-1.5 text-[10.5px] font-mono px-2 py-1 rounded border ${
                        isConfirmed
                          ? 'text-emerald-200 bg-emerald-950/30 border-emerald-500/20'
                          : 'text-amber-200 bg-amber-950/40 border-amber-500/30'
                      }`}
                    >
                      <CornerDownRight
                        className={`w-3 h-3 shrink-0 mt-0.5 ${
                          isConfirmed ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                        aria-hidden="true"
                      />
                      <div>
                        <span className="block text-[9.5px] uppercase font-semibold text-slate-300">Source phrase</span>
                        <span>
                          &ldquo;{field.sourceSpan}&rdquo;
                        </span>
                        {!isConfirmed && (
                          <span className="block text-[10px] text-amber-300/80 mt-0.5">
                            Reason: {field.complianceNote}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-1.5 mt-1.5 text-[10.5px] text-amber-200 font-mono bg-amber-950/40 px-2 py-1 rounded border border-amber-500/30">
                      <AlertCircle className="w-3 h-3 shrink-0 mt-0.5 text-amber-400" aria-hidden="true" />
                      <div>
                        <span className="block text-[9.5px] uppercase font-semibold text-amber-400">Reason for flagged gap</span>
                        <span>
                          {field.complianceNote}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Structured Encounter Summary */}
            <div className="pt-3 border-t border-white/10 text-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-slate-200 block text-[9.5px] uppercase font-bold tracking-tight">
                  STRUCTURED ENCOUNTER SUMMARY
                </span>
              </div>
              <div className="font-sans text-[11.5px] text-white/90 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/10 space-y-2">
                <p>{current.narrativeText}</p>
                <div className="pt-2 border-t border-white/10 space-y-1 text-[11px]">
                  <p className="text-[10px] font-bold text-amber-200/90 uppercase tracking-wide">Flagged gaps:</p>
                  {current.flaggedGaps.map((gap, idx) => (
                    <div key={idx} className="text-amber-200 flex items-start gap-1.5">
                      <span>•</span>
                      <span>{gap}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
