export type UserRole = 'government' | 'startup' | 'expert' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  departmentOrCompany: string;
  avatarUrl?: string;
  verified: boolean;
}

export type ChallengeStage = 
  | 'Draft'
  | 'Open for Applications'
  | 'Screening'
  | 'Expert Evaluation'
  | 'Sandbox / Pilot'
  | 'KPI Measurement'
  | 'Milestone Payment'
  | 'Independent Validation'
  | 'Procurement Scale-up'
  | 'Completed';

export interface TargetKPI {
  id: string;
  name: string;
  unit: string;
  baseline: number;
  target: number;
  achieved?: number;
  weightage: number; // percentage (e.g. 30%)
}

export interface Challenge {
  id: string;
  code: string; // e.g. "PRG-2026-001"
  title: string;
  problemStatement: string;
  expectedOutcome: string;
  department: string;
  ministry: string;
  budgetAllocated: number; // in INR
  currentStage: ChallengeStage;
  applicationDeadline: string;
  pilotDurationDays: number;
  kpis: TargetKPI[];
  publishedDate: string;
  tags: string[];
  totalApplicants: number;
  selectedStartupId?: string;
}

export interface Startup {
  id: string;
  legalName: string;
  brandName: string;
  dpiitNumber: string; // DPIIT Recognition number
  incorporationYear: number;
  founderName: string;
  contactEmail: string;
  contactPhone: string;
  headquarters: string;
  focusSector: string;
  solutionTitle: string;
  solutionSummary: string;
  trlLevel: number; // Technology Readiness Level 1-9
  certifications: string[];
  verifiedStatus: 'Verified' | 'Pending' | 'Rejected';
}

export type ApplicationStatus = 
  | 'Submitted'
  | 'Eligibility Passed'
  | 'Eligibility Rejected'
  | 'Under Evaluation'
  | 'Shortlisted for Pilot'
  | 'Rejected';

export interface Application {
  id: string;
  challengeId: string;
  challengeTitle: string;
  startupId: string;
  startupName: string;
  dpiitNumber: string;
  proposalSummary: string;
  submittedAt: string;
  status: ApplicationStatus;
  eligibilityScore: number; // 0-100
  technicalScore?: number; // 0-100
  pilotBudgetProposed: number;
  documents: { title: string; url: string; verified: boolean }[];
}

export interface EvaluationCriterion {
  id: string;
  criterion: string;
  maxScore: number;
  scoreAwarded: number;
  remarks: string;
}

export interface Evaluation {
  id: string;
  applicationId: string;
  challengeId: string;
  challengeTitle: string;
  startupName: string;
  evaluatorName: string;
  evaluatorRole: string;
  evaluatorAffiliation: string;
  dateEvaluated: string;
  criteriaScores: EvaluationCriterion[];
  totalScore: number;
  recommendation: 'Recommend for Pilot' | 'Reserve' | 'Not Recommended';
  summaryRemarks: string;
}

export type PilotStatus = 'Preparing' | 'In Sandbox' | 'Active Field Trial' | 'Completed' | 'Terminated';

export interface Pilot {
  id: string;
  challengeId: string;
  challengeTitle: string;
  startupId: string;
  startupName: string;
  department: string;
  deploymentLocation: string;
  startDate: string;
  endDate: string;
  status: PilotStatus;
  completionPercentage: number;
  liveKpiScore: number; // 0-100
  totalMilestones: number;
  completedMilestones: number;
}

export interface KPIMeasurement {
  id: string;
  pilotId: string;
  challengeTitle: string;
  startupName: string;
  metricName: string;
  baseline: string;
  target: string;
  currentValue: string;
  status: 'Exceeding' | 'On Track' | 'At Risk' | 'Underperforming';
  lastUpdated: string;
  telemetrySource: 'IoT Sensor Stream' | 'Manual Officer Verification' | 'Algorithmic Benchmark';
}

export type PaymentStatus = 'Pending Verification' | 'Approved by Department' | 'Disbursed' | 'On Hold';

export interface PaymentMilestone {
  id: string;
  pilotId: string;
  challengeTitle: string;
  startupName: string;
  milestoneTitle: string;
  trancheNumber: number;
  amount: number;
  deliverableCriteria: string;
  status: PaymentStatus;
  invoiceNumber: string;
  approvedDate?: string;
  disbursedDate?: string;
}

export interface ValidationReport {
  id: string;
  pilotId: string;
  challengeTitle: string;
  startupName: string;
  auditingAgency: string; // e.g. "IIT Delhi / CSIR / NIC Third-Party Cell"
  leadAuditor: string;
  auditDate: string;
  kpiVerificationStatus: '100% Validated' | 'Partially Validated' | 'Failed';
  securityCompliance: 'ISO 27001 / CERT-In Compliant' | 'Pending Patching';
  procurementSuitabilityScore: number; // 0-100
  verdict: 'Recommended for GeM Direct Procurement' | 'Requires Further Iteration' | 'Rejected';
  summaryObservations: string;
}

export interface ScaleUpPlan {
  id: string;
  challengeTitle: string;
  startupName: string;
  solutionName: string;
  gemCategory: string; // GeM Government e-Marketplace classification
  recommendedScale: string; // e.g. "Pan-India 50 Municipal Corporations"
  estimatedContractValue: number;
  legalBasis: string; // e.g. "Rule 149(viii) GFR 2017 - Innovation Procurement"
  procuringDepartment: string;
  status: 'Ready for GeM Listing' | 'Cabinet Note in Progress' | 'Tender Issued';
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'alert';
}
