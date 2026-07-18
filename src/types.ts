export interface Metric {
  label: string;
  value: string | number;
  provenance: "Official NYS Data" | "Published Research" | "CCX Derived" | "Unavailable";
  confidence: "High" | "Medium" | "Low";
  method_note?: string;
}

export interface Insight {
  type: "Observation" | "Implication" | "CCX Capability Mapping";
  text: string;
  confidence: "High" | "Medium" | "Low";
}

export interface EvidenceItem {
  source: string;
  type: "Official NYS Data" | "Published Research" | "CCX Internal Documentation";
  url: string | null;
}

export interface InteractiveModule {
  type: "ReferralFlow" | "EvidenceDashboard" | "CoverageMap" | "PartnerNetwork" | "CapacityGauge" | "WorkflowNarrative";
  config: Record<string, any>;
}

export interface Region {
  id: string;
  name: string;
  lead_entity: string;
  counties: string[];
  operating_environment: "Extensively Documented" | "Standard Public Evidence" | "Complex Operating Environment";
  metrics: Metric[];
  insights: Insight[];
  primary_insight?: string;
  interactive_module?: InteractiveModule;
  evidence: EvidenceItem[];
}
