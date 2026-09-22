import { GeneratedChallengeDraft, AIProvider } from '@/types';

export interface AIConfig {
  preferredProvider: AIProvider;
  geminiApiKey: string;
  openaiApiKey: string;
}

const STORAGE_KEYS = {
  PROVIDER: 'pragati_ai_provider',
  GEMINI_KEY: 'pragati_gemini_key',
  OPENAI_KEY: 'pragati_openai_key',
};

export const getAIConfig = (): AIConfig => {
  const envGemini = import.meta.env.VITE_GEMINI_API_KEY || '';
  const envOpenAI = import.meta.env.VITE_OPENAI_API_KEY || '';

  const storedProvider = (localStorage.getItem(STORAGE_KEYS.PROVIDER) as AIProvider) || 'gemini';
  const storedGemini = localStorage.getItem(STORAGE_KEYS.GEMINI_KEY) || envGemini;
  const storedOpenAI = localStorage.getItem(STORAGE_KEYS.OPENAI_KEY) || envOpenAI;

  return {
    preferredProvider: storedProvider,
    geminiApiKey: storedGemini,
    openaiApiKey: storedOpenAI,
  };
};

export const saveAIConfig = (provider: AIProvider, geminiKey?: string, openaiKey?: string) => {
  localStorage.setItem(STORAGE_KEYS.PROVIDER, provider);
  if (geminiKey !== undefined) {
    localStorage.setItem(STORAGE_KEYS.GEMINI_KEY, geminiKey.trim());
  }
  if (openaiKey !== undefined) {
    localStorage.setItem(STORAGE_KEYS.OPENAI_KEY, openaiKey.trim());
  }
};

const SYSTEM_PROMPT = `
You are the Pragati AI Public Innovation Formulation Engine.
You specialize in translating public sector problem statements into outcome-based innovation challenges compliant with India's General Financial Rules (GFR) 2017 Rule 149(viii).

IMPORTANT RULES:
1. Vendor-Neutral & Outcome-Focused: Focus on WHAT needs to be achieved (quantitative SLAs, cost reduction, accuracy), NOT prescribing specific proprietary hardware brands.
2. Measurable Target KPIs: Provide 2 or 3 quantifiable Target KPIs with baseline, target benchmark, weightage (sum = 100%), and tamper-evident measurement methods (e.g. IoT API telemetry, independent lab testing).
3. Realistic Indian Governance: Set realistic budgets in Indian Rupees (INR ₹), appropriate Indian Ministries (e.g. MoHUA, MoRTH, Jal Shakti, MoHFW, Ministry of Agriculture), and Indian sovereign cloud compliance (CERT-In / ISO 27001).

You must ALWAYS output valid JSON matching this exact structure:
{
  "title": "string",
  "ministry": "string",
  "department": "string",
  "problemStatement": "string",
  "currentSituation": "string",
  "expectedOutcome": "string",
  "requiredTechnology": ["tech1", "tech2"],
  "targetUsers": "string",
  "geographicArea": "string",
  "budgetAllocated": 5000000,
  "pilotDurationDays": 60,
  "kpis": [
    {
      "name": "string",
      "unit": "string",
      "baseline": 0,
      "target": 25,
      "weightage": 50,
      "measurementMethod": "string"
    }
  ],
  "eligibilityCriteria": {
    "startupStage": "string",
    "requiredCertifications": ["string"],
    "technologyRequirements": "string",
    "securityRequirements": "string"
  },
  "tags": ["string"],
  "reasoningNote": "string"
}
`;

// Pre-engineered intelligent templates for instant zero-key execution & fallback
const DOMAIN_TEMPLATES: Record<string, Partial<GeneratedChallengeDraft>> = {
  water: {
    title: 'Acoustic IoT & Telemetric Pipeline Contamination Detection in Rural Distribution',
    ministry: 'Ministry of Jal Shakti',
    department: 'National Jal Jeevan Mission (NJJM)',
    problemStatement:
      'Rural piped water networks experience undetected subterranean leakages and intermittent bacterial contamination, causing high non-revenue water (NRW) loss and delayed waterborne disease alerts.',
    currentSituation:
      'Manual physical grab-sampling occurs bi-weekly, leading to 7 to 14 days latency in detecting microbial spikes and up to 35% water loss due to unlocalized pipe fractures.',
    expectedOutcome:
      'Continuous acoustic wave analysis and edge telemetry detecting pipe fractures within 30 minutes and contamination spikes within 15 minutes across a 40 km test pipeline.',
    requiredTechnology: ['Acoustic Hydrophone Sensors', 'Edge AI Microcontrollers', 'Narrowband IoT (NB-IoT)', 'GIS Spatial Mapping'],
    targetUsers: 'District Water Supply Engineers, Gram Panchayat Jal Samiti, and Public Health Officers',
    geographicArea: '40 km Rural Pipeline Corridor in Bundelkhand / Vidarbha Region',
    budgetAllocated: 6500000,
    pilotDurationDays: 60,
    kpis: [
      {
        id: 'kpi-water-1',
        name: 'Acoustic Leak Detection Precision',
        unit: '%',
        baseline: 45,
        target: 92,
        weightage: 50,
        measurementMethod: 'Simulated pressure drops and physical excavation verification logs',
      },
      {
        id: 'kpi-water-2',
        name: 'Contamination Alert Latency',
        unit: 'minutes',
        baseline: 7200,
        target: 20,
        weightage: 50,
        measurementMethod: 'Real-time telemetry timestamps cross-verified against NABL lab reports',
      },
    ],
    eligibilityCriteria: {
      startupStage: 'DPIIT Registered Startup (TRL 6+ with proven sensor pilot)',
      requiredCertifications: ['ISO 9001:2015', 'NABL Calibration Certificate'],
      technologyRequirements: 'Sub-watt power telemetry capable of 3-year battery life in harsh outdoor terrain',
      securityRequirements: 'Data residency in India, TLS 1.3 telemetry encryption, CERT-In empanelled hosting',
    },
    tags: ['Jal Jeevan Mission', 'Clean Water', 'IoT Telematics', 'Smart Governance'],
  },
  road: {
    title: 'Automated Mobile Computer Vision for National Highway Pothole & Road Distress Profiling',
    ministry: 'Ministry of Road Transport and Highways (MoRTH)',
    department: 'National Highways Authority of India (NHAI)',
    problemStatement:
      'Manual road condition surveys and visual inspections across 140,000+ km of National Highways are irregular, subjective, labor-intensive, and fail to prioritize preventative pavement maintenance.',
    currentSituation:
      'Network survey vehicles (NSVs) inspect corridors only once or twice a year, leaving localized pothole depressions and edge cracking undetected for months during monsoon seasons.',
    expectedOutcome:
      'Deploy vehicle-mounted optical cameras running real-time edge neural inference at 80 km/h to classify, geolocate, and measure pavement distress with >= 90% precision.',
    requiredTechnology: ['Mobile Edge AI', 'YOLO/Vision Transformers', 'Dual-Band GNSS Geotagging', 'Road Condition Index (PCI) Engine'],
    targetUsers: 'NHAI Project Directors, Concessionaire Maintenance Teams, Highway Patrol Officers',
    geographicArea: '150 km Stretch of NH-44 / Golden Quadrilateral Sandbox Zone',
    budgetAllocated: 5000000,
    pilotDurationDays: 60,
    kpis: [
      {
        id: 'kpi-road-1',
        name: 'Automated Distress Classification Accuracy',
        unit: '%',
        baseline: 55,
        target: 91,
        weightage: 50,
        measurementMethod: 'Ground truth audit comparison against certified Highway Pavement Engineers',
      },
      {
        id: 'kpi-road-2',
        name: 'Inspection Data Turnaround SLA',
        unit: 'hours',
        baseline: 336,
        target: 6,
        weightage: 50,
        measurementMethod: 'Automated ingestion pipeline latency to RAMS (Road Asset Management System)',
      },
    ],
    eligibilityCriteria: {
      startupStage: 'DPIIT Recognised Startup with tested vehicular vision hardware',
      requiredCertifications: ['ISO 9001:2015', 'IP67 Ingress Protection for Cameras'],
      technologyRequirements: 'Real-time inference at >= 30 FPS on edge accelerators (Jetson / equivalent)',
      securityRequirements: 'Sovereign cloud data storage compliant with MoRTH IT and MeitY guidelines',
    },
    tags: ['NHAI', 'Computer Vision', 'Highway Safety', 'Infrastructure AI'],
  },
  health: {
    title: 'Offline-First Edge AI Multi-Modal Diagnostics for Rural Primary Health Centers',
    ministry: 'Ministry of Health and Family Welfare (MoHFW)',
    department: 'National Health Authority (NHA) / Ayushman Bharat',
    problemStatement:
      'Remote Primary Health Centers (PHCs) lack specialist ophthalmologists and cardiologists, resulting in late-stage detection of diabetic retinopathy and hypertensive cardiovascular risks.',
    currentSituation:
      'Patients must travel 50-80 km to district hospitals for fundamental fundus and 12-lead ECG interpretations, leading to a 60% screening drop-out rate.',
    expectedOutcome:
      'A portable, battery-operated diagnostic unit capable of offline neural screening for diabetic retinopathy and arrhythmia with automated triage scoring under 90 seconds.',
    requiredTechnology: ['Edge Tensor Processing', 'Multi-Modal Computer Vision & ECG AI', 'ABDM (Ayushman Bharat Digital Mission) M1/M2/M3 Integration'],
    targetUsers: 'Community Health Officers (CHOs), ANM Workers, PHC Medical Officers',
    geographicArea: '15 Primary Health Centers across Aspirational Districts',
    budgetAllocated: 7500000,
    pilotDurationDays: 90,
    kpis: [
      {
        id: 'kpi-health-1',
        name: 'Clinical Screening Diagnostic Sensitivity',
        unit: '%',
        baseline: 60,
        target: 94,
        weightage: 50,
        measurementMethod: 'Double-blinded clinical validation against AIIMS / PGIMER specialist evaluations',
      },
      {
        id: 'kpi-health-2',
        name: 'ABHA Health Record Ingestion Rate',
        unit: '%',
        baseline: 10,
        target: 98,
        weightage: 50,
        measurementMethod: 'ABDM milestone audit logs and consent-driven digital health locker sync',
      },
    ],
    eligibilityCriteria: {
      startupStage: 'DPIIT Registered MedTech Startup with clinical safety verification',
      requiredCertifications: ['CDSCO Medical Device Compliance / CE-IVD', 'ISO 13485'],
      technologyRequirements: 'Zero-cloud dependency for on-device inference with encrypted offline caching',
      securityRequirements: 'Strict ABDM patient privacy compliance, AES-256 local encrypted storage',
    },
    tags: ['Ayushman Bharat', 'Healthcare AI', 'ABDM', 'Rural Health'],
  },
  energy: {
    title: 'AI Micro-Grid Dynamic Demand Forecasting & Green Energy Storage Balancing',
    ministry: 'Ministry of Power',
    department: 'Central Electricity Authority (CEA)',
    problemStatement:
      'Integration of decentralized rooftop solar and agricultural feeders causes localized grid frequency volatility and unoptimized battery energy storage system (BESS) degradation.',
    currentSituation:
      'Substation operators manually schedule dispatch based on historical day-ahead curves, resulting in 18% renewable curtailment during peak midday generation.',
    expectedOutcome:
      'Real-time neural load forecasting and automated dispatch optimizing battery cycle life and cutting peak solar curtailment below 4% across 10 distribution feeders.',
    requiredTechnology: ['Deep Learning Time-Series (LSTM/Transformer)', 'SCADA/Modbus Telemetry', 'Smart Inverter Automated Curtailment API'],
    targetUsers: 'DISCOM Chief Engineers, Grid Substation Managers, Renewable Power Producers',
    geographicArea: '10 Substation Feeders in Western Rajasthan Solar Corridor',
    budgetAllocated: 6000000,
    pilotDurationDays: 60,
    kpis: [
      {
        id: 'kpi-energy-1',
        name: 'Renewable Solar Curtailment Reduction',
        unit: '%',
        baseline: 18,
        target: 4,
        weightage: 50,
        measurementMethod: 'Smart meter energy accounting verified against State Load Despatch Centre (SLDC)',
      },
      {
        id: 'kpi-energy-2',
        name: 'Feeder Load Forecast Mean Absolute Percentage Error (MAPE)',
        unit: '%',
        baseline: 14.5,
        target: 4.2,
        weightage: 50,
        measurementMethod: 'Continuous 15-minute time-block comparisons against actual feeder demand',
      },
    ],
    eligibilityCriteria: {
      startupStage: 'DPIIT Registered EnergyTech Startup with operational grid pilot experience',
      requiredCertifications: ['ISO 27001', 'IEC 61850 Grid Communication Compliance'],
      technologyRequirements: 'Sub-second telemetry ingestion and fail-safe automated relay overrides',
      securityRequirements: 'Strict compliance with National Critical Information Infrastructure Protection Centre (NCIIPC)',
    },
    tags: ['Green Energy', 'Smart Grid', 'Ministry of Power', 'CleanTech'],
  },
  agriculture: {
    title: 'Drone Multispectral Imagery & AI for Hyper-Local PMFBY Crop Damage Assessment',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    department: 'Pradhan Mantri Fasal Bima Yojana (PMFBY) Mission Directorate',
    problemStatement:
      'Inundation, drought, and pest attacks result in delayed crop insurance claim settlements due to protracted manual crop-cutting experiments (CCEs) and disputed loss figures.',
    currentSituation:
      'Manual CCEs cover less than 1% of farmland and take 60 to 90 days to process insurance settlements, leaving distress-hit smallholders without working capital.',
    expectedOutcome:
      'Combine DGCA-certified drone multispectral imagery with satellite SAR data to generate automated parcel-level yield loss indices within 72 hours of weather events.',
    requiredTechnology: ['Multispectral Drone Imagery', 'Sentinel/SAR Satellite Fusion', 'NDVI/EVI Automated Loss Classifiers', 'Kisan GIS Geo-Portal Integration'],
    targetUsers: 'District Agriculture Officers, Insurance Loss Assessors, Gram Panchayat Revenue Patwaris',
    geographicArea: '3 Drought-Prone Talukas (50,000 Hectares) in Maharashtra/Karnataka',
    budgetAllocated: 5500000,
    pilotDurationDays: 60,
    kpis: [
      {
        id: 'kpi-agri-1',
        name: 'Damage Assessment SLA',
        unit: 'hours',
        baseline: 1440,
        target: 72,
        weightage: 50,
        measurementMethod: 'Automated claim report generation timestamp on National Crop Insurance Portal (NCIP)',
      },
      {
        id: 'kpi-agri-2',
        name: 'Crop Yield Loss Correlation Index',
        unit: '%',
        baseline: 62,
        target: 89,
        weightage: 50,
        measurementMethod: 'Calibrated against 100 scientifically conducted ground Crop Cutting Experiments',
      },
    ],
    eligibilityCriteria: {
      startupStage: 'DPIIT Registered AgriTech Startup (TRL 7+)',
      requiredCertifications: ['DGCA Type Certified Drones', 'ISO 9001:2015'],
      technologyRequirements: 'Sub-5cm ground sampling distance (GSD) processing pipeline',
      securityRequirements: 'Survey of India geospatial guidelines compliance and secure Indian cloud storage',
    },
    tags: ['PMFBY', 'AgriTech', 'Drone AI', 'Satellite Analytics'],
  },
  waste: {
    title: 'Automated Computer Vision for Municipal Waste Segregation & Illegal Dumping Alerts',
    ministry: 'Ministry of Housing and Urban Affairs (MoHUA)',
    department: 'Swachh Bharat Mission (Urban)',
    problemStatement:
      'Inefficient door-to-door dry/wet waste segregation and unauthorized nighttime roadside dumping cause landfill overflows and recurring environmental contamination fines.',
    currentSituation:
      'Sanitation supervisors rely on sporadic citizen complaints and visual bin checks, leading to less than 40% source segregation compliance in urban wards.',
    expectedOutcome:
      'Install camera modules on municipal collection tippers and smart poles to automatically audit waste segregation compliance and alert municipal ward officers to illegal dumping in under 10 minutes.',
    requiredTechnology: ['Edge Vision AI', 'Object Detection for Biodegradable/Plastic Waste', 'GPS Route Optimization', 'Citizen WhatsApp Bot Escalation'],
    targetUsers: 'Municipal Sanitation Inspectors, City Ward Commissioners, Waste Concessionaires',
    geographicArea: 'Smart City Urban Sandbox (Wards 12 through 20)',
    budgetAllocated: 4500000,
    pilotDurationDays: 60,
    kpis: [
      {
        id: 'kpi-waste-1',
        name: 'Automated Waste Segregation Audit Accuracy',
        unit: '%',
        baseline: 38,
        target: 88,
        weightage: 50,
        measurementMethod: 'Randomized daily physical inspection audits at transfer stations',
      },
      {
        id: 'kpi-waste-2',
        name: 'Illegal Dumping Incident Detection & Clearance SLA',
        unit: 'hours',
        baseline: 48,
        target: 3,
        weightage: 50,
        measurementMethod: 'Municipal Swachhata portal geotagged resolution receipts',
      },
    ],
    eligibilityCriteria: {
      startupStage: 'DPIIT Registered CleanTech/AI Startup',
      requiredCertifications: ['ISO 9001:2015', 'IP66 Weatherproof Certified Enclosures'],
      technologyRequirements: 'Robust performance under varied lighting and dirty lens conditions',
      securityRequirements: 'Facial and license plate redaction on device before cloud transmission for privacy',
    },
    tags: ['Swachh Bharat', 'Smart Cities', 'Edge AI', 'CleanTech'],
  },
};

const synthesizeFallbackChallenge = (prompt: string): GeneratedChallengeDraft => {
  const p = prompt.toLowerCase();

  let matchedDomain = 'water';
  if (p.includes('road') || p.includes('pothole') || p.includes('highway') || p.includes('traffic') || p.includes('nhai') || p.includes('transport')) {
    matchedDomain = 'road';
  } else if (p.includes('health') || p.includes('hospital') || p.includes('patient') || p.includes('medical') || p.includes('ayushman') || p.includes('doctor')) {
    matchedDomain = 'health';
  } else if (p.includes('energy') || p.includes('power') || p.includes('grid') || p.includes('solar') || p.includes('electricity') || p.includes('battery')) {
    matchedDomain = 'energy';
  } else if (p.includes('crop') || p.includes('agri') || p.includes('farm') || p.includes('pmfby') || p.includes('fertilizer') || p.includes('soil')) {
    matchedDomain = 'agriculture';
  } else if (p.includes('waste') || p.includes('swachh') || p.includes('plastic') || p.includes('garbage') || p.includes('dump') || p.includes('sanitation')) {
    matchedDomain = 'waste';
  }

  const base = DOMAIN_TEMPLATES[matchedDomain] || DOMAIN_TEMPLATES.water;

  // Customize title slightly if the prompt provides a distinct user requirement
  const customTitle = prompt.length > 10 && prompt.length < 90 && !prompt.includes('\n')
    ? `AI Innovation: ${prompt.trim()}`
    : (base.title as string);

  return {
    title: customTitle,
    ministry: base.ministry || 'Ministry of Housing & Urban Affairs',
    department: base.department || 'Urban Innovation Mission',
    problemStatement: base.problemStatement || 'Operational bottlenecks require outcome-based deep tech solutions.',
    currentSituation: base.currentSituation || 'Existing manual practices exhibit delayed response times and lack real-time digital auditing.',
    expectedOutcome: base.expectedOutcome || 'Quantifiable deployment of edge AI or IoT telemetry yielding >= 25% efficiency gains in a 60-day sandbox pilot.',
    requiredTechnology: base.requiredTechnology || ['Edge AI', 'IoT Telemetry', 'Cloud Analytics'],
    targetUsers: base.targetUsers || 'Government Field Engineers & District Administrators',
    geographicArea: base.geographicArea || 'Designated Public Sandbox Zone',
    budgetAllocated: base.budgetAllocated || 5000000,
    pilotDurationDays: base.pilotDurationDays || 60,
    kpis: base.kpis || [
      {
        id: `kpi-fallback-1`,
        name: 'Operational Precision Benchmark',
        unit: '%',
        baseline: 40,
        target: 90,
        weightage: 50,
        measurementMethod: 'Independent third-party verification log',
      },
      {
        id: `kpi-fallback-2`,
        name: 'Turnaround Latency Reduction',
        unit: 'hours',
        baseline: 72,
        target: 4,
        weightage: 50,
        measurementMethod: 'Platform automated telemetry audit',
      },
    ],
    eligibilityCriteria: base.eligibilityCriteria || {
      startupStage: 'DPIIT Registered Startup (TRL 6+)',
      requiredCertifications: ['ISO 9001:2015', 'ISO 27001 Data Security'],
      technologyRequirements: 'High-availability telemetry with sub-second response rates',
      securityRequirements: 'Data residency within Indian sovereign cloud infrastructure',
    },
    tags: base.tags || ['Innovation', 'GFR 149(viii)', 'DeepTech'],
    providerUsed: 'built-in',
    reasoningNote: `Draft formulated using Pragati AI GFR 2017 Rule 149(viii) Procurement Synthesizer (${matchedDomain.toUpperCase()} domain template calibrated for Indian public sector compliance).`,
  };
};

/**
 * Call Google Gemini API (gemini-1.5-flash)
 */
async function callGemini(prompt: string, apiKey: string): Promise<GeneratedChallengeDraft> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const payload = {
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: `${SYSTEM_PROMPT}\n\nUSER PROBLEM INPUT TO FORMULATE INTO A GFR 149(viii) CHALLENGE:\n"${prompt}"\n\nGenerate the complete JSON object now:`,
          },
        ],
      },
    ],
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.2,
    },
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) {
    throw new Error('Gemini returned an empty response.');
  }

  // Clean markdown backticks if any
  const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
  const parsed = JSON.parse(cleanedText) as GeneratedChallengeDraft;

  // Add IDs to KPIs if missing
  if (parsed.kpis && Array.isArray(parsed.kpis)) {
    parsed.kpis = parsed.kpis.map((kpi, idx) => ({
      ...kpi,
      id: kpi.id || `kpi-gemini-${Date.now()}-${idx + 1}`,
      unit: kpi.unit || '%',
      baseline: Number(kpi.baseline) || 0,
      target: Number(kpi.target) || 90,
      weightage: Number(kpi.weightage) || 50,
    }));
  }

  return {
    ...parsed,
    providerUsed: 'gemini',
    reasoningNote: parsed.reasoningNote || 'Engineered with Google Gemini 1.5 Flash according to GFR Rule 149(viii).',
  };
}

/**
 * Call OpenAI API (gpt-4o-mini)
 */
async function callOpenAI(prompt: string, apiKey: string): Promise<GeneratedChallengeDraft> {
  const url = 'https://api.openai.com/v1/chat/completions';

  const payload = {
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `Formulate a comprehensive GFR 149(viii) innovation procurement challenge for this government requirement:\n\n"${prompt}"` },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.2,
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const rawContent = data?.choices?.[0]?.message?.content;
  if (!rawContent) {
    throw new Error('OpenAI returned an empty completion.');
  }

  const parsed = JSON.parse(rawContent) as GeneratedChallengeDraft;

  if (parsed.kpis && Array.isArray(parsed.kpis)) {
    parsed.kpis = parsed.kpis.map((kpi, idx) => ({
      ...kpi,
      id: kpi.id || `kpi-openai-${Date.now()}-${idx + 1}`,
      unit: kpi.unit || '%',
      baseline: Number(kpi.baseline) || 0,
      target: Number(kpi.target) || 90,
      weightage: Number(kpi.weightage) || 50,
    }));
  }

  return {
    ...parsed,
    providerUsed: 'openai',
    reasoningNote: parsed.reasoningNote || 'Engineered with OpenAI GPT-4o-mini according to GFR Rule 149(viii).',
  };
}

/**
 * Main AI Challenge Formulation entry point
 */
export async function generateChallengeDraftWithAI(params: {
  prompt: string;
  provider?: AIProvider;
  customApiKey?: string;
}): Promise<GeneratedChallengeDraft> {
  const config = getAIConfig();
  const targetProvider = params.provider || config.preferredProvider || 'gemini';
  const trimmedPrompt = params.prompt.trim();

  if (!trimmedPrompt) {
    throw new Error('Please enter a brief problem description or select a government domain preset.');
  }

  // Determine active key
  let apiKey = params.customApiKey?.trim();
  if (!apiKey) {
    if (targetProvider === 'gemini') {
      apiKey = config.geminiApiKey;
    } else if (targetProvider === 'openai') {
      apiKey = config.openaiApiKey;
    }
  }

  // If no external key or if explicitly built-in, use high-fidelity synthesis
  if (targetProvider === 'built-in' || !apiKey) {
    // Add realistic 800ms generation simulation for realistic UI feel
    await new Promise((resolve) => setTimeout(resolve, 800));
    return synthesizeFallbackChallenge(trimmedPrompt);
  }

  try {
    if (targetProvider === 'gemini') {
      return await callGemini(trimmedPrompt, apiKey);
    } else if (targetProvider === 'openai') {
      return await callOpenAI(trimmedPrompt, apiKey);
    }
  } catch (err: unknown) {
    console.warn(`[AI Service] External ${targetProvider} API call failed, falling back to smart built-in engine:`, err);
    // Graceful fallback so demo/hackathon never breaks
    const fallback = synthesizeFallbackChallenge(trimmedPrompt);
    const errorMessage = err instanceof Error ? err.message : String(err);
    fallback.reasoningNote = `Notice: External ${targetProvider.toUpperCase()} call encountered (${errorMessage.slice(0, 70)}...). Formulated seamlessly via Pragati AI GFR Rule 149(viii) Built-in Synthesizer.`;
    return fallback;
  }

  return synthesizeFallbackChallenge(trimmedPrompt);
}

export const PRESET_CHALLENGE_IDEAS = [
  {
    id: 'water',
    title: 'Jal Jeevan Mission: IoT Pipeline Contamination & Acoustic Leakage',
    domain: 'Water & Sanitation',
    prompt: 'Rural drinking water pipeline leak detection and real-time bacterial contamination sensing under Jal Jeevan Mission.',
    icon: '💧',
  },
  {
    id: 'road',
    title: 'NHAI / MoRTH: Mobile Computer Vision Highway Pavement Distress Profiling',
    domain: 'Highways & Transport',
    prompt: 'Automated vehicle-mounted computer vision for continuous pothole and road cracking inventory on National Highways.',
    icon: '🛣️',
  },
  {
    id: 'health',
    title: 'Ayushman Bharat: Offline Edge AI Tele-Diagnostics for Rural PHCs',
    domain: 'Healthcare',
    prompt: 'Offline-capable edge AI diagnostics for diabetic retinopathy and ECG arrhythmia screening at Ayushman Arogya Mandirs.',
    icon: '🏥',
  },
  {
    id: 'energy',
    title: 'Ministry of Power: AI Micro-Grid Load Balancing & Green Energy Telemetry',
    domain: 'Clean Power',
    prompt: 'AI-driven dynamic demand forecasting and solar curtailment reduction for decentralized distribution feeders.',
    icon: '⚡',
  },
  {
    id: 'agriculture',
    title: 'PMFBY: Drone Multispectral Crop Damage Assessment',
    domain: 'Agriculture',
    prompt: 'Drone multispectral imaging and satellite data fusion for rapid 72-hour crop loss assessment under PMFBY.',
    icon: '🌾',
  },
  {
    id: 'waste',
    title: 'Swachh Bharat: Municipal Edge Vision Waste Segregation & Dump Auditing',
    domain: 'Urban Governance',
    prompt: 'Camera-based automated waste segregation audit on collection tippers and illegal dumping detection for Smart Cities.',
    icon: '🏙️',
  },
];
