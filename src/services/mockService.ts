import {
  initialChallenges,
  initialStartups,
  initialApplications,
  initialEvaluations,
  initialPilots,
  initialKPIs,
  initialPayments,
  initialValidationReports,
  initialScaleUpPlans,
  initialNotifications,
  initialAuditLogs,
  mockUsers,
} from '@/data/mockData';
import {
  Challenge,
  Startup,
  Application,
  Evaluation,
  Pilot,
  KPIMeasurement,
  PaymentMilestone,
  ValidationReport,
  ScaleUpPlan,
  User,
  UserRole,
  NotificationItem,
  AuditLogEntry,
} from '@/types';

// In-Memory Reactive Store with LocalStorage Persistence
const STORAGE_KEY = 'pragati_ai_store_v1';

interface StoreState {
  challenges: Challenge[];
  startups: Startup[];
  applications: Application[];
  evaluations: Evaluation[];
  pilots: Pilot[];
  kpis: KPIMeasurement[];
  payments: PaymentMilestone[];
  validationReports: ValidationReport[];
  scaleUpPlans: ScaleUpPlan[];
  notifications: NotificationItem[];
  auditLogs: AuditLogEntry[];
}

function loadInitialState(): StoreState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Unable to load state from localStorage, using initial mock data.', e);
  }
  return {
    challenges: [...initialChallenges],
    startups: [...initialStartups],
    applications: [...initialApplications],
    evaluations: [...initialEvaluations],
    pilots: [...initialPilots],
    kpis: [...initialKPIs],
    payments: [...initialPayments],
    validationReports: [...initialValidationReports],
    scaleUpPlans: [...initialScaleUpPlans],
    notifications: [...initialNotifications],
    auditLogs: [...initialAuditLogs],
  };
}

let state: StoreState = loadInitialState();
const listeners = new Set<() => void>();

function notifyListeners() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Unable to persist state to localStorage', e);
  }
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.error('Listener error in mockService', e);
    }
  });
}

function logAudit(actorName: string, actorRole: UserRole, action: string, entityType: string, entityId: string, details: string) {
  const hash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const newLog: AuditLogEntry = {
    id: `audit-${Date.now()}`,
    timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
    actorName,
    actorRole,
    action,
    entityType,
    entityId,
    details,
    hash,
  };
  state.auditLogs.unshift(newLog);
}

function pushNotification(title: string, description: string, type: 'info' | 'success' | 'warning' | 'alert', targetRole: UserRole | 'all' = 'all', linkTo?: string) {
  const newNotif: NotificationItem = {
    id: `notif-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    title,
    description,
    timestamp: 'Just now',
    read: false,
    type,
    targetRole,
    linkTo,
  };
  state.notifications.unshift(newNotif);
}

export const mockService = {
  // Listener subscription
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  // Reset demo
  resetToDefaults: () => {
    state = {
      challenges: [...initialChallenges],
      startups: [...initialStartups],
      applications: [...initialApplications],
      evaluations: [...initialEvaluations],
      pilots: [...initialPilots],
      kpis: [...initialKPIs],
      payments: [...initialPayments],
      validationReports: [...initialValidationReports],
      scaleUpPlans: [...initialScaleUpPlans],
      notifications: [...initialNotifications],
      auditLogs: [...initialAuditLogs],
    };
    notifyListeners();
  },

  // Users
  getUsers: (): Promise<User[]> => Promise.resolve(mockUsers),
  getUserByRole: (role: UserRole): User => {
    return mockUsers.find((u) => u.role === role) || mockUsers[0];
  },

  // Challenges
  getChallenges: (): Promise<Challenge[]> => Promise.resolve([...state.challenges]),
  getChallengeById: (id: string): Promise<Challenge | undefined> =>
    Promise.resolve(state.challenges.find((c) => c.id === id)),
  
  createChallenge: async (
    challengeData: Omit<Challenge, 'id' | 'code' | 'publishedDate' | 'totalApplicants'>
  ): Promise<Challenge> => {
    const year = new Date().getFullYear();
    const count = String(state.challenges.length + 1).padStart(3, '0');
    const newChallenge: Challenge = {
      ...challengeData,
      id: `ch-${Date.now()}`,
      code: `PRG-${year}-${count}`,
      publishedDate: new Date().toISOString().slice(0, 10),
      currentStage: 'OPEN',
      totalApplicants: 0,
      tags: challengeData.tags && challengeData.tags.length > 0 ? challengeData.tags : ['New Challenge', 'SIH 2026'],
      kpis: challengeData.kpis && challengeData.kpis.length > 0 ? challengeData.kpis : [
        { id: `kpi-${Date.now()}-1`, name: 'Operational Efficiency Increase', unit: '%', baseline: 0, target: 25, weightage: 50 },
        { id: `kpi-${Date.now()}-2`, name: 'Turnaround Time Reduction', unit: 'hours', baseline: 24, target: 4, weightage: 50 },
      ],
    };
    state.challenges.unshift(newChallenge);
    logAudit('Government Officer', 'government', 'PUBLISH_CHALLENGE', 'Challenge', newChallenge.code, `Published new outcome challenge: ${newChallenge.title} (Budget ₹${(newChallenge.budgetAllocated/100000).toFixed(1)}L)`);
    pushNotification(
      'New Outcome Challenge Published',
      `${newChallenge.title} is now open for startup proposals under GFR Rule 149(viii).`,
      'info',
      'startup',
      '/challenges'
    );
    notifyListeners();
    return newChallenge;
  },

  // Startups & AI Matching
  getStartups: (): Promise<Startup[]> => Promise.resolve([...state.startups]),
  getStartupById: (id: string): Promise<Startup | undefined> =>
    Promise.resolve(state.startups.find((s) => s.id === id)),
  
  getRecommendedStartups: async (challengeId?: string): Promise<{ startup: Startup; matchScore: number; reason: string }[]> => {
    const challenge = state.challenges.find((c) => c.id === challengeId) || state.challenges[0];
    return state.startups.map((st) => {
      let score = st.matchScore || 85;
      if (challenge.title.includes('Waste') && st.brandName.includes('EcoRoute')) score = 94;
      if (challenge.title.includes('Road') && st.brandName.includes('RoadVision')) score = 91;
      if (challenge.title.includes('Water') && st.brandName.includes('WaterSense')) score = 88;
      return {
        startup: st,
        matchScore: score,
        reason: st.aiMatchReason || `Startup aligns with ${challenge.department} requirements on TRL-${st.trlLevel} readiness and sector capabilities.`,
      };
    }).sort((a, b) => b.matchScore - a.matchScore);
  },

  // Applications
  getApplications: (): Promise<Application[]> => Promise.resolve([...state.applications]),
  getApplicationById: (id: string): Promise<Application | undefined> =>
    Promise.resolve(state.applications.find((a) => a.id === id)),

  submitApplication: async (
    appData: {
      challengeId: string;
      startupId: string;
      solutionDescription: string;
      technicalApproach: string;
      previousExperience: string;
      implementationPlan: string;
      pilotBudgetProposed: number;
    }
  ): Promise<Application> => {
    const challenge = state.challenges.find((c) => c.id === appData.challengeId);
    const startup = state.startups.find((s) => s.id === appData.startupId) || state.startups[0];
    
    const newApp: Application = {
      id: `app-${Date.now()}`,
      challengeId: appData.challengeId,
      challengeTitle: challenge ? challenge.title : 'Target Innovation Challenge',
      department: challenge ? challenge.department : 'Government Department',
      startupId: startup.id,
      startupName: startup.brandName,
      dpiitNumber: startup.dpiitNumber,
      solutionDescription: appData.solutionDescription,
      technicalApproach: appData.technicalApproach,
      previousExperience: appData.previousExperience,
      implementationPlan: appData.implementationPlan,
      proposalSummary: appData.solutionDescription.slice(0, 160) + '...',
      submittedAt: new Date().toISOString().slice(0, 10),
      status: 'Submitted',
      eligibilityScore: 94,
      pilotBudgetProposed: appData.pilotBudgetProposed || 3500000,
      timelineStep: 1, // Submitted
      documents: [
        { title: 'Technical Architecture & Proposal.pdf', url: '#', verified: true },
        { title: 'DPIIT Startup India Certificate.pdf', url: '#', verified: true },
        { title: 'Financial & Compliance Self-Declaration.pdf', url: '#', verified: true },
      ],
    };

    state.applications.unshift(newApp);
    if (challenge) {
      challenge.totalApplicants += 1;
    }

    logAudit(startup.founderName, 'startup', 'SUBMIT_APPLICATION', 'Application', newApp.id, `Submitted proposal for ${newApp.challengeTitle}`);
    pushNotification(
      'New Startup Proposal Received',
      `${startup.brandName} submitted a proposal for ${newApp.challengeTitle}.`,
      'info',
      'government',
      '/applications'
    );
    notifyListeners();
    return newApp;
  },

  updateApplicationStatus: async (applicationId: string, nextStatus: Application['status']): Promise<Application | undefined> => {
    const app = state.applications.find((a) => a.id === applicationId);
    if (!app) return undefined;
    app.status = nextStatus;
    
    // Timeline steps: Submitted (1) -> Eligibility Check (2) -> Expert Evaluation (3) -> Shortlisted (4) -> Pilot (5) -> Validation (6) -> Selected (7)
    if (nextStatus === 'Submitted') app.timelineStep = 1;
    else if (nextStatus === 'Eligibility Check' || nextStatus === 'Eligibility Passed') app.timelineStep = 2;
    else if (nextStatus === 'Expert Evaluation' || nextStatus === 'Under Evaluation') app.timelineStep = 3;
    else if (nextStatus === 'Shortlisted' || nextStatus === 'Shortlisted for Pilot') app.timelineStep = 4;
    else if (nextStatus === 'Pilot') app.timelineStep = 5;
    else if (nextStatus === 'Validation') app.timelineStep = 6;
    else if (nextStatus === 'Selected') app.timelineStep = 7;

    logAudit('Committee Convener', 'government', 'UPDATE_APPLICATION_STATUS', 'Application', app.id, `Status transitioned to ${nextStatus}`);
    pushNotification(
      `Proposal Status Update: ${nextStatus}`,
      `Your proposal for ${app.challengeTitle} is now marked as ${nextStatus}.`,
      'success',
      'startup',
      '/applications'
    );
    notifyListeners();
    return app;
  },

  // Evaluations
  getEvaluations: (): Promise<Evaluation[]> => Promise.resolve([...state.evaluations]),

  submitEvaluation: async (evalData: {
    applicationId: string;
    evaluatorName: string;
    evaluatorRole: string;
    evaluatorAffiliation: string;
    criteriaScores: Evaluation['criteriaScores'];
    totalScore: number;
    recommendation: Evaluation['recommendation'];
    summaryRemarks: string;
  }): Promise<Evaluation> => {
    const app = state.applications.find((a) => a.id === evalData.applicationId);
    const existingIndex = state.evaluations.findIndex((e) => e.applicationId === evalData.applicationId);
    
    const newEval: Evaluation = {
      id: existingIndex >= 0 ? state.evaluations[existingIndex].id : `eval-${Date.now()}`,
      applicationId: evalData.applicationId,
      challengeId: app ? app.challengeId : 'ch-01',
      challengeTitle: app ? app.challengeTitle : 'Challenge',
      startupName: app ? app.startupName : 'Startup',
      startupId: app ? app.startupId : 'st-01',
      evaluatorName: evalData.evaluatorName || 'Prof. S. Ramanathan',
      evaluatorRole: evalData.evaluatorRole || 'Principal Technical Evaluator',
      evaluatorAffiliation: evalData.evaluatorAffiliation || 'IIT Delhi',
      dateEvaluated: new Date().toISOString().slice(0, 10),
      criteriaScores: evalData.criteriaScores,
      totalScore: evalData.totalScore,
      recommendation: evalData.recommendation,
      summaryRemarks: evalData.summaryRemarks,
      status: 'Completed',
    };

    if (existingIndex >= 0) {
      state.evaluations[existingIndex] = newEval;
    } else {
      state.evaluations.unshift(newEval);
    }

    if (app) {
      app.technicalScore = evalData.totalScore;
      if (evalData.recommendation === 'Recommend for Pilot' || evalData.recommendation === 'Approve') {
        app.status = 'Shortlisted for Pilot';
        app.timelineStep = 4;
      }
    }

    logAudit(newEval.evaluatorName, 'expert', 'RECORD_EVALUATION', 'Evaluation', newEval.id, `Completed scoring for ${newEval.startupName} (Score: ${newEval.totalScore}/100, Rec: ${newEval.recommendation})`);
    pushNotification(
      'Expert Evaluation Completed',
      `${newEval.evaluatorName} submitted scoring for ${newEval.startupName} (${newEval.totalScore}/100).`,
      'success',
      'government',
      '/evaluations'
    );
    notifyListeners();
    return newEval;
  },

  // Pilots & Sandboxes
  getPilots: (): Promise<Pilot[]> => Promise.resolve([...state.pilots]),
  getPilotById: (id: string): Promise<Pilot | undefined> =>
    Promise.resolve(state.pilots.find((p) => p.id === id)),

  createPilotFromApplication: async (appId: string, location: string, startDate: string, endDate: string, budget: number): Promise<Pilot> => {
    const app = state.applications.find((a) => a.id === appId) || state.applications[0];
    const newPilot: Pilot = {
      id: `pilot-${Date.now()}`,
      challengeId: app.challengeId,
      challengeTitle: app.challengeTitle,
      startupId: app.startupId,
      startupName: app.startupName,
      department: app.department,
      deploymentLocation: location || 'Municipal Sandbox Zone A',
      startDate: startDate || new Date().toISOString().slice(0, 10),
      endDate: endDate || new Date(Date.now() + 60 * 86400000).toISOString().slice(0, 10),
      budget: budget || app.pilotBudgetProposed,
      status: 'In Sandbox',
      completionPercentage: 15,
      liveKpiScore: 92,
      totalMilestones: 4,
      completedMilestones: 1,
      currentMilestoneStage: 'Prototype Deployment Active',
      milestones: [
        { id: `pm-${Date.now()}-1`, title: 'Prototype Deployment & Setup', description: 'Deployment of initial hardware and telemetry stream integration', completed: true, dueDate: 'Day 15', verifiedBy: 'Superintending Engineer' },
        { id: `pm-${Date.now()}-2`, title: 'Field Testing Run', description: 'Continuous field trial data collection and edge benchmarking', completed: false, dueDate: 'Day 30' },
        { id: `pm-${Date.now()}-3`, title: 'KPI Target Validation', description: 'Verification of contractual quantitative performance targets', completed: false, dueDate: 'Day 45' },
        { id: `pm-${Date.now()}-4`, title: 'Independent Final Audit', description: 'Formal audit certification and procurement scale-up blueprint', completed: false, dueDate: 'Day 60' },
      ],
    };

    state.pilots.unshift(newPilot);
    app.status = 'Pilot';
    app.timelineStep = 5;

    logAudit('Government Director', 'government', 'CREATE_PILOT', 'Pilot', newPilot.id, `Initiated 60-day sandbox pilot for ${newPilot.startupName} in ${newPilot.deploymentLocation}`);
    pushNotification(
      'Innovation Sandbox Pilot Created!',
      `Sandbox pilot initiated for ${newPilot.startupName} at ${newPilot.deploymentLocation}.`,
      'success',
      'all',
      '/pilots'
    );
    notifyListeners();
    return newPilot;
  },

  updatePilotMilestone: async (pilotId: string, milestoneId: string, completed: boolean): Promise<Pilot | undefined> => {
    const pilot = state.pilots.find((p) => p.id === pilotId);
    if (!pilot) return undefined;
    const ms = pilot.milestones.find((m) => m.id === milestoneId);
    if (ms) {
      ms.completed = completed;
      if (completed && !ms.verifiedBy) ms.verifiedBy = 'Nodal Officer (Verified)';
    }
    const completedCount = pilot.milestones.filter((m) => m.completed).length;
    pilot.completedMilestones = completedCount;
    pilot.completionPercentage = Math.round((completedCount / pilot.totalMilestones) * 100);
    if (pilot.completionPercentage === 100) pilot.status = 'Completed';

    logAudit('Nodal Officer', 'government', 'VERIFY_MILESTONE', 'Pilot', pilot.id, `Milestone '${ms?.title}' updated to ${completed ? 'Completed' : 'Pending'}`);
    notifyListeners();
    return pilot;
  },

  // KPIs
  getKPIs: (): Promise<KPIMeasurement[]> => Promise.resolve([...state.kpis]),
  updateKPIValue: async (kpiId: string, currentValue: string, achievementPercentage: number): Promise<KPIMeasurement | undefined> => {
    const kpi = state.kpis.find((k) => k.id === kpiId);
    if (!kpi) return undefined;
    kpi.currentValue = currentValue;
    kpi.achievementPercentage = achievementPercentage;
    kpi.lastUpdated = new Date().toLocaleTimeString('en-IN') + ' IST (Live)';
    kpi.status = achievementPercentage >= 100 ? 'Exceeding' : achievementPercentage >= 80 ? 'On Track' : 'At Risk';
    notifyListeners();
    return kpi;
  },

  // Payments
  getPayments: (): Promise<PaymentMilestone[]> => Promise.resolve([...state.payments]),

  releasePayment: async (paymentId: string): Promise<PaymentMilestone | undefined> => {
    const payment = state.payments.find((p) => p.id === paymentId);
    if (!payment) return undefined;
    payment.status = 'PAID';
    payment.disbursedDate = new Date().toISOString().slice(0, 10);
    payment.approvedDate = payment.approvedDate || new Date().toISOString().slice(0, 10);
    payment.pfmsReference = `PFMS-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    logAudit('Finance Officer', 'government', 'DISBURSE_PAYMENT', 'PaymentMilestone', payment.id, `Disbursed ₹${(payment.amount/100000).toFixed(1)} Lakhs via PFMS to ${payment.startupName}`);
    pushNotification(
      'Milestone Payment Disbursed via PFMS!',
      `₹${(payment.amount / 100000).toFixed(1)} Lakhs released for ${payment.milestoneTitle}.`,
      'success',
      'startup',
      '/payments'
    );
    notifyListeners();
    return payment;
  },

  // Validation
  getValidationReports: (): Promise<ValidationReport[]> => Promise.resolve([...state.validationReports]),

  // Scale-up & GeM Transition
  getScaleUpPlans: (): Promise<ScaleUpPlan[]> => Promise.resolve([...state.scaleUpPlans]),

  scaleSolution: async (scaleData: {
    planId: string;
    procuringDepartment: string;
    targetDistricts: string[];
    procurementQuantity: string;
    estimatedCost: number;
  }): Promise<ScaleUpPlan | undefined> => {
    const plan = state.scaleUpPlans.find((s) => s.id === scaleData.planId);
    if (!plan) return undefined;
    plan.status = 'Scaled';
    plan.procuringDepartment = scaleData.procuringDepartment || plan.procuringDepartment;
    plan.targetDistricts = scaleData.targetDistricts;
    plan.procurementQuantity = scaleData.procurementQuantity;
    plan.estimatedContractValue = scaleData.estimatedCost || plan.estimatedContractValue;
    plan.scaledDate = new Date().toISOString().slice(0, 10);

    logAudit('Mission Director', 'government', 'SCALE_UP_GEM_ORDER', 'ScaleUpPlan', plan.id, `Executed GeM Scale-up Purchase Order for ${plan.solutionName} (Valued ₹${(plan.estimatedContractValue/10000000).toFixed(1)} Cr)`);
    pushNotification(
      'Procurement Scale-Up Order Executed!',
      `Direct GeM procurement contract issued for ${plan.solutionName} across ${plan.targetDistricts?.length || '50'} districts under GFR Rule 149(viii).`,
      'success',
      'all',
      '/scale-up'
    );
    notifyListeners();
    return plan;
  },

  // Notifications
  getNotifications: (): Promise<NotificationItem[]> => Promise.resolve([...state.notifications]),
  markNotificationRead: (id: string) => {
    const notif = state.notifications.find((n) => n.id === id);
    if (notif) notif.read = true;
    notifyListeners();
  },

  // Audit Logs
  getAuditLogs: (): Promise<AuditLogEntry[]> => Promise.resolve([...state.auditLogs]),

  // Metrics
  getPlatformMetrics: async () => {
    return {
      activeChallenges: state.challenges.length,
      applicationsReceived: state.applications.length,
      vettedStartups: state.startups.length,
      activePilots: state.pilots.filter((p) => p.status === 'In Sandbox' || p.status === 'Active Field Trial').length,
      validatedSolutions: state.validationReports.filter((v) => v.kpiVerificationStatus === '100% Validated' || v.verdict === 'VALIDATED').length,
      solutionsReadyForScale: state.scaleUpPlans.filter((s) => s.status === 'Ready for Procurement' || s.status === 'Scaled').length,
      totalCommittedFunds: state.challenges.reduce((acc, c) => acc + c.budgetAllocated, 0),
      totalDisbursedFunds: state.payments
        .filter((p) => p.status === 'PAID' || p.status === 'Disbursed')
        .reduce((acc, p) => acc + p.amount, 0),
      averageEvaluationScore: 93.5,
      scaleUpPipelineValue: state.scaleUpPlans.reduce((acc, s) => acc + s.estimatedContractValue, 0),
    };
  },

  // Global Search
  globalSearch: async (query: string) => {
    if (!query || query.trim() === '') return { challenges: [], startups: [], applications: [], pilots: [] };
    const q = query.toLowerCase().trim();
    return {
      challenges: state.challenges.filter((c) => c.title.toLowerCase().includes(q) || c.code.toLowerCase().includes(q) || c.department.toLowerCase().includes(q)),
      startups: state.startups.filter((s) => s.brandName.toLowerCase().includes(q) || s.solutionTitle.toLowerCase().includes(q) || s.dpiitNumber.toLowerCase().includes(q)),
      applications: state.applications.filter((a) => a.startupName.toLowerCase().includes(q) || a.challengeTitle.toLowerCase().includes(q)),
      pilots: state.pilots.filter((p) => p.startupName.toLowerCase().includes(q) || p.challengeTitle.toLowerCase().includes(q) || p.deploymentLocation.toLowerCase().includes(q)),
    };
  },
};
