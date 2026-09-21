export type UserRole = 'government' | 'startup' | 'expert' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  departmentOrCompany: string;
  avatarUrl?: string;
  verified: boolean;
  phone?: string;
  designation?: string;
}

export type ChallengeStage = 
  | 'Draft'
  | 'OPEN'
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
  measurementMethod?: string;
}

export interface Challenge {
  id: string;
  code: string; // e.g. "PRG-2026-001"
  title: string;
  problemStatement: string;
  currentSituation?: string;
  expectedOutcome: string;
  department: string;
  ministry: string;
  requiredTechnology?: string[];
  targetUsers?: string;
  geographicArea?: string;
  budgetAllocated: number; // in INR
  currentStage: ChallengeStage;
  applicationDeadline: string;
  pilotDurationDays: number;
  kpis: TargetKPI[];
  eligibilityCriteria?: {
    startupStage: string;
    requiredCertifications: string[];
    technologyRequirements: string;
    securityRequirements: string;
  };
  publishedDate: string;
  tags: string[];
  totalApplicants: number;
  selectedStartupId?: string;
  aiMatchSummary?: string;
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
  technologyStack: string[];
  trlLevel: number; // Technology Readiness Level 1-9
  certifications: string[];
  verifiedStatus: 'Verified' | 'Pending' | 'Rejected';
  estimatedPilotCost?: number;
  matchScore?: number; // AI match %
  technicalFitScore?: number;
  scalabilityScore?: number;
  aiMatchReason?: string;
  relevantExperience?: string;
}

export type ApplicationStatus = 
  | 'Submitted'
  | 'Eligibility Check'
  | 'Eligibility Passed'
  | 'Eligibility Rejected'
  | 'Expert Evaluation'
  | 'Under Evaluation'
  | 'Shortlisted'
  | 'Shortlisted for Pilot'
  | 'Pilot'
  | 'Validation'
  | 'Selected'
  | 'Rejected';

export interface Application {
  id: string;
  challengeId: string;
  challengeTitle: string;
  department: string;
  startupId: string;
  startupName: string;
  dpiitNumber: string;
  solutionDescription: string;
  technicalApproach: string;
  previousExperience: string;
  implementationPlan: string;
  proposalSummary: string;
  submittedAt: string;
  status: ApplicationStatus;
  eligibilityScore: number; // 0-100
  technicalScore?: number; // 0-100
  pilotBudgetProposed: number;
  documents: { title: string; url: string; verified: boolean }[];
  timelineStep: number; // 1 to 7 for visual timeline
  clarificationRequested?: string;
}

export interface EvaluationCriterion {
  id: string;
  criterion: string;
  weightPercentage: number;
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
  startupId: string;
  evaluatorName: string;
  evaluatorRole: string;
  evaluatorAffiliation: string;
  dateEvaluated: string;
  criteriaScores: EvaluationCriterion[];
  totalScore: number;
  recommendation: 'Recommend for Pilot' | 'Approve' | 'Request Clarification' | 'Reserve' | 'Not Recommended' | 'Reject';
  summaryRemarks: string;
  clarificationNotes?: string;
  status: 'Pending' | 'Completed';
}

export type PilotStatus = 'Preparing' | 'In Sandbox' | 'Active Field Trial' | 'Completed' | 'Terminated';

export interface PilotMilestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string;
  verifiedBy?: string;
}

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
  budget: number;
  status: PilotStatus;
  completionPercentage: number;
  liveKpiScore: number; // 0-100
  milestones: PilotMilestone[];
  totalMilestones: number;
  completedMilestones: number;
  currentMilestoneStage: string;
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
  achievementPercentage: number; // e.g. 104%
  status: 'Exceeding' | 'On Track' | 'At Risk' | 'Underperforming';
  lastUpdated: string;
  telemetrySource: 'IoT Sensor Stream' | 'Manual Officer Verification' | 'Algorithmic Benchmark';
  history?: { timestamp: string; value: number }[];
}

export type PaymentStatus = 'PAID' | 'Disbursed' | 'Approved by Department' | 'Pending Verification' | 'PENDING' | 'On Hold';

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
  eligibleForRelease: boolean;
  approvedDate?: string;
  disbursedDate?: string;
  pfmsReference?: string;
}

export interface ValidationReport {
  id: string;
  pilotId: string;
  challengeTitle: string;
  startupName: string;
  auditingAgency: string; // e.g. "CSIR - Central Road Research Institute / IIT Delhi"
  leadAuditor: string;
  auditDate: string;
  performanceScore: number;
  securityCompliance: string;
  regulatoryCompliance: string;
  kpiVerificationStatus: '100% Validated' | 'Partially Validated' | 'Failed';
  procurementSuitabilityScore: number; // 0-100
  verdict: 'VALIDATED' | 'Recommended for GeM Direct Procurement' | 'NEEDS IMPROVEMENT' | 'FAILED';
  summaryObservations: string;
  certificateNumber: string;
}

export interface ScaleUpPlan {
  id: string;
  challengeTitle: string;
  startupName: string;
  solutionName: string;
  gemCategory: string;
  recommendedScale: string; // e.g. "Pan-India 50 Municipal Corporations"
  estimatedContractValue: number;
  legalBasis: string; // e.g. "Rule 149(viii) GFR 2017 - Innovation Procurement"
  procuringDepartment: string;
  pilotScore: number;
  validationStatus: string;
  recommendation: string;
  status: 'Ready for Procurement' | 'Ready for GeM Listing' | 'Procurement Initiated' | 'Scaled' | 'Cabinet Note in Progress';
  procurementQuantity?: string;
  targetDistricts?: string[];
  scaledDate?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'alert';
  targetRole?: UserRole | 'all';
  linkTo?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  hash: string;
}
