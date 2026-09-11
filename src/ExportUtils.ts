/**
 * ExportUtils.ts
 * Reusable utility functions for generating and exporting CCX compliance assets,
 * caseload templates, and diagnostic blueprints.
 */

export interface ExportScenarioPreset {
  id: string;
  name: string;
  rawNote: string;
  riskLevel: 'HIGH' | 'MODERATE' | 'LOW' | string;
  score: number;
  gaps: string[];
  correctiveAction: string;
}

/**
 * Low-level utility to trigger a browser file download using Blob and temporary anchor element.
 */
export function triggerFileDownload(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates the CSV content for the de-identified caseload batch ingestion template.
 */
export function generateCaseloadTemplateCsv(): string {
  return [
    '# CCX RETROSPECTIVE BATCH INGESTION TEMPLATE — DE-IDENTIFIED SPECIFICATION',
    '# MANDATORY PRIVACY RULE: Strip all 18 HIPAA Safe Harbor identifiers (no names, MRNs, SSNs, phone numbers, exact birthdates, addresses).',
    '# Use synthetic encounter IDs and month/year offsets only. Real uploads occur strictly under signed BAA.',
    'encounter_id,service_month_year,duration_minutes,staff_credential,service_category,raw_casework_narrative,referral_destination,consent_documentation_type',
    'ENC-00101,2025-03,15,CHW,Food Insecurity,"Member intake visit: family ran out of groceries after SNAP lapse; child skipped breakfast. Connected to community food pantry. Verbal consent obtained.","Valley Harvest Food Bank",verbal_unverified',
    'ENC-00102,2025-03,8,Peer Specialist,Housing Instability,"Followed up on tenant eviction notice. Apartment has broken heating and ceiling mold exacerbating asthma. Sent referral to legal aid.","Metropolitan Legal Aid",client_signed_paper',
    'ENC-00103,2025-03,20,Care Navigator,Transportation Barrier,"Screened using SDOH tool. Patient unable to attend dialysis appointments due to lack of public transit accessible van. Scheduled NEMT ride. Consent verified on HIE.","County Transit Coordinated Ride",hie_verified_consent'
  ].join('\n');
}

/**
 * Downloads the de-identified caseload template (.csv).
 */
export function downloadCaseloadTemplate(): void {
  const csvContent = generateCaseloadTemplateCsv();
  triggerFileDownload(csvContent, 'ccx_deidentified_caseload_template.csv', 'text/csv;charset=utf-8;');
}

/**
 * Generates the text report content for a Diagnostic Blueprint deficit evaluation.
 */
export function generateDiagnosticBlueprintText(preset: ExportScenarioPreset): string {
  return [
    '================================================================================',
    'COMMUNITY CLAIMS EXCHANGE (CCX) — MEDICAID HRSN RETROSPECTIVE DEFICIT DIAGNOSTIC',
    '================================================================================',
    `Document Reference : CCX-DX-${preset.id.toUpperCase()}-${new Date().toISOString().slice(0, 10)}`,
    `Evaluated Scenario : ${preset.name}`,
    `Risk Profile       : ${preset.riskLevel} RISK (Deficit Exposure Score: ${preset.score}/100)`,
    '',
    'FRONTLINE ENCOUNTER SOURCE NOTE (DE-IDENTIFIED):',
    `"${preset.rawNote}"`,
    '',
    '--------------------------------------------------------------------------------',
    'IDENTIFIED NARRATIVE DEFICITS & CLAWBACK RISKS:',
    '--------------------------------------------------------------------------------',
    ...preset.gaps.map((gap, i) => `[DEFICIT ${i + 1}] ${gap}`),
    '',
    '--------------------------------------------------------------------------------',
    'RECOMMENDED SCN CORRECTIVE STRATEGY:',
    '--------------------------------------------------------------------------------',
    preset.correctiveAction,
    '',
    '--------------------------------------------------------------------------------',
    'RETROSPECTIVE STANDARDIZATION PROTOCOL SPECIFICATIONS:',
    '--------------------------------------------------------------------------------',
    '• Taxonomy Mapping     : ICD-10 SDOH Z-codes verified against contemporaneous source spans.',
    '• Duration Threshold   : Enforces NYHER 1115 manual billing minimums without synthetic inflation.',
    '• Consent Verification : Paper consents flagged; requires regional HIE electronic consent flags.',
    '• Zero Hallucination   : Unsubstantiated fields withheld from final billing packages.',
    '',
    '================================================================================',
    'Community Claims Exchange (CCX) · Medicaid Retrospective SCN Standardization',
    'Delaware C-Corporation · Compliance & Integrity Operations',
    'Confidential Enterprise Review Document · Generated upon institutional request',
    '================================================================================'
  ].join('\n');
}

/**
 * Downloads the Diagnostic Blueprint Report (.txt) for the provided scenario preset.
 */
export function downloadDiagnosticBlueprint(preset: ExportScenarioPreset): void {
  const reportContent = generateDiagnosticBlueprintText(preset);
  triggerFileDownload(reportContent, `ccx_diagnostic_blueprint_${preset.id}.txt`, 'text/plain;charset=utf-8;');
}
