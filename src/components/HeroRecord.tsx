import React, { useState } from 'react';
import { ShieldCheck, Check, AlertTriangle, AlertCircle, CornerDownRight, ArrowDown } from 'lucide-react';

interface ScenarioField {
  id: string;
  label: string;
  value: string;
  status: 'confirmed' | 'gap';
  statusText: 'CONFIRMED' | 'FLAGGED GAP';
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
      name: 'Example 1: Food Insecurity',
      badge: '3 Confirmed · 2 Flagged Gaps',
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
          label: 'Classification (ICD-10)',
          value: 'ICD-10 Z59.41 (Food Insecurity)',
          status: 'confirmed',
          statusText: 'CONFIRMED',
          sourceSpan: 'Family of 3 has no food left in house, skipped dinner last night',
          complianceNote: 'Grounded directly in documented lack of food in household and skipped meals.'
        },
        {
          id: 'duration',
          label: 'Encounter Duration',
          value: '15 Minutes',
          subValue: '(Meets clinical billing threshold)',
          status: 'confirmed',
          statusText: 'CONFIRMED',
          sourceSpan: '15 mins.',
          complianceNote: 'Contemporaneous encounter duration documented verbatim in casework note.'
        },
        {
          id: 'referral',
          label: 'Documented Intervention',
          value: 'Food Pantry Referral Dispatched',
          status: 'confirmed',
          statusText: 'CONFIRMED',
          sourceSpan: 'Referred her to food pantry',
          complianceNote: 'Community referral action documented verbatim in frontline note.'
        },
        {
          id: 'screening',
          label: 'Screening Instrument',
          value: 'Screening Instrument: NOT DOCUMENTED — flag for compliance review',
          status: 'gap',
          statusText: 'FLAGGED GAP',
          sourceSpan: null,
          complianceNote: 'Source note is a caseworker narrative; no screening tool (LOINC 96777-8 AHC HRSN) was administered. Code withheld from record.'
        },
        {
          id: 'consent',
          label: 'Consent Status',
          value: 'Consent Status: NOT VERIFIED — no HIE consent flag found in source record',
          status: 'gap',
          statusText: 'FLAGGED GAP',
          sourceSpan: 'Consent form signed on paper',
          complianceNote: 'Source shows paper signature ("Consent form signed on paper"); paper consent is not an electronic HIE consent flag. Flagged for review.'
        }
      ],
      narrativeText:
        'Frontline encounter with Ms. Davis. Household (family of 3) has no food left in house, skipped dinner last night (ICD-10 Z59.41 Food Insecurity). Referred to food pantry. Documented encounter duration: 15 minutes.',
      flaggedGaps: [
        'Screening Instrument: NOT DOCUMENTED — no screening tool administered in source note; LOINC 96777-8 withheld for review.',
        'Consent Status: NOT VERIFIED — source shows paper signature ("Consent form signed on paper"); no verified electronic HIE consent flag found in source record.'
      ]
    },
    housing: {
      id: 'housing',
      name: 'Example 2: Housing Instability',
      badge: '2 Confirmed · 3 Flagged Gaps',
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
          value: 'Encounter Duration: NOT DOCUMENTED — flag for compliance review',
          status: 'gap',
          statusText: 'FLAGGED GAP',
          sourceSpan: null,
          complianceNote: 'Source note contains no duration or timestamps. Minimum clinical billing threshold cannot be verified. Zero fabrication policy enforces audit gap flag.'
        },
        {
          id: 'screening',
          label: 'Screening Instrument',
          value: 'Screening Instrument: NOT DOCUMENTED — flag for compliance review',
          status: 'gap',
          statusText: 'FLAGGED GAP',
          sourceSpan: null,
          complianceNote: 'No screening instrument mentioned in source note. CCX withholds LOINC codes without documented administration.'
        },
        {
          id: 'consent',
          label: 'Consent Status',
          value: 'Consent Status: NOT VERIFIED — no HIE consent flag found in source record',
          status: 'gap',
          statusText: 'FLAGGED GAP',
          sourceSpan: 'Verbal consent obtained.',
          complianceNote: 'Source notes verbal consent only ("Verbal consent obtained"); verbal consent is not an electronic HIE consent flag. Flagged for review.'
        }
      ],
      narrativeText:
        'Casework observation: Inadequate housing documented from source entry ("Found water damage and visible mold in bedrooms"; member\'s child with active asthma; mapped to ICD-10 Z59.1 Inadequate Housing). Dispatched intervention ("Referral to legal aid").',
      flaggedGaps: [
        'Encounter Duration: NOT DOCUMENTED — no duration stated in source entry; minimum clinical billing threshold cannot be verified.',
        'Screening Instrument: NOT DOCUMENTED — no screening tool administered in source note; LOINC codes withheld for review.',
        'Consent Status: NOT VERIFIED — verbal consent only ("Verbal consent obtained"); no contemporaneous HIE consent flag found in source record.'
      ]
    }
  };

  const current = scenarios[activeScenario];

  return (
    <div className="w-full lg:max-w-[560px] bg-white p-5 sm:p-7 rounded-2xl border border-navy/10 shadow-lg text-left relative overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="space-y-5">
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
        {/* Stage 1: Messy Documentation */}
        <div className="space-y-2 text-left">
          <div className="flex items-center justify-between">
            <span className="font-sans text-[11px] text-slate-700 uppercase font-bold tracking-wider">
              Messy Documentation (Source Note)
            </span>
            <span className="text-[10px] font-mono text-amber-800 font-bold uppercase bg-amber-50 border border-amber-300 px-2 py-0.5 rounded-md flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-amber-700" aria-hidden="true" /> Read-Only Source Intake
            </span>
          </div>

          <div className="bg-[#FAF8F5] border border-slate-200 rounded-xl p-4 text-[13px] leading-relaxed text-slate-800 font-sans relative">
            {current.renderSourceNote(activeField, setActiveField)}

            {/* Note legend / gap callout */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/70 text-[10.5px]">
              <span className="flex items-center gap-1 text-emerald-800 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-600" aria-hidden="true" /> {current.confirmedCount} Confirmed Spans
              </span>
              <span className="text-slate-400" aria-hidden="true">•</span>
              <span className="flex items-center gap-1 text-amber-900 font-semibold">
                <span className="w-2 h-2 rounded-full bg-amber-600" aria-hidden="true" /> {current.gapCount} Flagged Compliance Gaps
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
                      {isConfirmed ? `Grounded: ${activeFieldObj.label}` : `Flagged Gap: ${activeFieldObj.label}`}
                    </span>
                    <span className="text-[11.5px] leading-snug block mt-0.5 font-sans">
                      {isConfirmed ? (
                        <>
                          Directly grounded in literal text: &ldquo;{activeFieldObj.sourceSpan}&rdquo;
                        </>
                      ) : activeFieldObj.sourceSpan ? (
                        <>
                          Source states &ldquo;{activeFieldObj.sourceSpan}&rdquo; — not an electronic HIE consent flag. Flagged for review.
                        </>
                      ) : (
                        <>
                          Not documented in source note. CCX flags this gap rather than fabricating a value.
                        </>
                      )}
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Dynamic Transition Indicator */}
        <div className="flex items-center justify-center gap-4 py-0.5">
          <div className="h-px bg-gradient-to-r from-transparent via-[#E2E8F0] to-transparent flex-1" />
          <div className="flex flex-col items-center gap-0.5 shrink-0">
            <span className="text-[9.5px] font-mono font-bold text-[#8B6420] uppercase tracking-wider bg-gold/10 border border-gold/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              CCX Strict Traceability Engine
            </span>
            <ArrowDown className="w-3.5 h-3.5 text-[#8B6420] animate-bounce mt-0.5" aria-hidden="true" />
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-[#E2E8F0] to-transparent flex-1" />
        </div>

        {/* Stage 2 & 3: Structured & Audit-Ready Record */}
        <div className="space-y-2 text-left">
          <div className="flex items-center justify-between">
            <span className="font-sans text-[11px] text-slate-700 uppercase font-bold tracking-wider">
              Audit-Ready Record Output
            </span>
            <span className="text-[10px] font-sans text-[#8B6420] font-bold uppercase bg-gold/10 border border-gold/30 px-2 py-0.5 rounded-md flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#8B6420]" aria-hidden="true" /> Verbatim Traceability · Zero Inferred Facts
            </span>
          </div>

          <div className="bg-[#0B1F3A] text-white rounded-xl p-4 sm:p-5 border border-white/10 space-y-3 shadow-md">
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
                          <Check className="w-3 h-3 stroke-[3px]" aria-hidden="true" /> Confirmed
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-3 h-3 stroke-[2.5px]" aria-hidden="true" /> FLAGGED GAP
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

                  <p
                    className={`text-[11px] mt-1 leading-snug ${
                      isConfirmed ? 'text-slate-200' : 'text-amber-200'
                    }`}
                  >
                    {field.complianceNote}
                  </p>

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
                      <span>
                        {isConfirmed ? 'Source span: ' : 'Source phrase: '}
                        &ldquo;{field.sourceSpan}&rdquo;
                        {!isConfirmed && ' (not an electronic HIE consent flag)'}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-start gap-1.5 mt-1.5 text-[10.5px] text-amber-200 font-mono bg-amber-950/40 px-2 py-1 rounded border border-amber-500/30">
                      <AlertCircle className="w-3 h-3 shrink-0 mt-0.5 text-amber-400" aria-hidden="true" />
                      <span>
                        Source phrase: [None in source note] — {field.id === 'duration' ? 'duration withheld to prevent fabrication' : 'screening tool code withheld to prevent fabrication'}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Standardized Narrative Restatement */}
            <div className="pt-3 border-t border-white/10 text-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-slate-200 block text-[9.5px] uppercase font-bold tracking-tight">
                  Standardized Clinical Narrative Restatement
                </span>
                <span className="text-[9px] font-mono text-amber-200 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30 font-bold">
                  Strictly Grounded
                </span>
              </div>
              <div className="font-sans text-[11.5px] text-white/90 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/10 space-y-2">
                <p>{current.narrativeText}</p>
                <div className="pt-2 border-t border-white/10 space-y-1 text-[11px]">
                  {current.flaggedGaps.map((gap, idx) => (
                    <div key={idx} className="text-amber-200 flex items-start gap-1.5">
                      <span className="font-bold shrink-0" aria-hidden="true">⚠️ [COMPLIANCE GAP]:</span>
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
