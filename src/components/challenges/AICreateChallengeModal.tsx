import React, { useState } from 'react';
import { Modal, Button, Textarea, Input } from '@/components/ui';
import { Sparkles, Bot, AlertCircle, Wand2, CheckCircle2 } from 'lucide-react';
import { generateChallengeDraftWithAI, PRESET_CHALLENGE_IDEAS } from '@/services/aiService';
import { mockService } from '@/services/mockService';
import { Challenge } from '@/types';

interface AICreateChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChallengeCreated?: (newChallenge: Challenge) => void;
}

export const AICreateChallengeModal: React.FC<AICreateChallengeModalProps> = ({
  isOpen,
  onClose,
  onChallengeCreated,
}) => {
  const [problemDescription, setProblemDescription] = useState('');
  const [budget, setBudget] = useState('5000000');
  const [department, setDepartment] = useState('Ministry of Housing & Urban Affairs');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectPreset = (prompt: string) => {
    setProblemDescription(prompt);
    setError(null);
  };

  const handleGenerateAndPublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemDescription.trim()) {
      setError('Please provide a short description of the problem.');
      return;
    }

    const budgetNum = Number(budget.replace(/[^0-9]/g, '')) || 5000000;

    setIsGenerating(true);
    setError(null);

    try {
      // 1. Generate full challenge description and KPIs using Gemini AI
      const draft = await generateChallengeDraftWithAI({
        prompt: problemDescription,
        budget: budgetNum,
        provider: 'gemini',
      });

      // 2. Automatically publish the challenge to the platform
      const published = await mockService.createChallenge({
        title: draft.title,
        problemStatement: draft.problemStatement,
        currentSituation: draft.currentSituation,
        expectedOutcome: draft.expectedOutcome,
        department: department || draft.department,
        ministry: draft.ministry || 'Ministry of Housing & Urban Affairs',
        requiredTechnology: draft.requiredTechnology,
        targetUsers: draft.targetUsers,
        geographicArea: draft.geographicArea,
        budgetAllocated: budgetNum,
        currentStage: 'OPEN',
        applicationDeadline: '2026-11-30',
        pilotDurationDays: draft.pilotDurationDays || 60,
        tags: draft.tags,
        kpis: draft.kpis,
        eligibilityCriteria: draft.eligibilityCriteria,
      });

      // 3. Reset form and notify parent
      setProblemDescription('');
      if (onChallengeCreated) {
        onChallengeCreated(published);
      }
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to publish challenge. Please check your inputs.';
      setError(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Outcome Challenge with AI"
      maxWidth="lg"
    >
      <form onSubmit={handleGenerateAndPublish} className="space-y-4 text-xs sm:text-sm">
        {/* Banner */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-900 via-slate-900 to-navy-950 text-white shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span className="text-xs font-bold text-blue-200 uppercase tracking-wide">
              Instant AI Challenge Publisher (GFR Rule 149(viii))
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Provide a short problem description and budget. AI will automatically formulate the standardized problem statement, quantitative KPIs, SLAs, and publish it live for startup innovators.
          </p>
        </div>

        {/* 1-Click Presets */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Suggested Government Problems (1-Click Fill):
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {PRESET_CHALLENGE_IDEAS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset.prompt)}
                className="text-left p-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-400 transition-all text-xs"
              >
                <div className="flex items-center gap-1 font-semibold text-slate-800">
                  <span>{preset.icon}</span>
                  <span className="truncate">{preset.domain}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Short Description */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-800">
            Short Description of Problem <span className="text-red-500">*</span>
          </label>
          <Textarea
            rows={3}
            value={problemDescription}
            onChange={(e) => setProblemDescription(e.target.value)}
            placeholder="e.g. NHAI needs a mobile computer vision camera to detect highway potholes and guardrail damages at 80 km/h..."
            required
            className="text-xs"
          />
          <p className="text-[11px] text-slate-500">
            AI will expand this into standardized operational bottlenecks, expected SLAs, and tamper-proof telemetry KPIs.
          </p>
        </div>

        {/* Budget & Department Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">
              Allocated Sandbox Budget (INR ₹) <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="5000000"
              required
            />
            <p className="text-[11px] text-slate-500 mt-1">
              e.g. ₹50,00,000 (INR 50 Lakhs)
            </p>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">
              Ministry / Department
            </label>
            <Input
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g. Ministry of Jal Shakti"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Auto-detected or can be manually customized.
            </p>
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-800">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading state note */}
        {isGenerating && (
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 flex items-center gap-3 text-xs text-blue-900 animate-pulse">
            <Wand2 className="w-4 h-4 animate-spin text-blue-600" />
            <div>
              <p className="font-semibold">Gemini AI is formulating full challenge...</p>
              <p className="text-[11px] text-blue-700">Structuring quantitative target KPIs, TRL eligibility, and publishing live for startups.</p>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isGenerating}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={isGenerating || !problemDescription.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
            leftIcon={
              isGenerating ? (
                <Wand2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 text-amber-300" />
              )
            }
          >
            {isGenerating ? 'Publishing with AI...' : 'Generate & Publish Challenge with AI'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
export default AICreateChallengeModal;
