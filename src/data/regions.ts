import { Region } from '../types';

export const SCN_REGIONS: Record<string, Region> = {
  capital: {
    id: "capital",
    name: "Capital Region",
    lead_entity: "Capital Region SCN Alliance",
    counties: ["Albany", "Columbia", "Greene", "Rensselaer", "Montgomery", "Saratoga", "Schenectady", "Schoharie"],
    operating_environment: "Extensively Documented",
    metrics: [
      {
        label: "Eligible Medicaid Lives (CCX Derived)",
        value: "200,000–250,000",
        provenance: "CCX Derived",
        confidence: "Medium",
        method_note: "Range-based estimate normalized from regional census projections"
      },
      {
        label: "Counties Covered",
        value: 8,
        provenance: "Official NYS Data",
        confidence: "High",
        method_note: "Verified from official NYS DOH regional service area rosters"
      },
      {
        label: "SCN Regional Infrastructure Allocation (CCX Derived)",
        value: "$25M–$30M",
        provenance: "CCX Derived",
        confidence: "Medium",
        method_note: "Estimated allocation derived from NYHER regional allocation tables"
      },
      {
        label: "Network Scale (CCX Derived)",
        value: "350–450 CBO Sites",
        provenance: "CCX Derived",
        confidence: "Medium",
        method_note: "Analytical projection of active county-level provider hubs"
      }
    ],
    insights: [
      {
        type: "Observation",
        text: "The 8-county geography exhibits high patient care density across separate urban and rural access points.",
        confidence: "High"
      },
      {
        type: "Implication",
        text: "Regional care systems generate documentation that must withstand retrospective OMIG audit review.",
        confidence: "Medium"
      },
      {
        type: "CCX Capability Mapping",
        text: "[CCX Derived] Retrospective structured-data mapping processes are designed to align exported documentation with compliance guidelines.",
        confidence: "High"
      },
      {
        type: "CCX Capability Mapping",
        text: "[CCX Derived] FHIR-compliant data streams aim to facilitate cross-system interoperability across diverse CBO platforms.",
        confidence: "High"
      }
    ],
    evidence: [
      {
        source: "NYS Department of Health Medicaid Waiver Update",
        type: "Official NYS Data",
        url: null
      },
      {
        source: "CCX Internal Documentation and Technical Specifications",
        type: "CCX Internal Documentation",
        url: null
      }
    ]
  },
  wnyicc: {
    id: "wnyicc",
    name: "Western NY",
    lead_entity: "Western NY Regional Health Alliance",
    counties: ["Cattaraugus", "Chautauqua", "Erie", "Niagara"],
    operating_environment: "Standard Public Evidence",
    metrics: [
      {
        label: "Eligible Medicaid Lives",
        value: "367,720",
        provenance: "Official NYS Data",
        confidence: "High"
      },
      {
        label: "Counties Covered",
        value: 4,
        provenance: "Official NYS Data",
        confidence: "High"
      },
      {
        label: "SCN Regional Infrastructure Allocation",
        value: "$36.9M",
        provenance: "Official NYS Data",
        confidence: "High"
      },
      {
        label: "Network Scale",
        value: "~120+ CBOs",
        provenance: "CCX Derived",
        confidence: "Medium"
      },
      {
        label: "Evaluation Status",
        value: "Standard Quality Monitoring",
        provenance: "Official NYS Data",
        confidence: "High"
      }
    ],
    insights: [
      {
        type: "Observation",
        text: "The network anchors Buffalo's dense urban centers alongside remote rural counties, creating extreme operational dispersion.",
        confidence: "High"
      },
      {
        type: "Implication",
        text: "Variability in CBO IT systems and training levels introduces high documentation error rates across counties.",
        confidence: "Medium"
      },
      {
        type: "CCX Capability Mapping",
        text: "Retrospective documentation review identifies gaps against compliance requirements, regardless of the originating CBO's digital literacy or note-taking format.",
        confidence: "High"
      },
      {
        type: "CCX Capability Mapping",
        text: "Referral consistency checks halt progress on non-compliant records, supporting Medicaid billing accuracy.",
        confidence: "High"
      }
    ],
    interactive_module: {
      type: "ReferralFlow",
      config: {
        stages: [
          { name: "Screening (AHC Tool)", status: "Completed", icon: "clipboard" },
          { name: "Z-Code Mapping", status: "Standardized", icon: "hash" },
          { name: "CBO Referral Routing", status: "Active", icon: "route" },
          { name: "Audit Trail Sealing (WORM)", status: "Active", icon: "shield" }
        ]
      }
    },
    evidence: [
      {
        source: "NYS Department of Health",
        type: "Official NYS Data",
        url: null
      },
      {
        source: "Office of the State Comptroller",
        type: "Official NYS Data",
        url: null
      }
    ]
  },
  midhudson: {
    id: "midhudson",
    name: "Mid-Hudson",
    lead_entity: "Hudson Valley Care Alliance",
    counties: ["Dutchess", "Orange", "Putnam", "Rockland", "Sullivan", "Ulster", "Westchester"],
    operating_environment: "Standard Public Evidence",
    metrics: [
      {
        label: "Eligible Medicaid Lives",
        value: "676,129",
        provenance: "Official NYS Data",
        confidence: "High"
      },
      {
        label: "Counties Covered",
        value: 7,
        provenance: "Official NYS Data",
        confidence: "High"
      },
      {
        label: "SCN Regional Infrastructure Allocation",
        value: "$44.9M",
        provenance: "Official NYS Data",
        confidence: "High"
      },
      {
        label: "Network Scale",
        value: "~150+ CBOs",
        provenance: "CCX Derived",
        confidence: "Medium"
      },
      {
        label: "Evaluation Status",
        value: "Standard Quality Monitoring",
        provenance: "Official NYS Data",
        confidence: "High"
      }
    ],
    insights: [
      {
        type: "Observation",
        text: "Regionwide AHC social care screening is active across multiple large hospital health systems and small community clinics.",
        confidence: "High"
      },
      {
        type: "Implication",
        text: "Disparate electronic health records (EHRs) lead to fragmented, uncoordinated patient handoffs to community SCN partners.",
        confidence: "High"
      },
      {
        type: "CCX Capability Mapping",
        text: "Cross-system interoperability is designed to map patient context from hospital EHRs into the SCN referral stream.",
        confidence: "High"
      },
      {
        type: "CCX Capability Mapping",
        text: "Standardized intake ensures consistent clinical justifications are captured upon discharge, protecting hospital PCMH incentive status.",
        confidence: "High"
      }
    ],
    interactive_module: {
      type: "CoverageMap",
      config: {
        counties: [
          { name: "Westchester", coverage: "94%", partners: 45 },
          { name: "Dutchess", coverage: "82%", partners: 24 },
          { name: "Orange", coverage: "78%", partners: 21 },
          { name: "Rockland", coverage: "88%", partners: 28 },
          { name: "Sullivan", coverage: "62%", partners: 12 },
          { name: "Ulster", coverage: "71%", partners: 15 },
          { name: "Putnam", coverage: "80%", partners: 8 }
        ]
      }
    },
    evidence: [
      {
        source: "NYS Department of Health",
        type: "Official NYS Data",
        url: null
      }
    ]
  },
  bronx: {
    id: "bronx",
    name: "The Bronx",
    lead_entity: "Bronx Health Providers Alliance",
    counties: ["Bronx"],
    operating_environment: "Complex Operating Environment",
    metrics: [
      {
        label: "Eligible Medicaid Lives",
        value: "924,530",
        provenance: "Official NYS Data",
        confidence: "High"
      },
      {
        label: "Counties Covered",
        value: 1,
        provenance: "Official NYS Data",
        confidence: "High"
      },
      {
        label: "SCN Regional Infrastructure Allocation",
        value: "$54.5M",
        provenance: "Official NYS Data",
        confidence: "High"
      },
      {
        label: "Network Scale",
        value: "~300+ Partners",
        provenance: "CCX Derived",
        confidence: "Medium"
      },
      {
        label: "Evaluation Status",
        value: "Standard Quality Monitoring",
        provenance: "Official NYS Data",
        confidence: "High"
      }
    ],
    insights: [
      {
        type: "Observation",
        text: "The Bronx is an extremely dense, high-volume environment requiring rapid caseload turnaround for hundreds of thousands of lives.",
        confidence: "High"
      },
      {
        type: "Implication",
        text: "High caseworker turnover and severe administrative workloads trigger massive data entry gaps and referral loss.",
        confidence: "High"
      },
      {
        type: "CCX Capability Mapping",
        text: "CCX reviews exported encounter records retrospectively, surfacing documentation gaps for compliance teams without adding any new tool or step to caseworkers' existing intake process.",
        confidence: "High"
      },
      {
        type: "CCX Capability Mapping",
        text: "Enforces strict workflow consistency to auto-generate the necessary audit trails required for Medicaid billing.",
        confidence: "High"
      }
    ],
    interactive_module: {
      type: "ReferralFlow",
      config: {
        stages: [
          { name: "Initial Screening", rate: "100%", count: "924k Eligible" },
          { name: "Positive HRSN Finding", rate: "52%", count: "480k Positive" },
          { name: "Referral Formulated", rate: "41%", count: "379k Routed" },
          { name: "Closed-Loop Confirmation", rate: "22%", count: "83k Verified" }
        ]
      }
    },
    evidence: [
      {
        source: "NYS Department of Health SCN Profile",
        type: "Official NYS Data",
        url: null
      }
    ]
  },
  brooklyn: {
    id: "brooklyn",
    name: "Brooklyn",
    lead_entity: "NYC Core SCN Alliance",
    counties: ["Kings (Brooklyn)"],
    operating_environment: "Complex Operating Environment",
    metrics: [
      {
        label: "Eligible Medicaid Lives",
        value: "950,000",
        provenance: "CCX Derived",
        confidence: "Medium"
      },
      {
        label: "Counties Covered",
        value: 1,
        provenance: "Official NYS Data",
        confidence: "High"
      },
      {
        label: "SCN Regional Infrastructure Allocation",
        value: "$50.8M",
        provenance: "Official NYS Data",
        confidence: "High"
      },
      {
        label: "Network Scale",
        value: "~200+ CBOs",
        provenance: "CCX Derived",
        confidence: "Medium"
      },
      {
        label: "Evaluation Status",
        value: "Active Regional Academic Study",
        provenance: "Published Research",
        confidence: "High"
      }
    ],
    insights: [
      {
        type: "Observation",
        text: "Recent academic research documented that 55% of housing referrals in Kings County stalled or failed due to unresolved administrative queues.",
        confidence: "High"
      },
      {
        type: "Implication",
        text: "Fragmented communication and missing clinical eligibility verifications trap patient referrals in multi-month limbo.",
        confidence: "Medium"
      },
      {
        type: "CCX Capability Mapping",
        text: "CCX forces structured documentation completeness at step 02, ensuring referrals cannot be initiated without required eligibility records.",
        confidence: "High"
      },
      {
        type: "CCX Capability Mapping",
        text: "Secure evidence generation ensures all historical referrals have accessible audit trails, demonstrating waiver compliance.",
        confidence: "High"
      }
    ],
    interactive_module: {
      type: "EvidenceDashboard",
      config: {
        title: "Brooklyn Housing Referral Outcomes (n=4,258)",
        badge: "Published Research · Not Official NYS Metric",
        metrics: [
          { label: "Completed", value: "45%" },
          { label: "In Review Queue", value: "32% (Max wait 271 days)" },
          { label: "Rejected / Unresolved", value: "23%" }
        ],
        chartData: [
          { status: "Completed", percentage: 45, color: "#B8860B" },
          { status: "In Review", percentage: 32, color: "#F59E0B" },
          { status: "Rejected/Unresolved", percentage: 23, color: "#EF4444" }
        ]
      }
    },
    evidence: [
      {
        source: "NYC Regional SCN Analysis, Regional SCN Research Entity",
        type: "Published Research",
        url: null
      }
    ]
  },
  queens: {
    id: "queens",
    name: "Queens",
    lead_entity: "NYC Core SCN Alliance",
    counties: ["Queens"],
    operating_environment: "Standard Public Evidence",
    metrics: [
      {
        label: "Eligible Medicaid Lives",
        value: "820,000",
        provenance: "CCX Derived",
        confidence: "Medium"
      },
      {
        label: "Counties Covered",
        value: 1,
        provenance: "Official NYS Data",
        confidence: "High"
      },
      {
        label: "SCN Regional Infrastructure Allocation",
        value: "$46.2M",
        provenance: "Official NYS Data",
        confidence: "High"
      },
      {
        label: "Network Scale",
        value: "~180+ CBOs",
        provenance: "CCX Derived",
        confidence: "Medium"
      },
      {
        label: "Evaluation Status",
        value: "Standard Quality Monitoring",
        provenance: "Official NYS Data",
        confidence: "High"
      }
    ],
    insights: [
      {
        type: "Observation",
        text: "Queens is characterized by extreme language diversity and a highly distributed network of neighborhood-level CBOs.",
        confidence: "High"
      },
      {
        type: "Implication",
        text: "Non-standardized referral translations lead to severe encoding mismatches in statewide reporting systems.",
        confidence: "Medium"
      },
      {
        type: "CCX Capability Mapping",
        text: "CCX maps non-standard narrative screeners into highly structured FHIR profiles and standard LOINC social determinants codes.",
        confidence: "High"
      },
      {
        type: "CCX Capability Mapping",
        text: "Maintains standardized intake formats to preserve evidence across diverse cultural groups and navigators.",
        confidence: "High"
      }
    ],
    interactive_module: {
      type: "PartnerNetwork",
      config: {
        nodes: [
          { id: "Patient", label: "Patient (Screening Complete)", x: 50, y: 50, type: "primary" },
          { id: "Navigator", label: "Multi-lingual Navigator", x: 150, y: 50, type: "info" },
          { id: "SCN", label: "NYC SCN Core Lead", x: 250, y: 50, type: "success" },
          { id: "CBO", label: "Community Pantry / Housing CBO", x: 350, y: 50, type: "warning" },
          { id: "Outcome", label: "FHIR Outcome Record Secured", x: 450, y: 50, type: "gold" }
        ],
        connections: [
          { from: "Patient", to: "Navigator", label: "AHC Screening" },
          { from: "Navigator", to: "SCN", label: "LOINC/Z-Code Translation" },
          { from: "SCN", to: "CBO", label: "Referral Dispatch" },
          { from: "CBO", to: "Outcome", label: "CCX Evidentiary Close" }
        ]
      }
    },
    evidence: [
      {
        source: "NYS Department of Health",
        type: "Official NYS Data",
        url: null
      }
    ]
  },
  manhattan: {
    id: "manhattan",
    name: "Manhattan",
    lead_entity: "NYC Core SCN Alliance",
    counties: ["New York (Manhattan)"],
    operating_environment: "Standard Public Evidence",
    metrics: [
      {
        label: "Eligible Medicaid Lives",
        value: "1,115,878",
        provenance: "Official NYS Data",
        confidence: "High"
      },
      {
        label: "Counties Covered",
        value: 1,
        provenance: "Official NYS Data",
        confidence: "High"
      },
      {
        label: "SCN Regional Infrastructure Allocation",
        value: "$55.4M",
        provenance: "Official NYS Data",
        confidence: "High"
      },
      {
        label: "Network Scale",
        value: "~220+ CBOs",
        provenance: "CCX Derived",
        confidence: "Medium"
      },
      {
        label: "Evaluation Status",
        value: "Active Regional Academic Study",
        provenance: "Published Research",
        confidence: "High"
      }
    ],
    insights: [
      {
        type: "Observation",
        text: "Complex clinical-social crossover exists across Manhattan's prominent academic medical centers and historic community groups.",
        confidence: "High"
      },
      {
        type: "Implication",
        text: "Auditors frequently claw back social claims when clinical narrative notes do not perfectly align with filed Z-codes.",
        confidence: "High"
      },
      {
        type: "CCX Capability Mapping",
        text: "Ensures the highest clinical documentation quality, directly linking narrative notes with structured FHIR profiles.",
        confidence: "High"
      },
      {
        type: "CCX Capability Mapping",
        text: "Secures complete cross-system interoperability to validate claim justifications prior to billing submission.",
        confidence: "High"
      }
    ],
    interactive_module: {
      type: "WorkflowNarrative",
      config: {
        steps: [
          { phase: "Clinical Narrative", desc: "CHW types patient's social situation in free-text form.", output: "Raw Patient Case Text" },
          { phase: "Structured Extraction", desc: "CCX parses narrative text and maps to structured fields.", output: "ICD-10 Z59.41 & LOINC" },
          { phase: "FHIR Translation", desc: "Standardized clinical format ready for export.", output: "FHIR US Core Patient Profile" },
          { phase: "Audit Evidence", desc: "Hash-sealed record locked in permanent storage.", output: "Defensible Audit Trail" }
        ]
      }
    },
    evidence: [
      {
        source: "NYS Department of Health",
        type: "Official NYS Data",
        url: null
      }
    ]
  },
  statenisland: {
    id: "statenisland",
    name: "Staten Island",
    lead_entity: "Staten Island Care Alliance",
    counties: ["Richmond (Staten Island)"],
    operating_environment: "Standard Public Evidence",
    metrics: [
      {
        label: "Eligible Medicaid Lives",
        value: "181,942",
        provenance: "Official NYS Data",
        confidence: "High"
      },
      {
        label: "Counties Covered",
        value: 1,
        provenance: "Official NYS Data",
        confidence: "High"
      },
      {
        label: "SCN Regional Infrastructure Allocation",
        value: "$22.5M",
        provenance: "Official NYS Data",
        confidence: "High"
      },
      {
        label: "Network Scale",
        value: "~100+ CBOs",
        provenance: "CCX Derived",
        confidence: "Medium"
      },
      {
        label: "Evaluation Status",
        value: "Standard Quality Monitoring",
        provenance: "Official NYS Data",
        confidence: "High"
      }
    ],
    insights: [
      {
        type: "Observation",
        text: "Staten Island operates as a highly concentrated geographic SCN with a tightly coupled, localized provider group.",
        confidence: "High"
      },
      {
        type: "Implication",
        text: "Tightly coupled networks reduce inter-county friction but lead to service saturation and bottlenecked coordination.",
        confidence: "Medium"
      },
      {
        type: "CCX Capability Mapping",
        text: "Workflow dashboards let supervisors track caseload distribution across the local network.",
        confidence: "High"
      }
    ],
    interactive_module: {
      type: "CapacityGauge",
      config: {
        title: "Staten Island Network Capacity Load",
        percentage: 78,
        label: "Optimal Capacity Zone reached",
        details: "78 of 100 navigator slots active. High localized utilization."
      }
    },
    evidence: [
      {
        source: "NYS Department of Health",
        type: "Official NYS Data",
        url: null
      }
    ]
  },
  fingerlakes: {
    id: "fingerlakes",
    name: "Finger Lakes",
    lead_entity: "Finger Lakes Health Alliance",
    counties: ["Allegany", "Cayuga", "Chemung", "Genesee", "Livingston", "Monroe", "Ontario", "Orleans", "Schuyler", "Seneca", "Steuben", "Wayne", "Wyoming", "Yates"],
    operating_environment: "Standard Public Evidence",
    metrics: [
      {
        label: "Eligible Medicaid Lives",
        value: "402,184",
        provenance: "Official NYS Data",
        confidence: "High"
      },
      {
        label: "Counties Covered",
        value: 14,
        provenance: "Official NYS Data",
        confidence: "High"
      },
      {
        label: "SCN Regional Infrastructure Allocation",
        value: "$38.6M",
        provenance: "Official NYS Data",
        confidence: "High"
      },
      {
        label: "Network Scale",
        value: "~180+ Partners",
        provenance: "CCX Derived",
        confidence: "Medium"
      },
      {
        label: "Evaluation Status",
        value: "Standard Quality Monitoring",
        provenance: "Official NYS Data",
        confidence: "High"
      }
    ],
    insights: [
      {
        type: "Observation",
        text: "The largest network by county count in New York, spanning Rochester's urban core down to extensive, highly remote rural border regions.",
        confidence: "High"
      },
      {
        type: "Implication",
        text: "Geographic dispersion makes dynamic status tracking of distributed community partners and hospitals highly manual.",
        confidence: "Medium"
      },
      {
        type: "CCX Capability Mapping",
        text: "CCX establishes standard referral quality loops that alert navigators upon hospital discharge.",
        confidence: "High"
      },
      {
        type: "CCX Capability Mapping",
        text: "Cross-system interoperability links clinical EHRs directly to distant community partners without requiring system upgrades.",
        confidence: "High"
      }
    ],
    interactive_module: {
      type: "PartnerNetwork",
      config: {
        nodes: [
          { id: "Hospitals", label: "Regional Hospital Systems", x: 60, y: 60, type: "primary" },
          { id: "PrimaryCare", label: "Primary Care Practices", x: 180, y: 150, type: "info" },
          { id: "CBOs", label: "Community Social Care Organizations", x: 320, y: 60, type: "success" }
        ],
        connections: [
          { from: "Hospitals", to: "CBOs", label: "Discharge Referrals" },
          { from: "PrimaryCare", to: "CBOs", label: "Risk-based Navigator Referrals" }
        ]
      }
    },
    evidence: [
      {
        source: "NYS Department of Health",
        type: "Official NYS Data",
        url: null
      }
    ]
  },
  southerntier: {
    id: "southerntier",
    name: "Southern Tier",
    lead_entity: "Southern Tier Care Alliance",
    counties: ["Broome", "Chenango", "Delaware", "Otsego", "Tioga", "Tompkins"],
    operating_environment: "Standard Public Evidence",
    metrics: [
      {
        label: "Eligible Medicaid Lives",
        value: "122,295",
        provenance: "Official NYS Data",
        confidence: "High"
      },
      {
        label: "Counties Covered",
        value: 6,
        provenance: "Official NYS Data",
        confidence: "High"
      },
      {
        label: "SCN Regional Infrastructure Allocation",
        value: "$22.6M",
        provenance: "Official NYS Data",
        confidence: "High"
      },
      {
        label: "Network Scale",
        value: "~150+ Partners",
        provenance: "CCX Derived",
        confidence: "Medium"
      },
      {
        label: "Evaluation Status",
        value: "Standard Quality Monitoring",
        provenance: "Official NYS Data",
        confidence: "High"
      }
    ],
    insights: [
      {
        type: "Observation",
        text: "The network covers a mountainous, highly rural six-county band along the Pennsylvania border with limited physical access.",
        confidence: "High"
      },
      {
        type: "Implication",
        text: "Transportation barriers cause massive rates of referral cancellation or patient follow-up failure.",
        confidence: "Medium"
      },
      {
        type: "CCX Capability Mapping",
        text: "By retrospectively identifying incomplete documentation before OMIG does, CCX reduces the risk of claims rejection even when physical follow-ups are delayed.",
        confidence: "High"
      },
      {
        type: "CCX Capability Mapping",
        text: "FHIR interoperability feeds instant referral progress updates directly to distant rural primary care clinics.",
        confidence: "High"
      }
    ],
    interactive_module: {
      type: "CoverageMap",
      config: {
        counties: [
          { name: "Broome", coverage: "89%", partners: 32 },
          { name: "Tompkins", coverage: "86%", partners: 22 },
          { name: "Chenango", coverage: "51%", partners: 8 },
          { name: "Delaware", coverage: "48%", partners: 6 },
          { name: "Otsego", coverage: "58%", partners: 9 },
          { name: "Tioga", coverage: "60%", partners: 10 }
        ]
      }
    },
    evidence: [
      {
        source: "NYS Department of Health",
        type: "Official NYS Data",
        url: null
      }
    ]
  },
  centralny: {
    id: "centralny",
    name: "Central NY",
    lead_entity: "Capital District Health Alliance",
    counties: ["Cortland", "Herkimer", "Madison", "Oneida", "Onondaga", "Oswego"],
    operating_environment: "Extensively Documented",
    metrics: [
      {
        label: "Eligible Medicaid Lives",
        value: "266,950",
        provenance: "Official NYS Data",
        confidence: "High"
      },
      {
        label: "Counties Covered",
        value: 6,
        provenance: "Official NYS Data",
        confidence: "High"
      },
      {
        label: "SCN Regional Infrastructure Allocation",
        value: "$31.4M",
        provenance: "Official NYS Data",
        confidence: "High"
      },
      {
        label: "Network Scale",
        value: "~450+ CBO Sites",
        provenance: "CCX Derived",
        confidence: "Medium"
      },
      {
        label: "Evaluation Status",
        value: "Not yet independently evaluated",
        provenance: "CCX Derived",
        confidence: "Low"
      }
    ],
    insights: [
      {
        type: "Observation",
        text: "Anchored by Syracuse and Utica, this region has an established ecosystem of public healthcare and social coordination models.",
        confidence: "High"
      },
      {
        type: "Implication",
        text: "A mature ecosystem is highly prepared to transition from simple capacity-building into evidence billing models.",
        confidence: "High"
      },
      {
        type: "CCX Capability Mapping",
        text: "Provides full audit readiness, compiling clean evidence for claim validation.",
        confidence: "High"
      },
      {
        type: "CCX Capability Mapping",
        text: "FHIR mapping is designed to standardize CBO encounter workflows.",
        confidence: "High"
      }
    ],
    evidence: [
      {
        source: "NYS Department of Health",
        type: "Official NYS Data",
        url: null
      }
    ]
  },
  longisland: {
    id: "longisland",
    name: "Long Island",
    lead_entity: "Long Island Care Alliance",
    counties: ["Nassau", "Suffolk"],
    operating_environment: "Standard Public Evidence",
    metrics: [
      {
        label: "Eligible Medicaid Lives",
        value: "675,373",
        provenance: "Official NYS Data",
        confidence: "High"
      },
      {
        label: "Counties Covered",
        value: 2,
        provenance: "Official NYS Data",
        confidence: "High"
      },
      {
        label: "SCN Regional Infrastructure Allocation",
        value: "$42.2M",
        provenance: "Official NYS Data",
        confidence: "High"
      },
      {
        label: "Network Scale",
        value: "~150+ CBOs",
        provenance: "CCX Derived",
        confidence: "Medium"
      },
      {
        label: "Evaluation Status",
        value: "Standard Quality Monitoring",
        provenance: "Official NYS Data",
        confidence: "High"
      }
    ],
    insights: [
      {
        type: "Observation",
        text: "Long Island spans dense, sprawling suburban territory with highly specialized, distinct housing and social support programs.",
        confidence: "High"
      },
      {
        type: "Implication",
        text: "Highly complex suburban housing rules lead to severe eligibility delays and referral dropouts.",
        confidence: "High"
      },
      {
        type: "CCX Capability Mapping",
        text: "CCX delivers structured documentation guides that verify regional housing requirements at point of initial intake.",
        confidence: "High"
      },
      {
        type: "CCX Capability Mapping",
        text: "Is designed to support referral completeness tracking to help expedite state agency eligibility approvals.",
        confidence: "High"
      }
    ],
    interactive_module: {
      type: "WorkflowNarrative",
      config: {
        steps: [
          { phase: "Eligibility Verification", desc: "Patient housing eligibility criteria checked.", output: "Verified" },
          { phase: "Structured Intake Document", desc: "Structured note captures income and residency metrics.", output: "Sealed Document" },
          { phase: "Referral Dispatch", desc: "Dispatched to regional housing community partner.", output: "Dispatched" },
          { phase: "CBO Review & Accept", desc: "CBO confirms slot availability and accepts.", output: "Accepted" },
          { phase: "CCX Sealed Outcome", desc: "Final outcome record timestamped and sealed.", output: "Completed Trail" }
        ]
      }
    },
    evidence: [
      {
        source: "NYS Department of Health",
        type: "Official NYS Data",
        url: null
      }
    ]
  },
  northcountry: {
    id: "northcountry",
    name: "North Country",
    lead_entity: "Capital District Health Alliance",
    counties: ["Clinton", "Essex", "Franklin", "Fulton", "Hamilton", "Jefferson", "Lewis", "St. Lawrence", "Warren", "Washington"],
    operating_environment: "Standard Public Evidence",
    metrics: [
      {
        label: "Eligible Medicaid Lives",
        value: "152,120",
        provenance: "Official NYS Data",
        confidence: "High"
      },
      {
        label: "Counties Covered",
        value: 10,
        provenance: "Official NYS Data",
        confidence: "High"
      },
      {
        label: "SCN Regional Infrastructure Allocation",
        value: "$24.8M",
        provenance: "Official NYS Data",
        confidence: "High"
      },
      {
        label: "Network Scale",
        value: "~350+ CBO Sites",
        provenance: "CCX Derived",
        confidence: "Medium"
      },
      {
        label: "Evaluation Status",
        value: "Not yet independently evaluated",
        provenance: "CCX Derived",
        confidence: "Low"
      }
    ],
    insights: [
      {
        type: "Observation",
        text: "Vast, isolated geographical area with extremely low population density and frequent winter weather communication cutoffs.",
        confidence: "High"
      },
      {
        type: "Implication",
        text: "Isolated field navigators need offline-capable, resilient record templates to prevent massive clinical data loss.",
        confidence: "Medium"
      },
      {
        type: "CCX Capability Mapping",
        text: "Supports retrospective documentation review across geographically remote CBOs, regardless of local connectivity at the time records were originally created.",
        confidence: "High"
      },
      {
        type: "CCX Capability Mapping",
        text: "Maintains cross-system interoperability across distant, remote clinics and the core SCN lead.",
        confidence: "High"
      }
    ],
    interactive_module: {
      type: "CoverageMap",
      config: {
        counties: [
          { name: "St. Lawrence", coverage: "61%", partners: 14 },
          { name: "Jefferson", coverage: "74%", partners: 18 },
          { name: "Franklin", coverage: "52%", partners: 9 },
          { name: "Clinton", coverage: "68%", partners: 12 },
          { name: "Essex", coverage: "49%", partners: 7 },
          { name: "Lewis", coverage: "50%", partners: 6 },
          { name: "Hamilton", coverage: "32%", partners: 2 },
          { name: "Warren", coverage: "81%", partners: 15 },
          { name: "Washington", coverage: "72%", partners: 11 },
          { name: "Fulton", coverage: "66%", partners: 10 }
        ]
      }
    },
    evidence: [
      {
        source: "NYS Department of Health",
        type: "Official NYS Data",
        url: null
      }
    ]
  }
};
