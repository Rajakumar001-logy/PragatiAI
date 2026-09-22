import React, { useState, useEffect } from 'react';
import { Modal, Button, Textarea, Badge } from '@/components/ui';
import {
  Sparkles,
  Bot,
  CheckCircle2,
  Key,
  Layers,
  ShieldCheck,
  Target,
  Wand2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import {
  generateChallengeDraftWithAI,
  getAIConfig,
  saveAIConfig,
  PRESET_CHALLENGE_IDEAS,
} from '@/services/aiService';
import { GeneratedChallengeDraft, AIProvider } from '@/types';
import { formatCurrency } from '@/utils/formatters';

interface AIChallengeAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyDraft: (draft: GeneratedChallengeDraft) => void;
  onDirectPublish?: (draft: GeneratedChallengeDraft) => Promise<void>;
}

export const AIChallengeAssistantModal: React.FC<AIChallengeAssistantModalProps> = ({
  isOpen,
  onClose,
  onApplyDraft,
  onDirectPublish,
}) => {
  const [provider, setProvider] = useState<AIProvider>('gemini');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [generatedDraft, setGeneratedDraft] = useState<GeneratedChallengeDraft | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showKeyConfig, setShowKeyConfig] = useState(false);
  const [geminiKeyInput, setGeminiKeyInput] = useState('');
  const [openaiKeyInput, setOpenaiKeyInput] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const config = getAIConfig();
      setProvider(config.preferredProvider);
      setGeminiKeyInput(config.geminiApiKey);
      setOpenaiKeyInput(config.openaiApiKey);
      setError(null);
    }
  }, [isOpen]);

  const handleSelectPreset = (presetPrompt: string) => {
    setPrompt(presetPrompt);
    setError(null);
  };

  const handleSaveKeys = () => {
    saveAIConfig(provider, geminiKeyInput, openaiKeyInput);
    setShowKeyConfig(false);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please provide a problem statement or click one of the suggested government problem presets.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedDraft(null);
    setGenerationStep(1);

    const stepInterval = setInterval(() => {
      setGenerationStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 600);

    try {
      // Save any currently typed keys first
      saveAIConfig(provider, geminiKeyInput, openaiKeyInput);

      const activeKey = provider === 'gemini' ? geminiKeyInput : openaiKeyInput;
      const draft = await generateChallengeDraftWithAI({
        prompt,
        provider,
        customApiKey: activeKey,
      });

      setGeneratedDraft(draft);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to generate challenge. Please verify your prompt or API key.';
      setError(msg);
    } finally {
      clearInterval(stepInterval);
      setIsGenerating(false);
      setGenerationStep(0);
    }
  };

  const handleApply = () => {
    if (generatedDraft) {
      onApplyDraft(generatedDraft);
      onClose();
    }
  };

  const handlePublishDirect = async () => {
    if (generatedDraft && onDirectPublish) {
      setIsPublishing(true);
      try {
        await onDirectPublish(generatedDraft);
        onClose();
      } finally {
        setIsPublishing(false);
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Innovation Challenge Assistant (GFR 2017 Rule 149(viii))"
      maxWidth="xl"
    >
      <div className="space-y-5 max-h-[80vh] overflow-y-auto pr-1">
        {/* Government Header Banner */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-blue-900 via-slate-900 to-navy-950 text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-1 border border-blue-400/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Outcome-Based Procurement Engine
            </div>
            <h4 className="text-base font-bold text-white">
              Automated Problem-to-Challenge Formulation
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              Draft vendor-neutral, KPI-governed public innovation challenges powered by Google Gemini or OpenAI.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowKeyConfig(!showKeyConfig)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-slate-200 border border-white/20 transition-colors whitespace-nowrap"
          >
            <Key className="w-3.5 h-3.5 text-amber-400" />
            {showKeyConfig ? 'Hide API Keys' : 'Configure API Keys'}
          </button>
        </div>

        {/* Optional API Key Configuration Drawer */}
        {showKeyConfig && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-300 space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                <Key className="w-4 h-4 text-blue-600" />
                AI Model & API Key Configuration
              </span>
              <span className="text-[11px] text-slate-500">Keys stored locally in browser</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Google Gemini API Key
                </label>
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={geminiKeyInput}
                  onChange={(e) => setGeminiKeyInput(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Leave empty to use built-in smart GFR procurement fallback.
                </p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  OpenAI API Key
                </label>
                <input
                  type="password"
                  placeholder="sk-proj-..."
                  value={openaiKeyInput}
                  onChange={(e) => setOpenaiKeyInput(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Supports GPT-4o-mini with structured JSON output.
                </p>
              </div>
            </div>
            <div className="flex justify-end pt-1">
              <Button size="sm" variant="outline" onClick={handleSaveKeys}>
                Save Key Settings
              </Button>
            </div>
          </div>
        )}

        {/* Provider Selection Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Select Intelligence Engine:</span>
            <div className="inline-flex rounded-lg p-1 bg-slate-100 border border-slate-200">
              <button
                type="button"
                onClick={() => setProvider('gemini')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  provider === 'gemini'
                    ? 'bg-white text-blue-700 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Google Gemini 1.5
              </button>
              <button
                type="button"
                onClick={() => setProvider('openai')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  provider === 'openai'
                    ? 'bg-white text-emerald-700 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                OpenAI GPT-4o-mini
              </button>
              <button
                type="button"
                onClick={() => setProvider('built-in')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  provider === 'built-in'
                    ? 'bg-white text-purple-700 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Built-in GFR 149(viii) Engine
              </button>
            </div>
          </div>
          <span className="text-[11px] text-slate-500">
            {provider === 'gemini' && '⚡ High-speed structured inference'}
            {provider === 'openai' && '🧠 Complex reasoning & multi-KPI formulation'}
            {provider === 'built-in' && '🛡️ 100% offline & zero-quota fallback'}
          </span>
        </div>

        {/* 1-Click Domain Presets */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Quick 1-Click Government Domain Presets:
            </label>
            <span className="text-[11px] text-blue-700 font-medium">Click any chip to autofill prompt</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {PRESET_CHALLENGE_IDEAS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset.prompt)}
                className="text-left p-2.5 rounded-lg border border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/50 transition-all group"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 group-hover:text-blue-700">
                  <span>{preset.icon}</span>
                  <span className="truncate">{preset.domain}</span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                  {preset.title}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Natural Language Prompt Input */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Problem Statement / Public Sector Requirement:
            </label>
            <span className="text-[11px] text-slate-500">{prompt.length} chars</span>
          </div>
          <Textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. NHAI needs a mobile camera system running computer vision to detect potholes, lane marking degradation, and guardrail damage at highway speed..."
            className="text-xs font-normal"
          />
          <p className="text-[11px] text-slate-500">
            Tip: State the public pain point, affected users, and operational scale. The AI engine will formulate quantitative KPIs, budget benchmarks, and TRL eligibility automatically.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2 text-xs text-red-800">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Formulation Notice</p>
              <p className="mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Generate Button & Progress */}
        <div className="flex items-center justify-between pt-1">
          <Button
            type="button"
            variant="primary"
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full sm:w-auto"
            leftIcon={
              isGenerating ? (
                <Wand2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <Sparkles className="w-4 h-4 text-amber-300" />
              )
            }
          >
            {isGenerating ? 'AI Engine Formulating Challenge...' : 'Generate Standardized Challenge Draft'}
          </Button>

          {isGenerating && (
            <div className="hidden sm:flex items-center gap-2 text-xs text-blue-700 animate-pulse font-medium">
              <Bot className="w-4 h-4" />
              {generationStep === 1 && '1/3 Analyzing operational bottleneck & ministry domain...'}
              {generationStep === 2 && '2/3 Synthesizing quantifiable KPIs & verification methods...'}
              {generationStep >= 3 && '3/3 Finalizing GFR Rule 149(viii) compliance parameters...'}
            </div>
          )}
        </div>

        {/* Generated Challenge Draft Result Preview */}
        {generatedDraft && (
          <div className="mt-4 p-4 rounded-xl border border-blue-200 bg-blue-50/30 space-y-4 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-200 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="primary" size="sm">
                    {generatedDraft.providerUsed === 'gemini' && 'Google Gemini 1.5 Flash'}
                    {generatedDraft.providerUsed === 'openai' && 'OpenAI GPT-4o-mini'}
                    {(!generatedDraft.providerUsed || generatedDraft.providerUsed === 'built-in') && 'Pragati GFR 149(viii) Engine'}
                  </Badge>
                  <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> GFR 2017 Outcome-Compliant
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 mt-1">
                  {generatedDraft.title}
                </h4>
                <p className="text-xs text-slate-600">
                  {generatedDraft.department} • {generatedDraft.ministry}
                </p>
              </div>

              <div className="text-right sm:border-l sm:border-blue-200 sm:pl-4">
                <span className="text-[11px] text-slate-500 uppercase tracking-wider block">Estimated Budget</span>
                <span className="text-base font-extrabold text-slate-900">
                  {formatCurrency(generatedDraft.budgetAllocated)}
                </span>
                <span className="text-[11px] text-slate-500 block">
                  {generatedDraft.pilotDurationDays}-Day Sandbox Pilot
                </span>
              </div>
            </div>

            {/* Problem & Outcome Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-800 block mb-1">Problem & Current State:</span>
                <p className="text-slate-600 leading-relaxed mb-2">{generatedDraft.problemStatement}</p>
                <p className="text-slate-500 italic bg-slate-50 p-2 rounded border border-slate-100">
                  <strong>Baseline Situation:</strong> {generatedDraft.currentSituation}
                </p>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-800 block mb-1">Target Expected Outcome:</span>
                <p className="text-blue-900 font-medium leading-relaxed mb-2 bg-blue-50/60 p-2.5 rounded border border-blue-100">
                  {generatedDraft.expectedOutcome}
                </p>
                <div className="text-slate-600 space-y-1">
                  <p><strong>Geographic Sandbox:</strong> {generatedDraft.geographicArea}</p>
                  <p><strong>Target Users:</strong> {generatedDraft.targetUsers}</p>
                </div>
              </div>
            </div>

            {/* Target KPIs */}
            <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-blue-600" />
                  Target Quantitative Benchmarks (KPIs)
                </span>
                <span className="text-[11px] text-slate-500">Weightage = 100% total</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {generatedDraft.kpis.map((kpi, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{kpi.name}</span>
                      <Badge variant="neutral" size="sm">Weight: {kpi.weightage}%</Badge>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600 text-[11px]">
                      <span>Baseline: <strong>{kpi.baseline} {kpi.unit}</strong></span>
                      <span>→</span>
                      <span>Target: <strong className="text-emerald-700">{kpi.target} {kpi.unit}</strong></span>
                    </div>
                    <p className="text-[10px] text-slate-500 truncate">
                      Method: {kpi.measurementMethod}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Technology & Eligibility */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white p-3 rounded-lg border border-slate-200">
              <div>
                <span className="font-bold text-slate-800 block mb-1 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-slate-600" /> Required Technology Stack:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {generatedDraft.requiredTechnology.map((t, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-800 block mb-1 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-600" /> Startup Eligibility & Security:
                </span>
                <p className="text-[11px] text-slate-600">
                  <strong>Stage:</strong> {generatedDraft.eligibilityCriteria.startupStage}
                </p>
                <p className="text-[11px] text-slate-600">
                  <strong>Security:</strong> {generatedDraft.eligibilityCriteria.securityRequirements}
                </p>
              </div>
            </div>

            {/* Reasoning Note / Compliance Footer */}
            {generatedDraft.reasoningNote && (
              <p className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded border border-slate-200">
                {generatedDraft.reasoningNote}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-2 border-t border-blue-200">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setGeneratedDraft(null);
                  setPrompt('');
                }}
              >
                Clear & Formulate Another
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={handleApply}
                leftIcon={<CheckCircle2 className="w-4 h-4 text-emerald-300" />}
              >
                Apply to Challenge Wizard
              </Button>

              {onDirectPublish && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handlePublishDirect}
                  disabled={isPublishing}
                  leftIcon={<ExternalLink className="w-4 h-4" />}
                >
                  {isPublishing ? 'Publishing...' : 'Directly Publish Challenge'}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
export default AIChallengeAssistantModal;
