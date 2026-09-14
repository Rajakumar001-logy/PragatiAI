import {
  mockChallenges,
  mockStartups,
  mockApplications,
  mockEvaluations,
  mockPilots,
  mockKPIs,
  mockPayments,
  mockValidationReports,
  mockScaleUpPlans,
  mockUsers,
  mockNotifications,
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
} from '@/types';

// Mock storage state to simulate backend mutations in memory
let challenges = [...mockChallenges];
let startups = [...mockStartups];
let applications = [...mockApplications];
let evaluations = [...mockEvaluations];
let pilots = [...mockPilots];
let kpis = [...mockKPIs];
let payments = [...mockPayments];
let validationReports = [...mockValidationReports];
let scaleUpPlans = [...mockScaleUpPlans];
let currentUser: User = mockUsers[0]; // Default to Government Officer

export const mockService = {
  // Authentication & Session
  getCurrentUser: (): User => currentUser,
  switchRole: (role: UserRole): User => {
    const found = mockUsers.find((u) => u.role === role);
    if (found) currentUser = found;
    return currentUser;
  },

  // Challenges
  getChallenges: (): Promise<Challenge[]> => Promise.resolve([...challenges]),
  getChallengeById: (id: string): Promise<Challenge | undefined> =>
    Promise.resolve(challenges.find((c) => c.id === id)),
  createChallenge: (newChallenge: Omit<Challenge, 'id' | 'code' | 'publishedDate' | 'totalApplicants'>): Promise<Challenge> => {
    const created: Challenge = {
      ...newChallenge,
      id: `ch-${Date.now()}`,
      code: `PRG-2026-${String(challenges.length + 1).padStart(3, '0')}`,
      publishedDate: new Date().toISOString().split('T')[0],
      totalApplicants: 0,
    };
    challenges.unshift(created);
    return Promise.resolve(created);
  },

  // Startups
  getStartups: (): Promise<Startup[]> => Promise.resolve([...startups]),
  getStartupById: (id: string): Promise<Startup | undefined> =>
    Promise.resolve(startups.find((s) => s.id === id)),

  // Applications
  getApplications: (): Promise<Application[]> => Promise.resolve([...applications]),
  getApplicationById: (id: string): Promise<Application | undefined> =>
    Promise.resolve(applications.find((a) => a.id === id)),

  // Evaluations
  getEvaluations: (): Promise<Evaluation[]> => Promise.resolve([...evaluations]),

  // Pilots
  getPilots: (): Promise<Pilot[]> => Promise.resolve([...pilots]),

  // KPIs
  getKPIs: (): Promise<KPIMeasurement[]> => Promise.resolve([...kpis]),

  // Payments
  getPayments: (): Promise<PaymentMilestone[]> => Promise.resolve([...payments]),

  // Validations
  getValidationReports: (): Promise<ValidationReport[]> => Promise.resolve([...validationReports]),

  // Scale-up
  getScaleUpPlans: (): Promise<ScaleUpPlan[]> => Promise.resolve([...scaleUpPlans]),

  // Notifications
  getNotifications: () => Promise.resolve([...mockNotifications]),

  // Summary Metrics for Dashboard
  getPlatformMetrics: () => {
    return Promise.resolve({
      activeChallenges: challenges.length,
      vettedStartups: startups.length,
      activePilots: pilots.filter((p) => p.status === 'In Sandbox' || p.status === 'Active Field Trial').length,
      validatedSolutions: validationReports.filter((v) => v.kpiVerificationStatus === '100% Validated').length,
      totalCommittedFunds: challenges.reduce((acc, c) => acc + c.budgetAllocated, 0),
      totalDisbursedFunds: payments
        .filter((p) => p.status === 'Disbursed')
        .reduce((acc, p) => acc + p.amount, 0),
      averageEvaluationScore: 93.5,
      scaleUpPipelineValue: scaleUpPlans.reduce((acc, s) => acc + s.estimatedContractValue, 0),
    });
  },
};
