# CCX Content Governance Specification

**Document Reference**: CCX-GOV-2026-01  
**Entity**: Community Claims Exchange (CCX)  
**Jurisdiction**: New York State Medicaid 1115 Demonstration (NYHER Waiver)  
**Last Reconciled**: September 15, 2026  
**Status**: Canonical Standard · Reconciled

---

## 1. Executive Summary & Audit Purpose

This document establishes the official Content Governance Specification for `ccxny.org`. It reconciles historical specification drift between early wireframe documentation and the live production application, providing authoritative rules for copy, call-to-action (CTA) phrasing, and primary navigation structure.

---

## 2. Call-to-Action (CTA) Copy Standard

### 2.1 Canonical Locked Phrasing
* **Canonical Phrasing**: `"Request a Documentation Exposure Assessment"`
* **Permitted Short Form**: *None for primary action buttons or section headers.* (Any abbreviated variant is considered non-compliant).

### 2.2 Enforcement Locations
1. **Section 12 Header**:
   * Text: `Request a Documentation Exposure Assessment`
   * Element: `<h2>` in `#contact`
2. **Section 12 Primary Form Submission Button**:
   * Text: `Request a Documentation Exposure Assessment`
   * Element: Submit button in `#contact` form
3. **Footer Quick Links**:
   * Text: `Request a Documentation Exposure Assessment`
   * Element: Navigation anchor to `#contact`
4. **Legal Disclaimer Alignment**:
   * Regulatory cross-reference: Matches the disclaimer in the global footer (*"Use of CCX, including the Documentation Exposure Assessment, does not guarantee Medicaid reimbursement..."*).

### 2.3 Drift Analysis & Resolution
* **Historical State**: The live page had drifted into two inconsistent variants on the same screen:
  * Section header: `"Request an Exposure Assessment"` (dropped "Documentation")
  * Button label: `"Request Exposure Assessment"` (dropped "a" and "Documentation")
* **Classification**: **Unintentional colloquial drift / button truncation**.
* **Governance Decision**: **Restored the locked copy everywhere.**
* **Statutory & Regulatory Rationale**: Under 18 NYCRR Part 521 and NYS OMIG audit protocols, CCX evaluates *documentation integrity* (casework evidence, deterministic crosswalks, duration thresholds, and supervisor sign-offs). The word "Documentation" is the core substantive differentiator that distinguishes CCX from clinical care assessments or financial actuarial models.

---

## 3. Site Navigation Hierarchy Standard

### 3.1 Canonical Primary Navigation
The official top navigation structure consists of **six (6) items** in exact sequence:

| Order | Label | Anchor / Target | Purpose & Diligence Alignment |
| :---: | :--- | :--- | :--- |
| **1** | **Platform** | `#produces` | Describes what CCX produces (deterministic evidence records, retrospective review packages). |
| **2** | **Assessment** | `#exposure-review` | Interactive retrospective diagnostic scenarios with zero client uploads. |
| **3** | **Security & BAA** | `#compliance-guardrails` | Healthcare procurement prerequisites: BAA execution, AWS US-East / GovCloud hosting, SOC 2 timeline. |
| **4** | **About** | `#about-ccx` | Corporate substance: legal entity standing, non-operating holding structure, deterministic open architecture. |
| **5** | **Resources** | View: `resources` | Statutory reference library: 18 NYCRR Part 521, OMIG work plans, 1115 waiver guidance. |
| **6** | **Contact** | `#contact` | Gated request form for confidential retrospective documentation exposure assessments under BAA. |

### 3.2 Comparison with Legacy 5-Item Spec
* **Legacy Wireframe Spec**: `"Platform / Assessment / Trust Center / Resources / Contact"` (5 items)
* **Live Production Navigation**: `"Platform / Assessment / Security & BAA / About / Resources / Contact"` (6 items)

### 3.3 Drift Analysis & Governance Decision
* **Classification**: **Intentional post-wireframe structural enhancement**.
* **Governance Decision**: **Updated the Content Governance Spec to match the live 6-item navigation.**
* **Substantive Rationale**:
  1. **Healthcare Procurement Friction**: In New York 1115 Medicaid waiver contracting, compliance and legal officers prioritize two gating questions: *"Will you sign our BAA?"* and *"Where does data live?"* Replacing the generic label `"Trust Center"` with `"Security & BAA"` directs reviewers straight to Section 10 (`#compliance-guardrails`), accelerating procurement clearance.
  2. **Corporate & Operating Substance ("About")**: Section 11 (`#about-ccx`) was created to directly address reviewer skepticism regarding early-stage vendor risk by publishing corporate entity standing, holding company structure, and code governance. Including `"About"` in the primary navigation ensures this due-diligence section is not orphaned.
  3. **Tiered Trust Architecture**: The comprehensive standalone hub (`ComplianceTrustCenter.tsx`) remains fully functional and accessible via the high-visibility link in Section 10 (*"Open Full Compliance Trust Center →"*) and the global footer (*"Compliance & Integrity Trust Hub"*).
  4. **Accessibility & Responsive Geometry**: The 6-item navigation complies with WCAG 2.2 AA target sizing (minimum 44px touch targets on mobile) and fits cleanly across desktop breakpoints (`max-w-[1160px]`).

---

## 4. Change Control & Decision Record

| Date | Specification Section | Prior State | Approved Canonical State | Decision Type | Approver |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 2026-09-15 | § 2 (CTA Copy) | Divergent headings/buttons ("Request an Exposure Assessment" vs "Request Exposure Assessment") | `"Request a Documentation Exposure Assessment"` (heading, button, footer) | Restored to Locked Spec | Content Governance Board |
| 2026-09-15 | § 3 (Navigation) | Legacy 5-item spec ("Platform / Assessment / Trust Center / Resources / Contact") | `"Platform / Assessment / Security & BAA / About / Resources / Contact"` (6 items) | Spec Updated to Match Intentional Architecture | Content Governance Board |

---

## 5. Technical Validation Guidelines

All pull requests and template updates must verify:
* [x] Heading at Section 12 matches `"Request a Documentation Exposure Assessment"`.
* [x] Submit button at Section 12 matches `"Request a Documentation Exposure Assessment"`.
* [x] Top navigation in `Header.tsx` preserves all 6 items with accurate anchor targets.
* [x] Global footer quick links align with the 6 canonical sections.
* [x] No arbitrary colloquial truncations are introduced in future revisions.
